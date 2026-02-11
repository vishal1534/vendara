# Middleware Integration - Quick Reference Card

**Estimated Time**: 2-4 hours for all 6 services  
**Difficulty**: Easy (copy-paste)

---

## 🚀 Super Quick Summary

For each of the 6 remaining services, you need to:
1. Update `Program.cs` (4 code blocks)
2. Update `appsettings.json` (merge config)
3. Test (health check + rate limiting)

**Time per service**: 20-40 minutes

---

## 📝 The 4 Code Blocks (Copy-Paste Ready)

### Block 1: Add to Program.cs (after AddControllers)

```csharp
// Add FluentValidation
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<Program>();
        fv.DisableDataAnnotationsValidation = true;
        fv.ImplicitlyValidateChildProperties = true;
    });
```

### Block 2: Add to Program.cs (before var app = builder.Build())

```csharp
// Add RealServ Observability (Correlation ID, Permission Service, etc.)
builder.Services.AddRealServObservability();

// Add Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

### Block 3: Add to Program.cs (after app.UseAuthorization())

```csharp
// RealServ Middleware
app.UseRealServObservability();  // Correlation ID + Internal Auth
app.UseRealServRateLimiting();   // Rate limiting
```

### Block 4: Add to Program.cs (before app.Run())

```csharp
// Health Checks
app.MapRealServHealthChecks();
```

---

## 🎯 Service-Specific Config (appsettings.json)

### VendorService (Port 5002) - Standard Profile

```json
{
  "Services": {
    "IdentityServiceUrl": "http://localhost:5001",
    "OrderServiceUrl": "http://localhost:5004",
    "PaymentServiceUrl": "http://localhost:5007",
    "CatalogServiceUrl": "http://localhost:5005",
    "VendorServiceUrl": "http://localhost:5002",
    "NotificationServiceUrl": "http://localhost:5010",
    "IntegrationServiceUrl": "http://localhost:5012"
  },
  "InternalApiKeys": {
    "IdentityService": "dev-key-identity-service",
    "OrderService": "dev-key-order-service",
    "PaymentService": "dev-key-payment-service",
    "CatalogService": "dev-key-catalog-service",
    "VendorService": "dev-key-vendor-service",
    "NotificationService": "dev-key-notification-service",
    "IntegrationService": "dev-key-integration-service"
  },
  "RateLimiting": {
    "GeneralLimit": {"PermitLimit": 100, "Window": "00:01:00"},
    "HourlyLimit": {"PermitLimit": 1000, "Window": "01:00:00"},
    "DailyLimit": {"PermitLimit": 10000, "Window": "1.00:00:00"}
  }
}
```

### OrderService (Port 5004) - Standard Profile + Order Limit

```json
{
  "Services": { /* same as above */ },
  "InternalApiKeys": { /* same as above */ },
  "RateLimiting": {
    "GeneralLimit": {"PermitLimit": 100, "Window": "00:01:00"},
    "HourlyLimit": {"PermitLimit": 1000, "Window": "01:00:00"},
    "DailyLimit": {"PermitLimit": 10000, "Window": "1.00:00:00"},
    "EndpointSpecificLimits": {
      "/api/v1/orders": {"PermitLimit": 20, "Window": "00:01:00"}
    }
  }
}
```

### CatalogService (Port 5005) - Lenient Profile

```json
{
  "Services": { /* same as above */ },
  "InternalApiKeys": { /* same as above */ },
  "RateLimiting": {
    "GeneralLimit": {"PermitLimit": 300, "Window": "00:01:00"},
    "HourlyLimit": {"PermitLimit": 5000, "Window": "01:00:00"},
    "DailyLimit": {"PermitLimit": 50000, "Window": "1.00:00:00"},
    "MethodSpecificLimits": {
      "POST,PUT,DELETE": {"PermitLimit": 50, "Window": "00:01:00"}
    }
  }
}
```

### PaymentService (Port 5007) - Strict Profile + Webhook Whitelist

```json
{
  "Services": { /* same as above */ },
  "InternalApiKeys": { /* same as above */ },
  "RateLimiting": {
    "GeneralLimit": {"PermitLimit": 30, "Window": "00:01:00"},
    "HourlyLimit": {"PermitLimit": 300, "Window": "01:00:00"},
    "DailyLimit": {"PermitLimit": 3000, "Window": "1.00:00:00"},
    "EndpointSpecificLimits": {
      "/api/v1/payments": {"PermitLimit": 10, "Window": "00:01:00"}
    },
    "WhitelistedPaths": [
      "/api/v1/webhooks/razorpay",
      "/health",
      "/health/ready"
    ]
  }
}
```

### NotificationService (Port 5010) - Standard + WhatsApp/Email Limits

```json
{
  "Services": { /* same as above */ },
  "InternalApiKeys": { /* same as above */ },
  "RateLimiting": {
    "GeneralLimit": {"PermitLimit": 100, "Window": "00:01:00"},
    "HourlyLimit": {"PermitLimit": 1000, "Window": "01:00:00"},
    "DailyLimit": {"PermitLimit": 10000, "Window": "1.00:00:00"},
    "EndpointSpecificLimits": {
      "/api/v1/notifications/whatsapp": {"PermitLimit": 10, "Window": "00:01:00"},
      "/api/v1/notifications/email": {"PermitLimit": 20, "Window": "00:01:00"}
    }
  }
}
```

### IntegrationService (Port 5012) - Standard Profile

```json
{
  "Services": { /* same as above */ },
  "InternalApiKeys": { /* same as above */ },
  "RateLimiting": {
    "GeneralLimit": {"PermitLimit": 100, "Window": "00:01:00"},
    "HourlyLimit": {"PermitLimit": 1000, "Window": "01:00:00"},
    "DailyLimit": {"PermitLimit": 10000, "Window": "1.00:00:00"}
  }
}
```

---

## ✅ Quick Test Commands

After updating each service:

```bash
# Build
cd /backend/src/services/[SERVICE_NAME]
dotnet build

