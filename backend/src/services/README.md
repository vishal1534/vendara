# Microservices

This directory contains all 7 microservices for the RealServ MVP backend (consolidated from 14 for efficiency).

## Services Overview (MVP Architecture)

| Service | Port | Database | Status | Purpose |
|---------|------|----------|--------|---------|
| **IdentityService** | 5001 | realserv_identity_db | ✅ Complete | User registration, auth, profiles, buyer management |
| **VendorService** | 5002 | realserv_vendor_db | ✅ Complete | Vendor management, KYC, settlements, delivery tracking |
| **OrderService** | 5004 | realserv_order_db | ✅ Complete | Order processing, tracking, support tickets |
| **CatalogService** | 5005 | realserv_catalog_db | ✅ Complete | Materials & labor catalog |
| **PaymentService** | 5007 | realserv_payment_db | ✅ Complete | Razorpay, payments |
| **NotificationService** | 5010 | realserv_notification_db | ✅ Complete | Email, WhatsApp, SMS, push notifications |
| **IntegrationService** | 5012 | realserv_integration_db | ⏳ Pending | WhatsApp Gateway, Media (S3), Location (Google Maps) |

**Progress**: **6/7 services complete (85.7%)**

### Consolidation Rationale

The original 14-service architecture was consolidated to 7 services for MVP:
- **User + Buyer → IdentityService**: Buyers are users with role="buyer"
- **Vendor + Settlement + Delivery → VendorService**: Tightly coupled vendor lifecycle
- **Order + Support → OrderService**: 90% of support tickets are order-related
- **WhatsApp Gateway + Media + Location → IntegrationService**: All external API integrations

> **Post-PMF Scaling**: Can split into 10-13 services when reaching 1,000+ daily orders

## Service Structure

Each service follows this structure:

```
ServiceName/
├── Controllers/
├── Services/
│   └── Interfaces/
├── Repositories/
│   └── Interfaces/
├── Models/
│   ├── Entities/
│   ├── DTOs/
│   ├── Requests/
│   └── Responses/
├── Data/
│   ├── Migrations/
│   └── Seeds/
├── Middleware/
├── Extensions/
├── Configuration/
├── Validators/
├── Dockerfile
├── Program.cs
├── appsettings.json
└── ServiceName.csproj
```

## Implementation Order

**Phase 1 (Weeks 1-3)**: IdentityService, CatalogService
**Phase 2 (Weeks 4-6)**: VendorService, OrderService  
**Phase 3 (Weeks 7-8)**: PaymentService
**Phase 4 (Weeks 9-10)**: NotificationService, IntegrationService

## Creating a New Service

```bash
# Create service project
dotnet new webapi -n ServiceName

# Add to solution
dotnet sln add src/services/ServiceName/ServiceName.csproj

# Add shared libraries reference
cd src/services/ServiceName
dotnet add reference ../../shared/RealServ.Shared.Domain/RealServ.Shared.Domain.csproj
dotnet add reference ../../shared/RealServ.Shared.Infrastructure/RealServ.Shared.Infrastructure.csproj
dotnet add reference ../../shared/RealServ.Shared.Application/RealServ.Shared.Application.csproj

# Add common packages
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package FirebaseAdmin
dotnet add package FluentValidation.AspNetCore
```

## Next Steps

1. Start with IdentityService (Week 1)
2. Follow the implementation plan day-by-day
3. Run tests after each feature
4. Deploy to ECS after completion