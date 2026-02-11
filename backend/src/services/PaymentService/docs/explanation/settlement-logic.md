---
title: Settlement Logic - Payment Service
service: Payment Service
category: explanation
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Settlement Logic

**Service:** Payment Service  
**Category:** Explanation  
**Last Updated:** January 11, 2026

> **Purpose:** Understand how vendor settlements work, including commission calculations, settlement generation, and payout processing.

---

## Overview

Settlements are the process of distributing payment amounts to vendors after deducting RealServ's commission. The Payment Service automates settlement calculation and provides tools for batch processing vendor payouts.

---

## Settlement Architecture

```
┌─────────────────┐
│ Successful      │
│ Payments        │
│ (Orders Paid)   │
└────────┬────────┘
         │
         │ Filter by Vendor & Date Range
         ▼
┌─────────────────┐
│ Generate        │
│ Settlement      │
└────────┬────────┘
         │
         │ Calculate Commission (10%)
         ▼
┌─────────────────────────┐
│ Settlement Record       │
│ ├─ Total Amount         │
│ ├─ Commission Amount    │
│ └─ Settlement Amount    │
└────────┬────────────────┘
         │
         │ Create Line Items
         ▼
┌─────────────────────────┐
│ Settlement Line Items   │
│ (One per payment)       │
└────────┬────────────────┘
         │
         │ Admin Reviews & Processes
         ▼
┌─────────────────┐
│ Bank Transfer   │
│ to Vendor       │
└─────────────────┘
```

---

## Commission Calculation

### Basic Formula

```
Order Amount = ₹5,000
Commission (10%) = ₹500
Settlement Amount = ₹4,500
```

**Formula:**
```csharp
commissionAmount = orderAmount × (commissionPercentage / 100)
settlementAmount = orderAmount - commissionAmount
```

### Code Implementation

```csharp
public class SettlementCalculator
{
    private readonly decimal _commissionPercentage = 10.0m;
    
    public SettlementCalculation Calculate(decimal orderAmount)
    {
        var commissionAmount = Math.Round(
            orderAmount * (_commissionPercentage / 100), 
            2, 
            MidpointRounding.AwayFromZero
        );
        
        var settlementAmount = orderAmount - commissionAmount;
        
        return new SettlementCalculation
        {
            OrderAmount = orderAmount,
            CommissionAmount = commissionAmount,
            CommissionPercentage = _commissionPercentage,
            SettlementAmount = settlementAmount
        };
    }
}
```

### Examples

| Order Amount | Commission (10%) | Settlement Amount |
|--------------|------------------|-------------------|
| ₹1,000 | ₹100 | ₹900 |
| ₹5,000 | ₹500 | ₹4,500 |
| ₹10,000 | ₹1,000 | ₹9,000 |
| ₹25,000 | ₹2,500 | ₹22,500 |
| ₹100,000 | ₹10,000 | ₹90,000 |

---

## Settlement Generation Process

### Step 1: Select Date Range

```csharp
POST /api/v1/settlements/generate
{
  "vendorId": "vendor-uuid",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-11T23:59:59Z"
}
```

**Why date ranges?**
- Weekly settlements: Last 7 days
- Monthly settlements: Full month
- Custom periods: For specific reconciliation

### Step 2: Fetch Eligible Payments

```csharp
// Get all successful payments for vendor in date range
var payments = await _paymentRepository.GetSuccessfulPaymentsByVendorAsync(
    vendorId,
    startDate,
    endDate
);

// Filter out already settled payments
var unsettledPayments = payments
    .Where(p => !p.IsSettled)
    .ToList();
```

**Eligible payments must be:**
- Status: `success`
- Not already included in a settlement
- Payment method: `online` or confirmed `cod`
- Paid within the date range

### Step 3: Calculate Totals

```csharp
var totalAmount = unsettledPayments.Sum(p => p.Amount);
var commissionAmount = totalAmount * (commissionPercentage / 100);
var settlementAmount = totalAmount - commissionAmount;

var settlement = new VendorSettlement
{
    VendorId = vendorId,
    StartDate = startDate,
    EndDate = endDate,
    TotalAmount = totalAmount,
    CommissionAmount = commissionAmount,
    CommissionPercentage = commissionPercentage,
    SettlementAmount = settlementAmount,
    SettlementStatus = "pending"
};
```

### Step 4: Create Line Items

