# RealServ Backend Architecture Plan
## .NET Core Microservices with AWS & Firebase Auth

**Version:** 3.0 (MVP-Optimized)
**Status:** MVP Design (Complete Production-Ready)  
**Last Updated:** January 10, 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Philosophy](#architecture-philosophy)
3. [System Architecture Overview](#system-architecture-overview)
4. [Multi-Channel Architecture](#multi-channel-architecture)
5. [Microservices Design](#microservices-design)
6. [Data Architecture](#data-architecture)
7. [Authentication & Authorization](#authentication--authorization)
8. [Payment Processing](#payment-processing)
9. [Delivery Management](#delivery-management)
10. [Location & Mapping](#location--mapping)
11. [AWS Infrastructure](#aws-infrastructure)
12. [API Design](#api-design)
13. [Event-Driven Architecture](#event-driven-architecture)
14. [Security & Compliance](#security--compliance)
15. [Deployment Strategy](#deployment-strategy)
16. [Monitoring & Observability](#monitoring--observability)
17. [MVP Implementation Phases](#mvp-implementation-phases)
18. [Cost Analysis](#cost-analysis)
19. [Migration to Full Microservices](#migration-to-full-microservices)

---

## Executive Summary

### Project Context
RealServ is a hyperlocal B2B marketplace connecting individual home builders in Hyderabad with construction material suppliers and skilled labor. The platform operates as a single accountable party with fixed pricing and no vendor negotiation.

### Multi-Channel Access Model
- **Buyer Mobile App** (iOS/Android): Full buyer experience with direct REST API access
- **Vendor Web Portal** (Desktop React): Full vendor dashboard with direct REST API access
- **Vendor WhatsApp Bot**: Conversational interface for vendors via WhatsApp (onboarding, orders, availability)
- **Admin Web Portal** (Desktop React): Full admin dashboard with direct REST API access

### Architecture Principles
- **Domain-Driven Design**: Services aligned with business domains
- **MVP-Optimized**: 7-8 services (vs. 13+ for full microservices) - balanced for rapid development
- **Database per Service**: Ensures loose coupling and autonomy
- **API-First**: RESTful APIs with OpenAPI/Swagger documentation
- **Channel-Agnostic Backend**: Same business logic serves all channels
- **Event-Driven**: Asynchronous communication for decoupling
- **Payment Integration**: Razorpay for online payments and COD management
- **Vendor Delivery Model**: Vendors handle delivery with OTP/photo verification
- **Cloud-Native**: AWS services for scalability and reliability
- **Security-First**: Authentication, authorization, encryption at all layers
- **Simplicity First**: Use Firebase Auth directly, add complexity only when needed

### MVP Service Count: 7 Core + 1 Optional

**Core Business Services (4)**:
1. **User Service** - Authentication, user management (buyers, vendors, admins)
2. **Order Service** - Order lifecycle, support tickets
3. **Payment Service** - Razorpay integration, COD, refunds
4. **Catalog Service** - Materials, labor, inventory

**Supporting Services (3)**:
5. **Vendor Management Service** - Vendor KYC, settlements, delivery
6. **Notification Service** - Email, WhatsApp, SMS, push notifications
7. **Integration Service** - WhatsApp bot, media upload (S3), location (Google Maps)

**Optional (1)**:
8. **Analytics Service** - Admin dashboard metrics, reports (can be added Week 10+)

### Why 7-8 Services Instead of 13?

| Aspect | 13 Microservices | 7-8 Services (MVP) |
|--------|------------------|-------------------|
| **Development Time** | 15 weeks | **10 weeks** |
| **Team Size Needed** | 7 engineers | **4-5 engineers** |
| **Deployment Complexity** | High (13 services) | **Medium (7-8 services)** |
| **Operational Overhead** | Very High | **Moderate** |
| **Debugging Difficulty** | Hard (distributed) | **Moderate** |
| **Database Count** | 13 databases | **7-8 databases** |
| **AWS Monthly Cost** | $1,060 | **$600-700** |
| **Time to MVP** | 3-4 months | **10 weeks** |
| **Domain Boundaries** | Fully isolated | **Respected but practical** |
| **Good for** | Post-PMF scaling | **MVP, validating product-market fit** |

### Technology Stack
- **Backend Framework**: .NET 8.0 (LTS)
- **Database**: PostgreSQL 16
- **Authentication**: Firebase Auth (with Firebase Admin SDK)
- **Payment Gateway**: Razorpay (Online + COD)
- **WhatsApp Integration**: WhatsApp Cloud API (Meta)
- **Location Services**: Google Maps API (Geocoding, Distance Matrix)
- **Cloud Provider**: AWS
- **Container Orchestration**: AWS ECS with Fargate
- **API Gateway**: AWS API Gateway + Application Load Balancer
- **Message Queue**: AWS SQS + EventBridge
- **File Storage**: AWS S3
- **Email Service**: AWS SES
- **Monitoring**: AWS CloudWatch + Application Insights
- **CI/CD**: GitHub Actions + AWS CodePipeline

---

## Architecture Philosophy

### MVP-Optimized Microservices Approach

**The Challenge**: Full microservices (13+ services) provide perfect domain isolation but significantly increase:
- Development time (3-4 months)
- Operational complexity
- Infrastructure costs
- Team coordination overhead

**The Solution**: Balanced architecture with 7-8 services that:
- ✅ Respects domain boundaries where it matters (payments, auth, orders)
- ✅ Combines tightly-coupled domains (vendor + settlements + delivery)
- ✅ Allows independent deployment of critical services
- ✅ Reduces inter-service communication overhead
- ✅ Maintains good architecture for future scaling
- ✅ Delivers MVP in 10 weeks instead of 15

### Service Consolidation Strategy

#### What We Keep Separate ✅

1. **User Service** - Authentication is critical, used by all services
2. **Order Service** - Core business logic, complex workflows
3. **Payment Service** - Financial compliance, webhook isolation required
4. **Catalog Service** - Shared resource, frequent updates
5. **Vendor Management Service** - Complex vendor workflows (KYC, settlements, delivery)
6. **Notification Service** - Used by all services, needs independent scaling
7. **Integration Service** - External API dependencies

#### What We Consolidate 🔄

| Combined Service | Original Services | Rationale |
|------------------|-------------------|-----------|
| **User Service** | User Management + Buyer Service | Buyers are users with role="buyer" - no need for separate service |
| **Order Service** | Order Service + Support Service | Support tickets are 90% order-related |
| **Vendor Management Service** | Vendor Service + Settlement Service + Delivery Service | Vendor lifecycle tightly couples these domains |
| **Integration Service** | WhatsApp Gateway + Media Service + Location Service | All external API integrations, similar scaling |

### When to Split Into Full Microservices?

**Phase 1: MVP (Now - 7-8 services)**
- Target: 0-1,000 daily orders
- Team: 4-5 engineers
- Timeline: 10 weeks

**Phase 2: Post-PMF Growth (10-12 services)**
- When: 1,000-5,000 daily orders
- Split: Vendor Management → (Vendor + Settlement + Delivery)
- Split: Integration Service → (WhatsApp + Media + Location)
- Team: 8-10 engineers

**Phase 3: Scale (13+ services)**
- When: 5,000+ daily orders
- Full domain isolation
- Team: 15+ engineers

---

## System Architecture Overview

### High-Level Multi-Channel Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT CHANNELS                                 │
├──────────────┬──────────────┬──────────────────┬─────────────────────────┤
│ Buyer Mobile │ Vendor Web   │ Vendor WhatsApp  │    Admin Web Portal     │
│(iOS/Android) │   Portal     │      Bot         │      (React)            │
│   (React     │   (React)    │ (Conversational) │                         │
│    Native)   │              │                  │                         │
└──────┬───────┴──────┬───────┴────────┬─────────┴──────┬─────────────────┘
       │              │                │                │
       │ REST API     │ REST API       │ WhatsApp       │ REST API
       │ Firebase     │ Firebase       │ Messages       │ Firebase
       │ token        │ token          │                │ token
       │              │                │                │
       ▼              ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          Firebase Auth                                   │
│              (Phone OTP for all channels)                                │
└──────────────┬───────────────────────┬───────────────────────────────────┘
               │                       │
               │ Returns ID token      │ Phone verification
               │ with custom claims    │ & token management
               │                       │
┌──────────────┴───────────────────────┴───────────────────────────────────┐
│                     INTERFACE LAYER                                      │
│                                                                           │
│  ┌─────────────────────────┐      ┌──────────────────────────────┐      │
│  │   Direct API Access     │      │  WhatsApp Gateway (Part of  │      │
│  │  (Mobile/Web Portals)   │      │   Integration Service)       │      │
│  │                         │      │  - Webhook handler           │      │
│  │  Authorization: Bearer  │      │  - Message parser            │      │
│  │  {firebase-token}       │      │  - Intent recognizer         │      │
│  └────────────┬────────────┘      │  - Conversation state mgmt   │      │
│               │                   │  - Response formatter        │      │
│               │                   │  - Calls APIs with vendor    │      │
│               │                   │    Firebase token            │      │
│               │                   └────────────┬─────────────────┘      │
└───────────────┴────────────────────────────────┴──────────────────────────┘
                │                                │
                │ All channels use same APIs with Firebase tokens
                │                                │
┌───────────────┴────────────────────────────────┴──────────────────────────┐
│                       AWS API Gateway                                     │
│            (Rate Limiting, Request Validation, CORS)                      │
└───────────────┬───��────────────────────────────┬──────────────────────────┘
                │                                │
┌───────────────┴────────────────────────────────┴──────────────────────────┐
│                Application Load Balancer (ALB)                            │
│              (SSL Termination, Health Checks, Routing)                    │
└───────────────┬────────────────────────────────┬──────────────────────────┘
                │                                │
┌───────────────┴────────────────────────────────┴──────────────────────────┐
│              MVP MICROSERVICES LAYER (7-8 Services on ECS)                │
│              (Channel-agnostic, same business logic for all)              │
│                                                                            │
│  ┌────────────────────────┐  ┌────────────────────────┐                  │
│  │    User Service        │  │   Order Service        │                  │
│  │  - Auth (Firebase)     │  │  - Order lifecycle     │                  │
│  │  - User management     │  │  - Order tracking      │                  │
│  │  - Buyer profiles      │  │  - Support tickets     │                  │
│  │  - Vendor profiles     │  │  - Disputes            │                  │
│  │  - Admin profiles      │  │                        │                  │
│  │  - Role management     │  │                        │                  │
│  └────────────────────────┘  └────────────────────────┘                  │
│                                                                            │
│  ┌────────────────────────┐  ┌────────────────────────┐                  │
│  │  Payment Service       │  │  Catalog Service       │                  │
│  │  - Razorpay (online)   │  │  - Material catalog    │                  │
│  │  - COD management      │  │  - Labor catalog       │                  │
│  │  - Payment webhooks    │  │  - Categories          │                  │
│  │  - Refunds             │  │  - Pricing             │                  │
│  │                        │  │  - Inventory mgmt      │                  │
│  └────────────────────────┘  └────────────────────────┘                  │
│                                                                            │
│  ┌────────────────────────┐  ┌────────────────────────┐                  │
│  │ Vendor Management      │  │ Notification Service   │                  │
│  │  - Vendor onboarding   │  │  - Email (SES)         │                  │
│  │  - KYC approval        │  │  - WhatsApp templates  │                  │
│  │  - Vendor availability │  │  - SMS                 │                  │
│  │  - Settlements         │  │  - Push (FCM)          │                  │
│  │  - Delivery tracking   │  │                        │                  │
│  │  - Delivery OTP/proof  │  │                        │                  │
│  └────────────────────────┘  └────────────────────────┘                  │
│                                                                            │
│  ┌────────────────────────┐  ┌────────────────────────┐                  │
│  │ Integration Service    │  │ Analytics Service      │                  │
│  │  - WhatsApp bot        │  │  (OPTIONAL)            │                  │
│  │  - Media upload (S3)   │  │  - Admin metrics       │                  │
│  │  - Location (Maps API) │  │  - Reports             │                  │
│  │  - Geocoding           │  │  - Dashboards          │                  │
│  └────────────────────────┘  └────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────┬──┘
                                                                          │
┌─────────────────────────────────────────────────────────────────────────┴──┐
│                      Event Bus (EventBridge)                               │
│                      Message Queue (SQS)                                   │
└─────────────────────────────────────────────────────────────────────────┬──┘
                                                                           │
┌─────────────────────────────────────────────────────────────────────────┴──┐
│                    Data & Storage Layer                                    │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
│  │  PostgreSQL  │  │   AWS S3     │  │   Redis      │                    │
│  │   (RDS)      │  │ (File Store) │  │   (Cache)    │                    │
│  │  7-8 DBs     │  │              │  │              │                    │
│  └──────────────┘  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────────────────────┬──┘
                                                                           │
┌─────────────────────────────────────────────────────────────────────────┴──┐
│               Monitoring & Logging Layer                                   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
│  │  CloudWatch  │  │ App Insights │  │  CloudTrail  │                    │
│  │    Logs      │  │  Telemetry   │  │    Audit     │                    │
│  └──────────────┘  └──────────────┘  └──────────────┘                    │
└────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────────┐
                    │   External Services              │
                    ├──────────────────────────────────┤
                    │ WhatsApp Cloud API (Meta)        │
                    │ Firebase Auth (Google)           │
                    │ Razorpay Payment Gateway         │
                    │ Google Maps API                  │
                    └──────────────────────────────────┘
```

### Key Design Decisions

#### 1. Microservices Decomposition Strategy
- **By Business Domain**: Services aligned with bounded contexts
- **MVP-Optimized**: 7-8 services for rapid development
- **Database per Service**: Ensures loose coupling and autonomy
- **Shared Kernel**: Common libraries for cross-cutting concerns
- **Clear Upgrade Path**: Can split into 13+ services post-PMF

#### 2. Communication Patterns
- **Synchronous**: REST APIs for request-response operations
- **Asynchronous**: Event-driven for cross-service notifications
- **Choreography over Orchestration**: Events for workflow coordination
- **Webhook Integration**: Razorpay, WhatsApp, Google Maps callbacks

#### 3. Data Consistency
- **Eventual Consistency**: For cross-service data synchronization
- **Saga Pattern**: For distributed transactions (order → payment → delivery)
- **Event Sourcing**: For critical audit trails (orders, payments, settlements, disputes)

#### 4. Authentication Strategy
- **Firebase Auth Only**: No custom JWT token exchange
- **Direct Token Validation**: Each service validates Firebase tokens
- **Custom Claims**: User metadata stored in Firebase custom claims
- **WhatsApp Phone Linking**: WhatsApp number linked to Firebase account

#### 5. Payment Strategy (MVP)
- **Razorpay Integration**: Online payments (UPI, Cards, Wallets, Net Banking)
- **COD Support**: Cash on Delivery with tracking
- **Payment at Checkout**: Online payment during order placement
- **Payment on Delivery**: COD collected by vendor, verified via photo/OTP
- **Manual Vendor Payouts**: Admin manually processes settlements

#### 6. Delivery Strategy (MVP)
- **Vendor Delivery Model**: Vendors responsible for delivery
- **OTP Verification**: Buyer shares OTP with vendor on delivery
- **Photo Proof**: Vendor uploads delivery photo
- **Delivery Tracking**: Basic status updates (pending, in_transit, delivered)

#### 7. Location Strategy
- **Google Maps API**: Geocoding, distance calculation, service area validation
- **Service Area Validation**: Check if delivery address is in vendor's service area
- **Distance-based Pricing**: Calculate delivery charges based on distance

#### 8. Multi-Channel Strategy
- **Channel-Agnostic Backend**: Same APIs serve all channels
- **Conversational Gateway**: WhatsApp Gateway translates messages to API calls
- **Unified Notifications**: Send notifications via appropriate channel (email, WhatsApp, push)

---

## Multi-Channel Architecture

### Channel Comparison Matrix

| Feature | Buyer Mobile | Vendor Web | Vendor WhatsApp | Admin Web |
|---------|--------------|------------|-----------------|-----------||
| **Platform** | iOS/Android | Desktop Browser | WhatsApp | Desktop Browser |
| **Auth** | Firebase Phone | Firebase Phone/Email | Firebase Phone | Firebase Email |
| **Interface** | React Native UI | React Web UI | Conversational (text) | React Web UI |
| **API Access** | Direct REST | Direct REST | Via Integration Service | Direct REST |
| **Payment** | Online + COD | View settlements | N/A | Process settlements |
| **Delivery** | Track orders | Upload proof | Update status via chat | Monitor all |
| **Use Cases** | Browse, Order, Pay, Track | Orders, Stock, Earnings | Quick actions, Notifications | Full admin dashboard |
| **Notifications** | Push (FCM) | Email + In-app | WhatsApp messages | Email + In-app |

---

## Microservices Design

### Service Overview (MVP-Optimized: 7-8 Services)

| # | Service | Port | Database | Purpose |
|---|---------|------|----------|---------||
| 1 | **User Service** | 5001 | realserv_users_db | User auth (Firebase), profiles (buyers, vendors, admins), role management |
| 2 | **Order Service** | 5002 | realserv_orders_db | Order lifecycle, tracking, support tickets, disputes |
| 3 | **Payment Service** | 5003 | realserv_payments_db | Razorpay integration, COD, refunds, webhooks |
| 4 | **Catalog Service** | 5004 | realserv_catalog_db | Materials, labor, categories, inventory, pricing |
| 5 | **Vendor Management Service** | 5005 | realserv_vendors_db | Vendor KYC, settlements, delivery tracking, OTP/proof |
| 6 | **Notification Service** | 5006 | realserv_notifications_db | Email (SES), WhatsApp, SMS, push notifications (FCM) |
| 7 | **Integration Service** | 5007 | realserv_integrations_db | WhatsApp bot, media upload (S3), location (Google Maps) |
| 8 | **Analytics Service** *(Optional)* | 5008 | Read replicas | Admin dashboard metrics, reports |

---

## Detailed Service Specifications

### 1. User Service
**Port**: 5001  
**Database**: `realserv_users_db`  
**Responsibility**: User authentication, profile management, role management

#### Core Functions
- Firebase Auth integration (phone OTP)
- User registration (buyers, vendors, admins)
- User profile management
- Role and permission management
- Firebase custom claims management
- User activity tracking

#### API Endpoints
```
-- Authentication
POST   /api/v1/auth/register              # Register new user
POST   /api/v1/auth/verify-phone          # Verify phone OTP
POST   /api/v1/auth/refresh-token         # Refresh Firebase token
POST   /api/v1/auth/logout
GET    /api/v1/auth/me                    # Get current user

-- User Management
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}
GET    /api/v1/users                      # Admin: List all users

-- Buyer Profiles
POST   /api/v1/buyers                     # Create buyer profile
GET    /api/v1/buyers/{id}
PUT    /api/v1/buyers/{id}
GET    /api/v1/buyers/{id}/addresses
POST   /api/v1/buyers/{id}/addresses
PUT    /api/v1/buyers/{id}/addresses/{addressId}
DELETE /api/v1/buyers/{id}/addresses/{addressId}

-- Vendor Profiles (Basic - detailed vendor management in Vendor Service)
POST   /api/v1/vendors                    # Create vendor profile
GET    /api/v1/vendors/{id}
PUT    /api/v1/vendors/{id}

-- Admin Users
POST   /api/v1/admin/users                # Create admin user
GET    /api/v1/admin/users
PUT    /api/v1/admin/users/{id}/roles     # Update admin roles
```

#### Database Schema
```sql
-- Users (all user types)
users (
  id UUID PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,  -- Firebase Auth UID
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  
  -- User type
  user_type VARCHAR(20) NOT NULL,  -- 'buyer', 'vendor', 'admin'
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active',  -- 'active', 'suspended', 'deleted'
  
  -- Profile
  profile_photo_url VARCHAR(512),
  preferred_language VARCHAR(10) DEFAULT 'en',
  
  -- Metadata
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  last_login_at TIMESTAMP
);

-- Buyer profiles
buyer_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  
  -- Business info
  business_name VARCHAR(255),
  business_type VARCHAR(50),  -- 'individual_builder', 'contractor', 'other'
  
  -- Preferences
  preferred_payment_method VARCHAR(20),  -- 'online', 'cod', 'both'
  
  -- Stats
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Delivery addresses (for buyers)
delivery_addresses (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES buyer_profiles(id) NOT NULL,
  
  -- Address details
  label VARCHAR(50),  -- 'Home', 'Site 1', 'Office', etc.
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  landmark VARCHAR(255),
  city VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
  state VARCHAR(100) NOT NULL DEFAULT 'Telangana',
  pincode VARCHAR(10) NOT NULL,
  
  -- Location
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  
  -- Default address
  is_default BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Admin users
admin_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  
  -- Permissions
  role VARCHAR(50) NOT NULL,  -- 'super_admin', 'operations', 'support', 'finance'
  permissions JSONB,  -- Detailed permissions
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- User sessions (for tracking)
user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  
  -- Session info
  firebase_token_id VARCHAR(512),
  device_type VARCHAR(20),  -- 'ios', 'android', 'web'
  device_info JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Timestamps
  started_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP
);
```

#### Integration with Firebase Auth
```csharp
// Example: Create user after Firebase registration
public async Task<UserResponse> CreateUserAsync(CreateUserRequest request)
{
    // 1. Verify Firebase token
    var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(request.FirebaseToken);
    var firebaseUid = decodedToken.Uid;
    
    // 2. Create user in database
    var user = new User
    {
        FirebaseUid = firebaseUid,
        Phone = decodedToken.Claims["phone_number"].ToString(),
        FullName = request.FullName,
        UserType = request.UserType,  // 'buyer', 'vendor', 'admin'
        Status = "active"
    };
    
    await _userRepository.CreateAsync(user);
    
    // 3. Set custom claims in Firebase
    var claims = new Dictionary<string, object>
    {
        { "user_id", user.Id.ToString() },
        { "user_type", user.UserType },
        { "status", user.Status }
    };
    
    await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(firebaseUid, claims);
    
    // 4. Create type-specific profile
    if (user.UserType == "buyer")
    {
        await _buyerRepository.CreateAsync(new BuyerProfile
        {
            UserId = user.Id
        });
    }
    else if (user.UserType == "vendor")
    {
        // Call Vendor Management Service to create vendor profile
        await _vendorServiceClient.CreateVendorProfileAsync(user.Id);
    }
    
    return new UserResponse { UserId = user.Id, FirebaseUid = firebaseUid };
}
```

---

### 2. Order Service
**Port**: 5002  
**Database**: `realserv_orders_db`  
**Responsibility**: Order lifecycle management, support tickets, disputes

#### Core Functions
- Order creation and validation
- Order status tracking (pending, confirmed, paid, delivered, completed, cancelled)
- Order items management
- Pricing calculation
- Order history
- Support ticket management (90% order-related)
- Dispute handling
- Order analytics

#### API Endpoints
```
-- Orders
POST   /api/v1/orders                     # Create order
GET    /api/v1/orders/{id}
PUT    /api/v1/orders/{id}/status
DELETE /api/v1/orders/{id}                # Cancel order
GET    /api/v1/orders/buyer/{buyerId}
GET    /api/v1/orders/vendor/{vendorId}
GET    /api/v1/orders                     # Admin: All orders
POST   /api/v1/orders/{id}/confirm        # Vendor confirms order
POST   /api/v1/orders/{id}/cancel         # Cancel with reason

-- Order Items
GET    /api/v1/orders/{id}/items
POST   /api/v1/orders/{id}/items
PUT    /api/v1/orders/{id}/items/{itemId}
DELETE /api/v1/orders/{id}/items/{itemId}

-- Support Tickets (order-related)
POST   /api/v1/orders/{id}/support-tickets
GET    /api/v1/orders/{id}/support-tickets
PUT    /api/v1/support-tickets/{ticketId}
POST   /api/v1/support-tickets/{ticketId}/messages
GET    /api/v1/support-tickets              # Admin: All tickets

-- Disputes
POST   /api/v1/orders/{id}/disputes
GET    /api/v1/orders/{id}/disputes
PUT    /api/v1/disputes/{disputeId}/resolve
GET    /api/v1/disputes                      # Admin: All disputes
```

#### Database Schema
```sql
-- Orders
orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,  -- ORD001, ORD002, etc.
  
  -- Parties
  buyer_id UUID NOT NULL,  -- References users table in User Service
  vendor_id UUID NOT NULL,  -- References users table in User Service
  
  -- Order details
  order_type VARCHAR(20) NOT NULL,  -- 'material', 'labor', 'mixed'
  
  -- Delivery
  delivery_address_id UUID NOT NULL,
  delivery_address JSONB NOT NULL,  -- Snapshot of address at order time
  delivery_date DATE,
  delivery_slot VARCHAR(20),  -- 'morning', 'afternoon', 'evening'
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_method VARCHAR(20),  -- 'online', 'cod'
  payment_status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'paid', 'failed', 'refunded'
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  
  -- 'pending', 'confirmed', 'paid', 'preparing', 'in_transit', 'delivered', 'completed', 'cancelled'
  
  -- Cancellation
  cancelled_by UUID,  -- User who cancelled
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  
  -- Notes
  buyer_notes TEXT,
  vendor_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Order items (materials or labor)
order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  
  -- Item details
  item_type VARCHAR(20) NOT NULL,  -- 'material', 'labor'
  item_id UUID NOT NULL,  -- References catalog
  item_name VARCHAR(255) NOT NULL,
  item_description TEXT,
  
  -- Quantity
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,  -- 'kg', 'bag', 'cubic_meter', 'day', 'hour'
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Snapshot of item at order time
  item_snapshot JSONB,
  
  created_at TIMESTAMP NOT NULL
);

-- Order status history
order_status_history (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  
  -- Status change
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  notes TEXT,
  
  -- Who changed
  changed_by UUID,
  changed_via VARCHAR(20),  -- 'web', 'mobile', 'whatsapp', 'system'
  
  created_at TIMESTAMP NOT NULL
);

-- Support tickets (90% order-related)
support_tickets (
  id UUID PRIMARY KEY,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,  -- TKT001, TKT002, etc.
  
  -- Ticket details
  order_id UUID REFERENCES orders(id),  -- NULL for non-order tickets
  created_by UUID NOT NULL,
  assigned_to UUID,  -- Admin user
  
  -- Issue
  category VARCHAR(50) NOT NULL,  -- 'order_issue', 'payment_issue', 'delivery_issue', 'quality_issue', 'other'
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',  -- 'low', 'medium', 'high', 'urgent'
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'open',  -- 'open', 'in_progress', 'resolved', 'closed'
  
  -- Resolution
  resolved_at TIMESTAMP,
  resolved_by UUID,
  resolution_notes TEXT,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Support ticket messages
ticket_messages (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets(id) NOT NULL,
  
  -- Message
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL,  -- 'buyer', 'vendor', 'admin'
  message TEXT NOT NULL,
  
  -- Attachments
  attachments JSONB,  -- Array of media URLs
  
  created_at TIMESTAMP NOT NULL
);

-- Disputes
disputes (
  id UUID PRIMARY KEY,
  dispute_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Dispute details
  order_id UUID REFERENCES orders(id) NOT NULL,
  raised_by UUID NOT NULL,
  raised_against UUID NOT NULL,  -- Vendor or buyer
  
  -- Issue
  dispute_type VARCHAR(50) NOT NULL,  -- 'quality', 'quantity', 'delivery', 'payment', 'other'
  description TEXT NOT NULL,
  evidence_urls JSONB,  -- Array of photo/document URLs
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'open',  -- 'open', 'under_review', 'resolved', 'closed'
  
  -- Resolution
  resolved_by UUID,  -- Admin
  resolution TEXT,
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

#### Order Creation Flow
```csharp
[HttpPost]
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
{
    // 1. Validate buyer
    var buyer = await _userService.GetBuyerAsync(request.BuyerId);
    if (buyer == null)
        return BadRequest("Invalid buyer");
    
    // 2. Validate vendor
    var vendor = await _vendorService.GetVendorAsync(request.VendorId);
    if (vendor == null || vendor.Status != "active")
        return BadRequest("Vendor not available");
    
    // 3. Validate items from Catalog Service
    var catalogItems = await _catalogService.ValidateItemsAsync(request.Items);
    
    // 4. Calculate pricing
    var subtotal = catalogItems.Sum(item => item.UnitPrice * item.Quantity);
    var deliveryCharge = await _locationService.CalculateDeliveryChargeAsync(
        vendor.Location, 
        request.DeliveryAddressId
    );
    var total = subtotal + deliveryCharge;
    
    // 5. Create order
    var order = new Order
    {
        OrderNumber = await GenerateOrderNumberAsync(),
        BuyerId = request.BuyerId,
        VendorId = request.VendorId,
        OrderType = request.OrderType,
        DeliveryAddressId = request.DeliveryAddressId,
        DeliveryAddress = await GetAddressSnapshotAsync(request.DeliveryAddressId),
        Subtotal = subtotal,
        DeliveryCharge = deliveryCharge,
        Total = total,
        PaymentMethod = request.PaymentMethod,
        Status = "pending"
    };
    
    await _orderRepository.CreateAsync(order);
    
    // 6. Create order items
    foreach (var item in catalogItems)
    {
        await _orderItemRepository.CreateAsync(new OrderItem
        {
            OrderId = order.Id,
            ItemType = item.Type,
            ItemId = item.Id,
            ItemName = item.Name,
            Quantity = item.Quantity,
            Unit = item.Unit,
            UnitPrice = item.UnitPrice,
            TotalPrice = item.UnitPrice * item.Quantity,
            ItemSnapshot = JsonSerializer.SerializeToElement(item)
        });
    }
    
    // 7. Create payment record
    if (request.PaymentMethod == "online")
    {
        await _paymentService.CreatePaymentOrderAsync(order.Id);
    }
    else if (request.PaymentMethod == "cod")
    {
        await _paymentService.CreateCODPaymentAsync(order.Id);
    }
    
    // 8. Create delivery record
    await _vendorService.CreateDeliveryAsync(order.Id);
    
    // 9. Publish event
    await _eventBus.PublishAsync(new OrderCreatedEvent
    {
        OrderId = order.Id,
        BuyerId = order.BuyerId,
        VendorId = order.VendorId,
        Total = order.Total
    });
    
    // 10. Send notifications
    await _notificationService.SendOrderCreatedNotificationAsync(order.Id);
    
    return Ok(new { orderId = order.Id, orderNumber = order.OrderNumber });
}
```

---

### 3. Payment Service
**Port**: 5003  
**Database**: `realserv_payments_db`  
**Responsibility**: Payment processing, Razorpay integration, COD management, refunds

#### Core Functions
- Razorpay integration (Orders API, Payment Links)
- Payment order creation
- Payment verification (webhook handling)
- COD order management
- Refund processing
- Payment reconciliation
- Transaction audit trail

#### API Endpoints
```
-- Online Payments
POST   /api/v1/payments/create-order         # Create Razorpay order
POST   /api/v1/payments/verify                # Verify payment signature
POST   /api/v1/payments/webhooks/razorpay     # Razorpay webhook
GET    /api/v1/payments/{id}
GET    /api/v1/payments/order/{orderId}

-- COD
POST   /api/v1/payments/cod/create            # Create COD payment record
PUT    /api/v1/payments/cod/{id}/mark-collected # Mark COD as collected
POST   /api/v1/payments/cod/{id}/verify-proof  # Verify COD collection proof

-- Refunds
POST   /api/v1/payments/{id}/refund
GET    /api/v1/payments/{id}/refund-status

-- Admin
GET    /api/v1/payments
GET    /api/v1/payments/reconciliation        # Payment reconciliation report
```

#### Database Schema
```sql
-- Payments
payments (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL UNIQUE,  -- References orders table
  order_number VARCHAR(20) NOT NULL,
  buyer_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  
  -- Payment method
  payment_method VARCHAR(20) NOT NULL,  -- 'online', 'cod'
  payment_type VARCHAR(20),  -- 'upi', 'card', 'wallet', 'netbanking', 'cash'
  
  -- Amount
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Status
  status VARCHAR(20) NOT NULL,  -- 'pending', 'authorized', 'captured', 'failed', 'refunded', 'collected'
  
  -- Razorpay (for online payments)
  razorpay_order_id VARCHAR(255),  -- Razorpay order ID
  razorpay_payment_id VARCHAR(255),  -- Razorpay payment ID
  razorpay_signature VARCHAR(512),  -- Signature for verification
  
  -- COD specific
  cod_collected_by UUID,  -- Vendor who collected cash
  cod_collected_at TIMESTAMP,
  cod_proof_url VARCHAR(512),  -- Photo of cash collection
  
  -- Metadata
  payment_details JSONB,  -- Additional payment gateway data
  failure_reason TEXT,
  refund_id VARCHAR(255),
  refund_amount DECIMAL(10,2),
  refunded_at TIMESTAMP,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Payment transactions (event log)
payment_transactions (
  id UUID PRIMARY KEY,
  payment_id UUID REFERENCES payments(id),
  transaction_type VARCHAR(30) NOT NULL,  -- 'authorization', 'capture', 'refund', 'collection'
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  gateway_transaction_id VARCHAR(255),
  gateway_response JSONB,
  created_at TIMESTAMP NOT NULL
);

-- Payment webhooks log (audit trail)
payment_webhooks (
  id UUID PRIMARY KEY,
  source VARCHAR(20) NOT NULL,  -- 'razorpay'
  event_type VARCHAR(50) NOT NULL,  -- 'payment.captured', 'payment.failed', etc.
  payload JSONB NOT NULL,
  signature VARCHAR(512),
  signature_verified BOOLEAN,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP NOT NULL
);

-- Refunds
payment_refunds (
  id UUID PRIMARY KEY,
  payment_id UUID REFERENCES payments(id),
  refund_amount DECIMAL(10,2) NOT NULL,
  refund_reason VARCHAR(100) NOT NULL,  -- 'cancellation', 'dispute', 'return'
  refund_notes TEXT,
  
  -- Razorpay refund
  razorpay_refund_id VARCHAR(255),
  
  -- Status
  status VARCHAR(20) NOT NULL,  -- 'pending', 'processed', 'failed'
  
  initiated_by UUID,
  initiated_at TIMESTAMP NOT NULL,
  processed_at TIMESTAMP,
  failed_reason TEXT,
  
  created_at TIMESTAMP NOT NULL
);
```

*(Razorpay integration code examples remain the same as in original document)*

---

### 4. Catalog Service
**Port**: 5004  
**Database**: `realserv_catalog_db`  
**Responsibility**: Material and labor catalog management

#### Core Functions
- Material catalog management
- Labor catalog management
- Category management
- Pricing management
- Inventory tracking
- Availability status

#### API Endpoints
```
-- Materials
GET    /api/v1/materials
GET    /api/v1/materials/{id}
POST   /api/v1/materials              # Admin only
PUT    /api/v1/materials/{id}         # Admin only
DELETE /api/v1/materials/{id}         # Admin only
GET    /api/v1/materials/vendor/{vendorId}
GET    /api/v1/materials/category/{categoryId}

-- Labor
GET    /api/v1/labor
GET    /api/v1/labor/{id}
POST   /api/v1/labor                  # Admin only
PUT    /api/v1/labor/{id}             # Admin only
DELETE /api/v1/labor/{id}             # Admin only
GET    /api/v1/labor/vendor/{vendorId}
GET    /api/v1/labor/category/{categoryId}

-- Categories
GET    /api/v1/categories
POST   /api/v1/categories             # Admin only
PUT    /api/v1/categories/{id}        # Admin only

-- Inventory (Vendor can update their own)
GET    /api/v1/inventory/vendor/{vendorId}
PUT    /api/v1/inventory/{itemId}
```

#### Database Schema
```sql
-- Categories
categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),  -- For sub-categories
  type VARCHAR(20) NOT NULL,  -- 'material', 'labor'
  icon_url VARCHAR(512),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL
);

-- Materials
materials (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES categories(id) NOT NULL,
  
  -- Basic info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(50) UNIQUE,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,  -- 'kg', 'bag', 'cubic_meter', 'piece'
  min_order_quantity DECIMAL(10,2) DEFAULT 1,
  
  -- Media
  image_urls JSONB,  -- Array of image URLs
  
  -- Specifications
  specifications JSONB,  -- { "grade": "43", "brand": "ACC" }
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Labor categories
labor_categories (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES categories(id) NOT NULL,
  
  -- Basic info
  name VARCHAR(255) NOT NULL,  -- "Mason", "Carpenter", "Electrician"
  description TEXT,
  
  -- Pricing
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  
  -- Requirements
  min_hours DECIMAL(4,2) DEFAULT 4,  -- Minimum 4 hours
  skills_required JSONB,  -- Array of skills
  
  -- Media
  image_url VARCHAR(512),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Vendor inventory (materials)
vendor_inventory (
  id UUID PRIMARY KEY,
  vendor_id UUID NOT NULL,
  material_id UUID REFERENCES materials(id) NOT NULL,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  stock_quantity DECIMAL(10,2),
  
  -- Custom pricing (vendor can override base price)
  vendor_price DECIMAL(10,2),  -- NULL means use base price
  
  -- Minimum order
  min_order_quantity DECIMAL(10,2),
  
  updated_at TIMESTAMP NOT NULL,
  
  UNIQUE(vendor_id, material_id)
);

-- Vendor labor availability
vendor_labor_availability (
  id UUID PRIMARY KEY,
  vendor_id UUID NOT NULL,
  labor_category_id UUID REFERENCES labor_categories(id) NOT NULL,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  available_workers INT DEFAULT 1,
  
  -- Custom pricing
  vendor_hourly_rate DECIMAL(10,2),
  vendor_daily_rate DECIMAL(10,2),
  
  updated_at TIMESTAMP NOT NULL,
  
  UNIQUE(vendor_id, labor_category_id)
);
```

---

### 5. Vendor Management Service
**Port**: 5005  
**Database**: `realserv_vendors_db`  
**Responsibility**: Vendor onboarding, KYC, settlements, delivery management

#### Core Functions
- Vendor onboarding
- KYC verification and approval
- Vendor availability management
- Settlement calculation (earnings - RealServ commission)
- Settlement payout tracking
- Delivery assignment and tracking
- Delivery OTP generation/verification
- Proof of delivery (photo upload)
- Vendor performance metrics

#### API Endpoints
```
-- Vendor Onboarding
POST   /api/v1/vendors/onboard                # Create vendor profile
GET    /api/v1/vendors/{id}
PUT    /api/v1/vendors/{id}
GET    /api/v1/vendors                        # Admin: All vendors

-- KYC
POST   /api/v1/vendors/{id}/kyc                # Submit KYC documents
PUT    /api/v1/vendors/{id}/kyc/approve        # Admin: Approve KYC
PUT    /api/v1/vendors/{id}/kyc/reject         # Admin: Reject KYC
GET    /api/v1/vendors/{id}/kyc                # Get KYC status

-- Availability
GET    /api/v1/vendors/{id}/availability
PUT    /api/v1/vendors/{id}/availability       # Vendor sets availability
GET    /api/v1/vendors/available               # Get available vendors

-- Settlements
GET    /api/v1/settlements/vendor/{vendorId}
GET    /api/v1/settlements/{id}
POST   /api/v1/settlements/generate            # Admin: Generate settlements
PUT    /api/v1/settlements/{id}/mark-paid      # Admin: Mark as paid
GET    /api/v1/settlements                     # Admin: All settlements

-- Delivery
POST   /api/v1/deliveries                      # Create delivery record
GET    /api/v1/deliveries/{id}
PUT    /api/v1/deliveries/{id}/status
POST   /api/v1/deliveries/{id}/generate-otp    # Generate delivery OTP
POST   /api/v1/deliveries/{id}/verify-otp      # Verify OTP at delivery
POST   /api/v1/deliveries/{id}/upload-proof    # Upload delivery photo
GET    /api/v1/deliveries/order/{orderId}
GET    /api/v1/deliveries/vendor/{vendorId}
GET    /api/v1/deliveries                      # Admin: All deliveries
```

#### Database Schema
```sql
-- Vendors (extends users table from User Service)
vendors (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,  -- References users table in User Service
  
  -- Business details
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(50) NOT NULL,  -- 'material_supplier', 'labor_contractor', 'both'
  gstin VARCHAR(15),  -- GST number
  pan VARCHAR(10),  -- PAN card
  
  -- Contact
  business_phone VARCHAR(15),
  business_email VARCHAR(255),
  business_address TEXT,
  
  -- Service area
  service_areas JSONB,  -- Array of pincodes or areas
  service_radius_km DECIMAL(5,2),  -- Delivery radius
  
  -- Location
  warehouse_latitude DECIMAL(10,7),
  warehouse_longitude DECIMAL(10,7),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'active', 'suspended', 'blocked'
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
  
  -- Availability
  is_accepting_orders BOOLEAN DEFAULT true,
  
  -- Commission
  commission_rate DECIMAL(5,2) DEFAULT 10.00,  -- RealServ commission %
  
  -- Banking
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  bank_account_holder_name VARCHAR(255),
  bank_name VARCHAR(100),
  
  -- Metrics
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  average_rating DECIMAL(3,2),
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  approved_at TIMESTAMP
);

-- KYC documents
vendor_kyc_documents (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  
  -- Document type
  document_type VARCHAR(50) NOT NULL,  -- 'pan', 'gstin', 'aadhaar', 'business_license', 'bank_statement'
  document_url VARCHAR(512) NOT NULL,
  document_number VARCHAR(50),
  
  -- Verification
  verification_status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'verified', 'rejected'
  verified_by UUID,  -- Admin who verified
  verified_at TIMESTAMP,
  rejection_reason TEXT,
  
  uploaded_at TIMESTAMP NOT NULL
);

-- Settlements (vendor earnings)
settlements (
  id UUID PRIMARY KEY,
  settlement_number VARCHAR(20) UNIQUE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  
  -- Period
  period_start_date DATE NOT NULL,
  period_end_date DATE NOT NULL,
  
  -- Amount breakdown
  total_orders INT NOT NULL,
  gross_revenue DECIMAL(12,2) NOT NULL,  -- Total order value
  commission_amount DECIMAL(12,2) NOT NULL,  -- RealServ commission
  net_amount DECIMAL(12,2) NOT NULL,  -- Amount to pay vendor
  
  -- COD
  cod_collected DECIMAL(12,2) DEFAULT 0,  -- COD collected by vendor
  cod_to_remit DECIMAL(12,2) DEFAULT 0,  -- COD to be paid to RealServ
  
  -- Final payout
  payout_amount DECIMAL(12,2) NOT NULL,  -- net_amount - cod_to_remit
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'paid'
  
  -- Payment
  payment_method VARCHAR(20),  -- 'bank_transfer', 'upi'
  payment_reference VARCHAR(100),
  paid_at TIMESTAMP,
  paid_by UUID,  -- Admin who processed payment
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Settlement line items
settlement_line_items (
  id UUID PRIMARY KEY,
  settlement_id UUID REFERENCES settlements(id) NOT NULL,
  order_id UUID NOT NULL,
  order_number VARCHAR(20) NOT NULL,
  order_date TIMESTAMP NOT NULL,
  order_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

-- Deliveries
deliveries (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL UNIQUE,  -- One delivery per order
  order_number VARCHAR(20) NOT NULL,
  
  -- Parties
  buyer_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  delivered_by UUID,  -- Vendor user who delivered
  
  -- Delivery details
  delivery_address JSONB NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  
  -- 'pending', 'assigned', 'in_transit', 'delivered', 'failed'
  
  -- Delivery window
  scheduled_date DATE,
  scheduled_slot VARCHAR(20),  -- 'morning', 'afternoon', 'evening'
  delivered_at TIMESTAMP,
  
  -- OTP verification
  otp_code VARCHAR(6),
  otp_generated_at TIMESTAMP,
  otp_expires_at TIMESTAMP,
  otp_verified BOOLEAN DEFAULT false,
  otp_verified_at TIMESTAMP,
  
  -- Proof of delivery
  delivery_photo_url VARCHAR(512),
  delivery_notes TEXT,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Delivery status history
delivery_status_history (
  id UUID PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id),
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  notes TEXT,
  latitude DECIMAL(10,7),  -- Location when status changed
  longitude DECIMAL(10,7),
  changed_by UUID,
  changed_via VARCHAR(20),  -- 'web', 'mobile', 'whatsapp'
  created_at TIMESTAMP NOT NULL
);

-- Delivery proof (photos, signatures)
delivery_proof (
  id UUID PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id),
  proof_type VARCHAR(20) NOT NULL,  -- 'photo', 'signature', 'document'
  file_url VARCHAR(512) NOT NULL,
  uploaded_by UUID,
  uploaded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL
);

-- Delivery OTP log
delivery_otp_log (
  id UUID PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id),
  otp_code VARCHAR(6) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  verification_attempts INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL
);
```

---

### 6. Notification Service
**Port**: 5006  
**Database**: `realserv_notifications_db`  
**Responsibility**: Multi-channel notifications (email, WhatsApp, SMS, push)

#### Core Functions
- Email notifications (AWS SES)
- WhatsApp template messages (WhatsApp Business API)
- SMS notifications
- Push notifications (Firebase Cloud Messaging)
- Notification templates
- Notification preferences
- Notification history

#### API Endpoints
```
-- Send Notifications
POST   /api/v1/notifications/email
POST   /api/v1/notifications/whatsapp
POST   /api/v1/notifications/sms
POST   /api/v1/notifications/push

-- Notification History
GET    /api/v1/notifications/user/{userId}
GET    /api/v1/notifications/{id}

-- Templates
GET    /api/v1/notifications/templates
POST   /api/v1/notifications/templates       # Admin only
PUT    /api/v1/notifications/templates/{id}  # Admin only

-- Preferences
GET    /api/v1/notifications/preferences/{userId}
PUT    /api/v1/notifications/preferences/{userId}
```

#### Database Schema
```sql
-- Notification templates
notification_templates (
  id UUID PRIMARY KEY,
  template_name VARCHAR(100) UNIQUE NOT NULL,
  template_type VARCHAR(20) NOT NULL,  -- 'email', 'whatsapp', 'sms', 'push'
  
  -- Template content
  subject VARCHAR(255),  -- For email
  body TEXT NOT NULL,
  variables JSONB,  -- Template variables
  
  -- WhatsApp specific
  whatsapp_template_id VARCHAR(100),  -- WhatsApp approved template ID
  whatsapp_language VARCHAR(10),  -- 'en', 'hi'
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Notifications log
notifications (
  id UUID PRIMARY KEY,
  
  -- Recipient
  recipient_id UUID NOT NULL,
  recipient_type VARCHAR(20) NOT NULL,  -- 'buyer', 'vendor', 'admin'
  
  -- Notification details
  notification_type VARCHAR(50) NOT NULL,  
  -- 'order_created', 'order_confirmed', 'payment_success', 'delivery_otp', etc.
  
  channel VARCHAR(20) NOT NULL,  -- 'email', 'whatsapp', 'sms', 'push'
  
  -- Content
  subject VARCHAR(255),
  body TEXT NOT NULL,
  data JSONB,  -- Additional data
  
  -- Delivery
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'sent', 'delivered', 'failed'
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  failed_reason TEXT,
  
  -- External provider
  provider VARCHAR(50),  -- 'ses', 'whatsapp_business', 'twilio', 'fcm'
  provider_message_id VARCHAR(255),
  
  created_at TIMESTAMP NOT NULL
);

-- User notification preferences
user_notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  
  -- Email preferences
  email_enabled BOOLEAN DEFAULT true,
  email_order_updates BOOLEAN DEFAULT true,
  email_payment_updates BOOLEAN DEFAULT true,
  email_promotions BOOLEAN DEFAULT false,
  
  -- WhatsApp preferences
  whatsapp_enabled BOOLEAN DEFAULT true,
  whatsapp_order_updates BOOLEAN DEFAULT true,
  whatsapp_payment_updates BOOLEAN DEFAULT true,
  whatsapp_promotions BOOLEAN DEFAULT false,
  
  -- SMS preferences
  sms_enabled BOOLEAN DEFAULT false,
  sms_order_updates BOOLEAN DEFAULT false,
  
  -- Push preferences
  push_enabled BOOLEAN DEFAULT true,
  push_order_updates BOOLEAN DEFAULT true,
  push_payment_updates BOOLEAN DEFAULT true,
  
  updated_at TIMESTAMP NOT NULL
);

-- FCM tokens (for push notifications)
fcm_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token VARCHAR(255) NOT NULL,
  device_type VARCHAR(20),  -- 'ios', 'android'
  device_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE(user_id, token)
);
```

---

### 7. Integration Service
**Port**: 5007  
**Database**: `realserv_integrations_db`  
**Responsibility**: External integrations (WhatsApp bot, media upload, location services)

#### Core Functions
- **WhatsApp Bot**: Conversational interface for vendors
- **Media Management**: Photo/document upload to S3
- **Location Services**: Google Maps geocoding, distance calculation, service area validation
- Webhook handling for external services

#### API Endpoints
```
-- WhatsApp Bot
POST   /api/v1/whatsapp/webhook                # WhatsApp webhook
POST   /api/v1/whatsapp/send-message
GET    /api/v1/whatsapp/conversations/{userId}

-- Media
POST   /api/v1/media/upload                    # Upload to S3
GET    /api/v1/media/{id}
DELETE /api/v1/media/{id}

-- Location
POST   /api/v1/location/geocode                # Address to lat/lng
POST   /api/v1/location/reverse-geocode        # Lat/lng to address
POST   /api/v1/location/calculate-distance     # Distance between two points
POST   /api/v1/location/validate-service-area  # Check if address is in service area
```

#### Database Schema
```sql
-- WhatsApp conversations
whatsapp_conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  
  -- Conversation state
  conversation_state VARCHAR(50),  -- 'idle', 'onboarding', 'order_inquiry', 'order_status', etc.
  context JSONB,  -- Conversation context
  
  -- Last interaction
  last_message_at TIMESTAMP,
  last_message_from VARCHAR(20),  -- 'user', 'bot'
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- WhatsApp messages
whatsapp_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES whatsapp_conversations(id) NOT NULL,
  
  -- Message details
  whatsapp_message_id VARCHAR(255) UNIQUE NOT NULL,
  direction VARCHAR(20) NOT NULL,  -- 'inbound', 'outbound'
  
  -- Content
  message_type VARCHAR(20) NOT NULL,  -- 'text', 'image', 'document', 'template'
  message_text TEXT,
  media_url VARCHAR(512),
  
  -- Status (for outbound messages)
  status VARCHAR(20),  -- 'sent', 'delivered', 'read', 'failed'
  
  -- Intent recognition
  detected_intent VARCHAR(50),  -- 'order_status', 'availability_update', etc.
  confidence DECIMAL(3,2),
  
  created_at TIMESTAMP NOT NULL
);

-- Media files
media_files (
  id UUID PRIMARY KEY,
  
  -- File details
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,  -- 'image/jpeg', 'application/pdf', etc.
  file_size_bytes BIGINT NOT NULL,
  file_category VARCHAR(50),  -- 'kyc_document', 'delivery_proof', 'product_image', etc.
  
  -- Storage
  s3_bucket VARCHAR(100) NOT NULL,
  s3_key VARCHAR(512) NOT NULL,
  s3_url VARCHAR(512) NOT NULL,
  cdn_url VARCHAR(512),
  
  -- Ownership
  uploaded_by UUID NOT NULL,
  related_entity_type VARCHAR(50),  -- 'order', 'vendor', 'delivery', etc.
  related_entity_id UUID,
  
  -- Status
  is_public BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Location cache (geocoding results)
location_cache (
  id UUID PRIMARY KEY,
  
  -- Address
  address_text TEXT UNIQUE NOT NULL,
  
  -- Geocoded location
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  
  -- Google Maps data
  formatted_address TEXT,
  place_id VARCHAR(255),
  address_components JSONB,
  
  -- Cache metadata
  geocoded_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP NOT NULL
);

-- Service area polygons (for vendors)
service_area_polygons (
  id UUID PRIMARY KEY,
  vendor_id UUID NOT NULL,
  
  -- Polygon data (GeoJSON)
  polygon_geojson JSONB NOT NULL,
  
  -- Bounding box (for quick checks)
  min_latitude DECIMAL(10,7) NOT NULL,
  max_latitude DECIMAL(10,7) NOT NULL,
  min_longitude DECIMAL(10,7) NOT NULL,
  max_longitude DECIMAL(10,7) NOT NULL,
  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

#### WhatsApp Bot Example Flow
```csharp
[HttpPost("webhook")]
public async Task<IActionResult> WhatsAppWebhook([FromBody] WhatsAppWebhookPayload payload)
{
    // 1. Extract message
    var message = payload.Entry[0].Changes[0].Value.Messages[0];
    var phone = message.From;
    var messageText = message.Text.Body;
    
    // 2. Find or create conversation
    var conversation = await _conversationRepository.GetByPhoneAsync(phone);
    if (conversation == null)
    {
        conversation = await _conversationRepository.CreateAsync(new WhatsAppConversation
        {
            PhoneNumber = phone,
            ConversationState = "idle"
        });
    }
    
    // 3. Link to user (get Firebase user by phone)
    var user = await _userService.GetUserByPhoneAsync(phone);
    if (user != null)
    {
        conversation.UserId = user.Id;
        await _conversationRepository.UpdateAsync(conversation);
    }
    
    // 4. Detect intent
    var intent = await DetectIntentAsync(messageText, conversation.ConversationState);
    
    // 5. Log message
    await _messageRepository.CreateAsync(new WhatsAppMessage
    {
        ConversationId = conversation.Id,
        WhatsAppMessageId = message.Id,
        Direction = "inbound",
        MessageType = "text",
        MessageText = messageText,
        DetectedIntent = intent.Name,
        Confidence = intent.Confidence
    });
    
    // 6. Handle intent
    var response = await HandleIntentAsync(intent, conversation, user, messageText);
    
    // 7. Send response
    await SendWhatsAppMessageAsync(phone, response);
    
    return Ok();
}

private async Task<string> HandleIntentAsync(
    Intent intent, 
    WhatsAppConversation conversation,
    User user,
    string messageText)
{
    switch (intent.Name)
    {
        case "order_status":
            // Parse: "Status ORD123" or "ORD123"
            var orderNumber = ExtractOrderNumber(messageText);
            if (string.IsNullOrEmpty(orderNumber))
                return "Please provide order number. Example: Status ORD123";
            
            var order = await _orderService.GetOrderByNumberAsync(orderNumber);
            if (order == null)
                return $"❌ Order {orderNumber} not found.";
            
            return FormatOrderStatus(order);
        
        case "set_availability":
            // Parse: "Available" or "Not available"
            var isAvailable = messageText.ToLower().Contains("available") && 
                            !messageText.ToLower().Contains("not");
            
            await _vendorService.SetAvailabilityAsync(user.Id, isAvailable);
            
            return isAvailable 
                ? "✅ You are now accepting orders." 
                : "⏸️ You are not accepting orders.";
        
        // ... more intents
        
        default:
            return "I didn't understand that. Try:\n" +
                   "• Status ORD123 (check order)\n" +
                   "• Available (start accepting orders)\n" +
                   "• Not available (stop accepting orders)";
    }
}
```

---

### 8. Analytics Service (Optional)
**Port**: 5008  
**Database**: Read-only replicas of other databases  
**Responsibility**: Admin dashboard metrics, reports, analytics

#### Core Functions
- Real-time metrics (orders, revenue, users)
- Historical reports
- Vendor performance analytics
- Buyer behavior analytics
- Financial reports

#### Note
This service can be added in Week 10+ after core MVP is complete. Initially, admin dashboard can query databases directly.

---

## Data Architecture

### Database Strategy

#### One Database Per Service ✅

Each service has its own PostgreSQL database to ensure:
- **Autonomy**: Services can deploy independently
- **Loose Coupling**: No shared database schemas
- **Scalability**: Each database can scale independently
- **Fault Isolation**: Database issues don't cascade

#### Total Databases: 7-8

| Service | Database Name | Size Estimate (MVP) |
|---------|---------------|---------------------|
| User Service | `realserv_users_db` | 10 MB (1K users) |
| Order Service | `realserv_orders_db` | 100 MB (10K orders) |
| Payment Service | `realserv_payments_db` | 50 MB (10K payments) |
| Catalog Service | `realserv_catalog_db` | 20 MB (500 items) |
| Vendor Management Service | `realserv_vendors_db` | 30 MB (100 vendors) |
| Notification Service | `realserv_notifications_db` | 50 MB (logs) |
| Integration Service | `realserv_integrations_db` | 30 MB (media metadata, WhatsApp logs) |
| Analytics Service (optional) | Read replicas | N/A |

**Total Storage**: ~290 MB for MVP

### Cross-Service Data Access

#### Problem
Order Service needs vendor name, but vendor data is in Vendor Management Service database.

#### Solutions (in order of preference)

**1. API Calls (Preferred for MVP)**
```csharp
// Order Service calls Vendor Management Service API
var vendor = await _vendorServiceClient.GetVendorAsync(vendorId);
var vendorName = vendor.BusinessName;
```

**2. Data Duplication (Snapshot Pattern)**
```sql
-- Store snapshot of vendor data at order time
orders (
  vendor_id UUID NOT NULL,
  vendor_snapshot JSONB  -- { "business_name": "ABC Suppliers", ... }
)
```

**3. Event-Driven Sync**
```csharp
// Vendor Service publishes event when vendor name changes
await _eventBus.PublishAsync(new VendorUpdatedEvent
{
    VendorId = vendorId,
    BusinessName = newName
});

// Order Service subscribes and updates its cache
```

**4. Shared Read Models (For Analytics)**
```sql
-- Analytics Service has read-only replicas
-- Can join data across services for reporting
```

---

## Authentication & Authorization

### Firebase Auth Integration

#### Why Firebase Auth?
- ✅ Phone OTP out-of-the-box (critical for India)
- ✅ JWT tokens (industry standard)
- ✅ Custom claims for roles
- ✅ SDK for .NET
- ✅ Free tier (10K MAU)
- ✅ Scales automatically

#### Authentication Flow

```
1. Buyer/Vendor opens app
   ↓
2. Enters phone number
   ↓
3. Firebase sends OTP via SMS
   ↓
4. User enters OTP
   ↓
5. Firebase verifies OTP
   ↓
6. Firebase returns ID token (JWT)
   ↓
7. App calls RealServ API with token
   ↓
8. API validates token with Firebase
   ↓
9. API extracts user_id, role from custom claims
   ↓
10. API processes request
```

#### Custom Claims Example

```json
{
  "iss": "https://securetoken.google.com/realserv-prod",
  "aud": "realserv-prod",
  "auth_time": 1704934800,
  "user_id": "abc123",
  "sub": "abc123",
  "iat": 1704934800,
  "exp": 1704938400,
  "phone_number": "+917906441952",
  "firebase": {
    "identities": {
      "phone": ["+917906441952"]
    },
    "sign_in_provider": "phone"
  },
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_type": "vendor",
  "vendor_id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "active"
}
```

#### .NET Middleware for Firebase Auth

```csharp
// Startup.cs
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://securetoken.google.com/realserv-prod";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://securetoken.google.com/realserv-prod",
            ValidateAudience = true,
            ValidAudience = "realserv-prod",
            ValidateLifetime = true
        };
    });

// Controller
[Authorize]
[HttpGet("me")]
public async Task<IActionResult> GetCurrentUser()
{
    var userId = User.FindFirst("user_id")?.Value;
    var userType = User.FindFirst("user_type")?.Value;
    
    // Use userId to fetch user from database
    var user = await _userService.GetUserAsync(Guid.Parse(userId));
    
    return Ok(user);
}
```

---

## MVP Implementation Phases

### Revised Timeline: 10 Weeks (vs. 15 weeks with 13 services)

#### Week 0: AWS Account Setup (Backend Engineer 1)
- Set up AWS account
- Configure IAM roles
- Set up Firebase project
- Set up Razorpay account
- Set up WhatsApp Business API

#### Week 1-2: Infrastructure + User Service
**Backend Engineers 1 & 2**
- AWS infrastructure (Terraform)
- RDS PostgreSQL setup (7 databases)
- S3 buckets
- User Service with Firebase Auth
- User, Buyer, Vendor CRUD APIs
- Docker Compose for local development

**Deliverable**: User Service deployed, auth working

#### Week 3: Catalog Service
**Backend Engineer 1**
- Material catalog CRUD
- Labor catalog CRUD
- Category management
- Admin APIs

**Backend Engineer 2** (parallel):
- API Gateway setup
- Load Balancer configuration
- CI/CD pipeline (GitHub Actions)

**Deliverable**: Catalog Service deployed, materials/labor browsable

#### Week 4-5: Order Service + Payment Service
**Backend Engineer 1 - Order Service**:
- Order creation
- Order status tracking
- Order history
- Support tickets (basic)

**Backend Engineer 2 - Payment Service**:
- Razorpay integration
- Payment order creation
- Payment verification
- Webhook handling
- COD management

**Deliverable**: End-to-end flow: Create order → Pay → Track

#### Week 6-7: Vendor Management Service
**Backend Engineers 1 & 2**:
- Vendor onboarding
- KYC workflow
- Vendor availability
- Settlement calculation
- Delivery tracking
- OTP generation/verification
- Delivery proof upload

**Deliverable**: Vendors can onboard, receive orders, deliver, get settlements

#### Week 8: Notification Service
**Backend Engineer 1**:
- Email notifications (AWS SES)
- WhatsApp template messages
- SMS integration
- Notification templates

**Backend Engineer 2** (parallel):
- Push notifications (FCM)
- Notification preferences

**Deliverable**: All user actions trigger notifications

#### Week 9: Integration Service
**Backend Engineer 1**:
- WhatsApp bot webhook
- Intent recognition
- Conversational flows

**Backend Engineer 2** (parallel):
- Media upload to S3
- Google Maps geocoding
- Distance calculation
- Service area validation

**Deliverable**: WhatsApp bot functional, media uploads working, location services integrated

#### Week 10: Testing & Polish
**All Engineers**:
- Integration testing (end-to-end flows)
- Load testing
- Bug fixes
- Performance optimization
- Documentation
- Deployment to production

**Deliverable**: Production-ready backend

---

## Cost Analysis

### AWS Cost Breakdown (MVP - 7-8 Services)

| Resource | Specification | Monthly Cost |
|----------|---------------|--------------|
| **ECS Fargate** (7 services) | 0.25 vCPU, 0.5 GB per service × 7 | $105 |
| **RDS PostgreSQL** (7 databases) | db.t4g.micro × 7 | $175 |
| **Application Load Balancer** | 1 ALB | $20 |
| **API Gateway** | 1M requests/month | $3.50 |
| **S3** | 10 GB storage, 100K requests | $5 |
| **CloudWatch** | Logs, metrics | $15 |
| **SES** | 10K emails/month | Free (within AWS) |
| **EventBridge + SQS** | 1M events | $2 |
| **NAT Gateway** | 1 NAT Gateway | $35 |
| **Secrets Manager** | 10 secrets | $4 |
| **Data Transfer** | 100 GB out | $9 |
| **CloudFront** (optional) | 100 GB out | $10 |
| **ElastiCache Redis** (optional) | cache.t4g.micro | $15 |
| **Backup & Snapshots** | 50 GB | $5 |
| **VPC & Networking** | VPC, subnets | $5 |
| | **TOTAL** | **~$413/month** |

### External Services

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| **Firebase Auth** | Free tier (10K MAU) | $0 |
| **Razorpay** | 2% per transaction | Variable (revenue-based) |
| **WhatsApp Business API** | Meta Cloud API (1K conversations/month free) | $0-50 |
| **Google Maps API** | $200 free credit/month | $0-50 |
| **Twilio SMS** (optional) | Pay-as-you-go | $20-50 |
| | **TOTAL** | **~$70-150/month** |

### Grand Total: $483-563/month

**With optional services (Redis, CloudFront, Analytics)**: ~$600-700/month

### Cost Comparison

| Architecture | Services | AWS Cost | Dev Time | Team Size |
|--------------|----------|----------|----------|-----------|
| **Over-simplified** | 3-4 | $300-400 | 6-8 weeks | 3-4 |
| **MVP-Optimized (Recommended)** | **7-8** | **$600-700** | **10 weeks** | **4-5** |
| **Full Microservices** | 13+ | $1,000+ | 15 weeks | 7+ |

---

## Migration to Full Microservices

### When to Split Services?

**Trigger Points**:
- 1,000+ daily orders
- 5+ engineers on backend team
- Specific service becomes bottleneck
- Clear need for independent scaling

### Phase 1 → Phase 2 Migration Path

#### Split 1: Vendor Management → 3 Services

**Current**: Vendor Management Service (vendors + settlements + delivery)

**Split into**:
1. **Vendor Service** - Onboarding, KYC, profiles
2. **Settlement Service** - Earnings calculation, payouts
3. **Delivery Service** - Delivery tracking, OTP, proof

**Effort**: 2-3 weeks

#### Split 2: Integration Service → 3 Services

**Current**: Integration Service (WhatsApp + media + location)

**Split into**:
1. **WhatsApp Gateway Service** - Conversational interface
2. **Media Service** - File uploads, S3 management
3. **Location Service** - Google Maps, geocoding

**Effort**: 2 weeks

#### Split 3: User Service → 2 Services

**Current**: User Service (all users)

**Split into**:
1. **User Management Service** - Auth, core profiles
2. **Buyer Service** - Buyer-specific features

**Effort**: 1-2 weeks

**Result**: 13 services (full microservices architecture)

---

## Security & Compliance

### Security Layers

1. **Network Security**
   - VPC with private subnets
   - Security groups
   - WAF (Web Application Firewall)

2. **Authentication**
   - Firebase Auth (phone OTP)
   - JWT tokens
   - Token expiration (1 hour)

3. **Authorization**
   - Role-based access control (RBAC)
   - Custom claims in Firebase
   - Policy-based authorization

4. **Data Security**
   - Encryption at rest (RDS, S3)
   - Encryption in transit (TLS 1.3)
   - Secrets in AWS Secrets Manager

5. **API Security**
   - Rate limiting (API Gateway)
   - Input validation
   - CORS policies
   - Request signing (Razorpay webhooks)

6. **Monitoring**
   - CloudWatch alarms
   - AWS GuardDuty
   - CloudTrail audit logs

---

## Deployment Strategy

### Environments

| Environment | Purpose | Services | Database |
|-------------|---------|----------|----------|
| **Development** | Local dev | Docker Compose | PostgreSQL (local) |
| **Staging** | Testing | ECS Fargate | RDS (db.t4g.micro) |
| **Production** | Live | ECS Fargate | RDS (db.t4g.small) |

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy-user-service.yml
name: Deploy User Service

on:
  push:
    branches: [main]
    paths:
      - 'src/services/UserService/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      
      - name: Build Docker image
        run: |
          docker build -t realserv-user-service:${{ github.sha }} \
            -f src/services/UserService/Dockerfile .
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS \
            --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker tag realserv-user-service:${{ github.sha }} \
            ${{ secrets.ECR_REGISTRY }}/realserv-user-service:${{ github.sha }}
          docker push ${{ secrets.ECR_REGISTRY }}/realserv-user-service:${{ github.sha }}
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster realserv-cluster \
            --service user-service \
            --force-new-deployment
```

---

## Monitoring & Observability

### Logging
- **Structured logs** (JSON format)
- **Centralized logging** (CloudWatch Logs)
- **Log levels**: DEBUG, INFO, WARN, ERROR, FATAL

### Metrics
- **Service metrics**: Request count, latency, error rate
- **Business metrics**: Orders created, payments successful, settlements generated
- **Infrastructure metrics**: CPU, memory, network

### Tracing
- **AWS X-Ray** for distributed tracing
- **Correlation IDs** across services

### Alerting
- **CloudWatch Alarms**:
  - API error rate > 5%
  - Database CPU > 80%
  - Payment webhook failures
  - Order creation failures

---

## Conclusion

This architecture provides a **balanced approach** for RealServ MVP:

✅ **Fast Time-to-Market**: 10 weeks (vs. 15 weeks)  
✅ **Cost-Effective**: $600-700/month (vs. $1,000+)  
✅ **Domain Boundaries Respected**: Critical services (payment, auth) are isolated  
✅ **Pragmatic Consolidation**: Tightly-coupled domains combined  
✅ **Clear Upgrade Path**: Can split into 13+ services post-PMF  
✅ **Production-Ready**: Industry-standard tech stack, security, monitoring  

**Recommendation**: Start with 7 services, validate product-market fit, then scale to full microservices architecture based on actual usage patterns and team growth.

---

**Next Step**: Review [Implementation Plan](/docs/backend/implementation-plan.md) for detailed week-by-week roadmap.
