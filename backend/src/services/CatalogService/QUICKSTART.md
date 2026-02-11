---
title: Quick Start - Catalog Service
service: Catalog Service
category: quickstart
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Quick Start - Catalog Service

**Service:** Catalog Service  
**Category:** Quick Start  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Get the Catalog Service running in 5 minutes with Docker.

---

## Prerequisites

- Docker Desktop installed
- .NET 8 SDK (for local development without Docker)
- PostgreSQL 16+ (via Docker)

## 1. Clone & Configure

```bash
git clone https://github.com/realserv/backend.git
cd backend/src/services/CatalogService
```

**Configuration** (optional - uses defaults):
- Connection string defaults to `localhost:5432`
- Database auto-creates on first run (development mode)
- Seed data auto-loads

## 2. Start PostgreSQL

```bash
docker run --name realserv-catalog-db \
  -e POSTGRES_DB=realserv_catalog_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

**Verify Running**:
```bash
docker ps | grep realserv-catalog-db
```

## 3. Run Migrations

```bash
dotnet ef database update
```

**Expected Output**:
```
Done.
Applying migration '20260111100000_InitialCreate'.
Applying migration '20260111100001_AddEnhancementFeatures'.
```

## 4. Start Service

```bash
dotnet run
```

**Expected Output**:
```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started
Database migrations applied successfully.
Seed data loaded: 10 categories, 11 materials, 6 labor services
```

## 5. First Request

```bash
curl http://localhost:5000/health
```

**Expected Output**:
```json
{
  "status": "Healthy",
  "service": "CatalogService",
  "database": "Connected",
  "timestamp": "2026-01-11T12:00:00Z"
}
```

## 6. Test the API

```bash
# Get all materials
curl http://localhost:5000/api/v1/materials

# Search materials
curl "http://localhost:5000/api/v1/search/materials?searchTerm=cement"

# Get categories
curl http://localhost:5000/api/v1/categories
```

**Expected Response** (materials):
```json
{
  "success": true,
  "message": "Retrieved 11 materials",
  "data": [
    {
      "id": "...",
      "name": "OPC 53 Grade Cement",
      "basePrice": 440,
      "unit": "bag (50kg)",
      "categoryName": "Cement",
      "brand": "UltraTech",
      "isActive": true
    },
    ...
  ]
}
```

## ✅ You're Done!

Your Catalog Service is running on `http://localhost:5000`

### Explore the API

**Swagger UI**: http://localhost:5000/swagger

**Seed Data Loaded**:
- ✅ **5 Material Categories**: Cement, Bricks, Steel, Sand, Paints
- ✅ **5 Labor Categories**: Masonry, Carpentry, Electrical, Plumbing, Painting
- ✅ **11 Materials**: Cement (2), Bricks (2), Steel (2), Sand (3), Paints (2)
- ✅ **6 Labor Services**: Mason (2), Carpenter, Electrician, Plumber, Painter

### Next Steps

- **[Create your first material](./guides/material-catalog.md)** - Add a new material to catalog
- **[Search and filter](./guides/search-filtering.md)** - Use advanced search features
- **[Add vendor inventory](./guides/pricing-inventory.md)** - Vendor-specific pricing
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation (47 endpoints)
- **[Test with Postman](./examples/postman/)** - Import Postman collection

### Common Issues

**Issue 1: Port 5000 already in use**
```bash
# Solution: Change port in appsettings.json
"Urls": "http://localhost:5001"

# Or use environment variable
export ASPNETCORE_URLS="http://localhost:5001"
dotnet run
```

**Issue 2: Database connection failed**
```bash
# Solution: Verify PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs realserv-catalog-db

# Restart if needed
docker restart realserv-catalog-db
```

**Issue 3: Migrations fail**
```bash
# Solution: Drop and recreate database
dotnet ef database drop
dotnet ef database update
```

**Issue 4: "Build failed" during migration**
```bash
# Solution: Build project first
dotnet build
dotnet ef database update
```

---

## Alternative: Docker Compose (Easiest)

If you prefer an all-in-one solution:

```bash
# From CatalogService directory
docker-compose up -d
```

**This starts**:
- PostgreSQL 16 on port 5432
- Catalog Service on port 5001

**Verify**:
```bash
curl http://localhost:5001/health
```

---

## Alternative: Full Docker Build

Build and run as a container:

```bash
# Build image
docker build -t realserv-catalog-service -f Dockerfile ../../../

# Run container
docker run -d \
  --name catalog-service \
  -p 5001:80 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ConnectionStrings__CatalogServiceDb="Host=host.docker.internal;Database=realserv_catalog_db;Username=postgres;Password=postgres" \
  realserv-catalog-service

# Check logs
docker logs -f catalog-service
```

---

## Clean Up

Stop and remove containers:

```bash
# Stop service (if running locally)
# Ctrl+C in terminal

# Stop and remove database
docker stop realserv-catalog-db
docker rm realserv-catalog-db

# Or with Docker Compose
docker-compose down
```

---

## What's Next?

Now that your Catalog Service is running, explore:

1. **[Material Catalog Guide](./guides/material-catalog.md)** - Manage construction materials
2. **[Labor Catalog Guide](./guides/labor-catalog.md)** - Manage skilled labor services
3. **[Advanced Search](./guides/search-filtering.md)** - Multi-filter search capabilities
4. **[API Reference](./API_REFERENCE.md)** - All 47 endpoints documented
5. **[Deploy to Production](./docs/how-to-guides/deploy-to-production.md)** - AWS ECS deployment

---

**Service Version:** 1.0.0  
**Setup Time:** < 5 minutes  
**Status:** ✅ Production Ready
