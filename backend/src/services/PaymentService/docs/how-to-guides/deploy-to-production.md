---
title: Deploy to Production Guide - Payment Service
service: Payment Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
estimated_time: 30-45 minutes
---

# Deploy to Production Guide

**Service:** Payment Service  
**Category:** How-To Guide  
**Estimated Time:** 30-45 minutes  
**Last Updated:** January 11, 2026

> **Goal:** Deploy Payment Service to AWS ECS with RDS PostgreSQL, ElastiCache Redis, and Application Load Balancer.

---

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Docker installed
- Domain name configured (api.realserv.com)
- Razorpay live credentials

---

## Architecture Overview

```
Internet
   ↓
Application Load Balancer (HTTPS)
   ↓
ECS Service (2+ tasks)
   ├→ Task 1 (Payment Service container)
   ├→ Task 2 (Payment Service container)
   ↓
RDS PostgreSQL (Multi-AZ)
ElastiCache Redis (Cluster mode)
```

---

## Step 1: Build and Push Docker Image

### Build Image (3 minutes)

```bash
# Navigate to Payment Service directory
cd backend/src/services/PaymentService

# Build Docker image
docker build -t realserv/payment-service:1.0.0 .

# Tag for ECR
docker tag realserv/payment-service:1.0.0 \
  123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/payment-service:1.0.0
```

### Push to ECR (2 minutes)

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.ap-south-1.amazonaws.com

# Create ECR repository (first time only)
aws ecr create-repository \
  --repository-name realserv/payment-service \
  --region ap-south-1

# Push image
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/payment-service:1.0.0
```

**✅ Result:** Docker image is now in ECR.

---

## Step 2: Create RDS PostgreSQL Database

### Create DB Subnet Group (2 minutes)

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name realserv-payment-db-subnet \
  --db-subnet-group-description "RealServ Payment DB Subnet" \
  --subnet-ids subnet-xxxxx subnet-yyyyy \
  --region ap-south-1
```

### Create Security Group (2 minutes)

```bash
# Create security group
aws ec2 create-security-group \
  --group-name realserv-payment-db-sg \
  --description "RealServ Payment Database" \
  --vpc-id vpc-xxxxx \
  --region ap-south-1

# Allow PostgreSQL from ECS security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-ecs-xxxxx \
  --region ap-south-1
```

### Create RDS Instance (10 minutes)

```bash
aws rds create-db-instance \
  --db-instance-identifier realserv-payment-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username realserv_admin \
  --master-user-password "SECURE_PASSWORD_HERE" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --storage-encrypted \
  --db-subnet-group-name realserv-payment-db-subnet \
  --vpc-security-group-ids sg-xxxxx \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "mon:04:00-mon:05:00" \
  --multi-az \
  --publicly-accessible false \
  --region ap-south-1
```

**Wait:** Database creation takes ~10 minutes.

### Get Database Endpoint

```bash
aws rds describe-db-instances \
  --db-instance-identifier realserv-payment-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

**Output:** `realserv-payment-db.xxxxx.ap-south-1.rds.amazonaws.com`

---

## Step 3: Create ElastiCache Redis

### Create Cache Subnet Group (2 minutes)

```bash
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name realserv-payment-redis-subnet \
  --cache-subnet-group-description "RealServ Payment Redis Subnet" \
  --subnet-ids subnet-xxxxx subnet-yyyyy \
  --region ap-south-1
```

### Create Security Group (2 minutes)

```bash
aws ec2 create-security-group \
  --group-name realserv-payment-redis-sg \
  --description "RealServ Payment Redis" \
  --vpc-id vpc-xxxxx \
  --region ap-south-1

aws ec2 authorize-security-group-ingress \
  --group-id sg-redis-xxxxx \
  --protocol tcp \
  --port 6379 \
  --source-group sg-ecs-xxxxx \
  --region ap-south-1
