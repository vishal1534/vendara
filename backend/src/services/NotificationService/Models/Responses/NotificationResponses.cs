namespace NotificationService.Models.Responses;

public class SendNotificationResponse
{
    public Guid NotificationId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ProviderMessageId { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class NotificationHistoryResponse
{
    public List<NotificationDto> Notifications { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

public class ErrorResponse
{
    public string Error { get; set; } = string.Empty;
    public string? Details { get; set; }
}
