---
title: Glossary - Identity Service
service: Identity Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: all
---

# Glossary - Identity Service

**Service:** Identity Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Definitions of key terms and concepts used in the Identity Service.

---

## A

### Admin
A user with administrative privileges in the RealServ platform. Admins can manage users, vendors, and system settings.

### Admin Profile
Additional profile data for users with admin role, including permissions and role information.

### API Key
Firebase web API key used for REST API authentication calls.

### Authentication
The process of verifying a user's identity, typically through email/password, phone OTP, or social login.

### Authorization
The process of determining what resources an authenticated user can access based on their role and permissions.

---

## B

### Buyer
A user type representing individual home builders who purchase construction materials and book labor through RealServ.

### Buyer Profile
Additional profile data for buyers, including business name, preferred language, and verification status.

---

## C

### Claims
Key-value pairs in a JWT token that contain user information (e.g., user ID, email, roles).

---

## D

### Delivery Address
A buyer's construction site or delivery location with geospatial coordinates.

---

## E

### Email OTP
One-Time Password sent via email for email verification purposes.

### Email Verification
Process of confirming a user's email address ownership through Firebase email verification links.

### E.164 Format
International phone number format: +[country code][number] (e.g., +917906441952 for India).

---

## F

### Firebase Admin SDK
Server-side Firebase library for managing authentication, verifying tokens, and creating users.

### Firebase Auth
Google's authentication service that handles user signup, login, token management, and social authentication.

### Firebase UID
Unique identifier assigned by Firebase to each user (e.g., "xYz123AbC456").

---

## I

### ID Token
Firebase-issued JWT token that proves a user's identity, expires after 1 hour.

### Identity Service
Microservice responsible for authentication, user management, and profile data in RealServ.

---

## J

### JWT (JSON Web Token)
A compact, URL-safe token format used for securely transmitting information between parties. Firebase uses JWT for ID tokens.

---

## O

### OTP (One-Time Password)
A 6-digit code sent to phone/email for verification, valid for 5 minutes.

---

## P

### Phone OTP
One-Time Password sent via WhatsApp/SMS for phone number verification.

### Phone Verification
Process of confirming a user's phone number ownership through OTP verification.

### Profile Image URL
CDN URL pointing to a user's profile picture.

---

## R

### Refresh Token
Long-lived token (30 days) issued by Firebase to obtain new ID tokens without re-authentication.

### Role
User's permission level in the system (Buyer, Vendor, Admin).

### Role-Based Access Control (RBAC)
Security approach where permissions are assigned based on user roles.

---

## S

### Soft Delete
Marking a record as deleted without physically removing it from the database (`is_deleted = true`).

### Social Login
Authentication using third-party providers (Google, Apple) via Firebase Auth.

---

## T

### Token Expiration
When an ID token becomes invalid after 1 hour and needs to be refreshed.

### Token Refresh
Process of obtaining a new ID token using a refresh token without re-authenticating.

### Token Verification
Validating that a Firebase ID token is authentic and not expired.

---

## U

### User
A person registered in the RealServ platform (can be Buyer, Vendor, or Admin).

### User Profile
Basic user information including email, phone, name, and user type.

### User Session
Record of a user's active session including device info and FCM token.

### User Status
Current state of a user account:
- **Active** (0): Normal, active account
- **Inactive** (1): Temporarily disabled
- **Suspended** (2): Banned or suspended

### User Type
Classification of user role:
- **Buyer** (0): Individual home builder
- **Vendor** (1): Material supplier or labor provider
- **Admin** (2): Platform administrator

---

## V

### Vendor
A user type representing construction material suppliers and skilled labor providers on RealServ.

---

## W

### WhatsApp OTP
One-Time Password delivered via WhatsApp Business API for phone verification.

---

## Common Acronyms

| Acronym | Full Form | Description |
|---------|-----------|-------------|
| **API** | Application Programming Interface | Interface for applications to communicate |
| **CRUD** | Create, Read, Update, Delete | Basic database operations |
| **DTO** | Data Transfer Object | Object for transferring data between layers |
| **EF Core** | Entity Framework Core | .NET ORM for database access |
| **FCM** | Firebase Cloud Messaging | Push notification service |
| **GUID** | Globally Unique Identifier | 128-bit unique identifier (UUID) |
| **HTTP** | Hypertext Transfer Protocol | Protocol for web communication |
| **JWT** | JSON Web Token | Token format for authentication |
| **ORM** | Object-Relational Mapping | Database access layer |
| **OTP** | One-Time Password | Single-use verification code |
| **RBAC** | Role-Based Access Control | Permission system based on roles |
| **REST** | Representational State Transfer | Web API architectural style |
| **SDK** | Software Development Kit | Developer tools and libraries |
| **SSL** | Secure Sockets Layer | Encryption protocol |
| **UID** | User Identifier | Unique user ID |
| **URI** | Uniform Resource Identifier | Resource address format |
| **URL** | Uniform Resource Locator | Web address |
| **UUID** | Universally Unique Identifier | 128-bit unique identifier |

---

## Database Terms

| Term | Description |
|------|-------------|
| **Audit Trail** | Historical record of changes (created_at, updated_at, created_by, updated_by) |
| **Foreign Key** | Column referencing primary key in another table |
| **Index** | Database structure for faster queries |
| **Migration** | Database schema version and update script |
| **Primary Key** | Unique identifier for table row (usually `id`) |
| **Relationship** | Connection between tables (one-to-one, one-to-many, many-to-many) |
| **Schema** | Database structure definition |
| **Soft Delete** | Marking as deleted without physical removal |

---

## API Terms

| Term | Description |
|------|-------------|
| **Endpoint** | Specific API URL for a resource (e.g., /api/v1/users) |
| **Header** | Metadata sent with HTTP request/response |
| **Method** | HTTP verb (GET, POST, PUT, DELETE) |
| **Payload** | Request/response body data |
| **Query Parameter** | URL parameter for filtering/pagination (?page=1&limit=20) |
| **Rate Limit** | Maximum requests allowed in time period |
| **Status Code** | HTTP response code (200, 404, 500, etc.) |

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Total Terms:** 50+
