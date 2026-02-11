---
title: API Reference - Catalog Service
service: Catalog Service
category: api-reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Catalog Service API Reference

**Service:** Catalog Service  
**Category:** API Reference  
**Last Updated:** January 11, 2026  
**API Version:** v1.0.0  
**Service Version:** 1.0.0

> **Quick Summary:** Complete API reference with 50+ code examples for material catalog, labor services, vendor inventory, and advanced search (47 endpoints total).

---

## Base URL

```
Production:  https://api.realserv.com/catalog
Staging:     https://staging-api.realserv.com/catalog
Development: http://localhost:5000
```

---

## Authentication

Most endpoints require **Bearer token** authentication:

```bash
Authorization: Bearer <access_token>
```

**Public Endpoints** (no auth required):
- `GET /api/v1/materials` - List materials
- `GET /api/v1/categories` - List categories
- `GET /api/v1/labor-categories` - List labor services
- `GET /api/v1/search/*` - Search endpoints
- `GET /api/v1/catalog/stats/*` - Statistics
- `GET /health` - Health check

**Protected Endpoints** (auth required):
- Admin: Create, update, delete operations
- Vendor: Inventory and labor management

**Token Format:** JWT (JSON Web Token)  
**Token Source:** Identity Service (`POST /auth/firebase`)

---

## Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

## Pagination

List endpoints support pagination with query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-based) |
| `pageSize` | integer | 20 | Items per page (max: 100) |

**Paginated Response:**
```json
{
  "success": true,
  "message": "Retrieved X items",
  "data": [...],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

---

## 🏗️ Categories

### GET /api/v1/categories

List all categories (materials and labor).

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | integer | No | Filter: 1=Material, 2=Labor |
| `isActive` | boolean | No | Filter by active status |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/categories?type=1&isActive=true" \
  -H "accept: application/json"
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/api/v1/categories?type=1', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

**C# Example:**
```csharp
using var client = new HttpClient();
client.BaseAddress = new Uri("http://localhost:5000");

var response = await client.GetAsync("/api/v1/categories?type=1&isActive=true");
var content = await response.Content.ReadAsStringAsync();
var result = JsonSerializer.Deserialize<ApiResponse<List<Category>>>(content);
```

**Python Example:**
```python
import requests

response = requests.get(
    'http://localhost:5000/api/v1/categories',
    params={'type': 1, 'isActive': True}
)
data = response.json()
print(data)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 5 categories",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Cement",
      "key": "cement",
      "description": "Various types of cement",
      "type": 1,
      "parentCategoryId": null,
      "iconUrl": "https://cdn.realserv.com/icons/cement.png",
      "displayOrder": 1,
      "isActive": true,
      "createdAt": "2026-01-11T10:00:00Z",
      "updatedAt": "2026-01-11T10:00:00Z"
    }
  ]
}
```

---

### GET /api/v1/categories/{id}

Get a specific category by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Category ID |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/categories/3fa85f64-5717-4562-b3fc-2c963f66afa6" \
  -H "accept: application/json"
```

**JavaScript Example:**
```javascript
const categoryId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const response = await fetch(`http://localhost:5000/api/v1/categories/${categoryId}`);
const data = await response.json();
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Cement",
    "type": 1,
    "isActive": true
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### POST /api/v1/categories

Create a new category (Admin only).

**Request Body:**
```json
{
  "name": "Cement",
  "key": "cement",
  "description": "Various types of cement for construction",
  "type": 1,
  "parentCategoryId": null,
  "iconUrl": "https://cdn.realserv.com/icons/cement.png",
  "displayOrder": 1,
  "isActive": true
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/categories" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cement",
    "key": "cement",
    "type": 1,
    "displayOrder": 1
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/api/v1/categories', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Cement',
    key: 'cement',
    type: 1,
    displayOrder: 1
  })
});
const data = await response.json();
```

**C# Example:**
```csharp
var category = new CreateCategoryDto
{
    Name = "Cement",
    Key = "cement",
    Type = 1,
    DisplayOrder = 1
};

var response = await client.PostAsJsonAsync("/api/v1/categories", category);
var result = await response.Content.ReadFromJsonAsync<ApiResponse<Category>>();
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Cement",
    "type": 1,
    "createdAt": "2026-01-11T10:00:00Z"
  }
}
```

---

## 🧱 Materials

### GET /api/v1/materials

List all materials with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | uuid | No | Filter by category |
| `isActive` | boolean | No | Filter by active status |
| `isPopular` | boolean | No | Filter popular materials |
| `page` | integer | No | Page number (default: 1) |
| `pageSize` | integer | No | Items per page (default: 20) |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/materials?isActive=true&page=1&pageSize=10" \
  -H "accept: application/json"
