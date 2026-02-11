using OrderService.Models.Enums;

namespace OrderService.Models.DTOs;

/// <summary>
/// DTO for creating a new dispute
/// </summary>
public class CreateDisputeRequest
{
    public Guid OrderId { get; set; }
    public DisputeReason Reason { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal DisputedAmount { get; set; }
    public Guid RaisedBy { get; set; }
    public string RaisedByRole { get; set; } = string.Empty;
}

/// <summary>
/// DTO for updating dispute status
/// </summary>
public class UpdateDisputeStatusRequest
{
    public DisputeStatus Status { get; set; }
    public string? ResolutionNote { get; set; }
    public decimal? RefundAmount { get; set; }
}

/// <summary>
/// DTO for assigning dispute to admin
/// </summary>
public class AssignDisputeRequest
{
    public Guid AssignedTo { get; set; }
}

/// <summary>
/// DTO for adding evidence to dispute
/// </summary>
public class AddDisputeEvidenceRequest
{
    public string Type { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public Guid UploadedBy { get; set; }
    public string UploadedByRole { get; set; } = string.Empty;
    public string? Description { get; set; }
}

/// <summary>
/// DTO for dispute response
/// </summary>
public class DisputeResponse
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DisputeReason Reason { get; set; }
    public string Description { get; set; } = string.Empty;
    public DisputeStatus Status { get; set; }
    public DisputePriority Priority { get; set; }
    public decimal DisputedAmount { get; set; }
    public decimal? RefundAmount { get; set; }
    public Guid RaisedBy { get; set; }
    public string RaisedByRole { get; set; } = string.Empty;
    public Guid? AssignedTo { get; set; }
    public DateTime? AssignedAt { get; set; }
    public string? ResolutionNote { get; set; }
    public Guid? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? EscalatedAt { get; set; }
    public string? EscalationReason { get; set; }
    public List<DisputeEvidenceResponse> Evidence { get; set; } = new();
    public List<DisputeTimelineResponse> Timeline { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO for dispute evidence response
/// </summary>
public class DisputeEvidenceResponse
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public Guid UploadedBy { get; set; }
    public string UploadedByRole { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime UploadedAt { get; set; }
}

/// <summary>
/// DTO for dispute timeline response
/// </summary>
public class DisputeTimelineResponse
{
    public Guid Id { get; set; }
    public string Actor { get; set; } = string.Empty;
    public Guid ActorId { get; set; }
    public string ActorRole { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Metadata { get; set; }
    public DateTime Timestamp { get; set; }
}
