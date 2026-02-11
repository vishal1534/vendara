# Universal Service Documentation Standard - RealServ

> **Goal:** Enterprise-grade documentation standards for ALL RealServ backend services  
> **Pattern:** Stripe/Twilio + Diátaxis framework  
> **Approach:** MVP - Essential only, production-ready  
> **Timeline:** 8 points (0-7)  
> **Industry:** B2B Construction Materials & Labor Marketplace

**Apply to:** All new and existing backend microservices

---

## 📌 Documentation Header Standard

**Every documentation file MUST include this standard header:**

```markdown
---
title: [Document Title]
service: [Service Name]
category: [tutorial|how-to-guide|reference|explanation|quickstart|api-reference]
last_updated: YYYY-MM-DD
version: [Service Version]
status: [active|deprecated|draft]
audience: [developers|devops|architects|all]
---

# [Document Title]

**Service:** [Service Name]  
**Category:** [Category]  
**Last Updated:** [Date]  
**Version:** [Version]

> **Quick Summary:** One-sentence description of what this document covers.

---
```

### Header Field Definitions

| Field | Required | Description | Example Values |
|-------|----------|-------------|----------------|
| **title** | Yes | Document title | "Authentication Guide", "API Reference" |
| **service** | Yes | Service name | "Identity Service", "Catalog Service" |
| **category** | Yes | Diátaxis category | tutorial, how-to-guide, reference, explanation, quickstart, api-reference |
| **last_updated** | Yes | Last modification date | 2026-01-11 |
| **version** | Yes | Service version | 1.0.0, 1.2.3 |
| **status** | Yes | Document status | active, deprecated, draft |
| **audience** | Yes | Target readers | developers, devops, architects, all |

### Category Definitions (Diátaxis Framework)

- **tutorial**: Learning-oriented, step-by-step lessons for beginners
- **how-to-guide**: Problem-oriented, solve specific tasks
- **reference**: Information-oriented, dry factual lookup (API docs, schemas, glossary)
- **explanation**: Understanding-oriented, concepts and design decisions
- **quickstart**: Special category for 5-minute setup guides
- **api-reference**: Special category for complete API documentation

### Status Definitions

- **active**: Current, maintained documentation
- **deprecated**: Old version, use for historical reference only
- **draft**: Work in progress, not yet finalized

### Audience Definitions

- **developers**: Backend/frontend developers integrating with the service
- **devops**: DevOps engineers deploying and maintaining the service
- **architects**: Technical architects making design decisions
- **all**: Anyone (general audience)

---

### Example Headers for Each Document Type

#### Example 1: QUICKSTART.md
```markdown
---
title: Quick Start - Identity Service
service: Identity Service
category: quickstart
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Quick Start - Identity Service

**Service:** Identity Service  
**Category:** Quick Start  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Get the Identity Service running in 5 minutes with Docker.

---
```

#### Example 2: API_REFERENCE.md
```markdown
---
title: API Reference - Identity Service
service: Identity Service
category: api-reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Identity Service API Reference

**Service:** Identity Service  
**Category:** API Reference  
**Last Updated:** January 11, 2026  
**API Version:** v1.0.0  
**Service Version:** 1.0.0

> **Quick Summary:** Complete API reference with 50+ code examples for authentication, buyer management, and geospatial search.

---
```

#### Example 3: How-to Guide (deploy-to-production.md)
```markdown
---
title: Deploy to Production
service: Identity Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: devops
---

# Deploy Identity Service to Production

**Service:** Identity Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Step-by-step guide to deploy Identity Service to Azure Kubernetes Service (AKS) with zero downtime.

---
```

#### Example 4: Reference (database-schema.md)
```markdown
---
title: Database Schema Reference
service: Identity Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Database Schema Reference - Identity Service

**Service:** Identity Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Database:** PostgreSQL 15 with PostGIS  
**Version:** 1.0.0

> **Quick Summary:** Complete PostgreSQL schema documentation including tables, relationships, indexes, and sample queries.

---
```

#### Example 5: Explanation (architecture-overview.md)
```markdown
---
title: Architecture Overview
service: Identity Service
category: explanation
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: architects
---

# Architecture Overview - Identity Service

**Service:** Identity Service  
**Category:** Explanation  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** High-level architecture, design decisions, and technology stack for the Identity Service microservice.

---
```

#### Example 6: Tutorial (getting-started.md)
```markdown
---
title: Getting Started with Identity Service
service: Identity Service
category: tutorial
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Getting Started Tutorial - Identity Service

**Service:** Identity Service  
**Category:** Tutorial  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete beginner tutorial covering Firebase setup, authentication, and creating your first buyer profile.

---
```

---

### Benefits of Standard Headers

✅ **Consistency**: Every doc follows the same structure  
✅ **Navigation**: Easy to understand what you're reading  
✅ **Maintenance**: Clear last updated dates and versions  
✅ **Searchability**: Metadata for search and indexing  
✅ **Audience**: Know if the doc is for you  
✅ **Organization**: Fits into Diátaxis framework  
✅ **Versioning**: Track service and doc versions  
✅ **Status tracking**: Know if doc is current or deprecated

---

### Header Maintenance Rules

