# RealServ Backend - Folder Structure

```
realserv-backend/
│
├── .github/                                    # GitHub specific files
│   ├── workflows/                              # CI/CD workflows
│   │   ├── user-management-service.yml
│   │   ├── vendor-service.yml
│   │   ├── order-service.yml
│   │   ├── payment-service.yml
│   │   ├── delivery-service.yml
│   │   └── ...
│   ├── CODEOWNERS                              # Code ownership
│   └── pull_request_template.md
│
├── docs/                                       # Documentation
│   ├── architecture/
│   │   ├── diagrams/                           # Architecture diagrams
│   │   └── decisions/                          # ADRs (Architecture Decision Records)
│   ├── api/                                    # API documentation
│   │   ├── openapi/                            # OpenAPI specs
│   │   └── postman/                            # Postman collections
│   ├── backend/
│   │   ├── backend-architecture-plan.md
│   │   └── implementation-plan.md
│   ├── deployment/
│   │   ├── README.md
│   │   ├── aws-setup.md
│   │   └── database-migrations.md
│   ├── runbooks/
│   │   ├── service-down.md
│   │   ├── payment-webhook-failure.md
│   │   └── database-high-cpu.md
│   └── development-setup.md
│
├── infrastructure/                             # Infrastructure as Code
│   ├── terraform/                              # Terraform configs
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── rds/
│   │   │   ├── ecs/
│   │   │   ├── s3/
│   │   │   ├── alb/
│   │   │   └── cloudwatch/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── production/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── backend.tf
│   ├── docker/                                 # Docker configs
│   │   └── nginx/                              # Nginx configs if needed
│   └── kubernetes/                             # K8s configs (future)
│       ├── deployments/
│       ├── services/
│       └── ingress/
│
├── scripts/                                    # Utility scripts
│   ├── setup/
│   │   ├── init-databases.sh
│   │   └── seed-data.sh
│   ├── deploy/
│   │   ├── deploy-dev.sh
│   │   ├── deploy-staging.sh
│   │   └── deploy-production.sh
│   ├── migrations/
│   │   └── run-migrations.sh
│   └── monitoring/
│       └── check-health.sh
│
├── src/                                        # Source code
│   ├── services/                               # Microservices
│   │   │
│   │   ├── UserManagementService/
│   │   │   ├── Controllers/
│   │   │   │   └── UsersController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   └── IUserService.cs
│   │   │   │   └── UserService.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   └── IUserRepository.cs
│   │   │   │   └── UserRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── User.cs
│   │   │   │   │   └── UserRole.cs
│   │   │   │   ├── DTOs/
│   │   │   │   │   ├── UserDto.cs
│   │   │   │   │   └── UserProfileDto.cs
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── RegisterUserRequest.cs
│   │   │   │   │   └── UpdateUserRequest.cs
│   │   │   │   └── Responses/
│   │   │   │       ├── UserResponse.cs
│   │   │   │       └── ApiResponse.cs
│   │   │   ├── Data/
│   │   │   │   ├── UserManagementDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seeds/
│   │   │   ├── Middleware/
│   │   │   │   ├── ErrorHandlingMiddleware.cs
│   │   │   │   └── RequestLoggingMiddleware.cs
│   │   │   ├── Extensions/
│   │   │   │   ├── ServiceCollectionExtensions.cs
│   │   │   │   └── FirebaseExtensions.cs
│   │   │   ├── Configuration/
│   │   │   │   ├── FirebaseSettings.cs
│   │   │   │   └── JwtSettings.cs
│   │   │   ├── Validators/
│   │   │   │   └── RegisterUserRequestValidator.cs
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   ├── appsettings.Development.json
│   │   │   ├── appsettings.Production.json
│   │   │   └── UserManagementService.csproj
│   │   │
│   │   ├── VendorService/
│   │   │   ├── Controllers/
│   │   │   ├── Services/
│   │   │   ├── Repositories/
│   │   │   ├── Models/
│   │   │   ├── Data/
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Configuration/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── VendorService.csproj
│   │   │
│   │   ├── BuyerService/
│   │   │   └── [Same structure as VendorService]
│   │   │
│   │   ├── OrderService/
│   │   │   ├── Controllers/
│   │   │   │   ├── OrdersController.cs
│   │   │   │   └── DisputesController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   ├── OrderService.cs
│   │   │   │   ├── DisputeService.cs
│   │   │   │   └── EventPublisher.cs
│   │   │   ├── Repositories/
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── Order.cs
│   │   │   │   │   ├── OrderItem.cs
│   │   │   │   │   ├── OrderStatusHistory.cs
│   │   │   │   │   └── OrderDispute.cs
│   │   │   │   ├── DTOs/
│   │   │   │   ├── Requests/
│   │   │   │   └── Responses/
│   │   │   ├── Data/
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Configuration/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── OrderService.csproj
│   │   │
│   │   ├── CatalogService/
│   │   │   └── [Same structure]
│   │   │
│   │   ├── SettlementService/
│   │   │   └── [Same structure]
│   │   │
│   │   ├── PaymentService/
│   │   │   ├── Controllers/
│   │   │   │   ├── PaymentsController.cs
│   │   │   │   └── WebhooksController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IPaymentService.cs
│   │   │   │   │   └── IRazorpayService.cs
│   │   │   │   ├── PaymentService.cs
│   │   │   │   └── RazorpayService.cs
│   │   │   ├── Repositories/
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── Payment.cs
│   │   │   │   │   ├── PaymentTransaction.cs
│   │   │   │   │   ├── PaymentWebhook.cs
│   │   │   │   │   └── PaymentRefund.cs
│   │   │   │   ├── DTOs/
│   │   │   │   ├── Requests/
│   │   │   │   └── Responses/
│   │   │   ├── Data/
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Configuration/
│   │   │   │   └── RazorpaySettings.cs
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── PaymentService.csproj
│   │   │
│   │   ├── DeliveryService/
│   │   │   └── [Same structure]
│   │   │
│   │   ├── LocationService/
│   │   │   ├── Controllers/
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IGeocodeService.cs
│   │   │   │   │   ├── IDistanceService.cs
│   │   │   │   │   └── IServiceAreaService.cs
│   │   │   │   ├── GeocodeService.cs
│   │   │   │   ├── DistanceService.cs
│   │   │   │   └── ServiceAreaService.cs
│   │   │   ├── Repositories/
│   │   │   ├── Models/
│   │   │   ├── Data/
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Configuration/
│   │   │   │   └── GoogleMapsSettings.cs
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── LocationService.csproj
│   │   │
│   │   ├── NotificationService/
│   │   │   └── [Same structure]
│   │   │
│   │   ├── SupportService/
│   │   │   └── [Same structure]
│   │   │
│   │   ├── MediaService/
│   │   │   ├── Controllers/
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   └── IS3Service.cs
│   │   │   │   └── S3Service.cs
│   │   │   ├── Repositories/
│   │   │   ├── Models/
│   │   │   ├── Data/
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Configuration/
│   │   │   │   └── S3Settings.cs
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── MediaService.csproj
│   │   │
│   │   └── WhatsAppGatewayService/
│   │       ├── Controllers/
│   │       │   └── WhatsAppWebhookController.cs
│   │       ├── Services/
│   │       │   ├── Interfaces/
│   │       │   │   ├── IMessageParser.cs
│   │       │   │   ├── IIntentRecognizer.cs
│   │       │   │   ├── IConversationStateManager.cs
│   │       │   │   └── IWhatsAppApiClient.cs
│   │       │   ├── MessageParser.cs
│   │       │   ├── IntentRecognizer.cs
│   │       │   ├── ConversationStateManager.cs
│   │       │   └── WhatsAppApiClient.cs
│   │       ├── Repositories/
│   │       ├── Models/
│   │       │   ├── Entities/
│   │       │   │   ├── WhatsAppConversation.cs
│   │       │   │   ├── WhatsAppMessage.cs
│   │       │   │   ├── WhatsAppVendorLink.cs
│   │       │   │   └── WhatsAppIntent.cs
│   │       │   ├── DTOs/
│   │       │   ├── Requests/
│   │       │   └── Responses/
│   │       ├── Data/
│   │       ├── Middleware/
│   │       ├── Extensions/
│   │       ├── Configuration/
│   │       │   └── WhatsAppSettings.cs
│   │       ├── Validators/
│   │       ├── Dockerfile
│   │       ├── Program.cs
│   │       ├── appsettings.json
│   │       └── WhatsAppGatewayService.csproj
│   │
│   └── shared/                                 # Shared libraries
│       │
│       ├── RealServ.Shared.Domain/             # Domain models & interfaces
│       │   ├── Entities/
│       │   │   └── BaseEntity.cs
│       │   ├── Enums/
│       │   │   ├── OrderStatus.cs
│       │   │   ├── PaymentStatus.cs
│       │   │   ├── UserType.cs
│       │   │   └── DeliveryStatus.cs
│       │   ├── Events/
│       │   │   ├── DomainEvent.cs
│       │   │   ├── OrderCreatedEvent.cs
│       │   │   ├── PaymentCapturedEvent.cs
│       │   │   └── DeliveryCompletedEvent.cs
│       │   ├── Exceptions/
│       │   │   ├── DomainException.cs
│       │   │   ├── NotFoundException.cs
│       │   │   └── ValidationException.cs
│       │   ├── Interfaces/
│       │   │   ├── IRepository.cs
│       │   │   ├── IUnitOfWork.cs
│       │   │   └── IDomainEventDispatcher.cs
│       │   └── RealServ.Shared.Domain.csproj
│       │
│       ├── RealServ.Shared.Infrastructure/      # Shared infrastructure
│       │   ├── Authentication/
│       │   │   ├── FirebaseAuthHandler.cs
│       │   │   └── FirebaseTokenValidator.cs
│       │   ├── Caching/
│       │   │   ├── RedisCacheService.cs
│       │   │   └── ICacheService.cs
│       │   ├── Database/
│       │   │   ├── BaseDbContext.cs
│       │   │   └── ConnectionFactory.cs
│       │   ├── EventBus/
│       │   │   ├── EventBridgePublisher.cs
│       │   │   └── IEventPublisher.cs
│       │   ├── Logging/
│       │   │   └── SerilogConfiguration.cs
│       │   ├── Messaging/
│       │   │   ├── SqsMessageQueue.cs
│       │   │   └── IMessageQueue.cs
│       │   ├── Storage/
│       │   │   ├── S3StorageService.cs
│       │   │   └── IStorageService.cs
│       │   ├── HttpClients/
│       │   │   ├── ServiceHttpClient.cs
│       │   │   └── ResilientHttpClient.cs
│       │   ├── Middleware/
│       │   │   ├── GlobalExceptionHandler.cs
│       │   │   └── RequestLoggingMiddleware.cs
│       │   └── RealServ.Shared.Infrastructure.csproj
│       │
│       └── RealServ.Shared.Application/         # Shared application logic
│           ├── Behaviors/
│           │   ├── ValidationBehavior.cs
│           │   └── LoggingBehavior.cs
│           ├── Extensions/
│           │   ├── StringExtensions.cs
│           │   ├── DateTimeExtensions.cs
│           │   └── EnumExtensions.cs
│           ├── Helpers/
│           │   ├── PasswordHasher.cs
│           │   ├── OtpGenerator.cs
│           │   └── SignatureValidator.cs
│           ├── Models/
│           │   ├── PagedResult.cs
│           │   ├── ApiResponse.cs
│           │   └── ErrorResponse.cs
│           ├── Validators/
│           │   ├── PhoneNumberValidator.cs
│           │   └── EmailValidator.cs
│           └── RealServ.Shared.Application.csproj
│
├── tests/                                      # Test projects
│   │
│   ├── unit/                                   # Unit tests
│   │   ├── UserManagementService.Tests/
│   │   │   ├── Controllers/
│   │   │   │   └── UsersControllerTests.cs
│   │   │   ├── Services/
│   │   │   │   └── UserServiceTests.cs
│   │   │   ├── Repositories/
│   │   │   │   └── UserRepositoryTests.cs
│   │   │   ├── Helpers/
│   │   │   │   └── TestDataBuilder.cs
│   │   │   └── UserManagementService.Tests.csproj
│   │   │
│   │   ├── OrderService.Tests/
│   │   │   └── [Same structure]
│   │   │
│   │   ├── PaymentService.Tests/
│   │   │   └── [Same structure]
│   │   │
│   │   └── Shared.Tests/
│   │       └── [Shared utilities tests]
│   │
│   ├── integration/                            # Integration tests
│   │   └── IntegrationTests/
│   │       ├── UserManagement/
│   │       │   ├── UserRegistrationTests.cs
│   │       │   └── UserAuthenticationTests.cs
│   │       ├── Order/
│   │       │   ├── OrderCreationTests.cs
│   │       │   └── OrderPaymentTests.cs
│   │       ├── Payment/
│   │       │   ├── RazorpayIntegrationTests.cs
│   │       │   └── WebhookHandlingTests.cs
│   │       ├── Fixtures/
│   │       │   ├── DatabaseFixture.cs
│   │       │   └── ApiFixture.cs
│   │       ├── Helpers/
│   │       │   └── HttpClientExtensions.cs
│   │       └── IntegrationTests.csproj
│   │
│   └── e2e/                                    # End-to-end tests
│       └── E2ETests/
│           ├── Scenarios/
│           │   ├── OrderToDeliveryScenario.cs
│           │   └── PaymentRefundScenario.cs
│           └── E2ETests.csproj
│
├── .editorconfig                               # Editor configuration
├── .gitignore                                  # Git ignore rules
├── .dockerignore                               # Docker ignore rules
├── docker-compose.yml                          # Docker Compose for local dev
├── docker-compose.override.yml.example         # Override example
├── Directory.Build.props                       # Shared MSBuild properties
├── Directory.Packages.props                    # Central package management
├── global.json                                 # .NET SDK version
├── nuget.config                                # NuGet configuration
├── RealServ.Backend.sln                        # Solution file
├── README.md                                   # Project readme
├── CONTRIBUTING.md                             # Contribution guidelines
├── LICENSE                                     # License file
└── CHANGELOG.md                                # Change log
```

