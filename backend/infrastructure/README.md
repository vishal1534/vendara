# Infrastructure

Infrastructure as Code (IaC) and DevOps configurations for RealServ backend.

## Structure

```
infrastructure/
├── terraform/          # Terraform IaC
│   ├── modules/        # Reusable modules
│   ├── environments/   # Environment configs
│   └── scripts/        # Helper scripts
├── docker/             # Docker configs
│   └── nginx/          # Nginx configs (if needed)
└── kubernetes/         # K8s configs (future)
    ├── deployments/
    ├── services/
    └── ingress/
```

## Terraform

### Modules

Reusable Terraform modules:
- **vpc/** - VPC with public/private subnets
- **rds/** - RDS PostgreSQL instances
- **ecs/** - ECS cluster and services
- **s3/** - S3 buckets for media/backups
- **alb/** - Application Load Balancer
- **cloudwatch/** - Logging and monitoring

### Environments

Environment-specific configurations:
- **dev/** - Development environment
- **staging/** - Staging environment
- **production/** - Production environment

### Usage

```bash
cd infrastructure/terraform/environments/dev

# Initialize
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy (careful!)
terraform destroy
```

## Docker

Docker configurations for local development and deployment.

### docker-compose.yml

Located in root: `/backend/docker-compose.yml`

Start local environment:
```bash
docker-compose up -d
```

### Dockerfile

Each service has its own Dockerfile for containerization.

Example:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ServiceName.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ServiceName.dll"]
```

## Kubernetes (Future)

Kubernetes manifests for future migration from ECS to K8s.

**Planned resources**:
- Deployments for each service
- Services (ClusterIP, LoadBalancer)
- Ingress for routing
- ConfigMaps for configuration
- Secrets for sensitive data
- HorizontalPodAutoscaler for scaling

## AWS Resources

### Created by Terraform

**Week 1-2 Setup**:
- VPC (10.0.0.0/16)
- Public subnets (2 AZs)
- Private subnets (2 AZs)
- Internet Gateway
- NAT Gateway (2)
- RDS PostgreSQL (13 instances)
- ElastiCache Redis
- S3 buckets (media, KYC, backups)
- ECS cluster
- ALB with SSL
- CloudWatch log groups

### Manual Setup Required

- Firebase project (console.firebase.google.com)
- Razorpay account (dashboard.razorpay.com)
- WhatsApp Business Account (business.facebook.com)
- Google Cloud project for Maps API (console.cloud.google.com)
- Domain registration (Route 53 or external)
- SSL certificate (ACM)

## Deployment

### Local Development

```bash
# Start infrastructure
docker-compose up -d

# Run service locally
cd src/services/UserManagementService
dotnet run
```

### Development Environment (AWS)

```bash
# Deploy infrastructure
cd infrastructure/terraform/environments/dev
terraform apply

# Deploy services via CI/CD
git push origin main
# GitHub Actions will build and deploy
```

### Production Deployment

```bash
# Deploy infrastructure
cd infrastructure/terraform/environments/production
terraform apply

# Deploy services
# Trigger production deployment via GitHub Actions
# (requires manual approval)
```

## Monitoring

- **CloudWatch Logs** - All service logs
- **CloudWatch Metrics** - CPU, memory, request count
- **CloudWatch Alarms** - Critical alerts
- **CloudWatch Dashboards** - Service health overview

## Security

- **Secrets Manager** - All credentials encrypted
- **IAM Roles** - Least privilege access
- **Security Groups** - Network-level security
- **WAF** - Web application firewall
- **GuardDuty** - Threat detection

## Cost Management

- **Cost Explorer** - Track spending
- **Budgets** - Set alerts ($500, $1000, $1500)
- **Resource tagging** - Track costs by service

## Backups

- **RDS** - Automated daily backups (7-day retention)
- **S3** - Versioning enabled
- **Point-in-time recovery** - Enabled for RDS

## Disaster Recovery

- **Multi-AZ** - RDS and ECS across 2 AZs
- **Backups** - Daily automated backups
- **Recovery Time Objective (RTO)** - 1 hour
- **Recovery Point Objective (RPO)** - 1 hour

## Next Steps

1. Review Terraform modules
2. Create dev environment
3. Deploy first service
4. Set up monitoring
5. Configure CI/CD
