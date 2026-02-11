# RealServ Backend Implementation Plan
## 10-Week MVP Development Roadmap (MVP-Optimized)

**Version:** 3.1 - MVP-Optimized (7-8 Services)  
**Status:** Week 1 Complete + CloudWatch Integrated  
**Last Updated:** January 11, 2026  
**Project Duration:** 10 weeks  
**Target Go-Live:** March 21, 2026

---

## Current Progress: Week 2, Day 1-3 COMPLETE - Catalog Service (January 11, 2026)

**Phase**: Foundation (Weeks 1-2)  
**Current Sprint**: Catalog Service + Order Service Foundation  
**Started**: January 10, 2026  
**Status**: Week 1 Complete + CloudWatch + Catalog Service COMPLETE ✅

### ✅ Completed Tasks (Week 1 + Week 2 Day 1-3)

**Shared Libraries** (Day 1-2):
- [x] Created RealServ.Shared.Domain project
- [x] Created BaseEntity and AuditableEntity classes
- [x] Created domain enums (UserType, OrderStatus, PaymentStatus)
- [x] Created domain exceptions (NotFoundException, ValidationException, etc.)
- [x] Created RealServ.Shared.Application project
- [x] Created ApiResponse and PagedResult models

**CloudWatch Observability** (Day 6 - January 11):
- [x] Created RealServ.Shared.Observability project
- [x] Implemented CloudWatch logging with Serilog
- [x] Implemented CloudWatch metrics publisher
- [x] Created BusinessMetricsService for domain metrics
- [x] Built RequestLoggingMiddleware
- [x] Built ExceptionLoggingMiddleware
- [x] Created ServiceCollection extensions
- [x] Documented 40+ CloudWatch alarms
- [x] Created comprehensive setup guide
- [x] Integrated CloudWatch into Identity Service

**Identity Service - Project Setup** (Day 1-3):
- [x] Created IdentityService project structure with .NET 8.0
- [x] Created User, BuyerProfile, DeliveryAddress, AdminProfile, UserSession entities
- [x] Created Program.cs with complete DI configuration
- [x] Created appsettings.json configuration files
- [x] Installed NuGet packages (EF Core, PostgreSQL, Firebase, Swashbuckle)
- [x] Created Dockerfile for containerization
- [x] Created docker-compose.dev.yml for local development

**Identity Service - Database Layer** (Day 3-4):
- [x] Created IdentityServiceDbContext with complete entity configurations
- [x] Configured PostgreSQL with snake_case column names
- [x] Created indexes for performance (firebase_uid, phone_number, email)
- [x] Configured relationships (User -> BuyerProfile, User -> AdminProfile)
- [x] Set up auto-migration on startup (development only)

**Identity Service - Repositories** (Day 4):
- [x] Created IUserRepository and UserRepository
- [x] Created IBuyerRepository and BuyerRepository
- [x] Created IAddressRepository and AddressRepository
- [x] Implemented soft delete pattern
- [x] Implemented default address management logic

**Identity Service - Business Logic** (Day 4):
- [x] Created IAuthService and AuthService
- [x] Implemented user registration with Firebase UID
- [x] Implemented automatic buyer profile creation
- [x] Created IBuyerService and BuyerService
- [x] Implemented delivery address CRUD operations
- [x] Implemented default address toggle logic

**Identity Service - API Controllers** (Day 5):
- [x] Created AuthController with 3 endpoints
- [x] Created BuyersController with 10 endpoints
- [x] Implemented standardized ApiResponse wrapper
- [x] Added Swagger/OpenAPI documentation
- [x] Configured CORS for development

**Identity Service - DTOs** (Day 5):
- [x] Created RegisterUserRequest, UserResponse, UpdateUserRequest
- [x] Created BuyerProfileDto and CRUD request DTOs
- [x] Created DeliveryAddressDto and CRUD request DTOs
- [x] Created AdminProfileDto and LoginResponse

**Documentation & DevOps** (Day 5):
- [x] Created comprehensive README.md for Identity Service
- [x] Created .gitignore with security best practices
- [x] Documented all API endpoints
- [x] Added database migration instructions

### 🎯 Week 1 Deliverables - ALL COMPLETE

- [✅] Identity Service project fully implemented
- [✅] Firebase Auth integration configured
- [✅] PostgreSQL database context created
- [✅] 13 API endpoints implemented
- [✅] Repositories and services layer complete
- [✅] Docker support with docker-compose
- [✅] Swagger documentation generated
- [✅] Ready for database migration and testing

### ⏳ Next Steps (Week 1 Completion & Week 2)

**Week 1 Final Tasks**:
- [ ] Generate initial database migration (`dotnet ef migrations add InitialCreate`)
- [ ] Test Identity Service locally with Docker Compose
- [ ] Test API endpoints with Postman/Swagger
- [ ] Verify Firebase authentication flow
- [ ] Run health checks

