namespace IntegrationService.Models.Responses;

/// <summary>
/// Response for sending a WhatsApp message
/// </summary>
public class SendWhatsAppMessageResponse
{
    public Guid MessageId { get; set; }
    public string? WhatsAppMessageId { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public DateTime SentAt { get; set; }
}

/// <summary>
/// Response for WhatsApp message history
/// </summary>
public class WhatsAppMessageHistoryResponse
{
    public List<WhatsAppMessageDto> Messages { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

/// <summary>
/// WhatsApp message DTO
/// </summary>
public class WhatsAppMessageDto
{
    public Guid Id { get; set; }
    public string? WhatsAppMessageId { get; set; }
    public string Direction { get; set; } = string.Empty;
    public string MessageType { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? UserType { get; set; }
    public string? Content { get; set; }
    public string? MediaUrl { get; set; }
    public string? MediaType { get; set; }
    public string? Caption { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public string? Context { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public DateTime CreatedAt { get; set; }
}
