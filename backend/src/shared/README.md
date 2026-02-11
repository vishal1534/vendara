# Shared Libraries

Common code shared across all microservices.

## Libraries

### 1. RealServ.Shared.Domain

**Purpose**: Domain primitives, events, exceptions

**Contains**:
- `Entities/BaseEntity.cs` - Base entity class
- `Enums/` - Shared enums (OrderStatus, PaymentStatus, UserType, etc.)
- `Events/` - Domain events (OrderCreatedEvent, PaymentCapturedEvent, etc.)
- `Exceptions/` - Custom exceptions (DomainException, NotFoundException, etc.)
- `Interfaces/` - Repository interfaces, event dispatcher

**Usage**:
```csharp
using RealServ.Shared.Domain.Entities;
using RealServ.Shared.Domain.Enums;
using RealServ.Shared.Domain.Events;
using RealServ.Shared.Domain.Exceptions;
```

### 2. RealServ.Shared.Infrastructure

**Purpose**: Infrastructure concerns (auth, caching, storage, messaging)

**Contains**:
- `Authentication/` - Firebase auth handler, JWT validation
- `Caching/` - Redis cache service
- `Database/` - Base DbContext, connection factory
- `EventBus/` - EventBridge publisher
- `Logging/` - Serilog configuration
- `Messaging/` - SQS message queue
- `Storage/` - S3 storage service
- `HttpClients/` - Resilient HTTP client (Polly)
- `Middleware/` - Global exception handler, request logging

**Usage**:
```csharp
using RealServ.Shared.Infrastructure.Authentication;
using RealServ.Shared.Infrastructure.Caching;
using RealServ.Shared.Infrastructure.Storage;
```

### 3. RealServ.Shared.Application

**Purpose**: Application logic (helpers, validators, behaviors)

**Contains**:
- `Behaviors/` - Validation behavior, logging behavior
- `Extensions/` - String, DateTime, Enum extensions
- `Helpers/` - Password hasher, OTP generator, signature validator
- `Models/` - PagedResult, ApiResponse, ErrorResponse
- `Validators/` - Phone number, email validators

**Usage**:
```csharp
using RealServ.Shared.Application.Helpers;
using RealServ.Shared.Application.Models;
using RealServ.Shared.Application.Validators;
```

## Adding Reference to Service

```bash
cd src/services/YourService
dotnet add reference ../../shared/RealServ.Shared.Domain/RealServ.Shared.Domain.csproj
dotnet add reference ../../shared/RealServ.Shared.Infrastructure/RealServ.Shared.Infrastructure.csproj
dotnet add reference ../../shared/RealServ.Shared.Application/RealServ.Shared.Application.csproj
```

## Creating Shared Libraries

```bash
# Domain library
cd src/shared
dotnet new classlib -n RealServ.Shared.Domain
dotnet sln ../../RealServ.Backend.sln add RealServ.Shared.Domain/RealServ.Shared.Domain.csproj

# Infrastructure library
dotnet new classlib -n RealServ.Shared.Infrastructure
dotnet sln ../../RealServ.Backend.sln add RealServ.Shared.Infrastructure/RealServ.Shared.Infrastructure.csproj

# Infrastructure depends on Domain
cd RealServ.Shared.Infrastructure
dotnet add reference ../RealServ.Shared.Domain/RealServ.Shared.Domain.csproj

# Application library
cd ..
dotnet new classlib -n RealServ.Shared.Application
dotnet sln ../../RealServ.Backend.sln add RealServ.Shared.Application/RealServ.Shared.Application.csproj

# Application depends on Domain
cd RealServ.Shared.Application
dotnet add reference ../RealServ.Shared.Domain/RealServ.Shared.Domain.csproj
```

## Design Principles

1. **DRY** - Don't repeat yourself, share common code
2. **Single Responsibility** - Each library has one purpose
3. **Dependency Direction** - Infrastructure and Application depend on Domain
4. **Interface Segregation** - Interfaces in Domain, implementations in Infrastructure
5. **Version Together** - Shared libraries version together

## Next Steps

1. Create shared libraries (if not exist)
2. Add common enums, exceptions, events
3. Implement Firebase auth handler
4. Implement Redis cache service
5. Implement S3 storage service