1. **Update last_updated** whenever you modify the document
2. **Update version** when service version changes
3. **Mark as deprecated** when creating new version (don't delete old docs)
4. **Keep status as draft** until document is reviewed and complete
5. **Use consistent date format**: YYYY-MM-DD (ISO 8601)
6. **Keep title consistent** with filename (e.g., `authentication.md` → "Authentication Guide")

---

## 📋 The 8-Point Universal Plan

### ✅ Point 0: Remove Old Documentation (Clean Slate)

**Goal:** Clean slate - remove all old/legacy documentation before creating new

**Files to Remove:**
- Root level old docs (ARCHITECTURE.md, DEPLOYMENT_GUIDE.md, old README sections, etc.)
- Old /docs folder contents (if messy/outdated)
- Duplicate/legacy documentation
- Anything not part of the new structure
- Research/planning docs (move to /archive if needed)
- Migration helper files (e.g., rename scripts, completion markers)

**Rationale:** Start fresh, avoid confusion, ensure consistency

**Deliverable:** Clean directory with only essential code files + new docs structure

**RealServ-Specific:**
- Remove any vendor portal/admin portal documentation from backend services
- Keep frontend docs separate
- Archive implementation planning docs (keep in /backend/docs/archive/)

---

### ✅ Point 1: Shorten README.md

**Current problem:** Long, detailed, hard to scan  
**Target:** 150-250 lines, quick overview with links

**Required Sections:**
1. **Title + One-liner** (What is this service?)
2. **Key Features** (5-7 bullets max)
3. **Quick Start** (Link to QUICKSTART.md)
4. **Documentation** (Link tree)
5. **API Overview** (Link to API_REFERENCE.md)
6. **Tech Stack** (RealServ-specific: .NET 8, PostgreSQL, Redis, etc.)
7. **Contributing** (Link to CONTRIBUTING.md)
8. **License** (if applicable)

**Pattern:** Stripe/Twilio shortened README  
**Example Structure:**
```markdown
# Identity Service

Authentication, user management, and buyer profiles for RealServ construction marketplace.

## Key Features
- 🔐 Firebase OAuth (Google, Apple, Phone)
- 👤 User profiles (buyers, vendors, admins)
- 📍 PostGIS geospatial features (Hyderabad locations)
- 🏗️ Buyer organization management
- 🔑 JWT token management with role-based access
- 📱 WhatsApp OTP integration

## Quick Start
See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup.

## Documentation
- [API Reference](./API_REFERENCE.md)
- [Guides](./guides/)
- [Examples](./examples/)
- [Full Documentation](./docs/)

## Tech Stack
- .NET 8.0 (C#)
- PostgreSQL 15 with PostGIS
- Entity Framework Core 8
- Firebase Authentication
- Redis Cache
- Docker & Kubernetes

## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License
Proprietary - RealServ © 2026
```

---

### ✅ Point 2: Create QUICKSTART.md

**Goal:** True 5-minute setup at root level

**Required Content:**
1. **Prerequisites** (dependencies, accounts, API keys)
2. **Installation** (Docker OR manual)
3. **Start Service** (one command if possible)
4. **First Request** (actual working example)
5. **Verify** (health check)
6. **Next Steps** (links to guides)

**Format:**
- Copy-paste commands
- Expected outputs
- Troubleshooting section
- "You're done!" confirmation

**Pattern:** Stripe/Twilio QUICKSTART  
**Time limit:** Must be completable in 5 minutes

**RealServ-Specific Example:**
```markdown
---
title: Quick Start - Identity Service
service: Identity Service
category: quickstart
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Quick Start - Identity Service

**Service:** Identity Service  
**Category:** Quick Start  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Get the Identity Service running in 5 minutes with Docker.

---

## Prerequisites
- Docker Desktop installed
- Firebase project created ([Get Firebase credentials](./docs/how-to-guides/setup-firebase.md))
- PostgreSQL 15+ (via Docker)
- Redis 7+ (via Docker)

## 1. Clone & Configure
```bash
git clone https://github.com/realserv/backend.git
cd backend/src/services/IdentityService
cp appsettings.example.json appsettings.json
# Edit appsettings.json with your Firebase credentials
```

**Required Configuration:**
```json
{
  "Firebase": {
    "ProjectId": "your-project-id",
    "ServiceAccountKey": "path/to/serviceAccountKey.json"
  },
  "ConnectionStrings": {
    "IdentityServiceDb": "Host=localhost;Database=realserv_identity;Username=postgres;Password=postgres"
  }
}
```

## 2. Start Dependencies
```bash
# From /backend directory
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

## 3. Run Migrations
```bash
dotnet ef database update
```

## 4. Start Service
```bash
dotnet run
```

## 5. First Request
```bash
curl http://localhost:5001/health
```

**Expected Output:**
```json
{
  "status": "Healthy",
  "timestamp": "2026-01-11T12:00:00Z",
  "database": "Connected",
  "redis": "Connected"
}
```

## ✅ You're Done!

Your Identity Service is running on `http://localhost:5001`

### Next Steps:
- [Authenticate a buyer](./guides/authentication.md)
- [Create buyer profile](./guides/buyer-profiles.md)
- [Test with Postman](./examples/postman/)
- [API Reference](./API_REFERENCE.md)

### Common Issues:
- **Port 5001 already in use**: Change port in `appsettings.json` → `"Urls": "http://localhost:5002"`
- **Database connection failed**: Verify PostgreSQL is running → `docker ps`
- **Firebase auth failed**: Check Firebase credentials are correct
```

---

### ✅ Point 3: Create API_REFERENCE.md

**Goal:** Comprehensive API reference with 50+ examples at root level

**Required Sections:**
1. **Base URL & Authentication**
2. **All Endpoints** (grouped logically)
   - Method, path, description
   - Request parameters (query, body, headers)
   - Request schema (JSON)
   - Response schema (JSON)
   - Success response example
   - Error response examples (400, 401, 403, 404, 500)
3. **Multi-language Examples** (C#, Python, JavaScript, cURL for each endpoint)
4. **Error Codes** (all HTTP codes + RealServ-specific error codes)
5. **Rate Limiting** (if applicable)
6. **Pagination** (offset/limit pattern for RealServ)

**Pattern:** Stripe/Twilio API_REFERENCE  
**Target:** 50+ code examples minimum

**RealServ-Specific Example:**
```markdown
---
title: API Reference - Identity Service
service: Identity Service
category: api-reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Identity Service API Reference

**Service:** Identity Service  
**Category:** API Reference  
**Last Updated:** January 11, 2026  
**API Version:** v1.0.0  
**Service Version:** 1.0.0

> **Quick Summary:** Complete API reference with 50+ code examples for authentication, buyer management, and geospatial search.

---

## Base URL
```
Production: https://api.realserv.com/identity
Staging: https://staging-api.realserv.com/identity
Development: http://localhost:5001
```

## Authentication
All requests (except `/auth/*` endpoints) require a Bearer token:
```bash
Authorization: Bearer <access_token>
```

**Token Format:** JWT (JSON Web Token)  
**Token Lifetime:** 60 minutes  
**Refresh Token Lifetime:** 30 days

---

## Endpoints

### Authentication

#### POST /auth/firebase
Authenticate user with Firebase ID token (Google, Apple, Phone OTP).

**Request:**
```json
{
  "firebaseIdToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "provider": "google",
  "userType": "buyer"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firebaseIdToken | string | Yes | Firebase ID token from client |
| provider | string | Yes | Auth provider: `google`, `apple`, `phone` |
| userType | string | Yes | User type: `buyer`, `vendor`, `admin` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "abc123...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "firebaseUid": "firebase_xyz",
      "email": "builder@example.com",
      "phone": "+917906441952",
      "name": "Vishal Chauhan",
      "userType": "buyer",
      "createdAt": "2026-01-11T10:00:00Z"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FIREBASE_TOKEN",
    "message": "Firebase ID token is invalid or expired",
    "details": "Token signature verification failed"
  }
}
```

**cURL Example:**
```bash
curl -X POST https://api.realserv.com/identity/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseIdToken": "YOUR_FIREBASE_TOKEN",
    "provider": "google",
    "userType": "buyer"
  }'
```

**C# Example:**
```csharp
using System.Net.Http;
using System.Text.Json;

var client = new HttpClient();
var request = new
{
    FirebaseIdToken = "YOUR_FIREBASE_TOKEN",
    Provider = "google",
    UserType = "buyer"
};

var response = await client.PostAsJsonAsync(
    "https://api.realserv.com/identity/auth/firebase",
    request
);

var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
Console.WriteLine($"Access Token: {result.Data.AccessToken}");
```

**Python Example:**
```python
import requests

response = requests.post(
    'https://api.realserv.com/identity/auth/firebase',
    json={
        'firebaseIdToken': 'YOUR_FIREBASE_TOKEN',
        'provider': 'google',
        'userType': 'buyer'
    }
)
data = response.json()
print(f"Access Token: {data['data']['accessToken']}")
```

**JavaScript Example:**
```javascript
const response = await fetch('https://api.realserv.com/identity/auth/firebase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firebaseIdToken: 'YOUR_FIREBASE_TOKEN',
    provider: 'google',
    userType: 'buyer'
  })
});
const data = await response.json();
console.log('Access Token:', data.data.accessToken);
```

---

#### POST /auth/refresh
Refresh expired access token using refresh token.

**Request:**
```json
{
  "refreshToken": "abc123..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "def456...",
    "expiresIn": 3600
  }
}
```

**cURL Example:**
```bash
curl -X POST https://api.realserv.com/identity/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

#### POST /auth/logout
Invalidate current access and refresh tokens.

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Buyer Management

#### POST /buyers
Create a new buyer profile.

**Request:**
```json
{
  "name": "Vishal Chauhan",
  "businessName": "Kumar Constructions",
  "email": "rajesh@kumarconstructions.com",
  "phone": "+917906441952",
  "address": {
    "street": "Plot 123, Street 4",
    "area": "Madhapur",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": "500081",
    "latitude": 17.4485,
    "longitude": 78.3908
  },
  "gstNumber": "36XXXXX1234X1ZX",
  "preferredPaymentMethod": "UPI"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "buyer_123",
    "userId": "user_123",
    "name": "Vishal Chauhan",
    "businessName": "Kumar Constructions",
    "email": "rajesh@kumarconstructions.com",
    "phone": "+917906441952",
    "address": {
      "id": "addr_123",
      "street": "Plot 123, Street 4",
      "area": "Madhapur",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500081",
      "location": {
        "type": "Point",
        "coordinates": [78.3908, 17.4485]
      }
    },
    "gstNumber": "36XXXXX1234X1ZX",
    "preferredPaymentMethod": "UPI",
    "isVerified": false,
    "createdAt": "2026-01-11T10:00:00Z",
    "updatedAt": "2026-01-11T10:00:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST https://api.realserv.com/identity/buyers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vishal Chauhan",
    "businessName": "Kumar Constructions",
    "email": "rajesh@kumarconstructions.com",
    "phone": "+917906441952",
    "address": {
      "street": "Plot 123, Street 4",
      "area": "Madhapur",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500081",
      "latitude": 17.4485,
      "longitude": 78.3908
    }
  }'
```

---

#### GET /buyers/{id}
Get buyer profile by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Buyer ID (e.g., `buyer_123`) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "buyer_123",
    "userId": "user_123",
    "name": "Vishal Chauhan",
    "businessName": "Kumar Constructions",
    "email": "rajesh@kumarconstructions.com",
    "phone": "+917906441952",
    "address": { ... },
    "gstNumber": "36XXXXX1234X1ZX",
    "preferredPaymentMethod": "UPI",
    "isVerified": true,
    "totalOrders": 45,
    "totalSpent": 2500000.00,
    "createdAt": "2026-01-11T10:00:00Z",
    "updatedAt": "2026-01-11T12:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "BUYER_NOT_FOUND",
    "message": "Buyer with ID 'buyer_123' not found"
  }
}
```

**cURL Example:**
```bash
curl -X GET https://api.realserv.com/identity/buyers/buyer_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### PUT /buyers/{id}
Update buyer profile.

**Request:**
```json
{
  "businessName": "Kumar Constructions Pvt Ltd",
  "address": {
    "street": "Plot 456, Street 8",
    "area": "Gachibowli",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": "500032",
    "latitude": 17.4399,
    "longitude": 78.3489
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "buyer_123",
    "businessName": "Kumar Constructions Pvt Ltd",
    "address": { ... },
    "updatedAt": "2026-01-11T14:00:00Z"
  }
}
```

---

#### DELETE /buyers/{id}
Delete buyer profile (soft delete).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Buyer profile deleted successfully"
}
```

---

#### GET /buyers
List all buyers with pagination and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 20 | Results per page (max: 100) |
| area | string | No | - | Filter by area (e.g., "Madhapur") |
| isVerified | boolean | No | - | Filter by verification status |
| sortBy | string | No | createdAt | Sort field: `createdAt`, `name`, `totalOrders` |
| sortOrder | string | No | desc | Sort order: `asc`, `desc` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "buyer_123",
        "name": "Vishal Chauhan",
        "businessName": "Kumar Constructions",
        "area": "Madhapur",
        "isVerified": true,
        "totalOrders": 45,
        "createdAt": "2026-01-11T10:00:00Z"
      },
      { ... }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "https://api.realserv.com/identity/buyers?page=1&limit=20&area=Madhapur&isVerified=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### GET /buyers/nearby