# Run
dotnet run

# Test health check (in another terminal)
curl http://localhost:[PORT]/health

# Test rate limiting (should see 429 after limit)
for i in {1..150}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:[PORT]/health; done
```

---

## 📊 Port Reference

| Service | Port | Profile | Special Limits |
|---------|------|---------|----------------|
| IdentityService | 5001 | Strict | Login: 5/min ✅ |
| VendorService | 5002 | Standard | - |
| OrderService | 5004 | Standard | Orders: 20/min |
| CatalogService | 5005 | Lenient | POST/PUT: 50/min |
| PaymentService | 5007 | Strict | Payments: 10/min, Webhook whitelist |
| NotificationService | 5010 | Standard | WhatsApp: 10/min, Email: 20/min |
| IntegrationService | 5012 | Standard | - |

---

## 🎯 Checklist (Print & Check Off)

**VendorService** (5002):
- [ ] Block 1: FluentValidation
- [ ] Block 2: Services
- [ ] Block 3: Middleware
- [ ] Block 4: Health checks
- [ ] Config: Standard profile
- [ ] Test: Build + Run + Health + Rate limit

**OrderService** (5004):
- [ ] Block 1: FluentValidation
- [ ] Block 2: Services
- [ ] Block 3: Middleware
- [ ] Block 4: Health checks
- [ ] Config: Standard + Order limit
- [ ] Test: Build + Run + Health + Rate limit

**CatalogService** (5005):
- [ ] Block 1: FluentValidation
- [ ] Block 2: Services
- [ ] Block 3: Middleware
- [ ] Block 4: Health checks
- [ ] Config: Lenient + Method limits
- [ ] Test: Build + Run + Health + Rate limit

**PaymentService** (5007):
- [ ] Block 1: FluentValidation
- [ ] Block 2: Services
- [ ] Block 3: Middleware
- [ ] Block 4: Health checks
- [ ] Config: Strict + Webhook whitelist
- [ ] Test: Build + Run + Health + Rate limit

**NotificationService** (5010):
- [ ] Block 1: FluentValidation
- [ ] Block 2: Services
- [ ] Block 3: Middleware
- [ ] Block 4: Health checks
- [ ] Config: Standard + WhatsApp/Email limits
- [ ] Test: Build + Run + Health + Rate limit

**IntegrationService** (5012):
- [ ] Block 1: FluentValidation
- [ ] Block 2: Services
- [ ] Block 3: Middleware
- [ ] Block 4: Health checks
- [ ] Config: Standard profile
- [ ] Test: Build + Run + Health + Rate limit

---

## ⚡ Speed Run Mode (For Each Service)

1. **30 seconds**: Copy Block 1 to Program.cs
2. **30 seconds**: Copy Block 2 to Program.cs
3. **30 seconds**: Copy Block 3 to Program.cs
4. **30 seconds**: Copy Block 4 to Program.cs
5. **5 minutes**: Copy config to appsettings.json
6. **2 minutes**: Build & run
7. **2 minutes**: Test health + rate limiting

**Total**: ~12 minutes per service × 6 = **~1 hour** if you're fast!

---

## 🎉 You're Done When...

All these return `"Healthy"`:
```bash
curl http://localhost:5001/health | jq '.status'  # IdentityService
curl http://localhost:5002/health | jq '.status'  # VendorService
curl http://localhost:5004/health | jq '.status'  # OrderService
curl http://localhost:5005/health | jq '.status'  # CatalogService
curl http://localhost:5007/health | jq '.status'  # PaymentService
curl http://localhost:5010/health | jq '.status'  # NotificationService
curl http://localhost:5012/health | jq '.status'  # IntegrationService
```

---

**Pro Tip**: Do one service completely (code + config + test) before moving to the next. Don't try to update all Program.cs files at once!

**Need Help?** Check `/backend/MIDDLEWARE-INTEGRATION-CHECKLIST.md` for detailed step-by-step instructions.
