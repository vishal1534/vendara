# 🚀 CATALOG SERVICE - PRODUCTION DEPLOYMENT GUIDE

**Version:** 2.0 (Security Hardened)  
**Status:** ✅ Production Ready  
**Last Updated:** January 11, 2026

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Environment Variables (Required)
```bash
# Database
DB_HOST=<your-postgres-host>
DB_NAME=realserv_catalog_db
DB_USER=<db-username>
DB_PASSWORD=<db-password>

# Redis Cache
REDIS_CONNECTION_STRING=<your-redis-connection>

# AWS CloudWatch (Optional but recommended)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
```

### Configuration Files
1. Update `appsettings.Production.json`:
   ```json
   {
     "AllowedOrigins": [
       "https://yourdomain.com",
       "https://app.yourdomain.com"
     ]
   }
   ```

2. Set connection strings via environment variables or AWS Secrets Manager

---

## 🔧 INSTALLATION STEPS

### 1. Install Required Packages
```bash
cd /backend/src/services/CatalogService

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build --configuration Release
```

### 2. Database Setup
```bash
# Apply migrations
dotnet ef database update --project CatalogService.csproj

# Or use the auto-migration (Development only)
# The service will auto-migrate on startup if in Development mode
```

### 3. Redis Setup
```bash
# Install Redis (if not using managed service)
# Docker option:
docker run -d --name redis -p 6379:6379 redis:latest

# Or use AWS ElastiCache, Azure Cache, etc.
```

---

## 🐳 DOCKER DEPLOYMENT

### Build Docker Image
```bash
cd /backend/src/services/CatalogService

docker build -t realserv-catalog-service:2.0 .
```

### Run Container
```bash
docker run -d \
  --name catalog-service \
  -p 5000:80 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e DB_HOST=your-db-host \
  -e DB_NAME=realserv_catalog_db \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e REDIS_CONNECTION_STRING=your-redis:6379 \
  realserv-catalog-service:2.0
```

### Docker Compose
```yaml
version: '3.8'

services:
  catalog-service:
    image: realserv-catalog-service:2.0
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - DB_HOST=postgres
      - DB_NAME=realserv_catalog_db
      - DB_USER=postgres
      - DB_PASSWORD=yourpassword
      - REDIS_CONNECTION_STRING=redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=realserv_catalog_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=yourpassword
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:latest
    restart: unless-stopped

volumes:
  postgres-data:
```

---

## ☁️ AWS ECS DEPLOYMENT

### Task Definition
```json
{
  "family": "catalog-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "catalog-service",
      "image": "your-ecr-repo/catalog-service:2.0",
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
        }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/catalog-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 🔐 SECURITY CONFIGURATION

### 1. CORS Setup
Update `appsettings.Production.json`:
```json
{
  "AllowedOrigins": [
    "https://realserv.com",
    "https://app.realserv.com",
    "https://vendor.realserv.com",
    "https://admin.realserv.com"
  ]
}
```

### 2. Rate Limiting
Default: 200 requests/minute per IP

To adjust, update `appsettings.Production.json`:
```json
{
  "RateLimiting": {
    "PermitLimit": 300,
    "Window": 60
  }
}
```

### 3. Database Security
- Use SSL/TLS for database connections
- Rotate database credentials regularly
- Use IAM authentication if on AWS RDS

### 4. Redis Security
- Enable Redis AUTH
- Use SSL/TLS for Redis connections
- Restrict network access

---

## 📊 MONITORING & OBSERVABILITY

### Health Checks
```bash
# Check service health
curl https://your-api.com/health

# Expected response:
# Healthy
```

### CloudWatch Logs
The service automatically sends logs to CloudWatch if configured:
- Application logs: `/aws/ecs/catalog-service`
- Request logs: Includes duration, status, path
- Error logs: Includes stack traces (development only)

### Metrics
Available metrics in CloudWatch:
- Request count
- Request duration
- Error rate
- Active connections
- Cache hit/miss rate

---

## 🔄 DEPLOYMENT STRATEGIES

### Blue-Green Deployment
1. Deploy new version (green)
2. Test health endpoint
3. Switch traffic from blue to green
4. Monitor for 15 minutes
5. Decommission blue if healthy

### Rolling Deployment
1. Deploy to 25% of instances
2. Monitor for errors
3. Deploy to 50% if healthy
4. Deploy to 75% if healthy
5. Deploy to 100% if healthy

### Rollback Plan
```bash
# If issues detected:
1. Switch traffic back to previous version
2. Investigate logs in CloudWatch
3. Fix issues
4. Redeploy
```

---

## 🧪 SMOKE TESTS

### After Deployment
```bash
# 1. Health check
curl https://api.yourdom...com/health

