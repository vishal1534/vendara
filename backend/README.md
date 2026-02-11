# RealServ Backend

Production-ready microservices backend for RealServ marketplace platform.

## Architecture

- **Microservices**: 13 independent services
- **Framework**: .NET 8.0 (LTS)
- **Database**: PostgreSQL 16
- **Cloud**: AWS (ECS, RDS, S3, etc.)
- **Authentication**: Firebase Auth
- **Payment**: Razorpay
- **Messaging**: WhatsApp Cloud API
- **Maps**: Google Maps API

## Services

1. User Management Service
2. Vendor Service
3. Buyer Service
4. Order Service
5. Catalog Service
6. Settlement Service
7. Payment Service
8. Delivery Service
9. Location Service
10. Notification Service
11. Support Service
12. Media Service
13. WhatsApp Gateway Service

## Project Structure

```
backend/
├── src/                    # Source code
│   ├── services/           # 13 Microservices
│   └── shared/             # Shared libraries
├── tests/                  # Test projects
├── infrastructure/         # IaC and DevOps
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Quick Start

### Prerequisites

- .NET 8 SDK
- Docker Desktop
- PostgreSQL 16 (via Docker)
- Redis 7 (via Docker)

### Local Development

```bash
# Start infrastructure
docker-compose up -d

# Run specific service
cd src/services/UserManagementService
dotnet run

# Run all tests
dotnet test
```

## Documentation

- [Architecture Overview](docs/architecture/backend-architecture-plan.md)
- [Implementation Plan](docs/planning/implementation-plan.md)
- [Development Setup](docs/development/setup.md)
- [API Documentation](docs/api/README.md)

## Tech Stack

- **.NET 8.0**: Web API framework
- **Entity Framework Core 8**: ORM
- **PostgreSQL 16**: Primary database
- **Redis 7**: Caching
- **Serilog**: Structured logging
- **xUnit**: Unit testing
- **Docker**: Containerization
- **AWS ECS**: Container orchestration

## Development

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run tests
dotnet test

# Run migrations
cd src/services/UserManagementService
dotnet ef database update
```

## Deployment

See [Deployment Guide](docs/deployment/README.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Proprietary - RealServ © 2026
