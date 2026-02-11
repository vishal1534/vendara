---
title: Deploy to Production
service: Identity Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: devops
---

# How to Deploy Identity Service to Production

**Service:** Identity Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Step-by-step guide to deploy Identity Service to AWS ECS with zero downtime.

---

## Prerequisites

- AWS account with appropriate permissions
- Docker installed locally
- AWS CLI configured
- PostgreSQL database provisioned (RDS)
- Firebase production project configured
- 30-45 minutes

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Route 53  │────>│ Application  │────>│   ECS Fargate   │
│     DNS     │     │ Load Balancer│     │ Identity Service│
└─────────────┘     └──────────────┘     └─────────────────┘
                            │                      │
                            │                      │
                    ┌───────┴──────┐      ┌────────┴────────┐
                    │              │      │                 │
                ┌───▼────┐    ┌───▼────┐ │  ┌──────────┐  │
                │ Target │    │ Target │ │  │PostgreSQL│  │
                │ Group  │    │ Group  │ │  │   RDS    │  │
                │ (AZ-1) │    │ (AZ-2) │ │  └──────────┘  │
                └────────┘    └────────┘ │                 │
                                         │  ┌──────────┐  │
                                         │  │   Redis  │  │
                                         │  │ElastiCache│ │
                                         └──┴──────────┴──┘
```

---

## Step 1: Prepare Production Configuration

### 1.1 Create Production appsettings.json

Create `appsettings.Production.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error",
      "Microsoft.EntityFrameworkCore": "Error"
    }
  },
  "AllowedHosts": "api.realserv.com",
  "Urls": "http://0.0.0.0:8080",
  
  "ConnectionStrings": {
    "IdentityServiceDb": "${IDENTITY_DB_CONNECTION_STRING}"
  },
  
  "Firebase": {
    "ProjectId": "${FIREBASE_PROJECT_ID}",
    "CredentialsPath": "/app/secrets/firebase-admin-sdk.json",
    "ApiKey": "${FIREBASE_API_KEY}"
  },
  
  "Cors": {
    "AllowedOrigins": [
      "https://app.realserv.com",
      "https://admin.realserv.com"
    ]
  },
  
  "RateLimit": {
    "AuthEndpoints": 10,
    "ReadEndpoints": 100,
    "WriteEndpoints": 50
  }
}
```

### 1.2 Update Dockerfile for Production

Verify `Dockerfile`:

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["IdentityService.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .

# Create directory for secrets
RUN mkdir -p /app/secrets

# Set environment
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "IdentityService.dll"]
```

---

## Step 2: Build and Push Docker Image

### 2.1 Build Docker Image

```bash
# Navigate to service directory
cd /path/to/backend/src/services/IdentityService

# Build image
docker build -t realserv/identity-service:1.0.0 .

# Tag as latest
docker tag realserv/identity-service:1.0.0 realserv/identity-service:latest

# Test locally
docker run -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e IDENTITY_DB_CONNECTION_STRING="Host=localhost;..." \
  -e FIREBASE_PROJECT_ID="realserv-prod" \
  -e FIREBASE_API_KEY="AIza..." \
  -v $(pwd)/firebase-admin-sdk.json:/app/secrets/firebase-admin-sdk.json \
  realserv/identity-service:1.0.0
```

### 2.2 Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name realserv/identity-service \
  --region us-east-1

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com
```

### 2.3 Push to ECR

```bash
# Tag for ECR
docker tag realserv/identity-service:1.0.0 \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/realserv/identity-service:1.0.0

docker tag realserv/identity-service:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/realserv/identity-service:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/realserv/identity-service:1.0.0
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/realserv/identity-service:latest
```

---

## Step 3: Provision AWS Infrastructure

### 3.1 Create RDS PostgreSQL Database

```bash
# Create database instance
aws rds create-db-instance \
  --db-instance-identifier realserv-identity-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 16.1 \
  --master-username postgres \
  --master-user-password "${DB_PASSWORD}" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name realserv-db-subnet \
  --backup-retention-period 7 \
  --multi-az \
  --publicly-accessible false \
  --region us-east-1

