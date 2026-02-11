---
title: Configuration Reference
service: Catalog Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: devops, backend-developers
---

# Configuration Reference

**Complete reference for all configuration settings in the Catalog Service.**

## Overview

The Catalog Service uses `appsettings.json` for configuration with environment-specific overrides:
- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Development overrides
- `appsettings.Production.json` - Production overrides
- Environment variables - Highest priority

---

## 🔗 Connection Strings

### Database Connection

**Key:** `ConnectionStrings:CatalogServiceDb`

**Development:**
```json
{
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=localhost;Database=realserv_catalog_db;Username=postgres;Password=postgres;Pooling=true;Minimum Pool Size=5;Maximum Pool Size=100;"
  }
}
```

**Production:**
```json
{
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=${DB_HOST};Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD};Pooling=true;Minimum Pool Size=10;Maximum Pool Size=200;"
  }
}
```

**Parameters:**
- `Host` - PostgreSQL server hostname
- `Database` - Database name
- `Username` - Database user
- `Password` - Database password
- `Pooling` - Enable connection pooling (recommended: `true`)
- `Minimum Pool Size` - Minimum connections to maintain (dev: 5, prod: 10)
- `Maximum Pool Size` - Maximum concurrent connections (dev: 100, prod: 200)

### Redis Connection

**Key:** `ConnectionStrings:Redis`

**Development:**
```json
{
  "ConnectionStrings": {
    "Redis": "localhost:6379,abortConnect=false"
  }
}
```

**Production:**
```json
{
  "ConnectionStrings": {
    "Redis": "your-cluster.cache.amazonaws.com:6379,ssl=true,password=yourpassword,abortConnect=false"
  }
}
```

**Parameters:**
- `host:port` - Redis server and port
- `ssl` - Use SSL/TLS (production: `true`)
- `password` - Redis password (production only)
- `abortConnect` - Abort on connection failure (`false` allows fallback to in-memory)

---

## 🌐 CORS Configuration

**Key:** `AllowedOrigins`

**Development:**
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}
```

**Production:**
```json
{
  "AllowedOrigins": [
    "https://realserv.com",
    "https://app.realserv.com",
    "https://vendor.realserv.com",
    "https://admin.realserv.com"
  ]
}
```

**Rules:**
- Must include protocol (`http://` or `https://`)
- Must include port if non-standard
- No trailing slashes
- No wildcards allowed

**Security:** Always restrict to known origins in production.

---

## ⏱️ Rate Limiting

**Key:** `RateLimiting`

**Development:**
```json
{
  "RateLimiting": {
    "PermitLimit": 100,
    "Window": 60,
    "QueueLimit": 0
  }
}
```

**Production:**
```json
{
  "RateLimiting": {
    "PermitLimit": 200,
    "Window": 60,
    "QueueLimit": 10
  }
}
```

**Parameters:**
- `PermitLimit` - Maximum requests allowed per window (dev: 100, prod: 200)
- `Window` - Time window in seconds (default: 60)
- `QueueLimit` - Number of requests to queue when limit exceeded (dev: 0, prod: 10)

**Behavior:**
- Limits are per IP address
- Returns `429 Too Many Requests` when exceeded
- Includes `Retry-After` header in response

---

## 📦 Caching

**Key:** `Caching`

**All Environments:**
```json
{
  "Caching": {
    "DefaultExpirationMinutes": 60,
    "ShortExpirationMinutes": 5,
    "LongExpirationMinutes": 120
  }
}
```

**Parameters:**
- `DefaultExpirationMinutes` - Default TTL for cached items (60 minutes)
- `ShortExpirationMinutes` - TTL for frequently changing data (5 minutes)
- `LongExpirationMinutes` - TTL for rarely changing data (120 minutes)

**Cache Strategy:**
- Materials/Categories: Default (60 min)
- Vendor Inventory: Short (5 min)
- Search Results: Default (60 min)
- Static Data: Long (120 min)

---

## 📄 Pagination

**Key:** `Pagination`

**Development:**
```json
{
  "Pagination": {
    "DefaultPageSize": 20,
    "MaxPageSize": 100
  }
}
```

