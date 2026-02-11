# Middleware Integration - Execution Checklist

**Date**: January 12, 2026  
**Estimated Time**: 2-4 hours  
**Status**: IdentityService ✅ Complete | 6 Services Remaining

---

## 📋 Pre-Flight Checklist

Before starting, verify:
- [ ] All services compile successfully
- [ ] IdentityService middleware is working (reference implementation)
- [ ] `/backend/MIDDLEWARE-INTEGRATION-GUIDE.md` is available
- [ ] `/backend/shared-config/common-appsettings.json` is available
- [ ] You have rate limiting configs ready in `/backend/rate-limiting-configs/`

---

## 🎯 Service-by-Service Checklist

### ✅ Service 1: IdentityService
**Status**: ✅ COMPLETE (Reference Implementation)  
**Port**: 5001  
**Rate Limit Profile**: Strict (30/min)

---

### ⏳ Service 2: VendorService

**Location**: `/backend/src/services/VendorService/`  
**Port**: 5002  
**Rate Limit Profile**: Standard (100/min)

#### Step 1: Update Program.cs
- [ ] Open `/backend/src/services/VendorService/Program.cs`
- [ ] Add FluentValidation (after `builder.Services.AddControllers()`)

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

- [ ] Add RealServ services (before `var app = builder.Build();`)

```csharp
// Add RealServ Observability (Correlation ID, Permission Service, etc.)
builder.Services.AddRealServObservability();

// Add Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

- [ ] Add middleware (after `app.UseAuthorization();`)

```csharp
// RealServ Middleware
app.UseRealServObservability();  // Correlation ID + Internal Auth
app.UseRealServRateLimiting();   // Rate limiting
```

- [ ] Add health checks (at the end, before `app.Run();`)

```csharp
// Health Checks
app.MapRealServHealthChecks();
```

#### Step 2: Update appsettings.json
- [ ] Open `/backend/src/services/VendorService/appsettings.json`
- [ ] Merge configuration from `/backend/shared-config/common-appsettings.json`
- [ ] Add VendorService-specific rate limiting config

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
    "GeneralLimit": {
      "PermitLimit": 100,
      "Window": "00:01:00"
    },
    "HourlyLimit": {
      "PermitLimit": 1000,
      "Window": "01:00:00"
    },
    "DailyLimit": {
      "PermitLimit": 10000,
      "Window": "1.00:00:00"
    }
  }
}
```

#### Step 3: Test VendorService
- [ ] Build the service: `dotnet build`
- [ ] Run the service: `dotnet run`
- [ ] Test health check: `curl http://localhost:5002/health`
- [ ] Test health ready: `curl http://localhost:5002/health/ready`
- [ ] Test rate limiting: Send 101 requests in 1 minute, verify 429 error
- [ ] Check logs for correlation IDs

**Expected Health Check Response:**
```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.1234567",
  "checks": {
    "postgresql": "Healthy",
    "self": "Healthy"
  }
}
```

---

### ⏳ Service 3: OrderService

**Location**: `/backend/src/services/OrderService/`  
**Port**: 5004  
**Rate Limit Profile**: Standard (100/min)

#### Step 1: Update Program.cs
- [ ] Open `/backend/src/services/OrderService/Program.cs`
- [ ] Add FluentValidation (after `builder.Services.AddControllers()`)

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

- [ ] Add RealServ services (before `var app = builder.Build();`)

