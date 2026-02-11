---
title: Material Catalog Management
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Material Catalog Management Guide

**Service:** Catalog Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026

> **Quick Summary:** Comprehensive guide to creating, updating, and managing construction materials in the RealServ catalog.

---

## Creating Materials

### Single Material Creation

**Endpoint:** `POST /api/v1/materials`  
**Auth:** Admin required

**Example: Create Cement**
```bash
curl -X POST "http://localhost:5000/api/v1/materials" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "cement-cat-id",
    "name": "OPC 53 Grade Cement",
    "description": "Ordinary Portland Cement 53 Grade - High strength",
    "sku": "CEM-OPC53-UT",
    "basePrice": 440.00,
    "unit": "bag (50kg)",
    "minOrderQuantity": 10,
    "brand": "UltraTech",
    "specifications": "53 Grade, Compressive Strength: 53 MPa",
    "hsnCode": "2523",
    "gstPercentage": 28,
    "isActive": true,
    "isPopular": true
  }'
```

### Material Fields Reference

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| categoryId | UUID | Yes | "uuid..." | From categories table |
| name | string | Yes | "OPC 53 Grade Cement" | Display name |
| description | string | No | "High strength cement..." | Detailed description |
| sku | string | No | "CEM-OPC53-UT" | Stock keeping unit |
| basePrice | decimal | Yes | 440.00 | Platform reference price |
| unit | string | Yes | "bag (50kg)" | Unit of measurement |
| minOrderQuantity | decimal | No | 10 | Minimum order (default: 1) |
| brand | string | No | "UltraTech" | Brand name |
| specifications | string | No | "53 Grade, 50kg" | Technical specs |
| hsnCode | string | No | "2523" | HSN code for GST |
| gstPercentage | decimal | No | 28 | GST % (default: 18) |
| isActive | boolean | No | true | Active status |
| isPopular | boolean | No | true | Featured material |

---

## Updating Materials

### Update Price

```bash
curl -X PUT "http://localhost:5000/api/v1/materials/{id}" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "basePrice": 450.00
  }'
```

**Note:** Price changes are tracked in `price_histories` table.

### Update Availability

```bash
curl -X PUT "http://localhost:5000/api/v1/materials/{id}" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "isActive": false
  }'
```

---

## Querying Materials

### Get All Materials

```bash
curl "http://localhost:5000/api/v1/materials?page=1&pageSize=20"
```

### Filter by Category

```bash
curl "http://localhost:5000/api/v1/materials?categoryId={cat-id}&isActive=true"
```

### Get Popular Materials

```bash
curl "http://localhost:5000/api/v1/catalog/stats/materials/popular?limit=10"
```

---

## Bulk Operations

### Bulk Activate Materials

```bash
curl -X POST "http://localhost:5000/api/v1/bulk/materials/activate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "materialIds": ["id1", "id2", "id3"]
  }'
```

### Bulk Update Prices

```bash
curl -X POST "http://localhost:5000/api/v1/bulk/materials/update-prices" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "updates": [
      {"materialId": "id1", "newPrice": 450.00, "reason": "Market increase"},
      {"materialId": "id2", "newPrice": 410.00, "reason": "Promotional"}
    ]
  }'
```

---

## Best Practices

1. **Use meaningful SKUs**: Format `CATEGORY-TYPE-BRAND` (e.g., `CEM-OPC53-UT`)
2. **Set realistic prices**: Research current Hyderabad market prices
3. **Include specifications**: Help buyers make informed decisions
4. **Use HSN codes**: Required for GST compliance
5. **Mark popular items**: Improve buyer discovery
6. **Set min order quantities**: Align with vendor capabilities

---

**See Also:**
- [API Reference](../API_REFERENCE.md)
- [Pricing & Inventory Guide](./pricing-inventory.md)
