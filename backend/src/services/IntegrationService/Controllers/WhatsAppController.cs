using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;
using IntegrationService.Services.Interfaces;
using IntegrationService.Attributes;

namespace IntegrationService.Controllers;

[ApiController]
[Route("api/v1/whatsapp")]
public class WhatsAppController : ControllerBase
{
    private readonly IWhatsAppService _whatsAppService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WhatsAppController> _logger;

    public WhatsAppController(
        IWhatsAppService whatsAppService,
        IConfiguration configuration,
        ILogger<WhatsAppController> logger)
    {
        _whatsAppService = whatsAppService;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Webhook endpoint for WhatsApp messages (GET for verification)
    /// </summary>
    [HttpGet("webhook")]
    [AllowAnonymous]
    public IActionResult VerifyWebhook([FromQuery(Name = "hub.mode")] string mode,
                                       [FromQuery(Name = "hub.challenge")] string challenge,
                                       [FromQuery(Name = "hub.verify_token")] string verifyToken)
    {
        try
        {
            var configuredVerifyToken = _configuration["WhatsApp:VerifyToken"];

            if (mode == "subscribe" && verifyToken == configuredVerifyToken)
            {
                _logger.LogInformation("WhatsApp webhook verified successfully");
                return Ok(challenge);
            }

            _logger.LogWarning("WhatsApp webhook verification failed");
            return Unauthorized();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying WhatsApp webhook");
            return StatusCode(500);
        }
    }

    /// <summary>
    /// Webhook endpoint for receiving WhatsApp messages (POST)
    /// Signature validation is performed by ValidateWebhookSignature attribute
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    [ValidateWebhookSignature]
    public async Task<IActionResult> ReceiveWebhook([FromBody] WhatsAppWebhookPayload payload)
    {
        try
        {
            // Process webhook asynchronously
            _ = Task.Run(async () =>
            {
                try
                {
                    await _whatsAppService.ProcessWebhookAsync(payload);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing WhatsApp webhook in background");
                }
            });

            // Return 200 immediately to WhatsApp
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error receiving WhatsApp webhook");
            return StatusCode(500);
        }
    }

    /// <summary>
    /// Send a text message via WhatsApp
    /// </summary>
    [HttpPost("send/text")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<SendWhatsAppMessageResponse>>> SendTextMessage(
        [FromBody] SendWhatsAppTextRequest request)
    {
        try
        {
            var result = await _whatsAppService.SendTextMessageAsync(request);
            return Ok(ApiResponse<SendWhatsAppMessageResponse>.SuccessResponse(result, "Message sent successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp text message");
            return StatusCode(500, ApiResponse<SendWhatsAppMessageResponse>.ErrorResponse("Failed to send message"));
        }
    }

    /// <summary>
    /// Send a template message via WhatsApp
    /// </summary>
    [HttpPost("send/template")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<SendWhatsAppMessageResponse>>> SendTemplateMessage(
        [FromBody] SendWhatsAppTemplateRequest request)
    {
        try
        {
            var result = await _whatsAppService.SendTemplateMessageAsync(request);
            return Ok(ApiResponse<SendWhatsAppMessageResponse>.SuccessResponse(result, "Template message sent successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp template message");
            return StatusCode(500, ApiResponse<SendWhatsAppMessageResponse>.ErrorResponse("Failed to send template"));
        }
    }

    /// <summary>
    /// Send a media message (image, document, etc.) via WhatsApp
    /// </summary>
    [HttpPost("send/media")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<SendWhatsAppMessageResponse>>> SendMediaMessage(
        [FromBody] SendWhatsAppMediaRequest request)
    {
        try
        {
            var result = await _whatsAppService.SendMediaMessageAsync(request);
            return Ok(ApiResponse<SendWhatsAppMessageResponse>.SuccessResponse(result, "Media message sent successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp media message");
            return StatusCode(500, ApiResponse<SendWhatsAppMessageResponse>.ErrorResponse("Failed to send media"));
        }
    }

    /// <summary>
    /// Get message history by phone number
    /// </summary>
    [HttpGet("history/phone/{phoneNumber}")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<WhatsAppMessageHistoryResponse>>> GetHistoryByPhone(
        string phoneNumber,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var result = await _whatsAppService.GetMessageHistoryByPhoneAsync(phoneNumber, page, pageSize);
            return Ok(ApiResponse<WhatsAppMessageHistoryResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching message history by phone");
            return StatusCode(500, ApiResponse<WhatsAppMessageHistoryResponse>.ErrorResponse("Failed to fetch history"));
        }
    }

    /// <summary>
    /// Get message history by user ID
    /// </summary>
    [HttpGet("history/user/{userId}")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<WhatsAppMessageHistoryResponse>>> GetHistoryByUser(
        string userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var result = await _whatsAppService.GetMessageHistoryByUserAsync(userId, page, pageSize);
            return Ok(ApiResponse<WhatsAppMessageHistoryResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching message history by user");
            return StatusCode(500, ApiResponse<WhatsAppMessageHistoryResponse>.ErrorResponse("Failed to fetch history"));
        }
    }
}