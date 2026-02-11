# RealServ Rate Limiting Implementation Guide

**Date**: January 12, 2026  
**Purpose**: Add rate limiting to all 6 services to prevent abuse and ensure fair usage

---

## 🎯 Overview

Rate limiting protects APIs from abuse by limiting the number of requests a client can make in a given time period. We're using **AspNetCoreRateLimit** for IP-based rate limiting.

---

## 📊 Rate Limit Profiles

We've defined 3 profiles based on service sensitivity:

| Profile | Per Minute | Per Hour | Per Day | Use Case |
|---------|-----------|----------|---------|----------|
| **Strict** | 30 | 300 | 3,000 | Auth, Payments (sensitive operations) |
| **Standard** | 100 | 1,000 | 10,000 | Most CRUD services |
| **Lenient** | 300 | 5,000 | 50,000 | Read-heavy services (Catalog) |

---

## 🚀 Implementation Steps

### Step 1: Install Package (if needed)

Most services should already have this. Check `csproj`:

```bash
dotnet add package AspNetCoreRateLimit
```

### Step 2: Update Program.cs

Add at the beginning (after builder creation):

```csharp
using RealServ.Shared.Observability.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ... other services

// Add rate limiting
builder.Services.AddRealServRateLimiting(builder.Configuration);

var app = builder.Build();

// Add middleware (BEFORE authentication)
app.UseRealServRateLimiting();
app.UseAuthentication();
app.UseAuthorization();
```

### Step 3: Add Configuration to appsettings.json

Choose the appropriate profile for each service:

---

## 📝 Configuration Per Service

### 1. IdentityService (Strict Profile)

**Why Strict**: Authentication is sensitive, prevent brute force attacks

**appsettings.json**:
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 30
      },
      {
        "Endpoint": "*",
        "Period": "1h",
        "Limit": 300
      },
      {
        "Endpoint": "*",
        "Period": "1d",
        "Limit": 3000
      }
    ],
    "QuotaExceededResponse": {
      "Content": "{\"error\": \"Rate limit exceeded\", \"service\": \"IdentityService\", \"retryAfter\": \"{0}\"}",
      "ContentType": "application/json",
      "StatusCode": 429
    }
  },
  "IpRateLimitPolicies": {
    "IpRules": []
  }
}
```

**Special endpoint rules** (optional):
```json
{
  "IpRateLimiting": {
    "EndpointWhitelist": [
      "get:/health",
      "get:/health/ready"
    ],
    "GeneralRules": [
      {
        "Endpoint": "post:/api/v1/auth/login",
        "Period": "1m",
        "Limit": 5
      },
      {
        "Endpoint": "post:/api/v1/auth/register",
        "Period": "1h",
        "Limit": 3
      },
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 30
      }
    ]
  }
}
```

---

### 2. PaymentService (Strict Profile)

**Why Strict**: Financial operations are sensitive

**appsettings.json**:
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "EndpointWhitelist": [
      "get:/health",
      "get:/health/ready",
      "post:/api/v1/webhooks/razorpay"
    ],
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 30
      },
      {
        "Endpoint": "*",
        "Period": "1h",
        "Limit": 300
      },
      {
        "Endpoint": "*",
        "Period": "1d",
        "Limit": 3000
      }
    ],
    "QuotaExceededResponse": {
      "Content": "{\"error\": \"Rate limit exceeded\", \"service\": \"PaymentService\", \"retryAfter\": \"{0}\"}",
      "ContentType": "application/json",
      "StatusCode": 429
    }
  },
  "IpRateLimitPolicies": {
    "IpRules": []
  }
}
```

---

### 3. VendorService (Standard Profile)

**Why Standard**: Mix of read/write operations

**appsettings.json**:
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "EndpointWhitelist": [
      "get:/health",
      "get:/health/ready"
    ],
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 100
      },
      {
        "Endpoint": "*",
        "Period": "1h",
        "Limit": 1000
      },
      {
        "Endpoint": "*",
        "Period": "1d",
        "Limit": 10000
      }
    ],
    "QuotaExceededResponse": {
      "Content": "{\"error\": \"Rate limit exceeded\", \"service\": \"VendorService\", \"retryAfter\": \"{0}\"}",
      "ContentType": "application/json",
      "StatusCode": 429
    }
  },
  "IpRateLimitPolicies": {
    "IpRules": []
  }
}
```

---

### 4. OrderService (Standard Profile)

**Why Standard**: Critical business operations

**appsettings.json**:
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "EndpointWhitelist": [
      "get:/health",
      "get:/health/ready"
    ],
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 100
      },
      {
        "Endpoint": "*",
        "Period": "1h",
        "Limit": 1000
      },
      {
        "Endpoint": "*",
        "Period": "1d",
        "Limit": 10000
      }
    ],
    "QuotaExceededResponse": {
      "Content": "{\"error\": \"Rate limit exceeded\", \"service\": \"OrderService\", \"retryAfter\": \"{0}\"}",
      "ContentType": "application/json",
      "StatusCode": 429
    }
  },
  "IpRateLimitPolicies": {
    "IpRules": []
  }
}
```

