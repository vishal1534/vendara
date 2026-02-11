# Order Service - Quick Start Guide

Get the Order Service running in 5 minutes!

---

## Prerequisites

✅ .NET 8 SDK installed  
✅ PostgreSQL 16 running  
✅ Git repository cloned

---

## Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE realserv_order_db;

# Exit
\q
```

---

## Step 2: Configure Connection String

Edit `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "OrderServiceDb": "Host=localhost;Database=realserv_order_db;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

---

## Step 3: Navigate to Project

```bash
cd backend/src/services/OrderService
```

---

## Step 4: Restore Dependencies

```bash
dotnet restore
```

---

## Step 5: Run Database Migrations

```bash
dotnet ef database update
```

This creates:
- ✅ 7 tables (orders, order_items, order_labors, delivery_addresses, payments, deliveries, order_status_histories)
- ✅ 20+ indexes
- ✅ 5 seed orders with realistic data

---

## Step 6: Start the Service

```bash
dotnet run
```

**Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
      Now listening on: https://localhost:5001
Application started. Press Ctrl+C to shut down.
```

---

## Step 7: Verify Health

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "Healthy",
  "database": "Connected"
}
```

---

## Step 8: Access Swagger UI

Open in browser:

```
http://localhost:5000/swagger
```

You'll see all 27 API endpoints documented interactively!

---

## Step 9: Test API Endpoints

### Get All Orders

```bash
curl http://localhost:5000/api/v1/orders
```

**Expected:** 5 seed orders

---

### Get Order by ID

```bash
curl http://localhost:5000/api/v1/orders/00000001-0000-0000-0000-000000000001
```

**Expected:** Completed order for ₹28,660 (cement delivery)

---

### Get Customer Orders

```bash
curl http://localhost:5000/api/v1/customers/c0000000-0000-0000-0000-000000000001/orders
```

**Expected:** Customer's order history

---

### Get Vendor Statistics

```bash
curl http://localhost:5000/api/v1/vendors/v0000000-0000-0000-0000-000000000001/orders/stats
```

**Expected:** Vendor performance metrics

---

### Get Daily Summary

```bash
curl http://localhost:5000/api/v1/reports/orders/daily-summary
```

**Expected:** Today's order summary

---

## Step 10: Create a Test Order

```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "c0000000-0000-0000-0000-000000000001",
    "vendorId": "v0000000-0000-0000-0000-000000000001",
    "orderType": "Material",
    "deliveryAddressId": "a0000000-0000-0000-0000-000000000001",
    "items": [
      {
        "materialId": "33333333-3333-3333-3333-333333333301",
        "vendorInventoryId": "00000000-0000-0000-0000-000000000001",
        "quantity": 10
      }
    ],
    "paymentMethod": "Online",
    "deliveryMethod": "HomeDelivery",
    "customerNotes": "Test order"
  }'
```

**Expected:** Order created with status `Pending`

---

## Common Issues

### Issue: Database connection failed

**Solution:** Check PostgreSQL is running:
```bash
pg_isready
```

---

### Issue: Migration failed

**Solution:** Drop and recreate database:
```bash
psql -U postgres -c "DROP DATABASE realserv_order_db;"
psql -U postgres -c "CREATE DATABASE realserv_order_db;"
dotnet ef database update
```

---

### Issue: Port 5000 already in use

**Solution:** Change port in `launchSettings.json` or use different port:
```bash
dotnet run --urls="http://localhost:5050"
```

---

## Next Steps

✅ **Explore API** - Use Swagger UI to test all endpoints  
✅ **Read Documentation** - See `README.md` and `API_ENDPOINTS.md`  
✅ **View Seed Data** - Check `/Data/Seeds/SeedData.cs`  
✅ **Customize** - Modify entities, add features  
✅ **Integrate** - Connect with Catalog and Identity services

---

## Development Workflow

### 1. Make Code Changes

Edit controllers, repositories, or entities

### 2. Create Migration (if DB schema changed)

```bash
dotnet ef migrations add YourMigrationName
```

### 3. Apply Migration

```bash
dotnet ef database update
```

### 4. Run Tests

```bash
dotnet test
```

### 5. Check Logs

Logs output to console with Serilog formatting

---

## Useful Commands

```bash
# Watch mode (auto-restart on changes)
dotnet watch run

# Build only
dotnet build

# Clean build
dotnet clean && dotnet build

# List migrations
dotnet ef migrations list

# Remove last migration
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script

# View database tables
psql -U postgres -d realserv_order_db -c "\dt"
```

---

## Seed Data Overview

**5 Orders:**
1. Completed cement order (₹28,660)
2. In-progress labor booking (₹9,600)
3. Combined order - TMT bars + sand + labor (₹53,990)
4. Pending bricks order (₹14,560)
5. Dispatched sand order (₹10,230)

**3 Delivery Addresses:**
- Hitech City site
- Gachibowli residential
- Manikonda villa

**Sample Customer IDs:**
- `c0000000-0000-0000-0000-000000000001`
- `c0000000-0000-0000-0000-000000000002`
- `c0000000-0000-0000-0000-000000000003`

**Sample Vendor IDs:**
- `v0000000-0000-0000-0000-000000000001`
- `v0000000-0000-0000-0000-000000000002`

---

## Production Checklist

Before deploying to production:

- [ ] Update connection string to AWS RDS
- [ ] Configure CloudWatch credentials
- [ ] Set up HTTPS certificates
- [ ] Configure CORS policies
- [ ] Enable authentication middleware
- [ ] Set up connection pooling
- [ ] Configure health check monitoring
- [ ] Set up database backups
- [ ] Review and adjust timeouts
- [ ] Load test the service

---

**Time to Complete:** ~5 minutes  
**Difficulty:** Easy  
**Support:** See README.md for full documentation

---

**Last Updated:** January 11, 2026