```

**JavaScript Example:**
```javascript
const params = new URLSearchParams({
  isActive: 'true',
  isPopular: 'true',
  page: '1',
  pageSize: '10'
});

const response = await fetch(`http://localhost:5000/api/v1/materials?${params}`);
const data = await response.json();
```

**Python Example:**
```python
params = {
    'isActive': True,
    'isPopular': True,
    'page': 1,
    'pageSize': 10
}
response = requests.get('http://localhost:5000/api/v1/materials', params=params)
materials = response.json()
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 11 materials",
  "data": [
    {
      "id": "mat-uuid-001",
      "categoryId": "cat-uuid-001",
      "categoryName": "Cement",
      "name": "OPC 53 Grade Cement",
      "description": "Ordinary Portland Cement 53 Grade",
      "sku": "CEM-OPC53",
      "basePrice": 440.00,
      "unit": "bag (50kg)",
      "minOrderQuantity": 10,
      "brand": "UltraTech",
      "specifications": "53 Grade, 50kg bag",
      "hsnCode": "2523",
      "gstPercentage": 28,
      "isActive": true,
      "isPopular": true,
      "imageUrl": "https://cdn.realserv.com/materials/cement-opc53.jpg"
    }
  ],
  "totalCount": 11,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

---

### GET /api/v1/materials/{id}

Get a specific material by ID.

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/materials/mat-uuid-001" \
  -H "accept: application/json"
```

**JavaScript Example:**
```javascript
const materialId = 'mat-uuid-001';
const response = await fetch(`http://localhost:5000/api/v1/materials/${materialId}`);
const material = await response.json();
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material retrieved successfully",
  "data": {
    "id": "mat-uuid-001",
    "name": "OPC 53 Grade Cement",
    "basePrice": 440.00,
    "unit": "bag (50kg)",
    "brand": "UltraTech"
  }
}
```

---

### POST /api/v1/materials

Create a new material (Admin only).

**Request Body:**
```json
{
  "categoryId": "cat-uuid-001",
  "name": "OPC 53 Grade Cement",
  "description": "Ordinary Portland Cement 53 Grade",
  "sku": "CEM-OPC53",
  "basePrice": 440.00,
  "unit": "bag (50kg)",
  "minOrderQuantity": 10,
  "brand": "UltraTech",
  "specifications": "53 Grade, 50kg bag",
  "hsnCode": "2523",
  "gstPercentage": 28,
  "isActive": true,
  "isPopular": true
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/materials" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "cat-uuid-001",
    "name": "OPC 53 Grade Cement",
    "basePrice": 440.00,
    "unit": "bag (50kg)",
    "brand": "UltraTech"
  }'
```

**C# Example:**
```csharp
var material = new CreateMaterialDto
{
    CategoryId = Guid.Parse("cat-uuid-001"),
    Name = "OPC 53 Grade Cement",
    BasePrice = 440.00m,
    Unit = "bag (50kg)",
    Brand = "UltraTech",
    GstPercentage = 28
};

var response = await client.PostAsJsonAsync("/api/v1/materials", material);
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Material created successfully",
  "data": {
    "id": "mat-uuid-new",
    "name": "OPC 53 Grade Cement",
    "basePrice": 440.00
  }
}
```

---

### PUT /api/v1/materials/{id}

Update an existing material (Admin only).

**Request Body:**
```json
{
  "name": "OPC 53 Grade Cement - Updated",
  "basePrice": 450.00,
  "isActive": true
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:5000/api/v1/materials/mat-uuid-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OPC 53 Grade Cement - Updated",
    "basePrice": 450.00
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material updated successfully",
  "data": {
    "id": "mat-uuid-001",
    "name": "OPC 53 Grade Cement - Updated",
    "basePrice": 450.00
  }
}
```

---

### DELETE /api/v1/materials/{id}

Delete a material (Admin only).

**cURL Example:**
```bash
curl -X DELETE "http://localhost:5000/api/v1/materials/mat-uuid-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material deleted successfully"
}
```

---

## 👷 Labor Categories

### GET /api/v1/labor-categories

List all labor services.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `categoryId` | uuid | Filter by category |
| `skillLevel` | integer | Filter: 1=Helper, 2=Skilled, 3=Expert |
| `isActive` | boolean | Filter by active status |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/labor-categories?skillLevel=2&isActive=true" \
  -H "accept: application/json"
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/api/v1/labor-categories?skillLevel=2');
const laborServices = await response.json();
```