Find buyers near a location (geospatial search).

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | decimal | Yes | Center latitude |
| longitude | decimal | Yes | Center longitude |
| radius | integer | No | Search radius in km (default: 10, max: 50) |
| limit | integer | No | Max results (default: 20) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "buyer_123",
        "name": "Vishal Chauhan",
        "businessName": "Kumar Constructions",
        "area": "Madhapur",
        "distance": 2.5,
        "location": {
          "latitude": 17.4485,
          "longitude": 78.3908
        }
      },
      { ... }
    ],
    "searchCenter": {
      "latitude": 17.4485,
      "longitude": 78.3908
    },
    "radiusKm": 10,
    "totalFound": 12
  }
}
```

**cURL Example:**
```bash
curl -X GET "https://api.realserv.com/identity/buyers/nearby?latitude=17.4485&longitude=78.3908&radius=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Address Management

#### GET /buyers/{buyerId}/addresses
Get all addresses for a buyer.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "addr_123",
      "type": "primary",
      "street": "Plot 123, Street 4",
      "area": "Madhapur",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500081",
      "location": {
        "type": "Point",
        "coordinates": [78.3908, 17.4485]
      },
      "isPrimary": true,
      "createdAt": "2026-01-11T10:00:00Z"
    },
    { ... }
  ]
}
```

---

#### POST /buyers/{buyerId}/addresses
Add a new address for a buyer.

**Request:**
```json
{
  "type": "delivery",
  "street": "Site 789, KPHB",
  "area": "Kukatpally",
  "city": "Hyderabad",
  "state": "Telangana",
  "pincode": "500072",
  "latitude": 17.4949,
  "longitude": 78.3978,
  "isPrimary": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "addr_456",
    "type": "delivery",
    "street": "Site 789, KPHB",
    "area": "Kukatpally",
    "city": "Hyderabad",
    "isPrimary": false,
    "createdAt": "2026-01-11T15:00:00Z"
  }
}
```

---

## Error Codes

### HTTP Status Codes
| Code | Description | Common Causes |
|------|-------------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error, try again |
| 503 | Service Unavailable | Service temporarily down |

### RealServ Error Codes
| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| INVALID_FIREBASE_TOKEN | 401 | Firebase token invalid/expired | Re-authenticate with Firebase |
| USER_NOT_FOUND | 404 | User doesn't exist | Check user ID |
| BUYER_NOT_FOUND | 404 | Buyer doesn't exist | Check buyer ID |
| BUYER_ALREADY_EXISTS | 409 | Buyer profile already exists | Use PUT to update |
| INVALID_GST_NUMBER | 422 | GST number format invalid | Provide valid GST number |
| INVALID_PHONE_NUMBER | 422 | Phone number format invalid | Use +91XXXXXXXXXX format |
| INVALID_COORDINATES | 422 | Latitude/longitude invalid | Check coordinate ranges |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait and retry |
| DATABASE_ERROR | 500 | Database connection failed | Retry or contact support |

---

## Rate Limiting

**Limits:**
- **Authentication endpoints**: 10 requests/minute per IP
- **Read endpoints (GET)**: 100 requests/minute per user
- **Write endpoints (POST/PUT/DELETE)**: 50 requests/minute per user

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1673452800
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please wait before retrying.",
    "retryAfter": 60
  }
}
```