```csharp
foreach (var payment in unsettledPayments)
{
    var lineItemCommission = payment.Amount * (commissionPercentage / 100);
    var lineItemSettlement = payment.Amount - lineItemCommission;
    
    var lineItem = new SettlementLineItem
    {
        SettlementId = settlement.Id,
        PaymentId = payment.Id,
        OrderId = payment.OrderId,
        OrderAmount = payment.Amount,
        CommissionAmount = lineItemCommission,
        SettlementAmount = lineItemSettlement,
        PaidAt = payment.PaidAt.Value
    };
    
    await _lineItemRepository.CreateAsync(lineItem);
}
```

**Why line items?**
- Detailed breakdown per order
- Audit trail for each payment
- Easy reconciliation
- Transparent to vendors

---

## Settlement States

### State Diagram

```
pending → processing → processed
   ↓
cancelled → (deleted)
   ↓
failed → (retry)
```

### State Definitions

#### pending
- **Meaning:** Settlement generated, awaiting admin review
- **Duration:** Hours to days
- **Actions:** Admin can review details, approve, or cancel
- **Next State:** processing, cancelled

#### processing
- **Meaning:** Settlement approved, payment being transferred
- **Duration:** Minutes to hours
- **Actions:** Bank transfer initiated
- **Next State:** processed, failed

#### processed
- **Meaning:** Payment successfully transferred to vendor
- **Duration:** Permanent
- **Actions:** None (terminal success state)
- **Next State:** None

#### failed
- **Meaning:** Payment transfer failed (bank error, invalid account)
- **Duration:** Semi-permanent
- **Actions:** Retry, update bank details, contact vendor
- **Next State:** processing (retry), cancelled

#### cancelled
- **Meaning:** Settlement cancelled before processing
- **Duration:** Permanent
- **Actions:** Can be deleted, payments return to unsettled
- **Next State:** None (or deletion)

---

## Settlement Frequency

### Weekly Settlements (Recommended)

```
Generate Settlement: Every Monday
Date Range: Previous week (Mon-Sun)
Review Period: Monday-Tuesday
Processing: Wednesday
Payout: Thursday
```

**Advantages:**
- Regular cash flow for vendors
- Easier reconciliation
- Faster dispute resolution

### Monthly Settlements

```
Generate Settlement: 1st of month
Date Range: Previous full month
Review Period: 1-3rd
Processing: 4-5th
Payout: 5-7th
```

**Advantages:**
- Reduced processing overhead
- Better for high-volume vendors
- Aligned with accounting cycles

---

## Commission Variations

### Fixed Commission (Current)

```
All vendors: 10% commission
Order: ₹5,000 → Commission: ₹500
Order: ₹50,000 → Commission: ₹5,000
```

**Implementation:**
```csharp
private const decimal CommissionPercentage = 10.0m;
```

### Tiered Commission (Future)

```
Orders < ₹10,000: 10% commission
Orders ₹10,000 - ₹50,000: 8% commission
Orders > ₹50,000: 5% commission
```

**Implementation:**
```csharp
public decimal GetCommissionPercentage(decimal orderAmount)
{
    if (orderAmount < 10000) return 10.0m;
    if (orderAmount < 50000) return 8.0m;
    return 5.0m;
}
```

### Vendor-Specific Commission (Future)

```
Premium vendors: 5% commission
Standard vendors: 10% commission
New vendors (first 90 days): 15% commission
```

**Implementation:**
```csharp
var vendor = await _vendorService.GetVendorAsync(vendorId);
var commissionPercentage = vendor.CommissionPercentage;
```

---

## Payout Methods

### Bank Transfer (NEFT/RTGS/IMPS)

Current method for settlements. Admin manually transfers to vendor bank accounts.

```
Settlement Amount: ₹45,000
Bank: HDFC Bank
Account: 12345678901234
IFSC: HDFC0001234
Transaction Reference: TXN-2026-0001
```

### Future: Razorpay Payouts API

Automated payouts via Razorpay:

```csharp
var payout = await _razorpayPayoutsService.CreatePayoutAsync(new
{
    account_number = vendor.BankAccount,
    amount = settlement.SettlementAmount * 100, // Paise
    currency = "INR",
    mode = "NEFT",
    purpose = "vendor_bill",
    fund_account_id = vendor.FundAccountId,
    queue_if_low_balance = true
});

settlement.TransactionReference = payout["id"];
settlement.SettlementStatus = "processing";
```

---

## Reconciliation

### Vendor Settlement Report

