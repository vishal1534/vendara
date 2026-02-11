using Microsoft.AspNetCore.Mvc;
using PaymentService.Models.Entities;
using PaymentService.Models.Requests;
using PaymentService.Models.Responses;
using PaymentService.Repositories;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/v1/settlements")]
public class SettlementsController : ControllerBase
{
    private readonly ISettlementRepository _settlementRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly ILogger<SettlementsController> _logger;

    public SettlementsController(
        ISettlementRepository settlementRepository,
        IPaymentRepository paymentRepository,
        ILogger<SettlementsController> logger)
    {
        _settlementRepository = settlementRepository;
        _paymentRepository = paymentRepository;
        _logger = logger;
    }

    // POST /api/v1/settlements/generate
    [HttpPost("generate")]
    public async Task<ActionResult<ApiResponse<SettlementResponse>>> GenerateSettlement([FromBody] CreateSettlementRequest request)
    {
        try
        {
            // Get completed payments for vendor in period
            var payments = await _paymentRepository.GetCompletedPaymentsByVendorAsync(
                request.VendorId,
                request.PeriodStart,
                request.PeriodEnd
            );

            if (!payments.Any())
            {
                return BadRequest(ApiResponse<SettlementResponse>.ErrorResponse(
                    "NO_PAYMENTS_FOUND",
                    "No completed payments found for the specified period"
                ));
            }

            var totalAmount = payments.Sum(p => p.Amount);
            var commission = request.CommissionPercentage ?? 10m; // Default 10%
            var commissionAmount = totalAmount * (commission / 100);
            var adjustmentAmount = request.AdjustmentAmount ?? 0m;
            var settlementAmount = totalAmount - commissionAmount + adjustmentAmount;

            var settlement = new VendorSettlement
            {
                VendorId = request.VendorId,
                PeriodStart = request.PeriodStart,
                PeriodEnd = request.PeriodEnd,
                TotalOrders = payments.Count,
                TotalAmount = totalAmount,
                CommissionPercentage = commission,
                CommissionAmount = commissionAmount,
                AdjustmentAmount = adjustmentAmount,
                AdjustmentReason = request.AdjustmentReason,
                SettlementAmount = settlementAmount,
                SettlementStatus = "pending",
                Notes = request.Notes
            };

            await _settlementRepository.CreateAsync(settlement);

            // Create line items
            foreach (var payment in payments)
            {
                var lineItemCommission = payment.Amount * (commission / 100);
                var lineItem = new SettlementLineItem
                {
                    SettlementId = settlement.Id,
                    PaymentId = payment.Id,
                    OrderId = payment.OrderId,
                    OrderAmount = payment.Amount,
                    CommissionAmount = lineItemCommission,
                    SettlementAmount = payment.Amount - lineItemCommission,
                    OrderDate = payment.CreatedAt,
                    PaymentDate = payment.CompletedAt
                };

                await _settlementRepository.CreateLineItemAsync(lineItem);
            }

            _logger.LogInformation("Settlement generated: {SettlementId} for vendor: {VendorId}", 
                settlement.Id, request.VendorId);

            var response = MapToResponse(settlement);
            return Ok(ApiResponse<SettlementResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating settlement for vendor: {VendorId}", request.VendorId);
            return StatusCode(500, ApiResponse<SettlementResponse>.ErrorResponse(
                "SETTLEMENT_GENERATION_FAILED",
                "Failed to generate settlement",
                ex.Message
            ));
        }
    }

    // GET /api/v1/settlements/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SettlementResponse>>> GetSettlement(Guid id)
    {
        try
        {
            var settlement = await _settlementRepository.GetByIdAsync(id);
            
            if (settlement == null)
            {
                return NotFound(ApiResponse<SettlementResponse>.ErrorResponse(
                    "SETTLEMENT_NOT_FOUND",
                    $"Settlement with ID '{id}' not found"
                ));
            }

            var response = MapToResponse(settlement);
            return Ok(ApiResponse<SettlementResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting settlement: {SettlementId}", id);
            return StatusCode(500, ApiResponse<SettlementResponse>.ErrorResponse(
                "SETTLEMENT_FETCH_FAILED",
                "Failed to fetch settlement",
                ex.Message
            ));
        }
    }

    // GET /api/v1/settlements/vendor/{vendorId}
    [HttpGet("vendor/{vendorId}")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<SettlementResponse>>>> GetVendorSettlements(
        Guid vendorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var settlements = await _settlementRepository.GetByVendorIdAsync(vendorId, page, pageSize);
            var totalCount = await _settlementRepository.GetVendorSettlementCountAsync(vendorId);

            var response = new PaginatedResponse<SettlementResponse>
            {
                Items = settlements.Select(MapToResponse).ToList(),
                Pagination = new PaginationMetadata
                {
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    HasNextPage = page * pageSize < totalCount,
                    HasPreviousPage = page > 1
                }
            };

            return Ok(ApiResponse<PaginatedResponse<SettlementResponse>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vendor settlements: {VendorId}", vendorId);
            return StatusCode(500, ApiResponse<PaginatedResponse<SettlementResponse>>.ErrorResponse(
                "SETTLEMENTS_FETCH_FAILED",
                "Failed to fetch settlements",
                ex.Message
            ));
        }
    }

    // GET /api/v1/settlements
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<SettlementResponse>>>> GetAllSettlements(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        try
        {
            var settlements = await _settlementRepository.GetAllAsync(page, pageSize, status);
            var totalCount = await _settlementRepository.GetTotalCountAsync(status);

            var response = new PaginatedResponse<SettlementResponse>
            {
                Items = settlements.Select(MapToResponse).ToList(),
                Pagination = new PaginationMetadata
                {
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    HasNextPage = page * pageSize < totalCount,
                    HasPreviousPage = page > 1
                }
            };

            return Ok(ApiResponse<PaginatedResponse<SettlementResponse>>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all settlements");
            return StatusCode(500, ApiResponse<PaginatedResponse<SettlementResponse>>.ErrorResponse(
                "SETTLEMENTS_FETCH_FAILED",
                "Failed to fetch settlements",
                ex.Message
            ));
        }
    }

    // PATCH /api/v1/settlements/{id}/process
    [HttpPatch("{id}/process")]
    public async Task<ActionResult<ApiResponse<SettlementResponse>>> ProcessSettlement(
        Guid id,
        [FromBody] Dictionary<string, object> request)
    {
        try
        {
            var settlement = await _settlementRepository.GetByIdAsync(id);
            
            if (settlement == null)
            {
                return NotFound(ApiResponse<SettlementResponse>.ErrorResponse(
                    "SETTLEMENT_NOT_FOUND",
                    $"Settlement with ID '{id}' not found"
                ));
            }

            settlement.SettlementStatus = "completed";
            settlement.ProcessedAt = DateTime.UtcNow;
            
            if (request.ContainsKey("utrNumber"))
                settlement.UtrNumber = request["utrNumber"].ToString();
            
            if (request.ContainsKey("settlementMethod"))
                settlement.SettlementMethod = request["settlementMethod"].ToString();

            await _settlementRepository.UpdateAsync(settlement);

            _logger.LogInformation("Settlement processed: {SettlementId}", id);

            var response = MapToResponse(settlement);
            return Ok(ApiResponse<SettlementResponse>.SuccessResponse(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing settlement: {SettlementId}", id);
            return StatusCode(500, ApiResponse<SettlementResponse>.ErrorResponse(
                "SETTLEMENT_PROCESSING_FAILED",
                "Failed to process settlement",
                ex.Message
            ));
        }
    }

    private SettlementResponse MapToResponse(VendorSettlement settlement)
    {
        return new SettlementResponse
        {
            Id = settlement.Id,
            VendorId = settlement.VendorId,
            PeriodStart = settlement.PeriodStart,
            PeriodEnd = settlement.PeriodEnd,
            TotalOrders = settlement.TotalOrders,
            TotalAmount = settlement.TotalAmount,
            CommissionPercentage = settlement.CommissionPercentage,
            CommissionAmount = settlement.CommissionAmount,
            SettlementAmount = settlement.SettlementAmount,
            TaxAmount = settlement.TaxAmount,
            AdjustmentAmount = settlement.AdjustmentAmount,
            AdjustmentReason = settlement.AdjustmentReason,
            SettlementStatus = settlement.SettlementStatus,
            SettlementMethod = settlement.SettlementMethod,
            BankAccountId = settlement.BankAccountId,
            UtrNumber = settlement.UtrNumber,
            ProcessedBy = settlement.ProcessedBy,
            Notes = settlement.Notes,
            CreatedAt = settlement.CreatedAt,
            UpdatedAt = settlement.UpdatedAt,
            ProcessedAt = settlement.ProcessedAt
        };
    }
}
