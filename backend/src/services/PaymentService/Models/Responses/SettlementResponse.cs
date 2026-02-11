namespace PaymentService.Models.Responses;

public class SettlementResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal CommissionPercentage { get; set; }
    public decimal CommissionAmount { get; set; }
    public decimal SettlementAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal AdjustmentAmount { get; set; }
    public string? AdjustmentReason { get; set; }
    public string SettlementStatus { get; set; } = null!;
    public string? SettlementMethod { get; set; }
    public Guid? BankAccountId { get; set; }
    public string? UtrNumber { get; set; }
    public Guid? ProcessedBy { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public List<SettlementLineItemResponse>? LineItems { get; set; }
}

public class SettlementLineItemResponse
{
    public Guid Id { get; set; }
    public Guid PaymentId { get; set; }
    public Guid OrderId { get; set; }
    public decimal OrderAmount { get; set; }
    public decimal CommissionAmount { get; set; }
    public decimal SettlementAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? PaymentDate { get; set; }
}
