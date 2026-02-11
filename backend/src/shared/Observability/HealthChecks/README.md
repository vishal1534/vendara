# RealServ Health Checks

Comprehensive health check implementations for all external dependencies.

---

## 📋 Available Health Checks

| Health Check | Purpose | Configuration Required | Tags |
|--------------|---------|----------------------|------|
| **PostgreSQL** | Database connectivity | Connection string | `database`, `infrastructure` |
| **Redis** | Cache connectivity | Connection string | `cache`, `infrastructure` |
| **Firebase** | Auth service availability | Firebase config | `external`, `auth` |
| **Razorpay** | Payment gateway | API keys | `external`, `payment` |
| **WhatsApp** | Messaging service | Access token | `external`, `messaging` |
| **Google Maps** | Location services | API key | `external`, `location` |
| **AWS S3** | File storage | Bucket name, credentials | `external`, `storage` |

---

## 🚀 Quick Start

### 1. Add Health Checks to Program.cs

```csharp
using RealServ.Shared.Observability.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add health checks with all external dependencies
builder.Services.AddHealthChecks()
    // Infrastructure checks (required)
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("Database")!,
        name: "database",
        tags: new[] { "infrastructure", "database" }
    )
    .AddRedis(
        redisConnectionString: builder.Configuration["Redis:ConnectionString"]!,
        name: "redis",
        tags: new[] { "infrastructure", "cache" }
    )
    // External dependency checks (automatically added based on configuration)
    .AddRealServExternalDependencies("IdentityService");

var app = builder.Build();

// Map health check endpoints
app.MapRealServHealthChecks();

app.Run();
```

### 2. Configure External Services (appsettings.json)

```json
{
  "ConnectionStrings": {
    "Database": "Host=localhost;Port=5432;Database=realserv_identity_db;Username=postgres;Password=postgres"
  },
  "Redis": {
    "ConnectionString": "localhost:6379"
  },
  "Razorpay": {
    "KeyId": "rzp_test_...",
    "KeySecret": "..."
  },
  "WhatsApp": {
    "AccessToken": "...",
    "PhoneNumberId": "...",
    "BusinessAccountId": "..."
  },
  "GoogleMaps": {
    "ApiKey": "..."
  },
  "AWS": {
    "Region": "ap-south-1",
    "S3BucketName": "realserv-media-dev"
  }
}
```

### 3. Test Health Endpoints

```bash
# Simple health check (liveness)
curl http://localhost:5001/health

# Response:
{
  "status": "Healthy",
  "timestamp": "2026-01-12T10:30:00Z"
}

# Detailed health check (readiness)
curl http://localhost:5001/health/ready

# Response:
{
  "status": "Healthy",
  "timestamp": "2026-01-12T10:30:00Z",
  "duration": "125ms",
  "results": {
    "database": {
      "status": "Healthy",
      "duration": "45ms",
      "data": {}
    },
    "redis": {
      "status": "Healthy",
      "duration": "12ms",
      "data": {}
    },
    "firebase": {
      "status": "Healthy",
      "duration": "8ms",
      "data": {
        "projectId": "realserv-dev"
      }
    },
    "razorpay": {
      "status": "Healthy",
      "duration": "35ms",
      "data": {
        "environment": "test"
      }
    }
  }
}
```

---

## 📊 Health Check Statuses

Each health check returns one of three statuses:

### ✅ Healthy
- Service is fully operational
- All tests passed
- Ready to serve traffic

### ⚠️ Degraded
- Service is operational but has issues
- Non-critical dependency unavailable
- Can still serve traffic (with reduced functionality)

**Examples:**
- External API not configured (missing API key)
- External API slow response time
- Cache miss rate high

### ❌ Unhealthy
- Service is NOT operational
- Critical dependency unavailable
- Should NOT serve traffic

**Examples:**
- Database connection failed
- Invalid API credentials
- Network error

---

## 🔧 Per-Service Configuration

### IdentityService

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, "database")
    .AddRedis(redisConnection, "redis")
    .AddRealServExternalDependencies("IdentityService");
```

**External Dependencies:**
- ✅ Firebase (required - for authentication)
- ⚠️ Redis (optional - for session caching)

---

### OrderService

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, "database")
    .AddRealServExternalDependencies("OrderService");
```

**External Dependencies:**
- ✅ Database (required)
- ⚠️ Firebase (optional - for user verification)

---

### PaymentService

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, "database")
    .AddRealServExternalDependencies("PaymentService");
```

**External Dependencies:**
- ✅ Database (required)
- ✅ Razorpay (required - for payments)

---

### VendorService

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, "database")
    .AddRedis(redisConnection, "redis")
    .AddRealServExternalDependencies("VendorService");
```