# Wait for database to be available
aws rds wait db-instance-available \
  --db-instance-identifier realserv-identity-db
```

### 3.2 Run Database Migrations

```bash
# Get database endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier realserv-identity-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

# Connection string
CONNECTION_STRING="Host=${DB_ENDPOINT};Database=realserv_identity;Username=postgres;Password=${DB_PASSWORD};SSL Mode=Require"

# Run migrations (from local machine with access to RDS)
dotnet ef database update --connection "${CONNECTION_STRING}"
```

### 3.3 Create Secrets in AWS Secrets Manager

```bash
# Store database connection string
aws secretsmanager create-secret \
  --name realserv/identity-service/db-connection \
  --secret-string "Host=${DB_ENDPOINT};Database=realserv_identity;Username=postgres;Password=${DB_PASSWORD};SSL Mode=Require" \
  --region us-east-1

# Store Firebase credentials
aws secretsmanager create-secret \
  --name realserv/identity-service/firebase-credentials \
  --secret-string file://firebase-admin-sdk.json \
  --region us-east-1

# Store Firebase API key
aws secretsmanager create-secret \
  --name realserv/identity-service/firebase-api-key \
  --secret-string "${FIREBASE_API_KEY}" \
  --region us-east-1
```

---

## Step 4: Create ECS Cluster and Task Definition

### 4.1 Create ECS Cluster

```bash
# Create Fargate cluster
aws ecs create-cluster \
  --cluster-name realserv-production \
  --capacity-providers FARGATE FARGATE_SPOT \
  --region us-east-1
```

### 4.2 Create Task Execution Role

Create `task-execution-role-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

```bash
# Create role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policy
aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name ecsTaskExecutionPolicy \
  --policy-document file://task-execution-role-policy.json
```

### 4.3 Create Task Definition

Create `task-definition.json`:

```json
{
  "family": "identity-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "identity-service",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/realserv/identity-service:1.0.0",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        }
      ],
      "secrets": [
        {
          "name": "IDENTITY_DB_CONNECTION_STRING",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:realserv/identity-service/db-connection"
        },
        {
          "name": "FIREBASE_PROJECT_ID",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:realserv/identity-service/firebase-project-id"
        },
        {
          "name": "FIREBASE_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:realserv/identity-service/firebase-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/identity-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/api/v1/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

```bash
# Register task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

---

## Step 5: Create Application Load Balancer

### 5.1 Create ALB

```bash
# Create load balancer
aws elbv2 create-load-balancer \
  --name realserv-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application \
  --region us-east-1
```

### 5.2 Create Target Group

```bash
# Create target group
aws elbv2 create-target-group \
  --name identity-service-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /api/v1/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region us-east-1
```

### 5.3 Create Listener

```bash
# Create HTTPS listener (requires SSL certificate)
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/realserv-alb/xxxxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/xxxxx \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/identity-service-tg/xxxxx
```

---

## Step 6: Deploy ECS Service

### 6.1 Create ECS Service

```bash
# Create service
aws ecs create-service \
  --cluster realserv-production \
  --service-name identity-service \
  --task-definition identity-service:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=DISABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/identity-service-tg/xxxxx,containerName=identity-service,containerPort=8080 \
  --health-check-grace-period-seconds 60 \
  --region us-east-1
```

### 6.2 Enable Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/realserv-production/identity-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region us-east-1

# Create scaling policy (CPU-based)
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/realserv-production/identity-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

**scaling-policy.json:**
```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleInCooldown": 300,
  "ScaleOutCooldown": 60
}
```

---

## Step 7: Configure DNS

### 7.1 Create Route 53 Record

```bash
# Create A record pointing to ALB
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://dns-change.json
```

**dns-change.json:**
```json
{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "api.realserv.com",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "Z1234567890ABC",
        "DNSName": "realserv-alb-123456789.us-east-1.elb.amazonaws.com",
        "EvaluateTargetHealth": true
      }
    }
  }]
}
```

---

## Step 8: Verify Deployment

