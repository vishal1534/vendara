# Source Code

This directory contains all source code for the RealServ backend.

## Structure

- **`services/`** - 7 microservices (each with own database) - consolidated from 14 for MVP
- **`shared/`** - 3 shared libraries (domain, infrastructure, application)

## Microservices (MVP Architecture - 7 Services)

1. **IdentityService** (User Service) - User registration, authentication, profiles, buyer management
2. **VendorService** (Vendor Management Service) - Vendor management, KYC, settlements, delivery tracking
3. **OrderService** - Order creation, tracking, disputes, support tickets
4. **CatalogService** - Materials & labor catalog management
5. **PaymentService** - Razorpay integration, payment processing
6. **NotificationService** - Email, WhatsApp, push notifications
7. **IntegrationService** - WhatsApp Gateway, Media upload (S3), Location services (Google Maps)

> **Note:** Services consolidated for MVP efficiency. Post-PMF, can split into 10-13 services based on scale needs.

## Shared Libraries

1. **RealServ.Shared.Domain** - Domain models, enums, events, exceptions
2. **RealServ.Shared.Infrastructure** - Auth, caching, storage, messaging
3. **RealServ.Shared.Application** - Helpers, validators, behaviors

## Development

Each service follows Clean Architecture:
- **Controllers/** - API endpoints
- **Services/** - Business logic
- **Repositories/** - Data access
- **Models/** - Entities, DTOs, requests/responses
- **Data/** - DbContext, migrations

## Running Services

```bash
# Run specific service
cd services/UserManagementService
dotnet run

# Run with watch (hot reload)
dotnet watch run
```