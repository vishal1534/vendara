# RealServ Catalog Service - Complete API Endpoints

## 📖 Overview
**Service**: Catalog Service  
**Base URL**: `/api/v1`  
**Version**: 1.0  
**Total Endpoints**: 47 endpoints

---

## 🏗️ Categories (5 endpoints)
**Base**: `/api/v1/categories`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all categories | ❌ |
| GET | `/{id}` | Get category by ID | ❌ |
| POST | `/` | Create category | ✅ |
| PUT | `/{id}` | Update category | ✅ |
| DELETE | `/{id}` | Delete category | ✅ |

---

## 🧱 Materials (5 endpoints)
**Base**: `/api/v1/materials`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all materials | ❌ |
| GET | `/{id}` | Get material by ID | ❌ |
| POST | `/` | Create material | ✅ |
| PUT | `/{id}` | Update material | ✅ |
| DELETE | `/{id}` | Delete material | ✅ |

---

## 👷 Labor Categories (5 endpoints)
**Base**: `/api/v1/labor-categories`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all labor services | ❌ |
| GET | `/{id}` | Get labor service by ID | ❌ |
| POST | `/` | Create labor service | ✅ |
| PUT | `/{id}` | Update labor service | ✅ |
| DELETE | `/{id}` | Delete labor service | ✅ |

---

## 📦 Vendor Inventory (10 endpoints)
**Base**: `/api/v1/vendor-inventory`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/vendor/{vendorId}` | Get vendor's inventory | ✅ |
| GET | `/vendor/{vendorId}/low-stock` | Get low stock items | ✅ |
| GET | `/{id}` | Get inventory item | ✅ |
| POST | `/` | Add material to inventory | ✅ |
| PUT | `/{id}` | Update inventory item | ✅ |
| DELETE | `/{id}` | Remove from inventory | ✅ |
| PATCH | `/{id}/toggle-availability` | Toggle availability | ✅ |
| PATCH | `/{id}/restock` | Update stock quantity | ✅ |
| PATCH | `/{id}/alert-threshold` | Set stock alert threshold | ✅ |

---

## 👨‍🔧 Vendor Labor (7 endpoints)
**Base**: `/api/v1/vendor-labor`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/vendor/{vendorId}` | Get vendor's labor services | ✅ |
| GET | `/{id}` | Get labor service | ✅ |
| POST | `/` | Add labor service | ✅ |
| PUT | `/{id}` | Update labor service | ✅ |
| DELETE | `/{id}` | Remove labor service | ✅ |
| PATCH | `/{id}/toggle-availability` | Toggle availability | ✅ |
| PATCH | `/{id}/workers` | Update worker count | ✅ |

---

## 📊 Catalog Statistics (6 endpoints)
**Base**: `/api/v1/catalog/stats`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Overall catalog statistics | ❌ |
| GET | `/categories` | Category statistics | ❌ |
| GET | `/materials/{id}/with-stats` | Material with vendor stats | ❌ |
| GET | `/labor/{id}/with-stats` | Labor with vendor stats | ❌ |
| GET | `/materials/popular` | Popular materials | ❌ |
| GET | `/labor/popular` | Popular labor services | ❌ |

---

