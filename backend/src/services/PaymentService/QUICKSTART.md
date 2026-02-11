---
title: Quick Start - Payment Service
service: Payment Service
category: quickstart
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Quick Start - Payment Service

**Service:** Payment Service  
**Category:** Quick Start  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Get the Payment Service running in 5 minutes with Razorpay integration.

---

## Prerequisites

- **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/) or use Docker
- **Redis 7+** - [Download here](https://redis.io/download) or use Docker
- **Razorpay Account** - [Sign up here](https://dashboard.razorpay.com/signup) (free test account)
- **Docker Desktop** _(optional)_ - [Download here](https://www.docker.com/products/docker-desktop/)

---

## Step 1: Get Razorpay Credentials

### Create Razorpay Test Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a test account (free)
3. Navigate to **Settings → API Keys**
4. Generate test API keys
5. Copy **Key ID** and **Key Secret**

### Get Webhook Secret
1. Go to **Settings → Webhooks**
2. Click **Create Webhook**
3. Enter URL: `http://your-domain/api/v1/webhooks/razorpay`
4. Select events: `payment.captured`, `payment.failed`, `refund.processed`
5. Copy **Webhook Secret**

---

## Step 2: Clone & Configure

```bash
git clone https://github.com/realserv/backend.git
cd backend/src/services/PaymentService
```

Create `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "PaymentServiceDb": "Host=localhost;Port=5432;Database=realserv_payment;Username=postgres;Password=postgres",
    "Redis": "localhost:6379"
  },
  "Razorpay": {
    "KeyId": "rzp_test_YOUR_KEY_ID",
    "KeySecret": "YOUR_KEY_SECRET",
    "WebhookSecret": "YOUR_WEBHOOK_SECRET"
  },
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:3001"
  ]
}
```

---

## Step 3: Start Dependencies

```bash
# Start PostgreSQL and Redis
cd ../../../
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

**Verify dependencies:**
```bash
docker ps

# Expected output:
# postgres:15-alpine (port 5432)
# redis:7-alpine (port 6379)
```

---

## Step 4: Run Database Migrations

```bash
cd src/services/PaymentService
dotnet ef database update
```

**Expected output:**
```
Applying migration '20260111_InitialCreate'...
Done.
```

---

## Step 5: Start the Service

```bash
dotnet run
```

**Expected output:**
```
╔══════════════════════════════════════════════════════════╗
║   🚀 RealServ Payment Service                           ║
║   Port: 5007                                             ║
║   Features:                                              ║
║   💳 Razorpay Integration                                ║
║   💰 COD Management                                      ║
║   🔄 Refund Processing                                   ║
║   🏦 Vendor Settlements                                  ║
╚══════════════════════════════════════════════════════════╝

Now listening on: http://localhost:5007
```

---

## Step 6: Test the Service

### Health Check
```bash
curl http://localhost:5007/health
```

**Expected response:**
```json
{
  "status": "Healthy",
  "timestamp": "2026-01-11T12:00:00Z",
  "checks": {
    "database": "Healthy",
    "redis": "Healthy"
  }
}
```

### Create Payment
```bash
curl -X POST http://localhost:5007/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "buyerId": "buyer-uuid",
    "amount": 100.00,
    "currency": "INR",
    "paymentMethod": "online"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "orderId": "order-uuid",
    "amount": 100.00,
    "currency": "INR",
    "paymentStatus": "pending",
    "razorpayOrderId": "order_xyz123",
    "createdAt": "2026-01-11T12:00:00Z"
  }
}
```

---

## ✅ You're Done!

Your Payment Service is now running on **http://localhost:5007**

### Access Swagger UI
Open browser: **http://localhost:5007**

You'll see interactive API documentation with all 35 endpoints.

---

## 🧪 Test Payment Flow

### Step 1: Create Payment Order
```bash
curl -X POST http://localhost:5007/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test-order-123",
    "buyerId": "test-buyer-456",
    "amount": 100.00,
    "currency": "INR",
    "paymentMethod": "online"
  }'
```

Copy the `razorpayOrderId` from response.

### Step 2: Test Payment (Razorpay Test Mode)
Use Razorpay test checkout or test cards:
- **Success:** 4111 1111 1111 1111
- **Failure:** 4111 1111 1111 1112

### Step 3: Verify Payment
```bash
curl -X POST http://localhost:5007/api/v1/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayOrderId": "order_xyz",
    "razorpayPaymentId": "pay_abc",
    "razorpaySignature": "signature_from_razorpay"
  }'