# 2. Get materials (public)
curl https://api.yourdomain.com/api/v1/materials?page=1&pageSize=10

# 3. Search (public)
curl https://api.yourdomain.com/api/v1/search/materials?searchTerm=cement

# 4. Get specific material (public)
curl https://api.yourdomain.com/api/v1/materials/{material-id}

# 5. Admin endpoint (should return 401 without auth)
curl https://api.yourdomain.com/api/v1/materials -X POST
# Expected: 401 Unauthorized
```

---

## ⚠️ TROUBLESHOOTING

### Service won't start
```bash
# Check logs
docker logs catalog-service

# Common issues:
# 1. Database connection failed
#    - Verify DB_HOST, DB_USER, DB_PASSWORD
#    - Check network connectivity
#    - Verify database exists

# 2. Redis connection failed
#    - Verify REDIS_CONNECTION_STRING
#    - Check Redis is running
#    - Verify network connectivity
```

### Rate limit errors (429)
```bash
# Increase rate limit in appsettings.Production.json
{
  "RateLimiting": {
    "PermitLimit": 500  # Increase from 200
  }
}
```

### Slow response times
```bash
# 1. Check Redis is running
docker ps | grep redis

# 2. Check database connection pool
# Look for "pool exhausted" errors in logs

# 3. Enable query logging temporarily
{
  "Logging": {
    "Microsoft.EntityFrameworkCore": "Information"
  }
}
```

---

## 📈 SCALING GUIDE

### Horizontal Scaling
```bash
# Increase instance count
# ECS: Update desired count
# Kubernetes: kubectl scale deployment catalog-service --replicas=5
```

### Vertical Scaling
```json
// ECS Task Definition
{
  "cpu": "1024",     // Increase from 512
  "memory": "2048"   // Increase from 1024
}
```

### Database Scaling
- Use read replicas for GET endpoints
- Implement database connection pooling (already configured)
- Consider sharding if > 1M records

### Cache Scaling
- Use Redis Cluster for > 100k requests/min
- Configure cache eviction policies
- Monitor cache hit rate (target: > 80%)

---

## 🔧 MAINTENANCE

### Database Migrations
```bash
# Create new migration
dotnet ef migrations add MigrationName --project CatalogService.csproj

# Apply migration (production)
dotnet ef database update --project CatalogService.csproj --configuration Release
```

### Cache Clearing
```bash
# Clear all cache (if needed)
redis-cli FLUSHDB

# Or use the caching service API (if exposed)
```

### Log Rotation
CloudWatch logs automatically rotate. For self-hosted:
```bash
# Configure in appsettings.Production.json
{
  "Serilog": {
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "rollingInterval": "Day",
          "retainedFileCountLimit": 30
        }
      }
    ]
  }
}
```

---

## 📞 SUPPORT CONTACTS

### Production Issues
1. Check CloudWatch logs
2. Review health check endpoint
3. Check database connectivity
4. Verify Redis connection
5. Review recent deployments

### Emergency Rollback
```bash
# ECS
aws ecs update-service \
  --cluster your-cluster \
  --service catalog-service \
  --task-definition catalog-service:PREVIOUS_VERSION

# Docker
docker stop catalog-service
docker run -d --name catalog-service your-repo/catalog-service:previous-tag
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

- [ ] Health check returns 200
- [ ] Public endpoints accessible (GET /materials)
- [ ] Auth endpoints return 401 without token
- [ ] Rate limiting works (429 after limit)
- [ ] CloudWatch receiving logs
- [ ] Redis caching working (check cache hit rate)
- [ ] Database queries performant (< 100ms avg)
- [ ] No error spikes in monitoring

---

**Deployment Status:** ✅ **READY**  
**Next Review:** After 1 week in production  
**Contact:** DevOps Team

---

*This guide will be updated as the service evolves.*
