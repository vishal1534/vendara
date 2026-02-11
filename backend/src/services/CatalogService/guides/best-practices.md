---
title: Best Practices - Catalog Service
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Best Practices - Catalog Service

**Service:** Catalog Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026

> **Quick Summary:** Production tips, performance optimization, and best practices for the Catalog Service.

---

## API Usage

### Use Pagination
Always use `page` and `pageSize` parameters for list endpoints:

```bash
# Good
curl "http://localhost:5000/api/v1/materials?page=1&pageSize=20"

# Bad (returns all records, slow)
curl "http://localhost:5000/api/v1/materials"
```

### Filter Early
Apply filters to reduce dataset size:

```bash
# Good: Filter by category + active status
curl "http://localhost:5000/api/v1/materials?categoryId=cement-id&isActive=true"

# Bad: Fetch all, filter client-side
curl "http://localhost:5000/api/v1/materials"  # Then filter in code
```

### Use Search Endpoints
For complex queries, use dedicated search endpoints:

```bash
# Advanced search with multiple filters
curl "http://localhost:5000/api/v1/search/materials?searchTerm=cement&minPrice=400&maxPrice=500&brand=UltraTech&sortBy=BasePrice"
```

---

## Performance

### Caching Strategy
- **Cache catalog data**: Materials and categories change infrequently
- **TTL**: 15-30 minutes for materials, 1 hour for categories
- **Invalidate on updates**: Clear cache when admin updates catalog

**Example (Redis):**
```csharp
var cacheKey = $"materials:category:{categoryId}";
var cached = await cache.GetStringAsync(cacheKey);

if (cached != null)
    return JsonSerializer.Deserialize<List<Material>>(cached);

var materials = await repository.GetByCategoryAsync(categoryId);
await cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(materials), 
    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15) });
```

### Database Indexes
The service uses indexes on:
- `materials.category_id` (frequent joins)
- `materials.name` (search queries)
- `materials.sku` (lookups)
- `vendor_inventories.vendor_id` (vendor queries)
- `price_histories.item_id` (history lookups)

**Monitor slow queries** using PostgreSQL's `pg_stat_statements`.

---

## Data Integrity

### SKU Uniqueness
Ensure SKUs are unique across materials:

```csharp
// Before creating material
var exists = await repository.ExistsBySkuAsync(sku);
if (exists)
    throw new ConflictException($"Material with SKU '{sku}' already exists");
```

### Price Validation
Validate prices before updates:

```csharp
if (newPrice <= 0)
    throw new ValidationException("Price must be greater than 0");

if (newPrice > basePrice * 2)
    logger.LogWarning($"Price {newPrice} is more than 2x base price {basePrice}");
```

### Stock Threshold Logic
Set realistic stock alert thresholds:

```csharp
// Good: 10-15% of average stock
stockAlertThreshold = averageStockQuantity * 0.15;

// Bad: Fixed threshold for all materials
stockAlertThreshold = 50;  // Doesn't scale
```

---

## Security

### Authentication
- **Public endpoints**: `/materials`, `/categories`, `/search/*`, `/stats/*`
- **Admin-only**: `POST`, `PUT`, `DELETE` on catalog data
- **Vendor**: Inventory and labor management for own data only

### Authorization Checks
```csharp
// Vendors can only update their own inventory
if (inventory.VendorId != currentUser.VendorId && !currentUser.IsAdmin)
    throw new ForbiddenException("Cannot update another vendor's inventory");
```

### Input Validation
Always validate user input:

```csharp
if (string.IsNullOrWhiteSpace(material.Name))
    throw new ValidationException("Material name is required");

if (material.BasePrice < 0)
    throw new ValidationException("Price cannot be negative");

if (material.Unit.Length > 20)
    throw new ValidationException("Unit exceeds maximum length");
```

---

## Error Handling

### Use Appropriate HTTP Status Codes
- `200 OK`: Successful GET, PUT, PATCH, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Duplicate resource (e.g., SKU exists)
- `500 Internal Server Error`: Unexpected errors

### Provide Helpful Error Messages
```json
// Good
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "BasePrice must be greater than 0",
    "Unit is required and must not exceed 20 characters"
  ]
}

// Bad
{
  "error": "Invalid request"
}
```

---

## Monitoring

### Key Metrics to Track
1. **API Response Time**: < 200ms for GET, < 500ms for POST/PUT
2. **Database Query Time**: < 100ms average
3. **Error Rate**: < 1% of total requests
4. **Cache Hit Rate**: > 70% for materials/categories

### CloudWatch Metrics
```csharp
// Log important operations
logger.LogInformation("Material created: {MaterialId}, Name: {Name}, Price: {Price}", 
    material.Id, material.Name, material.BasePrice);

// Track performance
using var timer = new StopwatchMetric("MaterialRepository.GetByIdAsync");
var material = await repository.GetByIdAsync(id);
```

### Health Checks
- Database connectivity
- Dependency availability
- Response time benchmarks

---

## Deployment

### Database Migrations
Always run migrations in sequence:

```bash
# Development
dotnet ef database update

# Production (with backup)
pg_dump realserv_catalog_db > backup_$(date +%Y%m%d).sql
dotnet ef database update --context CatalogServiceDbContext
```

### Environment Variables
Use environment-specific configurations:

```bash
# Development
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__CatalogServiceDb="Host=localhost;Database=catalog_db;..."

# Production
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__CatalogServiceDb="Host=prod-rds.amazonaws.com;Database=catalog_db;..."
```

### Zero-Downtime Deployment
1. Deploy new version alongside old (blue-green)
2. Run health checks
3. Gradually shift traffic
4. Monitor error rates
5. Rollback if issues detected

---

## Testing

### Unit Tests
Test business logic in repositories and services:

```csharp
[Fact]
public async Task CreateMaterial_ValidInput_ReturnsCreatedMaterial()
{
    // Arrange
    var material = new Material { Name = "Test Material", BasePrice = 100 };
    
    // Act
    var result = await repository.CreateAsync(material);
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal("Test Material", result.Name);
}
```

### Integration Tests
Test API endpoints:

```csharp
[Fact]
public async Task GetMaterials_ReturnsSuccessStatusCode()
{
    var response = await client.GetAsync("/api/v1/materials");
    response.EnsureSuccessStatusCode();
}
```

### Load Testing
Use tools like Apache JMeter or k6:

```javascript
// k6 load test
import http from 'k6/http';

export default function () {
  http.get('http://localhost:5000/api/v1/materials');
}

// Run: k6 run --vus 100 --duration 30s load-test.js
```

---

## Recommended Tools

- **API Testing**: Postman, Swagger UI
- **Database**: pgAdmin, DBeaver
- **Monitoring**: CloudWatch, Grafana
- **Load Testing**: k6, Apache JMeter
- **Logging**: Serilog, Seq

---

**Last Updated:** January 11, 2026
