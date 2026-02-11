---
title: Security Configuration Guide
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: devops, backend-developers
estimated_time: 15 minutes
---

# Security Configuration Guide

**Learn how to configure enterprise-grade security for the Catalog Service.**

## Overview

The Catalog Service includes production-ready security features:
- CORS protection
- Rate limiting
- Authentication & authorization
- Input validation
- Redis caching
- Connection pooling

---

## 📋 Prerequisites

- Catalog Service running
- Access to `appsettings.json`
- Redis instance (optional but recommended)
- Firebase project (for authentication)

---

## 🔐 1. CORS Configuration

### Development Setup

**File:** `appsettings.json`

```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}
```

### Production Setup

**File:** `appsettings.Production.json`

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

### Test CORS

```bash
# Should succeed
curl -X GET "http://localhost:5000/api/v1/materials" \
  -H "Origin: http://localhost:3000"

# Should fail (403 Forbidden)
curl -X GET "http://localhost:5000/api/v1/materials" \
  -H "Origin: http://malicious-site.com"
```

---

## ⏱️ 2. Rate Limiting

### Configuration

**File:** `appsettings.json`

```json
{
  "RateLimiting": {
    "PermitLimit": 100,
    "Window": 60,
    "QueueLimit": 0
  }
}
```

**Settings:**
- `PermitLimit`: Maximum requests allowed
- `Window`: Time window in seconds
- `QueueLimit`: Number of requests to queue (0 = reject immediately)

### Production Settings

```json
{
  "RateLimiting": {
    "PermitLimit": 200,
    "Window": 60,
    "QueueLimit": 10
  }
}
```

### Test Rate Limiting

```bash
# Send 101 requests rapidly
for i in {1..101}; do
  curl -X GET "http://localhost:5000/api/v1/materials"
done

# Request 101 should return:
# Status: 429 Too Many Requests
# {
#   "success": false,
#   "message": "Too many requests. Please try again later.",
#   "retryAfter": 60
# }
```

---

## 🔑 3. Authentication & Authorization

### Authorization Policies

The service uses policy-based authorization:

| Policy | Roles | Usage |
|--------|-------|-------|
| `AdminOnly` | admin | Material/Category CRUD |
| `VendorOnly` | vendor | Vendor operations |
| `VendorOrAdmin` | vendor, admin | Inventory management |
| `CustomerOrAdmin` | customer, admin | Customer operations |
| `AnyAuthenticated` | Any logged-in user | Protected public data |

### Controller Authorization

**Example: MaterialsController**

```csharp
[ApiController]
[Route("api/v1/[controller]")]
public class MaterialsController : ControllerBase
{
    // Public endpoint - no auth required
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult> GetMaterials() { }
    
    // Admin only
    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<ActionResult> CreateMaterial() { }
    
    // Vendor or Admin
    [HttpGet("vendor/{vendorId}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<ActionResult> GetVendorInventory() { }
}
```

### Testing Authentication

```bash
# Public endpoint (no auth)
curl -X GET "http://localhost:5000/api/v1/materials"
# ✅ Returns 200 OK

# Protected endpoint (without auth)
curl -X POST "http://localhost:5000/api/v1/materials" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
# ❌ Returns 401 Unauthorized

# Protected endpoint (with auth)
curl -X POST "http://localhost:5000/api/v1/materials" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
# ✅ Returns 201 Created (if user is admin)
```

---

## 📝 4. Input Validation

### Automatic Validation

All endpoints have automatic validation:

```csharp
// Controller parameters with validation
public async Task<ActionResult> SearchMaterials(
    [FromQuery, MaxLength(100)] string? searchTerm = null,
    [FromQuery, Range(1, int.MaxValue)] int page = 1,
    [FromQuery, Range(1, 100)] int pageSize = 20,
    [FromQuery, Range(0, 1000000)] decimal? minPrice = null)
{
    // Validation happens automatically
}
```

### Test Validation

