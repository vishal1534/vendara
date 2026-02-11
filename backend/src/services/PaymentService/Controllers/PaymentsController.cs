using Microsoft.AspNetCore.Mvc;
using PaymentService.Models.Entities;
using PaymentService.Models.Requests;
using PaymentService.Models.Responses;
using PaymentService.Repositories;
using PaymentService.Services;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/v1/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IRazorpayService _razorpayService;
    private readonly ICachingService _cachingService;
    private readonly IOrderService _orderService;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(
        IPaymentRepository paymentRepository,
        IRazorpayService razorpayService,
        ICachingService cachingService,
        IOrderService orderService,
        ILogger<PaymentsController> logger)
    {
        _paymentRepository = paymentRepository;
        _razorpayService = razorpayService;
        _cachingService = cachingService;
        _orderService = orderService;
        _logger = logger;
    }

    // POST /api/v1/payments/create
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<object>>> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        try
        {
            // Validate order before creating payment
            var isValidOrder = await _orderService.ValidateOrderForPaymentAsync(request.OrderId, request.Amount);
            if (!isValidOrder)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(
                    "INVALID_ORDER",
                    "Order cannot be paid (already paid, cancelled, or amount mismatch)"
                ));
            }

            // Create payment record
            var payment = new Payment
            {
                OrderId = request.OrderId,
                BuyerId = request.BuyerId,
                VendorId = request.VendorId,
                Amount = request.Amount,
                Currency = request.Currency,
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = "pending",
                Metadata = request.Metadata,
                Notes = request.Notes
            };

            if (request.PaymentMethod.ToLower() == "online")
            {
                // Create Razorpay order
                var razorpayOrder = await _razorpayService.CreateOrderAsync(
                    request.Amount,
                    request.Currency,
                    payment.Id.ToString(),
                    new Dictionary<string, object>
                    {
                        { "order_id", request.OrderId.ToString() },
                        { "buyer_id", request.BuyerId.ToString() }
                    }
                );

                payment.RazorpayOrderId = razorpayOrder["id"].ToString();
                payment.PaymentGateway = "razorpay";
            }

            await _paymentRepository.CreateAsync(payment);

            _logger.LogInformation("Payment created: {PaymentId} for order: {OrderId}", payment.Id, request.OrderId);

            var response = new
            {
                payment.Id,
                payment.OrderId,
                payment.Amount,
                payment.Currency,
                payment.PaymentMethod,
                payment.PaymentStatus,
                payment.RazorpayOrderId,
                payment.CreatedAt
            };

            return Ok(ApiResponse<object>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment for order: {OrderId}", request.OrderId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "PAYMENT_CREATION_FAILED",
                "Failed to create payment",
                ex.Message
            ));
        }
    }

    // POST /api/v1/payments/cod/create
    [HttpPost("cod/create")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> CreateCODPayment([FromBody] CreatePaymentRequest request)
    {
        try
        {
            var payment = new Payment
            {
                OrderId = request.OrderId,
                BuyerId = request.BuyerId,
                VendorId = request.VendorId,
                Amount = request.Amount,
                Currency = request.Currency,
                PaymentMethod = "cod",
                PaymentStatus = "pending",
                Metadata = request.Metadata,
                Notes = request.Notes
            };

            await _paymentRepository.CreateAsync(payment);

            _logger.LogInformation("COD payment created: {PaymentId} for order: {OrderId}", payment.Id, request.OrderId);

            var response = MapToResponse(payment);
            return Ok(ApiResponse<PaymentResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating COD payment for order: {OrderId}", request.OrderId);
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse(
                "COD_PAYMENT_CREATION_FAILED",
                "Failed to create COD payment",
                ex.Message
            ));
        }
    }

    // POST /api/v1/payments/verify
    [HttpPost("verify")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        try
        {
            // Get payment by Razorpay order ID
            var payment = await _paymentRepository.GetByRazorpayOrderIdAsync(request.RazorpayOrderId);
            
            if (payment == null)
            {
                return NotFound(ApiResponse<PaymentResponse>.ErrorResponse(
                    "PAYMENT_NOT_FOUND",
                    $"Payment not found for Razorpay order ID: {request.RazorpayOrderId}"
                ));
            }

            // Verify signature
            var isValid = _razorpayService.VerifyPaymentSignature(
                request.RazorpayOrderId,
                request.RazorpayPaymentId,
                request.RazorpaySignature
            );

            if (!isValid)
            {
                payment.PaymentStatus = "failed";
                payment.PaymentErrorCode = "INVALID_SIGNATURE";
                payment.PaymentErrorMessage = "Payment signature verification failed";
                payment.FailedAt = DateTime.UtcNow;
                await _paymentRepository.UpdateAsync(payment);

                _logger.LogWarning("Invalid payment signature for payment: {PaymentId}", payment.Id);

                return BadRequest(ApiResponse<PaymentResponse>.ErrorResponse(
                    "INVALID_SIGNATURE",
                    "Payment signature verification failed"
                ));
            }

            // Update payment
            payment.RazorpayPaymentId = request.RazorpayPaymentId;
            payment.RazorpaySignature = request.RazorpaySignature;
            payment.PaymentStatus = "success";
            payment.CompletedAt = DateTime.UtcNow;
            await _paymentRepository.UpdateAsync(payment);

            // Notify Order Service that payment is complete
            var orderUpdated = await _orderService.MarkOrderAsPaidAsync(payment.OrderId, payment.Id);
            if (!orderUpdated)
            {
                _logger.LogWarning("Failed to update order status for order {OrderId} after payment success", payment.OrderId);
            }

            // Clear cache
            await _cachingService.RemoveAsync($"payment:{payment.Id}");
            await _cachingService.RemoveAsync($"payment:order:{payment.OrderId}");

            _logger.LogInformation("Payment verified successfully: {PaymentId}", payment.Id);

            var response = MapToResponse(payment);
            return Ok(ApiResponse<PaymentResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying payment");
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse(
                "PAYMENT_VERIFICATION_FAILED",
                "Failed to verify payment",
                ex.Message
            ));
        }
    }

    // GET /api/v1/payments/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> GetPayment(Guid id)
    {
        try
        {
            // Check cache
            var cached = await _cachingService.GetAsync<PaymentResponse>($"payment:{id}");
            if (cached != null)
            {
                return Ok(ApiResponse<PaymentResponse>.SuccessResponse(cached));
            }

            var payment = await _paymentRepository.GetByIdAsync(id);
            
            if (payment == null)
            {
                return NotFound(ApiResponse<PaymentResponse>.ErrorResponse(
                    "PAYMENT_NOT_FOUND",
                    $"Payment with ID '{id}' not found"
                ));
            }

            var response = MapToResponse(payment);
            
            // Cache for 1 minute
            await _cachingService.SetAsync($"payment:{id}", response, TimeSpan.FromMinutes(1));

            return Ok(ApiResponse<PaymentResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment: {PaymentId}", id);
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse(
                "PAYMENT_FETCH_FAILED",
                "Failed to fetch payment",
                ex.Message
            ));
        }
    }

    // GET /api/v1/payments/order/{orderId}
    [HttpGet("order/{orderId}")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> GetPaymentByOrderId(Guid orderId)
    {
        try
        {
            // Check cache
            var cached = await _cachingService.GetAsync<PaymentResponse>($"payment:order:{orderId}");
            if (cached != null)
            {
                return Ok(ApiResponse<PaymentResponse>.SuccessResponse(cached));
            }

            var payment = await _paymentRepository.GetByOrderIdAsync(orderId);
            
            if (payment == null)
            {
                return NotFound(ApiResponse<PaymentResponse>.ErrorResponse(
                    "PAYMENT_NOT_FOUND",
                    $"Payment not found for order ID: {orderId}"
                ));
            }

            var response = MapToResponse(payment);
            
            // Cache for 1 minute
            await _cachingService.SetAsync($"payment:order:{orderId}", response, TimeSpan.FromMinutes(1));

            return Ok(ApiResponse<PaymentResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment for order: {OrderId}", orderId);
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse(
                "PAYMENT_FETCH_FAILED",
                "Failed to fetch payment",
                ex.Message
            ));
        }
    }

    // GET /api/v1/payments/buyer/{buyerId}
    [HttpGet("buyer/{buyerId}")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<PaymentResponse>>>> GetBuyerPayments(
        Guid buyerId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var payments = await _paymentRepository.GetByBuyerIdAsync(buyerId, page, pageSize);
            var totalCount = await _paymentRepository.GetBuyerPaymentCountAsync(buyerId);

            var response = new PaginatedResponse<PaymentResponse>
            {
                Items = payments.Select(MapToResponse).ToList(),
                Pagination = new PaginationMetadata
                {
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    HasNextPage = page * pageSize < totalCount,
                    HasPreviousPage = page > 1
                }
            };

            return Ok(ApiResponse<PaginatedResponse<PaymentResponse>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting buyer payments: {BuyerId}", buyerId);
            return StatusCode(500, ApiResponse<PaginatedResponse<PaymentResponse>>.ErrorResponse(
                "BUYER_PAYMENTS_FETCH_FAILED",
                "Failed to fetch buyer payments",
                ex.Message
            ));
        }
    }

    // GET /api/v1/payments/vendor/{vendorId}
    [HttpGet("vendor/{vendorId}")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<PaymentResponse>>>> GetVendorPayments(
        Guid vendorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var payments = await _paymentRepository.GetByVendorIdAsync(vendorId, page, pageSize);
            var totalCount = await _paymentRepository.GetVendorPaymentCountAsync(vendorId);

            var response = new PaginatedResponse<PaymentResponse>
            {
                Items = payments.Select(MapToResponse).ToList(),
                Pagination = new PaginationMetadata
                {
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    HasNextPage = page * pageSize < totalCount,
                    HasPreviousPage = page > 1
                }
            };

            return Ok(ApiResponse<PaginatedResponse<PaymentResponse>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vendor payments: {VendorId}", vendorId);
            return StatusCode(500, ApiResponse<PaginatedResponse<PaymentResponse>>.ErrorResponse(
                "VENDOR_PAYMENTS_FETCH_FAILED",
                "Failed to fetch vendor payments",
                ex.Message
            ));
        }
    }

    // GET /api/v1/payments (Admin)
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<PaymentResponse>>>> GetAllPayments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        try
        {
            var payments = await _paymentRepository.GetAllAsync(page, pageSize, status);
            var totalCount = await _paymentRepository.GetTotalCountAsync(status);

            var response = new PaginatedResponse<PaymentResponse>
            {
                Items = payments.Select(MapToResponse).ToList(),
                Pagination = new PaginationMetadata
                {
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    HasNextPage = page * pageSize < totalCount,
                    HasPreviousPage = page > 1
                }
            };

            return Ok(ApiResponse<PaginatedResponse<PaymentResponse>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all payments");
            return StatusCode(500, ApiResponse<PaginatedResponse<PaymentResponse>>.ErrorResponse(
                "PAYMENTS_FETCH_FAILED",
                "Failed to fetch payments",
                ex.Message
            ));
        }
    }

    // PATCH /api/v1/payments/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> UpdatePaymentStatus(
        Guid id,
        [FromBody] UpdatePaymentStatusRequest request)
    {
        try
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            
            if (payment == null)
            {
                return NotFound(ApiResponse<PaymentResponse>.ErrorResponse(
                    "PAYMENT_NOT_FOUND",
                    $"Payment with ID '{id}' not found"
                ));
            }

            payment.PaymentStatus = request.PaymentStatus;
            payment.PaymentErrorCode = request.PaymentErrorCode;
            payment.PaymentErrorMessage = request.PaymentErrorMessage;
            payment.Notes = request.Notes ?? payment.Notes;

            if (request.PaymentStatus == "success")
            {
                payment.CompletedAt = DateTime.UtcNow;
            }
            else if (request.PaymentStatus == "failed")
            {
                payment.FailedAt = DateTime.UtcNow;
            }

            await _paymentRepository.UpdateAsync(payment);

            // Clear cache
            await _cachingService.RemoveAsync($"payment:{id}");
            await _cachingService.RemoveAsync($"payment:order:{payment.OrderId}");

            _logger.LogInformation("Payment status updated: {PaymentId} -> {Status}", id, request.PaymentStatus);

            var response = MapToResponse(payment);
            return Ok(ApiResponse<PaymentResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payment status: {PaymentId}", id);
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse(
                "PAYMENT_UPDATE_FAILED",
                "Failed to update payment status",
                ex.Message
            ));
        }
    }

    // PATCH /api/v1/payments/{id}/capture
    [HttpPatch("{id}/capture")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> CapturePayment(Guid id)
    {
        try
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            
            if (payment == null)
            {
                return NotFound(ApiResponse<PaymentResponse>.ErrorResponse(
                    "PAYMENT_NOT_FOUND",
                    $"Payment with ID '{id}' not found"
                ));
            }

            if (string.IsNullOrEmpty(payment.RazorpayPaymentId))
            {
                return BadRequest(ApiResponse<PaymentResponse>.ErrorResponse(
                    "INVALID_PAYMENT",
                    "Payment cannot be captured (missing Razorpay payment ID)"
                ));
            }

            // Capture payment via Razorpay
            var capturedPayment = await _razorpayService.CapturePaymentAsync(
                payment.RazorpayPaymentId,
                payment.Amount,
                payment.Currency
            );

            payment.PaymentStatus = "success";
            payment.CompletedAt = DateTime.UtcNow;
            await _paymentRepository.UpdateAsync(payment);

            // Clear cache
            await _cachingService.RemoveAsync($"payment:{id}");

            _logger.LogInformation("Payment captured: {PaymentId}", id);

            var response = MapToResponse(payment);
            return Ok(ApiResponse<PaymentResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error capturing payment: {PaymentId}", id);
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse(
                "PAYMENT_CAPTURE_FAILED",
                "Failed to capture payment",
                ex.Message
            ));
        }
    }

    private PaymentResponse MapToResponse(Payment payment)
    {
        return new PaymentResponse
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            BuyerId = payment.BuyerId,
            VendorId = payment.VendorId,
            Amount = payment.Amount,
            Currency = payment.Currency,
            PaymentMethod = payment.PaymentMethod,
            PaymentStatus = payment.PaymentStatus,
            RazorpayOrderId = payment.RazorpayOrderId,
            RazorpayPaymentId = payment.RazorpayPaymentId,
            PaymentGateway = payment.PaymentGateway,
            TransactionId = payment.TransactionId,
            PaymentErrorCode = payment.PaymentErrorCode,
            PaymentErrorMessage = payment.PaymentErrorMessage,
            Metadata = payment.Metadata,
            Notes = payment.Notes,
            CreatedAt = payment.CreatedAt,
            UpdatedAt = payment.UpdatedAt,
            CompletedAt = payment.CompletedAt,
            FailedAt = payment.FailedAt
        };
    }
}