---

### 5. NotificationService (Standard Profile)

**Why Standard**: Prevent spam, but allow reasonable usage

**appsettings.json**:
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "EndpointWhitelist": [
      "get:/health",
      "get:/health/ready"
    ],
    "GeneralRules": [
      {
        "Endpoint": "post:/api/v1/notifications/whatsapp",
        "Period": "1m",
        "Limit": 10
      },
      {
        "Endpoint": "post:/api/v1/notifications/whatsapp",
        "Period": "1h",
        "Limit": 50
      },
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 100
      },
      {
        "Endpoint": "*",
        "Period": "1h",
        "Limit": 1000
      }
    ],
    "QuotaExceededResponse": {
      "Content": "{\"error\": \"Rate limit exceeded\", \"service\": \"NotificationService\", \"retryAfter\": \"{0}\"}",
      "ContentType": "application/json",
      "StatusCode": 429
    }
  },
  "IpRateLimitPolicies": {
    "IpRules": []
  }
}
```

---

### 6. CatalogService (Lenient Profile)

**Why Lenient**: Read-heavy, buyers browsing products

**appsettings.json**:
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "EndpointWhitelist": [
      "get:/health",
      "get:/health/ready"
    ],
    "GeneralRules": [
      {
        "Endpoint": "get:*",
        "Period": "1m",
        "Limit": 300
      },
      {
        "Endpoint": "get:*",
        "Period": "1h",
        "Limit": 5000
      },
      {
        "Endpoint": "post:*",
        "Period": "1m",
        "Limit": 50
      },
      {
        "Endpoint": "post:*",
        "Period": "1h",
        "Limit": 500
      },
      {
        "Endpoint": "*",
        "Period": "1d",
        "Limit": 50000
      }
    ],
    "QuotaExceededResponse": {
      "Content": "{\"error\": \"Rate limit exceeded\", \"service\": \"CatalogService\", \"retryAfter\": \"{0}\"}",
      "ContentType": "application/json",
      "StatusCode": 429
    }
  },
  "IpRateLimitPolicies": {
    "IpRules": []
  }
}
```

---

## 🔧 Advanced Configuration

### Whitelist Internal Services

For service-to-service calls, whitelist internal IPs:

```json
{
  "IpRateLimitPolicies": {
    "IpRules": [
      {
        "Ip": "10.0.0.0/8",
        "Rules": [
          {
            "Endpoint": "*",
            "Period": "1s",
            "Limit": 1000
          }
        ]
      },
      {
        "Ip": "172.16.0.0/12",
        "Rules": [
          {
            "Endpoint": "*",
            "Period": "1s",
            "Limit": 1000
          }
        ]
      }
    ]
  }
}
```

### Whitelist Health Check Endpoints

Always whitelist health checks:

```json
{
  "IpRateLimiting": {
    "EndpointWhitelist": [
      "get:/health",
      "get:/health/ready",
      "get:/metrics"
    ]
  }
}
```

### Custom Rules for Specific Endpoints

```json
{
  "IpRateLimiting": {
    "GeneralRules": [
      {
        "Endpoint": "post:/api/v1/auth/login",
        "Period": "1m",
        "Limit": 5
      },
      {
        "Endpoint": "post:/api/v1/orders",
        "Period": "1m",
        "Limit": 10
      },
      {
        "Endpoint": "get:/api/v1/catalog/materials",
        "Period": "1m",
        "Limit": 200
      }
    ]
  }
}
```

---

## 🧪 Testing Rate Limiting

### Test Script (bash)

```bash
#!/bin/bash
# Test rate limiting for a service

SERVICE_URL="http://localhost:5001"
ENDPOINT="/api/v1/auth/login"

echo "Testing rate limiting on $SERVICE_URL$ENDPOINT"
echo "Sending 40 requests (limit is 30/min)..."

for i in {1..40}; do
  response=$(curl -s -w "\n%{http_code}" -X POST "$SERVICE_URL$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "test123"}')
  
  status_code=$(echo "$response" | tail -n1)
  
  if [ "$status_code" -eq 429 ]; then
    echo "Request $i: Rate limited (429) ✓"
    break
  else
    echo "Request $i: $status_code"
  fi
  
  sleep 0.1
done
```

### Expected Response (429 Too Many Requests)

