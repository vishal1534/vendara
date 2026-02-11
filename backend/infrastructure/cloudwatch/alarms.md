# CloudWatch Alarms Configuration

AWS CloudWatch alarms for monitoring RealServ microservices health and performance.

## Alarm Philosophy

- **P1 (Critical)**: Immediate action required - impacts core functionality
- **P2 (High)**: Requires attention within 1 hour - degraded performance
- **P3 (Medium)**: Requires attention within 4 hours - minor issues
- **P4 (Low)**: Informational - track trends

## Alarm Notification Channels

### SNS Topics

```bash
# Create SNS topics for alerts
aws sns create-topic --name realserv-alerts-critical --region ap-south-1
aws sns create-topic --name realserv-alerts-high --region ap-south-1
aws sns create-topic --name realserv-alerts-medium --region ap-south-1

# Subscribe email to topics
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --protocol email \
  --notification-endpoint alerts@realserv.com

# Subscribe Slack webhook (if configured)
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --protocol https \
  --notification-endpoint https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

## 1. API Performance Alarms

### High API Error Rate (P1 - Critical)

**Metric**: `ApiErrorCount` (4xx + 5xx responses)  
**Threshold**: > 10% error rate over 5 minutes  
**Action**: Immediate investigation

```bash
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
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --region ap-south-1
```

### Slow API Response Time (P2 - High)

**Metric**: `ApiRequestDuration`  
**Threshold**: P95 > 1000ms (1 second)  
**Action**: Performance investigation

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-IdentityService-SlowResponse" \
  --alarm-description "API P95 response time > 1s" \
  --metric-name ApiRequestDuration \
  --namespace RealServ/IdentityService \
  --statistic Average \
  --period 300 \
  --evaluation-periods 3 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

### High Exception Count (P1 - Critical)

**Metric**: `ApiExceptionCount`  
**Threshold**: > 20 exceptions in 5 minutes  
**Action**: Immediate investigation

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-IdentityService-HighExceptions" \
  --alarm-description "Unhandled exceptions detected" \
  --metric-name ApiExceptionCount \
  --namespace RealServ/IdentityService \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 20 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --region ap-south-1
```

---

## 2. Business Metrics Alarms

### No User Registrations (P3 - Medium)

**Metric**: `UserRegistration`  
**Threshold**: 0 registrations for 30 minutes  
**Action**: Check marketing campaigns, service health

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-IdentityService-NoRegistrations" \
  --alarm-description "No user registrations in 30 minutes" \
  --metric-name UserRegistration \
  --namespace RealServ/IdentityService \
  --statistic Sum \
  --period 1800 \
  --evaluation-periods 1 \
  --threshold 1 \
  --comparison-operator LessThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-medium \
  --region ap-south-1
```

### High Login Failure Rate (P2 - High)

**Metric**: `UserLoginFailure`  
**Threshold**: > 50 failures in 5 minutes  
**Action**: Potential attack or system issue

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-IdentityService-HighLoginFailures" \
  --alarm-description "High login failure rate detected" \
  --metric-name UserLoginFailure \
  --namespace RealServ/IdentityService \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

### Payment Failure Rate (P1 - Critical)

**Metric**: `PaymentFailure`  
**Threshold**: > 20% failure rate  
**Action**: Immediate investigation - revenue impact

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-PaymentService-HighFailureRate" \
  --alarm-description "Payment failure rate > 20%" \
  --metric-name PaymentFailure \
  --namespace RealServ/PaymentService \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --region ap-south-1
```

### Order Cancellation Spike (P2 - High)

**Metric**: `OrderCancelled`  
**Threshold**: > 30 cancellations in 15 minutes  
**Action**: Investigate vendor or buyer issues

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-OrderService-HighCancellations" \
  --alarm-description "Order cancellation spike detected" \
  --metric-name OrderCancelled \
  --namespace RealServ/OrderService \
  --statistic Sum \
  --period 900 \
  --evaluation-periods 1 \
  --threshold 30 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

---

## 3. Infrastructure Alarms

### ECS CPU Utilization (P2 - High)

**Metric**: `CPUUtilization`  
**Threshold**: > 80% for 10 minutes  
**Action**: Scale up or optimize code

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-IdentityService-HighCPU" \
  --alarm-description "ECS CPU utilization > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --dimensions Name=ServiceName,Value=identity-service Name=ClusterName,Value=realserv-cluster \
  --statistic Average \
  --period 600 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

### ECS Memory Utilization (P2 - High)

**Metric**: `MemoryUtilization`  
**Threshold**: > 85% for 10 minutes  
**Action**: Scale up or investigate memory leaks

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-IdentityService-HighMemory" \
  --alarm-description "ECS memory utilization > 85%" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --dimensions Name=ServiceName,Value=identity-service Name=ClusterName,Value=realserv-cluster \
  --statistic Average \
  --period 600 \
  --evaluation-periods 2 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

### RDS CPU Utilization (P1 - Critical)

**Metric**: `CPUUtilization`  
**Threshold**: > 90% for 5 minutes  
**Action**: Immediate database optimization or scaling

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-Database-HighCPU" \
  --alarm-description "RDS CPU > 90%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --dimensions Name=DBInstanceIdentifier,Value=realserv-users-db \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 90 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --region ap-south-1