**Week 2 Preview**:
- [ ] Start Catalog Service implementation
- [ ] Start Order Service foundation
- [ ] Integration testing between services
- [ ] Set up AWS infrastructure (if DevOps ready)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Team Structure](#team-structure)
3. [Pre-Implementation Setup](#pre-implementation-setup)
4. [Week-by-Week Implementation Plan](#week-by-week-implementation-plan)
5. [Progress Tracking](#progress-tracking)
6. [Risk Management](#risk-management)
7. [Communication Plan](#communication-plan)
8. [Quality Assurance](#quality-assurance)
9. [Deployment Checklist](#deployment-checklist)

---

## Project Overview

### Objectives
- Build production-ready backend for RealServ marketplace
- Support 4 client channels: Buyer Mobile, Vendor Web, Vendor WhatsApp, Admin Web
- Implement **7-8 microservices** (MVP-optimized) with full CRUD operations
- Integrate Razorpay (payments), WhatsApp Cloud API, Google Maps API
- Deploy to AWS with auto-scaling and monitoring
- Go live with MVP in **10 weeks** (vs. 15 weeks with 13 services)

### Architecture Philosophy

**Why 7-8 Services Instead of 13?**
- ✅ **Faster time-to-market**: 10 weeks vs. 15 weeks
- ✅ **Lower costs**: $400-500/month vs. $700-900/month
- ✅ **Smaller team**: 4-5 engineers vs. 7 engineers
- ✅ **Respects domain boundaries**: Critical services (payment, auth) isolated
- ✅ **Pragmatic consolidation**: Tightly-coupled domains combined
- ✅ **Clear upgrade path**: Can split into 13+ services post-PMF

### Success Criteria
- [ ] All 7-8 services deployed and operational
- [ ] End-to-end order flow working (order → payment → delivery)
- [ ] WhatsApp bot functional for vendor interactions
- [ ] Admin dashboard showing real-time analytics
- [ ] 99.5% uptime SLA (relaxed for MVP)
- [ ] Response time < 800ms (p95)
- [ ] Zero critical security vulnerabilities

### Key Metrics
| Metric | Target |
|--------|--------|
| Services Deployed | 7-8/8 |
| API Endpoints | ~90 |
| Database Tables | ~60 |
| Unit Test Coverage | >70% (relaxed for MVP) |
| Integration Tests | >30 critical flows |
| Load Test Capacity | 500 concurrent users |

---

## Team Structure

### Recommended Team Composition (MVP-Optimized)

#### Core Team (Minimum)
```
1. Tech Lead / Architect         (1 person)
2. Senior Backend Engineers      (2 people)
3. Backend Engineers             (1-2 people)
4. DevOps Engineer              (1 person)
```

**Total Core**: 5-6 people (vs. 7-9 for 13 services)

#### Extended Team (Optional)
```
5. QA Engineer                  (0.5 person - part-time)
6. Product Manager              (0.5 person - part-time)
```

**Total**: 5-7 people

### Role Responsibilities (7-8 Service Architecture)

**Tech Lead / Architect**:
- Architecture decisions and reviews
- Code reviews (all critical PRs)
- Technical debt management
- Performance optimization
- External integration ownership (Razorpay, Google Maps, WhatsApp)

**Senior Backend Engineer #1** (Core Business Services):
- User Service (User + Buyer)
- Order Service (Order + Support)
- Payment Service (Razorpay + COD)

**Senior Backend Engineer #2** (Supporting Services):
- Catalog Service (Materials + Labor)
- Vendor Management Service (Vendor + Settlement + Delivery)

**Backend Engineer #1** (Integration Services):
- Notification Service (Email + WhatsApp + SMS + Push)
- Integration Service (WhatsApp Bot + Media + Location)

**Backend Engineer #2** *(Optional - can be covered by others)*:
- Analytics Service (Week 10+, optional)
- Shared libraries maintenance
- Testing support

**DevOps Engineer**:
- AWS infrastructure setup (7-8 databases, 7-8 ECS services)
- ECS deployment automation
- CI/CD pipelines (7-8 service pipelines)
- Monitoring and alerting
- Database migrations
- Secrets management

---

## Pre-Implementation Setup

### Week 0: Account Setup & Preparation (Before Week 1)

**Duration**: 3-5 business days  
**Owner**: Tech Lead + DevOps Engineer

#### External Accounts Setup

**1. AWS Account** (Day 1)
```
Tasks:
- [ ] Create AWS account (or use existing)
- [ ] Enable MFA for root account
- [ ] Create IAM users for team (with least privilege)
- [ ] Set up billing alerts ($300, $600, $900)
- [ ] Create Cost Explorer budget
- [ ] Request service limit increases:
      - ECS tasks: 50 per region (reduced from 100)
      - RDS instances: 10 per region (reduced from 20)
      - S3 buckets: 50

Documentation:
- Store AWS account ID: _______________
- Root email: _______________________
- IAM users created: [ ] Tech Lead [ ] DevOps [ ] Engineers
```

**2. Firebase Project** (Day 1)
```
Tasks:
- [ ] Create Firebase project (2 projects: test + prod)
- [ ] Enable Phone Authentication
- [ ] Enable Email/Password Authentication
- [ ] Download Firebase Admin SDK JSON (store in AWS Secrets Manager)
- [ ] Configure authorized domains
- [ ] Set up Firebase Analytics (optional)

Test Environment:
- Project ID: realserv-mvp-test
- Project URL: _______________________

Production Environment:
- Project ID: realserv-mvp
- Project URL: _______________________

Store Credentials:
- [ ] firebase-admin-sdk-test.json → AWS Secrets Manager
- [ ] firebase-admin-sdk-prod.json → AWS Secrets Manager
```

**3. Razorpay Account** (Day 1-2)
```
Tasks:
- [ ] Create Razorpay account
- [ ] Complete business KYC (may take 1-2 days)
- [ ] Enable Test Mode
- [ ] Generate Test API Keys (Key ID + Secret)
- [ ] Generate Live API Keys (after KYC approval)
- [ ] Configure webhook URL (to be set in Week 5)
- [ ] Enable payment methods: UPI, Cards, Wallets, Net Banking
- [ ] Set up settlement schedule (T+3 recommended)

Test Mode:
- Key ID: rzp_test_________________
- Key Secret: (store in AWS Secrets Manager)

Live Mode:
- Key ID: rzp_live_________________
- Key Secret: (store in AWS Secrets Manager)

Webhook Secret:
- Test: whsec_test_______________
- Live: whsec_live_______________
```

**4. WhatsApp Business Account** (Day 2-3)
```
Tasks:
- [ ] Create Meta Business Manager account
- [ ] Create WhatsApp Business Account
- [ ] Add phone number for WhatsApp API
- [ ] Verify phone number
- [ ] Request access to WhatsApp Cloud API
- [ ] Get Business Account ID
- [ ] Get Phone Number ID
- [ ] Generate Permanent Access Token
- [ ] Set webhook verify token
- [ ] Configure webhook URL (to be set in Week 9)

Credentials:
- Business Account ID: _______________
- Phone Number ID: _______________
- Phone Number: +91_______________
- Access Token: (store in AWS Secrets Manager)
- Webhook Verify Token: (generate random, store in AWS Secrets Manager)

Note: Approval may take 1-3 days
```

**5. Google Cloud Project** (Day 1)
```
Tasks:
- [ ] Create Google Cloud project
- [ ] Enable Billing
- [ ] Enable Geocoding API
- [ ] Enable Distance Matrix API
- [ ] Enable Places API (optional, for autocomplete)
- [ ] Create API Key
- [ ] Restrict API Key:
      - Application restrictions: IP addresses (AWS ECS IPs)
      - API restrictions: Only enabled APIs
- [ ] Set up billing alerts ($30, $60, $90)

Project Details:
- Project ID: realserv-maps
- API Key: (store in AWS Secrets Manager)

Restrictions:
- Allowed IPs: (add ECS NAT Gateway IPs in Week 1)
```

**6. Domain & Email** (Day 1)
```
Tasks:
- [ ] Register domain: realserv.com (or your choice)
- [ ] Set up AWS Route 53 hosted zone
- [ ] Configure nameservers
- [ ] Set up email addresses:
      - admin@realserv.com
      - support@realserv.com
      - noreply@realserv.com
- [ ] Verify domain with AWS SES
- [ ] Move domain out of SES sandbox

Domain:
- Domain name: realserv.com
- Registrar: _______________________
- Nameservers: (AWS Route 53)

Email Addresses:
- [ ] admin@realserv.com → verified in SES
- [ ] support@realserv.com → verified in SES
- [ ] noreply@realserv.com → verified in SES
```

**7. GitHub Repository** (Day 1)
```
Tasks:
- [ ] Create GitHub organization: RealServ
- [ ] Create repository: realserv-backend
- [ ] Set up branch protection (main branch):
      - Require PR before merge
      - Require 1 approval
      - Require status checks
- [ ] Create initial folder structure:
      /src/services
        /UserService
        /OrderService
        /PaymentService
        /CatalogService
        /VendorManagementService
        /NotificationService
        /IntegrationService
        /AnalyticsService (optional)
      /src/shared
        /RealServ.Shared.Domain
        /RealServ.Shared.Infrastructure
        /RealServ.Shared.Application
      /infrastructure
        /terraform (IaC)
        /docker
      /docs
        /api (OpenAPI specs)
        /architecture
        /runbooks
      /tests
        /unit
        /integration
        /e2e
      /.github
        /workflows (CI/CD - 7-8 pipelines)

Repository URL: https://github.com/RealServ/realserv-backend
```

**8. Monitoring & Logging** (Day 1)
```
Tasks:
- [ ] Set up Slack workspace (or Teams)
- [ ] Create channels:
      #backend-dev
      #backend-alerts
      #backend-deployments
      #backend-incidents
- [ ] Set up PagerDuty (optional) for on-call
- [ ] Configure AWS SNS for alerts
- [ ] Set up alert email: alerts@realserv.com

Alert Integrations:
- [ ] CloudWatch → SNS → Slack (#backend-alerts)
```

#### Development Environment Setup

**Local Development Stack** (Each Developer)
```
Required Software:
- [ ] .NET 8 SDK
- [ ] Docker Desktop
- [ ] PostgreSQL 16 (via Docker)
- [ ] Redis 7 (via Docker)
- [ ] Visual Studio 2022 / JetBrains Rider
- [ ] Postman / Insomnia (API testing)
- [ ] pgAdmin / DataGrip (database management)
- [ ] Git
- [ ] AWS CLI v2
- [ ] Firebase CLI

Docker Compose Setup:
- [ ] Create docker-compose.yml for local development
      - PostgreSQL (7-8 databases)
      - Redis
      - LocalStack (AWS emulation - optional)

IDE Plugins:
- [ ] EditorConfig
- [ ] C# extension
- [ ] Docker extension
- [ ] GitLens
```

#### Infrastructure as Code

**Terraform Setup** (DevOps)
```
Tasks:
- [ ] Initialize Terraform project
- [ ] Create modules:
      /modules
        /vpc
        /rds
        /ecs
        /s3
        /cloudwatch
        /alb
- [ ] Create environments:
      /environments
        /dev
        /staging
        /production
- [ ] Set up remote state (S3 + DynamoDB)
- [ ] Document Terraform commands

Initial Resources to Create:
- VPC with public/private subnets
- RDS PostgreSQL instances (7-8 databases)
- S3 buckets
- ECR repositories (7-8 repos)
- ECS cluster
- Application Load Balancer
```

---

## Week-by-Week Implementation Plan

### **PHASE 1: FOUNDATION (Weeks 1-2)**

---

### Week 1: Infrastructure + Identity Service

**Sprint Goal**: AWS infrastructure operational + Identity Service deployed with Firebase Auth

**Team Focus**: 
- DevOps: 100% on infrastructure (7-8 databases)
- Tech Lead: Identity Service architecture
- Senior BE #1: Identity Service implementation
- Backend Eng #1: Shared libraries

#### Day 1-2: AWS Infrastructure (DevOps)

**Tasks**:
```
VPC Setup:
- [ ] Create VPC (10.0.0.0/16)
- [ ] Create public subnets (2 AZs): 10.0.1.0/24, 10.0.2.0/24
- [ ] Create private subnets (2 AZs): 10.0.10.0/24, 10.0.11.0/24
- [ ] Create Internet Gateway
- [ ] Create NAT Gateway (1 for dev, 2 for prod)
- [ ] Configure route tables
- [ ] Create security groups:
      - alb-sg (HTTPS from 0.0.0.0/0)
      - ecs-sg (HTTP from ALB)
      - rds-sg (PostgreSQL from ECS)
      - redis-sg (Redis from ECS)

RDS PostgreSQL (7-8 databases):
- [ ] realserv_users_db (db.t4g.micro)
- [ ] realserv_orders_db (db.t4g.micro)
- [ ] realserv_payments_db (db.t4g.micro)
- [ ] realserv_catalog_db (db.t4g.micro)
- [ ] realserv_vendors_db (db.t4g.micro)
- [ ] realserv_notifications_db (db.t4g.micro)
- [ ] realserv_integrations_db (db.t4g.micro)
- [ ] realserv_analytics_db (optional - can add later)

Configuration per DB:
- Multi-AZ: No (dev), Yes (prod)
- Backup: 7-day retention
- Encryption: Enabled (KMS)
- Store credentials in AWS Secrets Manager

ElastiCache Redis (optional):
- [ ] Create Redis 7 cluster (cache.t4g.micro)
- [ ] Single node (dev), Multi-node (prod)
- [ ] Configure security group

S3 Buckets:
- [ ] Create buckets:
      - realserv-dev-media
      - realserv-dev-kyc-documents
      - realserv-dev-backups
- [ ] Enable versioning
- [ ] Configure lifecycle policies
- [ ] Set up CORS for media bucket

ECS Cluster:
- [ ] Create ECS cluster: realserv-dev
- [ ] Configure CloudWatch logging
- [ ] Create task execution role
- [ ] Create task role

Application Load Balancer:
- [ ] Create ALB
- [ ] Configure HTTPS listener (use ACM certificate)
- [ ] Create target groups (7-8, one per service)
- [ ] Configure health check paths

Secrets Manager:
- [ ] Store Firebase Admin SDK JSON
- [ ] Store Razorpay keys
- [ ] Store Google Maps API key
- [ ] Store WhatsApp credentials
- [ ] Store database credentials (7-8)
```

**Deliverables**:
- [ ] VPC with 4 subnets operational
- [ ] 7-8 RDS instances running
- [ ] 1 Redis cluster running
- [ ] S3 buckets created
- [ ] ECS cluster ready
- [ ] ALB configured
- [ ] All secrets stored

**Acceptance Criteria**:
- Can connect to all RDS databases from ECS
- Can connect to Redis from ECS
- Can upload file to S3
- ALB health check returns 200

---

#### Day 3-5: Identity Service (Tech Lead + Senior BE #1)

**Service Scope**: 
- User authentication (Firebase)
- User management (buyers, vendors, admins)
- Buyer profiles
- Delivery addresses
- Admin profiles

**Architecture Design** (Tech Lead - Day 3 morning):
```
- [ ] Review architecture document
- [ ] Create OpenAPI spec for Identity Service
- [ ] Design database schema
- [ ] Design error handling strategy
- [ ] Design logging strategy
- [ ] Review with team
```

**Implementation** (Senior BE #1 - Day 3-5):

**Day 3: Project Setup**
```
- [ ] Create IdentityService project (.NET 8)
- [ ] Set up Entity Framework Core
- [ ] Create DbContext for realserv_users_db
- [ ] Install packages:
      - FirebaseAdmin
      - Npgsql.EntityFrameworkCore.PostgreSQL
      - Serilog
      - FluentValidation
      - AutoMapper
- [ ] Configure appsettings.json
- [ ] Set up Dockerfile
```

**Day 4: Core Implementation**
```
User Authentication:
- [ ] AuthController (login, register, verify OTP)
- [ ] AuthService (Firebase integration)
- [ ] FirebaseTokenValidator middleware

User Management:
- [ ] User entity (id, firebase_uid, phone, email, user_type, status)
- [ ] BuyerProfile entity
- [ ] AdminProfile entity
- [ ] DeliveryAddress entity
- [ ] UserRepository
- [ ] BuyerRepository
- [ ] AddressRepository

Controllers:
- [ ] UsersController (GET, PUT, DELETE)
- [ ] BuyersController (profiles, addresses)
- [ ] AdminUsersController (admin management)

DTOs:
- [ ] RegisterUserRequest
- [ ] UserResponse
- [ ] BuyerDto
- [ ] AddressDto
```

**Day 5: Testing & Deployment**
```
- [ ] Write unit tests (IdentityService.Tests)
- [ ] Test Firebase Auth integration
- [ ] Run database migrations
- [ ] Build Docker image
- [ ] Push to ECR
- [ ] Deploy to ECS
- [ ] Test with Postman
- [ ] Document API (Swagger)
```

**Deliverables**:
- [ ] Identity Service deployed to ECS
- [ ] Firebase Auth working
- [ ] Can register buyer via phone OTP
- [ ] Can register vendor (basic profile)
- [ ] Can create admin users
- [ ] Swagger documentation live

**API Endpoints (Identity Service)**:
```
POST   /api/v1/auth/register              # Register user
POST   /api/v1/auth/verify-phone          # Verify phone OTP
GET    /api/v1/auth/me                    # Get current user
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}

POST   /api/v1/buyers                     # Create buyer profile
GET    /api/v1/buyers/{id}
PUT    /api/v1/buyers/{id}
GET    /api/v1/buyers/{id}/addresses
POST   /api/v1/buyers/{id}/addresses
PUT    /api/v1/buyers/{id}/addresses/{addressId}

POST   /api/v1/admin/users                # Create admin
GET    /api/v1/admin/users
```

**Acceptance Criteria**:
- [ ] Can register buyer via Postman
- [ ] Firebase token validation works
- [ ] Can create/update buyer addresses
- [ ] Can create admin users
- [ ] Health check endpoint returns 200

---

#### Parallel: Shared Libraries (Backend Eng #1 - Day 3-5)

**Tasks**:
```
RealServ.Shared.Domain:
- [ ] BaseEntity.cs
- [ ] Enums (OrderStatus, PaymentStatus, UserType, etc.)
- [ ] Domain Events (OrderCreatedEvent, PaymentCapturedEvent)
- [ ] Domain Exceptions (NotFoundException, ValidationException)
- [ ] IRepository interface

RealServ.Shared.Infrastructure:
- [ ] FirebaseAuthHandler
- [ ] FirebaseTokenValidator
- [ ] BaseDbContext
- [ ] GlobalExceptionHandler middleware
- [ ] RequestLoggingMiddleware
- [ ] SerilogConfiguration

RealServ.Shared.Application:
- [ ] PagedResult<T>
- [ ] ApiResponse<T>
- [ ] ErrorResponse
- [ ] StringExtensions
- [ ] DateTimeExtensions
- [ ] OtpGenerator
```

**Deliverables**:
- [ ] 3 shared library projects created
- [ ] Published as NuGet packages (local feed or GitHub Packages)
- [ ] Identity Service uses shared libraries

---

### Week 2: Catalog Service + Order Service Foundation

**Sprint Goal**: Catalog browsable + Order creation working (without payment)

**Team Focus**:
- Senior BE #1: Order Service
- Senior BE #2: Catalog Service
- Backend Eng #1: Testing + shared libraries

#### Day 1-3: Catalog Service (Senior BE #2)

**Service Scope**:
- Material catalog (cement, bricks, steel, etc.)
- Labor catalog (mason, carpenter, electrician, etc.)
- Categories
- Vendor inventory
- Vendor labor availability

**Implementation**:

**Day 1: Setup + Models**
```
- [ ] Create CatalogService project
- [ ] Set up EF Core for realserv_catalog_db
- [ ] Create entities:
      - Category (id, name, type, parent_id)
      - Material (id, category_id, name, base_price, unit)
      - LaborCategory (id, name, hourly_rate, daily_rate)
      - VendorInventory (vendor_id, material_id, is_available, stock)
      - VendorLaborAvailability (vendor_id, labor_id, is_available, workers)
```

**Day 2: Controllers + Repositories**
```
- [ ] MaterialsController (GET list, GET by ID, POST, PUT, DELETE)
- [ ] LaborController
- [ ] CategoriesController
- [ ] InventoryController (vendor inventory management)
- [ ] MaterialRepository
- [ ] LaborRepository
- [ ] CategoryRepository
- [ ] VendorInventoryRepository
```

**Day 3: Seed Data + Deployment**
```
- [ ] Create seed data:
      - Material categories (cement, bricks, steel, sand, aggregates)
      - Materials (50+ items)
      - Labor categories (mason, carpenter, electrician, plumber, painter)
- [ ] Run migrations
- [ ] Write unit tests
- [ ] Deploy to ECS
- [ ] Test with Postman
```

**API Endpoints (Catalog Service)**:
```
GET    /api/v1/materials
GET    /api/v1/materials/{id}
POST   /api/v1/materials              # Admin only
PUT    /api/v1/materials/{id}         # Admin only
GET    /api/v1/materials/vendor/{vendorId}

GET    /api/v1/labor
GET    /api/v1/labor/{id}
POST   /api/v1/labor                  # Admin only

GET    /api/v1/categories
POST   /api/v1/categories             # Admin only

GET    /api/v1/inventory/vendor/{vendorId}
PUT    /api/v1/inventory/{itemId}     # Vendor updates own inventory
```

**Deliverables**:
- [ ] Catalog Service deployed
- [ ] 50+ materials seeded
- [ ] 5+ labor categories seeded
- [ ] Can browse materials by category
- [ ] Vendor can update their inventory

---

#### Day 1-3: Order Service Foundation (Senior BE #1)

**Service Scope** (Week 2):
- Order creation
- Order status tracking
- Order history
- (Support tickets deferred to Week 8)

**Implementation**:

**Day 1: Setup + Models**
```
- [ ] Create OrderService project
- [ ] Set up EF Core for realserv_orders_db
- [ ] Create entities:
      - Order (id, order_number, buyer_id, vendor_id, status, total)
      - OrderItem (id, order_id, item_type, item_id, quantity, unit_price)
      - OrderStatusHistory (id, order_id, previous_status, new_status, notes)
```

**Day 2: Order Creation Logic**
```
- [ ] OrdersController (POST create, GET by ID, GET list)
- [ ] OrderService (business logic)
- [ ] OrderRepository
- [ ] OrderItemRepository
- [ ] HttpClient to call Identity Service (get buyer/vendor info)
- [ ] HttpClient to call Catalog Service (validate items, get prices)
- [ ] Pricing calculation logic
```

**Day 3: Testing + Deployment**
```
- [ ] Write unit tests
- [ ] Integration test: Create order end-to-end
- [ ] Deploy to ECS
- [ ] Test with Postman
```

**API Endpoints (Order Service)**:
```
POST   /api/v1/orders                     # Create order
GET    /api/v1/orders/{id}
PUT    /api/v1/orders/{id}/status
GET    /api/v1/orders/buyer/{buyerId}
GET    /api/v1/orders/vendor/{vendorId}
POST   /api/v1/orders/{id}/confirm        # Vendor confirms
POST   /api/v1/orders/{id}/cancel
```

**Deliverables**:
- [ ] Order Service deployed
- [ ] Can create order (status: pending, no payment yet)
- [ ] Order calls Catalog Service for pricing
- [ ] Order calls Identity Service for buyer/vendor info
- [ ] Can view order history

---

#### Day 4-5: Integration Testing (All Engineers)

**Tasks**:
```
End-to-End Flow 1: Buyer creates order
- [ ] Buyer registers (Identity Service)
- [ ] Buyer browses materials (Catalog Service)
- [ ] Buyer creates order (Order Service)
- [ ] Verify order is in "pending" status
- [ ] Verify pricing is calculated correctly

Manual Testing:
- [ ] Test all API endpoints with Postman
- [ ] Test error scenarios (invalid user, out of stock, etc.)
- [ ] Test concurrent order creation
```

**Deliverables**:
- [ ] 3 services deployed and working together
- [ ] Can create order from browse to order creation
- [ ] All services have health checks

---

### **PHASE 2: PAYMENTS & TRANSACTIONS (Weeks 3-5)**

---

### Week 3: Payment Service (Razorpay Integration)

**Sprint Goal**: Online payments working via Razorpay + COD support

**Team Focus**:
- Senior BE #2: Payment Service (Razorpay integration)
- Senior BE #1: Order Service payment integration
- DevOps: Razorpay webhook setup

#### Day 1-2: Payment Service Core (Senior BE #2)

**Service Scope**:
- Razorpay order creation
- Payment verification
- COD management
- Payment webhooks
- Refunds

**Implementation**:

**Day 1: Setup + Razorpay Integration**
```
- [ ] Create PaymentService project
- [ ] Set up EF Core for realserv_payments_db
- [ ] Install Razorpay SDK: Razorpay.net
- [ ] Create entities:
      - Payment (id, order_id, amount, payment_method, status, razorpay_order_id)
      - PaymentTransaction (id, payment_id, transaction_type, status)
      - PaymentWebhook (id, event_type, payload, signature_verified)
      - PaymentRefund (id, payment_id, refund_amount, status)
- [ ] Configure RazorpaySettings (Key ID, Key Secret, Webhook Secret)
```

**Day 2: Controllers + Services**
```
- [ ] PaymentsController
      - POST /create-order (create Razorpay order)
      - POST /verify (verify payment signature)
      - GET /{id}
      - GET /order/{orderId}
- [ ] WebhooksController
      - POST /webhooks/razorpay (handle Razorpay webhooks)
- [ ] PaymentService (business logic)
- [ ] RazorpayService (Razorpay API wrapper)
- [ ] PaymentRepository
- [ ] WebhookRepository
```

**Deliverables** (Day 2 end):
- [ ] Can create Razorpay payment order
- [ ] Returns order_id, amount, currency for client

---

#### Day 3: Payment Verification + Webhooks (Senior BE #2)

**Tasks**:
```
Payment Verification:
- [ ] Implement signature verification
      - HMAC SHA256 (order_id|payment_id) with Key Secret
      - Compare with razorpay_signature from client
- [ ] Update payment status to "captured"
- [ ] Call Order Service to mark order as paid

Razorpay Webhooks:
- [ ] Webhook signature verification
- [ ] Handle events:
      - payment.captured
      - payment.failed
      - refund.created
- [ ] Log all webhooks for audit
- [ ] Update payment status
```

**Deliverables**:
- [ ] Payment verification working
- [ ] Webhook endpoint receiving events
- [ ] Payment status updates correctly

---

#### Day 4: COD Support (Senior BE #2)

**Tasks**:
```
COD Payment Flow:
- [ ] Create COD payment record (status: pending)
- [ ] Vendor marks COD as collected (POST /cod/{id}/mark-collected)
- [ ] Vendor uploads proof photo
- [ ] Update payment status to "collected"
- [ ] Call Order Service to mark order as paid
```

**API Endpoints**:
```
POST   /api/v1/payments/create-order         # Create Razorpay order
POST   /api/v1/payments/verify                # Verify payment
POST   /api/v1/payments/webhooks/razorpay
GET    /api/v1/payments/{id}

POST   /api/v1/payments/cod/create
PUT    /api/v1/payments/cod/{id}/mark-collected

POST   /api/v1/payments/{id}/refund
```

**Deliverables**:
- [ ] Payment Service deployed
- [ ] Razorpay integration working
- [ ] COD flow working
- [ ] Webhooks receiving events

---

#### Day 5: Order-Payment Integration (Senior BE #1)

**Tasks**:
```
Order Service Updates:
- [ ] Add payment_method field to Order
- [ ] Add payment_status field to Order
- [ ] Call Payment Service after order creation:
      - If payment_method = "online": Call /create-order
      - If payment_method = "cod": Call /cod/create
- [ ] Add endpoint: POST /orders/{id}/mark-paid (called by Payment Service)
- [ ] Update order status: pending → paid → confirmed
```

**End-to-End Flow**:
```
1. Buyer creates order with payment_method="online"
2. Order Service creates order (status: pending, payment_status: pending)
3. Order Service calls Payment Service /create-order
4. Payment Service creates Razorpay order
5. Returns razorpay_order_id to client
6. Client completes payment (via Razorpay SDK)
7. Client calls Payment Service /verify
8. Payment Service verifies signature
9. Payment Service calls Order Service /mark-paid
10. Order Service updates status to "paid"
```

**Deliverables**:
- [ ] End-to-end payment flow working
- [ ] Can pay via Razorpay (test mode)
- [ ] Can create COD orders
- [ ] Order status updates correctly

---

### Week 4-5: Vendor Management Service (Vendor + Settlement + Delivery)

**Sprint Goal**: Vendor onboarding + Settlement calculation + Delivery tracking all working

**Team Focus**:
- Senior BE #2: Vendor Management Service
- Senior BE #1: Integration with Order/Payment services
- Backend Eng #1: Testing

#### Week 4, Day 1-3: Vendor Onboarding + KYC (Senior BE #2)

**Service Scope**:
- Vendor onboarding
- KYC verification
- Vendor profiles
- Vendor availability

**Implementation**:

**Day 1: Setup + Vendor Models**
```
- [ ] Create VendorManagementService project
- [ ] Set up EF Core for realserv_vendors_db
- [ ] Create entities:
      - Vendor (id, user_id, business_name, gstin, pan, status, kyc_status)
      - VendorKYCDocument (id, vendor_id, document_type, document_url, verification_status)
```

**Day 2: Vendor Controllers + Services**
```
- [ ] VendorsController
      - POST /onboard
      - GET /{id}
      - PUT /{id}
      - PUT /{id}/availability
- [ ] KYCController
      - POST /{vendorId}/kyc (submit KYC)
      - PUT /{vendorId}/kyc/approve (admin)
      - PUT /{vendorId}/kyc/reject (admin)
- [ ] VendorService
- [ ] KYCService
- [ ] VendorRepository
```

**Day 3: Testing + Deployment**
```
- [ ] Seed test vendors
- [ ] Deploy to ECS
- [ ] Test vendor onboarding flow
```

**Deliverables**:
- [ ] Vendor onboarding working
- [ ] KYC submission working
- [ ] Admin can approve/reject KYC
- [ ] Vendor availability toggle

---

#### Week 4, Day 4-5 + Week 5, Day 1-2: Settlement Calculation (Senior BE #2)

**Service Scope**:
- Calculate vendor earnings
- RealServ commission deduction
- COD reconciliation
- Settlement payout tracking

**Implementation**:

**Day 4: Settlement Models**
```
- [ ] Create entities:
      - Settlement (id, vendor_id, period_start, period_end, gross_revenue, commission, net_amount, status)
      - SettlementLineItem (id, settlement_id, order_id, order_amount, commission_amount, net_amount)
```

**Day 5: Settlement Logic**
```
- [ ] SettlementsController
      - GET /vendor/{vendorId}
      - GET /{id}
      - POST /generate (admin - generate settlements)
      - PUT /{id}/mark-paid (admin)
- [ ] SettlementService
      - Calculate gross revenue (sum of completed orders)
      - Calculate commission (default 10%)
      - Calculate COD to remit
      - Calculate net payout
- [ ] SettlementRepository
```

**Week 5, Day 1-2: Settlement Integration**
```
- [ ] Call Order Service to get completed orders
- [ ] Call Payment Service to get payment data
- [ ] Generate settlement report (weekly/monthly)
- [ ] Admin can mark settlement as paid
- [ ] Vendor can view settlement history
```

**API Endpoints**:
```
POST   /api/v1/vendors/onboard
GET    /api/v1/vendors/{id}
PUT    /api/v1/vendors/{id}/availability

POST   /api/v1/vendors/{id}/kyc
PUT    /api/v1/vendors/{id}/kyc/approve
PUT    /api/v1/vendors/{id}/kyc/reject

GET    /api/v1/settlements/vendor/{vendorId}
GET    /api/v1/settlements/{id}
POST   /api/v1/settlements/generate
PUT    /api/v1/settlements/{id}/mark-paid
```

**Deliverables**:
- [ ] Vendor onboarding to first settlement flow working
- [ ] Settlement calculation logic correct
- [ ] Admin can generate and mark settlements as paid

---

#### Week 5, Day 3-5: Delivery Tracking (Senior BE #2)

**Service Scope** (within Vendor Management Service):
- Delivery assignment
- OTP generation/verification
- Proof of delivery
- Delivery status tracking

**Implementation**:

**Day 3: Delivery Models**
```
- [ ] Create entities:
      - Delivery (id, order_id, buyer_id, vendor_id, status, otp_code, delivery_photo_url)
      - DeliveryStatusHistory (id, delivery_id, previous_status, new_status, notes)
      - DeliveryProof (id, delivery_id, proof_type, file_url)
      - DeliveryOtpLog (id, delivery_id, otp_code, generated_at, verified)
```

**Day 4: Delivery Controllers + Logic**
```
- [ ] DeliveriesController
      - POST / (create delivery)
      - GET /{id}
      - PUT /{id}/status
      - POST /{id}/generate-otp
      - POST /{id}/verify-otp
      - POST /{id}/upload-proof
- [ ] DeliveryService
      - Generate 6-digit OTP
      - Send OTP to buyer (via Notification Service)
      - Verify OTP
      - Update delivery status
- [ ] DeliveryRepository
```

**Day 5: Integration + Testing**
```
- [ ] Order Service creates delivery record when order is confirmed
- [ ] Vendor generates OTP before delivery
- [ ] Buyer receives OTP via SMS/WhatsApp
- [ ] Vendor verifies OTP on delivery
- [ ] Vendor uploads delivery photo
- [ ] Delivery marked as completed
- [ ] Order status updates to "delivered"
```

**API Endpoints**:
```
POST   /api/v1/deliveries
GET    /api/v1/deliveries/{id}
PUT    /api/v1/deliveries/{id}/status
POST   /api/v1/deliveries/{id}/generate-otp
POST   /api/v1/deliveries/{id}/verify-otp
POST   /api/v1/deliveries/{id}/upload-proof
GET    /api/v1/deliveries/order/{orderId}
GET    /api/v1/deliveries/vendor/{vendorId}
```

**Deliverables**:
- [ ] Delivery OTP flow working
- [ ] Vendor can upload proof of delivery
- [ ] Order status updates on delivery completion
- [ ] Full flow: Order → Payment → Delivery → Settlement

---

### **PHASE 3: NOTIFICATIONS & INTEGRATIONS (Weeks 6-8)**

---

### Week 6-7: Notification Service

**Sprint Goal**: Email, WhatsApp, SMS, Push notifications all working

**Team Focus**:
- Backend Eng #1: Notification Service
- Senior BE #2: Integration with other services

#### Week 6, Day 1-2: Email Notifications (AWS SES)

**Service Scope**:
- Email via AWS SES
- WhatsApp template messages
- SMS (Twilio/AWS SNS)
- Push notifications (Firebase Cloud Messaging)

**Implementation**:

**Day 1: Setup + Email**
```
- [ ] Create NotificationService project
- [ ] Set up EF Core for realserv_notifications_db
- [ ] Create entities:
      - Notification (id, recipient_id, notification_type, channel, status, sent_at)
      - NotificationTemplate (id, template_name, template_type, subject, body)
      - UserNotificationPreferences (user_id, email_enabled, whatsapp_enabled)
      - FcmToken (user_id, token, device_type)
- [ ] Install AWS SDK: AWSSDK.SimpleEmail
- [ ] Configure SES settings (from email, region)
- [ ] EmailService implementation
```

**Day 2: Email Templates + Testing**
```
- [ ] Create email templates:
      - Order Created
      - Order Confirmed
      - Payment Success
      - Delivery OTP
      - Settlement Generated
- [ ] NotificationsController
      - POST /email
      - POST /whatsapp
      - POST /sms
      - POST /push
- [ ] EmailService.SendAsync()
- [ ] Test email delivery
```

---

#### Week 6, Day 3-4: WhatsApp + SMS

**Day 3: WhatsApp Template Messages**
```
- [ ] Install Meta WhatsApp Business API SDK
- [ ] Configure WhatsApp settings
- [ ] Create WhatsApp templates in Meta Business Manager:
      - Order Created
      - Payment Success
      - Delivery OTP
- [ ] WhatsAppService implementation
- [ ] Test WhatsApp delivery
```

**Day 4: SMS Notifications**
```
- [ ] Install Twilio SDK (or AWS SNS)
- [ ] Configure Twilio settings
- [ ] SmsService implementation
- [ ] Test SMS delivery
```

---

#### Week 6, Day 5 + Week 7, Day 1-2: Push Notifications

**Day 5: FCM Setup**
```
- [ ] Configure Firebase Cloud Messaging
- [ ] Create FcmToken table
- [ ] PushNotificationService implementation
- [ ] Test push notification delivery
```

**Week 7, Day 1-2: Notification Integration**
```
- [ ] Order Service calls Notification Service on:
      - Order created
      - Order confirmed
      - Order delivered
- [ ] Payment Service calls Notification Service on:
      - Payment success
      - Payment failed
- [ ] Vendor Management Service calls Notification Service on:
      - Delivery OTP generated
      - Settlement generated
```

**API Endpoints**:
```
POST   /api/v1/notifications/email
POST   /api/v1/notifications/whatsapp
POST   /api/v1/notifications/sms
POST   /api/v1/notifications/push

GET    /api/v1/notifications/user/{userId}
GET    /api/v1/notifications/templates
POST   /api/v1/notifications/templates       # Admin

GET    /api/v1/notifications/preferences/{userId}
PUT    /api/v1/notifications/preferences/{userId}
```

**Deliverables**:
- [ ] All notification channels working
- [ ] Users receive notifications on key events
- [ ] User can set notification preferences

---

#### Week 7, Day 3-5: Support Tickets (in Order Service)

**Tasks**:
```
Add Support Ticket functionality to Order Service:
- [ ] Create entities:
      - SupportTicket (id, ticket_number, order_id, created_by, category, status)
      - TicketMessage (id, ticket_id, sender_id, message)
      - Dispute (id, order_id, dispute_type, description, status)
- [ ] SupportTicketsController
      - POST /orders/{orderId}/support-tickets
      - GET /orders/{orderId}/support-tickets
      - PUT /support-tickets/{ticketId}
      - POST /support-tickets/{ticketId}/messages
- [ ] DisputesController
      - POST /orders/{orderId}/disputes
      - GET /disputes
      - PUT /disputes/{disputeId}/resolve
```

**Deliverables**:
- [ ] Buyers can create support tickets
- [ ] Admin can respond to tickets
- [ ] Buyers can raise disputes
- [ ] Admin can resolve disputes

---

### Week 8-9: Integration Service (WhatsApp Bot + Media + Location)

**Sprint Goal**: WhatsApp bot functional + Media upload + Location services working

**Team Focus**:
- Backend Eng #1: Integration Service
- Senior BE #1: WhatsApp bot intent recognition
- DevOps: WhatsApp webhook setup

#### Week 8, Day 1-3: WhatsApp Bot (Backend Eng #1)

**Service Scope**:
- WhatsApp webhook handler
- Message parsing
- Intent recognition
- Conversational flows
- Call other services' APIs

**Implementation**:

**Day 1: Setup + Webhook**
```
- [ ] Create IntegrationService project
- [ ] Set up EF Core for realserv_integrations_db
- [ ] Create entities:
      - WhatsAppConversation (id, user_id, phone_number, conversation_state, context)
      - WhatsAppMessage (id, conversation_id, direction, message_text, detected_intent)
- [ ] WhatsAppWebhookController
      - GET /webhook (verification)
      - POST /webhook (receive messages)
- [ ] Verify webhook with Meta
```

**Day 2: Message Parsing + Intent Recognition**
```
- [ ] MessageParser service
      - Extract order number from message
      - Extract keywords (status, available, earnings)
- [ ] IntentRecognizer service
      - Detect intent from message:
        - "Status ORD123" → order_status
        - "Available" → set_availability
        - "Earnings" → view_earnings
- [ ] ConversationStateManager
      - Track conversation state per user
```

**Day 3: Bot Actions**
```
- [ ] Implement bot actions:
      - order_status: Call Order Service, return order status
      - set_availability: Call Vendor Service, update availability
      - view_earnings: Call Vendor Service, return settlement summary
- [ ] WhatsAppApiClient
      - Send response message to user
- [ ] Test bot with WhatsApp messages
```

**Deliverables**:
- [ ] WhatsApp webhook receiving messages
- [ ] Bot can respond to basic commands
- [ ] Vendor can check order status via WhatsApp
- [ ] Vendor can set availability via WhatsApp

---

#### Week 8, Day 4-5: Media Upload (S3)

**Tasks**:
```
- [ ] Create entities:
      - MediaFile (id, file_name, file_type, s3_key, s3_url, uploaded_by)
- [ ] MediaController
      - POST /upload
      - GET /{id}
      - DELETE /{id}
- [ ] S3MediaService
      - Upload file to S3
      - Generate presigned URL
      - Delete file from S3
- [ ] Test file upload
```

**API Endpoints**:
```
POST   /api/v1/whatsapp/webhook
POST   /api/v1/whatsapp/send-message

POST   /api/v1/media/upload
GET    /api/v1/media/{id}
DELETE /api/v1/media/{id}
```

**Deliverables**:
- [ ] Can upload images to S3
- [ ] Returns CDN URL
- [ ] Used by Vendor Management Service (KYC docs, delivery photos)

---

#### Week 9, Day 1-3: Location Services (Google Maps)

**Tasks**:
```
- [ ] Create entities:
      - LocationCache (id, address_text, latitude, longitude, formatted_address)
      - ServiceAreaPolygon (id, vendor_id, polygon_geojson)
- [ ] LocationController
      - POST /geocode
      - POST /reverse-geocode
      - POST /calculate-distance
      - POST /validate-service-area
- [ ] GeocodeService (Google Maps Geocoding API)
- [ ] DistanceService (Google Maps Distance Matrix API)
- [ ] ServiceAreaService (check if address is in vendor's area)
- [ ] Cache geocoding results (reduce API costs)
```

**API Endpoints**:
```
POST   /api/v1/location/geocode
POST   /api/v1/location/reverse-geocode
POST   /api/v1/location/calculate-distance
POST   /api/v1/location/validate-service-area
```

**Deliverables**:
- [ ] Can convert address to lat/lng
- [ ] Can calculate distance between buyer and vendor
- [ ] Order Service uses this to calculate delivery charge
- [ ] Vendor Service uses this to validate service area

---

#### Week 9, Day 4-5: Integration Testing (All Engineers)

**End-to-End Scenarios**:
```
Scenario 1: Complete order flow
1. Buyer browses catalog
2. Buyer creates order
3. Buyer pays via Razorpay
4. Vendor receives notification (WhatsApp)
5. Vendor confirms order (WhatsApp: "Confirm ORD123")
6. Vendor generates delivery OTP
7. Vendor delivers order
8. Buyer enters OTP
9. Vendor uploads delivery photo
10. Order marked complete
11. Settlement generated for vendor

Scenario 2: WhatsApp bot interaction
1. Vendor: "Status ORD123"
2. Bot: Returns order status
3. Vendor: "Available"
4. Bot: "You are now accepting orders"
5. Vendor: "Earnings"
6. Bot: Returns earnings summary
```

**Deliverables**:
- [ ] All 7 services working together
- [ ] End-to-end flows tested
- [ ] No critical bugs

---

### **PHASE 4: TESTING & DEPLOYMENT (Week 10)**

---

### Week 10: Testing, Polish & Go-Live

**Sprint Goal**: Production deployment + go-live

**Team Focus**: All hands on testing, bug fixes, deployment

#### Day 1-2: Load Testing + Performance (DevOps + Tech Lead)

**Tasks**:
```
Load Testing:
- [ ] Set up load testing tool (k6, JMeter, Artillery)
- [ ] Create load test scenarios:
      - 100 concurrent users browsing catalog
      - 50 concurrent order creations
      - 20 concurrent payments
- [ ] Run load tests
- [ ] Identify bottlenecks
- [ ] Optimize slow endpoints
- [ ] Add database indexes
- [ ] Add caching (Redis) for catalog

Performance Targets:
- [ ] p50 latency < 200ms
- [ ] p95 latency < 800ms
- [ ] p99 latency < 2000ms
- [ ] Can handle 500 concurrent users
```

---

#### Day 3: Final Integration Testing (All Engineers)

**End-to-End Scenarios**:
```
Scenario 1: Buyer orders material, pays online, receives delivery
- [ ] Buyer registers
- [ ] Buyer browses materials
- [ ] Buyer creates order
- [ ] Buyer pays via Razorpay (test mode)
- [ ] Vendor receives WhatsApp notification
- [ ] Vendor confirms order
- [ ] Vendor generates delivery OTP
- [ ] Delivery completed with OTP
- [ ] Order marked complete

Result: [ ] PASS [ ] FAIL

Scenario 2: Buyer orders labor, pays COD
- [ ] Buyer creates order for mason services
- [ ] Buyer selects COD at checkout
- [ ] Order confirmed (payment pending)
- [ ] Vendor accepts order (WhatsApp)
- [ ] Vendor completes service
- [ ] Vendor marks COD as collected
- [ ] Payment marked as collected
- [ ] Order complete

Result: [ ] PASS [ ] FAIL

Scenario 3: Vendor checks earnings via WhatsApp
- [ ] Vendor sends "Earnings"
- [ ] Bot responds with earnings summary
- [ ] Verify amounts are correct

Result: [ ] PASS [ ] FAIL

Scenario 4: Admin generates settlement
- [ ] Admin logs in
- [ ] Admin generates settlement for vendor
- [ ] System calculates amounts correctly
- [ ] Admin marks settlement as paid
- [ ] Vendor notified (WhatsApp)

Result: [ ] PASS [ ] FAIL

Scenario 5: Buyer disputes order
- [ ] Buyer creates dispute
- [ ] Buyer uploads evidence photo
- [ ] Admin reviews dispute
- [ ] Admin resolves dispute (refund)
- [ ] Refund initiated via Razorpay
- [ ] Buyer receives refund

Result: [ ] PASS [ ] FAIL
```

---

#### Day 4: Production Deployment (DevOps + Tech Lead)

**Tasks**:
```
Production Environment Setup:
- [ ] Create production AWS environment (Terraform)
- [ ] Create production RDS instances (7-8 databases)
      - Use db.t4g.small (production tier)
      - Enable Multi-AZ
      - Enable automated backups
- [ ] Create production ECS cluster
- [ ] Create production ALB with SSL certificate
- [ ] Configure production secrets in Secrets Manager
- [ ] Set up production Firebase project
- [ ] Switch to Razorpay Live mode
- [ ] Configure production WhatsApp webhook
- [ ] Configure production domain (api.realserv.com)

Deployment:
- [ ] Run database migrations on production
- [ ] Seed production catalog data
- [ ] Deploy all 7-8 services to production ECS
- [ ] Verify health checks
- [ ] Smoke test all endpoints
- [ ] Monitor CloudWatch logs

Monitoring Setup:
- [ ] Set up CloudWatch alarms:
      - ECS task failures
      - API error rate > 5%
      - Database CPU > 80%
      - Payment webhook failures
- [ ] Set up Slack alerts
- [ ] Set up on-call rotation (PagerDuty)
```

---

#### Day 5: Documentation + Go-Live (All Engineers)

**Documentation**:
```
- [ ] Update README.md
- [ ] Complete API documentation (Swagger)
- [ ] Create deployment guide
- [ ] Create runbooks:
      - Service Down
      - Payment Webhook Failure
      - Database High CPU
      - WhatsApp Bot Issues
- [ ] Create admin user guide
- [ ] Create vendor onboarding guide
```

**Go-Live Checklist**:
```
Pre-Launch:
- [ ] All 7-8 services deployed to production
- [ ] All health checks passing
- [ ] All integration tests passing
- [ ] Load tests passed
- [ ] Security scan completed (no critical vulnerabilities)
- [ ] Backup strategy in place
- [ ] Monitoring and alerts configured
- [ ] Runbooks documented
- [ ] On-call rotation set up

Launch:
- [ ] Switch DNS to production
- [ ] Enable production Firebase
- [ ] Enable production Razorpay
- [ ] Enable production WhatsApp
- [ ] Monitor logs and metrics
- [ ] Verify first real order works

Post-Launch (Week 11+):
- [ ] Monitor for 48 hours
- [ ] Fix any production issues
- [ ] Collect user feedback
- [ ] Plan next sprint features
```

**Deliverables**:
- [ ] Production backend live at api.realserv.com
- [ ] All services operational
- [ ] First real order completed successfully
- [ ] Zero critical bugs

---

## Progress Tracking

### Weekly Status Report Template

```markdown
## Week X Status Report

**Date**: ____________
**Sprint Goal**: ____________

### Completed ✅
- [ ] Service 1 deployed
- [ ] Feature X implemented
- [ ] Bug Y fixed

### In Progress 🔄
- [ ] Service 2 (70% complete)
- [ ] Integration testing

### Blocked 🚫
- [ ] Waiting for Razorpay KYC approval
- [ ] Issue: _____________

### Risks ⚠️
- Risk 1: Description
- Mitigation: _____________

### Metrics
- Services Deployed: X/7
- API Endpoints: X/90
- Test Coverage: X%
- Bugs: X critical, X high, X medium

### Next Week Plan
- [ ] Task 1
- [ ] Task 2
```

---

## Risk Management

### Identified Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Razorpay KYC delay** | High | Medium | Apply for KYC in Week 0, use test mode meanwhile |
| **WhatsApp API approval delay** | Medium | Medium | Apply in Week 0, build without WhatsApp first |
| **Firebase quota limits** | Medium | Low | Monitor usage, upgrade plan if needed |
| **Database performance issues** | High | Medium | Add indexes, use read replicas, optimize queries |
| **Payment webhook failures** | High | Low | Implement retry logic, manual reconciliation process |
| **Team member unavailability** | Medium | Medium | Cross-train team, document code |
| **Scope creep** | Medium | High | Strict MVP scope, defer features to post-launch |
| **AWS cost overrun** | Low | Medium | Set billing alerts, monitor daily |

---

## Communication Plan

### Daily Standups
- **Time**: 10:00 AM (15 minutes)
- **Format**: What I did yesterday, what I'll do today, blockers
- **Platform**: Slack call or in-person

### Weekly Sprint Planning
- **Time**: Monday 10:00 AM (1 hour)
- **Agenda**: Review last week, plan this week, assign tasks
- **Deliverable**: Sprint plan document

### Weekly Retrospective
- **Time**: Friday 4:00 PM (30 minutes)
- **Agenda**: What went well, what didn't, action items
- **Platform**: Slack #backend-dev

### Communication Channels
- **#backend-dev**: General development discussions
- **#backend-alerts**: CloudWatch alerts, errors
- **#backend-deployments**: Deployment notifications
- **#backend-incidents**: P0/P1 incidents only

---

## Quality Assurance

### Testing Strategy

**Unit Tests**:
- Coverage target: >70%
- Focus on business logic (services, repositories)
- Run on every commit (CI/CD)

**Integration Tests**:
- Test API endpoints end-to-end
- Test inter-service communication
- Run before deployment

**Load Tests**:
- Run in Week 10
- Target: 500 concurrent users
- Tools: k6, JMeter, or Artillery

**Security Tests**:
- OWASP ZAP scan
- Dependency vulnerability scan
- AWS Security Hub

### Code Review Process
1. Create feature branch
2. Implement feature
3. Write tests
4. Create PR
5. Automated checks (build, tests)
6. Code review (1 approval required)
7. Merge to main
8. Auto-deploy to dev environment

---

## Deployment Checklist

### Pre-Deployment
```
- [ ] All tests passing (unit + integration)
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Secrets configured in Secrets Manager
- [ ] Health check endpoint implemented
- [ ] Logging configured
- [ ] Environment variables set
- [ ] Docker image built and pushed to ECR
```

### Deployment
```
- [ ] Run database migrations
- [ ] Deploy service to ECS
- [ ] Verify health check
- [ ] Smoke test critical endpoints
- [ ] Check CloudWatch logs
- [ ] Verify service registered with ALB
```

### Post-Deployment
```
- [ ] Monitor CloudWatch metrics (15 minutes)
- [ ] Check error logs
- [ ] Verify dependent services still working
- [ ] Update status in Slack #backend-deployments
- [ ] Document any issues
```

### Rollback Plan
```
If deployment fails:
1. Identify issue (logs, metrics)
2. Decide: Fix forward or rollback
3. If rollback:
   - [ ] Revert ECS task definition to previous version
   - [ ] Rollback database migrations (if needed)
   - [ ] Verify service health
   - [ ] Post-mortem: Document what went wrong
```

---

## Success Metrics

### Week 10 Go-Live Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Services Deployed** | 7-8/8 | ECS console |
| **API Uptime** | >99.5% | CloudWatch |
| **API Latency (p95)** | <800ms | CloudWatch |
| **Error Rate** | <1% | CloudWatch |
| **Database CPU** | <70% | CloudWatch |
| **Test Coverage** | >70% | CI/CD reports |
| **Critical Bugs** | 0 | GitHub Issues |
| **First Real Order** | Success | Manual verification |

---

## Cost Summary (10-Week MVP)

### Development Phase Costs
| Item | Cost |
|------|------|
| **AWS (dev environment, 10 weeks)** | ~$1,500 total ($150/week) |
| **External APIs (test mode)** | $0 |
| **Domain + email** | $50 |
| **Tooling (GitHub, monitoring)** | $100 |
| **Total Development** | **~$1,650** |

### Production Monthly Costs (Post Go-Live)
| Item | Monthly Cost |
|------|--------------|
| **AWS** | $400-500 |
| **External APIs** | $50-100 |
| **Monitoring tools** | $50 |
| **Total Production** | **$500-650/month** |

---

## Conclusion

This 10-week implementation plan delivers a **production-ready RealServ backend** with:

✅ **7-8 microservices** (vs. 13 in original plan)  
✅ **~90 API endpoints**  
✅ **~60 database tables**  
✅ **Full payment integration** (Razorpay + COD)  
✅ **WhatsApp bot** for vendor interactions  
✅ **Multi-channel notifications** (Email, WhatsApp, SMS, Push)  
✅ **Complete order lifecycle** (browse → order → pay → deliver → settle)  
✅ **Admin dashboard** ready  
✅ **Production deployment** on AWS  

**Time Saved**: 5 weeks (33% faster than 13-service architecture)  
**Cost Saved**: $200-400/month in AWS costs  
**Team Size**: 5-6 engineers (vs. 7-9)  

**Clear Upgrade Path**: Can split into 13+ services post-PMF when needed.

---

**Next Steps**:
1. ✅ Review and approve this plan
2. ⏳ Complete Week 0 account setup
3. ⏳ Begin Week 1 implementation
4. ⏳ Track progress weekly
5. ⏳ Go live Week 10, Day 5 (March 21, 2026)

---

**Document Version**: 3.1 (MVP-Optimized)  
**Last Updated**: January 11, 2026  
**Status**: Ready for implementation ✅