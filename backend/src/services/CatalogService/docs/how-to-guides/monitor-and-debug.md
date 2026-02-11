---
title: Monitor and Debug
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: devops
---

# Monitor and Debug - Catalog Service

**Service:** Catalog Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026

> **Quick Summary:** Monitoring setup with CloudWatch, logging with Serilog, and debugging techniques.

---

## CloudWatch Logging

### View Logs

```bash
# Tail logs (real-time)
aws logs tail /realserv/catalog-service --follow

# Filter by error level
aws logs filter-pattern /realserv/catalog-service --filter-pattern "ERROR"

# Search for specific errors
aws logs filter-pattern /realserv/catalog-service --filter-pattern "Material not found"

# Time range
aws logs tail /realserv/catalog-service \
  --since 1h \
  --format short
```

### Log Insights Queries

**Error Rate:**
```sql
fields @timestamp, @message
| filter @message like /ERROR/
| stats count() as error_count by bin(5m)
```

**Slow Queries:**
```sql
fields @timestamp, @message
| filter @message like /Database query took/
| parse @message /took (?<duration>\d+)ms/
| filter duration > 100
| sort duration desc
```

**API Endpoint Performance:**
```sql
fields @timestamp, endpoint, duration_ms
| filter endpoint like /api/v1/materials/
| stats avg(duration_ms), max(duration_ms), p99(duration_ms) by endpoint
```

---

## Structured Logging with Serilog

### Setup

```csharp
// Program.cs
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Service", "CatalogService")
        .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
        .WriteTo.Console()
        .WriteTo.AWSCloudWatch(
            logGroup: "/realserv/catalog-service",
            region: Amazon.RegionEndpoint.APSouth1);
});
```

### Log Best Practices

```csharp
// GOOD: Structured logging
_logger.LogInformation(
    "Material created: {MaterialId}, Name: {MaterialName}, Price: {BasePrice}",
    material.Id, material.Name, material.BasePrice);

// BAD: String interpolation (not searchable)
_logger.LogInformation($"Material created: {material.Id}");

// Log levels
_logger.LogTrace("Entering GetMaterialAsync");        // Trace
_logger.LogDebug("Found {Count} materials", count);   // Debug
_logger.LogInformation("Material created");           // Information
_logger.LogWarning("Price exceeds threshold");        // Warning
_logger.LogError(ex, "Failed to create material");    // Error
_logger.LogCritical(ex, "Database unreachable");      // Critical
```

---

## CloudWatch Metrics

### Built-in Metrics

Dashboard: **RealServ Catalog Service**

1. **ECS Metrics**:
   - CPUUtilization (target: < 70%)
   - MemoryUtilization (target: < 80%)
   - RunningTaskCount (minimum: 2)

2. **ALB Metrics**:
   - TargetResponseTime (target: < 200ms)
   - RequestCount
   - HTTPCode_Target_4XX_Count
   - HTTPCode_Target_5XX_Count
   - HealthyHostCount (minimum: 2)

3. **RDS Metrics**:
   - DatabaseConnections
   - ReadLatency (target: < 100ms)
   - WriteLatency (target: < 100ms)
   - CPUUtilization (target: < 70%)

### Custom Metrics

```csharp
// Install: dotnet add package AWSSDK.CloudWatch

var cloudWatch = new AmazonCloudWatchClient();

await cloudWatch.PutMetricDataAsync(new PutMetricDataRequest
{
    Namespace = "RealServ/CatalogService",
    MetricData = new List<MetricDatum>
    {
        new MetricDatum
        {
            MetricName = "MaterialCreated",
            Value = 1,
            Unit = StandardUnit.Count,
            TimestampUtc = DateTime.UtcNow
        }
    }
});
```

---

## CloudWatch Alarms

### High Error Rate

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name catalog-service-high-error-rate \
  --alarm-description "Alert when 5XX errors exceed threshold" \
  --metric-name HTTPCode_Target_5XX_Count \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 60 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:realserv-alerts
