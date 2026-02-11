---
title: Payment Processing Architecture - Payment Service
service: Payment Service
category: explanation
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Payment Processing Architecture

**Service:** Payment Service  
**Category:** Explanation  
**Last Updated:** January 11, 2026

> **Purpose:** Understand how payment processing works in RealServ, including online payments, COD, payment states, and webhook handling.

---

## Overview

Payment Service handles all payment transactions for RealServ marketplace, supporting both online payments (via Razorpay) and Cash on Delivery (COD). The service ensures secure, reliable payment processing with proper state management and webhook event handling.

---

## Payment Flow Architecture

### Complete Payment Journey

```
┌─────────────┐
│   Buyer     │
│ (Frontend)  │
└──────┬──────┘
       │
       │ 1. Create Order
       ▼
┌─────────────────┐
│ Order Service   │
└──────┬──────────┘
       │
       │ 2. Create Payment
       ▼
┌─────────────────────┐
│ Payment Service     │
│ POST /payments/create│
└──────┬──────────────┘
       │
       │ 3. Create Razorpay Order
       ▼
┌─────────────────┐
│   Razorpay      │
│   (Gateway)     │
└──────┬──────────┘
       │
       │ 4. Return Order ID
       ▼
┌─────────────────┐
│ Payment Service │
│ (Save to DB)    │
└──────┬──────────┘
       │
       │ 5. Return Payment Details
       ▼
┌─────────────┐
│   Buyer     │
│ (Frontend)  │
│ Razorpay SDK│
└──────┬──────┘
       │
       │ 6. Complete Payment
       ▼
┌─────────────────┐
│   Razorpay      │
│ (Process Payment)│
└──────┬──────────┘
       │
       │ 7. Return Signature
       ▼
┌─────────────┐
│   Buyer     │
│ (Frontend)  │
└──────┬──────┘
       │
       │ 8. Verify Signature
       ▼
┌─────────────────────┐
│ Payment Service     │
│ POST /payments/verify│
└──────┬──────────────┘
       │
       │ 9. Verify HMAC
       ├─ ✅ Valid → Update Status
       └─ ❌ Invalid → Reject
       │
       │ 10. Update Order Status
       ▼
┌─────────────────┐
│ Order Service   │
│ (Mark as Paid)  │
└─────────────────┘
```

---

## Online Payment Flow (Razorpay)

### Step 1: Payment Creation

```csharp
// 1. Order Service calls Payment Service
POST /api/v1/payments/create
{
  "orderId": "order-uuid",
  "amount": 5000.00,
  "paymentMethod": "online"
}

// 2. Payment Service validates order
var isValid = await _orderService.ValidateOrderForPaymentAsync(orderId, amount);

// 3. Payment Service creates Razorpay order
var razorpayOrder = await _razorpayService.CreateOrderAsync(amount, currency, receiptId);

// 4. Save payment record
var payment = new Payment {
  OrderId = orderId,
  Amount = amount,
  RazorpayOrderId = razorpayOrder["id"],
  PaymentStatus = "pending"
};
await _paymentRepository.CreateAsync(payment);

// 5. Return payment details to frontend
return new PaymentResponse {
  RazorpayOrderId = payment.RazorpayOrderId,
  Amount = payment.Amount,
  Currency = payment.Currency
};
```

**Why this design?**
- Separates order creation from payment processing
- Creates audit trail before payment attempt
- Allows tracking of failed payment attempts
- Enables retry mechanism if payment fails

### Step 2: Frontend Payment Completion

```javascript
// Frontend opens Razorpay checkout
const options = {
  key: 'rzp_test_KEY',
  amount: payment.amount * 100, // Paise
  order_id: payment.razorpayOrderId,
  handler: async function (response) {
    // Buyer completed payment
    await verifyPayment(response);
  }
};

const razorpay = new Razorpay(options);
razorpay.open();
```

**Why Razorpay SDK?**
- Handles payment method selection (UPI, cards, etc.)
- Manages payment form and validation
- Implements 3D Secure for cards
- Returns cryptographically signed response
- Provides fallback payment methods

### Step 3: Signature Verification

```csharp
// Payment Service receives verification request
POST /api/v1/payments/verify
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}

// Verify HMAC SHA256 signature
var message = $"{razorpayOrderId}|{razorpayPaymentId}";
var secret = Encoding.UTF8.GetBytes(_razorpayKeySecret);
var messageBytes = Encoding.UTF8.GetBytes(message);

using var hmac = new HMACSHA256(secret);
var hash = hmac.ComputeHash(messageBytes);
var computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

if (computedSignature != razorpaySignature) {
  throw new Exception("Invalid signature");
}

// Update payment status
payment.PaymentStatus = "success";
payment.RazorpayPaymentId = razorpayPaymentId;
payment.PaidAt = DateTime.UtcNow;
await _paymentRepository.UpdateAsync(payment);

// Notify Order Service
await _orderService.MarkOrderAsPaidAsync(payment.OrderId);
```

