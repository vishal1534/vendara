---
title: Architecture Overview
service: Catalog Service
category: explanation
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: architects
---

# Architecture Overview - Catalog Service

**Service:** Catalog Service  
**Category:** Explanation  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** High-level architecture, design decisions, and technology stack for the Catalog Service microservice.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     RealServ Platform                        │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │  Buyer App   │   │  Vendor App  │   │  Admin App   │   │
│  │  (Mobile/Web)│   │  (Mobile/Web)│   │   (Web)      │   │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │   API Gateway  │                        │
│                    │  (Load Balancer)│                       │
│                    └───────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼──────┐   ┌───────▼───────┐   ┌─────▼─────┐      │
│  │  Identity   │   │   Catalog     │   │   Order   │      │
│  │  Service    │   │   Service     │   │  Service  │      │
│  └─────────────┘   └───────┬───────┘   └───────────┘      │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  PostgreSQL 16 │                        │
│                    │ (Catalog DB)   │                        │
│                    └────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         API Layer                   │  Controllers (9)
│  - HTTP Request/Response            │  - MaterialsController
│  - Authentication                   │  - CategoriesController
│  - Validation                       │  - VendorInventoryController
│  - Middleware                       │  - SearchController
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│      Business Logic Layer           │
│  - Repository Pattern               │  Repositories (7)
│  - Data validation                  │  - MaterialRepository
│  - Business rules                   │  - CategoryRepository
│  - Data transformation (DTOs)       │  - VendorInventoryRepository
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│       Data Access Layer             │
│  - Entity Framework Core 8          │  Models (6 entities)
│  - DbContext                        │  - Material
│  - Migrations                       │  - Category
│  - Seed Data                        │  - VendorInventory
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│          Database                   │
│  - PostgreSQL 16                    │  Tables (6)
│  - Snake_case naming                │  - materials
│  - UUID primary keys                │  - categories
│  - Indexes for performance          │  - vendor_inventories
└─────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | .NET | 8.0 | Application framework |
| **Language** | C# | 12 | Programming language |
| **API** | ASP.NET Core Web API | 8.0 | REST API framework |
| **ORM** | Entity Framework Core | 8.0 | Database ORM |
| **Database** | PostgreSQL | 16 | Primary data store |
| **Containerization** | Docker | Latest | Container platform |
| **Orchestration** | AWS ECS / Kubernetes | Latest | Container orchestration |
| **Logging** | Serilog + CloudWatch | Latest | Structured logging |
| **API Docs** | Swagger/OpenAPI | 3.0 | API documentation |

---

## Design Patterns

### 1. Repository Pattern
Abstracts data access logic from business logic.

```csharp
public interface IMaterialRepository
{
    Task<Material?> GetByIdAsync(Guid id);
    Task<List<Material>> GetAllAsync(bool includeInactive = false);
    Task<Material> CreateAsync(Material material);
    Task<Material> UpdateAsync(Material material);
    Task DeleteAsync(Guid id);
}
```

**Benefits:**
- Testability (mock repositories)
- Separation of concerns
- Consistent data access patterns

---

### 2. DTO Pattern
Separates internal entities from API contracts.

```csharp
// Internal entity
public class Material : BaseEntity
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; }
    public decimal BasePrice { get; set; }
    // ... internal fields
}

// Public DTO
public class MaterialDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal BasePrice { get; set; }
    public string CategoryName { get; set; }  // Joined data
    // ... only exposed fields
}
```

**Benefits:**
- API contract stability
- Hide internal implementation
- Control data exposure

---

### 3. Dependency Injection
All services injected via ASP.NET Core DI container.

```csharp
// Program.cs
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddDbContext<CatalogServiceDbContext>();

// Controller
public class MaterialsController : ControllerBase
{
    private readonly IMaterialRepository _repository;
    
    public MaterialsController(IMaterialRepository repository)
    {
        _repository = repository;
    }
}
```

---

## Database Design

### Naming Convention
**PostgreSQL snake_case** for all database objects:
- Tables: `materials`, `vendor_inventories`
- Columns: `base_price`, `stock_quantity`
- Indexes: `idx_materials_category_id`
- Foreign keys: `fk_materials_category_id`

### Key Design Decisions

**1. UUID Primary Keys**
- Distributed system friendly
- No auto-increment conflicts
- Client-side ID generation possible

**2. Decimal for Money**
- Precision: `decimal(10,2)`
- Avoids floating-point rounding errors
- Supports ₹0.01 to ₹99,999,999.99

**3. Soft Deletes via IsActive**
- Preserve historical data
- Enable "restore" functionality
- Audit trail intact

**4. Price History Tracking**
- Separate `price_histories` table
- Audit trail for all price changes
- Analyze price trends

**5. Vendor-Specific Inventory**
- `vendor_inventories` table (many-to-many resolution)
- Each vendor sets own price
- Independent stock management

---

## API Design

### RESTful Principles
- **Resources**: Materials, Categories, Labor, Inventory
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete), PATCH (partial update)
- **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found)

