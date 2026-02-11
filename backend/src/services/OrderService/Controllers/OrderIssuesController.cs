using Microsoft.AspNetCore.Mvc;
using OrderService.Models.DTOs;
using OrderService.Models.Entities;
using OrderService.Models.Enums;
using OrderService.Repositories;

namespace OrderService.Controllers;

/// <summary>
/// Controller for managing order issues reported by vendors or buyers
/// </summary>
[ApiController]
[Route("api/v1/issues")]
[Produces("application/json")]
public class OrderIssuesController : ControllerBase
{
    private readonly IOrderIssueRepository _issueRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IDisputeRepository _disputeRepository;
    private readonly ILogger<OrderIssuesController> _logger;

    public OrderIssuesController(
        IOrderIssueRepository issueRepository,
        IOrderRepository orderRepository,
        IDisputeRepository disputeRepository,
        ILogger<OrderIssuesController> logger)
    {
        _issueRepository = issueRepository;
        _orderRepository = orderRepository;
        _disputeRepository = disputeRepository;
        _logger = logger;
    }

    /// <summary>
    /// Report a new issue
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(OrderIssueResponse), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<OrderIssueResponse>> ReportIssue([FromBody] CreateOrderIssueRequest request)
    {
        try
        {
            // Validate order exists
            var order = await _orderRepository.GetByIdAsync(request.OrderId);
            if (order == null)
                return BadRequest(new { message = "Order not found" });

            // Create issue
            var issue = new OrderIssue
            {
                Id = Guid.NewGuid(),
                OrderId = request.OrderId,
                Description = request.Description,
                IssueType = request.IssueType,
                Status = "open",
                ReportedBy = request.ReportedBy,
                ReportedByRole = request.ReportedByRole
            };

            var createdIssue = await _issueRepository.CreateAsync(issue);

            // Update order status if needed
            if (order.Status == Models.Enums.OrderStatus.Processing || 
                order.Status == Models.Enums.OrderStatus.Ready)
            {
                // Can optionally add a status history entry
                _logger.LogInformation("Issue reported for order {OrderId} in status {Status}", 
                    order.Id, order.Status);
            }

            _logger.LogInformation("Issue {IssueId} reported for order {OrderId} by {ReporterRole}", 
                createdIssue.Id, request.OrderId, request.ReportedByRole);

            return CreatedAtAction(
                nameof(GetIssueById),
                new { id = createdIssue.Id },
                MapToResponse(createdIssue));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reporting issue");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get issue by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(OrderIssueResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<OrderIssueResponse>> GetIssueById(Guid id)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null)
            return NotFound(new { message = "Issue not found" });

        return Ok(MapToResponse(issue));
    }

    /// <summary>
    /// Get all issues with optional filtering
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<OrderIssueResponse>), 200)]
    public async Task<ActionResult<List<OrderIssueResponse>>> GetAllIssues(
        [FromQuery] string? status = null,
        [FromQuery] Guid? reportedBy = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 50)
    {
        var issues = await _issueRepository.GetAllAsync(
            status, reportedBy, fromDate, toDate, skip, take);

        var responses = issues.Select(MapToResponse).ToList();
        return Ok(responses);
    }

    /// <summary>
    /// Get issues by order ID
    /// </summary>
    [HttpGet("order/{orderId}")]
    [ProducesResponseType(typeof(List<OrderIssueResponse>), 200)]
    public async Task<ActionResult<List<OrderIssueResponse>>> GetIssuesByOrderId(Guid orderId)
    {
        var issues = await _issueRepository.GetByOrderIdAsync(orderId);
        var responses = issues.Select(MapToResponse).ToList();
        return Ok(responses);
    }

    /// <summary>
    /// Get open issues
    /// </summary>
    [HttpGet("open")]
    [ProducesResponseType(typeof(List<OrderIssueResponse>), 200)]
    public async Task<ActionResult<List<OrderIssueResponse>>> GetOpenIssues()
    {
        var issues = await _issueRepository.GetOpenIssuesAsync();
        var responses = issues.Select(MapToResponse).ToList();
        return Ok(responses);
    }

    /// <summary>
    /// Resolve an issue
    /// </summary>
    [HttpPut("{id}/resolve")]
    [ProducesResponseType(typeof(OrderIssueResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<OrderIssueResponse>> ResolveIssue(
        Guid id,
        [FromBody] ResolveOrderIssueRequest request)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null)
            return NotFound(new { message = "Issue not found" });

        issue.Status = "resolved";
        issue.Resolution = request.Resolution;
        issue.ResolvedBy = request.ResolvedBy;
        issue.ResolvedAt = DateTime.UtcNow;

        await _issueRepository.UpdateAsync(issue);

        _logger.LogInformation("Issue {IssueId} resolved by {ResolvedBy}", id, request.ResolvedBy);

        return Ok(MapToResponse(issue));
    }

    /// <summary>
    /// Escalate issue to dispute
    /// </summary>
    [HttpPost("{id}/escalate")]
    [ProducesResponseType(typeof(DisputeResponse), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<DisputeResponse>> EscalateToDispute(
        Guid id,
        [FromBody] EscalateIssueRequest request)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null)
            return NotFound(new { message = "Issue not found" });

        if (issue.EscalatedToDispute)
            return BadRequest(new { message = "Issue already escalated to dispute" });

        // Check if order already has active dispute
        var hasActiveDispute = await _disputeRepository.HasActiveDisputeAsync(issue.OrderId);
        if (hasActiveDispute)
            return BadRequest(new { message = "Order already has an active dispute" });

        // Create dispute from issue
        var dispute = new Dispute
        {
            Id = Guid.NewGuid(),
            OrderId = issue.OrderId,
            Reason = MapIssueTypeToDisputeReason(issue.IssueType),
            Description = $"Escalated from issue: {issue.Description}",
            Status = DisputeStatus.Open,
            Priority = request.Priority ?? DisputePriority.Medium,
            DisputedAmount = request.DisputedAmount,
            RaisedBy = issue.ReportedBy,
            RaisedByRole = issue.ReportedByRole
        };

        var createdDispute = await _disputeRepository.CreateAsync(dispute);

        // Update issue
        issue.EscalatedToDispute = true;
        issue.DisputeId = createdDispute.Id;
        issue.Status = "escalated";
        await _issueRepository.UpdateAsync(issue);

        // Update order
        var order = await _orderRepository.GetByIdAsync(issue.OrderId);
        if (order != null)
        {
            order.HasActiveDispute = true;
            order.DisputeId = createdDispute.Id;
            await _orderRepository.UpdateAsync(order);
        }

        // Add timeline entry to dispute
        await _disputeRepository.AddTimelineEntryAsync(new DisputeTimeline
        {
            Id = Guid.NewGuid(),
            DisputeId = createdDispute.Id,
            Actor = issue.ReportedByRole,
            ActorId = issue.ReportedBy,
            ActorRole = issue.ReportedByRole,
            Action = "Escalated from Issue",
            Description = $"Issue {issue.Id} escalated to dispute"
        });

        _logger.LogInformation("Issue {IssueId} escalated to dispute {DisputeId}", id, createdDispute.Id);

        var disputeResponse = new DisputeResponse
        {
            Id = createdDispute.Id,
            OrderId = createdDispute.OrderId,
            OrderNumber = order?.OrderNumber ?? string.Empty,
            Reason = createdDispute.Reason,
            Description = createdDispute.Description,
            Status = createdDispute.Status,
            Priority = createdDispute.Priority,
            DisputedAmount = createdDispute.DisputedAmount,
            RaisedBy = createdDispute.RaisedBy,
            RaisedByRole = createdDispute.RaisedByRole,
            CreatedAt = createdDispute.CreatedAt,
            UpdatedAt = createdDispute.UpdatedAt
        };

        return Created("", disputeResponse);
    }

    /// <summary>
    /// Get issue statistics
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(IssueStatistics), 200)]
    public async Task<ActionResult<IssueStatistics>> GetIssueStatistics(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var stats = await _issueRepository.GetStatisticsAsync(fromDate, toDate);
        return Ok(stats);
    }

    // Helper methods
    private DisputeReason MapIssueTypeToDisputeReason(string issueType)
    {
        return issueType.ToLower() switch
        {
            "damaged_items" => DisputeReason.DamagedItems,
            "missing_items" => DisputeReason.MissingItems,
            "quality_issue" => DisputeReason.QualityIssue,
            "late_delivery" => DisputeReason.LateDelivery,
            "vendor_no_show" => DisputeReason.VendorNoShow,
            "incomplete_work" => DisputeReason.IncompleteWork,
            _ => DisputeReason.Other
        };
    }

    private OrderIssueResponse MapToResponse(OrderIssue issue)
    {
        return new OrderIssueResponse
        {
            Id = issue.Id,
            OrderId = issue.OrderId,
            Description = issue.Description,
            IssueType = issue.IssueType,
            Status = issue.Status,
            ReportedBy = issue.ReportedBy,
            ReportedByRole = issue.ReportedByRole,
            ReportedAt = issue.ReportedAt,
            Resolution = issue.Resolution,
            ResolvedBy = issue.ResolvedBy,
            ResolvedAt = issue.ResolvedAt,
            EscalatedToDispute = issue.EscalatedToDispute,
            DisputeId = issue.DisputeId,
            Notes = issue.Notes,
            CreatedAt = issue.CreatedAt,
            UpdatedAt = issue.UpdatedAt
        };
    }
}

/// <summary>
/// Request DTO for escalating an issue to a dispute
/// </summary>
public class EscalateIssueRequest
{
    public decimal DisputedAmount { get; set; }
    public DisputePriority? Priority { get; set; }
}
