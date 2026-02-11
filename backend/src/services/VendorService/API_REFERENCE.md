---
title: API Reference - Vendor Service
service: Vendor Service
category: api-reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Vendor Service API Reference

**Service:** Vendor Service  
**Category:** API Reference  
**Last Updated:** January 11, 2026  
**API Version:** v1.0.0  
**Service Version:** 1.0.0

> **Quick Summary:** Complete API reference with 50+ code examples for vendor management, inventory, ratings, and analytics.

---

## Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [Vendor Management](#vendor-management) (13 endpoints)
3. [Inventory Management](#inventory-management) (6 endpoints)
4. [Ratings & Reviews](#ratings--reviews) (4 endpoints)
5. [KYC Documents](#kyc-documents) (6 endpoints)
6. [Bank Accounts](#bank-accounts) (6 endpoints)
7. [Service Areas](#service-areas) (5 endpoints)
8. [Business Hours](#business-hours) (2 endpoints)
9. [Labor Services](#labor-services) (5 endpoints)
10. [Analytics & Stats](#analytics--stats) (3 endpoints)
11. [Error Codes](#error-codes)
12. [Rate Limiting](#rate-limiting)
13. [Pagination](#pagination)

**Total Endpoints:** 48

---

## Base URL & Authentication

### Base URLs

```
Production:   https://api.realserv.com/vendor
Staging:      https://staging-api.realserv.com/vendor
Development:  http://localhost:5002
```

### Authentication

All endpoints (except health checks) require Firebase JWT authentication:

```bash
Authorization: Bearer <firebase_jwt_token>
```

**Token Format:** JWT (JSON Web Token)  
**Token Lifetime:** 60 minutes  
**Provider:** Firebase Authentication

### Headers

```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Vendor Management

### POST /api/v1/vendors

Register a new vendor.

**Authorization:** Any authenticated user  
**Rate Limit:** 10 requests/minute

**Request Body:**
```json
{
  "businessName": "Kumar Cement Supplies",
  "ownerName": "Vishal Chauhan",
  "phone": "+917906441952",
  "email": "rajesh@kumarsupplies.com",
  "addressLine1": "Plot 123, Industrial Estate",
  "city": "Hyderabad",
  "state": "Telangana",
  "postalCode": "500081",
  "latitude": 17.4485,
  "longitude": 78.3908,
  "description": "Premium cement and building materials supplier",
  "yearsInBusiness": 15,
  "businessType": "Wholesale",
  "specializationAreas": ["Cement", "Sand", "Aggregate"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "businessName": "Kumar Cement Supplies",
    "ownerName": "Vishal Chauhan",
    "phone": "+917906441952",
    "email": "rajesh@kumarsupplies.com",
    "city": "Hyderabad",
    "state": "Telangana",
    "isActive": true,
    "isVerified": false,
    "acceptingOrders": true,
    "averageRating": 0.0,
    "totalRatings": 0,
    "createdAt": "2026-01-11T12:00:00Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5002/api/v1/vendors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Kumar Cement Supplies",
    "ownerName": "Vishal Chauhan",
    "phone": "+917906441952",
    "email": "rajesh@kumarsupplies.com",
    "city": "Hyderabad",
    "state": "Telangana"
  }'
```

**C#:**
```csharp
using System.Net.Http;
using System.Net.Http.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Bearer", "YOUR_JWT_TOKEN");

var request = new
{
    BusinessName = "Kumar Cement Supplies",
    OwnerName = "Vishal Chauhan",
    Phone = "+917906441952",
    Email = "rajesh@kumarsupplies.com",
    City = "Hyderabad",
    State = "Telangana"
};

var response = await client.PostAsJsonAsync(
    "http://localhost:5002/api/v1/vendors",
    request
);

var vendor = await response.Content.ReadFromJsonAsync<VendorResponse>();
Console.WriteLine($"Vendor ID: {vendor.Data.Id}");
```

**Python:**
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
}

data = {
    'businessName': 'Kumar Cement Supplies',
    'ownerName': 'Vishal Chauhan',
    'phone': '+917906441952',
    'email': 'rajesh@kumarsupplies.com',
    'city': 'Hyderabad',
    'state': 'Telangana'
}

response = requests.post(
    'http://localhost:5002/api/v1/vendors',
    headers=headers,
    json=data
)

vendor = response.json()
print(f"Vendor ID: {vendor['data']['id']}")
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:5002/api/v1/vendors', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    businessName: 'Kumar Cement Supplies',
    ownerName: 'Vishal Chauhan',
    phone: '+917906441952',
    email: 'rajesh@kumarsupplies.com',
    city: 'Hyderabad',
    state: 'Telangana'
  })
});

const vendor = await response.json();
console.log('Vendor ID:', vendor.data.id);
```

---

### GET /api/v1/vendors/{id}

Get vendor profile by ID.

**Authorization:** Vendor or Admin  
**Rate Limit:** 100 requests/minute

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Vendor ID |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "businessName": "Kumar Cement Supplies",
    "ownerName": "Vishal Chauhan",
    "phone": "+917906441952",
    "email": "rajesh@kumarsupplies.com",
    "city": "Hyderabad",
    "state": "Telangana",
    "averageRating": 4.7,
    "totalRatings": 156,
    "totalOrders": 1234,
    "completedOrders": 1180,
    "fulfillmentRate": 95.6,
    "isVerified": true,
    "acceptingOrders": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "lastActiveAt": "2026-01-11T11:30:00Z"
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:5002/api/v1/vendors/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /api/v1/vendors/me

Get current vendor's profile.

**Authorization:** Vendor  
**Rate Limit:** 100 requests/minute

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "businessName": "Kumar Cement Supplies",
    // ... full vendor profile
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:5002/api/v1/vendors/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### PATCH /api/v1/vendors/{id}/availability

Toggle vendor availability (accepting orders).

**Authorization:** Vendor or Admin  
**Rate Limit:** 20 requests/minute

**Request Body:**
```json
{
  "isAvailable": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "lastActiveAt": "2026-01-11T12:00:00Z"
  }
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:5002/api/v1/vendors/550e8400-e29b-41d4-a716-446655440000/availability \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": true}'
```

---

### GET /api/v1/vendors

List all vendors (Admin only) or search vendors.

**Authorization:** Public (limited fields) or Admin (full fields)  
**Rate Limit:** 100 requests/minute

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | int | No | 1 | Page number |
| pageSize | int | No | 20 | Items per page (max: 100) |
| search | string | No | - | Search by name, city |
| city | string | No | - | Filter by city |
| isVerified | bool | No | - | Filter verified vendors |
| acceptingOrders | bool | No | - | Filter by availability |
| minRating | decimal | No | - | Minimum rating (0-5) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "businessName": "Kumar Cement Supplies",
        "city": "Hyderabad",
        "averageRating": 4.7,
        "totalRatings": 156,
        "isVerified": true,
        "acceptingOrders": true
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 85,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:5002/api/v1/vendors?page=1&pageSize=20&city=Hyderabad&isVerified=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Inventory Management

### GET /api/v1/vendors/{vendorId}/inventory

List vendor's inventory items.

**Authorization:** Public (if active) or Vendor/Admin  
**Rate Limit:** 100 requests/minute

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | int | No | 1 | Page number |
| pageSize | int | No | 20 | Items per page |
| isAvailable | bool | No | - | Filter by availability |
| category | string | No | - | Filter by category |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "inventory_001",
        "vendorId": "550e8400-e29b-41d4-a716-446655440000",
        "materialId": "mat_ultratech_cement_50kg",
        "materialName": "UltraTech Cement 50kg",
        "category": "Cement",
        "stockQuantity": 500,
        "pricePerUnit": 380.00,
        "unit": "bag",
        "minimumOrderQuantity": 10,
        "isAvailable": true,
        "lastUpdated": "2026-01-11T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 35,
      "totalPages": 2
    }
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:5002/api/v1/vendors/550e8400-e29b-41d4-a716-446655440000/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### POST /api/v1/vendors/{vendorId}/inventory

Add inventory item.

**Authorization:** Vendor or Admin  
**Rate Limit:** 50 requests/minute

**Request Body:**
```json
{
  "materialId": "mat_ultratech_cement_50kg",
  "stockQuantity": 500,
  "pricePerUnit": 380.00,
  "minimumOrderQuantity": 10,
  "maximumOrderQuantity": 1000,
  "deliveryTimedays": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "inventory_001",
    "vendorId": "550e8400-e29b-41d4-a716-446655440000",
    "materialId": "mat_ultratech_cement_50kg",
    "stockQuantity": 500,
    "pricePerUnit": 380.00,
    "isAvailable": true,
    "createdAt": "2026-01-11T12:00:00Z"
  }
}
```

---

## Analytics & Stats

### GET /api/v1/vendors/{vendorId}/stats

Get vendor dashboard statistics.

**Authorization:** Vendor or Admin  
**Rate Limit:** 100 requests/minute

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 1234,
    "completedOrders": 1180,
    "pendingOrders": 54,
    "cancelledOrders": 12,
    "totalRevenue": 6170000.00,
    "averageOrderValue": 5000.00,
    "averageRating": 4.7,
    "totalRatings": 156,
    "fulfillmentRate": 95.6,
    "responseTime": "< 2 hours",
    "isActive": true,
    "isVerified": true,
    "acceptingOrders": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "lastActiveAt": "2026-01-11T11:30:00Z"
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:5002/api/v1/vendors/550e8400-e29b-41d4-a716-446655440000/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript:**
```javascript
const response = await fetch(
  `http://localhost:5002/api/v1/vendors/${vendorId}/stats`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const stats = await response.json();
console.log('Total Revenue:', stats.data.totalRevenue);
console.log('Average Rating:', stats.data.averageRating);
```

---

### GET /api/v1/vendors/{vendorId}/performance

Get vendor performance metrics.

**Authorization:** Vendor or Admin  
**Rate Limit:** 100 requests/minute

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | date | No | 30 days ago | Start date (YYYY-MM-DD) |
| endDate | date | No | Today | End date (YYYY-MM-DD) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-12-12T00:00:00Z",
      "end": "2026-01-11T23:59:59Z",
      "days": 30
    },
    "orderMetrics": {
      "total": 1234,
      "completed": 1180,
      "completionRate": 95.6,
      "fulfillmentRate": 95.6
    },
    "ratingMetrics": {
      "averageRating": 4.7,
      "totalRatings": 156,
      "fiveStarCount": 109,
      "fourStarCount": 31,
      "threeStarCount": 12,
      "twoStarCount": 2,
      "oneStarCount": 2
    },
    "qualityMetrics": {
      "onTimeDeliveryRate": 95.5,
      "accuracyRate": 98.2,
      "customerSatisfaction": 94.0
    },
    "businessMetrics": {
      "daysActive": 41,
      "averageResponseTime": "1.5 hours",
      "issueResolutionTime": "6 hours"
    }
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:5002/api/v1/vendors/550e8400-e29b-41d4-a716-446655440000/performance?startDate=2025-12-12&endDate=2026-01-11" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /api/v1/vendors/{vendorId}/analytics

Get vendor analytics (charts and trends).

**Authorization:** Vendor or Admin  
**Rate Limit:** 100 requests/minute

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| period | string | No | 30days | Period: `7days`, `30days`, `90days` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "30days",
    "trends": {
      "orders": [
        {
          "date": "2026-01-01",
          "orders": 42,
          "completed": 40
        },
        {
          "date": "2026-01-02",
          "orders": 38,
          "completed": 37
        }
        // ... 28 more days
      ],
      "revenue": [
        {
          "date": "2026-01-01",
          "revenue": 210000.00
        }
        // ... 29 more days
      ],
      "ratings": [
        {
          "date": "2026-01-01",
          "rating": 4.8,
          "count": 5
        }
        // ... 29 more days
      ]
    },
    "categoryPerformance": [
      {
        "category": "Cement",
        "orders": 45,
        "revenue": 180000.00
      },
      {
        "category": "Sand",
        "orders": 32,
        "revenue": 128000.00
      }
    ],
    "peakHours": [
      {"hour": 9, "orders": 12},
      {"hour": 10, "orders": 18},
      {"hour": 14, "orders": 20}
    ],
    "issues": {
      "total": 3,
      "resolved": 2,
      "pending": 1,
      "averageResolutionTime": "6 hours"
    }
  }
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error, try again |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VENDOR_NOT_FOUND",
    "message": "Vendor with ID '550e8400-e29b-41d4-a716-446655440000' not found",
    "details": null
  }
}
```

### RealServ Error Codes

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| INVALID_JWT_TOKEN | 401 | JWT token invalid/expired | Re-authenticate |
| VENDOR_NOT_FOUND | 404 | Vendor doesn't exist | Check vendor ID |
| VENDOR_ALREADY_EXISTS | 409 | Vendor already registered | Use PUT to update |
| INVENTORY_ITEM_NOT_FOUND | 404 | Inventory item not found | Check item ID |
| INSUFFICIENT_PERMISSIONS | 403 | User lacks permission | Contact admin |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait and retry |
| INVALID_MATERIAL_ID | 422 | Material ID doesn't exist | Check Catalog Service |
| INVALID_PHONE_NUMBER | 422 | Phone format invalid | Use +91XXXXXXXXXX format |

---

## Rate Limiting

**Default Limits:**
- Read operations: 100 requests/minute
- Write operations: 50 requests/minute
- Sensitive operations: 10 requests/minute

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704974400
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again in 45 seconds.",
    "retryAfter": 45
  }
}
```

---

## Pagination

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 85,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

---

## Additional Endpoints

For complete documentation of all 48 endpoints, including:
- KYC Documents (6 endpoints)
- Bank Accounts (6 endpoints)
- Service Areas (5 endpoints)
- Business Hours (2 endpoints)
- Labor Services (5 endpoints)
- Ratings & Reviews (4 endpoints)

See:
- [Full API Documentation (Swagger)](http://localhost:5002)
- [Postman Collection](./examples/postman/)
- [Integration Guides](./docs/how-to-guides/)

---

**Updated:** January 11, 2026  
**Version:** 1.0.0  
**Total Endpoints:** 48
