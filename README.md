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
/src                    # Source code
  /services             # Microservices
  /shared               # Shared libraries
/tests                  # Test projects
/infrastructure         # IaC and DevOps
/docs                   # Documentation
/scripts                # Utility scripts
```

## Getting Started

See [Development Setup Guide](docs/development-setup.md)

## Documentation

- [Architecture Overview](docs/backend/backend-architecture-plan.md)
- [Implementation Plan](docs/backend/implementation-plan.md)
- [API Documentation](docs/api/README.md)
- [Deployment Guide](docs/deployment/README.md)

## Tech Stack

- **.NET 8.0**: Web API framework
- **Entity Framework Core 8**: ORM
- **PostgreSQL 16**: Primary database
- **Redis 7**: Caching and session management
- **Serilog**: Structured logging
- **xUnit**: Unit testing
- **Docker**: Containerization
- **AWS ECS**: Container orchestration

## Development

```bash
# Clone repository
git clone https://github.com/RealServ/realserv-backend.git

# Navigate to project
cd realserv-backend

# Run with Docker Compose (local development)
docker-compose up

# Run specific service
cd src/services/UserManagementService
dotnet run

# Run tests
dotnet test
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Proprietary - RealServ © 2026
