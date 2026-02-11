# RealServ Backend - Complete Folder Structure

## Version 3.0 - MVP-Optimized (7-8 Services)

This folder structure reflects the **MVP-optimized architecture** with 7-8 microservices instead of the original 13+. This approach balances rapid development (10 weeks) with good architecture practices, while maintaining a clear upgrade path to full microservices post-PMF.

---

## Root Structure

```
backend/
├── .github/                            # GitHub configurations
│   └── workflows/                      # CI/CD workflows (7 service pipelines)
├── docs/                               # Documentation
├── infrastructure/                     # Infrastructure as Code
├── scripts/                            # Utility scripts
├── src/                                # Source code
│   ├── services/                       # 7-8 Microservices (MVP-optimized)
│   └── shared/                         # 3 Shared libraries
├── tests/                              # Test projects
├── .editorconfig                       # Code style rules
├── .gitignore                          # Git ignore rules
├── .dockerignore                       # Docker ignore rules
├── Directory.Build.props               # Shared build properties
├── Directory.Packages.props            # Central package management (55+ packages)
├── docker-compose.yml                  # Local development environment (7-8 services)
├── global.json                         # .NET SDK version
├── nuget.config                        # NuGet configuration
├── CONTRIBUTING.md                     # Contribution guidelines
├── FOLDER_STRUCTURE.md                 # This file
├── PROJECT_STATUS.md                   # Current status
├── README.md                           # Project overview
└── RealServ.Backend.sln                # Solution file (7-8 services + 3 shared libs)
```

---

## Detailed Structure

