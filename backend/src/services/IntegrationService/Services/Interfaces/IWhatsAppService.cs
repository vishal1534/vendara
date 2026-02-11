using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;

namespace IntegrationService.Services.Interfaces;

public interface IWhatsAppService
{
    Task<SendWhatsAppMessageResponse> SendTextMessageAsync(SendWhatsAppTextRequest request);
    Task<SendWhatsAppMessageResponse> SendTemplateMessageAsync(SendWhatsAppTemplateRequest request);
    Task<SendWhatsAppMessageResponse> SendMediaMessageAsync(SendWhatsAppMediaRequest request);
    Task ProcessWebhookAsync(WhatsAppWebhookPayload payload);
    Task<WhatsAppMessageHistoryResponse> GetMessageHistoryByPhoneAsync(string phoneNumber, int page = 1, int pageSize = 50);
    Task<WhatsAppMessageHistoryResponse> GetMessageHistoryByUserAsync(string userId, int page = 1, int pageSize = 50);
}
