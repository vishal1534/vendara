# Catalog Service - Database Migrations

Database migration scripts for the Catalog Service.

---

## 📁 Files

| File | Description |
|------|-------------|
| **001_InitialCreate.sql** | Initial schema + seed data (6 tables, 10 categories, 11 materials, 6 labor) |
| **run-migration.sh** | Bash script to run migration automatically |
| **rollback.sql** | Rollback script to drop all tables |
| **MIGRATION_INSTRUCTIONS.md** | Detailed instructions for all migration methods |

---

## 🚀 Quick Start

### Option 1: Using Bash Script (Recommended)

```bash
cd Migrations
chmod +x run-migration.sh
./run-migration.sh
```

### Option 2: Direct SQL

```bash
psql -h localhost -U postgres -d realserv_catalog_db -f 001_InitialCreate.sql
```

### Option 3: Using EF Core CLI

```bash
cd ..
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## ✅ Verification

After running migration:

```bash
# Check tables created
psql -h localhost -U postgres -d realserv_catalog_db -c "\dt"

# Check seed data
psql -h localhost -U postgres -d realserv_catalog_db -c "SELECT COUNT(*) FROM materials;"
# Expected: 11

# Test API
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/materials
```

---

## 🔄 Rollback

To completely remove all tables and data:

```bash
psql -h localhost -U postgres -d realserv_catalog_db -f rollback.sql
```

**⚠️ WARNING:** This will delete ALL data. Use only in development.

---

## 📊 Schema Summary

**Tables:** 6
1. categories
2. materials
3. labor_categories
4. vendor_inventories
5. vendor_labor_availabilities
6. price_histories

**Seed Data:**
- 10 categories (5 material + 5 labor)
- 11 materials (cement, bricks, steel, sand, paint)
- 6 labor services (mason, carpenter, electrician, plumber, painter)

---

## 🔧 Configuration

Default configuration (change via environment variables):

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=realserv_catalog_db
DB_USER=postgres
DB_PASSWORD=postgres
```

**Custom configuration:**

```bash
DB_HOST=prod-rds.amazonaws.com \
DB_NAME=catalog_prod \
DB_USER=admin \
DB_PASSWORD=secret \
./run-migration.sh
```

---

## 📝 Migration History

| Version | Date | Description |
|---------|------|-------------|
| 001 | 2026-01-11 | Initial schema with 6 tables and seed data |

---

**Last Updated:** January 11, 2026  
**Status:** Ready to run
