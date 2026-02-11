# Middleware Integration Guide

**Date**: January 12, 2026  
**Phase**: 5 - Middleware Integration  
**Purpose**: Apply all shared middleware to all 7 services

---

## 🎯 Overview

This guide walks through integrating all the shared middleware we've built:
1. ✅ Service-to-service authentication
2. ✅ Correlation IDs for distributed tracing
3. ✅ Permission-based authorization (RBAC)
4. ✅ Enhanced health checks
5. ✅ Rate limiting
6. ✅ Input validation (FluentValidation)

---

## 📦 Package Requirements

Each service needs these NuGet packages:

```xml
<PackageReference Include="AspNetCoreRateLimit" Version="5.0.0" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
```

**Installation command:**
```bash
cd src/services/IdentityService
dotnet add package AspNetCoreRateLimit --version 5.0.0
dotnet add package FluentValidation.AspNetCore --version 11.3.0
```

---

## 🔧 Implementation Steps

### Step 1: Install Required Packages

For each of the 7 services:
- IdentityService
- VendorService
- OrderService
- CatalogService
- PaymentService
- NotificationService
- IntegrationService

Run:
```bash
dotnet add package AspNetCoreRateLimit --version 5.0.0
dotnet add package FluentValidation.AspNetCore --version 11.3.0
```

### Step 2: Update Program.cs

Add the following sections to each service's Program.cs:

#### A. Add Using Statements

```csharp
using RealServ.Shared.Observability.Extensions;
using FluentValidation;
using FluentValidation.AspNetCore;
using AspNetCoreRateLimit;
```

#### B. Register Services (Before builder.Build())

```csharp
// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// RealServ Observability (includes correlation ID, permission service)
builder.Services.AddRealServObservability();

// Enhanced Health Checks
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

#### C. Configure Middleware (After app creation, BEFORE authentication)

```csharp
var app = builder.Build();

// ... existing code (Swagger, etc.)

// RealServ Observability Middleware (correlation ID, metrics, logging)
app.UseRealServObservability();

// Rate Limiting (MUST be before authentication)
app.UseRealServRateLimiting();

// Existing middleware
app.UseAuthentication();
app.UseAuthorization();

// Map enhanced health checks
app.MapRealServHealthChecks();

app.MapControllers();
```

### Step 3: Update appsettings.json

Add configuration for each service:

```json
{
  "Services": {
    "IdentityServiceUrl": "http://localhost:5001",
    "VendorServiceUrl": "http://localhost:5002",
    "OrderServiceUrl": "http://localhost:5004",
    "CatalogServiceUrl": "http://localhost:5005",
    "PaymentServiceUrl": "http://localhost:5007",
    "NotificationServiceUrl": "http://localhost:5010",
    "IntegrationServiceUrl": "http://localhost:5012"
  },
  "InternalApiKeys": {
    "IdentityService": "dev-key-identity-2026",
    "VendorService": "dev-key-vendor-2026",
    "OrderService": "dev-key-order-2026",
    "CatalogService": "dev-key-catalog-2026",
    "PaymentService": "dev-key-payment-2026",
    "NotificationService": "dev-key-notification-2026",
    "IntegrationService": "dev-key-integration-2026"
  }
}
```

Plus the rate limiting configuration from `/backend/rate-limiting-configs/`.

---

## 📝 Service-Specific Configurations

### 1. IdentityService

**Program.cs additions:**
```csharp
// Register validators
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add observability
builder.Services.AddRealServObservability();

// Add enhanced health checks
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Add rate limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

**Middleware order:**
```csharp
app.UseRealServObservability();
app.UseRealServRateLimiting();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapRealServHealthChecks();
app.MapControllers();
```

**appsettings.json additions:**
- Merge `rate-limiting-configs/identityservice-ratelimit.json`
- Add `Services` section
- Add `InternalApiKeys` section
- Configure Firebase health check

### 2. VendorService

**Program.cs additions:**
```csharp
// Register validators (we created these!)
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add observability
builder.Services.AddRealServObservability();

// Add enhanced health checks
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Add rate limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

**appsettings.json additions:**
- Merge `rate-limiting-configs/vendorservice-ratelimit.json`
- Add service URLs and API keys

### 3. OrderService

**Same pattern as VendorService**
- Merge `rate-limiting-configs/orderservice-ratelimit.json`

### 4. CatalogService

**Program.cs additions:**
```csharp
// Register validators (we created these!)
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add observability
builder.Services.AddRealServObservability();

// Add enhanced health checks
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Add rate limiting (Lenient profile)
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

**appsettings.json additions:**
- Merge `rate-limiting-configs/catalogservice-ratelimit.json`

### 5. PaymentService

