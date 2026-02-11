---
title: Troubleshooting Guide - Payment Service
service: Payment Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Troubleshooting Guide

**Service:** Payment Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Solutions to 15+ common issues with payment processing, refunds, settlements, and Razorpay integration.

---

## Table of Contents

1. [Payment Creation Issues](#payment-creation-issues)
2. [Payment Verification Issues](#payment-verification-issues)
3. [Refund Issues](#refund-issues)
4. [Settlement Issues](#settlement-issues)
5. [Webhook Issues](#webhook-issues)
6. [Database Connection Issues](#database-connection-issues)
7. [Redis Cache Issues](#redis-cache-issues)
8. [Razorpay API Issues](#razorpay-api-issues)
9. [Authentication Issues](#authentication-issues)
10. [Performance Issues](#performance-issues)

---

## Payment Creation Issues

### Problem: "INVALID_ORDER" error when creating payment

**Symptoms:**
```json
{
  "error": {
    "code": "INVALID_ORDER",
    "message": "Order cannot be paid (already paid, cancelled, or amount mismatch)"
  }
}
```

**Possible Causes:**
1. Order is already paid
2. Order is cancelled
3. Order total doesn't match payment amount
4. Order doesn't exist in Order Service

**Solutions:**

```bash
# 1. Check order status
curl -X GET http://localhost:5004/api/v1/orders/{orderId} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: Order should be in "pending" or "confirmed" status

# 2. Verify order total matches payment amount
# Order total should exactly match the payment amount

# 3. Check if order already has a successful payment
curl -X GET http://localhost:5007/api/v1/payments/order/{orderId} \
  -H "Authorization: Bearer YOUR_TOKEN"

# If payment exists with status "success", order is already paid
```

**Prevention:**
- Always verify order status before creating payment
- Use exact order total from Order Service
- Implement idempotency to prevent duplicate payments

---

### Problem: "PAYMENT_CREATION_FAILED" with Razorpay error

**Symptoms:**
```json
{
  "error": {
    "code": "PAYMENT_CREATION_FAILED",
    "details": "Razorpay API error: Invalid key_id"
  }
}
```

**Possible Causes:**
1. Invalid Razorpay credentials
2. Razorpay API is down
3. Network connectivity issues
4. Incorrect Razorpay mode (test vs live)

**Solutions:**

```bash
# 1. Verify Razorpay credentials
echo $RAZORPAY_KEY_ID
echo $RAZORPAY_KEY_SECRET

# Should start with rzp_test_ for test mode or rzp_live_ for live mode

# 2. Test Razorpay API connectivity
curl -u rzp_test_YOUR_KEY:YOUR_SECRET \
  https://api.razorpay.com/v1/payments

# Expected: 200 OK with empty list or error if credentials invalid

# 3. Check Razorpay dashboard
# Visit: https://dashboard.razorpay.com/
# Settings → API Keys → Verify keys are active

# 4. Check service logs
docker logs payment-service | grep "Razorpay"

# Look for connection errors or authentication failures
```

**Prevention:**
- Store Razorpay credentials in environment variables or secrets manager
- Use different credentials for each environment
- Monitor Razorpay status page: https://status.razorpay.com/

---

## Payment Verification Issues

### Problem: "INVALID_SIGNATURE" error when verifying payment

**Symptoms:**
```json
{
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Payment signature verification failed"
  }
}
```

**Possible Causes:**
1. Incorrect webhook secret
2. Tampered payment response
3. Wrong signature calculation
4. Network corruption

**Solutions:**

```csharp
// 1. Verify signature calculation
var message = $"{razorpayOrderId}|{razorpayPaymentId}";
var secret = Encoding.UTF8.GetBytes(_razorpayKeySecret);
var messageBytes = Encoding.UTF8.GetBytes(message);

using var hmac = new HMACSHA256(secret);
var hash = hmac.ComputeHash(messageBytes);
var computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

Console.WriteLine($"Expected: {razorpaySignature}");
Console.WriteLine($"Computed: {computedSignature}");

// 2. Verify webhook secret
echo $RAZORPAY_KEY_SECRET
# Should match the key secret from Razorpay dashboard

// 3. Check for whitespace or encoding issues
# Ensure no extra whitespace in concatenated string
# Use UTF-8 encoding consistently
```

**Prevention:**
- Use Razorpay's official SDKs for signature verification
- Double-check webhook secret matches dashboard
- Log signature mismatches for debugging

---

## Refund Issues

### Problem: "PAYMENT_NOT_ELIGIBLE" error when creating refund

**Symptoms:**
```json
{
  "error": {
    "code": "PAYMENT_NOT_ELIGIBLE",
    "message": "Payment is not eligible for refund (status: pending)"
  }
}
```

**Possible Causes:**
1. Payment status is not "success"
2. Payment is already fully refunded
3. Payment method doesn't support refunds

**Solutions:**

```bash
# 1. Check payment status
curl -X GET http://localhost:5007/api/v1/payments/{paymentId} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: payment_status should be "success"

# 2. Check existing refunds
curl -X GET http://localhost:5007/api/v1/refunds/payment/{paymentId} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Calculate: available_amount = payment.amount - sum(refunds.amount)

# 3. Ensure payment is captured (not just authorized)
# COD payments should be confirmed before refund
```

**Prevention:**
- Only attempt refunds on successful payments
- Check available refund amount before creating refund
- Wait for payment to be fully captured

---

### Problem: "REFUND_AMOUNT_EXCEEDED" error

**Symptoms:**
```json
{
  "error": {
    "code": "REFUND_AMOUNT_EXCEEDED",
    "message": "Refund amount exceeds payment amount"
  }
}
```

**Solutions:**

```javascript
// Calculate available refund amount
const payment = await fetch(`/api/v1/payments/${paymentId}`).then(r => r.json());
const refunds = await fetch(`/api/v1/refunds/payment/${paymentId}`).then(r => r.json());

const totalRefunded = refunds.data.reduce((sum, r) => sum + r.amount, 0);
const availableAmount = payment.data.amount - totalRefunded;

console.log(`Payment Amount: ₹${payment.data.amount}`);
console.log(`Total Refunded: ₹${totalRefunded}`);
console.log(`Available: ₹${availableAmount}`);

// Use availableAmount for refund request
```

---

### Problem: Refund stuck in "pending" status

**Possible Causes:**
1. Razorpay settlement balance insufficient
2. Payment not yet settled by Razorpay (5-7 days)
3. Razorpay API error

**Solutions:**

```bash
# 1. Check Razorpay dashboard for settlement balance
# Visit: https://dashboard.razorpay.com/
# Reports → Settlements

# 2. Check payment capture date
# Razorpay requires 5-7 days for settlement before refund

# 3. Check webhook logs for refund events
curl -X GET http://localhost:5007/api/v1/webhooks?event=refund.processed \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# 4. Manually trigger refund status check (if webhook missed)
# Contact Razorpay support or check refund status via dashboard
```

---

## Settlement Issues

### Problem: "SETTLEMENT_GENERATION_FAILED" - No payments found

**Symptoms:**
```json
{
  "error": {
    "code": "SETTLEMENT_GENERATION_FAILED",
    "details": "No successful payments found in date range"
  }
}
```

**Solutions:**

```bash
# 1. Verify date range
# Start date should be before end date
# Use ISO 8601 format: 2026-01-11T00:00:00Z

# 2. Check vendor has successful payments in range
curl -X GET "http://localhost:5007/api/v1/payments/vendor/{vendorId}?status=success&startDate=2026-01-01&endDate=2026-01-11" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Ensure payments are not already settled
# Check if payments are already included in previous settlements

# 4. Verify vendor ID is correct
curl -X GET http://localhost:5002/api/v1/vendors/{vendorId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Problem: Settlement amount calculation incorrect

**Expected Calculation:**
```
Order Amount: ₹5,000
Commission (10%): ₹500
Settlement Amount: ₹4,500
```

**Solutions:**

```bash
# 1. Verify commission percentage
# Default: 10.0%
# Check appsettings.json: SettlementSettings.DefaultCommissionPercentage

# 2. Manually calculate and compare
# settlement_amount = order_amount - (order_amount * commission_percentage / 100)

# 3. Check settlement line items
curl -X GET http://localhost:5007/api/v1/settlements/{settlementId}/line-items \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify each line item calculation
```

---

## Webhook Issues

### Problem: Webhooks not being received

**Possible Causes:**
1. Webhook URL not configured in Razorpay
2. Service not accessible from Razorpay servers
3. Firewall blocking webhook requests
4. Incorrect webhook secret

**Solutions:**

```bash
# 1. Verify webhook URL in Razorpay dashboard
# Settings → Webhooks
# URL should be: https://api.realserv.com/payment/api/v1/webhooks/razorpay
# For local testing: Use ngrok

# 2. Test webhook endpoint manually
curl -X POST http://localhost:5007/api/v1/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: test_signature" \
  -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test"}}}}'

# 3. Use ngrok for local testing
ngrok http 5007
# Update Razorpay webhook URL to ngrok URL

# 4. Check webhook logs
curl -X GET http://localhost:5007/api/v1/webhooks \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Look for recent webhook attempts
```

---

### Problem: Webhook signature verification failing

**Solutions:**

```bash
# 1. Verify webhook secret
echo $RAZORPAY_WEBHOOK_SECRET
# Should match webhook secret from Razorpay dashboard

# 2. Check webhook payload in logs
docker logs payment-service | grep "Webhook"

# 3. Manually verify signature
# signature = HMAC_SHA256(webhook_body, webhook_secret)
# Compare with X-Razorpay-Signature header

# 4. Ensure webhook secret is not the key secret
# Webhook secret is different from API key secret
```

---

## Database Connection Issues

### Problem: "Database connection timeout" error

**Symptoms:**
```
Failed to connect to database: Connection timeout
```

**Solutions:**

```bash
# 1. Verify PostgreSQL is running
docker ps | grep postgres
# OR
systemctl status postgresql

# 2. Test database connection
psql -h localhost -U postgres -d realserv_payment

# 3. Check connection string
echo $DB_CONNECTION_STRING
# Format: Host=localhost;Port=5432;Database=realserv_payment;Username=postgres;Password=postgres

# 4. Check PostgreSQL logs
docker logs postgres-container
# OR
tail -f /var/log/postgresql/postgresql-15-main.log

# 5. Verify network connectivity
telnet localhost 5432
# OR
nc -zv localhost 5432
```

**Prevention:**
- Use connection pooling (default: min 5, max 20 connections)
- Set reasonable connection timeout (default: 30 seconds)
- Monitor database resource usage

---

### Problem: "Too many connections" error

**Solutions:**

```sql
-- 1. Check current connections
SELECT count(*) FROM pg_stat_activity 
WHERE datname = 'realserv_payment';

-- 2. Check max connections
SHOW max_connections;

-- 3. Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'realserv_payment'
  AND state = 'idle'
  AND state_change < NOW() - INTERVAL '5 minutes';

-- 4. Increase max connections (postgresql.conf)
max_connections = 100
```

---

## Redis Cache Issues

### Problem: Cache not working / Redis connection failed

**Symptoms:**
```
Cache operation failed: Redis connection refused
```

**Solutions:**

```bash
# 1. Verify Redis is running
docker ps | grep redis
# OR
systemctl status redis

# 2. Test Redis connection
redis-cli -h localhost -p 6379 ping
# Expected: PONG

# 3. Check connection string
echo $REDIS_CONNECTION_STRING
# Format: localhost:6379

# 4. Test from service
telnet localhost 6379
# OR
nc -zv localhost 6379

# 5. Check Redis logs
docker logs redis-container
# OR
tail -f /var/log/redis/redis-server.log
```

**Note:** Service will continue without cache, but performance may degrade.

---

## Razorpay API Issues

### Problem: Razorpay API returning 500 errors

**Solutions:**

```bash
# 1. Check Razorpay status
curl https://status.razorpay.com/api/v2/status.json

# 2. Verify API is accessible
curl -u rzp_test_YOUR_KEY:YOUR_SECRET \
  https://api.razorpay.com/v1/payments

# 3. Check rate limits
# Razorpay has rate limits: ~1000 requests/min
# Implement exponential backoff for retries

# 4. Check service logs for detailed error
docker logs payment-service | grep "Razorpay API"
```

---

## Authentication Issues

### Problem: "UNAUTHORIZED" error

**Solutions:**

```bash
# 1. Verify Firebase token is present
# Header: Authorization: Bearer {FIREBASE_ID_TOKEN}

# 2. Get fresh token (tokens expire after 1 hour)
# JavaScript:
const token = await auth.currentUser.getIdToken(true); // Force refresh

# 3. Verify token format
# Token should be a long JWT string starting with "eyJ..."

# 4. Check Identity Service is running
curl http://localhost:5001/health
```

---

### Problem: "FORBIDDEN" error

**Solutions:**

```bash
# 1. Verify user role
# Buyers can only access their own payments
# Vendors can access their payments and settlements
# Admins can access all resources

# 2. Check user ID matches resource owner
# For payment: payment.buyer_id should match authenticated user
# For settlement: settlement.vendor_id should match authenticated user

# 3. Verify user type in Firebase custom claims
# Check Identity Service for user role
```

---

## Performance Issues

### Problem: Slow API responses

**Diagnostic Steps:**

```bash
# 1. Check database query performance
# Enable EF Core logging in appsettings.json:
"Microsoft.EntityFrameworkCore": "Information"

# 2. Check Redis cache hit rate
redis-cli INFO stats | grep keyspace

# 3. Monitor service resources
docker stats payment-service

# 4. Check database indexes
# Verify indexes exist on frequently queried columns
# See: docs/reference/database-schema.md

# 5. Analyze slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE query LIKE '%payments%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Solutions:**
- Enable Redis caching (default: enabled, 5 min TTL)
- Add database indexes on frequently queried columns
- Implement pagination for list endpoints
- Use connection pooling
- Scale horizontally (multiple service instances)

---

## Getting Help

### Check Service Logs

```bash
# Docker
docker logs payment-service --tail 100 -f

# Kubernetes
kubectl logs -f deployment/payment-service -n realserv

# Local
dotnet run
# Logs output to console
```

### Enable Debug Logging

```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

### Health Check

```bash
curl http://localhost:5007/health
# Expected: {"status": "Healthy"}
```

---

## Still Need Help?

- **API Reference:** [../../API_REFERENCE.md](../../API_REFERENCE.md)
- **Error Codes:** [error-codes.md](./error-codes.md)
- **Configuration:** [configuration.md](./configuration.md)
- **Contact Support:** backend@realserv.com

---

**Document Status:** ✅ Complete  
**Total Issues:** 15+  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
