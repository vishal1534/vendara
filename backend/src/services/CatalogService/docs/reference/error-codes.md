---
title: Error Codes - Catalog Service
service: Catalog Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Error Codes Reference - Catalog Service

**Service:** Catalog Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete reference of all HTTP status codes and RealServ-specific error codes with solutions.

---

## HTTP Status Codes

### 2xx Success

| Code | Name | Description |
|------|------|-------------|
| **200** | OK | Request successful (GET, PUT, PATCH, DELETE) |
| **201** | Created | Resource created successfully (POST) |

---

### 4xx Client Errors

| Code | Name | Description | Solution |
|------|------|-------------|----------|
| **400** | Bad Request | Invalid request parameters or body | Check request syntax and required fields |
| **401** | Unauthorized | Missing or invalid authentication token | Include `Authorization: Bearer <token>` header |
| **403** | Forbidden | Insufficient permissions for this operation | Ensure user has admin/vendor role |
| **404** | Not Found | Resource does not exist | Verify ID exists in database |
| **409** | Conflict | Duplicate resource (e.g., SKU already exists) | Use unique SKU or update existing resource |
| **422** | Unprocessable Entity | Request validation failed | Fix validation errors listed in response |
| **429** | Too Many Requests | Rate limit exceeded | Wait until reset time in `X-RateLimit-Reset` header |

---

### 5xx Server Errors

| Code | Name | Description | Solution |
|------|------|-------------|----------|
| **500** | Internal Server Error | Unexpected server error | Check logs, contact support if persistent |
| **503** | Service Unavailable | Service temporarily down | Retry with exponential backoff |

---

## RealServ Error Codes

### Validation Errors (400, 422)

| Error Code | Message | Solution |
|------------|---------|----------|
| `VALIDATION_ERROR` | Request validation failed | Check `errors` array in response |
| `REQUIRED_FIELD_MISSING` | Required field is missing | Include all required fields |
| `INVALID_PRICE` | Price must be greater than 0 | Set positive price value |
| `INVALID_QUANTITY` | Quantity must be greater than 0 | Set positive quantity |
| `INVALID_SKU_FORMAT` | SKU format is invalid | Use alphanumeric with hyphens (e.g., CEM-OPC53) |
| `INVALID_UUID` | Invalid UUID format | Use valid UUID format |
| `INVALID_ENUM_VALUE` | Invalid enum value | Check allowed values (e.g., skillLevel: 1, 2, or 3) |

**Example Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "BasePrice must be greater than 0",
    "Unit is required and cannot be empty"
  ]
}
```

---

### Not Found Errors (404)

| Error Code | Message | Solution |
|------------|---------|----------|
| `MATERIAL_NOT_FOUND` | Material not found | Verify material ID exists |
| `CATEGORY_NOT_FOUND` | Category not found | Verify category ID exists |
| `LABOR_CATEGORY_NOT_FOUND` | Labor service not found | Verify labor category ID exists |
| `INVENTORY_NOT_FOUND` | Inventory item not found | Verify inventory ID exists |
| `VENDOR_LABOR_NOT_FOUND` | Vendor labor service not found | Verify vendor labor ID exists |

**Example Response:**
```json
{
  "success": false,
  "message": "Material with ID '123e4567-e89b-12d3-a456-426614174000' not found"
}
```

---

### Conflict Errors (409)

| Error Code | Message | Solution |
|------------|---------|----------|
| `DUPLICATE_SKU` | Material with this SKU already exists | Use unique SKU or update existing material |
| `DUPLICATE_INVENTORY` | Vendor already has this material in inventory | Update existing inventory instead |
| `DUPLICATE_VENDOR_LABOR` | Vendor already offers this labor service | Update existing labor service |
| `CATEGORY_HAS_MATERIALS` | Cannot delete category with existing materials | Remove/reassign materials first |

**Example Response:**
```json
{
  "success": false,
  "message": "Material with SKU 'CEM-OPC53' already exists",
  "conflictingResourceId": "existing-uuid"
}
```

---

### Authorization Errors (401, 403)

| Error Code | Message | Solution |
|------------|---------|----------|
| `UNAUTHORIZED` | Authentication token missing or invalid | Include valid Bearer token |
| `TOKEN_EXPIRED` | Authentication token has expired | Refresh token via Identity Service |
| `FORBIDDEN` | Insufficient permissions | Ensure user has required role (admin/vendor) |
| `VENDOR_ACCESS_DENIED` | Cannot access another vendor's data | Only access own vendor data |

**Example Response:**
```json
{
  "success": false,
  "message": "Cannot update inventory for another vendor",
  "requiredRole": "Admin or matching VendorId"
}
```

---

### Database Errors (500)

| Error Code | Message | Solution |
|------------|---------|----------|
| `DATABASE_ERROR` | Database operation failed | Check database connectivity |
| `FOREIGN_KEY_VIOLATION` | Referenced resource does not exist | Ensure foreign key exists |
| `UNIQUE_CONSTRAINT_VIOLATION` | Duplicate value in unique field | Use unique value |

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "errorCode": "SPECIFIC_ERROR_CODE",
  "timestamp": "2026-01-11T12:00:00Z"
}
```

---

## Common Scenarios

### Scenario 1: Creating Material with Invalid Data

**Request:**
```bash
curl -X POST "http://localhost:5000/api/v1/materials" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "", "basePrice": -10}'
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "CategoryId is required",
    "BasePrice must be greater than 0",
    "Unit is required"
  ]
}
```

**Solution:** Include all required fields with valid values.

---

### Scenario 2: Duplicate SKU

**Request:**
```bash
curl -X POST "http://localhost:5000/api/v1/materials" \
  -d '{"sku": "CEM-OPC53", ...}'
```

**Response (409):**
```json
{
  "success": false,
  "message": "Material with SKU 'CEM-OPC53' already exists",
  "errorCode": "DUPLICATE_SKU",
  "conflictingResourceId": "existing-mat-uuid"
}
```

**Solution:** Use a different SKU or update the existing material.

---

### Scenario 3: Unauthorized Access

**Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/vendor-inventory/vendor/{vendorId}"
```

**Response (401):**
```json
{
  "success": false,
  "message": "Authentication required",
  "errorCode": "UNAUTHORIZED"
}
```

**Solution:** Include `Authorization: Bearer <token>` header.

---

### Scenario 4: Vendor Accessing Another Vendor's Data

**Request:**
```bash
curl -X PUT "http://localhost:5000/api/v1/vendor-inventory/{other-vendor-inventory-id}" \
  -H "Authorization: Bearer VENDOR_TOKEN"
```

**Response (403):**
```json
{
  "success": false,
  "message": "Cannot update inventory for another vendor",
  "errorCode": "VENDOR_ACCESS_DENIED"
}
```

**Solution:** Only access your own vendor data or use admin credentials.

---

## Rate Limiting

**Limit:** 1000 requests per hour per API key

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 2026-01-11T13:00:00Z
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please retry after 2026-01-11T13:00:00Z",
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "retryAfter": "2026-01-11T13:00:00Z"
}
```

---

## Troubleshooting Tips

1. **Check response status code first** - Indicates general error category
2. **Read error message** - Provides human-readable description
3. **Check errors array** - Lists specific validation failures
4. **Verify authentication** - Ensure token is valid and not expired
5. **Check permissions** - Ensure user has required role
6. **Validate input** - Ensure all required fields are present and valid
7. **Check logs** - Review CloudWatch logs for detailed error traces

---

**Last Updated:** January 11, 2026  
**Total Error Codes:** 25+
