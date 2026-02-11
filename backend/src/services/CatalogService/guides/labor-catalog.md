---
title: Labor Catalog Management
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Labor Catalog Management Guide

**Service:** Catalog Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026

> **Quick Summary:** Guide to creating and managing skilled labor services in the RealServ catalog.

---

## Creating Labor Services

### Create Labor Service

**Endpoint:** `POST /api/v1/labor-categories`  
**Auth:** Admin required

**Example: Create Skilled Mason**
```bash
curl -X POST "http://localhost:5000/api/v1/labor-categories" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "masonry-cat-id",
    "name": "Skilled Mason",
    "description": "Expert masonry work for residential and commercial projects",
    "baseHourlyRate": 75.00,
    "baseDailyRate": 600.00,
    "skillLevel": 2,
    "minimumExperienceYears": 3,
    "certificationRequired": false,
    "isActive": true,
    "isPopular": true
  }'
```

### Labor Service Fields

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| categoryId | UUID | Yes | "uuid..." | Parent category |
| name | string | Yes | "Skilled Mason" | Service name |
| description | string | No | "Expert masonry..." | Description |
| baseHourlyRate | decimal | Yes | 75.00 | Rate per hour (₹) |
| baseDailyRate | decimal | Yes | 600.00 | Rate per 8-hour day (₹) |
| skillLevel | integer | Yes | 1, 2, 3 | 1=Helper, 2=Skilled, 3=Expert |
| minimumExperienceYears | integer | No | 3 | Required experience |
| certificationRequired | boolean | No | false | Certification needed |
| isActive | boolean | No | true | Active status |
| isPopular | boolean | No | true | Featured service |

---

## Skill Levels

| Level | Name | Description | Typical Rates |
|-------|------|-------------|---------------|
| 1 | Helper | Entry-level assistant | ₹30-50/hour |
| 2 | Skilled | Experienced worker | ₹60-100/hour |
| 3 | Expert | Master craftsman | ₹100-150/hour |

---

## Rate Calculation

**Standard:** 8-hour workday

```
dailyRate = hourlyRate × 8
```

**Example:**
- Hourly: ₹75/hour
- Daily: ₹600/day (75 × 8)

---

## Querying Labor Services

### Get All Labor Services

```bash
curl "http://localhost:5000/api/v1/labor-categories"
```

### Filter by Skill Level

```bash
curl "http://localhost:5000/api/v1/labor-categories?skillLevel=2"
```

### Search Labor Services

```bash
curl "http://localhost:5000/api/v1/search/labor?searchTerm=mason&skillLevel=2&minHourlyRate=70&maxHourlyRate=100"
```

---

## Hyderabad Labor Market Rates (2026)

| Service | Skill Level | Hourly Rate | Daily Rate |
|---------|-------------|-------------|------------|
| Mason | Skilled | ₹75 | ₹600 |
| Mason Helper | Helper | ₹40 | ₹320 |
| Carpenter | Skilled | ₹80 | ₹640 |
| Electrician | Skilled | ₹85 | ₹680 |
| Plumber | Skilled | ₹80 | ₹640 |
| Painter | Skilled | ₹70 | ₹560 |

---

**See Also:**
- [API Reference](../API_REFERENCE.md)
- [Vendor Labor Management](./pricing-inventory.md#vendor-labor)