```

### Create Redis Cluster (5 minutes)

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id realserv-payment-redis \
  --engine redis \
  --engine-version 7.0 \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --cache-subnet-group-name realserv-payment-redis-subnet \
  --security-group-ids sg-redis-xxxxx \
  --snapshot-retention-limit 7 \
  --preferred-maintenance-window "mon:05:00-mon:06:00" \
  --region ap-south-1
```

### Get Redis Endpoint

```bash
aws elasticache describe-cache-clusters \
  --cache-cluster-id realserv-payment-redis \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text
```

**Output:** `realserv-payment-redis.xxxxx.cache.amazonaws.com`

---

## Step 4: Store Secrets in AWS Secrets Manager

### Create Database Secret (2 minutes)

```bash
aws secretsmanager create-secret \
  --name realserv/payment/db-connection-string \
  --description "Payment Service Database Connection" \
  --secret-string "Host=realserv-payment-db.xxxxx.ap-south-1.rds.amazonaws.com;Port=5432;Database=realserv_payment;Username=realserv_admin;Password=SECURE_PASSWORD;SSL Mode=Require;Trust Server Certificate=true" \
  --region ap-south-1
```

### Create Razorpay Secrets

```bash
# Razorpay Key ID
aws secretsmanager create-secret \
  --name realserv/payment/razorpay-key-id \
  --secret-string "rzp_live_XXXXXXXXXXXX" \
  --region ap-south-1

# Razorpay Key Secret
aws secretsmanager create-secret \
  --name realserv/payment/razorpay-key-secret \
  --secret-string "YYYYYYYYYYYYYYYY" \
  --region ap-south-1

# Razorpay Webhook Secret
aws secretsmanager create-secret \
  --name realserv/payment/razorpay-webhook-secret \
  --secret-string "whsec_ZZZZZZZZZZZZZZZZ" \
  --region ap-south-1
```

---

## Step 5: Run Database Migrations

### Connect to RDS (via Bastion or VPN)

```bash
# Create SSH tunnel through bastion
ssh -L 5432:realserv-payment-db.xxxxx.ap-south-1.rds.amazonaws.com:5432 ec2-user@bastion-host

# In new terminal, run migrations
cd backend/src/services/PaymentService
dotnet ef database update
```

**Alternative:** Run migrations from ECS task:

```bash
# Create one-time ECS task to run migrations
aws ecs run-task \
  --cluster realserv-cluster \
  --task-definition payment-service-migration \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=DISABLED}"
```

---

## Step 6: Create ECS Task Definition

### Create task-definition.json

```json
{
  "family": "realserv-payment-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/realserv-payment-task-role",
  "containerDefinitions": [
    {
      "name": "payment-service",
      "image": "123456789012.dkr.ecr.ap-south-1.amazonaws.com/realserv/payment-service:1.0.0",
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
        },
        {
          "name": "ASPNETCORE_URLS",
          "value": "http://+:8080"
        },
        {
          "name": "REDIS_CONNECTION_STRING",
          "value": "realserv-payment-redis.xxxxx.cache.amazonaws.com:6379"
        },
        {
          "name": "CORS_ALLOWED_ORIGINS",
          "value": "https://app.realserv.com,https://vendor.realserv.com,https://admin.realserv.com"
        }
      ],
      "secrets": [
        {
          "name": "DB_CONNECTION_STRING",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:realserv/payment/db-connection-string"
        },
        {
          "name": "RAZORPAY_KEY_ID",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:realserv/payment/razorpay-key-id"
        },
        {
          "name": "RAZORPAY_KEY_SECRET",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:realserv/payment/razorpay-key-secret"
        },
        {
          "name": "RAZORPAY_WEBHOOK_SECRET",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:realserv/payment/razorpay-webhook-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/realserv-payment-service",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

### Register Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region ap-south-1
```

---

## Step 7: Create Application Load Balancer

### Create Target Group (2 minutes)

```bash
aws elbv2 create-target-group \
  --name realserv-payment-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region ap-south-1
```

### Create Load Balancer (3 minutes)

```bash
aws elbv2 create-load-balancer \
  --name realserv-payment-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-alb-xxxxx \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --region ap-south-1
```

### Create HTTPS Listener (2 minutes)

