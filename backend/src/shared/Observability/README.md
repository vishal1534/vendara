# RealServ.Shared.Observability

AWS CloudWatch observability library for RealServ microservices.

## Features

- ✅ **Structured Logging** with Serilog → CloudWatch Logs
- ✅ **Custom Metrics** publishing to CloudWatch Metrics
- ✅ **Request/Response Logging** middleware
- ✅ **Exception Tracking** with correlation IDs
- ✅ **Business Metrics** for tracking domain events
- ✅ **Performance Monitoring** for API calls and database queries
- ✅ **Correlation IDs** for distributed tracing across services
- ✅ **Service-to-Service Authentication** with internal API keys
- ✅ **Permission-Based Authorization** (RBAC) middleware
- ✅ **Global Exception Handling** with standardized error responses

## Quick Start

### 1. Add Package Reference

```xml
<ItemGroup>
  <ProjectReference Include="..\..\shared\RealServ.Shared.Observability.csproj" />
</ItemGroup>
```

### 2. Configure appsettings.json

```json
{
  "CloudWatch": {
    "Region": "ap-south-1",
    "LogGroupName": "/realserv/identity-service",
    "EnableCloudWatch": true,
    "EnableMetrics": true,
    "MetricsNamespace": "RealServ",
    "MinimumLevel": "Information",
    "BatchSizeLimit": 100,
    "Period": 10,
    "LogHttpRequests": true,
    "EnablePerformanceTracking": true
  }
}
```

**Environment Variables** (Production - use IAM roles instead):
```bash
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 3. Update Program.cs

```csharp
using RealServ.Shared.Observability.Extensions;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add Serilog with CloudWatch
builder.Services.AddSerilogWithCloudWatch(builder.Configuration, "IdentityService");
builder.Host.UseSerilog();

// Add CloudWatch observability
builder.Services.AddCloudWatchObservability(builder.Configuration, "IdentityService");

// Add RealServ observability services (NEW - includes permission service, caching)
builder.Services.AddRealServObservability();

var app = builder.Build();

// Use observability middleware (includes correlation ID, logging, exception handling)
app.UseRealServObservability();

// Optional: Protect internal endpoints with API key authentication
app.UseInternalApiAuth("/internal"); // Only /internal/* routes require X-Internal-API-Key

app.Run();
```

### 4. Use Business Metrics

```csharp
public class AuthService
{
    private readonly IBusinessMetricsService _metrics;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IBusinessMetricsService metrics, ILogger<AuthService> logger)
    {
        _metrics = metrics;
        _logger = logger;
    }

    public async Task<User> RegisterUserAsync(RegisterUserRequest request)
    {
        // Your logic here
        var user = await CreateUserAsync(request);

        // Track metric
        await _metrics.TrackUserRegistrationAsync(request.UserType);

        _logger.LogInformation("User {UserId} registered successfully", user.Id);
        return user;
    }
}
```

## CloudWatch Log Groups Structure

```
/realserv/identity-service
  └─ IdentityService-2026-01-11-10-30-00

/realserv/order-service
  └─ OrderService-2026-01-11-10-30-00

/realserv/payment-service
  └─ PaymentService-2026-01-11-10-30-00
```

## CloudWatch Metrics Namespaces

```
RealServ/IdentityService
  ├─ ApiRequestCount
  ├─ ApiRequestDuration
  ├─ ApiErrorCount
  ├─ UserRegistration
  └─ UserLogin

RealServ/OrderService
  ├─ OrderCreated
  ├─ OrderStatusChange
  └─ OrderValue

RealServ/PaymentService
  ├─ PaymentInitiated
  ├─ PaymentSuccess
  └─ PaymentFailure
```

## Custom Metrics

### Using ICloudWatchMetricsPublisher

```csharp
public class OrderService
{
    private readonly ICloudWatchMetricsPublisher _metrics;

