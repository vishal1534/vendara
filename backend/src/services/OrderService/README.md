# Order Service

**Version:** 1.0.0  
**Status:** Production-Ready  
**Last Updated:** January 11, 2026

## Overview

The Order Service is a core microservice in the RealServ platform that manages the complete order lifecycle for construction materials and labor bookings. It handles order creation, status management, payment tracking, delivery coordination, and vendor fulfillment workflows.

### Key Features

- **Order Management** - Create, update, and track orders for materials, labor, or combined orders
- **Multi-Entity Support** - Comprehensive data model with 7 entities (Order, OrderItem, OrderLabor, Payment, Delivery, DeliveryAddress, OrderStatusHistory)
- **Status Workflow** - 11-stage order status lifecycle from draft to completion
- **Payment Integration** - Support for multiple payment methods with transaction tracking
- **Delivery Tracking** - Real-time delivery status with driver details and tracking numbers
- **Vendor Fulfillment** - Dedicated endpoints for vendor order management
- **Customer Portal** - Customer-specific order views and statistics
- **Reporting & Analytics** - Daily, monthly, and date-range reports
- **CloudWatch Observability** - Full metrics, logging, and health monitoring
- **Comprehensive Seed Data** - 5 realistic orders with Hyderabad pricing

---

## Quick Start

### Prerequisites

- .NET 8 SDK
- PostgreSQL 16
- Connection to shared RealServ libraries

### 1. Configure Database

Update `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "OrderServiceDb": "Host=localhost;Database=realserv_order_db;Username=postgres;Password=postgres"
  }
}
```

### 2. Run Migrations

```bash
cd backend/src/services/OrderService
dotnet ef database update
```

### 3. Start Service

```bash
dotnet run
```

The service will be available at:
- **HTTP:** http://localhost:5000
- **HTTPS:** https://localhost:5001
- **Swagger:** http://localhost:5000/swagger
- **Health:** http://localhost:5000/health

---

## Architecture

### Domain Model

**7 Core Entities:**

1. **Order** - Main order entity with customer, vendor, and pricing details
2. **OrderItem** - Material line items with quantity and pricing
3. **OrderLabor** - Labor bookings with worker count and duration
4. **DeliveryAddress** - Customer delivery addresses with geolocation
5. **Payment** - Payment tracking with gateway integration
6. **Delivery** - Delivery logistics with driver and vehicle details
7. **OrderStatusHistory** - Audit trail of all status changes

### Order Status Workflow

```
Draft → Pending → Confirmed → Processing → Ready → Dispatched → Delivered → Completed
                     ↓
                 Cancelled / Rejected / Refunded
```

### Order Types

- **Material** - Construction materials only
- **Labor** - Skilled labor booking only
- **Combined** - Materials + labor in single order

---

## API Endpoints

### Orders Management (9 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/orders` | Get all orders |
| GET | `/api/v1/orders/{id}` | Get order by ID |
| GET | `/api/v1/orders/by-number/{orderNumber}` | Get order by number |
| POST | `/api/v1/orders` | Create new order |
| PATCH | `/api/v1/orders/{id}/status` | Update order status |
| POST | `/api/v1/orders/{id}/cancel` | Cancel order |
| GET | `/api/v1/orders/{id}/history` | Get status history |

### Customer Orders (3 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers/{customerId}/orders` | Get customer orders |
| GET | `/api/v1/customers/{customerId}/orders/by-status/{status}` | Filter by status |
| GET | `/api/v1/customers/{customerId}/orders/stats` | Customer statistics |

### Vendor Orders (4 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/vendors/{vendorId}/orders` | Get vendor orders |
| GET | `/api/v1/vendors/{vendorId}/orders/by-status/{status}` | Filter by status |
| GET | `/api/v1/vendors/{vendorId}/orders/pending` | Get pending orders |
| GET | `/api/v1/vendors/{vendorId}/orders/active` | Get active orders |
| GET | `/api/v1/vendors/{vendorId}/orders/stats` | Vendor statistics |

### Delivery Addresses (7 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/delivery-addresses/{id}` | Get address by ID |
| GET | `/api/v1/delivery-addresses/customer/{customerId}` | Get customer addresses |
| GET | `/api/v1/delivery-addresses/customer/{customerId}/default` | Get default address |
| POST | `/api/v1/delivery-addresses` | Create address |
| PUT | `/api/v1/delivery-addresses/{id}` | Update address |
| DELETE | `/api/v1/delivery-addresses/{id}` | Delete address |
| POST | `/api/v1/delivery-addresses/{id}/set-default` | Set as default |