**Production:**
```json
{
  "Pagination": {
    "DefaultPageSize": 50,
    "MaxPageSize": 100
  }
}
```

**Parameters:**
- `DefaultPageSize` - Default items per page if not specified (dev: 20, prod: 50)
- `MaxPageSize` - Maximum items per page (enforced: 100)

**Enforcement:**
- All list endpoints enforce pagination
- Requests exceeding `MaxPageSize` are capped at 100
- Invalid page numbers default to 1

---

## 📝 Logging

**Key:** `Logging`

**Development:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

**Production:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

**Log Levels:**
- `Trace` - Very detailed logs
- `Debug` - Debug information
- `Information` - General information (default for development)
- `Warning` - Warnings and errors (default for production)
- `Error` - Errors only
- `Critical` - Critical errors only
- `None` - No logging

---

## ☁️ AWS CloudWatch (Optional)

**Environment Variables:**
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

**Configuration:**
```json
{
  "AWS": {
    "Region": "us-east-1",
    "LogGroup": "/realserv/catalog-service",
    "LogStreamPrefix": "catalog"
  }
}
```

**CloudWatch Integration:**
- Logs sent to `/realserv/catalog-service` log group
- Metrics tracked automatically
- Available metrics: Request count, duration, errors

---

## 🔐 Authentication

**Firebase Configuration:**

Configured via shared library (`RealServ.Shared.Infrastructure.Middleware.FirebaseAuthenticationFilter`)

**Environment Variables:**
```bash
FIREBASE_PROJECT_ID=your-project-id
```

**Authorization Policies:**
- `AdminOnly` - Requires `admin` role
- `VendorOnly` - Requires `vendor` role
- `VendorOrAdmin` - Requires `vendor` or `admin` role
- `CustomerOrAdmin` - Requires `customer` or `admin` role
- `AnyAuthenticated` - Any authenticated user

---

## 🌍 Environment-Specific Settings

### Development

**File:** `appsettings.Development.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=localhost;Database=realserv_catalog_db;Username=postgres;Password=postgres;Pooling=true;Minimum Pool Size=5;Maximum Pool Size=100;",
    "Redis": "localhost:6379,abortConnect=false"
  },
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  "RateLimiting": {
    "PermitLimit": 100,
    "Window": 60,
    "QueueLimit": 0
  },
  "Pagination": {
    "DefaultPageSize": 20,
    "MaxPageSize": 100
  }
}
```

### Production

**File:** `appsettings.Production.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=${DB_HOST};Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD};Pooling=true;Minimum Pool Size=10;Maximum Pool Size=200;",
    "Redis": "${REDIS_CONNECTION_STRING}"
  },
  "AllowedOrigins": [
    "https://realserv.com",
    "https://app.realserv.com",
    "https://vendor.realserv.com",
    "https://admin.realserv.com"
  ],
  "RateLimiting": {
    "PermitLimit": 200,
    "Window": 60,
    "QueueLimit": 10
  },
  "Pagination": {
    "DefaultPageSize": 50,
    "MaxPageSize": 100
  }
}
```

---

## 🔧 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | Environment name | `Production` |
| `DB_HOST` | Database host | `postgres.aws.com` |
| `DB_NAME` | Database name | `realserv_catalog_db` |
| `DB_USER` | Database user | `catalog_user` |
| `DB_PASSWORD` | Database password | `secure_password` |

### Optional

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `REDIS_CONNECTION_STRING` | Redis connection | `redis:6379` | In-memory fallback |
| `AWS_REGION` | AWS region | `us-east-1` | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `...` | - |
| `FIREBASE_PROJECT_ID` | Firebase project | `realserv-prod` | - |

---

## 🎯 Configuration Priority

Configuration is loaded in this order (later overrides earlier):

1. `appsettings.json` (base)
2. `appsettings.{Environment}.json` (environment-specific)
3. Environment variables
4. Command-line arguments

**Example:**
```bash
# Override database connection via environment variable
export ConnectionStrings__CatalogServiceDb="Host=prod-db;..."
dotnet run
```

---

## ✅ Validation