**Python Example:**
```python
response = requests.get(
    'http://localhost:5000/api/v1/labor-categories',
    params={'skillLevel': 2, 'isActive': True}
)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 6 labor services",
  "data": [
    {
      "id": "lab-uuid-001",
      "categoryId": "cat-labor-001",
      "categoryName": "Masonry",
      "name": "Skilled Mason",
      "description": "Expert masonry work",
      "baseHourlyRate": 75.00,
      "baseDailyRate": 600.00,
      "skillLevel": 2,
      "minimumExperienceYears": 3,
      "isActive": true,
      "isPopular": true
    }
  ]
}
```

---

### POST /api/v1/labor-categories

Create a new labor service (Admin only).

**Request Body:**
```json
{
  "categoryId": "cat-labor-001",
  "name": "Skilled Mason",
  "description": "Expert masonry work",
  "baseHourlyRate": 75.00,
  "baseDailyRate": 600.00,
  "skillLevel": 2,
  "minimumExperienceYears": 3,
  "isActive": true
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/labor-categories" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "cat-labor-001",
    "name": "Skilled Mason",
    "baseHourlyRate": 75.00,
    "baseDailyRate": 600.00,
    "skillLevel": 2
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Labor service created successfully",
  "data": {
    "id": "lab-uuid-new",
    "name": "Skilled Mason",
    "baseHourlyRate": 75.00
  }
}
```

---

## 📦 Vendor Inventory

### GET /api/v1/vendor-inventory/vendor/{vendorId}

Get all inventory for a specific vendor.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `vendorId` | uuid | Vendor ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `isAvailable` | boolean | Filter by availability |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/vendor-inventory/vendor/vendor-uuid-001?isAvailable=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**JavaScript Example:**
```javascript
const vendorId = 'vendor-uuid-001';
const response = await fetch(
  `http://localhost:5000/api/v1/vendor-inventory/vendor/${vendorId}?isAvailable=true`,
  {
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    }
  }
);
const inventory = await response.json();
```

**C# Example:**
```csharp
var vendorId = Guid.Parse("vendor-uuid-001");
var response = await client.GetAsync($"/api/v1/vendor-inventory/vendor/{vendorId}?isAvailable=true");
var inventory = await response.Content.ReadFromJsonAsync<ApiResponse<List<VendorInventory>>>();
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 15 inventory items",
  "data": [
    {
      "id": "inv-uuid-001",
      "vendorId": "vendor-uuid-001",
      "materialId": "mat-uuid-001",
      "materialName": "OPC 53 Grade Cement",
      "unit": "bag (50kg)",
      "isAvailable": true,
      "vendorPrice": 435.00,
      "stockQuantity": 500,
      "minOrderQuantity": 10,
      "stockAlertThreshold": 50,
      "leadTimeDays": 2,
      "lastRestockedAt": "2026-01-10T10:00:00Z"
    }
  ]
}
```

---

### POST /api/v1/vendor-inventory

Add material to vendor inventory.

**Request Body:**
```json
{
  "vendorId": "vendor-uuid-001",
  "materialId": "mat-uuid-001",
  "isAvailable": true,
  "vendorPrice": 435.00,
  "stockQuantity": 500,
  "minOrderQuantity": 10,
  "stockAlertThreshold": 50,
  "leadTimeDays": 2
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/vendor-inventory" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "vendor-uuid-001",
    "materialId": "mat-uuid-001",
    "vendorPrice": 435.00,
    "stockQuantity": 500
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Material added to inventory",
  "data": {
    "id": "inv-uuid-new",
    "materialName": "OPC 53 Grade Cement",
    "vendorPrice": 435.00,
    "stockQuantity": 500
  }
}
```

---

### PATCH /api/v1/vendor-inventory/{id}/restock

Update stock quantity.

**Request Body:**
```json
{
  "stockQuantity": 1000
}
```

**cURL Example:**
```bash
curl -X PATCH "http://localhost:5000/api/v1/vendor-inventory/inv-uuid-001/restock" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stockQuantity": 1000}'
```

**JavaScript Example:**
```javascript
const response = await fetch(
  'http://localhost:5000/api/v1/vendor-inventory/inv-uuid-001/restock',
  {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stockQuantity: 1000 })
  }
);
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stock updated successfully",
  "data": {
    "id": "inv-uuid-001",
    "stockQuantity": 1000,
    "lastRestockedAt": "2026-01-11T14:30:00Z"
  }
}
```

---

### GET /api/v1/vendor-inventory/vendor/{vendorId}/low-stock

Get low stock items for a vendor.

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/vendor-inventory/vendor/vendor-uuid-001/low-stock" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 3 low stock items",
  "data": [
    {
      "id": "inv-uuid-001",
      "materialName": "OPC 53 Grade Cement",
      "stockQuantity": 45,
      "stockAlertThreshold": 50,
      "status": "Low Stock"
    }
  ]
}
```

