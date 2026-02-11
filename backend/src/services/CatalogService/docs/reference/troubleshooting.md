---
title: Troubleshooting Guide
service: Catalog Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Troubleshooting Guide - Catalog Service

**Service:** Catalog Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Common issues and solutions for the Catalog Service.

---

## Database Issues

### Issue 1: "Database connection failed"

**Symptoms:**
- Service fails to start
- Error: "A network-related or instance-specific error occurred"

**Solutions:**
```bash
# 1. Verify PostgreSQL is running
docker ps | grep postgres

# 2. Test connection
psql -h localhost -U postgres -d realserv_catalog_db

# 3. Check connection string in appsettings.json
# Should be: Host=localhost;Database=realserv_catalog_db;Username=postgres;Password=postgres

# 4. Restart PostgreSQL
docker restart realserv-catalog-db
```

---

### Issue 2: "Migrations not applied"

**Symptoms:**
- Error: "Table 'materials' does not exist"
- 404 errors on all endpoints

**Solutions:**
```bash
# 1. Check migration status
dotnet ef migrations list

# 2. Apply migrations
dotnet ef database update

# 3. If migrations fail, drop and recreate
dotnet ef database drop
dotnet ef database update

# 4. Verify tables exist
psql -h localhost -U postgres -d realserv_catalog_db -c "\dt"
```

---

### Issue 3: "Seed data not loading"

**Symptoms:**
- Empty results for `GET /api/v1/materials`
- `totalCount: 0` in response

**Solutions:**
```bash
# 1. Check if seed data was applied during migration
# Look for "Seed data loaded" in startup logs

# 2. Manually run seed data (in Program.cs)
dotnet run

# 3. Verify seed data
curl "http://localhost:5000/api/v1/catalog/stats"
# Should show: totalMaterials: 11, totalCategories: 10
```

---

## API Issues

### Issue 4: "Port 5000 already in use"

**Symptoms:**
- Error: "Unable to bind to http://localhost:5000"
- Service fails to start

**Solutions:**
```bash
# Option 1: Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows (then kill PID)

# Option 2: Change port in appsettings.json
{
  "Urls": "http://localhost:5001"
}

# Option 3: Use environment variable
export ASPNETCORE_URLS="http://localhost:5001"
dotnet run
```

---

### Issue 5: "401 Unauthorized on protected endpoints"

**Symptoms:**
- `POST /api/v1/materials` returns 401
- "Authentication required" error

**Solutions:**
```bash
# 1. Ensure Authorization header is included
curl -X POST "http://localhost:5000/api/v1/materials" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{...}'

# 2. Verify token is valid (not expired)
# Get new token from Identity Service: POST /auth/firebase

# 3. Check token format (must be "Bearer <token>")
# Correct: "Bearer eyJhbGc..."
# Wrong: "eyJhbGc..." (missing "Bearer")
```

---

### Issue 6: "403 Forbidden on admin endpoints"

**Symptoms:**
- `POST /api/v1/materials` returns 403
- "Insufficient permissions" error

**Solutions:**
```bash
# 1. Ensure user has admin role in JWT token
# Decode JWT at jwt.io and check "role" claim

# 2. Use admin token, not vendor or buyer token
# Admin operations require role="Admin"

# 3. For testing, use Swagger UI which bypasses auth in Development mode
open http://localhost:5000/swagger
```

---

### Issue 7: "404 Not Found for valid endpoint"

**Symptoms:**
- Known endpoint returns 404
- Swagger shows endpoint exists

**Solutions:**
```bash
# 1. Check API version in URL
# Correct: http://localhost:5000/api/v1/materials
# Wrong: http://localhost:5000/materials (missing /api/v1)

# 2. Verify service is running
curl http://localhost:5000/health

# 3. Check for trailing slashes
# Most endpoints work with or without trailing slash
# Exception: Base routes like /api/v1/categories vs /api/v1/categories/
```

---

## Performance Issues

### Issue 8: "Slow query response times"

**Symptoms:**
- Requests taking > 1 second
- Database CPU high

**Solutions:**
```sql
-- 1. Check for missing indexes
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE tablename IN ('materials', 'vendor_inventories', 'categories');

-- 2. Analyze slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- 3. Add pagination to large result sets
curl "http://localhost:5000/api/v1/materials?page=1&pageSize=20"

-- 4. Use search endpoints instead of filtering client-side
curl "http://localhost:5000/api/v1/search/materials?categoryId=xyz"
```

---

### Issue 9: "Memory usage high"

**Symptoms:**
- Service using > 1GB RAM
- Out of memory errors

**Solutions:**
```bash
# 1. Enable pagination (don't load all records)
# Bad: GET /api/v1/materials (returns all 10,000 materials)
# Good: GET /api/v1/materials?page=1&pageSize=20

# 2. Implement caching (Redis)
# Cache frequently accessed data (materials, categories)

# 3. Monitor with CloudWatch
# Check memory metrics in CloudWatch dashboard

# 4. Increase container memory limit (if using Docker)
docker run -m 512m realserv-catalog-service
```