```csharp
// Add RealServ Observability (Correlation ID, Permission Service, etc.)
builder.Services.AddRealServObservability();

// Add Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

- [ ] Add middleware (after `app.UseAuthorization();`)

```csharp
// RealServ Middleware
app.UseRealServObservability();  // Correlation ID + Internal Auth
app.UseRealServRateLimiting();   // Rate limiting
```

- [ ] Add health checks (at the end, before `app.Run();`)

```csharp
// Health Checks
app.MapRealServHealthChecks();
```

#### Step 2: Update appsettings.json
- [ ] Open `/backend/src/services/OrderService/appsettings.json`
- [ ] Merge configuration from `/backend/shared-config/common-appsettings.json`
- [ ] Add OrderService-specific rate limiting config

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
    "GeneralLimit": {
      "PermitLimit": 100,
      "Window": "00:01:00"
    },
    "HourlyLimit": {
      "PermitLimit": 1000,
      "Window": "01:00:00"
    },
    "DailyLimit": {
      "PermitLimit": 10000,
      "Window": "1.00:00:00"
    },
    "EndpointSpecificLimits": {
      "/api/v1/orders": {
        "PermitLimit": 20,
        "Window": "00:01:00"
      }
    }
  }
}
```

#### Step 3: Test OrderService
- [ ] Build the service: `dotnet build`
- [ ] Run the service: `dotnet run`
- [ ] Test health check: `curl http://localhost:5004/health`
- [ ] Test health ready: `curl http://localhost:5004/health/ready`
- [ ] Test rate limiting on `/api/v1/orders`: Send 21 requests in 1 minute
- [ ] Check logs for correlation IDs

---

### ⏳ Service 4: CatalogService

**Location**: `/backend/src/services/CatalogService/`  
**Port**: 5005  
**Rate Limit Profile**: Lenient (300/min for GET, 50/min for POST/PUT)

#### Step 1: Update Program.cs
- [ ] Open `/backend/src/services/CatalogService/Program.cs`
- [ ] Add FluentValidation (after `builder.Services.AddControllers()`)

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

- [ ] Add RealServ services (before `var app = builder.Build();`)

```csharp
// Add RealServ Observability (Correlation ID, Permission Service, etc.)
builder.Services.AddRealServObservability();

// Add Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

- [ ] Add middleware (after `app.UseAuthorization();`)

```csharp
// RealServ Middleware
app.UseRealServObservability();  // Correlation ID + Internal Auth
app.UseRealServRateLimiting();   // Rate limiting
```

- [ ] Add health checks (at the end, before `app.Run();`)

```csharp
// Health Checks
app.MapRealServHealthChecks();
```

#### Step 2: Update appsettings.json
- [ ] Open `/backend/src/services/CatalogService/appsettings.json`
- [ ] Merge configuration from `/backend/shared-config/common-appsettings.json`
- [ ] Add CatalogService-specific rate limiting config (Lenient profile)

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
    "GeneralLimit": {
      "PermitLimit": 300,
      "Window": "00:01:00"
    },
    "HourlyLimit": {
      "PermitLimit": 5000,
      "Window": "01:00:00"
    },
    "DailyLimit": {
      "PermitLimit": 50000,
      "Window": "1.00:00:00"
    },
    "MethodSpecificLimits": {
      "POST,PUT,DELETE": {
        "PermitLimit": 50,
        "Window": "00:01:00"
      }
    }
  }
}
```

#### Step 3: Test CatalogService
- [ ] Build the service: `dotnet build`
- [ ] Run the service: `dotnet run`
- [ ] Test health check: `curl http://localhost:5005/health`
- [ ] Test health ready: `curl http://localhost:5005/health/ready`
- [ ] Test rate limiting: Send 301 GET requests in 1 minute, verify 429 error
- [ ] Test POST rate limiting: Send 51 POST requests in 1 minute
- [ ] Check logs for correlation IDs

---

### ⏳ Service 5: PaymentService

**Location**: `/backend/src/services/PaymentService/`  
**Port**: 5007  
**Rate Limit Profile**: Strict (30/min)

#### Step 1: Update Program.cs
- [ ] Open `/backend/src/services/PaymentService/Program.cs`
- [ ] Add FluentValidation (after `builder.Services.AddControllers()`)

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

- [ ] Add RealServ services (before `var app = builder.Build();`)