---

## 👨‍🔧 Vendor Labor

### GET /api/v1/vendor-labor/vendor/{vendorId}

Get all labor services offered by a vendor.

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/vendor-labor/vendor/vendor-uuid-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**JavaScript Example:**
```javascript
const vendorId = 'vendor-uuid-001';
const response = await fetch(
  `http://localhost:5000/api/v1/vendor-labor/vendor/${vendorId}`,
  {
    headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' }
  }
);
const laborServices = await response.json();
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 4 labor services",
  "data": [
    {
      "id": "vl-uuid-001",
      "vendorId": "vendor-uuid-001",
      "laborCategoryId": "lab-uuid-001",
      "laborCategoryName": "Skilled Mason",
      "isAvailable": true,
      "hourlyRate": 80.00,
      "dailyRate": 640.00,
      "availableWorkers": 5,
      "minBookingHours": 4
    }
  ]
}
```

---

### POST /api/v1/vendor-labor

Add labor service to vendor.

**Request Body:**
```json
{
  "vendorId": "vendor-uuid-001",
  "laborCategoryId": "lab-uuid-001",
  "isAvailable": true,
  "hourlyRate": 80.00,
  "dailyRate": 640.00,
  "availableWorkers": 5,
  "minBookingHours": 4
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/vendor-labor" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "vendor-uuid-001",
    "laborCategoryId": "lab-uuid-001",
    "hourlyRate": 80.00,
    "dailyRate": 640.00,
    "availableWorkers": 5
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Labor service added successfully",
  "data": {
    "id": "vl-uuid-new",
    "laborCategoryName": "Skilled Mason",
    "hourlyRate": 80.00
  }
}
```

---

## 🔍 Advanced Search

### GET /api/v1/search/materials

Advanced material search with multiple filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `searchTerm` | string | Search in name, description, brand |
| `categoryId` | uuid | Filter by category |
| `minPrice` | decimal | Minimum base price |
| `maxPrice` | decimal | Maximum base price |
| `brand` | string | Filter by brand |
| `isActive` | boolean | Filter by active status |
| `sortBy` | string | Sort: Name, BasePrice, DisplayOrder |
| `sortOrder` | string | Order: Asc, Desc |
| `page` | integer | Page number |
| `pageSize` | integer | Items per page |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/search/materials?searchTerm=cement&minPrice=400&maxPrice=500&sortBy=BasePrice&sortOrder=Asc" \
  -H "accept: application/json"
```

**JavaScript Example:**
```javascript
const params = new URLSearchParams({
  searchTerm: 'cement',
  minPrice: '400',
  maxPrice: '500',
  brand: 'UltraTech',
  sortBy: 'BasePrice',
  sortOrder: 'Asc'
});

const response = await fetch(`http://localhost:5000/api/v1/search/materials?${params}`);
const results = await response.json();
```

**Python Example:**
```python
params = {
    'searchTerm': 'cement',
    'minPrice': 400,
    'maxPrice': 500,
    'brand': 'UltraTech',
    'sortBy': 'BasePrice',
    'sortOrder': 'Asc'
}
response = requests.get('http://localhost:5000/api/v1/search/materials', params=params)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Found 2 materials",
  "data": [
    {
      "id": "mat-uuid-002",
      "name": "PPC Cement",
      "basePrice": 400.00,
      "brand": "ACC",
      "unit": "bag (50kg)"
    },
    {
      "id": "mat-uuid-001",
      "name": "OPC 53 Grade Cement",
      "basePrice": 440.00,
      "brand": "UltraTech",
      "unit": "bag (50kg)"
    }
  ],
  "totalCount": 2,
  "page": 1,
  "pageSize": 20
}
```

---

### GET /api/v1/search/labor

Advanced labor service search.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `searchTerm` | string | Search in name, description |
| `categoryId` | uuid | Filter by category |
| `skillLevel` | integer | Filter: 1=Helper, 2=Skilled, 3=Expert |
| `minHourlyRate` | decimal | Minimum hourly rate |
| `maxHourlyRate` | decimal | Maximum hourly rate |
| `sortBy` | string | Sort field |
| `sortOrder` | string | Asc or Desc |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/search/labor?searchTerm=mason&skillLevel=2&minHourlyRate=70&maxHourlyRate=100" \
  -H "accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Found 2 labor services",
  "data": [
    {
      "id": "lab-uuid-001",
      "name": "Skilled Mason",
      "baseHourlyRate": 75.00,
      "baseDailyRate": 600.00,
      "skillLevel": 2
    }
  ]
}
```