## 🔍 Advanced Search (3 endpoints)
**Base**: `/api/v1/search`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/materials` | Advanced material search | ❌ |
| GET | `/labor-categories` | Advanced labor search | ❌ |
| GET | `/global` | Global search (materials + labor) | ❌ |

### Material Search Query Parameters:
- `searchTerm` - Text search
- `categoryId` - Filter by category
- `minPrice`, `maxPrice` - Price range
- `brand` - Filter by brand
- `isActive`, `isPopular` - Status filters
- `tags` - Comma-separated tags
- `page`, `pageSize` - Pagination
- `sortBy` - name | price | displayOrder
- `sortOrder` - asc | desc

### Labor Category Search Query Parameters:
- `searchTerm` - Text search
- `categoryId` - Filter by category
- `minHourlyRate`, `maxHourlyRate` - Hourly rate range
- `minDailyRate`, `maxDailyRate` - Daily rate range
- `skillLevel` - Filter by skill level
- `isActive`, `isPopular` - Status filters
- `certificationRequired` - Certification filter
- `tags` - Comma-separated tags
- `page`, `pageSize` - Pagination
- `sortBy` - name | hourlyRate | dailyRate | displayOrder
- `sortOrder` - asc | desc

---

## 🔄 Bulk Operations (5 endpoints)
**Base**: `/api/v1/bulk`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/materials/toggle-status` | Bulk activate/deactivate | ✅ |
| POST | `/materials/update-prices` | Bulk update prices | ✅ |
| POST | `/materials/delete` | Bulk delete materials | ✅ |
| POST | `/materials/toggle-popular` | Bulk toggle popular flag | ✅ |
| POST | `/labor-categories/toggle-status` | Bulk activate/deactivate labor | ✅ |

### Bulk Toggle Request:
```json
{
  "ids": ["guid1", "guid2", "guid3"],
  "isActive": true
}
```

### Bulk Update Prices Request:
```json
{
  "priceUpdates": [
    { "id": "guid1", "newPrice": 450 },
    { "id": "guid2", "newPrice": 400 }
  ]
}
```

---

## ❤️ Health Check (1 endpoint)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Service health status | ❌ |

---

## 📋 Summary by Category

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| Categories | 5 | 3 (POST/PUT/DELETE) |
| Materials | 5 | 3 (POST/PUT/DELETE) |
| Labor Categories | 5 | 3 (POST/PUT/DELETE) |
| Vendor Inventory | 10 | All 10 |
| Vendor Labor | 7 | All 7 |
| Catalog Stats | 6 | None |
| Advanced Search | 3 | None |
| Bulk Operations | 5 | All 5 |
| Health Check | 1 | None |
| **TOTAL** | **47** | **31 require auth** |

---

## 🔐 Authentication

Endpoints marked with ✅ require Firebase authentication via the `FirebaseAuthenticationFilter`.

**Header**: `Authorization: Bearer <firebase_token>`

---

## 📨 Standard Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

## 🎯 API Versioning Headers

All responses include these headers:
- `X-API-Version: 1.0` - Current API version
- `X-Service-Name: RealServ Catalog Service` - Service name
- `X-Response-Time-Ms: 45.23` - Response time

Clients can send `X-API-Version` header to request specific version.

---

## 🗄️ Database Entities

1. **Category** - Material and labor categories
2. **Material** - Construction materials catalog
3. **LaborCategory** - Labor services catalog
4. **VendorInventory** - Vendor's material inventory
5. **VendorLaborAvailability** - Vendor's labor offerings
6. **PriceHistory** - Price change tracking (future)

---

## 🚀 Quick Start Examples

### 1. Get All Materials
```http
GET /api/v1/materials
```

### 2. Search Materials by Price
```http
GET /api/v1/search/materials?minPrice=100&maxPrice=500&page=1&pageSize=20
```

### 3. Get Vendor Inventory
```http
GET /api/v1/vendor-inventory/vendor/{vendorId}
Authorization: Bearer <token>
```

### 4. Bulk Activate Materials
```http
POST /api/v1/bulk/materials/toggle-status
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["guid1", "guid2"],
  "isActive": true
}
```

### 5. Get Low Stock Items
```http
GET /api/v1/vendor-inventory/vendor/{vendorId}/low-stock
Authorization: Bearer <token>
```

---

## 📚 Swagger Documentation

Access interactive API documentation at:
- **Development**: `http://localhost:5000/swagger`
- **Production**: `https://api.realserv.com/catalog/swagger`

---

**Last Updated**: January 2026  
**API Version**: 1.0  
**Service Status**: Production Ready ✅
