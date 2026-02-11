# Postman Collection

Postman collection with all 47 Catalog Service endpoints.

## Import

1. Open Postman
2. Click **Import**
3. Select `CatalogService.postman_collection.json`
4. Select `RealServ-Dev.postman_environment.json`

## Setup

1. Select "RealServ-Dev" environment
2. Set variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: Your JWT token (optional for public endpoints)

## Run

1. Expand "Catalog Service" collection
2. Navigate to desired folder (Materials, Categories, Search, etc.)
3. Click on endpoint
4. Click "Send"

## Test All Endpoints

1. Click collection (top level)
2. Click "Run"
3. Select all requests
4. Click "Run Catalog Service"

## Folders

- **Categories** - 5 endpoints
- **Materials** - 5 endpoints
- **Labor Categories** - 5 endpoints
- **Vendor Inventory** - 10 endpoints
- **Vendor Labor** - 7 endpoints
- **Search** - 3 endpoints
- **Statistics** - 6 endpoints
- **Bulk Operations** - 5 endpoints
- **Health** - 1 endpoint

**Total:** 47 endpoints

---

**Last Updated:** January 11, 2026
