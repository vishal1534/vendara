---
title: Getting Started with Catalog Service
service: Catalog Service
category: tutorial
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Getting Started Tutorial - Catalog Service

**Service:** Catalog Service  
**Category:** Tutorial  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete beginner tutorial covering setup, creating materials, managing inventory, and testing the Catalog Service.

---

## Prerequisites

- ✅ Completed [QUICKSTART.md](../QUICKSTART.md) (5-minute setup)
- ✅ Service running on http://localhost:5000
- ✅ PostgreSQL database with seed data loaded
- ✅ API testing tool (Postman, cURL, or Swagger UI)

---

## Step 1: Verify Service is Running

**Test Health Check:**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "Healthy",
  "service": "CatalogService",
  "database": "Connected"
}
```

✅ **Success!** Your service is running.

---

## Step 2: Explore the Seed Data

The service comes pre-loaded with realistic Hyderabad construction data.

### View All Material Categories

```bash
curl "http://localhost:5000/api/v1/categories?type=1"
```

**You'll see 5 categories:**
1. Cement
2. Bricks
3. Steel & Iron
4. Sand & Aggregates
5. Paints & Putty

### View All Materials

```bash
curl "http://localhost:5000/api/v1/materials"
```

**You'll see 11 materials** including:
- OPC 53 Grade Cement (₹440/bag)
- PPC Cement (₹400/bag)
- Red Clay Bricks (₹8.50/piece)
- TMT Bar 12mm (₹55/kg)
- And more...

### View Labor Categories

```bash
curl "http://localhost:5000/api/v1/labor-categories"
```

**You'll see 6 labor services:**
- Skilled Mason (₹75/hour, ₹600/day)
- Mason Helper (₹40/hour, ₹320/day)
- Skilled Carpenter (₹80/hour, ₹640/day)
- And more...

---

## Step 3: Create Your First Material (Admin)

**Note:** This requires admin authentication. For testing, use Swagger UI or skip to Step 4 for public endpoints.

### Open Swagger UI

Navigate to: http://localhost:5000/swagger

### Create a New Material

1. Find `POST /api/v1/materials`
2. Click "Try it out"
3. Use this request body:

```json
{
  "categoryId": "cement-category-id",
  "name": "PPC Cement Premium",
  "description": "Premium Portland Pozzolana Cement",
  "sku": "CEM-PPC-PREM",
  "basePrice": 420.00,
  "unit": "bag (50kg)",
  "minOrderQuantity": 10,
  "brand": "Ambuja",
  "specifications": "PPC Grade, 50kg bag, Premium Quality",
  "hsnCode": "2523",
  "gstPercentage": 28,
  "isActive": true,
  "isPopular": false
}
```

4. Execute

**Success Response:**
```json
{
  "success": true,
  "message": "Material created successfully",
  "data": {
    "id": "new-uuid",
    "name": "PPC Cement Premium",
    "basePrice": 420.00
  }
}
```

---

## Step 4: Search for Materials

**Search by term:**
```bash
curl "http://localhost:5000/api/v1/search/materials?searchTerm=cement"
```

**Search with price range:**
```bash
curl "http://localhost:5000/api/v1/search/materials?minPrice=400&maxPrice=500&sortBy=BasePrice&sortOrder=Asc"
```

**Search by brand:**
```bash
curl "http://localhost:5000/api/v1/search/materials?brand=UltraTech"
```

---

## Step 5: Get Catalog Statistics

```bash
curl "http://localhost:5000/api/v1/catalog/stats"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCategories": 10,
    "totalMaterials": 11,
    "totalLaborServices": 6,
    "activeMaterials": 11,
    "activeLaborServices": 6
  }
}
```

---

## Step 6: Vendor Operations (Advanced)

### Add Material to Vendor Inventory

**Endpoint:** `POST /api/v1/vendor-inventory`

```json
{
  "vendorId": "your-vendor-id",
  "materialId": "cement-material-id",
  "isAvailable": true,
  "vendorPrice": 435.00,
  "stockQuantity": 500,
  "minOrderQuantity": 10,
  "stockAlertThreshold": 50,
  "leadTimeDays": 2
}
```

### View Vendor Inventory

```bash
curl "http://localhost:5000/api/v1/vendor-inventory/vendor/{vendorId}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Low Stock Items

```bash
curl "http://localhost:5000/api/v1/vendor-inventory/vendor/{vendorId}/low-stock" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Step 7: Test with Postman

1. Download the [Postman Collection](../examples/postman/CatalogService.postman_collection.json)
2. Import into Postman
3. Set environment variable `baseUrl` to `http://localhost:5000`
4. Run collection tests

---

## Common Workflows

### Workflow 1: Add New Construction Material

1. **Get category list** → `GET /api/v1/categories?type=1`
2. **Create material** → `POST /api/v1/materials`
3. **Verify creation** → `GET /api/v1/materials/{id}`
4. **Search for it** → `GET /api/v1/search/materials?searchTerm=...`

### Workflow 2: Vendor Adds Inventory

1. **Browse available materials** → `GET /api/v1/materials`
2. **Add to inventory** → `POST /api/v1/vendor-inventory`
3. **Set stock alerts** → `PATCH /api/v1/vendor-inventory/{id}/alert-threshold`
4. **Monitor low stock** → `GET /api/v1/vendor-inventory/vendor/{vendorId}/low-stock`

### Workflow 3: Buyer Searches for Materials

1. **Search materials** → `GET /api/v1/search/materials?searchTerm=cement&minPrice=0&maxPrice=500`
2. **Filter by category** → `GET /api/v1/materials?categoryId={id}`
3. **Get popular items** → `GET /api/v1/catalog/stats/materials/popular`
4. **View material details** → `GET /api/v1/materials/{id}`

---

## Next Steps

Now that you're familiar with the basics:

1. **[Material Catalog Guide](./material-catalog.md)** - Deep dive into material management
2. **[Labor Catalog Guide](./labor-catalog.md)** - Manage labor services
3. **[Pricing & Inventory Guide](./pricing-inventory.md)** - Advanced inventory management
4. **[API Reference](../API_REFERENCE.md)** - Complete API documentation
5. **[Deploy to Production](../docs/how-to-guides/deploy-to-production.md)** - Production deployment

---

## Troubleshooting

**Issue: "Database not connected"**
- Solution: Check PostgreSQL is running → `docker ps | grep postgres`

**Issue: "Category not found" when creating material**
- Solution: Get valid category IDs first → `GET /api/v1/categories`

**Issue: "Unauthorized" on protected endpoints**
- Solution: Add `Authorization: Bearer YOUR_TOKEN` header

**Issue: "Validation failed" on material creation**
- Solution: Ensure all required fields are present (categoryId, name, basePrice, unit)

---

**Estimated Time:** 20-30 minutes  
**Difficulty:** Beginner  
**Last Updated:** January 11, 2026