### Reports (4 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/orders/by-date-range` | Date range report |
| GET | `/api/v1/reports/orders/by-status/{status}` | Status report |
| GET | `/api/v1/reports/orders/daily-summary` | Daily summary |
| GET | `/api/v1/reports/orders/monthly-summary` | Monthly summary |

**Total Endpoints:** 27

---

## Database Schema

### Tables (7)

```sql
orders
  ├── order_items (1-to-many)
  ├── order_labors (1-to-many)
  ├── delivery_addresses (many-to-1)
  ├── payments (1-to-1)
  ├── deliveries (1-to-1)
  └── order_status_histories (1-to-many)
```

### Indexes

- **Performance indexes** on customer_id, vendor_id, status, created_at
- **Unique indexes** on order_number, vendor_inventory pairing
- **Composite indexes** for common queries

### PostgreSQL Features

- **Snake_case naming** for all tables and columns
- **UUID primary keys** for distributed system compatibility
- **Decimal precision** for accurate financial calculations
- **Timestamps** with UTC timezone handling

---

## Seed Data

### 5 Sample Orders

1. **Completed Material Order** - ₹28,660 (50 bags cement)
2. **Labor Booking** - ₹9,600 (2 skilled masons for 8 days)
3. **Combined Order** - ₹53,990 (TMT bars + sand + carpenter)
4. **Pending Material Order** - ₹14,560 (bricks + cement)
5. **Dispatched Order** - ₹10,230 (sand + aggregates)

### 3 Delivery Addresses

- Hitech City construction site
- Gachibowli residential site
- Manikonda villa project

### Payment Methods

- Online (Razorpay integration)
- Cash on Delivery
- Bank Transfer support

---

## Service Integration

### Upstream Services

- **Identity Service** - Customer and vendor authentication
- **Catalog Service** - Material and labor catalog data
- **Vendor Service** - Vendor inventory and availability

### HTTP Clients

Configured in Program.cs:

```csharp
builder.Services.AddHttpClient("CatalogService", client => { ... });
builder.Services.AddHttpClient("IdentityService", client => { ... });
builder.Services.AddHttpClient("VendorService", client => { ... });
```

---

## Configuration

### Environment Variables

```bash
# Database
DATABASE_CONNECTION_STRING=Host=...;Database=realserv_order_db;Username=...;Password=...

# Service URLs
IDENTITY_SERVICE_URL=http://identity-service:5001
CATALOG_SERVICE_URL=http://catalog-service:5002
VENDOR_SERVICE_URL=http://vendor-service:5003

# CloudWatch (optional)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## Observability

### Health Checks

**Endpoint:** `/health`

```json
{
  "status": "Healthy",
  "database": "Connected"
}
```

### CloudWatch Integration

- **Metrics** - Request count, duration, error rates
- **Logs** - Structured logging with Serilog
- **Traces** - Request correlation IDs

### Business Metrics

- Order creation rate
- Average order value
- Status transition timing
- Payment success rate

---

## Documentation

📚 **Complete documentation available:**

- [`/docs`](./docs) - Comprehensive guides
- [`API_REFERENCE.md`](./API_REFERENCE.md) - Detailed API documentation
- [`QUICKSTART.md`](./QUICKSTART.md) - Getting started guide
- [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) - Endpoint catalog
- [`/examples`](./examples) - Code examples

---

## Development

### Running Tests

```bash
dotnet test
```

### Generate Migration

```bash
dotnet ef migrations add MigrationName
```

### Docker Build

```bash
docker build -t order-service .
docker run -p 5000:80 order-service
```

---

## Production Deployment

### AWS RDS PostgreSQL

1. Create database: `realserv_order_db`
2. Configure connection string in environment variables
3. Run migrations: `dotnet ef database update`
4. Deploy via ECS/EKS

### Scaling Considerations

- **Read replicas** for reporting queries
- **Connection pooling** with Npgsql
- **Horizontal scaling** with load balancer

---

## Support

- **Documentation:** See `/docs` folder
- **API Reference:** See `API_REFERENCE.md`
- **Examples:** See `/examples` folder

---

**Service:** Order Service  
**Namespace:** `OrderService`  
**Database:** `realserv_order_db`  
**Port:** 5000 (HTTP), 5001 (HTTPS)