```csharp
// Add RealServ Observability (Correlation ID, Permission Service, etc.)
builder.Services.AddRealServObservability();

// Add Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

- [ ] Add middleware (after `app.UseAuthorization();`)

```csharp
// RealServ Middleware
app.UseRealServObservability();  // Correlation ID + Internal Auth
app.UseRealServRateLimiting();   // Rate limiting
```

- [ ] Add health checks (at the end, before `app.Run();`)

```csharp
// Health Checks
app.MapRealServHealthChecks();
```

#### Step 2: Update appsettings.json
- [ ] Open `/backend/src/services/PaymentService/appsettings.json`
- [ ] Merge configuration from `/backend/shared-config/common-appsettings.json`
- [ ] Add PaymentService-specific rate limiting config (Strict + webhook whitelisting)

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
    "GeneralLimit": {
      "PermitLimit": 30,
      "Window": "00:01:00"
    },
    "HourlyLimit": {
      "PermitLimit": 300,
      "Window": "01:00:00"
    },
    "DailyLimit": {
      "PermitLimit": 3000,
      "Window": "1.00:00:00"
    },
    "EndpointSpecificLimits": {
      "/api/v1/payments": {
        "PermitLimit": 10,
        "Window": "00:01:00"
      }
    },
    "WhitelistedPaths": [
      "/api/v1/webhooks/razorpay",
      "/health",
      "/health/ready"
    ]
  }
}
```

#### Step 3: Test PaymentService
- [ ] Build the service: `dotnet build`
- [ ] Run the service: `dotnet run`
- [ ] Test health check: `curl http://localhost:5007/health`
- [ ] Test health ready: `curl http://localhost:5007/health/ready`
- [ ] Verify Razorpay health check shows connection status
- [ ] Test rate limiting: Send 31 requests in 1 minute
- [ ] Test webhook whitelist: Send requests to `/api/v1/webhooks/razorpay` (should NOT be rate limited)
- [ ] Check logs for correlation IDs

---

### ⏳ Service 6: NotificationService

**Location**: `/backend/src/services/NotificationService/`  
**Port**: 5010  
**Rate Limit Profile**: Standard (100/min)

#### Step 1: Update Program.cs
- [ ] Open `/backend/src/services/NotificationService/Program.cs`
- [ ] Add FluentValidation (after `builder.Services.AddControllers()`)

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

- [ ] Add RealServ services (before `var app = builder.Build();`)

```csharp
// Add RealServ Observability (Correlation ID, Permission Service, etc.)
builder.Services.AddRealServObservability();

// Add Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

- [ ] Add middleware (after `app.UseAuthorization();`)

```csharp
// RealServ Middleware
app.UseRealServObservability();  // Correlation ID + Internal Auth
app.UseRealServRateLimiting();   // Rate limiting
```

- [ ] Add health checks (at the end, before `app.Run();`)

```csharp
// Health Checks
app.MapRealServHealthChecks();
```

#### Step 2: Update appsettings.json
- [ ] Open `/backend/src/services/NotificationService/appsettings.json`
- [ ] Merge configuration from `/backend/shared-config/common-appsettings.json`
- [ ] Add NotificationService-specific rate limiting config

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
    "GeneralLimit": {
      "PermitLimit": 100,
      "Window": "00:01:00"
    },
    "HourlyLimit": {
      "PermitLimit": 1000,
      "Window": "01:00:00"
    },
    "DailyLimit": {
      "PermitLimit": 10000,
      "Window": "1.00:00:00"
    },
    "EndpointSpecificLimits": {
      "/api/v1/notifications/whatsapp": {
        "PermitLimit": 10,
        "Window": "00:01:00"
      },
      "/api/v1/notifications/email": {
        "PermitLimit": 20,
        "Window": "00:01:00"
      }
    }
  }
}
```

#### Step 3: Test NotificationService
- [ ] Build the service: `dotnet build`
- [ ] Run the service: `dotnet run`
- [ ] Test health check: `curl http://localhost:5010/health`
- [ ] Test health ready: `curl http://localhost:5010/health/ready`
- [ ] Verify WhatsApp health check (should show connection status)
- [ ] Test WhatsApp rate limiting: Send 11 requests to `/api/v1/notifications/whatsapp` in 1 minute
- [ ] Test Email rate limiting: Send 21 requests to `/api/v1/notifications/email` in 1 minute
- [ ] Check logs for correlation IDs

