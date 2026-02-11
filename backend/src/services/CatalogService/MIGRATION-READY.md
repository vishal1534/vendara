# ✅ Catalog Service - Migration Ready

**Date:** January 11, 2026  
**Status:** **Ready to Run Database Migration**  
**Service:** Catalog Service

---

## 📋 Migration Status

| Component | Status | Location |
|-----------|--------|----------|
| **SQL Migration Script** | ✅ Ready | `/Migrations/001_InitialCreate.sql` |
| **Bash Run Script** | ✅ Ready | `/Migrations/run-migration.sh` |
| **Rollback Script** | ✅ Ready | `/Migrations/rollback.sql` |
| **Instructions** | ✅ Ready | `/Migrations/MIGRATION_INSTRUCTIONS.md` |
| **Migration README** | ✅ Ready | `/Migrations/README.md` |

---

## 🚀 Run Migration Now

### Method 1: Automated Bash Script (Easiest)

```bash
cd backend/src/services/CatalogService/Migrations
chmod +x run-migration.sh
./run-migration.sh
```

**Time Required:** 1-2 minutes  
**Output:** Creates 6 tables + loads 27 seed records

---

### Method 2: Direct SQL (Manual)

```bash
cd backend/src/services/CatalogService/Migrations

# Create database if not exists
psql -h localhost -U postgres -c "CREATE DATABASE realserv_catalog_db;"

# Run migration
psql -h localhost -U postgres -d realserv_catalog_db -f 001_InitialCreate.sql
```

---

### Method 3: Using EF Core CLI (Developer)

```bash
cd backend/src/services/CatalogService

# Install EF Core tools (if not installed)
dotnet tool install --global dotnet-ef

# Create migration from code
dotnet ef migrations add InitialCreate

# Apply to database
dotnet ef database update
```

---

## ✅ What Will Be Created

### Database Schema

**6 Tables:**
1. ✅ `categories` - Material and labor categories
2. ✅ `materials` - Construction materials catalog
3. ✅ `labor_categories` - Skilled labor services
4. ✅ `vendor_inventories` - Vendor-specific inventory
5. ✅ `vendor_labor_availabilities` - Vendor labor offerings
6. ✅ `price_histories` - Price change audit trail

### Seed Data

**10 Categories:**
- Material: Cement, Bricks, Steel & Iron, Sand & Aggregates, Paints & Putty
- Labor: Masonry, Carpentry, Electrical, Plumbing, Painting

**11 Materials:**
- OPC 53 Grade Cement (₹440/bag)
- PPC Cement (₹400/bag)
- Red Clay Bricks (₹8.50/piece)
- Fly Ash Bricks (₹7/piece)
- TMT Bar 12mm (₹55/kg)
- TMT Bar 16mm (₹54.50/kg)
- River Sand (₹45/cft)
- M-Sand (₹40/cft)
- 20mm Aggregates (₹50/cft)
- Emulsion Paint (₹385/liter)
- Wall Putty (₹22/kg)

**6 Labor Services:**
- Skilled Mason (₹75/hour, ₹600/day)
- Mason Helper (₹40/hour, ₹320/day)
- Skilled Carpenter (₹80/hour, ₹640/day)
- Licensed Electrician (₹85/hour, ₹680/day)
- Skilled Plumber (₹80/hour, ₹640/day)
- Skilled Painter (₹70/hour, ₹560/day)

---

## 🔍 Verification Steps

After running migration:

### Step 1: Check Tables Created

```bash
psql -h localhost -U postgres -d realserv_catalog_db -c "\dt"
```

**Expected Output:**
```
              List of relations
 Schema |            Name             | Type  |  Owner   
--------+-----------------------------+-------+----------
 public | categories                  | table | postgres
 public | labor_categories            | table | postgres
 public | materials                   | table | postgres
 public | price_histories             | table | postgres
 public | vendor_inventories          | table | postgres
 public | vendor_labor_availabilities | table | postgres
```

---

### Step 2: Check Seed Data

```bash
# Categories
psql -h localhost -U postgres -d realserv_catalog_db -c "SELECT COUNT(*) FROM categories;"
# Expected: 10

# Materials
psql -h localhost -U postgres -d realserv_catalog_db -c "SELECT COUNT(*) FROM materials;"
# Expected: 11

# Labor Services
psql -h localhost -U postgres -d realserv_catalog_db -c "SELECT COUNT(*) FROM labor_categories;"
# Expected: 6
```

---

### Step 3: Test Service

```bash
# Start the service
cd backend/src/services/CatalogService
dotnet run

# In another terminal, test health
curl http://localhost:5000/health
# Expected: {"status":"Healthy","database":"Connected"}

# Test API
curl http://localhost:5000/api/v1/materials | jq '.data | length'
# Expected: 11
```

---

## 🔄 Rollback (Development Only)

If you need to start over:

```bash
cd backend/src/services/CatalogService/Migrations
psql -h localhost -U postgres -d realserv_catalog_db -f rollback.sql
```

**⚠️ WARNING:** This deletes ALL data. Never use in production.

---

## 📝 Migration Files

### `001_InitialCreate.sql` (Main Migration)
- Complete SQL script
- Creates all 6 tables
- Adds indexes
- Loads seed data
- **Lines:** ~260
- **Safe to run multiple times** (uses IF NOT EXISTS)

### `run-migration.sh` (Automated Script)
- Checks PostgreSQL connectivity
- Creates database if needed
- Runs migration
- Verifies tables and seed data
- Shows summary

### `rollback.sql` (Cleanup Script)
- Drops all tables
- Development/testing only

---

## 🎯 Next Steps After Migration

1. ✅ **Migration Complete** - Database ready
2. ✅ **Start Service** - `dotnet run`
3. ✅ **Test APIs** - Use Postman or cURL
4. ✅ **View Swagger** - http://localhost:5000/swagger
5. ⏭️ **Move to Order Service** - Begin next microservice

---

## 📊 Migration Summary

| Item | Count |
|------|-------|
| **Tables** | 6 |
| **Indexes** | 20+ |
| **Foreign Keys** | 6 |
| **Unique Constraints** | 2 |
| **Categories** | 10 |
| **Materials** | 11 |
| **Labor Services** | 6 |
| **Total Seed Records** | 27 |

---

## 🏗️ Production Deployment

For production (AWS RDS):

```bash
# Set environment variables
export DB_HOST=prod-rds.amazonaws.com
export DB_NAME=realserv_catalog_db_prod
export DB_USER=admin
export DB_PASSWORD=your-secure-password

# Run migration
./run-migration.sh

# Or use psql directly with SSL
psql "postgresql://admin:password@prod-rds.amazonaws.com:5432/realserv_catalog_db_prod?sslmode=require" \
  -f 001_InitialCreate.sql
```

---

## ✅ Pre-Migration Checklist

- ✅ PostgreSQL 16 installed and running
- ✅ Database user has CREATE TABLE permissions
- ✅ Connection string configured in `appsettings.Development.json`
- ✅ .NET 8 SDK installed (for `dotnet run`)
- ✅ Port 5432 accessible (PostgreSQL)
- ✅ Port 5000 available (Catalog Service)

---

## 🎉 Ready to Proceed

**Current State:** ✅ **All migration files created and ready**  
**Action:** Run migration using any of the 3 methods above  
**Time Required:** 1-2 minutes  
**Next Service:** Order Service implementation

---

**Created:** January 11, 2026  
**Status:** 🟢 Ready to Run  
**Estimated Time:** 2 minutes  
**Risk Level:** Low (safe to run multiple times)
