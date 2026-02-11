---
title: Razorpay Integration - Payment Service
service: Payment Service
category: explanation
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Razorpay Integration

**Service:** Payment Service  
**Category:** Explanation  
**Last Updated:** January 11, 2026

> **Purpose:** Understand why and how RealServ uses Razorpay, including architecture decisions, security considerations, and best practices.

---

## Why Razorpay?

### Selection Criteria

RealServ chose Razorpay as the payment gateway based on:

1. **India-First Platform**
   - Optimized for Indian payment methods (UPI, cards, net banking)
   - Supports all major banks
   - Local currency (INR) native support
   - Regulatory compliance (RBI guidelines)

2. **Developer Experience**
   - Clean REST API
   - Comprehensive SDKs (C#, JavaScript, Python)
   - Excellent documentation
   - Active developer community
   - Webhooks for async events

3. **Features**
   - UPI payments (free for transactions < ₹2,000)
   - Card payments (Visa, Mastercard, Amex, RuPay)
   - Net banking (50+ banks)
   - Wallets (Paytm, PhonePe, Google Pay)
   - Refunds API
   - Payment links
   - Recurring payments (future)

4. **Pricing**
   - Competitive fees (2% + GST for most methods)
   - No setup fee
   - No monthly fee
   - Free UPI for small transactions

5. **Security**
   - PCI-DSS Level 1 certified
   - 3D Secure for cards
   - HMAC signature verification
   - Fraud detection
   - Two-factor authentication

6. **Reliability**
   - 99.9% uptime SLA
   - Redundant infrastructure
   - Fast settlements (T+3 days)
   - 24/7 support

---

## Architecture Overview

```
┌──────────────┐
│   RealServ   │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 1. Initiate Payment
       ▼
┌─────────────────┐
│ Payment Service │
│   (Backend)     │
└──────┬──────────┘
       │
       │ 2. Create Order
       ▼
┌─────────────────┐
│   Razorpay API  │
│ api.razorpay.com│
└──────┬──────────┘
       │
       │ 3. Return Order ID
       ▼
┌─────────────────┐
│ Payment Service │
└──────┬──────────┘
       │
       │ 4. Return to Frontend
       ▼
┌──────────────┐
│   RealServ   │
│ Razorpay SDK │
└──────┬───────┘
       │
       │ 5. Buyer Completes Payment
       ▼
┌─────────────────┐
│  Razorpay       │
│  (Checkout)     │
└──────┬──────────┘
       │
       │ 6. Return Success Response
       ▼
┌──────────────┐
│   RealServ   │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 7. Verify Signature
       ▼
┌─────────────────┐
│ Payment Service │
│   (Backend)     │
└──────┬──────────┘
       │
       │ 8. Webhook (Async)
       ◄──────────────────┐
┌──────────────────┐      │
│   Razorpay       │──────┘
│   (Webhooks)     │
└──────────────────┘
```

---

## API Integration

### Authentication

Razorpay uses HTTP Basic Auth with API key:

```http
Authorization: Basic base64(key_id:key_secret)
```

**Example:**
```bash
curl -u rzp_test_YOUR_KEY_ID:YOUR_KEY_SECRET \
  https://api.razorpay.com/v1/orders
```

**C# Implementation:**
```csharp
public class RazorpayService
{
    private readonly HttpClient _httpClient;
    private readonly string _keyId;
    private readonly string _keySecret;
    
    public RazorpayService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _keyId = config["RazorpaySettings:KeyId"];
        _keySecret = config["RazorpaySettings:KeySecret"];
        
        // Set basic auth header
        var authBytes = Encoding.UTF8.GetBytes($"{_keyId}:{_keySecret}");
        var authHeader = Convert.ToBase64String(authBytes);
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Basic", authHeader);
    }
}
```

---

## Order Creation

### Why Create Orders?

Razorpay requires creating an "order" before payment:

1. **Amount Locking:** Prevents amount tampering on frontend
2. **Receipt Tracking:** Links payment to your internal order
3. **Metadata:** Attach custom data to payment
4. **Signature Verification:** Enables secure verification

### Order Creation Flow

```csharp
public async Task<Dictionary<string, object>> CreateOrderAsync(
    decimal amount,
    string currency,
    string receiptId,
    Dictionary<string, object> notes)
{
    var request = new
    {
        amount = (int)(amount * 100), // Convert to paise
        currency = currency,
        receipt = receiptId,
        notes = notes
    };
    
    var response = await _httpClient.PostAsJsonAsync(
        "https://api.razorpay.com/v1/orders",
        request
    );
    
    var order = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
    return order;
}
```

**Request:**
```json
{
  "amount": 500000,
  "currency": "INR",
  "receipt": "payment-uuid",
  "notes": {
    "order_id": "order-uuid",
    "buyer_id": "buyer-uuid"
  }
}
```

**Response:**
```json
{
  "id": "order_MjH5xQz9X7kLqP",
  "entity": "order",
  "amount": 500000,
  "amount_paid": 0,
  "amount_due": 500000,
  "currency": "INR",
  "receipt": "payment-uuid",
  "status": "created",
  "created_at": 1705050720
}
```

---

## Frontend Integration

### Razorpay Checkout

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

```javascript
const options = {
  // Your key ID (public, safe to expose)
  key: 'rzp_test_YOUR_KEY_ID',
  
  // Amount in paise (₹50.00 = 5000 paise)
  amount: 500000,
  currency: 'INR',
  
  // Order ID from backend
  order_id: 'order_MjH5xQz9X7kLqP',
  
  // Business details
  name: 'RealServ',
  description: 'Order #ORD-2026-0001',
  image: 'https://realserv.com/logo.png',
  
  // Buyer pre-fill
  prefill: {
    name: 'Vishal Chauhan',
    email: 'rajesh@example.com',
    contact: '+917906441952'
  },
  
  // Theme
  theme: {
    color: '#2C5530' // RealServ brand color
  },
  
  // Success handler
  handler: async function (response) {
    // response.razorpay_order_id
    // response.razorpay_payment_id
    // response.razorpay_signature
    
    await verifyPayment(response);
  },
  
  // Modal settings
  modal: {
    ondismiss: function () {
      alert('Payment cancelled');
    }
  }
};

const razorpay = new Razorpay(options);
razorpay.open();
```

**Why Razorpay SDK?**
- Handles all payment methods (UPI, cards, etc.)
- Manages 3D Secure authentication
- Handles errors and retries
- Mobile-optimized UI
- PCI-DSS compliant

---

## Signature Verification

### Why Verify Signatures?

**Critical for security:**
1. Prevents payment fraud
2. Ensures response is genuine
3. Protects against MITM attacks
4. Required by PCI-DSS

### Payment Signature

**Algorithm:** HMAC SHA256

**Message:**
```
razorpay_order_id + "|" + razorpay_payment_id
```

**Secret:** Razorpay Key Secret

**Implementation:**
```csharp
public bool VerifyPaymentSignature(
    string razorpayOrderId,
    string razorpayPaymentId,
    string razorpaySignature)
{
    var message = $"{razorpayOrderId}|{razorpayPaymentId}";
    var secret = Encoding.UTF8.GetBytes(_razorpayKeySecret);
    var messageBytes = Encoding.UTF8.GetBytes(message);
    
    using var hmac = new HMACSHA256(secret);
    var hash = hmac.ComputeHash(messageBytes);
    var computedSignature = BitConverter.ToString(hash)
        .Replace("-", "")
        .ToLower();
    
    return computedSignature == razorpaySignature.ToLower();
}
```

**Example:**
```
Order ID: order_MjH5xQz9X7kLqP
Payment ID: pay_MjH5yfRKLPZwHR
Message: order_MjH5xQz9X7kLqP|pay_MjH5yfRKLPZwHR
Secret: YOUR_KEY_SECRET
Signature: 9e7f8c6b5a4d3e2f1c0b9a8d7e6f5c4b3a2d1e0f9c8b7a6d5e4f3c2b1a0d9e8f
```

---

## Webhook Integration

### Why Webhooks?

Frontend-only verification has limitations:
1. **Network Issues:** Buyer may close browser before verification
2. **Async Events:** Refund status changes happen later
3. **Reliability:** Webhooks provide guaranteed delivery
4. **Reconciliation:** Catch missed updates

### Webhook Events

RealServ listens to these events:

```
payment.captured  → Payment successfully captured
payment.failed    → Payment failed
refund.processed  → Refund completed
refund.failed     → Refund failed
```

### Webhook Signature Verification

**Algorithm:** HMAC SHA256

**Message:** Full webhook body (raw JSON)

**Secret:** Webhook Secret (different from Key Secret!)

**Implementation:**
```csharp
[HttpPost("razorpay")]
public async Task<IActionResult> HandleRazorpayWebhook()
{
    // Read raw body
    using var reader = new StreamReader(Request.Body);
    var webhookBody = await reader.ReadToEndAsync();
    
    // Get signature from header
    var signature = Request.Headers["X-Razorpay-Signature"].ToString();
    
    // Verify signature
    if (!VerifyWebhookSignature(webhookBody, signature))
    {
        return BadRequest(new { error = "Invalid signature" });
    }
    
    // Parse and process event
    var webhookEvent = JsonSerializer.Deserialize<RazorpayWebhookEvent>(webhookBody);
    await ProcessWebhookEventAsync(webhookEvent);
    
    return Ok(new { status = "success" });
}

private bool VerifyWebhookSignature(string body, string signature)
{
    var secret = Encoding.UTF8.GetBytes(_webhookSecret);
    var bodyBytes = Encoding.UTF8.GetBytes(body);
    
    using var hmac = new HMACSHA256(secret);
    var hash = hmac.ComputeHash(bodyBytes);
    var computedSignature = BitConverter.ToString(hash)
        .Replace("-", "")
        .ToLower();
    
    return computedSignature == signature.ToLower();
}
```

### Webhook Idempotency

Razorpay may send duplicate webhooks. Handle with idempotency:

```csharp
private async Task ProcessWebhookEventAsync(RazorpayWebhookEvent webhookEvent)
{
    var razorpayPaymentId = webhookEvent.Payload.Payment.Entity.Id;
    var eventType = webhookEvent.Event;
    
    // Check if already processed
    var existing = await _webhookRepository.GetByPaymentIdAndEventAsync(
        razorpayPaymentId,
        eventType
    );
    
    if (existing != null && existing.Status == "success")
    {
        _logger.LogInformation("Webhook already processed: {PaymentId}", razorpayPaymentId);
        return;
    }
    
    // Process webhook
    // ...
}
```

---

## Refund Processing

### Refund API

```csharp
public async Task<Dictionary<string, object>> CreateRefundAsync(
    string razorpayPaymentId,
    decimal amount,
    string notes)
{
    var request = new
    {
        amount = (int)(amount * 100), // Paise
        notes = notes
    };
    
    var response = await _httpClient.PostAsJsonAsync(
        $"https://api.razorpay.com/v1/payments/{razorpayPaymentId}/refund",
        request
    );
    
    var refund = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
    return refund;
}
```

**Request:**
```json
{
  "amount": 500000,
  "notes": {
    "reason": "Order cancelled by buyer"
  }
}
```

**Response:**
```json
{
  "id": "rfnd_MjH6VxJkL8wPqR",
  "entity": "refund",
  "amount": 500000,
  "currency": "INR",
  "payment_id": "pay_MjH5yfRKLPZwHR",
  "notes": {
    "reason": "Order cancelled by buyer"
  },
  "status": "processed",
  "created_at": 1705054320
}
```

### Refund Timing

- **Instant Refunds:** Cards refunded in 5-7 business days
- **UPI Refunds:** Refunded in 1-3 business days
- **Net Banking:** Refunded in 5-7 business days

---

## Error Handling

### Razorpay Error Codes

```csharp
try
{
    var order = await _razorpayService.CreateOrderAsync(amount, currency);
}
catch (RazorpayException ex)
{
    switch (ex.Error.Code)
    {
        case "BAD_REQUEST_ERROR":
            // Invalid parameters
            break;
        case "GATEWAY_ERROR":
            // Payment gateway error
            break;
        case "SERVER_ERROR":
            // Razorpay server error
            break;
        default:
            // Unknown error
            break;
    }
}
```

### Retry Logic

```csharp
public async Task<T> ExecuteWithRetryAsync<T>(
    Func<Task<T>> operation,
    int maxRetries = 3)
{
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            return await operation();
        }
        catch (HttpRequestException) when (i < maxRetries - 1)
        {
            var delay = TimeSpan.FromSeconds(Math.Pow(2, i)); // Exponential backoff
            await Task.Delay(delay);
        }
    }
    
    throw new Exception("Max retries exceeded");
}
```

---

## Security Best Practices

### 1. Secure Credential Storage

```csharp
// ❌ DON'T: Hardcode credentials
var keyId = "rzp_live_XXXXXXXXXXXX";

// ✅ DO: Use environment variables
var keyId = Environment.GetEnvironmentVariable("RAZORPAY_KEY_ID");

// ✅ DO: Use AWS Secrets Manager (production)
var keyId = await _secretsManager.GetSecretAsync("realserv/payment/razorpay-key-id");
```

### 2. Always Verify Signatures

```csharp
// ❌ DON'T: Trust frontend data
var payment = await _repository.GetByRazorpayPaymentIdAsync(razorpayPaymentId);
payment.Status = "success"; // DANGEROUS!

// ✅ DO: Verify signature first
if (!VerifyPaymentSignature(razorpayOrderId, razorpayPaymentId, signature))
{
    throw new SecurityException("Invalid signature");
}
payment.Status = "success";
```

### 3. Use HTTPS Only

```csharp
// Production: Enforce HTTPS
app.UseHttpsRedirection();
app.UseHsts();

// Webhook URL must be HTTPS
// https://api.realserv.com/payment/api/v1/webhooks/razorpay
```

### 4. Separate Test and Live Keys

```
Development:  rzp_test_XXXXX
Staging:      rzp_test_XXXXX (different from dev)
Production:   rzp_live_XXXXX
```

---

## Testing

### Test Cards

```
Success: 4111 1111 1111 1111
Failure: 4111 1111 1111 1112
3D Secure: 4000 0000 0000 3063
```

### Test UPI

```
Success: success@razorpay
Failure: failure@razorpay
```

### Test Webhook

```bash
# Simulate webhook locally
curl -X POST http://localhost:5007/api/v1/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: YOUR_SIGNATURE" \
  -d @webhook-payload.json
```

---

## Monitoring

### Key Metrics

- **Payment Success Rate:** % of successful payments
- **Average Payment Time:** Order creation to capture
- **Refund Processing Time:** Refund initiation to processed
- **Webhook Delivery Time:** < 1 second

### Alerts

```csharp
// Alert if payment success rate drops below 95%
if (successRate < 95)
{
    await _alertingService.SendAlertAsync(
        "Payment success rate dropped to {successRate}%"
    );
}

// Alert if webhooks failing
if (webhookFailureRate > 5)
{
    await _alertingService.SendAlertAsync(
        "Webhook failure rate: {webhookFailureRate}%"
    );
}
```

---

## Cost Optimization

### 1. Use UPI for Small Transactions

UPI is free for transactions < ₹2,000:

```
Order < ₹2,000: Prefer UPI (0% fee)
Order ≥ ₹2,000: All methods (2% fee)
```

### 2. Batch Refunds

Process refunds in batches to reduce API calls.

### 3. Cache Payment Methods

Cache supported payment methods instead of fetching on every request.

---

## Related Documentation

- [Payment Processing](./payment-processing.md)
- [Razorpay Setup Guide](../how-to-guides/razorpay-integration.md)
- [API Reference](../../API_REFERENCE.md)
- [Error Codes](../reference/error-codes.md)

---

**Document Status:** ✅ Complete  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