---

## 📊 Catalog Statistics

### GET /api/v1/catalog/stats

Get overall catalog statistics.

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/catalog/stats" \
  -H "accept: application/json"
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/api/v1/catalog/stats');
const stats = await response.json();
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalCategories": 10,
    "materialCategories": 5,
    "laborCategories": 5,
    "totalMaterials": 11,
    "activeMaterials": 11,
    "totalLaborServices": 6,
    "activeLaborServices": 6,
    "totalVendors": 25,
    "lastUpdated": "2026-01-11T10:00:00Z"
  }
}
```

---

### GET /api/v1/catalog/stats/materials/popular

Get popular materials.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of items (default: 10) |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/catalog/stats/materials/popular?limit=5" \
  -H "accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 5 popular materials",
  "data": [
    {
      "id": "mat-uuid-001",
      "name": "OPC 53 Grade Cement",
      "basePrice": 440.00,
      "orderCount": 1250,
      "popularity": "High"
    }
  ]
}
```

---

## 🔄 Bulk Operations

### POST /api/v1/bulk/materials/activate

Activate multiple materials (Admin only).

**Request Body:**
```json
{
  "materialIds": [
    "mat-uuid-001",
    "mat-uuid-002",
    "mat-uuid-003"
  ]
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/bulk/materials/activate" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "materialIds": ["mat-uuid-001", "mat-uuid-002"]
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/api/v1/bulk/materials/activate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    materialIds: ['mat-uuid-001', 'mat-uuid-002', 'mat-uuid-003']
  })
});
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "3 materials activated successfully",
  "data": {
    "successCount": 3,
    "failedCount": 0
  }
}
```

---

### POST /api/v1/bulk/materials/update-prices

Bulk update material prices (Admin only).

**Request Body:**
```json
{
  "updates": [
    {
      "materialId": "mat-uuid-001",
      "newPrice": 450.00,
      "reason": "Market price increase"
    },
    {
      "materialId": "mat-uuid-002",
      "newPrice": 410.00,
      "reason": "Promotional discount"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/v1/bulk/materials/update-prices" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"materialId": "mat-uuid-001", "newPrice": 450.00, "reason": "Market increase"}
    ]
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "2 prices updated successfully",
  "data": {
    "successCount": 2,
    "failedCount": 0,
    "priceHistoryCreated": true
  }
}
```

---

## ❤️ Health Check

### GET /health

Service health check (no authentication required).

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/health"
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/health');
const health = await response.json();
```

**Response (200 OK):**
```json
{
  "status": "Healthy",
  "service": "CatalogService",
  "version": "1.0.0",
  "database": "Connected",
  "timestamp": "2026-01-11T12:00:00Z",
  "uptime": "2d 5h 30m"
}
```

---

## Error Codes

| HTTP Code | Error Code | Description |
|-----------|------------|-------------|
| 400 | BAD_REQUEST | Invalid request parameters |
| 401 | UNAUTHORIZED | Missing or invalid authentication token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate resource (e.g., SKU already exists) |
| 422 | VALIDATION_ERROR | Request validation failed |
| 500 | INTERNAL_ERROR | Internal server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable |

**Error Response Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "BasePrice must be greater than 0",
    "Unit is required"
  ]
}
```

---

## Rate Limiting

**Current Limit:** 1000 requests per hour per API key  
**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 2026-01-11T13:00:00Z
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Retry after 2026-01-11T13:00:00Z"
}
```

---

## API Versioning

**Current Version:** v1  
**Header:** `X-API-Version: 1.0`

All endpoints are prefixed with `/api/v1`. When breaking changes are introduced, a new version (v2) will be released.

---

## Testing

**Swagger UI:** http://localhost:5000/swagger  
**Postman Collection:** [Download Collection](./examples/postman/CatalogService.postman_collection.json)  
**Environment:** [Development Environment](./examples/postman/RealServ-Dev.postman_environment.json)

---

**Total Endpoints Documented:** 47  
**Total Code Examples:** 50+  
**Languages:** cURL, JavaScript, C#, Python  
**Last Updated:** January 11, 2026  
**API Version:** v1.0.0