---

### ⏳ Service 7: IntegrationService

**Location**: `/backend/src/services/IntegrationService/`  
**Port**: 5012  
**Rate Limit Profile**: Standard (100/min)

#### Step 1: Update Program.cs
- [ ] Open `/backend/src/services/IntegrationService/Program.cs`
- [ ] Add FluentValidation (after `builder.Services.AddControllers()`)

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

- [ ] Add RealServ services (before `var app = builder.Build();`)

```csharp
// Add RealServ Observability (Correlation ID, Permission Service, etc.)
builder.Services.AddRealServObservability();

// Add Rate Limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);
```

- [ ] Add middleware (after `app.UseAuthorization();`)

```csharp
// RealServ Middleware
app.UseRealServObservability();  // Correlation ID + Internal Auth
app.UseRealServRateLimiting();   // Rate limiting
```

- [ ] Add health checks (at the end, before `app.Run();`)

```csharp
// Health Checks
app.MapRealServHealthChecks();
```

#### Step 2: Update appsettings.json
- [ ] Open `/backend/src/services/IntegrationService/appsettings.json`
- [ ] Merge configuration from `/backend/shared-config/common-appsettings.json`
- [ ] Add IntegrationService-specific rate limiting config

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
    "GeneralLimit": {
      "PermitLimit": 100,
      "Window": "00:01:00"
    },
    "HourlyLimit": {
      "PermitLimit": 1000,
      "Window": "01:00:00"
    },
    "DailyLimit": {
      "PermitLimit": 10000,
      "Window": "1.00:00:00"
    }
  }
}
```

#### Step 3: Test IntegrationService
- [ ] Build the service: `dotnet build`
- [ ] Run the service: `dotnet run`
- [ ] Test health check: `curl http://localhost:5012/health`
- [ ] Test health ready: `curl http://localhost:5012/health/ready`
- [ ] Verify Google Maps health check (should validate API key)
- [ ] Verify S3 health check (should check bucket access)
- [ ] Test rate limiting: Send 101 requests in 1 minute
- [ ] Check logs for correlation IDs

---

## ✅ Final Verification Checklist

After completing all 6 services:

### Build Check
- [ ] All 7 services build without errors: `dotnet build`
- [ ] No compilation warnings related to middleware

### Runtime Check
- [ ] All 7 services start successfully
- [ ] No startup errors in logs
- [ ] All services respond on their respective ports

### Health Check Matrix
| Service | URL | Status | DB Check | External Check |
|---------|-----|--------|----------|----------------|
| IdentityService | http://localhost:5001/health | ✅ | PostgreSQL | Firebase |
| VendorService | http://localhost:5002/health | ⏳ | PostgreSQL | - |
| OrderService | http://localhost:5004/health | ⏳ | PostgreSQL | - |
| CatalogService | http://localhost:5005/health | ⏳ | PostgreSQL | - |
| PaymentService | http://localhost:5007/health | ⏳ | PostgreSQL | Razorpay |
| NotificationService | http://localhost:5010/health | ⏳ | PostgreSQL | WhatsApp |
| IntegrationService | http://localhost:5012/health | ⏳ | - | Google Maps, S3 |

### Rate Limiting Check
- [ ] IdentityService: Login endpoint limited to 5/min
- [ ] VendorService: General limit 100/min
- [ ] OrderService: Order creation limited to 20/min
- [ ] CatalogService: GET 300/min, POST 50/min
- [ ] PaymentService: Payment creation limited to 10/min
- [ ] NotificationService: WhatsApp 10/min, Email 20/min
- [ ] IntegrationService: General limit 100/min

### Correlation ID Check
- [ ] All services log with correlation IDs
- [ ] Correlation ID format: GUID
- [ ] Correlation ID passed to downstream services
- [ ] Correlation ID returned in response headers

