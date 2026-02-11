# CloudWatch Setup Guide

Complete guide for setting up AWS CloudWatch for RealServ microservices.

## Prerequisites

- AWS Account with admin access
- AWS CLI v2 installed and configured
- RealServ backend services deployed to ECS
- IAM permissions for CloudWatch Logs and Metrics

---

## Step 1: Create Log Groups

Create CloudWatch Log Groups for each service:

```bash
#!/bin/bash
# create-log-groups.sh

REGION="ap-south-1"
SERVICES=(
  "identity-service"
  "catalog-service"
  "order-service"
  "payment-service"
  "vendor-management-service"
  "notification-service"
  "integration-service"
  "analytics-service"
)

for SERVICE in "${SERVICES[@]}"; do
  echo "Creating log group for $SERVICE..."
  aws logs create-log-group \
    --log-group-name "/realserv/$SERVICE" \
    --region $REGION
  
  # Set retention to 30 days (production: 90 days)
  aws logs put-retention-policy \
    --log-group-name "/realserv/$SERVICE" \
    --retention-in-days 30 \
    --region $REGION
  
  echo "✓ Log group /realserv/$SERVICE created"
done
```

**Run**:
```bash
chmod +x create-log-groups.sh
./create-log-groups.sh
```

---

## Step 2: Configure IAM Roles

### ECS Task Execution Role

Create IAM policy for CloudWatch access:

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
      "Resource": [
        "arn:aws:logs:ap-south-1:*:log-group:/realserv/*",
        "arn:aws:logs:ap-south-1:*:log-group:/realserv/*:log-stream:*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "cloudwatch:GetMetricData",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "cloudwatch:namespace": [
            "RealServ/IdentityService",
            "RealServ/OrderService",
            "RealServ/PaymentService",
            "RealServ/CatalogService",
            "RealServ/VendorManagementService",
            "RealServ/NotificationService",
            "RealServ/IntegrationService",
            "RealServ/AnalyticsService"
          ]
        }
      }
    }
  ]
}
```

**Create Policy**:
```bash
aws iam create-policy \
  --policy-name RealServCloudWatchPolicy \
  --policy-document file://cloudwatch-policy.json \
  --region ap-south-1
```

**Attach to ECS Task Role**:
```bash
aws iam attach-role-policy \
  --role-name RealServECSTaskRole \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/RealServCloudWatchPolicy
```

---

## Step 3: Update ECS Task Definitions

Add CloudWatch logging configuration to each service:

```json
{
  "family": "realserv-identity-service",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/RealServECSTaskRole",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/RealServECSTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "identity-service",
      "image": "ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/realserv-identity-service:latest",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/realserv/identity-service",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        },
        {
          "name": "AWS_REGION",
          "value": "ap-south-1"
        }
      ]
    }
  ]
}
```

---

## Step 4: Configure Service appsettings.json

### Production Configuration

Create `appsettings.Production.json` for each service:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
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
  },
  "AllowedHosts": "*"
}
```

### Development Configuration

`appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Information"
    }
  },
  "CloudWatch": {
    "EnableCloudWatch": false,
    "EnableMetrics": false
  }
}
```

---

## Step 5: Create SNS Topics for Alerts

```bash
#!/bin/bash
# create-sns-topics.sh

REGION="ap-south-1"
EMAIL="alerts@realserv.com"

# Create SNS topics
aws sns create-topic --name realserv-alerts-critical --region $REGION
aws sns create-topic --name realserv-alerts-high --region $REGION
aws sns create-topic --name realserv-alerts-medium --region $REGION
aws sns create-topic --name realserv-alerts-low --region $REGION

# Subscribe email to critical alerts
CRITICAL_ARN=$(aws sns list-topics --region $REGION --query "Topics[?ends_with(TopicArn, 'realserv-alerts-critical')].TopicArn" --output text)

aws sns subscribe \
  --topic-arn $CRITICAL_ARN \
  --protocol email \
  --notification-endpoint $EMAIL \
  --region $REGION

echo "✓ SNS topics created"
echo "✓ Check your email to confirm subscription"
```

---

## Step 6: Deploy CloudWatch Alarms

Use the alarm configurations from `alarms.md`:

```bash
#!/bin/bash
# deploy-alarms.sh

REGION="ap-south-1"
ACCOUNT_ID="123456789012"  # Replace with your AWS account ID

# Deploy Identity Service alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-IdentityService-HighErrorRate" \
  --alarm-description "API error rate exceeds 10%" \
  --metric-name ApiErrorCount \
  --namespace RealServ/IdentityService \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions "arn:aws:sns:$REGION:$ACCOUNT_ID:realserv-alerts-critical" \
  --region $REGION

# Add more alarms...
# (See alarms.md for complete list)

echo "✓ CloudWatch alarms deployed"
```

---

## Step 7: Create CloudWatch Dashboards

### Service Health Dashboard

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["RealServ/IdentityService", "ApiRequestCount"],
          [".", "ApiErrorCount"],
          [".", "ApiExceptionCount"]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "ap-south-1",
        "title": "Identity Service - Request Metrics"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["RealServ/IdentityService", "ApiRequestDuration", { "stat": "Average" }],
          ["...", { "stat": "p95" }],
          ["...", { "stat": "p99" }]
        ],
        "period": 300,
        "region": "ap-south-1",
        "title": "Identity Service - Response Times"
      }
    }
  ]
}
```

**Create Dashboard**:
```bash
aws cloudwatch put-dashboard \
  --dashboard-name RealServ-ServiceHealth \
  --dashboard-body file://dashboard-service-health.json \
  --region ap-south-1
