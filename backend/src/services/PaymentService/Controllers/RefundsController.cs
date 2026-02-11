using Microsoft.AspNetCore.Mvc;
using PaymentService.Models.Entities;
using PaymentService.Models.Requests;
using PaymentService.Models.Responses;
using PaymentService.Repositories;
using PaymentService.Services;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/v1/refunds")]
public class RefundsController : ControllerBase
{
    private readonly IRefundRepository _refundRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IRazorpayService _razorpayService;
    private readonly ILogger<RefundsController> _logger;

    public RefundsController(
        IRefundRepository refundRepository,
        IPaymentRepository paymentRepository,
        IRazorpayService razorpayService,
        ILogger<RefundsController> logger)
    {
        _refundRepository = refundRepository;
        _paymentRepository = paymentRepository;
        _razorpayService = razorpayService;
        _logger = logger;
    }

    // POST /api/v1/refunds
    [HttpPost]
    public async Task<ActionResult<ApiResponse<RefundResponse>>> CreateRefund([FromBody] CreateRefundRequest request)
    {
        try
        {
            var payment = await _paymentRepository.GetByIdAsync(request.PaymentId);
            
            if (payment == null)
            {
                return NotFound(ApiResponse<RefundResponse>.ErrorResponse(
                    "PAYMENT_NOT_FOUND",
                    $"Payment with ID '{request.PaymentId}' not found"
                ));
            }

            if (payment.PaymentStatus != "success")
            {
                return BadRequest(ApiResponse<RefundResponse>.ErrorResponse(
                    "INVALID_PAYMENT_STATUS",
                    "Only successful payments can be refunded"
                ));
            }

            var refundAmount = request.Amount ?? payment.Amount;

            if (refundAmount > payment.Amount)
            {
                return BadRequest(ApiResponse<RefundResponse>.ErrorResponse(
                    "INVALID_REFUND_AMOUNT",
                    "Refund amount cannot exceed payment amount"
                ));
            }

            var refund = new PaymentRefund
            {
                PaymentId = request.PaymentId,
                Amount = refundAmount,
                Currency = payment.Currency,
                RefundReason = request.RefundReason,
                RefundStatus = "pending",
                Notes = request.Notes
            };

            // Initiate refund via Razorpay if online payment
            if (payment.PaymentMethod == "online" && !string.IsNullOrEmpty(payment.RazorpayPaymentId))
            {
                var razorpayRefund = await _razorpayService.CreateRefundAsync(
                    payment.RazorpayPaymentId,
                    refundAmount,
                    new Dictionary<string, object> { { "reason", request.RefundReason } }
                );

                refund.RazorpayRefundId = razorpayRefund["id"].ToString();
                refund.RefundStatus = "processing";
            }

            await _refundRepository.CreateAsync(refund);

            _logger.LogInformation("Refund created: {RefundId} for payment: {PaymentId}", refund.Id, request.PaymentId);

            var response = MapToResponse(refund);
            return Ok(ApiResponse<RefundResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating refund for payment: {PaymentId}", request.PaymentId);
            return StatusCode(500, ApiResponse<RefundResponse>.ErrorResponse(
                "REFUND_CREATION_FAILED",
                "Failed to create refund",
                ex.Message
            ));
        }
    }

    // GET /api/v1/refunds/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<RefundResponse>>> GetRefund(Guid id)
    {
        try
        {
            var refund = await _refundRepository.GetByIdAsync(id);
            
            if (refund == null)
            {
                return NotFound(ApiResponse<RefundResponse>.ErrorResponse(
                    "REFUND_NOT_FOUND",
                    $"Refund with ID '{id}' not found"
                ));
            }

            var response = MapToResponse(refund);
            return Ok(ApiResponse<RefundResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting refund: {RefundId}", id);
            return StatusCode(500, ApiResponse<RefundResponse>.ErrorResponse(
                "REFUND_FETCH_FAILED",
                "Failed to fetch refund",
                ex.Message
            ));
        }
    }

    // GET /api/v1/refunds/payment/{paymentId}
    [HttpGet("payment/{paymentId}")]
    public async Task<ActionResult<ApiResponse<List<RefundResponse>>>> GetRefundsByPaymentId(Guid paymentId)
    {
        try
        {
            var refunds = await _refundRepository.GetByPaymentIdAsync(paymentId);
            var response = refunds.Select(MapToResponse).ToList();
            return Ok(ApiResponse<List<RefundResponse>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting refunds for payment: {PaymentId}", paymentId);
            return StatusCode(500, ApiResponse<List<RefundResponse>>.ErrorResponse(
                "REFUNDS_FETCH_FAILED",
                "Failed to fetch refunds",
                ex.Message
            ));
        }
    }

    // GET /api/v1/refunds (Admin)
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<RefundResponse>>>> GetAllRefunds(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        try
        {
            var refunds = await _refundRepository.GetAllAsync(page, pageSize, status);
            var totalCount = await _refundRepository.GetTotalCountAsync(status);

            var response = new PaginatedResponse<RefundResponse>
            {
                Items = refunds.Select(MapToResponse).ToList(),
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

            return Ok(ApiResponse<PaginatedResponse<RefundResponse>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all refunds");
            return StatusCode(500, ApiResponse<PaginatedResponse<RefundResponse>>.ErrorResponse(
                "REFUNDS_FETCH_FAILED",
                "Failed to fetch refunds",
                ex.Message
            ));
        }
    }

    // PATCH /api/v1/refunds/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<RefundResponse>>> UpdateRefundStatus(
        Guid id,
        [FromBody] UpdatePaymentStatusRequest request)
    {
        try
        {
            var refund = await _refundRepository.GetByIdAsync(id);
            
            if (refund == null)
            {
                return NotFound(ApiResponse<RefundResponse>.ErrorResponse(
                    "REFUND_NOT_FOUND",
                    $"Refund with ID '{id}' not found"
                ));
            }

            refund.RefundStatus = request.PaymentStatus;
            refund.RefundErrorCode = request.PaymentErrorCode;
            refund.RefundErrorMessage = request.PaymentErrorMessage;

            if (request.PaymentStatus == "completed")
            {
                refund.CompletedAt = DateTime.UtcNow;
            }

            await _refundRepository.UpdateAsync(refund);

            _logger.LogInformation("Refund status updated: {RefundId} -> {Status}", id, request.PaymentStatus);

            var response = MapToResponse(refund);
            return Ok(ApiResponse<RefundResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating refund status: {RefundId}", id);
            return StatusCode(500, ApiResponse<RefundResponse>.ErrorResponse(
                "REFUND_UPDATE_FAILED",
                "Failed to update refund status",
                ex.Message
            ));
        }
    }

    private RefundResponse MapToResponse(PaymentRefund refund)
    {
        return new RefundResponse
        {
            Id = refund.Id,
            PaymentId = refund.PaymentId,
            Amount = refund.Amount,
            Currency = refund.Currency,
            RefundReason = refund.RefundReason,
            RefundStatus = refund.RefundStatus,
            RazorpayRefundId = refund.RazorpayRefundId,
            RefundErrorCode = refund.RefundErrorCode,
            RefundErrorMessage = refund.RefundErrorMessage,
            InitiatedBy = refund.InitiatedBy,
            Notes = refund.Notes,
            CreatedAt = refund.CreatedAt,
            UpdatedAt = refund.UpdatedAt,
            CompletedAt = refund.CompletedAt
        };
    }
}