    public async Task CreateOrderAsync(Order order)
    {
        var stopwatch = Stopwatch.StartNew();
        
        // Your logic
        await SaveOrderAsync(order);
        
        stopwatch.Stop();

        // Publish custom metrics
        await _metrics.PublishTimingAsync(
            "OrderCreationDuration",
            stopwatch.ElapsedMilliseconds,
            new Dictionary<string, string>
            {
                { "OrderType", order.Type },
                { "VendorId", order.VendorId.ToString() }
            }
        );
    }
}
```

### Using IBusinessMetricsService

```csharp
// Track user events
await _businessMetrics.TrackUserRegistrationAsync("Buyer");
await _businessMetrics.TrackUserLoginAsync("Vendor");

// Track order events
await _businessMetrics.TrackOrderCreatedAsync("Material", 15000m);
await _businessMetrics.TrackOrderStatusChangeAsync("Pending", "Confirmed");

// Track payment events
await _businessMetrics.TrackPaymentSuccessAsync("Razorpay", 15000m);

// Track performance
await _businessMetrics.TrackDatabaseQueryAsync("GetUserById", 45.2);
await _businessMetrics.TrackExternalApiCallAsync("RazorpayVerify", 250.5, true);
```

## NEW: Correlation IDs for Distributed Tracing

Every request is automatically assigned a correlation ID that flows through all services:

```csharp
// Correlation ID is automatically added to:
// 1. All log statements
// 2. Response headers (X-Correlation-ID)
// 3. HttpContext.Items["CorrelationId"]

// Access in controllers:
var correlationId = HttpContext.GetCorrelationId();

// Pass to downstream services:
var request = new HttpRequestMessage(HttpMethod.Post, "http://payment-service/api/payments");
request.AddCorrelationId(correlationId);
var response = await _httpClient.SendAsync(request);
```

**How it works:**
1. Client sends request (optionally with `X-Correlation-ID` header)
2. If no header, middleware generates new GUID
3. Correlation ID added to all logs in this request
4. Correlation ID returned in response header
5. Can be used to trace request across multiple services

## NEW: Service-to-Service Authentication

Protect internal endpoints with API key authentication:

### Configuration

```json
{
  "InternalApiKeys": {
    "IdentityService": "5c8a2f9e-4b7d-4e3a-9f2c-1d8e7a6b5c4d",
    "OrderService": "7d9b3e1f-6c8a-5d4b-0e3d-2f9g8h7i6j5k",
    "PaymentService": "9e1c5g3h-8d0b-7f6e-2a4c-3k1l9m8n7o6p"
  }
}
```

### Usage in Program.cs

```csharp
// Protect ALL routes with internal API auth:
app.UseRealServObservability(useInternalApiAuth: true);

// OR protect only specific routes:
app.UseRealServObservability();
app.UseInternalApiAuth("/internal"); // Only /internal/* requires auth
```

### Calling Another Service

```csharp
// OrderService → PaymentService
var request = new HttpRequestMessage(HttpMethod.Post, 
    "http://payment-service/api/v1/payments/capture");

// Add internal API key
request.Headers.Add("X-Internal-API-Key", 
    _config["InternalApiKeys:PaymentService"]);

var response = await _httpClient.SendAsync(request);
```

## NEW: Permission-Based Authorization (RBAC)

Enforce fine-grained permissions on any endpoint:

### Configuration

```json
{
  "Services": {
    "IdentityServiceUrl": "http://identity-service:5001"
  },
  "InternalApiKeys": {
    "IdentityService": "your-secret-key"
  }
}
```

### Register in Program.cs

```csharp
builder.Services.AddRealServObservability(); // Includes IPermissionService
```

### Usage on Controllers/Actions

```csharp
using RealServ.Shared.Observability.Authorization;

[ApiController]
[Route("api/v1/orders")]
public class OrdersController : ControllerBase
{
    [HttpPost]
    [RequirePermission("orders:create")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        // Only users with "orders:create" permission can access this
        // ...
    }

    [HttpPost("{id}/cancel")]
    [RequirePermission("orders:cancel")]
    public async Task<IActionResult> CancelOrder(string id)
    {
        // Only users with "orders:cancel" permission can access this
        // ...
    }

