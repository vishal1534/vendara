# Catalog Service

**Enterprise-grade material and labor catalog service with production-ready security.**

## Key Features

- 🧱 **Material Catalog** - Construction materials with realistic Hyderabad pricing (11 materials across 5 categories)
- 👷 **Labor Catalog** - Skilled labor services with hourly/daily rates (6 labor categories)
- 📦 **Vendor Inventory** - Vendor-specific pricing, stock tracking, availability management
- 🏷️ **Category Management** - Hierarchical category system for materials and labor
- 🔍 **Advanced Search** - Multi-filter search with pagination and sorting
- 🔄 **Bulk Operations** - Mass updates for admin efficiency (activate, price changes, deletions)
- 📊 **Price History** - Complete audit trail for all price changes
- ⚠️ **Stock Alerts** - Low stock detection with configurable thresholds
- 🔐 **Enterprise Security** - CORS, rate limiting, authentication, input validation
- ⚡ **Redis Caching** - 50-80% faster responses with distributed caching
- 📈 **CloudWatch Observability** - Full metrics and logging integration

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup with Docker.

**TL;DR:**
```bash
# Start PostgreSQL and Redis
docker run --name catalog-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
docker run --name catalog-redis -p 6379:6379 -d redis:latest

# Run service
cd backend/src/services/CatalogService
dotnet ef database update
dotnet run

# Test
curl http://localhost:5000/health
```

## Documentation

### Getting Started
- [Quick Start Guide](./QUICKSTART.md) - 5-minute setup
- [API Reference](./API_REFERENCE.md) - Complete API documentation (47 endpoints)
- [Guides](./guides/) - Problem-solving guides

### Reference
- [API Endpoints](./API_ENDPOINTS.md) - All 47 endpoints documented
- [Database Schema](./docs/reference/database-schema.md) - PostgreSQL schema
- [Configuration](./docs/reference/configuration.md) - Security and settings
- [Error Codes](./docs/reference/error-codes.md) - Error reference
- [Glossary](./docs/reference/glossary.md) - Terms and definitions

### How-To Guides
- [Material Catalog Management](./guides/material-catalog.md) - Manage construction materials
- [Labor Catalog Management](./guides/labor-catalog.md) - Manage labor services
- [Pricing & Inventory](./guides/pricing-inventory.md) - Price and stock management
- [Security Configuration](./docs/how-to-guides/security-configuration.md) - CORS, auth, rate limiting
- [Deploy to Production](./docs/how-to-guides/deploy-to-production.md) - Production deployment

### Explanation
- [Architecture Overview](./docs/explanation/architecture-overview.md) - System design
- [Security Architecture](./docs/explanation/security-architecture.md) - Security design
- [Full Documentation](./docs/) - Complete documentation

## Tech Stack

- **.NET 8.0** - Runtime and framework
- **PostgreSQL 16** - Database with snake_case naming
- **Redis** - Distributed caching
- **Entity Framework Core 8** - ORM with repository pattern
- **Firebase Authentication** - Auth integration (via shared library)
- **AWS CloudWatch** - Logging and metrics
- **Docker** - Containerization
- **Swagger/OpenAPI** - API documentation

## Security Features (NEW ✨)

- ✅ **CORS Protection** - Restricted to specific origins
- ✅ **Rate Limiting** - 100-200 requests/minute per IP
- ✅ **Authentication** - Policy-based authorization (Admin, Vendor, Customer)
- ✅ **Input Validation** - Range and length validation on all inputs
- ✅ **Pagination Limits** - Max 100 items per page
- ✅ **Input Sanitization** - SQL injection protection
- ✅ **Global Error Handling** - Secure error responses
- ✅ **Connection Pooling** - Optimized database connections

## API Overview

**47 REST API Endpoints** organized into 9 categories:

| Category | Endpoints | Auth | Purpose |
|----------|-----------|------|---------|
| Materials | 5 | Admin | Material CRUD |
| Categories | 5 | Admin | Category management |
| Labor Categories | 5 | Admin | Labor service CRUD |
| Vendor Inventory | 10 | Vendor/Admin | Inventory management |
| Vendor Labor | 7 | Vendor/Admin | Labor availability |
| Search | 3 | Public | Advanced search |
| Bulk Operations | 5 | Admin | Mass updates |
| Statistics | 6 | Public | Aggregated stats |
| Health | 1 | Public | Health check |

**Base URL**: `https://api.realserv.com/catalog` (Production)  
**Development**: `http://localhost:5000`

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/v1/materials" \
  -H "accept: application/json"
```

See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation with 50+ code examples.

## Database

**6 PostgreSQL Tables**:
- `categories` - Material and labor categories (10 rows)
- `materials` - Construction materials catalog (11 rows)
- `labor_categories` - Skilled labor services (6 rows)
- `vendor_inventories` - Vendor-specific material inventory
- `vendor_labor_availabilities` - Vendor labor offerings
- `price_histories` - Price change audit trail

**Naming Convention**: snake_case (PostgreSQL standard)  
**Keys**: UUIDs for distributed systems  
**Indexes**: Optimized for search and filtering

See [Database Schema Reference](./docs/reference/database-schema.md) for complete schema.

## Project Structure

```
CatalogService/
├── Controllers/         # 9 API controllers (47 endpoints)
├── Data/               # DbContext and seed data
├── Models/
│   ├── Entities/       # 6 database entities
│   └── DTOs/           # Data transfer objects
├── Repositories/       # 7 repository implementations
├── Middleware/         # Custom middleware (API versioning)
├── guides/             # Problem-solving guides
├── examples/           # Working code examples
├── docs/               # Comprehensive documentation
├── Dockerfile          # Container definition
├── Program.cs          # Application entry point
└── README.md          # This file
```

## Development

**Prerequisites**:
- .NET 8 SDK
- PostgreSQL 16
- Redis
- Docker (optional)

**Run Locally**:
```bash
# 1. Start database and Redis
docker run --name catalog-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
docker run --name catalog-redis -p 6379:6379 -d redis:latest

# 2. Apply migrations
dotnet ef database update

# 3. Run service
dotnet run

# 4. Access Swagger
open http://localhost:5000/swagger
```

**Create Migration**:
```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

See [Getting Started Guide](./guides/getting-started.md) for detailed setup.

## Testing

**Health Check**:
```bash
curl http://localhost:5000/health
# Expected: {"status":"Healthy",...}
```

**Swagger UI**: http://localhost:5000/swagger

**Postman Collection**: [examples/postman/](./examples/postman/)

## Deployment

**Docker**:
```bash
docker build -t realserv-catalog-service .
docker run -p 5001:80 realserv-catalog-service
```

**AWS ECS**: See [Deploy to Production](./docs/how-to-guides/deploy-to-production.md)

## Monitoring

**CloudWatch**:
- **Logs**: `/realserv/catalog-service`
- **Metrics**: API request count, duration, error rate

**Response Headers** (all endpoints):
```
X-API-Version: 1.0
X-Service-Name: RealServ Catalog Service
X-Response-Time-Ms: 45.23
```

## Service Dependencies

**Upstream**: None (standalone service)  
**Downstream**: Order Service, Vendor Management Service

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## Support

- **Documentation**: [Full Docs](./docs/)
- **API Issues**: backend@realserv.com
- **Slack**: #backend-catalog

## License

Proprietary - RealServ © 2026

---

**Service Version**: 1.0.0  
**API Version**: v1  
**Status**: ✅ Production Ready  
**Last Updated**: January 11, 2026