---

## Pagination

All list endpoints support pagination with the following parameters:

**Request:**
```
GET /buyers?page=2&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 2,
      "limit": 50,
      "totalItems": 500,
      "totalPages": 10,
      "hasNext": true,
      "hasPrevious": true
    }
  }
}
```

---

## Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional technical details",
    "field": "fieldName"
  }
}
```

---

## API Versioning

**Current Version:** v1  
**Base URL:** `https://api.realserv.com/identity/v1`

Version is included in the URL path. When breaking changes are introduced, a new version will be released (v2, v3, etc.).

**Version Header (alternative):**
```
X-API-Version: v1
```

---

## Testing

**Postman Collection:**
- [Download Postman Collection](./examples/postman/IdentityService.postman_collection.json)
- [Environment Variables](./examples/postman/RealServ-Dev.postman_environment.json)

**Test Environment:**
- Base URL: `https://staging-api.realserv.com/identity`
- Test Credentials: Contact dev team

**Health Check:**
```bash
curl https://api.realserv.com/identity/health
```

---

**Last Updated:** January 11, 2026  
**API Version:** v1.0.0  
**Service Version:** 1.0.0
```

---

### ✅ Point 4: Create /guides and /examples

**Goal:** Problem-solving guides + working code at root level

**/guides (4-6 files):**
1. **README.md** - Navigation hub
2. **getting-started.md** - Detailed setup (beyond quickstart)
3. **[service-core-feature-1].md** - Main use case guide
4. **[service-core-feature-2].md** - Secondary use case guide
5. **best-practices.md** - Production tips
6. **(Optional)** Additional guides for complex features

**/examples (3+ language folders):**
1. **README.md** - Example navigation
2. **csharp/** 
   - RealServClient.cs (working .NET client)
   - Program.cs (example usage)
   - RealServClient.csproj
   - README.md (how to run)
3. **python/**
   - realserv_client.py (working client)
   - example.py (usage examples)
   - requirements.txt
   - README.md (how to run)
4. **javascript/**
   - realserv-client.js (working client)
   - example.js (usage examples)
   - package.json
   - README.md (how to run)
5. **postman/**
   - [ServiceName].postman_collection.json
   - RealServ-Dev.postman_environment.json
   - README.md (how to import)

**Pattern:** Stripe guides + working examples  
**Requirement:** All examples must actually work!

---

### RealServ Service-Specific Core Features:

#### Identity Service
**Core Features:**
- Firebase OAuth authentication (Google, Apple, Phone OTP)
- User profile management (buyers, vendors, admins)
- Buyer organization management
- PostGIS geospatial search (Hyderabad locations)
- JWT token management with role-based access

**Key Guides:**
- `authentication.md` - Firebase OAuth integration
- `buyer-profiles.md` - Creating and managing buyer profiles
- `geospatial-search.md` - Finding buyers/vendors nearby
- `role-based-access.md` - User roles and permissions

---

#### Catalog Service
**Core Features:**
- Material catalog management (cement, steel, sand, etc.)
- Labor catalog (carpenters, masons, plumbers, etc.)
- SKU management with variants
- Category hierarchy
- Pricing and inventory

**Key Guides:**
- `material-catalog.md` - Managing construction materials
- `labor-catalog.md` - Managing skilled labor listings
- `pricing-inventory.md` - Price management and stock tracking
- `category-management.md` - Category hierarchy

---

#### Order Service
**Core Features:**
- Order creation and management
- Order status tracking (Pending → Confirmed → Delivered)
- Multi-item orders (materials + labor)
- Order history and analytics
- Cancellation and refunds

**Key Guides:**
- `create-order.md` - Creating material/labor orders
- `order-tracking.md` - Track order status
- `order-fulfillment.md` - Vendor fulfillment workflow
- `cancellation-refunds.md` - Handling cancellations

---

#### Payment Service
**Core Features:**
- Payment gateway integration (Razorpay)
- Payment processing (UPI, Cards, Wallets)
- Payment verification
- Refund processing
- Payment history

**Key Guides:**
- `payment-integration.md` - Razorpay integration
- `payment-verification.md` - Verify payment status
- `refund-processing.md` - Process refunds
- `payment-webhooks.md` - Handle payment webhooks

---

#### Settlement Service
**Core Features:**
- Vendor payout management
- Settlement calculations (order value - commission)
- Payout scheduling (weekly, bi-weekly)
- Bank account management
- Settlement reports

**Key Guides:**
- `vendor-payouts.md` - Managing vendor payouts
- `settlement-calculations.md` - Commission and settlement logic
- `bank-account-setup.md` - Vendor bank account setup
- `settlement-reports.md` - Generate settlement reports

---

#### Delivery Service
**Core Features:**
- Delivery partner management
- Route optimization
- Real-time tracking
- Proof of delivery
- Delivery scheduling

**Key Guides:**
- `delivery-scheduling.md` - Schedule deliveries
- `route-optimization.md` - Optimize delivery routes
- `real-time-tracking.md` - Track deliveries live
- `proof-of-delivery.md` - Capture delivery proof

---

#### Location Service
**Core Features:**
- Hyderabad location data (areas, pincodes)
- PostGIS geospatial queries
- Delivery zones
- Location autocomplete
- Distance calculations

**Key Guides:**
- `location-search.md` - Search locations in Hyderabad
- `delivery-zones.md` - Manage delivery zones
- `distance-calculations.md` - Calculate distances
- `location-autocomplete.md` - Implement autocomplete

---

#### Notification Service
**Core Features:**
- Multi-channel notifications (Push, SMS, Email, WhatsApp)
- Template management
- Notification preferences
- Delivery tracking
- Scheduled notifications

**Key Guides:**
- `push-notifications.md` - Send push notifications
- `whatsapp-integration.md` - WhatsApp messaging
- `notification-templates.md` - Manage templates
- `notification-preferences.md` - User preferences

---

#### WhatsApp Gateway Service
**Core Features:**
- WhatsApp Business API integration
- OTP delivery via WhatsApp
- Order updates via WhatsApp
- Template messages
- Rich media support

**Key Guides:**
- `whatsapp-otp.md` - Send OTP via WhatsApp
- `order-updates.md` - Send order updates
- `template-messages.md` - Use WhatsApp templates
- `media-messages.md` - Send images/PDFs

---

#### Support Service
**Core Features:**
- Support ticket management
- Multi-channel support (Chat, Email, Phone)
- Ticket prioritization
- SLA tracking
- Knowledge base

**Key Guides:**
- `ticket-management.md` - Create and manage tickets
- `sla-tracking.md` - Track SLA compliance
- `knowledge-base.md` - Manage KB articles
- `escalation-workflow.md` - Ticket escalation

---

#### Media Service
**Core Features:**
- File upload (S3)
- Image optimization
- CDN integration
- File type validation
- Temporary URLs

**Key Guides:**
- `file-upload.md` - Upload files to S3
- `image-optimization.md` - Optimize images
- `cdn-integration.md` - Serve files via CDN
- `secure-uploads.md` - Generate signed URLs

---

#### Analytics Service
**Core Features:**
- Business intelligence
- Sales analytics
- User behavior tracking
- Custom reports
- Data export

**Key Guides:**
- `sales-analytics.md` - Track sales metrics
- `user-analytics.md` - User behavior tracking
- `custom-reports.md` - Create custom reports
- `data-export.md` - Export analytics data

---

### ✅ Point 5: Restructure /docs with Diátaxis Framework

**Goal:** Organize using industry-standard Diátaxis pattern

**New Structure:**
```
docs/
├── README.md                    # Diátaxis navigation hub
├── tutorials/
│   ├── README.md
│   └── getting-started.md       # First-time user tutorial
├── how-to-guides/
│   ├── README.md
│   └── (3-5 guides from Point 7)
├── reference/
│   ├── README.md
│   ├── api-reference.md         # Link to root API_REFERENCE.md
│   └── (5-7 references from Point 6)
└── explanation/
    ├── README.md
    └── (2-3 explanations from Point 6-7)
