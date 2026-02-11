---
title: Error Codes Reference - Payment Service
service: Payment Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Error Codes Reference

**Service:** Payment Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete reference of 25+ error codes with HTTP status codes, descriptions, and solutions.

---

## Table of Contents

1. [Payment Errors](#payment-errors)
2. [Refund Errors](#refund-errors)
3. [Settlement Errors](#settlement-errors)
4. [Webhook Errors](#webhook-errors)
5. [Authentication & Authorization Errors](#authentication--authorization-errors)
6. [Validation Errors](#validation-errors)
7. [System Errors](#system-errors)

---

## Payment Errors

### INVALID_ORDER

**HTTP Status:** `400 Bad Request`

**Description:**  
Order is not valid for payment. The order may already be paid, cancelled, or have an amount mismatch.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ORDER",
    "message": "Order cannot be paid (already paid, cancelled, or amount mismatch)"
  }
}
```

**Possible Causes:**
- Order is already paid
- Order is cancelled
- Order total doesn't match payment amount
- Order doesn't exist

**Solution:**
1. Check order status with Order Service
2. Verify order ID is correct
3. Ensure payment amount matches order total
4. Confirm order is in "pending" or "confirmed" status

---

### PAYMENT_CREATION_FAILED

**HTTP Status:** `500 Internal Server Error`

**Description:**  
Failed to create payment order. Usually caused by Razorpay API errors or database issues.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_CREATION_FAILED",
    "message": "Failed to create payment",
    "details": "Razorpay API error: Invalid key_id"
  }
}
```

**Possible Causes:**
- Invalid Razorpay credentials
- Razorpay API is down
- Database connection failure
- Network timeout

**Solution:**
1. Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
2. Check Razorpay dashboard for API status
3. Verify database connection
4. Check service logs for detailed error
5. Try test mode credentials first

---

### INVALID_SIGNATURE

**HTTP Status:** `400 Bad Request`

**Description:**  
Payment signature verification failed. The Razorpay signature doesn't match the expected HMAC SHA256 hash.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Payment signature verification failed"
  }
}
```

**Possible Causes:**
- Incorrect webhook secret
- Tampered payment response
- Network corruption
- Wrong signature calculation method

**Solution:**
1. Verify `RAZORPAY_KEY_SECRET` is correct
2. Check signature calculation: `HMAC_SHA256(order_id + "|" + payment_id, key_secret)`
3. Ensure no whitespace in concatenated string
4. Use Razorpay's official SDKs for signature verification

**Code Example (C#):**
```csharp
var message = $"{razorpayOrderId}|{razorpayPaymentId}";
var secret = Encoding.UTF8.GetBytes(_razorpayKeySecret);
var messageBytes = Encoding.UTF8.GetBytes(message);

using var hmac = new HMACSHA256(secret);
var hash = hmac.ComputeHash(messageBytes);
var computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

if (computedSignature != razorpaySignature)
{
    throw new Exception("Invalid signature");
}
```

---

### PAYMENT_NOT_FOUND

**HTTP Status:** `404 Not Found`

**Description:**  
Payment with the specified ID does not exist.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_NOT_FOUND",
    "message": "Payment not found"
  }
}
```

**Solution:**
1. Verify payment ID is correct (valid UUID)
2. Check if payment was created successfully
3. Try searching by order ID instead: `GET /api/v1/payments/order/{orderId}`

---

### COD_PAYMENT_CREATION_FAILED

**HTTP Status:** `500 Internal Server Error`

**Description:**  
Failed to create COD payment record in the database.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "COD_PAYMENT_CREATION_FAILED",
    "message": "Failed to create COD payment",
    "details": "Database connection timeout"
  }
}
```

**Solution:**
1. Check database connection
2. Verify all required fields are provided
3. Check service logs for database errors

---

### CANNOT_DELETE_PAYMENT

**HTTP Status:** `400 Bad Request`

**Description:**  
Cannot delete payment because it's not in "pending" status.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_PAYMENT",
    "message": "Cannot delete payment with status: success"
  }
}
```

**Solution:**
1. Only pending payments can be deleted
2. For successful payments, initiate a refund instead
3. For failed payments, keep the record for audit purposes

---

## Refund Errors

### PAYMENT_NOT_ELIGIBLE

**HTTP Status:** `400 Bad Request`

**Description:**  
Payment is not eligible for refund. Only successful payments can be refunded.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_NOT_ELIGIBLE",
    "message": "Payment is not eligible for refund (status: pending)"
  }
}
```

**Possible Causes:**
- Payment status is "pending"
- Payment status is "failed"
- Payment is already fully refunded
- Payment method doesn't support refunds

**Solution:**
1. Check payment status: `GET /api/v1/payments/{id}`
2. Only refund payments with status "success"
3. Verify refundable amount: `payment.amount - total_refunded_amount`

---

### REFUND_AMOUNT_EXCEEDED

**HTTP Status:** `400 Bad Request`

**Description:**  
Refund amount exceeds the available refundable amount.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "REFUND_AMOUNT_EXCEEDED",
    "message": "Refund amount exceeds payment amount"
  }
}
```