```
backend/
│
├── .github/
│   ├── workflows/
│   │   ├── user-service.yml                # CI/CD for User Service
│   │   ├── order-service.yml               # CI/CD for Order Service
│   │   ├── payment-service.yml             # CI/CD for Payment Service
│   │   ├── catalog-service.yml             # CI/CD for Catalog Service
│   │   ├── vendor-management-service.yml   # CI/CD for Vendor Management Service
│   │   ├── notification-service.yml        # CI/CD for Notification Service
│   │   ├── integration-service.yml         # CI/CD for Integration Service
│   │   └── analytics-service.yml           # CI/CD for Analytics Service (optional)
│   ├── CODEOWNERS
│   └── pull_request_template.md
│
├── docs/
│   ├── architecture/
│   │   ├── backend-architecture-plan.md        # Complete architecture (v3.0 - MVP-optimized)
│   │   ├── system-overview.md
│   │   ├── microservices-design.md
│   │   └── migration-to-full-microservices.md  # When/how to split to 13+ services
│   ├── api/
│   │   ├── README.md
│   │   ├── openapi/                            # OpenAPI/Swagger specs (7-8 services)
│   │   │   ├── user-service.yaml
│   │   │   ├── order-service.yaml
│   │   │   ├── payment-service.yaml
│   │   │   ├── catalog-service.yaml
│   │   │   ├── vendor-management-service.yaml
│   │   │   ├── notification-service.yaml
│   │   │   └── integration-service.yaml
│   │   └── postman/                            # Postman collections
│   │       └── RealServ-MVP.postman_collection.json
│   ├── deployment/
│   │   ├── README.md
│   │   ├── aws-setup.md
│   │   ├── cicd-pipeline.md
│   │   └── docker-compose-guide.md
│   ├── development/
│   │   ├── getting-started.md
│   │   ├── coding-standards.md
│   │   ├── testing-guide.md
│   │   └── service-communication.md
│   ├── planning/
│   │   ├── implementation-plan.md              # 10-week roadmap (updated)
│   │   └── week-by-week.md
│   └── runbooks/
│       ├── service-down.md
│       ├── payment-webhook-failure.md
│       ├── database-high-cpu.md
│       └── whatsapp-bot-issues.md
│
├── infrastructure/
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── rds/                            # 7-8 PostgreSQL databases
│   │   │   ├── ecs/                            # 7-8 ECS services
│   │   │   ├── s3/
│   │   │   ├── alb/
│   │   │   ├── api-gateway/
│   │   │   └── cloudwatch/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── terraform.tfvars.example
│   │   │   ├── staging/
│   │   │   └── production/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── backend.tf
│   ├── docker/
│   │   ├── nginx/
│   │   │   ├── Dockerfile
│   │   │   └── nginx.conf
│   │   └── postgres/
│   │       └── init-scripts/
│   └── kubernetes/                              # Future K8s configs (post-PMF)
│       ├── deployments/
│       ├── services/
│       └── ingress/
│
├── scripts/
│   ├── setup/
│   │   ├── init-databases.sh                    # Initialize 7-8 databases
│   │   ├── seed-data.sh
│   │   ├── setup-aws.sh
│   │   └── setup-firebase.sh
│   ├── deploy/
│   │   ├── deploy-dev.sh
│   │   ├── deploy-staging.sh
│   │   ├── deploy-production.sh
│   │   └── deploy-service.sh
│   ├── migrations/
│   │   ├── run-migrations.sh
│   │   ├── rollback-migration.sh
│   │   └── generate-migration.sh
│   ├── seeds/
│   │   ├── users.sql
│   │   ├── catalog.sql
│   │   ├── service-areas.sql
│   │   └── notification-templates.sql
│   └── monitoring/
│       ├── check-health.sh
│       ├── check-logs.sh
│       └── backup-databases.sh
│
├── src/
│   ├── services/
│   │   │
│   │   ├── UserService/                         # Service 1: User + Buyer profiles
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.cs
│   │   │   │   ├── UsersController.cs
│   │   │   │   └── BuyersController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IAuthService.cs
│   │   │   │   │   ├── IUserService.cs
│   │   │   │   │   └── IBuyerService.cs
│   │   │   │   ├── AuthService.cs               # Firebase Auth integration
│   │   │   │   ├── UserService.cs
│   │   │   │   └── BuyerService.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IUserRepository.cs
│   │   │   │   │   ├── IBuyerRepository.cs
│   │   │   │   │   └── IAddressRepository.cs
│   │   │   │   ├── UserRepository.cs
│   │   │   │   ├── BuyerRepository.cs
│   │   │   │   └── AddressRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── User.cs
│   │   │   │   │   ├── BuyerProfile.cs
│   │   │   │   │   ├── DeliveryAddress.cs
│   │   │   │   │   ├── AdminProfile.cs
│   │   │   │   │   └── UserSession.cs
│   │   │   │   ├── DTOs/
│   │   │   │   │   ├── UserDto.cs
│   │   │   │   │   ├── BuyerDto.cs
│   │   │   │   │   └── AddressDto.cs
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── RegisterUserRequest.cs
│   │   │   │   │   ├── UpdateUserRequest.cs
│   │   │   │   │   └── AddAddressRequest.cs
│   │   │   │   └── Responses/
│   │   │   │       ├── UserResponse.cs
│   │   │   │       ├── AuthResponse.cs
│   │   │   │       └── ApiResponse.cs
│   │   │   ├── Data/
│   │   │   │   ├── UserServiceDbContext.cs
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
│   │   │   ├── .dockerignore
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   ├── appsettings.Development.json
│   │   │   ├── appsettings.Production.json
│   │   │   └── UserService.csproj
│   │   │
│   │   ├── OrderService/                        # Service 2: Orders + Support tickets
│   │   │   ├── Controllers/
│   │   │   │   ├── OrdersController.cs
│   │   │   │   ├── SupportTicketsController.cs
│   │   │   │   └── DisputesController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IOrderService.cs
│   │   │   │   │   ├── ISupportTicketService.cs
│   │   │   │   │   └── IDisputeService.cs
│   │   │   │   ├── OrderService.cs
│   │   │   │   ├── SupportTicketService.cs
│   │   │   │   └── DisputeService.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IOrderRepository.cs
│   │   │   │   │   ├── IOrderItemRepository.cs
│   │   │   │   │   ├── ISupportTicketRepository.cs
│   │   │   │   │   └── IDisputeRepository.cs
│   │   │   │   ├── OrderRepository.cs
│   │   │   │   ├── OrderItemRepository.cs
│   │   │   │   ├── SupportTicketRepository.cs
│   │   │   │   └── DisputeRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── Order.cs
│   │   │   │   │   ├── OrderItem.cs
│   │   │   │   │   ├── OrderStatusHistory.cs
│   │   │   │   │   ├── SupportTicket.cs
│   │   │   │   │   ├── TicketMessage.cs
│   │   │   │   │   └── Dispute.cs
│   │   │   │   ├── DTOs/
│   │   │   │   │   ├── OrderDto.cs
│   │   │   │   │   ├── OrderItemDto.cs
│   │   │   │   │   └── SupportTicketDto.cs
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── CreateOrderRequest.cs
│   │   │   │   │   ├── UpdateOrderStatusRequest.cs
│   │   │   │   │   └── CreateTicketRequest.cs
│   │   │   │   └── Responses/
│   │   │   │       ├── OrderResponse.cs
│   │   │   │       └── TicketResponse.cs
│   │   │   ├── Data/
│   │   │   │   ├── OrderServiceDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seeds/
│   │   │   ├── HttpClients/
│   │   │   │   ├── UserServiceClient.cs         # Calls User Service API
│   │   │   │   ├── CatalogServiceClient.cs      # Calls Catalog Service API
│   │   │   │   ├── PaymentServiceClient.cs      # Calls Payment Service API
│   │   │   │   └── VendorServiceClient.cs       # Calls Vendor Management Service API
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Configuration/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   ├── appsettings.Development.json
│   │   │   ├── appsettings.Production.json
│   │   │   └── OrderService.csproj
│   │   │
│   │   ├── PaymentService/                      # Service 3: Payments (Razorpay + COD)
│   │   │   ├── Controllers/
│   │   │   │   ├── PaymentsController.cs
│   │   │   │   ├── WebhooksController.cs        # Razorpay webhooks
│   │   │   │   └── RefundsController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IPaymentService.cs
│   │   │   │   │   ├── IRazorpayService.cs
│   │   │   │   │   └── IRefundService.cs
│   │   │   │   ├── PaymentService.cs
│   │   │   │   ├── RazorpayService.cs           # Razorpay SDK integration
│   │   │   │   ├── CODService.cs
│   │   │   │   └── RefundService.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IPaymentRepository.cs
│   │   │   │   │   ├── IPaymentWebhookRepository.cs
│   │   │   │   │   └── IRefundRepository.cs
│   │   │   │   ├── PaymentRepository.cs
│   │   │   │   ├── PaymentWebhookRepository.cs
│   │   │   │   └── RefundRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── Payment.cs
│   │   │   │   │   ├── PaymentTransaction.cs
│   │   │   │   │   ├── PaymentWebhook.cs
│   │   │   │   │   └── PaymentRefund.cs
│   │   │   │   ├── DTOs/
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── CreatePaymentOrderRequest.cs
│   │   │   │   │   ├── VerifyPaymentRequest.cs
│   │   │   │   │   └── InitiateRefundRequest.cs
│   │   │   │   └── Responses/
│   │   │   │       ├── PaymentOrderResponse.cs
│   │   │   │       └── RefundResponse.cs
│   │   │   ├── Data/
│   │   │   │   ├── PaymentServiceDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seeds/
│   │   │   ├── Configuration/
│   │   │   │   └── RazorpaySettings.cs
│   │   │   ├── HttpClients/
│   │   │   │   └── OrderServiceClient.cs        # Calls Order Service API
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── PaymentService.csproj
│   │   │
│   │   ├── CatalogService/                      # Service 4: Materials + Labor catalog
│   │   │   ├── Controllers/
│   │   │   │   ├── MaterialsController.cs
│   │   │   │   ├── LaborController.cs
│   │   │   │   ├── CategoriesController.cs
│   │   │   │   └── InventoryController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IMaterialService.cs
│   │   │   │   │   ├── ILaborService.cs
│   │   │   │   │   ├── ICategoryService.cs
│   │   │   │   │   └── IInventoryService.cs
│   │   │   │   ├── MaterialService.cs
│   │   │   │   ├── LaborService.cs
│   │   │   │   ├── CategoryService.cs
│   │   │   │   └── InventoryService.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IMaterialRepository.cs
│   │   │   │   │   ├── ILaborRepository.cs
│   │   │   │   │   ├── ICategoryRepository.cs
│   │   │   │   │   └── IVendorInventoryRepository.cs
│   │   │   │   ├── MaterialRepository.cs
│   │   │   │   ├── LaborRepository.cs
│   │   │   │   ├── CategoryRepository.cs
│   │   │   │   └── VendorInventoryRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── Category.cs
│   │   │   │   │   ├── Material.cs
│   │   │   │   │   ├── LaborCategory.cs
│   │   │   │   │   ├── VendorInventory.cs
│   │   │   │   │   └── VendorLaborAvailability.cs
│   │   │   │   ├── DTOs/
│   │   │   │   │   ├── MaterialDto.cs
│   │   │   │   │   ├── LaborDto.cs
│   │   │   │   │   └── CategoryDto.cs
│   │   │   │   ├── Requests/
│   │   │   │   └── Responses/
│   │   │   ├── Data/
│   │   │   │   ├── CatalogServiceDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seeds/
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── CatalogService.csproj
│   │   │
│   │   ├── VendorManagementService/             # Service 5: Vendor + Settlement + Delivery
│   │   │   ├── Controllers/
│   │   │   │   ├── VendorsController.cs
│   │   │   │   ├── KYCController.cs
│   │   │   │   ├── SettlementsController.cs
│   │   │   │   └── DeliveriesController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IVendorService.cs
│   │   │   │   │   ├── IKYCService.cs
│   │   │   │   │   ├── ISettlementService.cs
│   │   │   │   │   └── IDeliveryService.cs
│   │   │   │   ├── VendorService.cs
│   │   │   │   ├── KYCService.cs
│   │   │   │   ├── SettlementService.cs         # Settlement calculation logic
│   │   │   │   └── DeliveryService.cs           # OTP, proof of delivery
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IVendorRepository.cs
│   │   │   │   │   ├── IKYCDocumentRepository.cs
│   │   │   │   │   ├── ISettlementRepository.cs
│   │   │   │   │   ├── IDeliveryRepository.cs
│   │   │   │   │   └── IDeliveryOtpRepository.cs
│   │   │   │   ├── VendorRepository.cs
│   │   │   │   ├── KYCDocumentRepository.cs
│   │   │   │   ├── SettlementRepository.cs
│   │   │   │   ├── DeliveryRepository.cs
│   │   │   │   └── DeliveryOtpRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── Vendor.cs
│   │   │   │   │   ├── VendorKYCDocument.cs
│   │   │   │   │   ├── Settlement.cs
│   │   │   │   │   ├── SettlementLineItem.cs
│   │   │   │   │   ├── Delivery.cs
│   │   │   │   │   ├── DeliveryStatusHistory.cs
│   │   │   │   │   ├── DeliveryProof.cs
│   │   │   │   │   └── DeliveryOtpLog.cs
│   │   │   │   ├── DTOs/
│   │   │   │   │   ├── VendorDto.cs
│   │   │   │   │   ├── SettlementDto.cs
│   │   │   │   │   └── DeliveryDto.cs
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── VendorOnboardingRequest.cs
│   │   │   │   │   ├── SubmitKYCRequest.cs
│   │   │   │   │   └── GenerateDeliveryOtpRequest.cs
│   │   │   │   └── Responses/
│   │   │   │       ├── VendorResponse.cs
│   │   │   │       ├── SettlementResponse.cs
│   │   │   │       └── DeliveryOtpResponse.cs
│   │   │   ├── Data/
│   │   │   │   ├── VendorManagementDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seeds/
│   │   │   ├── HttpClients/
│   │   │   │   ├── UserServiceClient.cs         # Calls User Service API
│   │   │   │   ├── OrderServiceClient.cs        # Calls Order Service API
│   │   │   │   └── NotificationServiceClient.cs # Calls Notification Service API
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Configuration/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── VendorManagementService.csproj
│   │   │
│   │   ├── NotificationService/                 # Service 6: Email + WhatsApp + SMS + Push
│   │   │   ├── Controllers/
│   │   │   │   ├── NotificationsController.cs
│   │   │   │   ├── TemplatesController.cs
│   │   │   │   └── PreferencesController.cs
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IEmailService.cs
│   │   │   │   │   ├── IWhatsAppService.cs
│   │   │   │   │   ├── ISmsService.cs
│   │   │   │   │   └── IPushNotificationService.cs
│   │   │   │   ├── EmailService.cs              # AWS SES integration
│   │   │   │   ├── WhatsAppService.cs           # WhatsApp Business API templates
│   │   │   │   ├── SmsService.cs                # Twilio/AWS SNS
│   │   │   │   └── PushNotificationService.cs   # Firebase Cloud Messaging
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── INotificationRepository.cs
│   │   │   │   │   ├── ITemplateRepository.cs
│   │   │   │   │   ├── IPreferencesRepository.cs
│   │   │   │   │   └── IFcmTokenRepository.cs
│   │   │   │   ├── NotificationRepository.cs
│   │   │   │   ├── TemplateRepository.cs
│   │   │   │   ├── PreferencesRepository.cs
│   │   │   │   └── FcmTokenRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── Notification.cs
│   │   │   │   │   ├── NotificationTemplate.cs
│   │   │   │   │   ├── UserNotificationPreferences.cs
│   │   │   │   │   └── FcmToken.cs
│   │   │   │   ├── DTOs/
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── SendEmailRequest.cs
│   │   │   │   │   ├── SendWhatsAppRequest.cs
│   │   │   │   │   └── SendPushRequest.cs
│   │   │   │   └── Responses/
│   │   │   ├── Data/
│   │   │   │   ├── NotificationServiceDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seeds/
│   │   │   ├── Configuration/
│   │   │   │   ├── SESSettings.cs
│   │   │   │   ├── WhatsAppSettings.cs
│   │   │   │   ├── TwilioSettings.cs
│   │   │   │   └── FCMSettings.cs
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── NotificationService.csproj
│   │   │
│   │   ├── IntegrationService/                  # Service 7: WhatsApp Bot + Media + Location
│   │   │   ├── Controllers/
│   │   │   │   ├── WhatsAppWebhookController.cs # WhatsApp webhook handler
│   │   │   │   ├── MediaController.cs           # Media upload to S3
│   │   │   │   └── LocationController.cs        # Google Maps integration
│   │   │   ├── Services/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IWhatsAppBotService.cs
│   │   │   │   │   ├── IMessageParser.cs
│   │   │   │   │   ├── IIntentRecognizer.cs
│   │   │   │   │   ├── IMediaService.cs
│   │   │   │   │   ├── IGeocodeService.cs
│   │   │   │   │   └── IDistanceService.cs
│   │   │   │   ├── WhatsAppBotService.cs        # Bot orchestration
│   │   │   │   ├── MessageParser.cs             # Parse WhatsApp messages
│   │   │   │   ├── IntentRecognizer.cs          # Detect user intent
│   │   │   │   ├── ConversationStateManager.cs  # Manage conversation state
│   │   │   │   ├── WhatsAppApiClient.cs         # WhatsApp Cloud API client
│   │   │   │   ├── S3MediaService.cs            # Upload to S3
│   │   │   │   ├── GeocodeService.cs            # Google Maps Geocoding
│   │   │   │   └── DistanceService.cs           # Google Maps Distance Matrix
│   │   │   ├── Repositories/
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IConversationRepository.cs
│   │   │   │   │   ├── IMessageRepository.cs
│   │   │   │   │   ├── IMediaFileRepository.cs
│   │   │   │   │   └── ILocationCacheRepository.cs
│   │   │   │   ├── ConversationRepository.cs
│   │   │   │   ├── MessageRepository.cs
│   │   │   │   ├── MediaFileRepository.cs
│   │   │   │   └── LocationCacheRepository.cs
│   │   │   ├── Models/
│   │   │   │   ├── Entities/
│   │   │   │   │   ├── WhatsAppConversation.cs
│   │   │   │   │   ├── WhatsAppMessage.cs
│   │   │   │   │   ├── MediaFile.cs
│   │   │   │   │   ├── LocationCache.cs
│   │   │   │   │   └── ServiceAreaPolygon.cs
│   │   │   │   ├── DTOs/
│   │   │   │   │   ├── WhatsAppWebhookPayload.cs
│   │   │   │   │   ├── IntentResult.cs
│   │   │   │   │   └── GeocodeResult.cs
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── UploadMediaRequest.cs
│   │   │   │   │   ├── GeocodeRequest.cs
│   │   │   │   │   └── CalculateDistanceRequest.cs
│   │   │   │   └── Responses/
│   │   │   │       ├── MediaUploadResponse.cs
│   │   │   │       └── DistanceResponse.cs
│   │   │   ├── Data/
│   │   │   │   ├── IntegrationServiceDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seeds/
│   │   │   ├── HttpClients/
│   │   │   │   ├── UserServiceClient.cs
│   │   │   │   ├── OrderServiceClient.cs
│   │   │   │   ├── VendorServiceClient.cs
│   │   │   │   └── NotificationServiceClient.cs
│   │   │   ├── Configuration/
│   │   │   │   ├── WhatsAppSettings.cs
│   │   │   │   ├── S3Settings.cs
│   │   │   │   └── GoogleMapsSettings.cs
│   │   │   ├── Middleware/
│   │   │   ├── Extensions/
│   │   │   ├── Validators/
│   │   │   ├── Dockerfile
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── IntegrationService.csproj
│   │   │
│   │   └── AnalyticsService/                    # Service 8: Analytics (OPTIONAL - Week 10+)
│   │       ├── Controllers/
│   │       │   ├── DashboardController.cs
│   │       │   └── ReportsController.cs
│   │       ├── Services/
│   │       │   ├── Interfaces/
│   │       │   │   ├── IDashboardService.cs
│   │       │   │   └── IReportService.cs
│   │       │   ├── DashboardService.cs
│   │       │   └── ReportService.cs
│   │       ├── Models/
│   │       │   ├── DTOs/
│   │       │   │   ├── OrderMetricsDto.cs
│   │       │   │   ├── RevenueMetricsDto.cs
│   │       │   │   └── VendorPerformanceDto.cs
│   │       │   ├── Requests/
│   │       │   └── Responses/
│   │       ├── HttpClients/
│   │       │   ├── OrderServiceClient.cs        # Read-only access to Order DB
│   │       │   ├── PaymentServiceClient.cs      # Read-only access to Payment DB
│   │       │   └── VendorServiceClient.cs       # Read-only access to Vendor DB
│   │       ├── Configuration/
│   │       │   └── DatabaseSettings.cs          # Read-replica connection strings
│   │       ├── Middleware/
│   │       ├── Extensions/
│   │       ├── Dockerfile
│   │       ├── Program.cs
│   │       ├── appsettings.json
│   │       └── AnalyticsService.csproj
│   │
│   └── shared/
│       │
│       ├── RealServ.Shared.Domain/
│       │   ├── Entities/
│       │   │   ├── BaseEntity.cs
│       │   │   ├── AuditableEntity.cs
│       │   │   └── ISoftDelete.cs
│       │   ├── Enums/
│       │   │   ├── OrderStatus.cs
│       │   │   ├── PaymentStatus.cs
│       │   │   ├── PaymentMethod.cs
│       │   │   ├── UserType.cs
│       │   │   ├── DeliveryStatus.cs
│       │   │   ├── VendorStatus.cs
│       │   │   └── KYCStatus.cs
│       │   ├── Events/
│       │   │   ├── DomainEvent.cs
│       │   │   ├── OrderCreatedEvent.cs
│       │   │   ├── OrderConfirmedEvent.cs
│       │   │   ├── PaymentCapturedEvent.cs
│       │   │   ├── CODCollectedEvent.cs
│       │   │   ├── DeliveryCompletedEvent.cs
│       │   │   └── SettlementGeneratedEvent.cs
│       │   ├── Exceptions/
│       │   │   ├── DomainException.cs
│       │   │   ├── NotFoundException.cs
│       │   │   ├── ValidationException.cs
│       │   │   ├── UnauthorizedException.cs
│       │   │   └── BusinessRuleException.cs
│       │   ├── Interfaces/
│       │   │   ├── IRepository.cs
│       │   │   ├── IUnitOfWork.cs
│       │   │   ├── IDomainEventDispatcher.cs
│       │   │   └── IAggregateRoot.cs
│       │   └── RealServ.Shared.Domain.csproj
│       │
│       ├── RealServ.Shared.Infrastructure/
│       │   ├── Authentication/
│       │   │   ├── FirebaseAuthHandler.cs
│       │   │   ├── FirebaseTokenValidator.cs
│       │   │   └── AuthenticationExtensions.cs
│       │   ├── Caching/
│       │   │   ├── RedisCacheService.cs
│       │   │   └── ICacheService.cs
│       │   ├── Database/
│       │   │   ├── BaseDbContext.cs
│       │   │   ├── ConnectionFactory.cs
│       │   │   └── DatabaseExtensions.cs
│       │   ├── EventBus/
│       │   │   ├── EventBridgePublisher.cs
│       │   │   ├── SqsEventConsumer.cs
│       │   │   └── IEventPublisher.cs
│       │   ├── Logging/
│       │   │   ├── SerilogConfiguration.cs
│       │   │   └── CorrelationIdMiddleware.cs
│       │   ├── Messaging/
│       │   │   ├── SqsMessageQueue.cs
│       │   │   └── IMessageQueue.cs
│       │   ├── Storage/
│       │   │   ├── S3StorageService.cs
│       │   │   └── IStorageService.cs
│       │   ├── HttpClients/
│       │   │   ├── ServiceHttpClient.cs         # Base HTTP client for inter-service calls
│       │   │   ├── ResilientHttpClient.cs       # Polly retry policies
│       │   │   └── HttpClientExtensions.cs
│       │   ├── Middleware/
│       │   │   ├── GlobalExceptionHandler.cs
│       │   │   ├── RequestLoggingMiddleware.cs
│       │   │   └── RequestTimingMiddleware.cs
│       │   └── RealServ.Shared.Infrastructure.csproj
│       │
│       └── RealServ.Shared.Application/
│           ├── Behaviors/
│           │   ├── ValidationBehavior.cs
│           │   ├── LoggingBehavior.cs
│           │   └── PerformanceBehavior.cs
│           ├── Extensions/
│           │   ├── StringExtensions.cs
│           │   ├── DateTimeExtensions.cs
│           │   ├── EnumExtensions.cs
│           │   └── DecimalExtensions.cs
│           ├── Helpers/
│           │   ├── PasswordHasher.cs
│           │   ├── OtpGenerator.cs
│           │   ├── SignatureValidator.cs
│           │   └── OrderNumberGenerator.cs
│           ├── Models/
│           │   ├── PagedResult.cs
│           │   ├── ApiResponse.cs
│           │   ├── ErrorResponse.cs
│           │   └── PaginationRequest.cs
│           ├── Validators/
│           │   ├── PhoneNumberValidator.cs
│           │   ├── EmailValidator.cs
│           │   ├── PincodeValidator.cs
│           │   └── GSTINValidator.cs
│           └── RealServ.Shared.Application.csproj
│
└── tests/
    ├── unit/
    │   ├── UserService.Tests/
    │   │   ├── Controllers/
    │   │   │   ├── AuthControllerTests.cs
    │   │   │   └── UsersControllerTests.cs
    │   │   ├── Services/
    │   │   │   ├── AuthServiceTests.cs
    │   │   │   └── UserServiceTests.cs
    │   │   ├── Repositories/
    │   │   │   └── UserRepositoryTests.cs
    │   │   ├── Helpers/
    │   │   │   └── TestDataBuilder.cs
    │   │   └── UserService.Tests.csproj
    │   ├── OrderService.Tests/
    │   │   └── [Same structure]
    │   ├── PaymentService.Tests/
    │   │   └── [Same structure]
    │   ├── CatalogService.Tests/
    │   │   └── [Same structure]
    │   ├── VendorManagementService.Tests/
    │   │   └── [Same structure]
    │   ├── NotificationService.Tests/
    │   │   └── [Same structure]
    │   ├── IntegrationService.Tests/
    │   │   └── [Same structure]
    │   └── Shared.Tests/
    │       ├── Domain.Tests/
    │       ├── Infrastructure.Tests/
    │       └── Application.Tests/
    │
    ├── integration/
    │   └── IntegrationTests/
    │       ├── UserManagement/
    │       │   ├── UserRegistrationTests.cs
    │       │   └── UserAuthenticationTests.cs
    │       ├── Order/
    │       │   ├── OrderCreationTests.cs
    │       │   ├── OrderPaymentTests.cs
    │       │   └── OrderDeliveryTests.cs
    │       ├── Payment/
    │       │   ├── RazorpayIntegrationTests.cs
    │       │   ├── WebhookHandlingTests.cs
    │       │   └── CODPaymentTests.cs
    │       ├── VendorManagement/
    │       │   ├── VendorOnboardingTests.cs
    │       │   ├── KYCApprovalTests.cs
    │       │   └── SettlementGenerationTests.cs
    │       ├── WhatsAppBot/
    │       │   ├── MessageParsingTests.cs
    │       │   └── IntentRecognitionTests.cs
    │       ├── Fixtures/
    │       │   ├── DatabaseFixture.cs
    │       │   ├── ApiFixture.cs
    │       │   └── ServiceCollectionFixture.cs
    │       ├── Helpers/
    │       │   └── HttpClientExtensions.cs
    │       └── IntegrationTests.csproj
    │
    └── e2e/
        └── E2ETests/
            ├── Scenarios/
            │   ├── BuyerOrderToDeliveryScenario.cs
            │   ├── VendorOnboardingToFirstOrderScenario.cs
            │   ├── PaymentRefundScenario.cs
            │   └── WhatsAppBotOrderScenario.cs
            └── E2ETests.csproj
```

