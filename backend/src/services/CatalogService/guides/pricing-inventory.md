---
title: Pricing & Inventory Management
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Pricing & Inventory Management Guide

**Service:** Catalog Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026

> **Quick Summary:** Manage vendor-specific pricing, stock levels, and availability for materials and labor services.

---

## Vendor Inventory (Materials)

### Add Material to Inventory

**Endpoint:** `POST /api/v1/vendor-inventory`  
**Auth:** Vendor or Admin

```bash
curl -X POST "http://localhost:5000/api/v1/vendor-inventory" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "vendor-uuid",
    "materialId": "mat-uuid",
    "isAvailable": true,
    "vendorPrice": 435.00,
    "stockQuantity": 500,
    "minOrderQuantity": 10,
    "stockAlertThreshold": 50,
    "leadTimeDays": 2
  }'
```

### Update Stock Quantity

**Endpoint:** `PATCH /api/v1/vendor-inventory/{id}/restock`

```bash
curl -X PATCH "http://localhost:5000/api/v1/vendor-inventory/{id}/restock" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"stockQuantity": 1000}'
```

### Set Stock Alert Threshold

```bash
curl -X PATCH "http://localhost:5000/api/v1/vendor-inventory/{id}/alert-threshold" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"stockAlertThreshold": 100}'
```

### Check Low Stock Items

```bash
curl "http://localhost:5000/api/v1/vendor-inventory/vendor/{vendorId}/low-stock" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Retrieved 3 low stock items",
  "data": [
    {
      "id": "inv-uuid",
      "materialName": "OPC 53 Grade Cement",
      "stockQuantity": 45,
      "stockAlertThreshold": 50,
      "status": "Low Stock"
    }
  ]
}
```

---

## Vendor Labor Availability

### Add Labor Service

**Endpoint:** `POST /api/v1/vendor-labor`

```bash
curl -X POST "http://localhost:5000/api/v1/vendor-labor" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "vendorId": "vendor-uuid",
    "laborCategoryId": "labor-uuid",
    "isAvailable": true,
    "hourlyRate": 80.00,
    "dailyRate": 640.00,
    "availableWorkers": 5,
    "minBookingHours": 4
  }'
```

### Update Worker Count

```bash
curl -X PATCH "http://localhost:5000/api/v1/vendor-labor/{id}/workers" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"availableWorkers": 8}'
```

### Toggle Availability

```bash
curl -X PATCH "http://localhost:5000/api/v1/vendor-labor/{id}/toggle-availability" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Price History Tracking

All price changes are automatically tracked in the `price_histories` table.

**Price Update Example:**
```bash
curl -X PUT "http://localhost:5000/api/v1/materials/{id}" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "basePrice": 450.00
  }'
```

**Automatically Creates History Record:**
```json
{
  "itemType": 1,
  "itemId": "mat-uuid",
  "itemName": "OPC 53 Grade Cement",
  "oldPrice": 440.00,
  "newPrice": 450.00,
  "priceChange": 10.00,
  "percentageChange": 2.27,
  "priceType": "BasePrice",
  "changedAt": "2026-01-11T14:00:00Z"
}
```

---

## Best Practices

### Stock Management
1. **Set realistic stock alerts**: Threshold = 10-15% of average inventory
2. **Update stock regularly**: Daily or real-time via restock endpoint
3. **Lead time accuracy**: Accurate lead times improve buyer satisfaction
4. **Min order quantities**: Align with actual vendor capabilities

### Pricing Strategy
1. **Competitive pricing**: Monitor base prices, adjust vendor prices accordingly
2. **Bulk discounts**: Lower per-unit price for larger quantities (implement in Order Service)
3. **Seasonal pricing**: Adjust prices based on demand (monsoon season, peak construction)
4. **Price history**: Review trends before making changes

### Labor Availability
1. **Worker count accuracy**: Update available workers daily
2. **Minimum booking hours**: Typically 4-8 hours minimum
3. **Skill-based pricing**: Expert workers command higher rates
4. **Seasonal availability**: Adjust during festival seasons

---

**See Also:**
- [Material Catalog Guide](./material-catalog.md)
- [Labor Catalog Guide](./labor-catalog.md)
- [Database Schema](../docs/reference/database-schema.md)