**Solution:**
1. Get payment details: `GET /api/v1/payments/{id}`
2. Calculate available amount: `payment.amount - sum(refunds.amount)`
3. Reduce refund amount to available amount
4. Consider partial refunds if needed

**Example Calculation:**
```
Payment Amount: ₹5,000
Previous Refunds: ₹2,000
Available for Refund: ₹3,000

✅ Valid: Request ₹3,000 or less
❌ Invalid: Request ₹3,500
```

---

### REFUND_CREATION_FAILED

**HTTP Status:** `500 Internal Server Error`

**Description:**  
Failed to create refund. Usually caused by Razorpay API errors.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "REFUND_CREATION_FAILED",
    "message": "Failed to create refund",
    "details": "Razorpay API: Insufficient settlement balance"
  }
}
```

**Possible Causes:**
- Insufficient Razorpay settlement balance
- Razorpay refund policy restrictions
- Invalid payment ID
- Razorpay API down

**Solution:**
1. Check Razorpay dashboard for settlement balance
2. Verify payment was captured (not just authorized)
3. Wait 5-7 days after payment for settlement
4. Contact Razorpay support if issue persists

---

### REFUND_NOT_FOUND

**HTTP Status:** `404 Not Found`

**Description:**  
Refund with the specified ID does not exist.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "REFUND_NOT_FOUND",
    "message": "Refund not found"
  }
}
```

**Solution:**
1. Verify refund ID is correct
2. Use `GET /api/v1/refunds/payment/{paymentId}` to list all refunds for a payment

---

### CANNOT_CANCEL_REFUND

**HTTP Status:** `400 Bad Request`

**Description:**  
Cannot cancel refund because it's already processed or failed.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_CANCEL_REFUND",
    "message": "Cannot cancel refund with status: processed"
  }
}
```

**Solution:**
- Only pending refunds can be cancelled
- Processed refunds cannot be reversed via API

---

## Settlement Errors

### SETTLEMENT_NOT_FOUND

**HTTP Status:** `404 Not Found`

**Description:**  
Settlement with the specified ID does not exist.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "SETTLEMENT_NOT_FOUND",
    "message": "Settlement not found"
  }
}
```

**Solution:**
1. Verify settlement ID is correct
2. Use `GET /api/v1/settlements/vendor/{vendorId}` to list vendor settlements

---

### SETTLEMENT_GENERATION_FAILED

**HTTP Status:** `500 Internal Server Error`