---

## File Count Summary (Updated for 7-8 Services)

| Category | Count |
|----------|-------:|
| **Microservices** | 7-8 |
| **Shared Libraries** | 3 |
| **Test Projects** | 10+ |
| **Configuration Files** | 13 |
| **Documentation Files** | 20+ |
| **Infrastructure Scripts** | 15+ |
| **CI/CD Workflows** | 8 |
| **Databases** | 7-8 |

---

## Service Consolidation Summary

### Original 13 Services → MVP 7-8 Services

| Original Services | Consolidated Into | Rationale |
|-------------------|-------------------|-----------|
| User Management Service + Buyer Service | **User Service** | Buyers are users with role="buyer" |
| Order Service + Support Service | **Order Service** | 90% of support tickets are order-related |
| Payment Service ✅ | **Payment Service** | Keep separate (critical financial operations) |
| Catalog Service ✅ | **Catalog Service** | Keep separate (shared resource) |
| Vendor Service + Settlement Service + Delivery Service | **Vendor Management Service** | Tightly coupled vendor lifecycle |
| Notification Service ✅ | **Notification Service** | Keep separate (used by all services) |
| WhatsApp Gateway + Media Service + Location Service | **Integration Service** | All external API integrations |
| Analytics Service *(new)* | **Analytics Service (Optional)** | Add in Week 10+ for admin dashboard |