```json
{
  "error": "Rate limit exceeded",
  "service": "IdentityService",
  "retryAfter": "30s"
}
```

### Response Headers

```
HTTP/1.1 429 Too Many Requests
X-Rate-Limit-Limit: 30
X-Rate-Limit-Remaining: 0
X-Rate-Limit-Reset: 2026-01-12T11:31:00Z
Retry-After: 30
Content-Type: application/json
```

---

## 📊 Monitoring Rate Limits

### CloudWatch Metrics

Create custom metrics for rate limit hits:

```csharp
// In middleware or filter
if (response.StatusCode == 429)
{
    _logger.LogWarning(
        "Rate limit exceeded for IP {IpAddress} on endpoint {Endpoint}",
        ipAddress,
        endpoint
    );
    
    // Send to CloudWatch
    await _cloudWatch.PutMetricDataAsync(new PutMetricDataRequest
    {
        Namespace = "RealServ/RateLimiting",
        MetricData = new List<MetricDatum>
        {
            new MetricDatum
            {
                MetricName = "RateLimitExceeded",
                Value = 1,
                Unit = StandardUnit.Count,
                Timestamp = DateTime.UtcNow,
                Dimensions = new List<Dimension>
                {
                    new Dimension { Name = "Service", Value = "IdentityService" },
                    new Dimension { Name = "Endpoint", Value = endpoint }
                }
            }
        }
    });
}
```

### Dashboard Queries

```sql
-- Count of rate limit hits by service
SELECT service, COUNT(*) as hits
FROM rate_limit_logs
WHERE timestamp > NOW() - INTERVAL 1 HOUR
GROUP BY service
ORDER BY hits DESC;

-- Top IPs hitting rate limits
SELECT ip_address, COUNT(*) as hits
FROM rate_limit_logs
WHERE timestamp > NOW() - INTERVAL 1 DAY
GROUP BY ip_address
ORDER BY hits DESC
LIMIT 10;
```

---

## 🚨 Troubleshooting

### Issue: Rate limit too strict

**Symptom**: Legitimate users getting 429 errors

**Solution**: Increase limits in appsettings.json
```json
{
  "IpRateLimiting": {
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 200  // Increased from 100
      }
    ]
  }
}
```

### Issue: Internal services hitting rate limits

**Symptom**: Service-to-service calls failing with 429

**Solution**: Whitelist internal IP ranges
```json
{
  "IpRateLimitPolicies": {
    "IpRules": [
      {
        "Ip": "10.0.0.0/8",
        "Rules": [{ "Endpoint": "*", "Period": "1s", "Limit": 10000 }]
      }
    ]
  }
}
```

### Issue: Rate limiting not working

**Symptom**: No 429 errors even with many requests

**Checklist**:
1. ✅ Package installed: `AspNetCoreRateLimit`
2. ✅ Service registered: `AddRealServRateLimiting()`
3. ✅ Middleware added: `UseRealServRateLimiting()` (before authentication)
4. ✅ Configuration present in appsettings.json
5. ✅ MemoryCache registered

---

## 📁 Checklist

### IdentityService
- [ ] Update Program.cs (add service + middleware)
- [ ] Add configuration to appsettings.json (Strict profile)
- [ ] Test with 40 requests
- [ ] Verify 429 response

### PaymentService
- [ ] Update Program.cs
- [ ] Add configuration (Strict profile)
- [ ] Whitelist Razorpay webhooks
- [ ] Test

### VendorService
- [ ] Update Program.cs
- [ ] Add configuration (Standard profile)
- [ ] Test

### OrderService
- [ ] Update Program.cs
- [ ] Add configuration (Standard profile)
- [ ] Test

### NotificationService
- [ ] Update Program.cs
- [ ] Add configuration (Standard profile)
- [ ] Custom rules for WhatsApp endpoint
- [ ] Test

### CatalogService
- [ ] Update Program.cs
- [ ] Add configuration (Lenient profile)
- [ ] Different limits for GET vs POST
- [ ] Test

---

## 🎯 Summary

| Service | Profile | Per Min | Per Hour | Special Rules |
|---------|---------|---------|----------|---------------|
| **IdentityService** | Strict | 30 | 300 | Login: 5/min, Register: 3/hour |
| **PaymentService** | Strict | 30 | 300 | Whitelist webhooks |
| **VendorService** | Standard | 100 | 1,000 | - |
| **OrderService** | Standard | 100 | 1,000 | - |
| **NotificationService** | Standard | 100 | 1,000 | WhatsApp: 10/min |
| **CatalogService** | Lenient | 300 | 5,000 | GET: 300/min, POST: 50/min |

---

**Created**: January 12, 2026  
**Next**: Apply to all 6 services
