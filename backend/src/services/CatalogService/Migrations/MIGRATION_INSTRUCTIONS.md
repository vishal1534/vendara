# Catalog Service - Database Migration Instructions

**Date:** January 11, 2026  
**Database:** PostgreSQL 16  
**Service:** Catalog Service

---

## Prerequisites

- ✅ PostgreSQL 16 running
- ✅ Database `realserv_catalog_db` created
- ✅ .NET 8 SDK installed
- ✅ EF Core CLI tools installed

---

## Method 1: Using EF Core CLI (Recommended)

### Step 1: Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

### Step 2: Create Initial Migration

```bash
cd backend/src/services/CatalogService
dotnet ef migrations add InitialCreate --output-dir Migrations
```

This creates migration files in `/Migrations/` folder.

### Step 3: Apply Migration to Database

```bash
# Development (localhost)
dotnet ef database update

# Production (specify connection string)
dotnet ef database update --connection "Host=prod-rds.amazonaws.com;Database=realserv_catalog_db;Username=admin;Password=<secret>;SSL Mode=Require"
```

### Step 4: Verify Tables Created

```bash
psql -h localhost -U postgres -d realserv_catalog_db -c "\dt"
```

**Expected tables:**
- categories
- materials
- labor_categories
- vendor_inventories
- vendor_labor_availabilities
- price_histories

### Step 5: Verify Seed Data Loaded

```bash
psql -h localhost -U postgres -d realserv_catalog_db -c "SELECT COUNT(*) FROM materials;"
```

**Expected:** 11 materials

---

## Method 2: Using Docker (Alternative)

If you're running the service in Docker:

```bash
# Build image
docker build -t catalog-service .

# Run migration in container
docker run --rm \
  -e ConnectionStrings__CatalogServiceDb="Host=host.docker.internal;Database=realserv_catalog_db;Username=postgres;Password=postgres" \
  catalog-service \
  dotnet ef database update
```

---

## Method 3: Manual SQL Script (Production)

For production deployments where you need DBA approval:

### Step 1: Generate SQL Script

```bash
dotnet ef migrations script --output Migrations/InitialCreate.sql
```

### Step 2: Review SQL Script

Open `Migrations/InitialCreate.sql` and review all DDL statements.

### Step 3: Execute SQL Script

```bash
psql -h prod-rds.amazonaws.com -U admin -d realserv_catalog_db -f Migrations/InitialCreate.sql
```

---

## Troubleshooting

### Error: "dotnet-ef command not found"

```bash
# Install globally
dotnet tool install --global dotnet-ef

# Or use local tool
dotnet tool install dotnet-ef
dotnet ef --version
```

### Error: "Database does not exist"

```bash
# Create database first
psql -h localhost -U postgres -c "CREATE DATABASE realserv_catalog_db;"
```

### Error: "Could not connect to database"

Check connection string in `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=localhost;Database=realserv_catalog_db;Username=postgres;Password=postgres"
  }
}
```

### Error: "Migrations already applied"

```bash
# Check migration history
dotnet ef migrations list

# Remove last migration (if needed)
dotnet ef migrations remove

# Revert to previous migration
dotnet ef database update PreviousMigrationName
```

---

## Post-Migration Checklist

- ✅ All 6 tables created
- ✅ Indexes created
- ✅ Foreign keys configured
- ✅ Seed data loaded (11 materials, 6 labor services)
- ✅ Health check passes: `curl http://localhost:5000/health`
- ✅ API responds: `curl http://localhost:5000/api/v1/materials`

---

## Migration Status

**Current Status:** Migration files need to be generated  
**Action Required:** Run `dotnet ef migrations add InitialCreate`  
**Next Step:** Run `dotnet ef database update`

---

## Quick Start (TL;DR)

```bash
# 1. Navigate to service
cd backend/src/services/CatalogService

# 2. Create migration
dotnet ef migrations add InitialCreate

# 3. Apply to database
dotnet ef database update

# 4. Verify
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/materials
```

**Time Required:** 2-3 minutes

---

**Last Updated:** January 11, 2026  
**Status:** Ready to run migration
