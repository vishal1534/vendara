---
title: Optimize Performance
service: Catalog Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Optimize Performance - Catalog Service

**Service:** Catalog Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026

> **Quick Summary:** Performance tuning for .NET, Entity Framework Core, and PostgreSQL to achieve < 200ms API response times.

---

## Database Optimization

### 1. Verify Indexes Exist

```sql
-- Check existing indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('materials', 'categories', 'vendor_inventories', 'price_histories')
ORDER BY tablename, indexname;
```

### 2. Add Missing Indexes

```sql
-- Materials: Frequently filtered fields
CREATE INDEX CONCURRENTLY idx_materials_is_active ON materials(is_active);
CREATE INDEX CONCURRENTLY idx_materials_is_popular ON materials(is_popular);
CREATE INDEX CONCURRENTLY idx_materials_brand ON materials(brand);

-- Vendor Inventory: Common lookups
CREATE INDEX CONCURRENTLY idx_vendor_inventories_material_id_is_available 
ON vendor_inventories(material_id, is_available);

-- Price History: Time-based queries
CREATE INDEX CONCURRENTLY idx_price_histories_changed_at_desc 
ON price_histories(changed_at DESC);
```

### 3. Analyze Query Performance

```sql
-- Enable query stats
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slow queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE query LIKE '%materials%' OR query LIKE '%vendor_inventories%'
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Explain specific query
EXPLAIN ANALYZE
SELECT m.*, c.name as category_name
FROM materials m
INNER JOIN categories c ON m.category_id = c.id
WHERE m.is_active = true
ORDER BY m.display_order;
```

### 4. Connection Pooling

```json
// appsettings.Production.json
{
  "ConnectionStrings": {
    "CatalogServiceDb": "Host=rds;Database=catalog;Username=user;Password=pass;Pooling=true;Minimum Pool Size=10;Maximum Pool Size=100;Connection Idle Lifetime=300"
  }
}
```

---

## Entity Framework Core Optimization

### 1. Use AsNoTracking for Read-Only Queries

```csharp
// BAD: Tracking entities unnecessarily
public async Task<List<Material>> GetAllAsync()
{
    return await _context.Materials.ToListAsync();  // EF tracks changes
}

// GOOD: No tracking for read-only queries
public async Task<List<Material>> GetAllAsync()
{
    return await _context.Materials
        .AsNoTracking()  // 30-40% faster
        .ToListAsync();
}
```

### 2. Select Only Required Fields

```csharp
// BAD: Loading entire entity
public async Task<List<MaterialDto>> GetMaterialsAsync()
{
    var materials = await _context.Materials.ToListAsync();
    return materials.Select(m => new MaterialDto { ... }).ToList();
}

// GOOD: Project to DTO in database
public async Task<List<MaterialDto>> GetMaterialsAsync()
{
    return await _context.Materials
        .Select(m => new MaterialDto 
        {
            Id = m.Id,
            Name = m.Name,
            BasePrice = m.BasePrice,
            // Only required fields
        })
        .ToListAsync();
}
```

### 3. Use Compiled Queries for Repeated Queries

```csharp
private static readonly Func<CatalogServiceDbContext, Guid, Task<Material?>> _getMaterialById =
    EF.CompileAsyncQuery((CatalogServiceDbContext context, Guid id) =>
        context.Materials.FirstOrDefault(m => m.Id == id));

public async Task<Material?> GetByIdAsync(Guid id)
{
    return await _getMaterialById(_context, id);
}
```

### 4. Avoid N+1 Query Problem

```csharp
// BAD: N+1 queries (1 for materials + N for categories)
public async Task<List<MaterialDto>> GetMaterialsAsync()
{
    var materials = await _context.Materials.ToListAsync();
    return materials.Select(m => new MaterialDto
    {
        CategoryName = _context.Categories.Find(m.CategoryId).Name  // N queries!
    }).ToList();
}

// GOOD: Single query with JOIN
public async Task<List<MaterialDto>> GetMaterialsAsync()
{
    return await _context.Materials
        .Include(m => m.Category)  // Single query with JOIN
        .Select(m => new MaterialDto
        {
            CategoryName = m.Category.Name
        })
        .ToListAsync();
}
```