**Why signature verification?**
- Prevents payment fraud
- Ensures response is from Razorpay
- Protects against man-in-the-middle attacks
- Required by PCI-DSS compliance

---

## COD Payment Flow

### Step 1: COD Payment Creation

```csharp
POST /api/v1/payments/cod/create
{
  "orderId": "order-uuid",
  "amount": 3500.00,
  "paymentMethod": "cod"
}

var payment = new Payment {
  OrderId = orderId,
  Amount = amount,
  PaymentMethod = "cod",
  PaymentStatus = "pending" // Awaiting cash collection
};

await _paymentRepository.CreateAsync(payment);
```

**Why pending status?**
- Cash not yet collected
- Order can be delivered
- Vendor must confirm cash receipt

### Step 2: COD Confirmation

```csharp
// After delivery, vendor confirms cash collection
PATCH /api/v1/payments/{id}/status
{
  "paymentStatus": "success",
  "notes": "Cash collected on delivery"
}

payment.PaymentStatus = "success";
payment.PaidAt = DateTime.UtcNow;
await _paymentRepository.UpdateAsync(payment);
```

**Why manual confirmation?**
- Vendor physically collects cash
- Prevents fraudulent payment claims
- Creates audit trail
- Triggers settlement calculation

---

## Payment States

### State Diagram

```
pending → processing → success
   ↓           ↓
 failed    failed
   ↓
partially_refunded → refunded
```

### State Definitions

#### pending
- **Meaning:** Payment initiated, not yet completed
- **Duration:** Seconds to minutes (online) or days (COD)
- **Can Transition To:** processing, success, failed
- **Actions Allowed:** Cancel, verify

#### processing
- **Meaning:** Payment being processed by gateway
- **Duration:** Seconds
- **Can Transition To:** success, failed
- **Actions Allowed:** None (transient state)

#### success
- **Meaning:** Payment successfully completed
- **Duration:** Permanent (until refund)
- **Can Transition To:** partially_refunded, refunded
- **Actions Allowed:** Refund, generate settlement

#### failed
- **Meaning:** Payment attempt failed
- **Duration:** Permanent
- **Can Transition To:** None
- **Actions Allowed:** Retry (create new payment)

#### partially_refunded
- **Meaning:** Some amount refunded, some retained
- **Duration:** Semi-permanent
- **Can Transition To:** refunded
- **Actions Allowed:** Additional refunds (up to remaining amount)

#### refunded
- **Meaning:** Full amount refunded
- **Duration:** Permanent
- **Can Transition To:** None
- **Actions Allowed:** None (terminal state)

---

## Webhook Event Processing

### Why Webhooks?