## Folder Structure Explanation

### Root Level

- **`.github/`**: GitHub-specific configuration (CI/CD workflows, PR templates)
- **`docs/`**: All documentation (architecture, API, runbooks, guides)
- **`infrastructure/`**: Infrastructure as Code (Terraform, Docker, K8s)
- **`scripts/`**: Utility scripts (setup, deployment, migrations)
- **`src/`**: All source code
- **`tests/`**: All test projects

### Source Code Structure (`src/`)

#### Services (`src/services/`)

Each microservice follows **Clean Architecture** with layers:

1. **Controllers**: API endpoints (presentation layer)
2. **Services**: Business logic (application layer)
3. **Repositories**: Data access (infrastructure layer)
4. **Models**: Data structures
   - **Entities**: Domain entities (database models)
   - **DTOs**: Data Transfer Objects (API responses)
   - **Requests**: API request models
   - **Responses**: API response models
5. **Data**: Database context, migrations, seeds
6. **Middleware**: Request pipeline middleware
7. **Extensions**: Extension methods for DI, configuration
8. **Configuration**: Settings classes
9. **Validators**: FluentValidation validators

#### Shared Libraries (`src/shared/`)

Three shared projects following **vertical slicing**:

1. **RealServ.Shared.Domain**: Domain primitives, events, exceptions
2. **RealServ.Shared.Infrastructure**: Infrastructure concerns (auth, caching, event bus)
3. **RealServ.Shared.Application**: Application logic (behaviors, helpers, validators)

