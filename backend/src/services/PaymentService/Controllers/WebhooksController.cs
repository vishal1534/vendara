using Microsoft.AspNetCore.Mvc;
using PaymentService.Models.Entities;
using PaymentService.Models.Responses;
using PaymentService.Repositories;
using PaymentService.Services;
using System.Text.Json;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/v1/webhooks")]
public class WebhooksController : ControllerBase
{
    private readonly IWebhookRepository _webhookRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IRazorpayService _razorpayService;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(
        IWebhookRepository webhookRepository,
        IPaymentRepository paymentRepository,
        IRazorpayService razorpayService,
        ILogger<WebhooksController> logger)
    {
        _webhookRepository = webhookRepository;
        _paymentRepository = paymentRepository;
        _razorpayService = razorpayService;
        _logger = logger;
    }

    // POST /api/v1/webhooks/razorpay
    [HttpPost("razorpay")]
    public async Task<IActionResult> HandleRazorpayWebhook()
    {
        try
        {
            using var reader = new StreamReader(Request.Body);
            var payload = await reader.ReadToEndAsync();
            
            var signature = Request.Headers["X-Razorpay-Signature"].ToString();

            if (string.IsNullOrEmpty(signature))
            {
                _logger.LogWarning("Webhook received without signature");
                return Unauthorized();
            }

            // Verify signature
            var isValid = _razorpayService.VerifyWebhookSignature(payload, signature);
            
            if (!isValid)
            {
                _logger.LogWarning("Invalid webhook signature");
                return Unauthorized();
            }

            var webhookData = JsonSerializer.Deserialize<Dictionary<string, object>>(payload);
            var eventType = webhookData?["event"]?.ToString() ?? "unknown";

            // Store webhook
            var webhook = new PaymentWebhook
            {
                EventType = eventType,
                Payload = payload,
                Signature = signature,
                IsVerified = true,
                IsProcessed = false,
                IpAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString()
            };

            await _webhookRepository.CreateAsync(webhook);

            // Process webhook based on event type
            await ProcessWebhookAsync(webhook, webhookData);

            _logger.LogInformation("Webhook processed: {EventType}", eventType);

            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing webhook");
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }

    // GET /api/v1/webhooks (Admin)
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<object>>>> GetWebhooks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var webhooks = await _webhookRepository.GetAllAsync(page, pageSize);
            var totalCount = await _webhookRepository.GetTotalCountAsync();

            var items = webhooks.Select(w => new
            {
                w.Id,
                w.EventType,
                w.IsVerified,
                w.IsProcessed,
                w.CreatedAt,
                w.ProcessedAt,
                w.ProcessingError
            }).ToList();

            var response = new PaginatedResponse<object>
            {
                Items = items.Cast<object>().ToList(),
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

            return Ok(ApiResponse<PaginatedResponse<object>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting webhooks");
            return StatusCode(500, ApiResponse<PaginatedResponse<object>>.ErrorResponse(
                "WEBHOOKS_FETCH_FAILED",
                "Failed to fetch webhooks",
                ex.Message
            ));
        }
    }

    private async Task ProcessWebhookAsync(PaymentWebhook webhook, Dictionary<string, object>? data)
    {
        try
        {
            if (data == null) return;

            var eventType = webhook.EventType;

            if (eventType.StartsWith("payment."))
            {
                var paymentData = data["payload"]?.ToString();
                if (string.IsNullOrEmpty(paymentData)) return;

                var payment = JsonSerializer.Deserialize<Dictionary<string, object>>(paymentData);
                var paymentId = payment?["payment"]?.ToString();

                if (!string.IsNullOrEmpty(paymentId))
                {
                    var existingPayment = await _paymentRepository.GetByRazorpayOrderIdAsync(paymentId);
                    
                    if (existingPayment != null)
                    {
                        webhook.PaymentId = existingPayment.Id;

                        if (eventType == "payment.captured")
                        {
                            existingPayment.PaymentStatus = "success";
                            existingPayment.CompletedAt = DateTime.UtcNow;
                            await _paymentRepository.UpdateAsync(existingPayment);
                        }
                        else if (eventType == "payment.failed")
                        {
                            existingPayment.PaymentStatus = "failed";
                            existingPayment.FailedAt = DateTime.UtcNow;
                            await _paymentRepository.UpdateAsync(existingPayment);
                        }
                    }
                }
            }

            webhook.IsProcessed = true;
            webhook.ProcessedAt = DateTime.UtcNow;
            await _webhookRepository.UpdateAsync(webhook);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing webhook: {WebhookId}", webhook.Id);
            webhook.ProcessingError = ex.Message;
            await _webhookRepository.UpdateAsync(webhook);
        }
    }
}
