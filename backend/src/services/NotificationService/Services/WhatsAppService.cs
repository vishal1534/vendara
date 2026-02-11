using System.Text;
using System.Text.Json;
using NotificationService.Services.Interfaces;

namespace NotificationService.Services;

public class WhatsAppService : IWhatsAppService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<WhatsAppService> _logger;
    private readonly string _phoneNumberId;
    private readonly string _accessToken;

    public WhatsAppService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<WhatsAppService> logger)
    {
        _httpClient = httpClientFactory.CreateClient("WhatsApp");
        _logger = logger;
        _phoneNumberId = configuration["WhatsApp:PhoneNumberId"] ?? "";
        _accessToken = configuration["WhatsApp:AccessToken"] ?? "";
        
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_accessToken}");
    }

    public async Task<(bool Success, string? MessageId, string? Error)> SendTemplateMessageAsync(
        string phoneNumber,
        string templateName,
        string language,
        Dictionary<string, string>? parameters = null)
    {
        try
        {
            // Format phone number (remove + and spaces)
            var formattedPhone = phoneNumber.Replace("+", "").Replace(" ", "").Replace("-", "");
            
            // Build template parameters
            var components = new List<object>();
            if (parameters != null && parameters.Any())
            {
                var parametersList = parameters.Select(p => new { type = "text", text = p.Value }).ToList();
                components.Add(new
                {
                    type = "body",
                    parameters = parametersList
                });
            }

            var payload = new
            {
                messaging_product = "whatsapp",
                to = formattedPhone,
                type = "template",
                template = new
                {
                    name = templateName,
                    language = new { code = language },
                    components
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"https://graph.facebook.com/v17.0/{_phoneNumberId}/messages";
            var response = await _httpClient.PostAsync(url, content);

            if (response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(responseBody);
                var messageId = result.GetProperty("messages")[0].GetProperty("id").GetString();
                
                _logger.LogInformation("WhatsApp message sent to {Phone}. MessageId: {MessageId}", 
                    phoneNumber, messageId);
                
                return (true, messageId, null);
            }
            else
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("WhatsApp API error: {Error}", errorBody);
                return (false, null, errorBody);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send WhatsApp message to {Phone}", phoneNumber);
            return (false, null, ex.Message);
        }
    }
}