**Description:**  
Failed to generate settlement. Usually caused by invalid date range or no payments found.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "SETTLEMENT_GENERATION_FAILED",
    "message": "Failed to generate settlement",
    "details": "No successful payments found in date range"
  }
}
```

**Possible Causes:**
- No successful payments in date range
- Invalid start/end dates
- Vendor has no payments
- Database query timeout

**Solution:**
1. Verify date range is correct (start < end)
2. Check if vendor has successful payments: `GET /api/v1/payments/vendor/{vendorId}?status=success`
3. Use reasonable date ranges (max 90 days)
4. Ensure payments are not already settled

---

### CANNOT_PROCESS_SETTLEMENT

**HTTP Status:** `400 Bad Request`

**Description:**  
Cannot process settlement because it's not in "pending" status.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_PROCESS_SETTLEMENT",
    "message": "Cannot process settlement with status: processed"
  }
}
```

**Solution:**
- Only pending settlements can be processed
- Check settlement status first

---

### CANNOT_DELETE_SETTLEMENT

**HTTP Status:** `400 Bad Request`

**Description:**  
Cannot delete settlement because it's already processed.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_SETTLEMENT",
    "message": "Cannot delete settlement with status: processed"
  }
}
```

**Solution:**
- Only pending settlements can be deleted
- Processed settlements must remain for audit purposes

---

## Webhook Errors

### INVALID_WEBHOOK_SIGNATURE

**HTTP Status:** `400 Bad Request`

**Description:**  
Webhook signature verification failed. The Razorpay webhook signature is invalid.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_WEBHOOK_SIGNATURE",
    "message": "Webhook signature verification failed"
  }
}
```

**Possible Causes:**
- Incorrect webhook secret
- Tampered webhook payload
- Wrong signature header
- Replay attack

**Solution:**
1. Verify `RAZORPAY_WEBHOOK_SECRET` matches Razorpay dashboard
2. Check `X-Razorpay-Signature` header is present
3. Ensure webhook URL in Razorpay is correct
4. Signature calculation: `HMAC_SHA256(webhook_body, webhook_secret)`

**Security Note:**  
Always verify webhook signatures to prevent unauthorized webhook calls.

---

### WEBHOOK_PROCESSING_FAILED

**HTTP Status:** `500 Internal Server Error`

**Description:**  
Failed to process webhook event.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "WEBHOOK_PROCESSING_FAILED",
    "message": "Failed to process webhook",
    "details": "Payment not found for Razorpay ID: pay_xxx"
  }
}
```

**Solution:**
1. Check webhook logs: `GET /api/v1/webhooks`
2. Verify payment exists in database
3. Razorpay will auto-retry failed webhooks
4. Check service logs for detailed error

---

## Authentication & Authorization Errors

### UNAUTHORIZED

**HTTP Status:** `401 Unauthorized`

**Description:**  
Missing or invalid authentication token.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid authentication token"
  }
}
```

**Solution:**
1. Include `Authorization: Bearer {FIREBASE_ID_TOKEN}` header
2. Get fresh Firebase ID token (they expire after 1 hour)
3. Verify Firebase configuration is correct

**Get Token Example (JavaScript):**
```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const token = await auth.currentUser.getIdToken(true); // Force refresh
```

---

### FORBIDDEN

**HTTP Status:** `403 Forbidden`

**Description:**  
User doesn't have permission to access this resource.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to access this resource"
  }
}
```

**Possible Causes:**
- User role doesn't have permission
- Trying to access another user's payment
- Admin-only endpoint accessed by non-admin

**Solution:**
1. Verify user role in Identity Service
2. Buyers can only access their own payments
3. Vendors can only access their payments and settlements
4. Admins can access all resources

---

## Validation Errors

### VALIDATION_ERROR

**HTTP Status:** `400 Bad Request`

**Description:**  
Request validation failed. One or more fields are invalid.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "amount": "Amount must be greater than 0",
      "currency": "Currency must be 'INR'"
    }
  }
}
```

**Common Validation Rules:**
- `amount`: Must be > 0, max 2 decimal places
- `currency`: Must be "INR"
- `paymentMethod`: Must be "online" or "cod"
- `orderId`: Must be valid UUID
- `email`: Must be valid email format
- `phoneNumber`: Must be valid E.164 format (+91XXXXXXXXXX)

**Solution:**
1. Check API Reference for required fields
2. Validate data before sending request
3. Ensure correct data types