**Program.cs additions:**
```csharp
// Add observability
builder.Services.AddRealServObservability();

// Add enhanced health checks (includes Razorpay)
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Add rate limiting (Strict profile)
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

**appsettings.json additions:**
- Merge `rate-limiting-configs/paymentservice-ratelimit.json`
- Configure Razorpay health check

### 6. NotificationService

**Program.cs additions:**
```csharp
// Validators already exist
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add observability
builder.Services.AddRealServObservability();

// Add enhanced health checks
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Add rate limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

**appsettings.json additions:**
- Merge `rate-limiting-configs/notificationservice-ratelimit.json`

### 7. IntegrationService

**Program.cs additions:**
```csharp
// Add observability
builder.Services.AddRealServObservability();

// Add enhanced health checks (WhatsApp, S3, Google Maps)
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Rate limiting already partially configured
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

**appsettings.json additions:**
- Configure WhatsApp, S3, Google Maps health checks

---

## 🧪 Testing After Integration

### Test 1: Health Checks

```bash
curl http://localhost:5001/health
```

**Expected response:**
```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.1234567",
  "entries": {
    "database": {
      "status": "Healthy",
      "duration": "00:00:00.0123456"
    },
    "firebase": {
      "status": "Healthy",
      "duration": "00:00:00.0234567",
      "data": {
        "projectId": "realserv-mvp"
      }
    }
  }
}
```

### Test 2: Rate Limiting

```bash
# Send 40 requests (limit is 30/min for IdentityService)
for i in {1..40}; do
  echo "Request $i"
  curl -X POST http://localhost:5001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com", "password": "test123"}'
  sleep 0.1
done
```

**Expected:** First 30 succeed, remaining return 429.

### Test 3: Correlation IDs

```bash
curl -H "X-Correlation-ID: test-123" http://localhost:5001/health
```

**Expected:** Response should include `X-Correlation-ID: test-123` header.

### Test 4: FluentValidation

```bash
# Send invalid request to CatalogService
curl -X POST http://localhost:5005/api/v1/materials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "categoryId": "00000000-0000-0000-0000-000000000000",
    "name": "",
    "basePrice": -100
  }'
```

**Expected:** 400 Bad Request with validation errors.

---

## 📊 Checklist

### IdentityService
- [ ] Install AspNetCoreRateLimit
- [ ] Install FluentValidation.AspNetCore
- [ ] Update Program.cs (services)
- [ ] Update Program.cs (middleware)
- [ ] Merge rate limiting config
- [ ] Add service URLs and API keys
- [ ] Test health checks
- [ ] Test rate limiting
- [ ] Test correlation IDs

### VendorService
- [ ] Install AspNetCoreRateLimit
- [ ] Install FluentValidation.AspNetCore
- [ ] Update Program.cs
- [ ] Merge rate limiting config
- [ ] Test validators
- [ ] Test rate limiting

### OrderService
- [ ] Install AspNetCoreRateLimit
- [ ] Install FluentValidation.AspNetCore
- [ ] Update Program.cs
- [ ] Merge rate limiting config
- [ ] Test rate limiting

### CatalogService
- [ ] Install AspNetCoreRateLimit
- [ ] Install FluentValidation.AspNetCore
- [ ] Update Program.cs
- [ ] Merge rate limiting config
- [ ] Test validators
- [ ] Test rate limiting (lenient)

### PaymentService
- [ ] Install AspNetCoreRateLimit
- [ ] Install FluentValidation.AspNetCore
- [ ] Update Program.cs
- [ ] Merge rate limiting config
- [ ] Test Razorpay health check
- [ ] Test rate limiting (strict)

### NotificationService
- [ ] Install AspNetCoreRateLimit
- [ ] Already has FluentValidation ✅
- [ ] Update Program.cs
- [ ] Merge rate limiting config
- [ ] Test rate limiting

### IntegrationService
- [ ] Install AspNetCoreRateLimit
- [ ] Install FluentValidation.AspNetCore
- [ ] Update Program.cs
- [ ] Configure health checks (WhatsApp, S3, Maps)
- [ ] Test all external dependency health checks

---

## 🎯 Expected Results

After integration, each service will have:

1. **Correlation IDs** - Every request logged with correlation ID
2. **Rate Limiting** - Protection against abuse
3. **Enhanced Health Checks** - Monitor all external dependencies
4. **Input Validation** - FluentValidation on all request DTOs
5. **RBAC Ready** - Permission service available for `[RequirePermission]` attributes
6. **Observability** - CloudWatch metrics and structured logging

---

## 🚨 Common Issues

### Issue: Rate limiting not working

**Solution:** Check middleware order. Must be before authentication:
```csharp
app.UseRealServRateLimiting();  // ← Before
app.UseAuthentication();        // ← After
```

### Issue: Validators not found

**Solution:** Ensure package installed and validators registered:
```csharp
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
```

### Issue: Health checks fail

**Solution:** Check configuration section names match:
```json
{
  "Firebase": { ... },
  "Razorpay": { ... },
  "WhatsApp": { ... }
}
```

---

**Created**: January 12, 2026  
**Next**: Apply to all 7 services
