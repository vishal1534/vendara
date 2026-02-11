# Health Check Implementation Guide

**Date**: January 12, 2026  
**Purpose**: Step-by-step guide to add health checks to all RealServ services

---

## ✅ What We've Created

### New Files (6 health check classes)
1. `FirebaseHealthCheck.cs` - Firebase Authentication
2. `RazorpayHealthCheck.cs` - Payment Gateway
3. `WhatsAppHealthCheck.cs` - WhatsApp Cloud API
4. `GoogleMapsHealthCheck.cs` - Google Maps Geocoding
5. `S3HealthCheck.cs` - AWS S3 Storage
6. `HealthCheckExtensions.cs` - Easy setup extensions
7. `HealthChecks/README.md` - Complete documentation

---

## 🎯 Implementation Checklist

### Service 1: IdentityService ⏳

**Current State:**
```csharp
// IdentityService/Program.cs (line 66)
builder.Services.AddHealthChecks()
    .AddDbContextCheck<IdentityServiceDbContext>("database");
```

**Enhanced Version:**
```csharp
using RealServ.Shared.Observability.Extensions;

// Add health checks with external dependencies
builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("IdentityServiceDb")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRedis(
        redisConnectionString: builder.Configuration["Redis:ConnectionString"]!,
        name: "redis",
        tags: new[] { "infrastructure", "cache" }
    )
    .AddRealServExternalDependencies("IdentityService");

// Later in the file, after app.Build()
app.MapRealServHealthChecks();
```

**Configuration Required:**
- ✅ Already has: Database connection
- ✅ Already has: Redis connection
- ✅ Already has: Firebase configuration
- ❌ Missing: None

**Files to Update:**
- [ ] `/backend/src/services/IdentityService/Program.cs`

---

### Service 2: VendorService ⏳

**Current State:**
```csharp
// VendorService/Program.cs (line 213)
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("VendorServiceDb")!)
    .AddRedis(redisConnection!);
```

**Enhanced Version:**
```csharp
using RealServ.Shared.Observability.Extensions;

builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("VendorServiceDb")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRedis(
        redisConnectionString: redisConnection!,
        name: "redis",
        tags: new[] { "infrastructure", "cache" }
    )
    .AddRealServExternalDependencies("VendorService");

// Later in the file, after app.Build()
app.MapRealServHealthChecks();
```

**Configuration Required:**
- ✅ Already has: Database, Redis
- ⚠️ Optional: Firebase (for user verification)

**Files to Update:**
- [ ] `/backend/src/services/VendorService/Program.cs`

---

### Service 3: OrderService ⏳

**Current State:**
```csharp
// OrderService/Program.cs (line 223)
builder.Services.AddHealthChecks()
    .AddDbContextCheck<OrderServiceDbContext>("database");
```

**Enhanced Version:**
```csharp
using RealServ.Shared.Observability.Extensions;

builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("OrderServiceDb")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRealServExternalDependencies("OrderService");

// Later in the file, after app.Build()
app.MapRealServHealthChecks();
```

**Configuration Required:**
- ✅ Already has: Database
- ⚠️ Optional: Firebase (for user verification)

**Files to Update:**
- [ ] `/backend/src/services/OrderService/Program.cs`

---

### Service 4: CatalogService ⏳

**Current State:**
```csharp
// CatalogService/Program.cs (line 196)
builder.Services.AddHealthChecks()
    .AddDbContextCheck<CatalogServiceDbContext>("database");
```

**Enhanced Version:**
```csharp
using RealServ.Shared.Observability.Extensions;

builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("CatalogServiceDb")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRealServExternalDependencies("CatalogService");

// Later in the file, after app.Build()
app.MapRealServHealthChecks();
```

**Configuration Required:**
- ✅ Already has: Database
- ❌ No external dependencies needed

**Files to Update:**
- [ ] `/backend/src/services/CatalogService/Program.cs`

---

### Service 5: PaymentService ⏳

**Current State:**
```csharp
// Check if PaymentService has health checks
```

**Enhanced Version:**
```csharp
using RealServ.Shared.Observability.Extensions;

builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("PaymentServiceDb")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRealServExternalDependencies("PaymentService");

// Later in the file, after app.Build()
app.MapRealServHealthChecks();
```

**Configuration Required:**
- ✅ Database
- ✅ Razorpay (required for payments)

**Files to Update:**
- [ ] `/backend/src/services/PaymentService/Program.cs`

---

### Service 6: NotificationService ⏳

**Current State:**
```csharp
// NotificationService/Program.cs (line 103)
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString!)
    .AddRedis(redisConnection!);
```