### RBAC Check
- [ ] All endpoints with `[RequirePermission]` work correctly
- [ ] 403 Forbidden when permission missing
- [ ] JWT claims checked first (fast path)
- [ ] IdentityService fallback works
- [ ] Helper methods (GetCurrentUserId, EnforceOwnership) work

---

## 🧪 Quick Test Script

Use this bash script to test all services:

```bash
#!/bin/bash

echo "Testing all RealServ services..."

# Health checks
echo "\n=== Health Checks ==="
curl -s http://localhost:5001/health | jq '.status'
curl -s http://localhost:5002/health | jq '.status'
curl -s http://localhost:5004/health | jq '.status'
curl -s http://localhost:5005/health | jq '.status'
curl -s http://localhost:5007/health | jq '.status'
curl -s http://localhost:5010/health | jq '.status'
curl -s http://localhost:5012/health | jq '.status'

# Correlation IDs
echo "\n=== Correlation ID Test ==="
curl -v http://localhost:5001/health 2>&1 | grep -i "x-correlation-id"

# Rate Limiting
echo "\n=== Rate Limiting Test ==="
for i in {1..35}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5001/health
done | tail -5  # Last 5 should be 429

echo "\nAll tests complete!"
```

Save as `/backend/test-middleware.sh` and run:
```bash
chmod +x /backend/test-middleware.sh
./backend/test-middleware.sh
```

---

## 📊 Progress Tracking

**Update this as you complete each service:**

- [x] IdentityService (Reference implementation)
- [ ] VendorService
- [ ] OrderService
- [ ] CatalogService
- [ ] PaymentService
- [ ] NotificationService
- [ ] IntegrationService

**Progress**: 1/7 (14%) → Target: 7/7 (100%)

---

## ⚠️ Common Issues & Solutions

### Issue 1: FluentValidation not found
**Solution**: Install package
```bash
dotnet add package FluentValidation.AspNetCore
```

### Issue 2: ObservabilityExtensions not found
**Solution**: Add using statement
```csharp
using RealServ.Shared.Observability.Extensions;
```

### Issue 3: Rate limiting not working
**Solution**: Check middleware order
```csharp
app.UseRealServObservability();     // MUST be before
app.UseRealServRateLimiting();      // rate limiting
```

### Issue 4: Health checks return 404
**Solution**: Ensure MapRealServHealthChecks() is called
```csharp
app.MapRealServHealthChecks();  // Add before app.Run()
```

### Issue 5: Correlation IDs not in logs
**Solution**: Ensure middleware order is correct
```csharp
app.UseRealServObservability();  // MUST be first
app.UseAuthentication();
app.UseAuthorization();
```

---

## 🎯 Success Criteria

**You're done when:**
- ✅ All 7 services build successfully
- ✅ All 7 services have health checks at `/health` and `/health/ready`
- ✅ All 7 services return correlation IDs in response headers
- ✅ All 7 services enforce rate limits correctly
- ✅ All 7 services log with correlation IDs
- ✅ All RBAC endpoints (168) work with permission checks

---

## 📈 Time Estimate per Service

| Service | Complexity | Estimated Time |
|---------|------------|----------------|
| VendorService | Low | 20-30 min |
| OrderService | Low | 20-30 min |
| CatalogService | Medium | 30-40 min |
| PaymentService | Medium | 30-40 min |
| NotificationService | Low | 20-30 min |
| IntegrationService | Low | 20-30 min |
| **Testing All** | - | 30-45 min |
| **TOTAL** | - | **2.5-4 hours** |

---

**Ready to start?** Pick any service and follow the checklist step-by-step. Each service is independent, so you can do them in any order!

**Recommended Order:**
1. VendorService (simple, no external dependencies)
2. CatalogService (simple, no external dependencies)
3. OrderService (standard profile)
4. NotificationService (WhatsApp health check)
5. PaymentService (Razorpay health check + webhook whitelist)
6. IntegrationService (Google Maps + S3 health checks)

---

**Created**: January 12, 2026  
**Last Updated**: After RBAC completion