**External Dependencies:**
- ✅ Database (required)
- ⚠️ Redis (optional - for caching)

---

### CatalogService

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, "database")
    .AddRealServExternalDependencies("CatalogService");
```

**External Dependencies:**
- ✅ Database (required)

---

### NotificationService

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, "database")
    .AddRedis(redisConnection, "redis")
    .AddRealServExternalDependencies("NotificationService");
```

**External Dependencies:**
- ✅ Database (required)
- ✅ WhatsApp (required - for WhatsApp messages)
- ⚠️ Redis (optional - for rate limiting)
- ⚠️ AWS SES (optional - for emails)

---

### IntegrationService

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, "database")
    .AddRedis(redisConnection, "redis")
    .AddRealServExternalDependencies("IntegrationService");
```

**External Dependencies:**
- ✅ Database (required)
- ✅ Redis (required - for caching)
- ✅ WhatsApp (required - for messaging)
- ✅ Google Maps (required - for geocoding)
- ✅ AWS S3 (required - for file storage)

---

## 🏥 Kubernetes/ECS Configuration

### Liveness Probe
Used to determine if the application is running. If fails, restart the container.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5001
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

### Readiness Probe
Used to determine if the application is ready to serve traffic. If fails, remove from load balancer.

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 5001
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 5
  failureThreshold: 3
```

---

## 📊 Monitoring & Alerts

### CloudWatch Alarms

Create alarms for health check failures:

```hcl
# Terraform example
resource "aws_cloudwatch_metric_alarm" "service_unhealthy" {
  alarm_name          = "identity-service-unhealthy"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HealthCheckFailed"
  namespace           = "RealServ/IdentityService"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "This metric monitors health check failures"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}
```

### Health Check Dashboard

Create a CloudWatch dashboard showing all service health:

1. Go to CloudWatch Console
2. Create Dashboard
3. Add widgets for each service's `/health/ready` endpoint
4. Monitor in real-time

---

## 🔍 Troubleshooting

### Health Check Always Returns Degraded

**Issue:** Firebase/Razorpay/WhatsApp health check returns `Degraded` status

**Cause:** API credentials not configured in appsettings.json

**Solution:**
```json
{
  "Razorpay": {
    "KeyId": "rzp_test_...",  // ← Add this
    "KeySecret": "..."         // ← Add this
  }
}
```

---

### Health Check Timeout

**Issue:** `/health/ready` takes >5 seconds to respond

**Cause:** External API calls are slow or timing out

**Solution:**
- Add timeout configuration to health checks
- Consider caching health check results
- Use separate health check for slow dependencies

```csharp
builder.Services.AddHealthChecks()
    .AddCheck<RazorpayHealthCheck>(
        "razorpay",
        failureStatus: HealthStatus.Degraded,
        timeout: TimeSpan.FromSeconds(3)  // ← Add timeout
    );
```

---

### Database Health Check Fails

**Issue:** Database health check returns `Unhealthy`

**Cause:** Connection string incorrect or database not running

**Solution:**
1. Verify connection string in appsettings.json
2. Check database is running: `docker-compose ps postgres-identity`
3. Test connection: `psql -h localhost -p 5432 -U postgres -d realserv_identity_db`

---

## 📚 Advanced Usage

### Custom Health Checks

Create your own health check for custom dependencies:

```csharp
using Microsoft.Extensions.Diagnostics.HealthChecks;

public class CustomApiHealthCheck : IHealthCheck
{
    private readonly HttpClient _httpClient;

    public CustomApiHealthCheck(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync(
                "https://api.example.com/health",
                cancellationToken
            );

            return response.IsSuccessStatusCode
                ? HealthCheckResult.Healthy("API is accessible")
                : HealthCheckResult.Unhealthy($"API returned {response.StatusCode}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("API unreachable", ex);
        }
    }
}

// Register in Program.cs
builder.Services.AddHealthChecks()
    .AddCheck<CustomApiHealthCheck>("custom-api");
```

---

### Filter Health Checks by Tag

Check only infrastructure dependencies:

```csharp
app.MapHealthChecks("/health/infrastructure", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("infrastructure")
});
```

Check only external dependencies:

```csharp
app.MapHealthChecks("/health/external", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("external")
});
```

---

## 📖 References

- [ASP.NET Core Health Checks](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks)
- [AspNetCore.Diagnostics.HealthChecks](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks)
- [Health Check UI](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks#healthchecks-ui)

---

**Created**: January 12, 2026  
**Last Updated**: January 12, 2026  
**Owner**: RealServ Tech Team