```

---

## Step 8: Test CloudWatch Integration

### 1. Deploy Service with CloudWatch Enabled

```bash
# Build and push Docker image
docker build -t realserv-identity-service .
docker tag realserv-identity-service:latest ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/realserv-identity-service:latest
docker push ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/realserv-identity-service:latest

# Update ECS service
aws ecs update-service \
  --cluster realserv-cluster \
  --service identity-service \
  --force-new-deployment \
  --region ap-south-1
```

### 2. Verify Logs Appear

```bash
# Check latest log events
aws logs tail /realserv/identity-service --follow --region ap-south-1
```

### 3. Verify Metrics Appear

```bash
# List metrics
aws cloudwatch list-metrics \
  --namespace RealServ/IdentityService \
  --region ap-south-1

# Get metric data
aws cloudwatch get-metric-statistics \
  --namespace RealServ/IdentityService \
  --metric-name ApiRequestCount \
  --start-time 2026-01-11T00:00:00Z \
  --end-time 2026-01-11T23:59:59Z \
  --period 3600 \
  --statistics Sum \
  --region ap-south-1
```

### 4. Test API and Check Logs

```bash
# Make API call
curl -X POST https://api.realserv.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210", "userType": "Buyer"}'

# Check CloudWatch Logs Insights
```

Query in Logs Insights:
```
fields @timestamp, @message, RequestPath, Duration, StatusCode
| filter RequestPath like /api/v1/auth/register/
| sort @timestamp desc
| limit 20
```

---

## Step 9: Set Up CloudWatch Insights Queries

### Saved Queries

Create saved queries for common investigations:

**1. Find All Errors (Last Hour)**
```
fields @timestamp, @message, @logStream
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100
```

**2. Slow API Requests**
```
fields @timestamp, RequestPath, Duration
| filter Duration > 1000
| sort Duration desc
| limit 50
```

**3. User Registration Trends**
```
fields @timestamp, UserType
| filter @message like /UserRegistration/
| stats count() by UserType
```

**4. Payment Failures**
```
fields @timestamp, PaymentMethod, Reason
| filter @message like /PaymentFailure/
| stats count() by PaymentMethod, Reason
```

---

## Step 10: Monitor Costs

### CloudWatch Pricing (ap-south-1)

- **Logs Ingestion**: $0.67/GB
- **Logs Storage**: $0.03/GB/month
- **Metrics**: First 10 custom metrics free, then $0.30/metric/month
- **Alarms**: $0.10/alarm/month
- **Dashboards**: $3/dashboard/month

### Estimated Monthly Costs (8 Services)

| Item | Quantity | Unit Cost | Total |
|------|----------|-----------|-------|
| Log Ingestion | 50 GB | $0.67/GB | $33.50 |
| Log Storage (30 days) | 50 GB | $0.03/GB | $1.50 |
| Custom Metrics | 80 metrics | $0.30/metric | $24.00 |
| Alarms | 40 alarms | $0.10/alarm | $4.00 |
| Dashboards | 3 dashboards | $3/dashboard | $9.00 |
| **Total** | | | **$72/month** |

### Cost Optimization Tips

1. **Reduce log retention**: 7 days for dev, 30 days for prod
2. **Filter noisy logs**: Don't log every health check
3. **Use metric filters**: Create metrics from logs instead of publishing separately
4. **Batch metric publishing**: Use `PublishBatchAsync` for multiple metrics
5. **Sample high-volume events**: Log 10% of successful requests, 100% of errors

---

## Troubleshooting

### Logs Not Appearing

**Check 1**: Verify IAM permissions
```bash
aws iam get-role-policy \
  --role-name RealServECSTaskRole \
  --policy-name CloudWatchPolicy \
  --region ap-south-1
```

**Check 2**: Verify ECS task logs
```bash
aws ecs describe-tasks \
  --cluster realserv-cluster \
  --tasks TASK_ARN \
  --region ap-south-1
```

**Check 3**: Check application logs for errors
```bash
docker logs CONTAINER_ID
```

### Metrics Not Publishing

**Check 1**: Verify metrics namespace
```bash
aws cloudwatch list-metrics \
  --namespace RealServ/IdentityService \
  --region ap-south-1
```

**Check 2**: Check application logs for AWS SDK errors
```
fields @timestamp, @message
| filter @message like /CloudWatch/ or @message like /AWS/
```

**Check 3**: Verify `EnableMetrics: true` in config

### Alarms Not Triggering

**Check 1**: Verify alarm state
```bash
aws cloudwatch describe-alarms \
  --alarm-names "RealServ-IdentityService-HighErrorRate" \
  --region ap-south-1
```

**Check 2**: Verify SNS subscription confirmed
```bash
aws sns list-subscriptions-by-topic \
  --topic-arn "arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical" \
  --region ap-south-1
```

**Check 3**: Manually publish test metric
```bash
aws cloudwatch put-metric-data \
  --namespace RealServ/IdentityService \
  --metric-name ApiErrorCount \
  --value 100 \
  --region ap-south-1
```

---

## Next Steps

1. ✅ Set up log groups
2. ✅ Configure IAM roles
3. ✅ Update ECS task definitions
4. ✅ Configure service appsettings
5. ✅ Create SNS topics
6. ✅ Deploy alarms
7. ✅ Create dashboards
8. ✅ Test integration
9. ✅ Set up saved queries
10. ✅ Monitor costs

**Production Readiness Checklist**:
- [ ] All services logging to CloudWatch
- [ ] All critical alarms configured
- [ ] SNS subscriptions confirmed
- [ ] Dashboards created
- [ ] Runbooks documented
- [ ] Team trained on CloudWatch Insights
- [ ] Cost monitoring in place

---

## References

- [AWS CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)
- [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)
- [Serilog AWS Sink](https://github.com/aws/aws-logging-dotnet)