```

**Diátaxis Categories:**
- **Tutorials:** Learning-oriented (step-by-step lessons)
- **How-to Guides:** Problem-oriented (solve specific tasks)
- **Reference:** Information-oriented (dry, factual lookup)
- **Explanation:** Understanding-oriented (why things work)

**Pattern:** Django/Gatsby Diátaxis framework

**RealServ-Specific Diátaxis Navigation Hub:**
```markdown
# Identity Service Documentation

## 📚 Documentation Types

### 🎓 Tutorials (Learning-Oriented)
Start here if you're new to the Identity Service.
- [Getting Started](./tutorials/getting-started.md) - Your first integration
- [Building Your First Buyer App](./tutorials/first-buyer-app.md) - Complete tutorial

### 🔧 How-To Guides (Problem-Oriented)
Solve specific problems and tasks.
- [Deploy to Production](./how-to-guides/deploy-to-production.md) - Production deployment
- [Setup Firebase Authentication](./how-to-guides/setup-firebase.md) - Firebase integration
- [Optimize PostGIS Queries](./how-to-guides/optimize-postgis.md) - Geospatial performance
- [Monitor and Debug](./how-to-guides/monitor-and-debug.md) - Monitoring setup
- [Handle High Load](./how-to-guides/handle-high-load.md) - Scalability

### 📖 Reference (Information-Oriented)
Look up technical details.
- [API Reference](./reference/api-reference.md) - Complete API documentation
- [Error Codes](./reference/error-codes.md) - All error codes and solutions
- [Configuration](./reference/configuration.md) - Environment variables
- [Database Schema](./reference/database-schema.md) - PostgreSQL schema
- [Glossary](./reference/glossary.md) - Terms and definitions
- [Troubleshooting](./reference/troubleshooting.md) - Common issues

### 💡 Explanation (Understanding-Oriented)
Understand concepts and design decisions.
- [Architecture Overview](./explanation/architecture-overview.md) - System architecture
- [Security Model](./explanation/security-model.md) - Authentication & authorization
- [Microservices Design](./explanation/microservices-design.md) - Why microservices?
```

---

### ✅ Point 6: Create Essential Reference Files

**Goal:** Quick lookup documentation (MVP level)

**Required Files (in /docs/reference/):**

1. **glossary.md** 
   - 30-50 essential terms
   - Alphabetical order
   - Clear, concise definitions
   - RealServ-specific terminology

2. **error-codes.md**
   - All HTTP error codes
   - RealServ-specific error codes
   - Solutions for each error
   - Code examples

3. **troubleshooting.md**
   - Top 15-20 common issues
   - Problem → Solution format
   - Links to relevant docs
   - Quick fixes

4. **configuration.md**
   - All environment variables
   - Required vs optional
   - Default values
   - Examples for dev/staging/production

5. **database-schema.md**
   - All tables with descriptions
   - Column descriptions
   - Relationships (foreign keys)
   - Indexes and constraints
   - Sample queries

6. **(Optional)** **webhooks.md** (if service has webhooks)
   - Webhook events
   - Payload structure
   - Signature verification
   - Retry logic

**Plus 1 explanation file (in /docs/explanation/):**

7. **architecture-overview.md**
   - System architecture diagram
   - Component descriptions
   - Data flow diagrams
   - Technology stack
   - Design decisions and rationale

**Approach:** MVP - Essential only, not exhaustive

---

#### RealServ-Specific Glossary Example:

```markdown
---
title: Glossary - Identity Service
service: Identity Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Glossary - Identity Service