---

## Data Issues

### Issue 10: "Duplicate SKU error"

**Symptoms:**
- 409 Conflict when creating material
- "Material with SKU 'xxx' already exists"

**Solutions:**
```bash
# 1. Search for existing material by SKU
curl "http://localhost:5000/api/v1/search/materials?searchTerm=SKU-HERE"

# 2. Use a different SKU
# Format: CATEGORY-TYPE-BRAND (e.g., CEM-OPC53-UT2)

# 3. Update existing material instead
curl -X PUT "http://localhost:5000/api/v1/materials/{existing-id}" \
  -H "Authorization: Bearer TOKEN" \
  -d '{...}'
```

---

### Issue 11: "Category not found" when creating material

**Symptoms:**
- 404 error: "Category not found"
- Material creation fails

**Solutions:**
```bash
# 1. Get valid category IDs first
curl "http://localhost:5000/api/v1/categories?type=1"  # Material categories

# 2. Use one of the returned category IDs
# Copy the "id" field from response

# 3. Create category if it doesn't exist (admin only)
curl -X POST "http://localhost:5000/api/v1/categories" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"name": "New Category", "type": 1}'
```

---

### Issue 12: "Vendor cannot see their inventory"

**Symptoms:**
- Empty results for `GET /api/v1/vendor-inventory/vendor/{vendorId}`
- Vendor has no inventory shown

**Solutions:**
```bash
# 1. Verify vendorId in request matches token vendorId
# Extract vendorId from JWT token

# 2. Check if inventory exists
# Admin can query: GET /api/v1/vendor-inventory/{id}

# 3. Add inventory first
curl -X POST "http://localhost:5000/api/v1/vendor-inventory" \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -d '{
    "vendorId": "your-vendor-id",
    "materialId": "material-id",
    "vendorPrice": 435.00,
    "stockQuantity": 500
  }'
```

---

## Deployment Issues

### Issue 13: "Service unhealthy in ECS"

**Symptoms:**
- ECS tasks failing health checks
- Service keeps restarting

**Solutions:**
```bash
# 1. Check health endpoint
curl http://container-ip/health

# 2. Verify environment variables in ECS task definition
# Especially ConnectionStrings__CatalogServiceDb

# 3. Check CloudWatch logs
aws logs tail /realserv/catalog-service --follow

# 4. Verify database security group allows ECS connection
# RDS security group must allow inbound from ECS security group
```

---

### Issue 14: "Migrations fail in production"

**Symptoms:**
- "Permission denied" error during migration
- Tables not created

**Solutions:**
```bash
# 1. Ensure database user has CREATE TABLE permissions
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO dbuser;

# 2. Run migrations manually before deployment
dotnet ef database update --connection "Host=prod-rds;..."

# 3. Use dedicated migration job (not in application startup)
# Create separate ECS task for migrations

# 4. Check RDS connection string includes SSL Mode
ConnectionStrings__CatalogServiceDb="Host=rds;...;SSL Mode=Require"
```

---

## Logging & Debugging

### Issue 15: "No logs in CloudWatch"

**Symptoms:**
- CloudWatch log group empty
- Cannot debug production issues

**Solutions:**
```bash
# 1. Verify AWS credentials in ECS task role
# Task role must have cloudwatch:PutLogEvents permission

# 2. Check log group name matches configuration
AWS__CloudWatch__LogGroup="/realserv/catalog-service"

# 3. Verify log level is not too restrictive
Logging__LogLevel__Default="Information"  # Not "Error"

# 4. Check ECS task definition logging configuration
"logConfiguration": {
  "logDriver": "awslogs",
  "options": {
    "awslogs-group": "/realserv/catalog-service",
    "awslogs-region": "ap-south-1",
    "awslogs-stream-prefix": "catalog"
  }
}
```

---

## Quick Diagnostics

### Health Check
```bash
curl http://localhost:5000/health
# Should return: {"status":"Healthy","database":"Connected"}
```

### Database Connectivity
```bash
psql -h localhost -U postgres -d realserv_catalog_db -c "SELECT COUNT(*) FROM materials;"
# Should return: 11
```

### API Connectivity
```bash
curl "http://localhost:5000/api/v1/materials" | jq '.success'
# Should return: true
```

### Check Logs
```bash
# Local
dotnet run  # See console output

# Docker
docker logs catalog-service

# AWS
aws logs tail /realserv/catalog-service --follow
```

---

## Still Having Issues?

1. **Check logs**: Review CloudWatch or console logs for detailed error traces
2. **Enable debug logging**: Set `Logging__LogLevel__Default="Debug"` temporarily
3. **Test with Swagger**: Use http://localhost:5000/swagger for interactive testing
4. **Contact support**: backend@realserv.com with error logs and request details

---

**Last Updated:** January 11, 2026  
**Total Issues Covered:** 15