```

### High Response Time

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name catalog-service-slow-response \
  --metric-name TargetResponseTime \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 60 \
  --threshold 0.5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 3 \
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:realserv-alerts
```

### Unhealthy Hosts

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name catalog-service-unhealthy-hosts \
  --metric-name HealthyHostCount \
  --namespace AWS/ApplicationELB \
  --statistic Minimum \
  --period 60 \
  --threshold 1 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:realserv-alerts
```

---

## Debugging Techniques

### 1. Enable Debug Logging

```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

### 2. EF Core Query Logging

```csharp
// See all SQL queries
builder.Services.AddDbContext<CatalogServiceDbContext>(options =>
{
    options.UseNpgsql(connectionString)
           .LogTo(Console.WriteLine, LogLevel.Information)  // Log queries to console
           .EnableSensitiveDataLogging()  // Include parameter values (dev only!)
           .EnableDetailedErrors();
});
```

### 3. Remote Debugging (ECS)

```bash
# Enable SSH to ECS task
aws ecs execute-command \
  --cluster realserv-prod \
  --task task-id \
  --container catalog-service \
  --interactive \
  --command "/bin/bash"

# Inside container
# Check logs
cat /app/logs/catalog-service.log

# Check environment variables
printenv | grep ConnectionStrings

# Test database connection
apt-get update && apt-get install -y postgresql-client
psql $ConnectionStrings__CatalogServiceDb -c "SELECT COUNT(*) FROM materials;"
```

### 4. Health Check Debugging

```bash
# Local
curl -v http://localhost:5000/health

# Production
curl -v https://api.realserv.com/catalog/health

# Expected response
{
  "status": "Healthy",
  "service": "CatalogService",
  "version": "1.0.0",
  "database": "Connected",
  "timestamp": "2026-01-11T12:00:00Z"
}
```

---

## Troubleshooting Common Issues

### Issue: High Memory Usage

```bash
# 1. Check ECS metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ServiceName,Value=catalog-service \
  --start-time 2026-01-11T00:00:00Z \
  --end-time 2026-01-11T23:59:59Z \
  --period 300 \
  --statistics Average

# 2. Check for memory leaks
# Monitor over time - should be stable, not continuously increasing

# 3. Solutions:
# - Increase task memory limit
# - Enable pagination to reduce in-memory data
# - Implement caching with expiration
```

### Issue: Database Connection Pool Exhausted

```bash
# Symptoms: "Timeout expired. The timeout period elapsed prior to obtaining a connection"

# Solution 1: Increase pool size
ConnectionStrings__CatalogServiceDb="...;Maximum Pool Size=200"

# Solution 2: Fix connection leaks
# Ensure DbContext is disposed (use DI with Scoped lifetime)

# Solution 3: Check for long-running queries
SELECT pid, usename, state, query, query_start
FROM pg_stat_activity
WHERE datname = 'catalog_db' AND state = 'active'
ORDER BY query_start;
```

---

## Performance Monitoring

### Response Time Dashboard

```sql
-- CloudWatch Insights
fields @timestamp, @message
| parse @message /HTTP (?<method>\S+) (?<endpoint>\S+) responded (?<status>\d+) in (?<duration>\d+)ms/
| stats avg(duration), p50(duration), p95(duration), p99(duration) by endpoint
| sort p99 desc
```

### Error Rate Dashboard

```sql
fields @timestamp, level, @message
| filter level = "ERROR"
| stats count() as error_count by bin(5m)
```

---

## Monitoring Checklist

### Daily
- ✅ Check CloudWatch alarms (any active?)
- ✅ Review error logs (any new error patterns?)
- ✅ Check ECS task health (all healthy?)
- ✅ Verify API response times (< 200ms average?)

### Weekly
- ✅ Review slow query logs
- ✅ Check database connection pool usage
- ✅ Analyze API usage patterns
- ✅ Review CloudWatch costs

### Monthly
- ✅ Capacity planning (scale up needed?)
- ✅ Performance benchmarking
- ✅ Security audit logs
- ✅ Cost optimization review

---

**Last Updated:** January 11, 2026