```
Settlement ID: STL-2026-0001
Vendor: Krishna Materials
Period: 2026-01-01 to 2026-01-07

Order Details:
┌──────────────┬─────────────┬────────────┬──────────────┐
│ Order #      │ Order Amount│ Commission │ Settlement   │
├──────────────┼─────────────┼────────────┼──────────────┤
│ ORD-2026-001 │ ₹5,000      │ ₹500       │ ₹4,500       │
│ ORD-2026-015 │ ₹8,000      │ ₹800       │ ₹7,200       │
│ ORD-2026-027 │ ₹3,500      │ ₹350       │ ₹3,150       │
│ ORD-2026-038 │ ₹12,000     │ ₹1,200     │ ₹10,800      │
└──────────────┴─────────────┴────────────┴──────────────┘

Summary:
Total Orders: 4
Total Amount: ₹28,500
Commission (10%): ₹2,850
Settlement Amount: ₹25,650

Bank Details:
Account: 12345678901234
IFSC: HDFC0001234
Transaction Ref: TXN-2026-0001
Processed: 2026-01-08
```

### Vendor Portal View

Vendors can view their settlements via Vendor Portal:

```
GET /api/v1/settlements/vendor/{vendorId}

Response:
{
  "items": [
    {
      "id": "settlement-uuid",
      "startDate": "2026-01-01",
      "endDate": "2026-01-07",
      "totalAmount": 28500.00,
      "commissionAmount": 2850.00,
      "settlementAmount": 25650.00,
      "status": "processed",
      "processedAt": "2026-01-08T10:00:00Z"
    }
  ]
}
```

---

## Security & Compliance

### Audit Trail

Every settlement action is logged:

```csharp
_logger.LogInformation(
    "Settlement generated: {SettlementId} for vendor: {VendorId}, amount: {Amount}",
    settlement.Id,
    vendorId,
    settlement.SettlementAmount
);

_logger.LogInformation(
    "Settlement processed: {SettlementId}, transaction: {TransactionRef}",
    settlement.Id,
    transactionReference
);
```

### Authorization

```csharp
// Only admins can generate settlements
[Authorize(Roles = "Admin")]
[HttpPost("generate")]
public async Task<ActionResult> GenerateSettlement(...)

// Vendors can view their own settlements
[Authorize(Roles = "Vendor,Admin")]
[HttpGet("vendor/{vendorId}")]
public async Task<ActionResult> GetVendorSettlements(...)
{
    // Ensure vendor can only see their own
    if (currentUser.Role == "Vendor" && currentUser.Id != vendorId)
    {
        return Forbid();
    }
    // ...
}
```

---

## Error Handling

### No Payments Found

```csharp
if (!unsettledPayments.Any())
{
    return BadRequest(new ApiResponse
    {
        Success = false,
        Error = new Error
        {
            Code = "NO_PAYMENTS_FOUND",
            Message = "No successful payments found in date range"
        }
    });
}
```

### Already Settled

```csharp
var existingSettlement = await _settlementRepository
    .GetByVendorAndDateRangeAsync(vendorId, startDate, endDate);

if (existingSettlement != null)
{
    return BadRequest(new ApiResponse
    {
        Success = false,
        Error = new Error
        {
            Code = "SETTLEMENT_EXISTS",
            Message = "Settlement already exists for this period"
        }
    });
}
```

---

## Performance Considerations

### Batch Processing

```csharp
// Process line items in batches
const int batchSize = 100;
for (int i = 0; i < lineItems.Count; i += batchSize)
{
    var batch = lineItems.Skip(i).Take(batchSize);
    await _lineItemRepository.BulkInsertAsync(batch);
}
```

### Database Transaction

```csharp
using var transaction = await _context.Database.BeginTransactionAsync();
try
{
    // Create settlement
    await _settlementRepository.CreateAsync(settlement);
    
    // Create line items
    await _lineItemRepository.BulkInsertAsync(lineItems);
    
    // Mark payments as settled
    await _paymentRepository.MarkAsSettledAsync(paymentIds);
    
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

---

## Future Enhancements

1. **Automated Payouts:** Razorpay Payouts API integration
2. **Dynamic Commission:** Tiered or vendor-specific rates
3. **Hold Periods:** Configurable hold for dispute resolution
4. **Instant Settlements:** T+0 for premium vendors
5. **Multi-Currency:** Support USD, EUR for international vendors

---

## Related Documentation

- [Payment Processing](./payment-processing.md)
- [API Reference](../../API_REFERENCE.md)
- [Database Schema](../reference/database-schema.md)

---

**Document Status:** ✅ Complete  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