### Versioning
- **URL-based**: `/api/v1/materials`
- **Header-based**: `X-API-Version: 1.0`

### Pagination
```
GET /api/v1/materials?page=1&pageSize=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

---

## Security Architecture

### Authentication
- **Token-based**: JWT Bearer tokens
- **Provider**: Firebase Authentication (via Identity Service)
- **Token lifetime**: 60 minutes
- **Refresh**: Via refresh token (30 days)

### Authorization
- **Role-based access control (RBAC)**:
  - **Public**: Materials, categories, search, stats
  - **Vendor**: Own inventory and labor management
  - **Admin**: Full CRUD on catalog

### Data Protection
- **Passwords**: None stored (handled by Identity Service)
- **Connection strings**: Environment variables
- **API keys**: Not exposed in responses
- **SQL Injection**: Parameterized queries (EF Core)
- **XSS**: Input validation and encoding

---

## Performance Optimizations

### Database Indexes
```sql
-- Frequently queried fields
CREATE INDEX idx_materials_category_id ON materials(category_id);
CREATE INDEX idx_materials_name ON materials(name);
CREATE INDEX idx_materials_sku ON materials(sku);

-- Composite indexes for common queries
CREATE INDEX idx_materials_category_id_is_active ON materials(category_id, is_active);
CREATE INDEX idx_vendor_inventories_vendor_id_is_available ON vendor_inventories(vendor_id, is_available);
```

### Caching Strategy (Future)
- **In-memory cache**: Categories (change infrequently)
- **Distributed cache (Redis)**: Materials by category
- **TTL**: 15-30 minutes
- **Invalidation**: On admin updates

### Connection Pooling
- **Default pool size**: 100 connections
- **Min connections**: 10
- **Max connections**: 100

---

## Scalability

### Horizontal Scaling
- **Stateless service**: No in-memory session state
- **Load balancer**: AWS ALB distributes traffic
- **Auto-scaling**: ECS scales based on CPU/memory

### Database Scaling
- **Read replicas**: For read-heavy workloads
- **Connection pooling**: Reuse connections
- **Pagination**: Limit result set size

---

## Monitoring & Observability

### Logging
- **Structured logging**: Serilog with JSON output
- **Log levels**: Trace, Debug, Information, Warning, Error, Critical
- **Destination**: AWS CloudWatch

### Metrics
- **API response time**: < 200ms for GET, < 500ms for POST/PUT
- **Database query time**: < 100ms average
- **Error rate**: < 1%
- **Uptime**: > 99.9%

### Health Checks
```
GET /health
Response: {"status":"Healthy","database":"Connected"}
```

---

## Deployment Architecture

### AWS ECS (Production)

```
┌─────────────────────────────────────────┐
│           AWS Cloud (ap-south-1)         │
│                                          │
│  ┌────────────────────────────────┐     │
│  │  Application Load Balancer      │     │
│  │  (Public-facing)                │     │
│  └─────────┬──────────────┬────────┘     │
│            │              │               │
│  ┌─────────▼────┐  ┌──────▼───────┐     │
│  │  ECS Task 1  │  │  ECS Task 2  │     │
│  │  (Container) │  │  (Container) │     │
│  └──────┬───────┘  └──────┬───────┘     │
│         │                 │              │
│         └────────┬────────┘              │
│                  │                       │
│         ┌────────▼────────┐              │
│         │  RDS PostgreSQL │              │
│         │  (Multi-AZ)     │              │
│         └─────────────────┘              │
│                                          │
│         ┌─────────────────┐              │
│         │  CloudWatch     │              │
│         │  (Logs, Metrics)│              │
│         └─────────────────┘              │
└─────────────────────────────────────────┘
```

---

## Design Decisions

### Why PostgreSQL?
- **ACID compliance**: Data integrity for financial transactions
- **JSON support**: Store flexible data (tags, metadata)
- **Performance**: Excellent for read-heavy workloads
- **Mature ecosystem**: Strong .NET support

### Why Entity Framework Core?
- **Productivity**: LINQ queries, migrations, change tracking
- **Type safety**: Compile-time checks
- **Database-agnostic**: Can switch to MySQL/SQL Server

### Why .NET 8?
- **Performance**: Fastest .NET version to date
- **Cross-platform**: Linux containers
- **Modern C#**: Latest language features
- **Long-term support (LTS)**: 3-year support

### Why Repository Pattern?
- **Testability**: Easy to mock for unit tests
- **Abstraction**: Hide EF Core implementation details
- **Flexibility**: Can swap data sources

---

## Future Enhancements

1. **Redis Caching**: Improve read performance
2. **GraphQL API**: Flexible querying for mobile apps
3. **Event Sourcing**: Track all state changes
4. **Read Replicas**: Scale read operations
5. **Full-text Search**: Elasticsearch integration
6. **API Gateway**: Centralized authentication and routing

---

**Last Updated:** January 11, 2026  
**Version:** 1.0.0