---

## Total Lines of Code (Estimated for 7-8 Services)

- **Services**: ~35,000 lines (7-8 services × ~5,000 lines each)
- **Shared Libraries**: ~5,000 lines
- **Tests**: ~15,000 lines
- **Infrastructure**: ~2,000 lines (Terraform, Docker)
- **Scripts**: ~1,000 lines
- **Documentation**: ~120 pages

**Total**: ~58,000 lines of code + 120 pages of documentation

*(vs. ~78,000 lines + 150 pages for 13 services)*

---

## Naming Conventions

### Files
- **C# Files**: PascalCase (e.g., `UserService.cs`, `OrderController.cs`)
- **Config Files**: lowercase with dots (e.g., `appsettings.json`, `docker-compose.yml`)
- **Scripts**: lowercase with dashes (e.g., `deploy-dev.sh`, `init-databases.sh`)

### Folders
- **Services**: PascalCase (e.g., `UserService/`, `OrderService/`)
- **Infrastructure**: lowercase (e.g., `terraform/`, `docker/`)
- **Documentation**: lowercase (e.g., `docs/`, `scripts/`)

### Projects
- **Services**: `ServiceName` (e.g., `UserService`, `OrderService`)
- **Shared**: `RealServ.Shared.LayerName` (e.g., `RealServ.Shared.Domain`)
- **Tests**: `ServiceName.Tests` (e.g., `UserService.Tests`)

