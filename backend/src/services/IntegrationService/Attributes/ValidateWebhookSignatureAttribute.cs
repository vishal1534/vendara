using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using IntegrationService.Services;
using System.Text;

namespace IntegrationService.Attributes;

/// <summary>
/// Validates the X-Hub-Signature-256 header for WhatsApp webhooks
/// </summary>
public class ValidateWebhookSignatureAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<ValidateWebhookSignatureAttribute>>();
        var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var signatureValidator = context.HttpContext.RequestServices.GetRequiredService<IWebhookSignatureValidator>();

        // Get the app secret from configuration
        var appSecret = configuration["WhatsApp:AppSecret"];
        if (string.IsNullOrEmpty(appSecret))
        {
            logger.LogError("WhatsApp:AppSecret is not configured");
            context.Result = new UnauthorizedObjectResult(new { error = "Server configuration error" });
            return;
        }

        // Get the signature from headers
        if (!context.HttpContext.Request.Headers.TryGetValue("X-Hub-Signature-256", out var signatureHeader))
        {
            logger.LogWarning("Missing X-Hub-Signature-256 header in webhook request");
            context.Result = new UnauthorizedObjectResult(new { error = "Missing signature" });
            return;
        }

        var signature = signatureHeader.ToString();

        // Enable buffering so we can read the body multiple times
        context.HttpContext.Request.EnableBuffering();

        // Read the raw body
        string requestBody;
        using (var reader = new StreamReader(
            context.HttpContext.Request.Body,
            encoding: Encoding.UTF8,
            detectEncodingFromByteOrderMarks: false,
            bufferSize: 1024,
            leaveOpen: true))
        {
            requestBody = await reader.ReadToEndAsync();
            
            // Reset the stream position so the model binder can read it
            context.HttpContext.Request.Body.Position = 0;
        }

        // Validate the signature
        if (!signatureValidator.ValidateSignature(requestBody, signature, appSecret))
        {
            logger.LogWarning("Invalid webhook signature. Signature: {Signature}", signature);
            context.Result = new UnauthorizedObjectResult(new { error = "Invalid signature" });
            return;
        }

        logger.LogInformation("Webhook signature validated successfully");
        
        // Continue to the action
        await next();
    }
}