**Enhanced Version:**
```csharp
using RealServ.Shared.Observability.Extensions;

builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: connectionString!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRedis(
        redisConnectionString: redisConnection!,
        name: "redis",
        tags: new[] { "infrastructure", "cache" }
    )
    .AddRealServExternalDependencies("NotificationService");

// Later in the file, after app.Build()
app.MapRealServHealthChecks();
```

**Configuration Required:**
- ✅ Already has: Database, Redis
- ✅ WhatsApp (required for messaging)
- ⚠️ AWS SES (optional for emails)

**Files to Update:**
- [ ] `/backend/src/services/NotificationService/Program.cs`

---

### Service 7: IntegrationService ⏳

**Current State:**
```csharp
// Check IntegrationService health checks
```

**Enhanced Version:**
```csharp
using RealServ.Shared.Observability.Extensions;

builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("IntegrationServiceDb")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRedis(
        redisConnectionString: builder.Configuration["Redis:ConnectionString"]!,
        name: "redis",
        tags: new[] { "infrastructure", "cache" }
    )
    .AddRealServExternalDependencies("IntegrationService");

// Later in the file, after app.Build()
app.MapRealServHealthChecks();
```

**Configuration Required:**
- ✅ Database, Redis (required)
- ✅ WhatsApp (required for messaging)
- ✅ Google Maps (required for geocoding)
- ✅ AWS S3 (required for file storage)

**Files to Update:**
- [ ] `/backend/src/services/IntegrationService/Program.cs`

---

## 📝 Standard Implementation Template

For any service, follow this pattern:

### 1. Add using statement

```csharp
using RealServ.Shared.Observability.Extensions;
```

### 2. Update health checks registration

```csharp
builder.Services.AddHealthChecks()
    // Database (required for all services)
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("ServiceNameDb")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    // Redis (if service uses caching)
    .AddRedis(
        redisConnectionString: builder.Configuration["Redis:ConnectionString"]!,
        name: "redis",
        tags: new[] { "infrastructure", "cache" }
    )
    // External dependencies (automatically added based on config)
    .AddRealServExternalDependencies("ServiceName");
```

### 3. Map health endpoints

```csharp
var app = builder.Build();

// ... other middleware

// Map health check endpoints (before app.Run())
app.MapRealServHealthChecks();

app.Run();
```

---

## 🧪 Testing Health Checks

After implementing, test each service:

### 1. Start the service

```bash
cd src/services/IdentityService
dotnet run
```

### 2. Test liveness endpoint

```bash
curl http://localhost:5001/health

# Expected response:
{
  "status": "Healthy",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### 3. Test readiness endpoint

```bash
curl http://localhost:5001/health/ready | jq

# Expected response (formatted):
{
  "status": "Healthy",
  "timestamp": "2026-01-12T10:30:00Z",
  "duration": "125ms",
  "results": {
    "database": {
      "status": "Healthy",
      "duration": "45ms",
      "description": "Database check passed",
      "data": {},
      "tags": ["infrastructure", "database"]
    },
    "redis": {
      "status": "Healthy",
      "duration": "12ms",
      "description": "Redis check passed",
      "data": {},
      "tags": ["infrastructure", "cache"]
    },
    "firebase": {
      "status": "Healthy",
      "duration": "8ms",
      "description": "Firebase Admin SDK is initialized and ready",
      "data": {
        "projectId": "realserv-dev"
      },
      "tags": ["external", "auth", "identityservice"]
    }
  }
}
```

### 4. Test with stopped dependency

```bash
# Stop Redis
docker-compose stop redis

# Test again
curl http://localhost:5001/health/ready | jq

# Expected: redis check returns "Unhealthy"
{
  "status": "Unhealthy",
  "results": {
    "redis": {
      "status": "Unhealthy",
      "description": "Redis connection failed",
      "exception": "Unable to connect to Redis..."
    }
  }
}

# Start Redis again
docker-compose start redis
```

---

## 📊 Expected Results Per Service

| Service | Database | Redis | Firebase | Razorpay | WhatsApp | Google Maps | S3 |
|---------|----------|-------|----------|----------|----------|-------------|-----|
| **IdentityService** | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **VendorService** | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **OrderService** | ✅ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **CatalogService** | ✅ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **PaymentService** | ✅ | ❌ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| **NotificationService** | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ | ⚠️ |
| **IntegrationService** | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Required (will return Unhealthy if missing/failed)
- ⚠️ Optional (will return Degraded if not configured, but service still works)
- ❌ Not used

---

## 🚀 Next Steps

After implementing health checks:

1. **Add to all 7 services** (1 hour each = 7 hours total)
2. **Test each service** (15 min each = 1.75 hours)
3. **Configure ECS health checks** (use `/health` for liveness, `/health/ready` for readiness)
4. **Set up CloudWatch alarms** (alert when services become unhealthy)

---

**Status**: Ready for implementation  
**Estimated Time**: 1 day  
**Next**: Apply to IdentityService first, then roll out to others