### 8.1 Check Service Health

```bash
# Check service status
aws ecs describe-services \
  --cluster realserv-production \
  --services identity-service \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}' \
  --output table

# Expected output:
# --------------------------------
# |      DescribeServices        |
# +----------+---------+----------+
# | Desired  | Running |  Status  |
# +----------+---------+----------+
# |  2       |  2      |  ACTIVE  |
# +----------+---------+----------+
```

### 8.2 Test Health Endpoint

```bash
# Test via ALB
curl https://api.realserv.com/api/v1/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "firebase": "connected",
  "timestamp": "2026-01-11T12:00:00Z"
}
```

### 8.3 Test Authentication

```bash
# Test signup
curl -X POST https://api.realserv.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "production-test@example.com",
    "password": "Test@123456",
    "fullName": "Production Test",
    "userType": 0
  }'
```

---

## Step 9: Monitoring & Logging

### 9.1 Create CloudWatch Dashboard

```bash
# Create dashboard
aws cloudwatch put-dashboard \
  --dashboard-name IdentityServiceDashboard \
  --dashboard-body file://dashboard.json
```

### 9.2 Set Up Alarms

```bash
# CPU utilization alarm
aws cloudwatch put-metric-alarm \
  --alarm-name identity-service-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name identity-service-error-rate \
  --alarm-description "Alert on high error rate" \
  --metric-name 5XXError \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 60 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

---

## Step 10: Zero-Downtime Updates

### 10.1 Build New Version

```bash
# Build new version
docker build -t realserv/identity-service:1.0.1 .

# Push to ECR
docker tag realserv/identity-service:1.0.1 \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/realserv/identity-service:1.0.1

docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/realserv/identity-service:1.0.1
```

### 10.2 Update Task Definition

```bash
# Register new task definition (update image version)
aws ecs register-task-definition \
  --cli-input-json file://task-definition-v2.json
```

### 10.3 Update Service (Rolling Deployment)

```bash
# Update service with new task definition
aws ecs update-service \
  --cluster realserv-production \
  --service identity-service \
  --task-definition identity-service:2 \
  --force-new-deployment

# Monitor deployment
aws ecs wait services-stable \
  --cluster realserv-production \
  --services identity-service
```

**Deployment Strategy:**
- ECS drains old tasks gracefully
- New tasks start before old ones stop
- Zero downtime achieved

---

## Rollback Strategy

### Quick Rollback

```bash
# Rollback to previous task definition
aws ecs update-service \
  --cluster realserv-production \
  --service identity-service \
  --task-definition identity-service:1

# Monitor rollback
aws ecs wait services-stable \
  --cluster realserv-production \
  --services identity-service
```

---

## Cost Optimization

### Current Configuration Costs (Monthly)

| Resource | Configuration | Cost |
|----------|---------------|------|
| **ECS Fargate** | 2 tasks × 0.5 vCPU, 1GB RAM | ~$30 |
| **RDS PostgreSQL** | db.t3.medium, Multi-AZ | ~$120 |
| **ALB** | 1 load balancer | ~$20 |
| **Data Transfer** | ~100GB/month | ~$9 |
| **Secrets Manager** | 3 secrets | ~$1.20 |
| **CloudWatch Logs** | 10GB/month | ~$5 |
| **Total** | | **~$185/month** |

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
aws logs tail /ecs/identity-service --follow

# Common issues:
# - Missing secrets
# - Database connection failed
# - Firebase credentials invalid
```

### Health Check Failing

```bash
# SSH into task (using ECS Exec)
aws ecs execute-command \
  --cluster realserv-production \
  --task {task-id} \
  --container identity-service \
  --interactive \
  --command "/bin/bash"

# Test health endpoint
curl http://localhost:8080/api/v1/health
```

---

## Next Steps

1. ✅ Service deployed to production
2. → Set up CI/CD pipeline
3. → Configure monitoring alerts
4. → Perform load testing
5. → Document runbooks

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Deployment Time:** 30-45 minutes  
**Monthly Cost:** ~$185