**Service:** Identity Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** 30-50 essential terms and definitions specific to the Identity Service.

---

## A
**Access Token**: Short-lived JWT token (60 minutes) for API authentication

**Address**: Physical location for delivery or billing (stored with PostGIS coordinates)

**Admin**: RealServ internal user with full system access

**Area**: Neighborhood/locality within Hyderabad (e.g., Madhapur, Gachibowli)

## B
**Buyer**: Individual home builder or small construction firm purchasing materials/labor

**Buyer Profile**: Complete information about a buyer including contact, address, GST details

**Business Name**: Company/firm name of the buyer

## F
**Firebase Auth**: Third-party authentication provider (Google, Apple, Phone OTP)

**Firebase UID**: Unique user identifier from Firebase (e.g., `firebase_xyz123`)

## G
**Geospatial Query**: PostGIS-powered location-based search (find buyers/vendors nearby)

**GST Number**: Goods and Services Tax identification number (format: 36XXXXX1234X1ZX)

## H
**Hyderabad**: Primary service area for RealServ (Telangana, India)

## J
**JWT**: JSON Web Token used for stateless authentication

## P
**Pincode**: 6-digit postal code (e.g., 500081 for Madhapur)

**PostGIS**: PostgreSQL extension for geospatial data (points, polygons, distances)

**Primary Address**: Default delivery address for a buyer

## R
**Refresh Token**: Long-lived token (30 days) to obtain new access tokens without re-authentication

**Role**: User permission level (Buyer, Vendor, Admin)

**Role-Based Access Control (RBAC)**: Authorization system based on user roles

## U
**User**: Base account entity linked to Firebase authentication

**User Type**: Category of user (buyer, vendor, admin)

## V
**Vendor**: Supplier of construction materials or skilled labor

**Verification Status**: Whether buyer/vendor is verified by RealServ admin