```bash
# Invalid page size (> 100)
curl "http://localhost:5000/api/v1/search/materials?pageSize=500"
# Returns: 400 Bad Request

# Invalid price range
curl "http://localhost:5000/api/v1/search/materials?minPrice=-100"
# Returns: 400 Bad Request

# Search term too long
curl "http://localhost:5000/api/v1/search/materials?searchTerm=$(python3 -c 'print("a"*200)')"
# Returns: 400 Bad Request
```

---

## 📦 5. Pagination Limits

### Configuration

**File:** `appsettings.json`

```json
{
  "Pagination": {
    "DefaultPageSize": 20,
    "MaxPageSize": 100
  }
}
```

### How It Works

```csharp
// PaginationSettings validates all requests
public class PaginationSettings
{
    public int ValidatePageSize(int requestedPageSize)
    {
        if (requestedPageSize <= 0)
            return DefaultPageSize;
        
        return requestedPageSize > MaxPageSize ? MaxPageSize : requestedPageSize;
    }
}
```

### Test Pagination

```bash
# Request too many items
curl "http://localhost:5000/api/v1/materials?pageSize=1000"
# Returns: Max 100 items (enforced limit)

# Normal request
curl "http://localhost:5000/api/v1/materials?page=1&pageSize=20"
# Returns: 20 items with pagination metadata
```

---

## ⚡ 6. Redis Caching

### Setup Redis

**Docker:**
```bash
docker run --name catalog-redis -p 6379:6379 -d redis:latest
```

**Configuration:**
```json
{
  "ConnectionStrings": {
    "Redis": "localhost:6379,abortConnect=false"
  },
  "Caching": {
    "DefaultExpirationMinutes": 60,
    "ShortExpirationMinutes": 5,
    "LongExpirationMinutes": 120
  }
}
```

### Production Redis

**AWS ElastiCache:**
```json
{
  "ConnectionStrings": {
    "Redis": "your-cluster.cache.amazonaws.com:6379,ssl=true,password=yourpassword"
  }
}
```

### Test Caching

```bash
# First request (cache miss - slower)
time curl "http://localhost:5000/api/v1/materials"
# ~100ms

# Second request (cache hit - faster)
time curl "http://localhost:5000/api/v1/materials"
# ~10ms (10x faster!)
```

### Clear Cache

```bash
# Connect to Redis
redis-cli

# Clear all catalog cache
FLUSHDB

# Or clear specific key
DEL CatalogService_materials_all_false
```

---

## 🔌 7. Connection Pooling

### Database Connection String

```json
{
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=localhost;Database=realserv_catalog_db;Username=postgres;Password=postgres;Pooling=true;Minimum Pool Size=5;Maximum Pool Size=100;"
  }
}
```

**Settings:**
- `Pooling=true` - Enable connection pooling
- `Minimum Pool Size=5` - Keep 5 connections open
- `Maximum Pool Size=100` - Max 100 concurrent connections

### Production Settings

```json
{
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=${DB_HOST};Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD};Pooling=true;Minimum Pool Size=10;Maximum Pool Size=200;"
  }
}
```

---

## 🛡️ 8. Input Sanitization

### Search Query Sanitization

All search inputs are automatically sanitized:

```csharp
public static string? SanitizeSearchTerm(string? searchTerm)
{
    if (string.IsNullOrWhiteSpace(searchTerm))
        return null;
    
    // Limit length
    if (searchTerm.Length > 100)
        searchTerm = searchTerm.Substring(0, 100);
    
    // Remove dangerous characters
    searchTerm = Regex.Replace(searchTerm, @"[<>""';\\%]", "");
    
    // Normalize whitespace
    searchTerm = Regex.Replace(searchTerm, @"\s+", " ");
    
    return searchTerm;
}
```

### Test Sanitization

```bash
# SQL injection attempt
curl "http://localhost:5000/api/v1/search/materials?searchTerm='; DROP TABLE materials;--"
# Sanitized to: " DROP TABLE materials"  (safe)

# XSS attempt
curl "http://localhost:5000/api/v1/search/materials?searchTerm=<script>alert('xss')</script>"
# Sanitized to: "scriptalert(xss)script" (safe)
```

