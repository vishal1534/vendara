using Microsoft.AspNetCore.Mvc;
using OrderService.Models.DTOs;
using OrderService.Models.Entities;
using OrderService.Models.Enums;
using OrderService.Repositories;

namespace OrderService.Controllers;

/// <summary>
/// Controller for managing order disputes
/// </summary>
[ApiController]
[Route("api/v1/disputes")]
[Produces("application/json")]
public class DisputesController : ControllerBase
{
    private readonly IDisputeRepository _disputeRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<DisputesController> _logger;

    public DisputesController(
        IDisputeRepository disputeRepository,
        IOrderRepository orderRepository,
        ILogger<DisputesController> logger)
    {
        _disputeRepository = disputeRepository;
        _orderRepository = orderRepository;
        _logger = logger;
    }

    /// <summary>
    /// Create a new dispute
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(DisputeResponse), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<DisputeResponse>> CreateDispute([FromBody] CreateDisputeRequest request)
    {
        try
        {
            // Validate order exists
            var order = await _orderRepository.GetByIdAsync(request.OrderId);
            if (order == null)
                return BadRequest(new { message = "Order not found" });

            // Check if order already has active dispute
            var hasActiveDispute = await _disputeRepository.HasActiveDisputeAsync(request.OrderId);
            if (hasActiveDispute)
                return BadRequest(new { message = "Order already has an active dispute" });

            // Create dispute
            var dispute = new Dispute
            {
                Id = Guid.NewGuid(),
                OrderId = request.OrderId,
                Reason = request.Reason,
                Description = request.Description,
                Status = DisputeStatus.Open,
                Priority = DeterminePriority(request.Reason, request.DisputedAmount),
                DisputedAmount = request.DisputedAmount,
                RaisedBy = request.RaisedBy,
                RaisedByRole = request.RaisedByRole
            };

            var createdDispute = await _disputeRepository.CreateAsync(dispute);

            // Update order
            order.HasActiveDispute = true;
            order.DisputeId = createdDispute.Id;
            await _orderRepository.UpdateAsync(order);

            // Add initial timeline entry
            await _disputeRepository.AddTimelineEntryAsync(new DisputeTimeline
            {
                Id = Guid.NewGuid(),
                DisputeId = createdDispute.Id,
                Actor = request.RaisedByRole,
                ActorId = request.RaisedBy,
                ActorRole = request.RaisedByRole,
                Action = "Dispute Created",
                Description = $"Dispute opened for reason: {request.Reason}"
            });

            _logger.LogInformation("Dispute {DisputeId} created for order {OrderId}", createdDispute.Id, request.OrderId);

            return CreatedAtAction(
                nameof(GetDisputeById),
                new { id = createdDispute.Id },
                MapToResponse(createdDispute, order.OrderNumber));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating dispute");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get dispute by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DisputeResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<DisputeResponse>> GetDisputeById(Guid id)
    {
        var dispute = await _disputeRepository.GetByIdAsync(id);
        if (dispute == null)
            return NotFound(new { message = "Dispute not found" });

        return Ok(MapToResponse(dispute, dispute.Order.OrderNumber));
    }

    /// <summary>
    /// Get all disputes with optional filtering
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<DisputeResponse>), 200)]
    public async Task<ActionResult<List<DisputeResponse>>> GetAllDisputes(
        [FromQuery] DisputeStatus? status = null,
        [FromQuery] DisputePriority? priority = null,
        [FromQuery] Guid? assignedTo = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 50)
    {
        var disputes = await _disputeRepository.GetAllAsync(
            status, priority, assignedTo, fromDate, toDate, skip, take);

        var responses = disputes.Select(d => MapToResponse(d, d.Order.OrderNumber)).ToList();
        return Ok(responses);
    }

    /// <summary>
    /// Get dispute by order ID
    /// </summary>
    [HttpGet("order/{orderId}")]
    [ProducesResponseType(typeof(DisputeResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<DisputeResponse>> GetDisputeByOrderId(Guid orderId)
    {
        var dispute = await _disputeRepository.GetByOrderIdAsync(orderId);
        if (dispute == null)
            return NotFound(new { message = "No dispute found for this order" });

        return Ok(MapToResponse(dispute, dispute.Order.OrderNumber));
    }

    /// <summary>
    /// Get open disputes
    /// </summary>
    [HttpGet("open")]
    [ProducesResponseType(typeof(List<DisputeResponse>), 200)]
    public async Task<ActionResult<List<DisputeResponse>>> GetOpenDisputes()
    {
        var disputes = await _disputeRepository.GetOpenDisputesAsync();
        var responses = disputes.Select(d => MapToResponse(d, d.Order.OrderNumber)).ToList();
        return Ok(responses);
    }

    /// <summary>
    /// Get escalated disputes
    /// </summary>
    [HttpGet("escalated")]
    [ProducesResponseType(typeof(List<DisputeResponse>), 200)]
    public async Task<ActionResult<List<DisputeResponse>>> GetEscalatedDisputes()
    {
        var disputes = await _disputeRepository.GetEscalatedDisputesAsync();
        var responses = disputes.Select(d => MapToResponse(d, d.Order.OrderNumber)).ToList();
        return Ok(responses);
    }

    /// <summary>
    /// Update dispute status
    /// </summary>
    [HttpPut("{id}/status")]
    [ProducesResponseType(typeof(DisputeResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<DisputeResponse>> UpdateDisputeStatus(
        Guid id,
        [FromBody] UpdateDisputeStatusRequest request)
    {
        var dispute = await _disputeRepository.GetByIdAsync(id);
        if (dispute == null)
            return NotFound(new { message = "Dispute not found" });

        var previousStatus = dispute.Status;
        dispute.Status = request.Status;
        dispute.ResolutionNote = request.ResolutionNote;
        dispute.RefundAmount = request.RefundAmount;

        // If resolving, set resolution timestamp
        if (IsResolvedStatus(request.Status))
        {
            dispute.ResolvedAt = DateTime.UtcNow;
            // Update order
            var order = await _orderRepository.GetByIdAsync(dispute.OrderId);
            if (order != null)
            {
                order.HasActiveDispute = false;
                await _orderRepository.UpdateAsync(order);
            }
        }

        await _disputeRepository.UpdateAsync(dispute);

        // Add timeline entry
        await _disputeRepository.AddTimelineEntryAsync(new DisputeTimeline
        {
            Id = Guid.NewGuid(),
            DisputeId = id,
            Actor = "Admin",
            ActorId = Guid.Empty, // TODO: Get from auth context
            ActorRole = "admin",
            Action = "Status Changed",
            Description = $"Status changed from {previousStatus} to {request.Status}"
        });

        _logger.LogInformation("Dispute {DisputeId} status updated to {Status}", id, request.Status);

        return Ok(MapToResponse(dispute, dispute.Order.OrderNumber));
    }

    /// <summary>
    /// Assign dispute to admin
    /// </summary>
    [HttpPut("{id}/assign")]
    [ProducesResponseType(typeof(DisputeResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<DisputeResponse>> AssignDispute(
        Guid id,
        [FromBody] AssignDisputeRequest request)
    {
        var dispute = await _disputeRepository.GetByIdAsync(id);
        if (dispute == null)
            return NotFound(new { message = "Dispute not found" });

        dispute.AssignedTo = request.AssignedTo;
        dispute.AssignedAt = DateTime.UtcNow;
        dispute.Status = DisputeStatus.UnderReview;

        await _disputeRepository.UpdateAsync(dispute);

        // Add timeline entry
        await _disputeRepository.AddTimelineEntryAsync(new DisputeTimeline
        {
            Id = Guid.NewGuid(),
            DisputeId = id,
            Actor = "Admin",
            ActorId = Guid.Empty, // TODO: Get from auth context
            ActorRole = "admin",
            Action = "Dispute Assigned",
            Description = $"Dispute assigned to admin {request.AssignedTo}"
        });

        _logger.LogInformation("Dispute {DisputeId} assigned to {AdminId}", id, request.AssignedTo);

        return Ok(MapToResponse(dispute, dispute.Order.OrderNumber));
    }

    /// <summary>
    /// Add evidence to dispute
    /// </summary>
    [HttpPost("{id}/evidence")]
    [ProducesResponseType(typeof(DisputeEvidenceResponse), 201)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<DisputeEvidenceResponse>> AddEvidence(
        Guid id,
        [FromBody] AddDisputeEvidenceRequest request)
    {
        var dispute = await _disputeRepository.GetByIdAsync(id);
        if (dispute == null)
            return NotFound(new { message = "Dispute not found" });

        var evidence = new DisputeEvidence
        {
            Id = Guid.NewGuid(),
            DisputeId = id,
            Type = request.Type,
            Url = request.Url,
            UploadedBy = request.UploadedBy,
            UploadedByRole = request.UploadedByRole,
            Description = request.Description
        };

        var createdEvidence = await _disputeRepository.AddEvidenceAsync(evidence);

        // Add timeline entry
        await _disputeRepository.AddTimelineEntryAsync(new DisputeTimeline
        {
            Id = Guid.NewGuid(),
            DisputeId = id,
            Actor = request.UploadedByRole,
            ActorId = request.UploadedBy,
            ActorRole = request.UploadedByRole,
            Action = "Evidence Added",
            Description = $"Added {request.Type} evidence"
        });

        _logger.LogInformation("Evidence added to dispute {DisputeId}", id);

        return Created("", MapEvidenceToResponse(createdEvidence));
    }

    /// <summary>
    /// Get dispute timeline
    /// </summary>
    [HttpGet("{id}/timeline")]
    [ProducesResponseType(typeof(List<DisputeTimelineResponse>), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<List<DisputeTimelineResponse>>> GetDisputeTimeline(Guid id)
    {
        var dispute = await _disputeRepository.GetByIdAsync(id);
        if (dispute == null)
            return NotFound(new { message = "Dispute not found" });

        var timeline = dispute.Timeline
            .OrderBy(t => t.Timestamp)
            .Select(MapTimelineToResponse)
            .ToList();

        return Ok(timeline);
    }

    /// <summary>
    /// Escalate dispute
    /// </summary>
    [HttpPut("{id}/escalate")]
    [ProducesResponseType(typeof(DisputeResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<DisputeResponse>> EscalateDispute(
        Guid id,
        [FromBody] EscalateDisputeRequest request)
    {
        var dispute = await _disputeRepository.GetByIdAsync(id);
        if (dispute == null)
            return NotFound(new { message = "Dispute not found" });

        dispute.Status = DisputeStatus.Escalated;
        dispute.EscalatedAt = DateTime.UtcNow;
        dispute.EscalationReason = request.Reason;
        dispute.Priority = DisputePriority.Critical;

        await _disputeRepository.UpdateAsync(dispute);

        // Add timeline entry
        await _disputeRepository.AddTimelineEntryAsync(new DisputeTimeline
        {
            Id = Guid.NewGuid(),
            DisputeId = id,
            Actor = "Admin",
            ActorId = Guid.Empty, // TODO: Get from auth context
            ActorRole = "admin",
            Action = "Dispute Escalated",
            Description = $"Escalated: {request.Reason}"
        });

        _logger.LogInformation("Dispute {DisputeId} escalated", id);

        return Ok(MapToResponse(dispute, dispute.Order.OrderNumber));
    }

    /// <summary>
    /// Get dispute statistics
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(DisputeStatistics), 200)]
    public async Task<ActionResult<DisputeStatistics>> GetDisputeStatistics(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var stats = await _disputeRepository.GetStatisticsAsync(fromDate, toDate);
        return Ok(stats);
    }

    // Helper methods
    private DisputePriority DeterminePriority(DisputeReason reason, decimal amount)
    {
        if (amount > 50000 || reason == DisputeReason.VendorNoShow || reason == DisputeReason.IncompleteWork)
            return DisputePriority.High;
        if (amount > 20000 || reason == DisputeReason.DamagedItems || reason == DisputeReason.QualityIssue)
            return DisputePriority.Medium;
        return DisputePriority.Low;
    }

    private bool IsResolvedStatus(DisputeStatus status)
    {
        return status == DisputeStatus.ResolvedRefund ||
               status == DisputeStatus.ResolvedReplacement ||
               status == DisputeStatus.ResolvedPartialRefund ||
               status == DisputeStatus.Rejected;
    }

    private DisputeResponse MapToResponse(Dispute dispute, string orderNumber)
    {
        return new DisputeResponse
        {
            Id = dispute.Id,
            OrderId = dispute.OrderId,
            OrderNumber = orderNumber,
            Reason = dispute.Reason,
            Description = dispute.Description,
            Status = dispute.Status,
            Priority = dispute.Priority,
            DisputedAmount = dispute.DisputedAmount,
            RefundAmount = dispute.RefundAmount,
            RaisedBy = dispute.RaisedBy,
            RaisedByRole = dispute.RaisedByRole,
            AssignedTo = dispute.AssignedTo,
            AssignedAt = dispute.AssignedAt,
            ResolutionNote = dispute.ResolutionNote,
            ResolvedBy = dispute.ResolvedBy,
            ResolvedAt = dispute.ResolvedAt,
            EscalatedAt = dispute.EscalatedAt,
            EscalationReason = dispute.EscalationReason,
            Evidence = dispute.Evidence.Select(MapEvidenceToResponse).ToList(),
            Timeline = dispute.Timeline.Select(MapTimelineToResponse).ToList(),
            CreatedAt = dispute.CreatedAt,
            UpdatedAt = dispute.UpdatedAt
        };
    }

    private DisputeEvidenceResponse MapEvidenceToResponse(DisputeEvidence evidence)
    {
        return new DisputeEvidenceResponse
        {
            Id = evidence.Id,
            Type = evidence.Type,
            Url = evidence.Url,
            UploadedBy = evidence.UploadedBy,
            UploadedByRole = evidence.UploadedByRole,
            Description = evidence.Description,
            UploadedAt = evidence.UploadedAt
        };
    }

    private DisputeTimelineResponse MapTimelineToResponse(DisputeTimeline timeline)
    {
        return new DisputeTimelineResponse
        {
            Id = timeline.Id,
            Actor = timeline.Actor,
            ActorId = timeline.ActorId,
            ActorRole = timeline.ActorRole,
            Action = timeline.Action,
            Description = timeline.Description,
            Metadata = timeline.Metadata,
            Timestamp = timeline.Timestamp
        };
    }
}

/// <summary>
/// Request DTO for escalating a dispute
/// </summary>
public class EscalateDisputeRequest
{
    public string Reason { get; set; } = string.Empty;
}