## W
**WhatsApp OTP**: One-time password delivered via WhatsApp for phone authentication
```

---

### ✅ Point 7: Create Security & Operations Docs

**Goal:** Production-ready operations documentation

**Required Files:**

**In /docs/how-to-guides/ (4-5 files):**

1. **deploy-to-production.md**
   - Deployment options (Docker, Kubernetes, Azure/AWS)
   - Environment setup (dev, staging, production)
   - Database migration process
   - Blue-green deployment
   - Verification steps
   - Rollback procedure

2. **optimize-performance.md**
   - Performance tuning (.NET, Entity Framework)
   - Database optimization (PostgreSQL, PostGIS indexes)
   - Caching strategies (Redis)
   - Connection pooling
   - Query optimization
   - Monitoring setup (Application Insights)

3. **monitor-and-debug.md**
   - Logging configuration (Serilog)
   - Monitoring tools (Application Insights, Prometheus, Grafana)
   - Debugging techniques (remote debugging, logs)
   - Common issues and solutions
   - Performance profiling
   - Health checks

4. **setup-firebase.md** (RealServ-specific)
   - Firebase project setup
   - Enable Google/Apple/Phone authentication
   - Download service account key
   - Configure Firebase in appsettings.json
   - Test authentication flow

5. **handle-high-load.md** (RealServ-specific)
   - Horizontal scaling (Kubernetes)
   - Load balancing (Azure Load Balancer)
   - Database read replicas
   - Redis caching strategy
   - Rate limiting
   - Circuit breakers

**In /docs/explanation/ (2 files):**

6. **security-model.md**
   - Firebase authentication flow
   - JWT token generation and validation
   - Authorization model (RBAC - buyer, vendor, admin roles)
   - Security best practices (HTTPS, CORS, input validation)
   - Data encryption (at rest, in transit)
   - GDPR/privacy compliance
   - API key management

7. **microservices-design.md** (RealServ-specific)
   - Why microservices architecture?
   - Service boundaries (Identity, Catalog, Order, Payment, etc.)
   - Inter-service communication (REST APIs, message queues)
   - Data ownership (each service owns its database)
   - Service discovery
   - API Gateway pattern
   - Event-driven architecture

**Content Focus:**
- Production deployment (Azure/AWS, Kubernetes)
- Performance optimization (PostGIS, Redis, Entity Framework)
- Monitoring & alerting (Application Insights, Serilog)
- Security hardening (RBAC, JWT, HTTPS)
- RealServ-specific operational concerns

---

## 📊 Expected Results (Per Service)

### File Count
- **Point 0:** Remove ~10-20 old files
- **Point 1:** 1 file (README.md edited)
- **Point 2:** 1 file (QUICKSTART.md)
- **Point 3:** 1 file (API_REFERENCE.md)
- **Point 4:** 12-15 files (/guides + /examples)
- **Point 5:** 8-10 files (/docs restructure)
- **Point 6:** 6-7 files (reference + explanation)
- **Point 7:** 6-7 files (operations)

**Total:** ~35-45 new documentation files per service

---

### Content Volume (Approximate)
- **Point 0:** Cleanup (remove ~5,000+ words)
- **Point 1:** ~600-900 words
- **Point 2:** ~1,200-1,800 words
- **Point 3:** ~4,000-6,000 words (50+ examples)
- **Point 4:** ~6,000-8,000 words
- **Point 5:** ~6,000-8,000 words
- **Point 6:** ~8,000-10,000 words
- **Point 7:** ~8,000-10,000 words

**Total:** ~35,000-45,000 words of new documentation per service

---

## 🎯 Universal Success Criteria

### ✅ Matches Industry Standards
- Stripe/Twilio pattern (shortened README, QUICKSTART, API_REFERENCE at root)
- Diátaxis framework (tutorials, how-to, reference, explanation)
- 50+ multi-language examples (C#, Python, JavaScript, cURL)
- Professional formatting (Markdown, code blocks, tables)

### ✅ Developer Experience
- 5-minute setup (QUICKSTART)
- Copy-paste examples that work
- Clear navigation (README → docs tree)
- Multiple learning paths (tutorial, how-to, reference)
- Searchable content (GitHub, Ctrl+F friendly)

### ✅ Production Ready
- Deployment guides (Docker, Kubernetes, Azure/AWS)
- Performance optimization (PostGIS, Redis, Entity Framework)
- Monitoring setup (Application Insights, Serilog)
- Security best practices (RBAC, JWT, encryption)
- Troubleshooting guides (15-20 common issues)

### ✅ Maintainable
- MVP approach (essential only, no bloat)
- Consistent structure across all RealServ services
- Easy to update (single source of truth)
- No duplication (link, don't copy)
- Version controlled (Git)

---

## 🚀 Execution Order

**For any RealServ service:**

1. **Point 0:** Cleanup (remove old docs) → Clean slate ✅
2. **Point 1:** Shorten README → Quick overview
3. **Point 2:** Create QUICKSTART → 5-min setup
4. **Point 3:** Create API_REFERENCE → Complete API docs
5. **Point 4:** Create /guides + /examples → Hands-on learning
6. **Point 5:** Restructure /docs → Diátaxis framework
7. **Point 6:** Create reference files → Quick lookup
8. **Point 7:** Create operations files → Production ready

**Estimated time per service:** ~6-10 hours total (depending on service complexity)

---

## 📚 RealServ Service Priorities

### Priority 1 (MVP Critical - Week 1-3)
1. ✅ **Identity Service** (completed code, needs documentation)
2. **Catalog Service** (materials + labor)
3. **Order Service** (core business logic)

### Priority 2 (MVP Critical - Week 4-6)
4. **Payment Service** (Razorpay integration)
5. **Settlement Service** (vendor payouts)
6. **Delivery Service** (logistics)

### Priority 3 (Supporting Services - Week 7-10)
7. **Location Service** (geospatial)
8. **Notification Service** (multi-channel)
9. **WhatsApp Gateway Service** (OTP, updates)
10. **Support Service** (tickets)
11. **Media Service** (file uploads)
12. **Analytics Service** (reporting)

**Recommendation:** Apply this documentation standard to services in priority order as you build them.

---

## 🎓 RealServ-Specific Best Practices

### 1. Hyderabad Context
- Always reference Hyderabad locations in examples (Madhapur, Gachibowli, etc.)
- Use Indian phone number format (+91XXXXXXXXXX)
- Include GST number examples (36XXXXX1234X1ZX)
- Reference INR currency (₹)
- Use realistic construction material examples (cement, TMT bars, sand)

### 2. B2B Marketplace Context
- Examples should reflect small builders, not consumers
- Use business terminology (orders, settlements, invoices)
- Reference typical order sizes (50 bags of cement, not 1 bag)
- Include vendor/buyer relationship examples
- Show fixed pricing (no negotiation)

### 3. Technology Stack
- All examples use .NET 8.0 (C#)
- PostgreSQL 15 with PostGIS for geospatial
- Entity Framework Core 8 for ORM
- Redis for caching
- Firebase for authentication
- Docker & Kubernetes for deployment
- Azure as primary cloud (AWS as fallback)

### 4. Code Examples
- Provide C# examples FIRST (primary language)
- Then Python, JavaScript for client integrations
- Always include cURL for API testing
- Use realistic RealServ data (not "foo", "bar")
- Test all examples before documenting

### 5. Security & Compliance
- Document RBAC (buyer, vendor, admin roles)
- Include authentication in all examples
- Reference GDPR/privacy compliance
- Document GST number validation
- Show secure payment handling (Razorpay)

---

## 📋 Quick Checklist (Apply to Any RealServ Service)

```markdown
### Point 0: Cleanup
- [ ] Remove old README sections
- [ ] Remove old docs/ files
- [ ] Remove duplicate documentation
- [ ] Archive research/planning docs to /backend/docs/archive/
- [ ] Remove migration helper files (*.sh, *-COMPLETE.md)

### Point 1: README
- [ ] Shorten to 150-250 lines
- [ ] Clear one-liner description
- [ ] 5-7 key features
- [ ] Links to all major docs
- [ ] Tech stack listed (.NET, PostgreSQL, etc.)

### Point 2: QUICKSTART
- [ ] Prerequisites listed (Docker, Firebase, etc.)
- [ ] Installation steps (copy-paste commands)
- [ ] First request example (health check)
- [ ] Verify/health check
- [ ] Completable in 5 minutes
- [ ] Common issues section