```

---

## 🔧 Common Issues

### Port 5007 Already in Use

**Error:** `Address already in use`

**Solution:** Change port in `appsettings.json`:
```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5008"
      }
    }
  }
}
```

### Database Connection Failed

**Error:** `Connection refused`

**Solution:**
1. Verify PostgreSQL is running: `docker ps`
2. Check connection string in `appsettings.Development.json`
3. Ensure database exists:
   ```bash
   psql -U postgres -c "\l" | grep realserv_payment
   ```

### Redis Connection Failed

**Error:** `It was not possible to connect to the redis server`

**Solution:**
1. Verify Redis is running: `docker ps`
2. Test Redis connection: `redis-cli ping` (should return `PONG`)
3. Check connection string in `appsettings.Development.json`

### Razorpay Authentication Failed

**Error:** `Authentication failed`

**Solution:**
1. Verify Razorpay credentials are correct
2. Ensure you're using **test** mode keys (not live keys)
3. Check key format:
   - Key ID: `rzp_test_xxxxxxxxxx`
   - Key Secret: `xxxxxxxxxxxxxxxxxxx`

### Migration Failed

**Error:** `A connection to the database could not be established`

**Solution:**
```bash
# Reset database
dotnet ef database drop -f
dotnet ef database update
```

---

## 🌐 Test Webhooks Locally

Razorpay webhooks require a public URL. Use **ngrok** for local testing:

### Step 1: Install ngrok
```bash
# macOS
brew install ngrok

# Windows
choco install ngrok

# Linux
snap install ngrok
```

### Step 2: Start ngrok
```bash
ngrok http 5007
```

Copy the **https** forwarding URL (e.g., `https://abc123.ngrok.io`)

### Step 3: Configure Razorpay Webhook
1. Go to [Razorpay Dashboard → Webhooks](https://dashboard.razorpay.com/app/webhooks)
2. Click **Edit Webhook**
3. Update URL to: `https://abc123.ngrok.io/api/v1/webhooks/razorpay`
4. Save changes

### Step 4: Test Webhook
Make a test payment and watch the webhook logs:
```bash
curl http://localhost:5007/api/v1/webhooks
```

---

## 📝 Configuration Options

### appsettings.json Structure

```json
{
  "ConnectionStrings": {
    "PaymentServiceDb": "Host=localhost;Database=realserv_payment;...",
    "Redis": "localhost:6379"
  },
  "Razorpay": {
    "KeyId": "rzp_test_xxx",
    "KeySecret": "xxx",
    "WebhookSecret": "xxx"
  },
  "AllowedOrigins": ["http://localhost:3000"],
  "Caching": {
    "DefaultTTLMinutes": 5,
    "PaymentTTLMinutes": 1
  },
  "Pagination": {
    "DefaultPageSize": 20,
    "MaxPageSize": 100
  },
  "Services": {
    "OrderServiceUrl": "http://localhost:5004",
    "VendorServiceUrl": "http://localhost:5002"
  }
}
```

---

## 🐳 Docker Commands

### Start All Services

```bash
cd backend
docker-compose -f docker-compose.dev.yml up -d
```

### Stop All Services

```bash
docker-compose -f docker-compose.dev.yml down
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Payment service only
docker-compose -f docker-compose.dev.yml logs -f payment-service
```

---

## 🎯 Next Steps

1. **[API Reference](./API_REFERENCE.md)** - Explore all 35 endpoints
2. **[Payment Flow](./docs/payment-flow.md)** - Understand the payment lifecycle
3. **[Razorpay Integration](./docs/razorpay-integration.md)** - Deep dive into Razorpay
4. **[Webhook Handling](./docs/webhook-handling.md)** - Process payment events
5. **[Settlement Guide](./docs/settlement-guide.md)** - Vendor payouts

---

## 📞 Need Help?

- **Documentation:** [Full docs](./docs/)
- **API Reference:** [API_REFERENCE.md](./API_REFERENCE.md)
- **Razorpay Docs:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Examples:** [examples/](./examples/)
- **Issues:** Create an issue on GitHub
- **Email:** support@realserv.com

---

**Estimated Setup Time:** 5 minutes  
**Difficulty:** Easy ⭐⭐

---

**Updated:** January 11, 2026  
**Version:** 1.0.0