### Required Settings

These must be configured or service won't start:

- ✅ `ConnectionStrings:CatalogServiceDb`
- ✅ `AllowedOrigins` (production)

### Optional Settings

These have defaults but can be customized:

- `ConnectionStrings:Redis` (fallsback to in-memory)
- `RateLimiting:*` (defaults shown above)
- `Caching:*` (defaults shown above)
- `Pagination:*` (defaults shown above)

---

## 🧪 Testing Configuration

### Validate Development Config

```bash
cd backend/src/services/CatalogService
dotnet run --environment Development

# Check logs for:
# ✅ Database migrations applied successfully
# ✅ Listening on http://localhost:5000
```

### Validate Production Config

```bash
# Set production environment
export ASPNETCORE_ENVIRONMENT=Production
export DB_HOST=localhost
export DB_NAME=realserv_catalog_db
export DB_USER=postgres
export DB_PASSWORD=postgres
export REDIS_CONNECTION_STRING="localhost:6379"

dotnet run

# Verify:
# 1. CORS restricted to production origins
# 2. Rate limiting active
# 3. Logging set to Warning level
# 4. Error details hidden
```

---

## 🔄 Common Configuration Changes

### Increase Rate Limit

```json
{
  "RateLimiting": {
    "PermitLimit": 500  // Increase from 200
  }
}
```

### Change Cache Expiration

```json
{
  "Caching": {
    "DefaultExpirationMinutes": 30  // Decrease from 60
  }
}
```

### Add CORS Origin

```json
{
  "AllowedOrigins": [
    "https://realserv.com",
    "https://app.realserv.com",
    "https://new-frontend.realserv.com"  // Add new origin
  ]
}
```

### Increase Database Pool Size

```
...;Maximum Pool Size=300;  // Increase from 200
```

---

## 📊 Monitoring Configuration

### Recommended CloudWatch Alerts

1. **High Error Rate**
   - Metric: `500_responses`
   - Threshold: > 10 in 5 minutes

2. **Rate Limit Hits**
   - Metric: `429_responses`
   - Threshold: > 100 in 5 minutes

3. **Database Connection Pool Exhausted**
   - Metric: `db_pool_wait_time`
   - Threshold: > 1 second

---

## 🆘 Troubleshooting

### Service Won't Start

**Error:** "Unable to connect to database"
- Check `ConnectionStrings:CatalogServiceDb`
- Verify database is running
- Test connection: `psql -h HOST -U USER -d DATABASE`

**Error:** "CORS configuration is invalid"
- Check `AllowedOrigins` format
- Ensure no trailing slashes
- Include protocol (http/https)

### Performance Issues

**Slow Responses:**
- Enable Redis caching
- Increase connection pool size
- Check database indexes

**Rate Limit Errors:**
- Increase `PermitLimit`
- Increase `Window` duration
- Implement client-side throttling

---

## 📚 Related Documentation

- [Security Configuration](../how-to-guides/security-configuration.md) - Security setup
- [Deploy to Production](../how-to-guides/deploy-to-production.md) - Deployment guide
- [Error Codes](./error-codes.md) - Error reference
- [Database Schema](./database-schema.md) - Database reference

---

## 🔍 Quick Reference

### Development Checklist
- [ ] `ConnectionStrings:CatalogServiceDb` points to localhost
- [ ] `ConnectionStrings:Redis` points to localhost or omitted
- [ ] `AllowedOrigins` includes `http://localhost:3000`
- [ ] `RateLimiting:PermitLimit` set to 100
- [ ] `Logging:LogLevel:Default` set to Information

### Production Checklist
- [ ] `ConnectionStrings:CatalogServiceDb` uses environment variables
- [ ] `ConnectionStrings:Redis` configured with SSL
- [ ] `AllowedOrigins` restricted to production domains
- [ ] `RateLimiting:PermitLimit` set to 200+
- [ ] `Logging:LogLevel:Default` set to Warning
- [ ] Database credentials in secrets manager
- [ ] HTTPS enforced
- [ ] CloudWatch logging enabled

---

**Last Updated:** January 11, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