### Test Structure (`tests/`)

Organized by test type:

1. **`unit/`**: Fast, isolated tests for individual components
2. **`integration/`**: Tests for service interactions (DB, APIs)
3. **`e2e/`**: Full user journey tests

## Key Files

### Solution Level

- **`RealServ.Backend.sln`**: Visual Studio solution file
- **`Directory.Build.props`**: Shared MSBuild properties (version, copyright)
- **`Directory.Packages.props`**: Central Package Management (CPM)
- **`global.json`**: Pins .NET SDK version for consistency

### Service Level

Each service contains:

- **`Program.cs`**: Application entry point
- **`appsettings.json`**: Configuration (base)
- **`appsettings.Development.json`**: Development overrides
- **`appsettings.Production.json`**: Production overrides
- **`Dockerfile`**: Container image definition
- **`[ServiceName].csproj`**: Project file

## Design Patterns Used

1. **Repository Pattern**: Data access abstraction
2. **Unit of Work**: Transaction management
3. **Dependency Injection**: IoC container
4. **CQRS** (optional): Command/Query separation for complex services
5. **Event Sourcing** (optional): For Order & Settlement services
6. **Circuit Breaker**: Resilient HTTP clients (Polly)
7. **Retry Pattern**: Transient failure handling
8. **Mediator Pattern** (optional): Request/response handling (MediatR)

## Best Practices Followed

✅ **Separation of Concerns**: Each layer has a single responsibility
✅ **DRY (Don't Repeat Yourself)**: Shared libraries for common code
✅ **SOLID Principles**: Interfaces, dependency inversion
✅ **Convention over Configuration**: Consistent naming and structure
✅ **Fail Fast**: Validation at API boundary
✅ **Security by Default**: Authentication/authorization in every service
✅ **Observability**: Logging, metrics, health checks in every service
✅ **Testability**: Interfaces and DI enable easy testing
✅ **Database per Service**: Microservices autonomy
✅ **API Versioning**: `/api/v1/` prefix for future compatibility

## Next Steps

1. Create actual project files (`.csproj`) for each service
2. Set up shared libraries with common code
3. Configure CI/CD workflows
4. Create Terraform modules for infrastructure
5. Start implementing services according to implementation plan