```

### RDS Storage Space (P2 - High)

**Metric**: `FreeStorageSpace`  
**Threshold**: < 2 GB free space  
**Action**: Increase storage or archive old data

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-Database-LowStorage" \
  --alarm-description "RDS free storage < 2 GB" \
  --metric-name FreeStorageSpace \
  --namespace AWS/RDS \
  --dimensions Name=DBInstanceIdentifier,Value=realserv-users-db \
  --statistic Average \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 2147483648 \
  --comparison-operator LessThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

### RDS Database Connections (P2 - High)

**Metric**: `DatabaseConnections`  
**Threshold**: > 80% of max connections  
**Action**: Investigate connection leaks

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-Database-HighConnections" \
  --alarm-description "Database connections > 80 (80% of max 100)" \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --dimensions Name=DBInstanceIdentifier,Value=realserv-users-db \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

---

## 4. External API Alarms

### Razorpay API Failures (P1 - Critical)

**Metric**: `ExternalApiCall` with dimension `ApiName=Razorpay` and `Success=false`  
**Threshold**: > 10 failures in 5 minutes  
**Action**: Check Razorpay status, fallback to COD

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-PaymentService-RazorpayFailures" \
  --alarm-description "High Razorpay API failure rate" \
  --metric-name ExternalApiCall \
  --namespace RealServ/PaymentService \
  --dimensions Name=ApiName,Value=Razorpay Name=Success,Value=false \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --region ap-south-1
```

### WhatsApp API Failures (P2 - High)

**Metric**: `ExternalApiCall` with dimension `ApiName=WhatsApp` and `Success=false`  
**Threshold**: > 20 failures in 10 minutes

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "RealServ-NotificationService-WhatsAppFailures" \
  --alarm-description "WhatsApp API failure spike" \
  --metric-name ExternalApiCall \
  --namespace RealServ/NotificationService \
  --dimensions Name=ApiName,Value=WhatsApp Name=Success,Value=false \
  --statistic Sum \
  --period 600 \
  --evaluation-periods 1 \
  --threshold 20 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-high \
  --region ap-south-1
```

---

## 5. Composite Alarms

### Service Health Composite (P1 - Critical)

Triggers if ANY of these conditions are met:
- High error rate
- High exceptions
- High CPU + High Memory

```bash
aws cloudwatch put-composite-alarm \
  --alarm-name "RealServ-IdentityService-Unhealthy" \
  --alarm-description "Identity Service is unhealthy" \
  --actions-enabled \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:realserv-alerts-critical \
  --alarm-rule "ALARM(RealServ-IdentityService-HighErrorRate) OR ALARM(RealServ-IdentityService-HighExceptions) OR (ALARM(RealServ-IdentityService-HighCPU) AND ALARM(RealServ-IdentityService-HighMemory))" \
  --region ap-south-1
```

---

## Terraform Configuration

For production, use Terraform to manage alarms:

```hcl
# /infrastructure/terraform/modules/cloudwatch/alarms.tf

resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "RealServ-${var.service_name}-HighErrorRate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ApiErrorCount"
  namespace           = "RealServ/${var.service_name}"
  period              = "300"
  statistic           = "Sum"
  threshold           = "50"
  alarm_description   = "API error rate exceeds threshold"
  alarm_actions       = [aws_sns_topic.critical_alerts.arn]

  dimensions = {
    ServiceName = var.service_name
  }
}

resource "aws_sns_topic" "critical_alerts" {
  name = "realserv-alerts-critical"
}

resource "aws_sns_topic_subscription" "critical_email" {
  topic_arn = aws_sns_topic.critical_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}
```

---

## Alarm Response Playbooks

### High Error Rate Playbook

1. Check CloudWatch Logs Insights for error details
2. Verify external dependencies (DB, Redis, APIs)
3. Check recent deployments
4. Review application logs
5. If needed, rollback to previous version

### High CPU/Memory Playbook

1. Check for traffic spike in ALB metrics
2. Review slow database queries
3. Check for memory leaks in recent code changes
4. Scale ECS service if needed
5. Optimize hot paths if recurring

### Payment Failure Playbook

1. Check Razorpay status page
2. Verify webhook delivery
3. Check database for pending payments
4. Notify customers if widespread issue
5. Enable COD as fallback

---

## Dashboard Links

After creating alarms, create CloudWatch dashboards:

- **Service Health**: `/infrastructure/cloudwatch/dashboards/service-health.json`
- **Business Metrics**: `/infrastructure/cloudwatch/dashboards/business-metrics.json`
- **Infrastructure**: `/infrastructure/cloudwatch/dashboards/infrastructure.json`

---

## Testing Alarms

```bash
# Test alarm by publishing test metric
aws cloudwatch put-metric-data \
  --namespace RealServ/IdentityService \
  --metric-name ApiErrorCount \
  --value 100 \
  --region ap-south-1

# Check alarm state
aws cloudwatch describe-alarms \
  --alarm-names "RealServ-IdentityService-HighErrorRate" \
  --region ap-south-1
```

---

## Cost Optimization

- Standard alarms: $0.10/alarm/month
- Composite alarms: $0.50/alarm/month
- **Estimated cost**: ~15 alarms × $0.10 = **$1.50/month per service**
- **Total (8 services)**: ~$12/month

Keep alarms lean and focused on actionable metrics.