### Databases
- **Pattern**: `realserv_{service}_db` (e.g., `realserv_users_db`, `realserv_orders_db`)

---

## Architecture Patterns Used

- ✅ **Clean Architecture** - Separation of concerns (Domain, Application, Infrastructure)
- ✅ **Repository Pattern** - Data access abstraction
- ✅ **Unit of Work** - Transaction management
- ✅ **CQRS** (optional) - Command/Query separation for complex operations
- ✅ **Event Sourcing** (optional) - Audit trail for critical entities (orders, payments)
- ✅ **Circuit Breaker** - Fault tolerance (via Polly)
- ✅ **Retry Pattern** - Transient failure handling
- ✅ **API Gateway Pattern** - Single entry point (AWS API Gateway + ALB)
- ✅ **Service Mesh** (future) - Istio/Linkerd for advanced routing
- ✅ **Saga Pattern** - Distributed transactions (order → payment → delivery)

---

## Service Communication Patterns

### Inter-Service Communication

```csharp
// Example: Order Service calling User Service
public class UserServiceClient
{
    private readonly HttpClient _httpClient;
    
    public UserServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    public async Task<UserDto> GetUserAsync(Guid userId)
    {
        var response = await _httpClient.GetAsync($"/api/v1/users/{userId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<UserDto>();
    }
}

// Registration in Program.cs
builder.Services.AddHttpClient<UserServiceClient>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:UserService:BaseUrl"]);
})
.AddPolicyHandler(GetRetryPolicy())
.AddPolicyHandler(GetCircuitBreakerPolicy());
```