    [HttpGet]
    [RequirePermission("orders:read")]
    public async Task<IActionResult> GetOrders()
    {
        // Only users with "orders:read" permission can access this
        // ...
    }
}
```

### How it Works

1. User authenticates via Firebase (JWT token)
2. `[RequirePermission]` attribute checks JWT claims for "permissions" claim
3. If not in JWT, calls IdentityService `/api/v1/admin/users/{userId}/permissions`
4. Permissions cached for 5 minutes to reduce calls to IdentityService
5. Returns 403 Forbidden if user lacks permission

### Permission Naming Convention

Use colon-separated format: `resource:action`

Examples:
- `orders:create`, `orders:read`, `orders:update`, `orders:cancel`
- `payments:create`, `payments:refund`, `payments:read`
- `vendors:approve`, `vendors:reject`, `vendors:read`
- `users:create`, `users:delete`, `users:update`

### Including Permissions in JWT (Optional - Better Performance)

Instead of calling IdentityService on every request, include permissions in JWT:

```csharp
// IdentityService: When generating JWT, add permissions claim
var claims = new List<Claim>
{
    new Claim("user_id", user.Id.ToString()),
    new Claim("email", user.Email),
    new Claim("permissions", string.Join(",", userPermissions)) // Comma-separated
};
```

Then `[RequirePermission]` will check claims first (no HTTP call needed).

## NEW: Global Exception Handling

All unhandled exceptions are automatically caught and logged:

```csharp
// Any exception thrown in your code:
throw new InvalidOperationException("Order not found");

// Is automatically caught and returned as:
{
  "message": "An error occurred while processing your request",
  "statusCode": 500,
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/orders/123",
  "errors": [
    "CorrelationId: 5c8a2f9e-4b7d-4e3a-9f2c-1d8e7a6b5c4d"
  ]
}
```

Exception is logged with full stack trace and correlation ID for debugging.

## CloudWatch Insights Queries

### Find All Errors (Last Hour)

```
fields @timestamp, @message, @logStream
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100
```

### API Performance by Endpoint

```
fields RequestPath, Duration
| filter RequestPath like /api/
| stats avg(Duration) as AvgDuration, max(Duration) as MaxDuration by RequestPath
| sort AvgDuration desc
```

### Failed Logins

```
fields @timestamp, UserType, Reason
| filter @message like /UserLoginFailure/
| stats count() by UserType, Reason
```

### Payment Failures

```
fields @timestamp, PaymentMethod, Reason
| filter @message like /PaymentFailure/
| stats count() by PaymentMethod, Reason
```

## CloudWatch Alarms

See `/backend/infrastructure/cloudwatch/alarms.md` for alarm configuration.

## Local Development

Disable CloudWatch for local development:

```json
{
  "CloudWatch": {
    "EnableCloudWatch": false,
    "EnableMetrics": false
  }
}
```

Logs will be written to console only.

## Production Deployment

### IAM Role Permissions

Create IAM role for ECS tasks with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "arn:aws:logs:ap-south-1:*:log-group:/realserv/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData"
      ],
      "Resource": "*"
    }
  ]
}
```

### Environment Variables

```bash
ASPNETCORE_ENVIRONMENT=Production
AWS_REGION=ap-south-1
# IAM role will provide credentials automatically
```

## Troubleshooting

### Logs Not Appearing in CloudWatch

1. Check IAM permissions
2. Verify `EnableCloudWatch: true` in config
3. Check AWS region matches
4. View application logs for AWS SDK errors

### Metrics Not Publishing

1. Verify `EnableMetrics: true` in config
2. Check IAM permissions for `cloudwatch:PutMetricData`
3. Ensure metrics namespace is correct
4. Check for exceptions in logs

## References

- [AWS CloudWatch Logs Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/)
- [Serilog AWS Sink](https://github.com/aws/aws-logging-dotnet)
- [CloudWatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/)