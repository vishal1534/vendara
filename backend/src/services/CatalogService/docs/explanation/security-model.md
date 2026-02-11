---
title: Security Model
service: Catalog Service
category: explanation
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: architects
---

# Security Model - Catalog Service

**Service:** Catalog Service  
**Category:** Explanation  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Authentication, authorization, and security best practices for the Catalog Service.

---

## Authentication

### Token-Based Authentication

The Catalog Service uses **JWT Bearer tokens** for authentication, issued by the **Identity Service**.

**Flow:**
```
┌─────────┐                  ┌──────────────┐                 ┌─────────────┐
│  Client │                  │   Identity   │                 │   Catalog   │
│         │                  │   Service    │                 │   Service   │
└────┬────┘                  └──────┬───────┘                 └──────┬──────┘
     │                              │                                │
     │ 1. POST /auth/firebase       │                                │
     ├─────────────────────────────>│                                │
     │                              │                                │
     │ 2. JWT Token                 │                                │
     │<─────────────────────────────┤                                │
     │                              │                                │
     │ 3. GET /materials            │                                │
     │    Authorization: Bearer     │                                │
     ├──────────────────────────────┼───────────────────────────────>│
     │                              │                                │
     │                              │ 4. Validate JWT                │
     │                              │                                │
     │ 5. Materials Response        │                                │
     │<───────────────────────────────────────────────────────────────┤
```

### JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user-uuid",
  "email": "vendor@example.com",
  "role": "Vendor",
  "vendorId": "vendor-uuid",
  "exp": 1736611200,
  "iat": 1736607600
}
```

**Claims:**
- `sub`: User ID (from Identity Service)
- `email`: User email
- `role`: User role (Buyer, Vendor, Admin)
- `vendorId`: Vendor ID (if role=Vendor)
- `exp`: Expiration timestamp (60 minutes)
- `iat`: Issued at timestamp

---

## Authorization

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Public** (No auth) | Read materials, categories, labor, search, statistics |
| **Buyer** | Read all + (future: favorites, cart) |
| **Vendor** | Read all + Manage own inventory and labor |
| **Admin** | Full CRUD on catalog (materials, categories, labor) + Bulk operations |

### Endpoint Authorization Matrix

| Endpoint | Public | Buyer | Vendor | Admin |
|----------|--------|-------|--------|-------|
| `GET /materials` | ✅ | ✅ | ✅ | ✅ |
| `POST /materials` | ❌ | ❌ | ❌ | ✅ |
| `PUT /materials/{id}` | ❌ | ❌ | ❌ | ✅ |
| `DELETE /materials/{id}` | ❌ | ❌ | ❌ | ✅ |
| `GET /vendor-inventory/vendor/{id}` | ❌ | ❌ | ✅ (own only) | ✅ |
| `POST /vendor-inventory` | ❌ | ❌ | ✅ | ✅ |
| `GET /search/*` | ✅ | ✅ | ✅ | ✅ |
| `POST /bulk/*` | ❌ | ❌ | ❌ | ✅ |

### Authorization Implementation

```csharp
[Authorize(Roles = "Admin")]
[HttpPost]
public async Task<ActionResult<Material>> CreateMaterial([FromBody] CreateMaterialDto dto)
{
    // Only admins can create materials
}

[Authorize(Roles = "Vendor,Admin")]
[HttpPost("vendor-inventory")]
public async Task<ActionResult<VendorInventory>> AddInventory([FromBody] CreateInventoryDto dto)
{
    // Vendors can only add their own inventory
    var currentVendorId = User.FindFirst("vendorId")?.Value;
    
    if (dto.VendorId != currentVendorId && !User.IsInRole("Admin"))
    {
        return Forbid(); // 403 Forbidden
    }
    
    // Proceed with creation
}
```

---

## Data Protection

### Sensitive Data

**Not Stored in Catalog Service:**
- User passwords (handled by Identity Service + Firebase)
- Payment information (handled by Payment Service)
- Personal identification (Aadhaar, PAN) (handled by Identity Service)

**Stored in Catalog Service:**
- Material prices (public data)
- Vendor inventory (vendor-specific, protected by RBAC)
- SKUs, brands, specifications (public data)

### Data Encryption

**At Rest:**
- RDS encryption enabled (AES-256)
- EBS volumes encrypted
- Secrets Manager for connection strings

**In Transit:**
- HTTPS/TLS 1.2+ for all API requests
- RDS connections use SSL Mode=Require

```json
// Production connection string
{
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=rds;Database=catalog;Username=user;Password=pass;SSL Mode=Require"
  }
}
```

---

## Input Validation

### Prevent SQL Injection

**EF Core uses parameterized queries:**
```csharp
// SAFE: EF Core parameterizes automatically
var material = await _context.Materials
    .Where(m => m.Name == userInput)  // Safe
    .FirstOrDefaultAsync();

// UNSAFE: Never use FromSqlRaw with user input directly
var materials = await _context.Materials
    .FromSqlRaw($"SELECT * FROM materials WHERE name = '{userInput}'")  // VULNERABLE!
    .ToListAsync();

// SAFE: FromSqlRaw with parameters
var materials = await _context.Materials
    .FromSqlRaw("SELECT * FROM materials WHERE name = {0}", userInput)  // Safe
    .ToListAsync();
```

### Model Validation

```csharp
public class CreateMaterialDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Name { get; set; }

    [Required]
    [Range(0.01, 999999.99)]
    public decimal BasePrice { get; set; }

    [Required]
    [StringLength(20)]
    public string Unit { get; set; }

    [RegularExpression(@"^[A-Z0-9-]+$")]
    public string? Sku { get; set; }
}

// Validation happens automatically before controller action
[HttpPost]
public async Task<ActionResult<Material>> CreateMaterial([FromBody] CreateMaterialDto dto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);  // 400 with validation errors
    }
    
    // dto is validated
}
```

### Prevent XSS

```csharp
// ASP.NET Core automatically encodes output by default
// No special action needed for JSON APIs

// For HTML output (if used):
// Use Razor's @ syntax which auto-encodes
<p>@material.Name</p>  // Safe: <script> becomes &lt;script&gt;

// Manual encoding if needed
using System.Web;
var safe = HttpUtility.HtmlEncode(userInput);
```

---

## API Security

### CORS Configuration

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("RealServPolicy", policy =>
    {
        policy.WithOrigins(
            "https://realserv.com",
            "https://app.realserv.com",
            "https://vendor.realserv.com",
            "https://admin.realserv.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

app.UseCors("RealServPolicy");
```

### Rate Limiting

```csharp
// Install: dotnet add package AspNetCoreRateLimit

builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(options =>
{
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*",
            Limit = 1000,
            Period = "1h"
        },
        new RateLimitRule
        {
            Endpoint = "POST:/api/v1/*",
            Limit = 100,
            Period = "1h"
        }
    };
});

app.UseIpRateLimiting();
```

### HTTPS Enforcement

```csharp
// Program.cs
app.UseHttpsRedirection();  // Redirect HTTP to HTTPS

// Production: ALB handles SSL termination
// Service receives HTTP from ALB but client uses HTTPS
```

---

## Secrets Management

### AWS Secrets Manager

**Store Connection Strings:**
```bash
# Create secret
aws secretsmanager create-secret \
  --name catalog-db-connection \
  --secret-string '{"connectionString":"Host=rds;Database=catalog;Username=admin;Password=SecurePass123!"}'

# Reference in ECS task definition
{
  "secrets": [
    {
      "name": "ConnectionStrings__CatalogServiceDb",
      "valueFrom": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:catalog-db-connection"
    }
  ]
}
```

### Never Commit Secrets

```bash
# .gitignore
appsettings.Production.json
appsettings.*.json
*.secret
.env
```

### Environment Variables (Development)

```bash
# Use User Secrets in development
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:CatalogServiceDb" "Host=localhost;..."

# Stored outside project directory: ~/.microsoft/usersecrets/{guid}/secrets.json
```

---

## Audit Logging

### Track Sensitive Operations

```csharp
_logger.LogInformation(
    "Admin {AdminId} created material {MaterialId} with price {BasePrice}",
    currentUserId, material.Id, material.BasePrice);

_logger.LogInformation(
    "Vendor {VendorId} updated inventory {InventoryId} price from {OldPrice} to {NewPrice}",
    vendorId, inventoryId, oldPrice, newPrice);

_logger.LogWarning(
    "Unauthorized access attempt: User {UserId} tried to access vendor {VendorId} inventory",
    currentUserId, requestedVendorId);
```

### Price History Tracking

All price changes are automatically tracked:

```csharp
public async Task<Material> UpdateAsync(Material material)
{
    var existing = await _context.Materials.FindAsync(material.Id);
    
    if (existing.BasePrice != material.BasePrice)
    {
        // Create price history record
        var history = new PriceHistory
        {
            ItemType = 1,  // Material
            ItemId = material.Id,
            ItemName = material.Name,
            OldPrice = existing.BasePrice,
            NewPrice = material.BasePrice,
            PriceChange = material.BasePrice - existing.BasePrice,
            PercentageChange = ((material.BasePrice - existing.BasePrice) / existing.BasePrice) * 100,
            PriceType = "BasePrice",
            ChangedBy = currentUserId,
            ChangedAt = DateTime.UtcNow
        };
        
        await _context.PriceHistories.AddAsync(history);
    }
    
    _context.Materials.Update(material);
    await _context.SaveChangesAsync();
    
    return material;
}
```

---

## Security Checklist

### Development
- ✅ Use HTTPS locally (optional but recommended)
- ✅ Never commit secrets to Git
- ✅ Use User Secrets for local development
- ✅ Validate all user input
- ✅ Use parameterized queries (EF Core default)

### Staging
- ✅ HTTPS enforced
- ✅ Secrets in AWS Secrets Manager
- ✅ CORS configured for staging domains
- ✅ Rate limiting enabled
- ✅ Authentication enabled
- ✅ Audit logging enabled

### Production
- ✅ HTTPS enforced (ALB SSL termination)
- ✅ Secrets in AWS Secrets Manager
- ✅ CORS configured for production domains only
- ✅ Rate limiting enabled (1000 req/hour)
- ✅ Authentication required (except public endpoints)
- ✅ Authorization enforced (RBAC)
- ✅ Database encrypted at rest (RDS encryption)
- ✅ Database SSL connections required
- ✅ Audit logging to CloudWatch
- ✅ Security group: Only ALB can access ECS tasks
- ✅ Security group: Only ECS can access RDS
- ✅ IAM roles: Least privilege principle

---

## Threat Model

### Threats Mitigated

| Threat | Mitigation |
|--------|------------|
| **SQL Injection** | EF Core parameterized queries |
| **XSS** | ASP.NET Core auto-encoding (JSON API) |
| **CSRF** | Not applicable (stateless JWT, no cookies) |
| **Brute Force** | Rate limiting (1000 req/hour) |
| **Man-in-the-Middle** | HTTPS/TLS encryption |
| **Unauthorized Access** | JWT authentication + RBAC |
| **Data Breach** | RDS encryption at rest |
| **Secret Exposure** | AWS Secrets Manager |
| **Privilege Escalation** | Role-based authorization checks |
| **DoS** | Rate limiting + auto-scaling |

### Threats Not Fully Mitigated (Future)

| Threat | Current State | Future Enhancement |
|--------|---------------|---------------------|
| **DDoS** | Basic rate limiting | AWS WAF + Shield Advanced |
| **API Key Leakage** | No API keys used | Implement API key rotation |
| **Insider Threat** | Audit logging | Implement MFA for admin operations |

---

## Compliance

### Data Privacy
- **No PII stored**: All personal data in Identity Service
- **GDPR**: Not applicable (B2B marketplace, no EU users)
- **Indian Data Protection**: Follows best practices

### Security Standards
- **HTTPS**: TLS 1.2+ enforced
- **Password Hashing**: Not applicable (Firebase handles authentication)
- **Secrets Management**: AWS Secrets Manager
- **Audit Logging**: All sensitive operations logged

---

**Last Updated:** January 11, 2026  
**Security Review Date:** January 11, 2026  
**Next Review:** April 11, 2026 (Quarterly)