```bash
# Get ACM certificate ARN
aws acm list-certificates --region ap-south-1

# Create HTTPS listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/realserv-payment-alb/xxxxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:ap-south-1:123456789012:certificate/xxxxx \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/realserv-payment-tg/xxxxx \
  --region ap-south-1
```

---

## Step 8: Create ECS Service

### Create service.json

```json
{
  "cluster": "realserv-cluster",
  "serviceName": "payment-service",
  "taskDefinition": "realserv-payment-service:1",
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/realserv-payment-tg/xxxxx",
      "containerName": "payment-service",
      "containerPort": 8080
    }
  ],
  "desiredCount": 2,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["subnet-xxxxx", "subnet-yyyyy"],
      "securityGroups": ["sg-ecs-xxxxx"],
      "assignPublicIp": "DISABLED"
    }
  },
  "healthCheckGracePeriodSeconds": 60,
  "deploymentConfiguration": {
    "maximumPercent": 200,
    "minimumHealthyPercent": 100
  }
}
```

### Create ECS Service

```bash
aws ecs create-service \
  --cli-input-json file://service.json \
  --region ap-south-1
```

**✅ Result:** ECS service is now running with 2 tasks.

---

## Step 9: Configure Auto-Scaling

### Create Auto-Scaling Target (2 minutes)

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/realserv-cluster/payment-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region ap-south-1
```

### Create CPU-based Scaling Policy

```bash
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/realserv-cluster/payment-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name payment-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://cpu-scaling-policy.json \
  --region ap-south-1
```

**cpu-scaling-policy.json:**
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

## Step 10: Configure DNS

### Update Route 53 (2 minutes)

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.realserv.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z1234567890DEF",
          "DNSName": "realserv-payment-alb-xxxxx.ap-south-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }' \
  --region ap-south-1
```

**✅ Result:** `https://api.realserv.com/payment` now points to your load balancer.

---

## Step 11: Update Razorpay Webhook URL

1. Log in to Razorpay Dashboard
2. Go to **Settings → Webhooks**
3. Update webhook URL to: `https://api.realserv.com/payment/api/v1/webhooks/razorpay`
4. Save

---

## Step 12: Verify Deployment

### Check Service Health

```bash
curl https://api.realserv.com/payment/health
# Expected: {"status": "Healthy"}
```

### Test Payment Creation

```bash
curl -X POST https://api.realserv.com/payment/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "buyerId": "buyer-uuid",
    "vendorId": "vendor-uuid",
    "amount": 100.00,
    "currency": "INR",
    "paymentMethod": "online"
  }'
```

### Monitor Logs

```bash
aws logs tail /ecs/realserv-payment-service --follow --region ap-south-1
```

---

## Cost Estimate (Monthly)

| Resource | Configuration | Cost (USD) |
|----------|--------------|------------|
| ECS Fargate (2 tasks) | 0.5 vCPU, 1 GB RAM | ~$25 |
| RDS PostgreSQL | db.t3.micro, Multi-AZ | ~$30 |
| ElastiCache Redis | cache.t3.micro | ~$15 |
| Application Load Balancer | Standard | ~$20 |
| Data Transfer | ~100 GB/month | ~$10 |
| **Total** | | **~$100/month** |

---

## Monitoring

### CloudWatch Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name payment-service-high-cpu \
  --alarm-description "Payment Service High CPU" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=ServiceName,Value=payment-service Name=ClusterName,Value=realserv-cluster
```

---

## Rollback Procedure

```bash
# List task definitions
aws ecs list-task-definitions --family-prefix realserv-payment-service

# Update service to previous version
aws ecs update-service \
  --cluster realserv-cluster \
  --service payment-service \
  --task-definition realserv-payment-service:PREVIOUS_VERSION
```

---

## Next Steps

- Set up CI/CD pipeline with GitHub Actions
- Configure CloudWatch dashboards
- Set up alerting with SNS
- Implement blue-green deployments

---

**Document Status:** ✅ Complete  
**Estimated Time:** 30-45 minutes  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