---

### INVALID_DATE_RANGE

**HTTP Status:** `400 Bad Request`

**Description:**  
Date range is invalid (start date after end date or too large).

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Start date must be before end date"
  }
}
```

**Solution:**
1. Ensure `startDate < endDate`
2. Use ISO 8601 format: `2026-01-11T00:00:00Z`
3. Keep date ranges reasonable (max 90 days for settlements)

---

## System Errors

### DATABASE_ERROR

**HTTP Status:** `500 Internal Server Error`

**Description:**  
Database operation failed.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Database operation failed",
    "details": "Connection timeout"
  }
}
```

**Solution:**
1. Retry the request (may be transient)
2. Check database connection string
3. Verify PostgreSQL is running
4. Check database logs

---

### CACHE_ERROR

**HTTP Status:** `500 Internal Server Error`

**Description:**  
Redis cache operation failed.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "CACHE_ERROR",
    "message": "Cache operation failed",
    "details": "Redis connection refused"
  }
}
```

**Solution:**
1. Service will continue without cache
2. Check Redis connection string
3. Verify Redis is running
4. Performance may be degraded

---

### RATE_LIMIT_EXCEEDED

**HTTP Status:** `429 Too Many Requests`

**Description:**  
Too many requests from this IP or user.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 30
  }
}
```

**Current Limits:**
- **Per IP:** 100 requests per minute
- **Per User:** 60 requests per minute

**Solution:**
1. Wait `retryAfter` seconds before retrying
2. Implement exponential backoff
3. Cache frequently accessed data
4. Contact support for higher limits

---

### EXTERNAL_API_ERROR

**HTTP Status:** `502 Bad Gateway`

**Description:**  
External API (Razorpay, Order Service, etc.) returned an error.

**Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_API_ERROR",
    "message": "External API error",
    "details": "Razorpay API: Service temporarily unavailable"
  }
}
```

**Solution:**
1. Retry with exponential backoff
2. Check Razorpay status page
3. Check other service status
4. Contact support if persists

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Optional detailed error information",
    "timestamp": "2026-01-11T10:30:00Z",
    "path": "/api/v1/payments/create",
    "requestId": "req-uuid-here"
  }
}
```

---

## Handling Errors in Code

### JavaScript Example

```javascript
async function createPayment(paymentData) {
  try {
    const response = await fetch('/api/v1/payments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (!data.success) {
      switch (data.error.code) {
        case 'INVALID_ORDER':
          alert('This order cannot be paid. Please check order status.');
          break;
        case 'PAYMENT_CREATION_FAILED':
          alert('Payment failed. Please try again later.');
          break;
        case 'UNAUTHORIZED':
          // Refresh token and retry
          await refreshFirebaseToken();
          return createPayment(paymentData);
        default:
          alert(`Error: ${data.error.message}`);
      }
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please check your connection.');
    return null;
  }
}
```

### C# Example

```csharp
public async Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request)
{
    try
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/v1/payments/create", 
            request
        );

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<PaymentResponse>>();

        if (!result.Success)
        {
            switch (result.Error.Code)
            {
                case "INVALID_ORDER":
                    throw new BusinessException("Order cannot be paid");
                case "PAYMENT_CREATION_FAILED":
                    throw new ExternalApiException("Razorpay API error");
                case "UNAUTHORIZED":
                    await RefreshTokenAsync();
                    return await CreatePaymentAsync(request);
                default:
                    throw new Exception(result.Error.Message);
            }
        }

        return result.Data;
    }
    catch (HttpRequestException ex)
    {
        _logger.LogError(ex, "Network error creating payment");
        throw new NetworkException("Network error", ex);
    }
}
```

---

## Need More Help?

- **API Reference:** [API_REFERENCE.md](../../API_REFERENCE.md)
- **Troubleshooting:** [troubleshooting.md](./troubleshooting.md)
- **Support:** backend@realserv.com

---

**Document Status:** ✅ Complete  
**Total Error Codes:** 25+  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
