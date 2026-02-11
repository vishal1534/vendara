---
title: Configuration Reference - Payment Service
service: Payment Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Configuration Reference

**Service:** Payment Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete configuration reference for development, staging, and production environments.

---

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [appsettings.json](#appsettingsjson)
3. [Development Configuration](#development-configuration)
4. [Staging Configuration](#staging-configuration)
5. [Production Configuration](#production-configuration)
6. [Razorpay Configuration](#razorpay-configuration)
7. [Database Configuration](#database-configuration)
8. [Redis Configuration](#redis-configuration)

---

## Environment Variables

### Required Variables

```bash
# ASP.NET Core Environment
ASPNETCORE_ENVIRONMENT=Development  # Development | Staging | Production

# Database
DB_CONNECTION_STRING=Host=localhost;Port=5432;Database=realserv_payment;Username=postgres;Password=postgres

# Redis Cache
REDIS_CONNECTION_STRING=localhost:6379

# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

### Optional Variables

```bash
# CORS (comma-separated)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://app.realserv.com

# Cache Settings
CACHE_TTL_MINUTES=5                # Default: 5 minutes
CACHE_ENABLED=true                 # Default: true

# Service URLs
ORDER_SERVICE_URL=http://localhost:5004
IDENTITY_SERVICE_URL=http://localhost:5001
VENDOR_SERVICE_URL=http://localhost:5002

# Pagination
DEFAULT_PAGE_SIZE=20               # Default: 20
MAX_PAGE_SIZE=100                  # Default: 100

# Razorpay
RAZORPAY_TIMEOUT_SECONDS=30        # Default: 30
RAZORPAY_CURRENCY=INR              # Default: INR

# Settlement
COMMISSION_PERCENTAGE=10.0         # Default: 10.0%

# Logging
LOG_LEVEL=Information              # Trace | Debug | Information | Warning | Error | Critical
```

---

## appsettings.json

### Base Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "${DB_CONNECTION_STRING}",
    "RedisConnection": "${REDIS_CONNECTION_STRING}"
  },
  "RazorpaySettings": {
    "KeyId": "${RAZORPAY_KEY_ID}",
    "KeySecret": "${RAZORPAY_KEY_SECRET}",
    "WebhookSecret": "${RAZORPAY_WEBHOOK_SECRET}",
    "Currency": "INR",
    "TimeoutSeconds": 30,
    "RetryAttempts": 3,
    "RetryDelayMs": 1000
  },
  "CacheSettings": {
    "Enabled": true,
    "DefaultTTLMinutes": 5,
    "PaymentCacheTTLMinutes": 5,
    "SettlementCacheTTLMinutes": 10
  },
  "ServiceUrls": {
    "OrderService": "${ORDER_SERVICE_URL}",
    "IdentityService": "${IDENTITY_SERVICE_URL}",
    "VendorService": "${VENDOR_SERVICE_URL}"
  },
  "PaginationSettings": {
    "DefaultPageSize": 20,
    "MaxPageSize": 100
  },
  "SettlementSettings": {
    "DefaultCommissionPercentage": 10.0,
    "MinSettlementAmount": 100.0,
    "MaxSettlementDays": 90
  },
  "CorsSettings": {
    "AllowedOrigins": "${CORS_ALLOWED_ORIGINS}"
  }
}
```

---

## Development Configuration

### appsettings.Development.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=realserv_payment_dev;Username=postgres;Password=postgres",
    "RedisConnection": "localhost:6379"
  },
  "RazorpaySettings": {
    "KeyId": "rzp_test_DEVELOPMENT_KEY",
    "KeySecret": "DEVELOPMENT_SECRET",
    "WebhookSecret": "DEVELOPMENT_WEBHOOK_SECRET",
    "Currency": "INR"
  },
  "CacheSettings": {
    "Enabled": true,
    "DefaultTTLMinutes": 1
  },
  "ServiceUrls": {
    "OrderService": "http://localhost:5004",
    "IdentityService": "http://localhost:5001",
    "VendorService": "http://localhost:5002"
  },
  "CorsSettings": {
    "AllowedOrigins": "http://localhost:3000,http://localhost:3001"
  }
}
```

### Environment Variables (.env)

```bash
# Development Environment
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5007

# Database
DB_CONNECTION_STRING=Host=localhost;Port=5432;Database=realserv_payment_dev;Username=postgres;Password=postgres

# Redis
REDIS_CONNECTION_STRING=localhost:6379

# Razorpay Test Credentials
RAZORPAY_KEY_ID=rzp_test_DEVELOPMENT_KEY
RAZORPAY_KEY_SECRET=DEVELOPMENT_SECRET
RAZORPAY_WEBHOOK_SECRET=DEVELOPMENT_WEBHOOK_SECRET

# Service URLs
ORDER_SERVICE_URL=http://localhost:5004
IDENTITY_SERVICE_URL=http://localhost:5001
VENDOR_SERVICE_URL=http://localhost:5002

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Cache
CACHE_TTL_MINUTES=1
CACHE_ENABLED=true

# Logging
LOG_LEVEL=Debug
```

---

## Staging Configuration

### appsettings.Staging.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "${DB_CONNECTION_STRING}",
    "RedisConnection": "${REDIS_CONNECTION_STRING}"
  },
  "RazorpaySettings": {
    "KeyId": "${RAZORPAY_KEY_ID}",
    "KeySecret": "${RAZORPAY_KEY_SECRET}",
    "WebhookSecret": "${RAZORPAY_WEBHOOK_SECRET}"
  },
  "CacheSettings": {
    "Enabled": true,
    "DefaultTTLMinutes": 3
  },
  "ServiceUrls": {
    "OrderService": "https://staging-api.realserv.com/order",
    "IdentityService": "https://staging-api.realserv.com/identity",
    "VendorService": "https://staging-api.realserv.com/vendor"
  },
  "CorsSettings": {
    "AllowedOrigins": "https://staging-app.realserv.com,https://staging-vendor.realserv.com"
  }
}
```

### Environment Variables (AWS Parameter Store)

```bash
ASPNETCORE_ENVIRONMENT=Staging
ASPNETCORE_URLS=http://+:8080

# RDS PostgreSQL
DB_CONNECTION_STRING=Host=staging-db.xxxx.ap-south-1.rds.amazonaws.com;Port=5432;Database=realserv_payment;Username=realserv_admin;Password=XXXXX;SSL Mode=Require;Trust Server Certificate=true

# ElastiCache Redis
REDIS_CONNECTION_STRING=staging-redis.xxxx.cache.amazonaws.com:6379

# Razorpay Test Credentials
RAZORPAY_KEY_ID=rzp_test_STAGING_KEY
RAZORPAY_KEY_SECRET=STAGING_SECRET
RAZORPAY_WEBHOOK_SECRET=STAGING_WEBHOOK_SECRET

# Internal Service URLs
ORDER_SERVICE_URL=https://staging-api.realserv.com/order
IDENTITY_SERVICE_URL=https://staging-api.realserv.com/identity
VENDOR_SERVICE_URL=https://staging-api.realserv.com/vendor

# CORS
CORS_ALLOWED_ORIGINS=https://staging-app.realserv.com,https://staging-vendor.realserv.com

# Cache
CACHE_TTL_MINUTES=3
```

---

## Production Configuration

### appsettings.Production.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "${DB_CONNECTION_STRING}",
    "RedisConnection": "${REDIS_CONNECTION_STRING}"
  },
  "RazorpaySettings": {
    "KeyId": "${RAZORPAY_KEY_ID}",
    "KeySecret": "${RAZORPAY_KEY_SECRET}",
    "WebhookSecret": "${RAZORPAY_WEBHOOK_SECRET}"
  },
  "CacheSettings": {
    "Enabled": true,
    "DefaultTTLMinutes": 5
  },
  "ServiceUrls": {
    "OrderService": "https://api.realserv.com/order",
    "IdentityService": "https://api.realserv.com/identity",
    "VendorService": "https://api.realserv.com/vendor"
  },
  "CorsSettings": {
    "AllowedOrigins": "https://app.realserv.com,https://vendor.realserv.com,https://admin.realserv.com"
  }
}
```

### Environment Variables (AWS Secrets Manager)

```bash
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080

# RDS PostgreSQL (Production)
DB_CONNECTION_STRING=Host=prod-db.xxxx.ap-south-1.rds.amazonaws.com;Port=5432;Database=realserv_payment;Username=realserv_admin;Password=SECURE_PASSWORD;SSL Mode=Require;Trust Server Certificate=true

# ElastiCache Redis (Production)
REDIS_CONNECTION_STRING=prod-redis.xxxx.cache.amazonaws.com:6379,ssl=true,password=REDIS_PASSWORD

# Razorpay LIVE Credentials (NEVER COMMIT!)
RAZORPAY_KEY_ID=rzp_live_PRODUCTION_KEY
RAZORPAY_KEY_SECRET=PRODUCTION_SECRET
RAZORPAY_WEBHOOK_SECRET=PRODUCTION_WEBHOOK_SECRET

# Internal Service URLs
ORDER_SERVICE_URL=https://api.realserv.com/order
IDENTITY_SERVICE_URL=https://api.realserv.com/identity
VENDOR_SERVICE_URL=https://api.realserv.com/vendor

# CORS (Production Domains)
CORS_ALLOWED_ORIGINS=https://app.realserv.com,https://vendor.realserv.com,https://admin.realserv.com

# Cache
CACHE_TTL_MINUTES=5
CACHE_ENABLED=true

# Logging
LOG_LEVEL=Warning
```

---

## Razorpay Configuration

### Test Mode (Development/Staging)

```json
{
  "RazorpaySettings": {
    "KeyId": "rzp_test_YOUR_KEY_ID",
    "KeySecret": "YOUR_KEY_SECRET",
    "WebhookSecret": "YOUR_WEBHOOK_SECRET",
    "Currency": "INR",
    "TimeoutSeconds": 30,
    "RetryAttempts": 3,
    "RetryDelayMs": 1000,
    "WebhookEvents": [
      "payment.captured",
      "payment.failed",
      "refund.processed",
      "refund.failed"
    ]
  }
}
```

### Live Mode (Production)

```json
{
  "RazorpaySettings": {
    "KeyId": "rzp_live_YOUR_KEY_ID",
    "KeySecret": "YOUR_KEY_SECRET",
    "WebhookSecret": "YOUR_WEBHOOK_SECRET",
    "Currency": "INR",
    "TimeoutSeconds": 30,
    "RetryAttempts": 3,
    "RetryDelayMs": 1000,
    "WebhookEvents": [
      "payment.captured",
      "payment.failed",
      "refund.processed",
      "refund.failed"
    ]
  }
}
```

### How to Get Razorpay Credentials

1. **Sign up:** https://dashboard.razorpay.com/signup
2. **Navigate to:** Settings → API Keys
3. **Generate Keys:**
   - Test Mode: `rzp_test_XXXXX`
   - Live Mode: `rzp_live_XXXXX`
4. **Get Webhook Secret:**
   - Settings → Webhooks
   - Create Webhook with URL: `https://api.realserv.com/payment/api/v1/webhooks/razorpay`
   - Select events: `payment.captured`, `payment.failed`, `refund.processed`
   - Copy webhook secret

---

## Database Configuration

### PostgreSQL Connection String Format

```
Host={HOST};Port={PORT};Database={DATABASE};Username={USERNAME};Password={PASSWORD};SSL Mode={SSL_MODE};Trust Server Certificate={TRUST_CERT}
```

### Development

```bash
Host=localhost;Port=5432;Database=realserv_payment_dev;Username=postgres;Password=postgres
```

### Production (RDS)

```bash
Host=prod-db.xxxx.ap-south-1.rds.amazonaws.com;Port=5432;Database=realserv_payment;Username=realserv_admin;Password=SECURE_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
```

### Connection Pool Settings (EF Core)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=realserv_payment;Username=postgres;Password=postgres;Minimum Pool Size=5;Maximum Pool Size=20;Connection Lifetime=300;"
  }
}
```

---

## Redis Configuration

### Local Development

```bash
REDIS_CONNECTION_STRING=localhost:6379
```

### ElastiCache (AWS)

```bash
# Without SSL
REDIS_CONNECTION_STRING=prod-redis.xxxx.cache.amazonaws.com:6379

# With SSL and Password
REDIS_CONNECTION_STRING=prod-redis.xxxx.cache.amazonaws.com:6379,ssl=true,password=REDIS_PASSWORD
```

### Cache Settings

```json
{
  "CacheSettings": {
    "Enabled": true,
    "DefaultTTLMinutes": 5,
    "PaymentCacheTTLMinutes": 5,
    "SettlementCacheTTLMinutes": 10,
    "KeyPrefix": "payment:",
    "ConnectRetry": 3,
    "ConnectTimeout": 5000,
    "SyncTimeout": 1000
  }
}
```

---

## Configuration Loading Order

1. **appsettings.json** (base configuration)
2. **appsettings.{Environment}.json** (environment-specific overrides)
3. **Environment Variables** (highest priority)
4. **AWS Parameter Store / Secrets Manager** (production)

---

## Security Best Practices

### ✅ DO

- **Store secrets in environment variables or AWS Secrets Manager**
- **Use different credentials for each environment**
- **Enable SSL for database connections in production**
- **Rotate Razorpay secrets regularly**
- **Use IAM roles for AWS resources**
- **Enable Redis password protection in production**

### ❌ DON'T

- **Never commit `appsettings.Production.json` with real credentials**
- **Never commit `.env` files**
- **Never hardcode API keys or secrets**
- **Never use production credentials in development**
- **Never share Razorpay live keys**

---

## Docker Configuration

### docker-compose.yml (Development)

```yaml
version: '3.8'

services:
  payment-service:
    build: .
    ports:
      - "5007:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - DB_CONNECTION_STRING=Host=postgres;Port=5432;Database=realserv_payment;Username=postgres;Password=postgres
      - REDIS_CONNECTION_STRING=redis:6379
      - RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
      - RAZORPAY_KEY_SECRET=YOUR_SECRET
      - RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=realserv_payment
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## Verifying Configuration

### Check Environment Variables

```bash
# Linux/Mac
env | grep RAZORPAY
env | grep DB_CONNECTION

# Windows PowerShell
Get-ChildItem Env: | Where-Object {$_.Name -like "*RAZORPAY*"}
```

### Test Database Connection

```bash
dotnet ef database update --dry-run
```

### Test Redis Connection

```bash
redis-cli -h localhost -p 6379 ping
# Expected: PONG
```

### Test Razorpay Configuration

```bash
curl -u rzp_test_YOUR_KEY:YOUR_SECRET https://api.razorpay.com/v1/payments
# Expected: 200 OK with empty list
```

---

## Need More Help?

- **Deployment Guide:** [how-to-guides/deploy-to-production.md](../how-to-guides/deploy-to-production.md)
- **Razorpay Setup:** [how-to-guides/razorpay-integration.md](../how-to-guides/razorpay-integration.md)
- **Troubleshooting:** [troubleshooting.md](./troubleshooting.md)

---

**Document Status:** ✅ Complete  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