### Point 3: API_REFERENCE
- [ ] All endpoints documented (13+ for Identity Service)
- [ ] Request/response schemas with examples
- [ ] 50+ code examples (C#, Python, JavaScript, cURL)
- [ ] Error codes table (HTTP + RealServ-specific)
- [ ] Rate limiting documented
- [ ] Pagination documented

### Point 4: Guides & Examples
- [ ] /guides created with 4-6 guides
- [ ] /examples created with 4 languages (C#, Python, JavaScript, Postman)
- [ ] All examples tested and working
- [ ] Navigation READMEs in each folder
- [ ] RealServ-specific examples (Hyderabad locations, GST, etc.)

### Point 5: /docs Restructure
- [ ] Diátaxis structure created
- [ ] tutorials/ folder with README
- [ ] how-to-guides/ folder with README
- [ ] reference/ folder with README
- [ ] explanation/ folder with README
- [ ] Navigation README at /docs/README.md

### Point 6: Reference Files
- [ ] glossary.md (30-50 RealServ terms)
- [ ] error-codes.md (HTTP + RealServ codes)
- [ ] troubleshooting.md (15-20 common issues)
- [ ] configuration.md (all env variables)
- [ ] database-schema.md (PostgreSQL schema)
- [ ] architecture-overview.md (system design)

### Point 7: Operations
- [ ] deploy-to-production.md (Azure/Kubernetes)
- [ ] optimize-performance.md (PostGIS, Redis, EF Core)
- [ ] monitor-and-debug.md (Serilog, Application Insights)
- [ ] setup-firebase.md (Firebase integration)
- [ ] handle-high-load.md (scaling strategies)
- [ ] security-model.md (RBAC, JWT, encryption)
- [ ] microservices-design.md (architecture rationale)
```

---

## 🌟 RealServ Service Status

### Backend Microservices (14 total)
- ✅ **Identity Service** - Code 100% complete, documentation pending
- ⏳ **Catalog Service** - Awaiting implementation
- ⏳ **Order Service** - Awaiting implementation
- ⏳ **Payment Service** - Awaiting implementation
- ⏳ **Settlement Service** - Awaiting implementation
- ⏳ **Delivery Service** - Awaiting implementation
- ⏳ **Location Service** - Awaiting implementation
- ⏳ **Notification Service** - Awaiting implementation
- ⏳ **WhatsApp Gateway Service** - Awaiting implementation
- ⏳ **Support Service** - Awaiting implementation
- ⏳ **Media Service** - Awaiting implementation
- ⏳ **Analytics Service** - Awaiting implementation
- ⏳ **Vendor Service** - Awaiting implementation
- ⏳ **Buyer Service** - Awaiting implementation

**Recommendation:** Apply this documentation standard to **Identity Service first** (code is ready), then to each new service as you build them.

---

## 🎯 Quality Standards

### All Documentation Must:

**Be Accurate:**
- ✅ All code examples tested in real environment
- ✅ All commands verified on Windows/macOS/Linux
- ✅ All links checked (no 404s)
- ✅ No placeholder content (no "TODO", "FIXME")
- ✅ Reflects actual API behavior

**Be Clear:**
- ✅ Simple language (avoid jargon)
- ✅ Logical organization (scannable)
- ✅ Clear headings (H2, H3 hierarchy)
- ✅ Visual hierarchy (bullets, tables, code blocks)
- ✅ RealServ/Hyderabad context provided

**Be Complete:**
- ✅ All 8 points covered
- ✅ No gaps in workflow (authentication → first request → error handling)
- ✅ All features documented
- ✅ All errors covered with solutions
- ✅ All examples include expected output

**Be Maintainable:**
- ✅ Single source of truth (no duplication)
- ✅ DRY principle (link, don't copy)
- ✅ Easy to update (well-structured Markdown)
- ✅ Version controlled (Git)
- ✅ Consistent across all services

---

## 📞 Support & Questions

**For implementation help:**
1. Follow this plan point-by-point (0 → 7)
2. Use the checklist above for each service
3. Test all examples before committing
4. Reference completed services as examples (start with Identity Service)

**For new services:**
1. Start with this universal plan
2. Customize Point 4, 6, 7 for service-specific features
3. Keep everything else standard (consistency is key)
4. Maintain RealServ terminology and context

**For updates:**
1. Date-stamp all documentation
2. Mark deprecated features clearly
3. Update CHANGELOG.md in service root
4. Announce breaking changes in advance

---

## 🔄 Maintenance Strategy

### After Initial Creation:

**Weekly:**
- Update code examples if APIs change
- Fix broken links
- Address user feedback from dev team

**Monthly:**
- Review and update how-to guides
- Add new examples for common use cases
- Update troubleshooting with new issues
- Check for outdated content

**Quarterly:**
- Review architecture diagrams
- Update performance benchmarks
- Review security best practices
- Archive old versions

**Major Releases:**
- Update API_REFERENCE with new endpoints
- Update QUICKSTART if setup changes
- Update architecture diagrams
- Add migration guides (v1 → v2)
- Update all version numbers

**Keep Fresh:**
- Date-stamp all docs (Last Updated: YYYY-MM-DD)
- Mark deprecated features with warnings
- Archive old versions to /docs/archive/
- Keep CHANGELOG.md updated
- Link to specific Git tags for versioned docs

---

## 🎓 Lessons Learned from PlayCircle

### What Worked Well ✅
- MVP approach (essential only, no bloat)
- Multiple code examples (50+ target)
- Clear navigation paths (README → docs tree)
- Consistent structure across services
- Progress summaries after each point
- Diátaxis framework for organization
- Industry patterns (Stripe/Twilio)

### What to Avoid ❌
- Over-documentation (bloat, too detailed)
- Duplicate information (copy-paste across docs)
- Complex navigation (too many folders)
- Missing examples (theory without practice)
- Outdated content (unmaintained docs)
- Inconsistent formatting (breaks scanability)
- Placeholder content ("TODO", "Coming soon")

### RealServ-Specific Best Practices ✅
1. **Start with cleanup** (Point 0 is critical!)
2. **Test all examples** (must work in real environment!)
3. **Keep it scannable** (headers, bullets, code blocks, tables)
4. **Link liberally** (no orphaned docs, clear navigation)
5. **Use RealServ context** (Hyderabad, GST, INR, construction materials)
6. **C# examples first** (primary language for .NET backend)
7. **Include Postman collections** (easy API testing)
8. **Document error codes** (RealServ-specific codes + solutions)
9. **Version control everything** (Git, with tags for versions)
10. **Update README last** (after all other docs exist, with accurate links)

---

## 📦 Deliverables (Per Service)

### Root Level (3 files)
1. README.md (shortened, 150-250 lines)
2. QUICKSTART.md (5-minute setup)
3. API_REFERENCE.md (50+ examples)

### /guides (4-6 files + README)
- README.md (navigation)
- getting-started.md
- [core-feature-1].md
- [core-feature-2].md
- best-practices.md
- (Optional) [additional-features].md

### /examples (4 language folders + README)
- README.md (navigation)
- csharp/ (C# client + examples)
- python/ (Python client + examples)
- javascript/ (JS client + examples)
- postman/ (Postman collection + environment)

### /docs (Diátaxis structure, ~20 files)
- README.md (navigation hub)
- tutorials/ (1-2 tutorials)
- how-to-guides/ (4-5 guides)
- reference/ (6-7 references)
- explanation/ (2-3 explanations)

**Total per service:** ~35-45 files, ~35,000-45,000 words

---

## 🚀 Next Steps for RealServ

### Immediate (Week 1)
1. ✅ **Identity Service**: Apply all 8 points to completed service
   - Code is 100% complete (19 files)
   - Start with Point 0 (cleanup)
   - Complete documentation in 6-10 hours
   - Use as template for all future services

### Short-term (Week 2-3)
2. **Catalog Service**: Build + document simultaneously
   - Apply 8-point standard as you code
   - Easier to document while building
3. **Order Service**: Build + document simultaneously

### Long-term (Week 4-10)
4. Apply to remaining 11 services as you build them
5. Maintain consistency across all services
6. Update documentation with each release

---

**Created:** January 11, 2026  
**Status:** Universal standard for all RealServ backend microservices  
**Pattern:** Stripe/Twilio + Diátaxis framework  
**Framework:** Industry-proven documentation standards  
**Context:** B2B Construction Materials & Labor Marketplace (Hyderabad, India)

---

**Let's make world-class documentation the standard across ALL RealServ microservices!** 🚀