---

## 🚨 9. Error Handling

### Production Error Responses

In production, internal errors are hidden:

```json
{
  "success": false,
  "message": "An error occurred while processing your request"
}
```

### Development Error Responses

In development, full details are shown:

```json
{
  "success": false,
  "message": "An error occurred while processing your request",
  "errors": [
    "NullReferenceException: Object reference not set...",
    "   at CatalogService.Controllers.MaterialsController..."
  ]
}
```

### Configure Error Handling

Set environment variable:
```bash
export ASPNETCORE_ENVIRONMENT=Production
```

---

## ✅ Security Checklist

### Development
- [ ] CORS allows localhost origins
- [ ] Rate limiting set to 100 req/min
- [ ] Redis running locally
- [ ] Database connection pooling enabled
- [ ] Error details visible for debugging

### Production
- [ ] CORS restricted to production domains
- [ ] Rate limiting set to 200 req/min
- [ ] Redis cluster configured
- [ ] Database credentials in secrets manager
- [ ] Error details hidden
- [ ] HTTPS enforced
- [ ] CloudWatch logging enabled

---

## 🧪 Testing Security

### Automated Tests

```bash
# 1. CORS test
curl -I -X GET "http://localhost:5000/api/v1/materials" \
  -H "Origin: http://malicious-site.com"
# Should return: 403 Forbidden

# 2. Rate limiting test
for i in {1..101}; do curl -s "http://localhost:5000/api/v1/materials" > /dev/null; done
# Request 101 should return: 429 Too Many Requests

# 3. Auth test
curl -X POST "http://localhost:5000/api/v1/materials" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
# Should return: 401 Unauthorized

# 4. Input validation test
curl "http://localhost:5000/api/v1/materials?pageSize=1000"
# Should enforce max 100 items

# 5. SQL injection test
curl "http://localhost:5000/api/v1/search/materials?searchTerm=' OR '1'='1"
# Should sanitize and return safe results
```

---

## 📊 Monitoring Security

### CloudWatch Metrics

Monitor these metrics in CloudWatch:

- `429_responses` - Rate limit hits
- `401_responses` - Unauthorized attempts
- `403_responses` - CORS violations
- `400_responses` - Validation errors

### Alert on Suspicious Activity

```yaml
# CloudWatch Alarm
AlarmName: HighUnauthorizedRequests
MetricName: 401_responses
Threshold: 100
EvaluationPeriods: 1
Period: 300  # 5 minutes
```

---

## 🔄 Troubleshooting

### CORS Errors

**Error:** "Access to fetch... has been blocked by CORS policy"

**Solution:**
1. Check `AllowedOrigins` in `appsettings.json`
2. Ensure client origin matches exactly (including protocol and port)
3. Restart service after config changes

### Rate Limit Errors

**Error:** "429 Too Many Requests"

**Solution:**
1. Wait for rate limit window to expire (60 seconds)
2. Increase `PermitLimit` in config if needed
3. Implement client-side request throttling

### Authentication Errors

**Error:** "401 Unauthorized"

**Solution:**
1. Verify Firebase token is valid
2. Check token includes required claims
3. Ensure user has correct role (admin, vendor, etc.)

### Cache Issues

**Error:** "Redis connection failed"

**Solution:**
1. Check Redis is running: `redis-cli ping`
2. Verify connection string in `appsettings.json`
3. Service falls back to in-memory cache if Redis unavailable

---

## 📚 Related Documentation

- [Deploy to Production](./deploy-to-production.md) - Production deployment
- [Configuration Reference](../reference/configuration.md) - All configuration options
- [Security Architecture](../explanation/security-architecture.md) - Security design
- [API Reference](../../API_REFERENCE.md) - API documentation

---

## 🆘 Support

**Issues:** backend@realserv.com  
**Slack:** #backend-security  
**Documentation:** [Full Docs](../README.md)

---

**Last Updated:** January 11, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