### Event-Driven Communication

```csharp
// Example: Payment Service publishes event when payment is captured
await _eventBus.PublishAsync(new PaymentCapturedEvent
{
    PaymentId = payment.Id,
    OrderId = payment.OrderId,
    Amount = payment.Amount,
    CapturedAt = DateTime.UtcNow
});

// Order Service subscribes to PaymentCapturedEvent
public class PaymentCapturedEventHandler : IEventHandler<PaymentCapturedEvent>
{
    public async Task HandleAsync(PaymentCapturedEvent @event)
    {
        await _orderService.MarkOrderAsPaidAsync(@event.OrderId);
    }
}
```

---

## Migration Path to Full Microservices

When you reach **1,000+ daily orders** or have **5+ backend engineers**, you can split services:

### Phase 1 → Phase 2 (10-12 services)

1. **Vendor Management Service** → Split into:
   - Vendor Service (onboarding, KYC, profiles)
   - Settlement Service (earnings, payouts)
   - Delivery Service (tracking, OTP, proof)

2. **Integration Service** → Split into:
   - WhatsApp Gateway Service (conversational interface)
   - Media Service (S3 uploads)
   - Location Service (Google Maps)

### Phase 2 → Phase 3 (13+ services)

3. **User Service** → Split into:
   - User Management Service (auth, core profiles)
   - Buyer Service (buyer-specific features)

