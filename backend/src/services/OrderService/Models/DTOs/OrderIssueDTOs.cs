namespace OrderService.Models.DTOs;

/// <summary>
/// DTO for creating/reporting a new order issue
/// </summary>
public class CreateOrderIssueRequest
{
    public Guid OrderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string IssueType { get; set; } = string.Empty;
    public Guid ReportedBy { get; set; }
    public string ReportedByRole { get; set; } = string.Empty;
}

/// <summary>
/// DTO for resolving an order issue
/// </summary>
public class ResolveOrderIssueRequest
{
    public string Resolution { get; set; } = string.Empty;
    public Guid ResolvedBy { get; set; }
}

/// <summary>
/// DTO for order issue response
/// </summary>
public class OrderIssueResponse
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string IssueType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Guid ReportedBy { get; set; }
    public string ReportedByRole { get; set; } = string.Empty;
    public DateTime ReportedAt { get; set; }
    public string? Resolution { get; set; }
    public Guid? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public bool EscalatedToDispute { get; set; }
    public Guid? DisputeId { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
