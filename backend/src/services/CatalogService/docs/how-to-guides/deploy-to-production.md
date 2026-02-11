---
title: Deploy to Production
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: devops
---

# Deploy Catalog Service to Production

**Service:** Catalog Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Step-by-step guide to deploy Catalog Service to AWS ECS (Elastic Container Service) with zero downtime.

---

## Prerequisites

- ✅ AWS account with ECS, RDS, ECR access
- ✅ AWS CLI configured
- ✅ Docker installed
- ✅ RDS PostgreSQL 16 instance created
- ✅ ECR repository created: `realserv/catalog-service`

---

## Step 1: Build Docker Image

```bash
# Navigate to service directory
cd backend/src/services/CatalogService

# Build image
docker build -t realserv-catalog-service:1.0.0 -f Dockerfile ../../../

# Tag for ECR
docker tag realserv-catalog-service:1.0.0 \
  123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/catalog-service:1.0.0

docker tag realserv-catalog-service:1.0.0 \
  123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/catalog-service:latest
```

---

## Step 2: Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.ap-south-1.amazonaws.com

# Push images
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/catalog-service:1.0.0
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/catalog-service:latest
```

---

## Step 3: Run Database Migrations

**Important:** Run migrations BEFORE deploying new code.

```bash
# Option 1: Run from local machine (if RDS is publicly accessible)
dotnet ef database update \
  --connection "Host=prod-rds.amazonaws.com;Database=catalog_db;Username=admin;Password=<secret>;SSL Mode=Require"

# Option 2: Run from bastion host
ssh bastion-host
dotnet ef database update --connection "..."

# Option 3: Run as ECS task (recommended for production)
aws ecs run-task \
  --cluster realserv-prod \
  --task-definition catalog-migration-task \
  --launch-type FARGATE
```

---

## Step 4: Create ECS Task Definition

`task-definition.json`:
```json
{
  "family": "realserv-catalog-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "catalog-service",
      "image": "123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/catalog-service:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        },
        {
          "name": "AWS__Region",
          "value": "ap-south-1"
        },
        {
          "name": "AWS__CloudWatch__LogGroup",
          "value": "/realserv/catalog-service"
        }
      ],
      "secrets": [
        {
          "name": "ConnectionStrings__CatalogServiceDb",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:catalog-db-connection"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/realserv/catalog-service",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "catalog"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/catalogServiceTaskRole"
}
```

Register task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

---

## Step 5: Create ECS Service

```bash
aws ecs create-service \
  --cluster realserv-prod \
  --service-name catalog-service \
  --task-definition realserv-catalog-service:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-abc123,subnet-def456],securityGroups=[sg-catalog],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/catalog-tg,containerName=catalog-service,containerPort=80" \
  --health-check-grace-period-seconds 60
```

---

## Step 6: Configure Application Load Balancer

### Target Group
```bash
aws elbv2 create-target-group \
  --name catalog-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-12345 \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3
```

### Listener Rule
```bash
aws elbv2 create-rule \
  --listener-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:listener/app/realserv-alb/xyz/abc123 \
  --priority 10 \
  --conditions Field=path-pattern,Values=/catalog/* \
  --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/catalog-tg
```

---

## Step 7: Configure Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/realserv-prod/catalog-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy (CPU-based)
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/realserv-prod/catalog-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name catalog-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
```

---

## Step 8: Verify Deployment

### Check Service Status
```bash
aws ecs describe-services \
  --cluster realserv-prod \
  --services catalog-service
```

### Check Task Health
```bash
aws ecs list-tasks --cluster realserv-prod --service-name catalog-service

aws ecs describe-tasks \
  --cluster realserv-prod \
  --tasks task-id
```

### Test Health Endpoint
```bash
curl https://api.realserv.com/catalog/health
```

**Expected Response:**
```json
{
  "status": "Healthy",
  "service": "CatalogService",
  "database": "Connected",
  "version": "1.0.0"
}
```

### Test API
```bash
curl https://api.realserv.com/catalog/api/v1/materials | jq '.success'
# Should return: true
```

---

## Step 9: Monitor Deployment

### CloudWatch Logs
```bash
aws logs tail /realserv/catalog-service --follow
```

### CloudWatch Metrics
- **CPUUtilization**: < 70%
- **MemoryUtilization**: < 80%
- **TargetResponseTime**: < 200ms
- **HealthyHostCount**: >= 2

### Alarms
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name catalog-service-high-error-rate \
  --metric-name 5XXError \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 60 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:realserv-alerts
```

---

## Zero-Downtime Deployment (Blue-Green)

### Option 1: ECS Service Update

```bash
# Deploy new version
aws ecs update-service \
  --cluster realserv-prod \
  --service catalog-service \
  --task-definition realserv-catalog-service:2 \
  --force-new-deployment

# ECS will:
# 1. Start new tasks (green)
# 2. Wait for health checks to pass
# 3. Drain old tasks (blue)
# 4. Stop old tasks
```

### Option 2: Manual Blue-Green

```bash
# 1. Create new service (green)
aws ecs create-service \
  --cluster realserv-prod \
  --service-name catalog-service-green \
  --task-definition realserv-catalog-service:2 \
  --desired-count 2

# 2. Wait for green service to be healthy
aws ecs wait services-stable \
  --cluster realserv-prod \
  --services catalog-service-green

# 3. Update ALB target group to green service
aws elbv2 modify-listener \
  --listener-arn ... \
  --default-actions Type=forward,TargetGroupArn=green-tg-arn

# 4. Monitor for issues

# 5. If successful, delete blue service
aws ecs delete-service \
  --cluster realserv-prod \
  --service catalog-service \
  --force

# 6. Rename green to primary
aws ecs update-service \
  --cluster realserv-prod \
  --service catalog-service-green \
  --service-name catalog-service
```

---

## Rollback Procedure

### Quick Rollback (< 5 minutes)

```bash
# 1. Get previous task definition
aws ecs describe-task-definition \
  --task-definition realserv-catalog-service:1

# 2. Update service to previous version
aws ecs update-service \
  --cluster realserv-prod \
  --service catalog-service \
  --task-definition realserv-catalog-service:1 \
  --force-new-deployment

# 3. Monitor rollback
aws ecs describe-services \
  --cluster realserv-prod \
  --services catalog-service

# 4. Verify health
curl https://api.realserv.com/catalog/health
```

---

## Production Checklist

### Pre-Deployment
- ✅ Database migrations tested in staging
- ✅ Load testing completed
- ✅ Security scan passed
- ✅ Secrets stored in AWS Secrets Manager
- ✅ CloudWatch alarms configured
- ✅ Rollback plan documented

### Post-Deployment
- ✅ Health check passing
- ✅ API endpoints responding
- ✅ CloudWatch logs flowing
- ✅ Metrics within normal range
- ✅ No error spikes
- ✅ Database connections stable

---

## Environment-Specific Configuration

### Staging
- **CPU**: 256
- **Memory**: 512 MB
- **Desired Count**: 1
- **Auto Scaling**: Disabled

### Production
- **CPU**: 512
- **Memory**: 1024 MB
- **Desired Count**: 2 (minimum)
- **Auto Scaling**: 2-10 tasks

---

## Cost Optimization

1. **Use Fargate Spot**: 70% cost savings for non-critical environments
2. **Right-size tasks**: Monitor CPU/memory usage
3. **Auto-scaling**: Scale down during off-peak hours
4. **Reserved capacity**: Purchase for production

---

**Deployment Time:** 15-20 minutes  
**Rollback Time:** < 5 minutes  
**Last Updated:** January 11, 2026