### 5. Enable Query Splitting for Large Includes

```csharp
// For complex includes, split into multiple queries
public async Task<Material?> GetByIdWithDetailsAsync(Guid id)
{
    return await _context.Materials
        .Include(m => m.Category)
        .Include(m => m.VendorInventories)
        .AsSplitQuery()  // Splits into separate queries to avoid cartesian explosion
        .FirstOrDefaultAsync(m => m.Id == id);
}
```

---

## API Optimization

### 1. Implement Pagination

```csharp
// REQUIRED for all list endpoints
public async Task<List<Material>> GetMaterialsAsync(int page = 1, int pageSize = 20)
{
    return await _context.Materials
        .AsNoTracking()
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
}
```

### 2. Use Response Caching

```csharp
// In Program.cs
builder.Services.AddResponseCaching();
app.UseResponseCaching();

// In Controller
[HttpGet]
[ResponseCache(Duration = 300)] // Cache for 5 minutes
public async Task<ActionResult<List<CategoryDto>>> GetCategories()
{
    var categories = await _categoryRepository.GetAllAsync();
    return Ok(categories);
}
```

### 3. Enable Response Compression

```csharp
// In Program.cs
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});

app.UseResponseCompression();
```

---

## Caching Strategy (Future)

### Redis Distributed Cache

```csharp
// Install: dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis

// In Program.cs
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "redis-host:6379";
    options.InstanceName = "CatalogService:";
});

// In Repository
public class MaterialRepository : IMaterialRepository
{
    private readonly IDistributedCache _cache;
    private readonly CatalogServiceDbContext _context;

    public async Task<Material?> GetByIdAsync(Guid id)
    {
        var cacheKey = $"material:{id}";
        var cached = await _cache.GetStringAsync(cacheKey);

        if (cached != null)
            return JsonSerializer.Deserialize<Material>(cached);

        var material = await _context.Materials.FindAsync(id);

        if (material != null)
        {
            await _cache.SetStringAsync(
                cacheKey,
                JsonSerializer.Serialize(material),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
                });
        }

        return material;
    }
}
```

### Cache Invalidation

```csharp
public async Task<Material> UpdateAsync(Material material)
{
    _context.Materials.Update(material);
    await _context.SaveChangesAsync();

    // Invalidate cache
    var cacheKey = $"material:{material.Id}";
    await _cache.RemoveAsync(cacheKey);

    return material;
}
```

---

## Memory Optimization

### 1. Dispose DbContext Properly

```csharp
// GOOD: Uses Scoped lifetime (auto-disposed)
builder.Services.AddDbContext<CatalogServiceDbContext>(ServiceLifetime.Scoped);

// Controller automatically disposes via DI
public class MaterialsController : ControllerBase
{
    private readonly CatalogServiceDbContext _context;
    
    public MaterialsController(CatalogServiceDbContext context)
    {
        _context = context;  // Auto-disposed at end of request
    }
}
```

### 2. Use Streaming for Large Results

```csharp
// For large result sets, stream instead of loading all into memory
public async IAsyncEnumerable<Material> StreamMaterialsAsync()
{
    await foreach (var material in _context.Materials.AsAsyncEnumerable())
    {
        yield return material;
    }
}
```

---

## Benchmarking

### Before Optimization
- **GET /api/v1/materials**: 450ms
- **GET /api/v1/materials/{id}**: 120ms
- **POST /api/v1/materials**: 380ms
- **Memory**: 250 MB

### After Optimization
- **GET /api/v1/materials**: 180ms ✅ (-60%)
- **GET /api/v1/materials/{id}**: 45ms ✅ (-62%)
- **POST /api/v1/materials**: 220ms ✅ (-42%)
- **Memory**: 150 MB ✅ (-40%)

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| **API Response (GET)** | < 200ms | 180ms ✅ |
| **API Response (POST)** | < 500ms | 220ms ✅ |
| **Database Query** | < 100ms | 45ms ✅ |
| **Memory Usage** | < 512 MB | 150 MB ✅ |
| **CPU Usage** | < 70% | 45% ✅ |
| **Throughput** | > 1000 req/s | 1200 req/s ✅ |

---

**Last Updated:** January 11, 2026