4. **Order Service** → Split into:
   - Order Service (core order logic)
   - Support Service (tickets, disputes)

**Total effort**: 3-4 weeks per split

---

## Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/realserv/backend.git
cd backend

# 2. Start local databases and services
docker-compose up -d

# 3. Run migrations
./scripts/migrations/run-migrations.sh

# 4. Seed data
./scripts/seeds/seed-data.sh

# 5. Run a specific service
cd src/services/UserService
dotnet run
```

### Running All Services Locally

```bash
# All 7 services will be available at:
# User Service:              http://localhost:5001
# Order Service:             http://localhost:5002
# Payment Service:           http://localhost:5003
# Catalog Service:           http://localhost:5004
# Vendor Management Service: http://localhost:5005
# Notification Service:      http://localhost:5006
# Integration Service:       http://localhost:5007
# Analytics Service:         http://localhost:5008 (optional)
```

---

## Docker Compose Configuration

The `docker-compose.yml` file defines:
- 7-8 service containers
- 7-8 PostgreSQL database containers
- 1 Redis container (optional)
- 1 LocalStack container (for local AWS services)

**Total containers**: 16-18 (vs. 28+ for 13 services)

---

## Next Steps

1. ✅ Review this MVP-optimized folder structure
2. ⏳ Create actual project files and solution structure
3. ⏳ Implement Week 1: Infrastructure + User Service
4. ⏳ Build remaining services incrementally (Weeks 2-9)
5. ⏳ Testing and deployment (Week 10)

---

## Cost Savings Summary

| Metric | 13 Services | 7-8 Services (MVP) | **Savings** |
|--------|-------------|--------------------|--------------------|
| **Development Time** | 15 weeks | 10 weeks | **5 weeks (33%)** |
| **Team Size** | 7 engineers | 4-5 engineers | **2-3 engineers** |
| **AWS Cost** | $700-900/month | $400-500/month | **$200-400/month** |
| **Databases** | 13 | 7-8 | **5-6 databases** |
| **Lines of Code** | ~78,000 | ~58,000 | **~20,000 lines** |
| **Complexity** | Very High | Medium | **Lower operational overhead** |

---

**This structure is production-ready, maintainable, and provides a clear upgrade path to full microservices when needed.** 🚀