Webhooks are critical for handling asynchronous events from Razorpay:
- Payment captured (buyer's bank confirmed payment)
- Payment failed (insufficient funds, declined card)
- Refund processed (money returned to buyer)
- Refund failed (technical error)

### Webhook Flow

```
┌─────────────┐
│  Razorpay   │
│  (Event)    │
└──────┬──────┘
       │
       │ 1. Send Webhook (HTTP POST)
       ▼
┌─────────────────────────┐
│ Payment Service         │
│ POST /webhooks/razorpay │
└──────┬──────────────────┘
       │
       │ 2. Verify Signature
       ├─ ✅ Valid → Process
       └─ ❌ Invalid → Reject (400)
       │
       │ 3. Parse Event Type
       ├─ payment.captured
       ├─ payment.failed
       ├─ refund.processed
       └─ refund.failed
       │
       │ 4. Update Payment Status
       ▼
┌─────────────────┐
│    Database     │
│ (Update Record) │
└──────┬──────────┘
       │
       │ 5. Log Webhook
       ▼
┌─────────────────────┐
│ payment_webhooks    │
│ (Audit Log)         │
└─────────────────────┘
```

### Webhook Signature Verification

```csharp
// 1. Get webhook body and signature
var webhookBody = await Request.ReadAsStringAsync();
var signature = Request.Headers["X-Razorpay-Signature"];

// 2. Compute HMAC SHA256
var secret = Encoding.UTF8.GetBytes(_webhookSecret);
var bodyBytes = Encoding.UTF8.GetBytes(webhookBody);

using var hmac = new HMACSHA256(secret);
var hash = hmac.ComputeHash(bodyBytes);
var computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

// 3. Compare signatures
if (computedSignature != signature) {
  return BadRequest("Invalid signature");
}

// 4. Process event
var webhookEvent = JsonSerializer.Deserialize<RazorpayWebhookEvent>(webhookBody);
await ProcessWebhookEventAsync(webhookEvent);
```

**Why verify webhook signature?**
- Prevents fake webhook calls
- Ensures event is from Razorpay
- Protects against replay attacks
- Required for security compliance

### Handling Duplicate Webhooks

Razorpay may send the same webhook multiple times. We handle this with **idempotency**:

```csharp
// Check if webhook already processed
var existingWebhook = await _webhookRepository
  .GetByRazorpayPaymentIdAsync(razorpayPaymentId, eventType);

if (existingWebhook != null && existingWebhook.Status == "success") {
  return Ok("Already processed");
}

// Process webhook
// ...
```

---

## Caching Strategy

### What We Cache

```csharp
// Cache payment details (5 minutes)
var cacheKey = $"payment:{paymentId}";
var cachedPayment = await _cache.GetAsync<Payment>(cacheKey);

if (cachedPayment == null) {
  cachedPayment = await _paymentRepository.GetByIdAsync(paymentId);
  await _cache.SetAsync(cacheKey, cachedPayment, TimeSpan.FromMinutes(5));
}
```

### Cache Invalidation

```csharp
// Invalidate cache on payment status update
await _cache.RemoveAsync($"payment:{paymentId}");
await _cache.RemoveAsync($"payment:order:{orderId}");
await _cache.RemoveAsync($"payments:buyer:{buyerId}");
```

**Why cache?**
- Reduces database load
- Improves response time (<100ms)
- Handles high read traffic
- Cost-effective scaling

---

## Error Handling

### Razorpay API Errors

```csharp
try {
  var razorpayOrder = await _razorpayService.CreateOrderAsync(amount, currency);
} 
catch (RazorpayException ex) {
  // Log error
  _logger.LogError(ex, "Razorpay API error: {Error}", ex.Message);
  
  // Return user-friendly error
  return StatusCode(500, new ApiResponse {
    Success = false,
    Error = new Error {
      Code = "PAYMENT_CREATION_FAILED",
      Message = "Failed to create payment. Please try again."
    }
  });
}
```

### Database Errors

```csharp
try {
  await _paymentRepository.CreateAsync(payment);
}
catch (DbUpdateException ex) {
  _logger.LogError(ex, "Database error creating payment");
  
  return StatusCode(500, new ApiResponse {
    Success = false,
    Error = new Error {
      Code = "DATABASE_ERROR",
      Message = "Failed to save payment. Please try again."
    }
  });
}
```

---

## Security Considerations

### PCI-DSS Compliance

**RealServ is PCI-DSS compliant by:**
- Not storing card numbers
- Not storing CVV codes
- Using Razorpay (PCI Level 1 certified)
- Transmitting over HTTPS only
- Implementing signature verification

### Data Protection

```csharp
// We DO NOT store:
// - Card numbers
// - CVV codes
// - Card expiry dates
// - OTP codes

// We DO store:
// - Razorpay payment IDs (safe references)
// - Payment amounts
// - Payment status
// - Timestamps
```

### Signature Verification

All critical operations verify signatures:
- Payment verification (HMAC SHA256)
- Webhook processing (HMAC SHA256)
- API authentication (Firebase JWT)

---

## Performance Optimizations

### Database Indexes

```sql
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_buyer_id ON payments(buyer_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
```

**Why these indexes?**
- `order_id`: Frequent lookups by order
- `buyer_id`: List payments by buyer
- `payment_status`: Filter by status
- `created_at`: Sorted listings

### Connection Pooling

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=realserv_payment;Minimum Pool Size=5;Maximum Pool Size=20;Connection Lifetime=300"
}
```

**Why connection pooling?**
- Reuses database connections
- Reduces connection overhead
- Improves throughput
- Handles concurrent requests

---

## Monitoring & Observability

### Key Metrics

- **Payment Success Rate:** `successful_payments / total_payments * 100`
- **Average Payment Time:** From creation to success
- **Webhook Processing Time:** < 1 second
- **API Latency:** p95 < 100ms

### Logging

```csharp
_logger.LogInformation("Payment created: {PaymentId} for order: {OrderId}", payment.Id, orderId);
_logger.LogWarning("Payment verification failed: Invalid signature for payment: {PaymentId}", paymentId);
_logger.LogError(ex, "Razorpay API error creating payment for order: {OrderId}", orderId);
```

---

## Future Enhancements

1. **Multiple Payment Gateways:** Support Paytm, PhonePe, Stripe
2. **Recurring Payments:** Subscriptions for premium features
3. **Split Payments:** Multiple vendors in one order
4. **Payment Links:** Email/SMS payment links
5. **Saved Cards:** Tokenized card storage (PCI compliant)

---

## Related Documentation

- [Settlement Logic](./settlement-logic.md)
- [Razorpay Integration](./razorpay-integration.md)
- [API Reference](../../API_REFERENCE.md)
- [Error Codes](../reference/error-codes.md)

---

**Document Status:** ✅ Complete  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
