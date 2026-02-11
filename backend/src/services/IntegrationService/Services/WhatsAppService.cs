using System.Text;
using System.Text.Json;
using IntegrationService.Models.Entities;
using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;
using IntegrationService.Repositories.Interfaces;
using IntegrationService.Services.Interfaces;

namespace IntegrationService.Services;

public class WhatsAppService : IWhatsAppService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IWhatsAppMessageRepository _messageRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WhatsAppService> _logger;

    private readonly string _phoneNumberId;
    private readonly string _accessToken;

    public WhatsAppService(
        IHttpClientFactory httpClientFactory,
        IWhatsAppMessageRepository messageRepository,
        IConfiguration configuration,
        ILogger<WhatsAppService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _messageRepository = messageRepository;
        _configuration = configuration;
        _logger = logger;

        _phoneNumberId = configuration["WhatsApp:PhoneNumberId"] ?? throw new InvalidOperationException("WhatsApp PhoneNumberId not configured");
        _accessToken = configuration["WhatsApp:AccessToken"] ?? throw new InvalidOperationException("WhatsApp AccessToken not configured");
    }

    public async Task<SendWhatsAppMessageResponse> SendTextMessageAsync(SendWhatsAppTextRequest request)
    {
        try
        {
            // Create database record
            var message = new WhatsAppMessage
            {
                Direction = "outbound",
                MessageType = "text",
                PhoneNumber = request.PhoneNumber,
                UserId = request.UserId,
                UserType = request.UserType,
                Content = request.Message,
                Context = request.Context,
                RelatedEntityId = request.RelatedEntityId,
                RelatedEntityType = request.RelatedEntityType,
                Status = "pending"
            };

            await _messageRepository.CreateAsync(message);

            // Send via WhatsApp API
            var client = _httpClientFactory.CreateClient("WhatsApp");
            
            var payload = new
            {
                messaging_product = "whatsapp",
                to = request.PhoneNumber,
                type = "text",
                text = new { body = request.Message }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_accessToken}");

            var response = await client.PostAsync($"{_phoneNumberId}/messages", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var result = JsonSerializer.Deserialize<WhatsAppApiResponse>(responseBody);
                
                message.WhatsAppMessageId = result?.Messages?.FirstOrDefault()?.Id;
                message.Status = "sent";
                await _messageRepository.UpdateAsync(message);

                _logger.LogInformation("WhatsApp text message sent successfully to {PhoneNumber}", request.PhoneNumber);

                return new SendWhatsAppMessageResponse
                {
                    MessageId = message.Id,
                    WhatsAppMessageId = message.WhatsAppMessageId,
                    PhoneNumber = request.PhoneNumber,
                    Status = "sent",
                    SentAt = message.CreatedAt
                };
            }
            else
            {
                _logger.LogError("Failed to send WhatsApp message: {ResponseBody}", responseBody);
                
                message.Status = "failed";
                message.ErrorMessage = $"API error: {response.StatusCode}";
                await _messageRepository.UpdateAsync(message);

                return new SendWhatsAppMessageResponse
                {
                    MessageId = message.Id,
                    PhoneNumber = request.PhoneNumber,
                    Status = "failed",
                    ErrorMessage = message.ErrorMessage,
                    SentAt = message.CreatedAt
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp text message to {PhoneNumber}", request.PhoneNumber);
            throw;
        }
    }

    public async Task<SendWhatsAppMessageResponse> SendTemplateMessageAsync(SendWhatsAppTemplateRequest request)
    {
        try
        {
            var message = new WhatsAppMessage
            {
                Direction = "outbound",
                MessageType = "template",
                PhoneNumber = request.PhoneNumber,
                UserId = request.UserId,
                UserType = request.UserType,
                Content = $"Template: {request.TemplateName}",
                Context = request.Context,
                RelatedEntityId = request.RelatedEntityId,
                RelatedEntityType = request.RelatedEntityType,
                Status = "pending"
            };

            await _messageRepository.CreateAsync(message);

            var client = _httpClientFactory.CreateClient("WhatsApp");

            // Build template components
            var components = new List<object>();
            if (request.Parameters != null && request.Parameters.Any())
            {
                var parameters = request.Parameters.Select(p => new { type = "text", text = p }).ToList();
                components.Add(new { type = "body", parameters });
            }

            var payload = new
            {
                messaging_product = "whatsapp",
                to = request.PhoneNumber,
                type = "template",
                template = new
                {
                    name = request.TemplateName,
                    language = new { code = request.LanguageCode },
                    components
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_accessToken}");

            var response = await client.PostAsync($"{_phoneNumberId}/messages", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var result = JsonSerializer.Deserialize<WhatsAppApiResponse>(responseBody);
                
                message.WhatsAppMessageId = result?.Messages?.FirstOrDefault()?.Id;
                message.Status = "sent";
                await _messageRepository.UpdateAsync(message);

                _logger.LogInformation("WhatsApp template message sent successfully to {PhoneNumber}", request.PhoneNumber);

                return new SendWhatsAppMessageResponse
                {
                    MessageId = message.Id,
                    WhatsAppMessageId = message.WhatsAppMessageId,
                    PhoneNumber = request.PhoneNumber,
                    Status = "sent",
                    SentAt = message.CreatedAt
                };
            }
            else
            {
                _logger.LogError("Failed to send WhatsApp template: {ResponseBody}", responseBody);
                
                message.Status = "failed";
                message.ErrorMessage = $"API error: {response.StatusCode}";
                await _messageRepository.UpdateAsync(message);

                return new SendWhatsAppMessageResponse
                {
                    MessageId = message.Id,
                    PhoneNumber = request.PhoneNumber,
                    Status = "failed",
                    ErrorMessage = message.ErrorMessage,
                    SentAt = message.CreatedAt
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp template message to {PhoneNumber}", request.PhoneNumber);
            throw;
        }
    }

    public async Task<SendWhatsAppMessageResponse> SendMediaMessageAsync(SendWhatsAppMediaRequest request)
    {
        try
        {
            var message = new WhatsAppMessage
            {
                Direction = "outbound",
                MessageType = request.MediaType,
                PhoneNumber = request.PhoneNumber,
                UserId = request.UserId,
                UserType = request.UserType,
                MediaUrl = request.MediaUrl,
                MediaType = request.MediaType,
                Caption = request.Caption,
                Context = request.Context,
                RelatedEntityId = request.RelatedEntityId,
                RelatedEntityType = request.RelatedEntityType,
                Status = "pending"
            };

            await _messageRepository.CreateAsync(message);

            var client = _httpClientFactory.CreateClient("WhatsApp");

            object mediaObject = request.MediaType.ToLower() switch
            {
                "image" => new { link = request.MediaUrl, caption = request.Caption },
                "document" => new { link = request.MediaUrl, caption = request.Caption },
                "video" => new { link = request.MediaUrl, caption = request.Caption },
                "audio" => new { link = request.MediaUrl },
                _ => new { link = request.MediaUrl }
            };

            var payload = new
            {
                messaging_product = "whatsapp",
                to = request.PhoneNumber,
                type = request.MediaType.ToLower(),
                image = request.MediaType.ToLower() == "image" ? mediaObject : null,
                document = request.MediaType.ToLower() == "document" ? mediaObject : null,
                video = request.MediaType.ToLower() == "video" ? mediaObject : null,
                audio = request.MediaType.ToLower() == "audio" ? mediaObject : null
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload, new JsonSerializerOptions
                {
                    DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
                }),
                Encoding.UTF8,
                "application/json");

            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_accessToken}");

            var response = await client.PostAsync($"{_phoneNumberId}/messages", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var result = JsonSerializer.Deserialize<WhatsAppApiResponse>(responseBody);
                
                message.WhatsAppMessageId = result?.Messages?.FirstOrDefault()?.Id;
                message.Status = "sent";
                await _messageRepository.UpdateAsync(message);

                _logger.LogInformation("WhatsApp media message sent successfully to {PhoneNumber}", request.PhoneNumber);

                return new SendWhatsAppMessageResponse
                {
                    MessageId = message.Id,
                    WhatsAppMessageId = message.WhatsAppMessageId,
                    PhoneNumber = request.PhoneNumber,
                    Status = "sent",
                    SentAt = message.CreatedAt
                };
            }
            else
            {
                _logger.LogError("Failed to send WhatsApp media: {ResponseBody}", responseBody);
                
                message.Status = "failed";
                message.ErrorMessage = $"API error: {response.StatusCode}";
                await _messageRepository.UpdateAsync(message);

                return new SendWhatsAppMessageResponse
                {
                    MessageId = message.Id,
                    PhoneNumber = request.PhoneNumber,
                    Status = "failed",
                    ErrorMessage = message.ErrorMessage,
                    SentAt = message.CreatedAt
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp media message to {PhoneNumber}", request.PhoneNumber);
            throw;
        }
    }

    public async Task ProcessWebhookAsync(WhatsAppWebhookPayload payload)
    {
        try
        {
            if (payload.Entry == null || !payload.Entry.Any())
                return;

            foreach (var entry in payload.Entry)
            {
                if (entry.Changes == null) continue;

                foreach (var change in entry.Changes)
                {
                    if (change.Value?.Messages != null)
                    {
                        foreach (var webhookMessage in change.Value.Messages)
                        {
                            await ProcessInboundMessage(webhookMessage, change.Value.Metadata);
                        }
                    }

                    if (change.Value?.Statuses != null)
                    {
                        foreach (var status in change.Value.Statuses)
                        {
                            await UpdateMessageStatus(status);
                        }
                    }
                }
            }

            _logger.LogInformation("WhatsApp webhook processed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing WhatsApp webhook");
            throw;
        }
    }

    private async Task ProcessInboundMessage(WhatsAppWebhookMessage webhookMessage, WhatsAppWebhookMetadata? metadata)
    {
        var message = new WhatsAppMessage
        {
            WhatsAppMessageId = webhookMessage.Id,
            Direction = "inbound",
            MessageType = webhookMessage.Type,
            PhoneNumber = webhookMessage.From,
            Status = "received"
        };

        // Handle different message types
        switch (webhookMessage.Type.ToLower())
        {
            case "text":
                message.Content = webhookMessage.Text?.Body;
                break;
            case "image":
                message.MediaType = "image";
                // In production, you'd download and store the media
                break;
            case "document":
                message.MediaType = "document";
                break;
        }

        await _messageRepository.CreateAsync(message);
        
        _logger.LogInformation("Inbound WhatsApp message stored: {MessageId}", message.Id);

        // TODO: Process commands (e.g., "CHECK ORDER", "VIEW CATALOG")
        await ProcessMessageCommands(message);
    }

    private async Task ProcessMessageCommands(WhatsAppMessage message)
    {
        if (string.IsNullOrEmpty(message.Content))
            return;

        var command = message.Content.Trim().ToUpperInvariant();

        // Example command processing
        switch (command)
        {
            case "HELP":
                await SendTextMessageAsync(new SendWhatsAppTextRequest
                {
                    PhoneNumber = message.PhoneNumber,
                    Message = "Welcome to RealServ!\n\nAvailable commands:\n• CHECK ORDER - View your orders\n• VIEW CATALOG - Browse materials\n• HELP - Show this menu"
                });
                break;
            
            // Add more commands as needed
        }
    }

    private async Task UpdateMessageStatus(WhatsAppWebhookStatus status)
    {
        var message = await _messageRepository.GetByWhatsAppMessageIdAsync(status.Id);
        if (message != null)
        {
            var mappedStatus = status.Status.ToLower() switch
            {
                "sent" => "sent",
                "delivered" => "delivered",
                "read" => "read",
                "failed" => "failed",
                _ => "sent"
            };

            await _messageRepository.UpdateStatusAsync(message.Id, mappedStatus);
            
            _logger.LogInformation("Updated message {MessageId} status to {Status}", message.Id, mappedStatus);
        }
    }

    public async Task<WhatsAppMessageHistoryResponse> GetMessageHistoryByPhoneAsync(string phoneNumber, int page = 1, int pageSize = 50)
    {
        var messages = await _messageRepository.GetByPhoneNumberAsync(phoneNumber, page, pageSize);
        var totalCount = await _messageRepository.GetTotalCountByPhoneNumberAsync(phoneNumber);

        return new WhatsAppMessageHistoryResponse
        {
            Messages = messages.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<WhatsAppMessageHistoryResponse> GetMessageHistoryByUserAsync(string userId, int page = 1, int pageSize = 50)
    {
        var messages = await _messageRepository.GetByUserIdAsync(userId, page, pageSize);
        var totalCount = await _messageRepository.GetTotalCountByUserIdAsync(userId);

        return new WhatsAppMessageHistoryResponse
        {
            Messages = messages.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    private static WhatsAppMessageDto MapToDto(WhatsAppMessage message)
    {
        return new WhatsAppMessageDto
        {
            Id = message.Id,
            WhatsAppMessageId = message.WhatsAppMessageId,
            Direction = message.Direction,
            MessageType = message.MessageType,
            PhoneNumber = message.PhoneNumber,
            UserId = message.UserId,
            UserType = message.UserType,
            Content = message.Content,
            MediaUrl = message.MediaUrl,
            MediaType = message.MediaType,
            Caption = message.Caption,
            Status = message.Status,
            ErrorMessage = message.ErrorMessage,
            Context = message.Context,
            RelatedEntityId = message.RelatedEntityId,
            RelatedEntityType = message.RelatedEntityType,
            CreatedAt = message.CreatedAt
        };
    }
}

// Helper class for WhatsApp API response
internal class WhatsAppApiResponse
{
    public List<WhatsAppApiMessage>? Messages { get; set; }
}

internal class WhatsAppApiMessage
{
    public string? Id { get; set; }
}
