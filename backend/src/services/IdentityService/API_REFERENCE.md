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

> **Quick Summary:** Complete API reference with 50+ code examples for authentication, user management, and Firebase integration.

---

## Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Management Endpoints](#user-management-endpoints)
4. [Buyer Profile Endpoints](#buyer-profile-endpoints)
5. [Admin Profile Endpoints](#admin-profile-endpoints)
6. [Health & Monitoring](#health--monitoring)
7. [Error Codes](#error-codes)
8. [Rate Limiting](#rate-limiting)
9. [Pagination](#pagination)

---

## Base URL & Authentication

### Base URLs

```
Production:   https://api.realserv.com/identity
Staging:      https://staging-api.realserv.com/identity
Development:  http://localhost:5001
```

### Authentication

All protected endpoints require a **Firebase ID token** in the `Authorization` header:

```bash
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**How to get Firebase ID token:**

```javascript
// JavaScript/TypeScript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const idToken = await auth.currentUser.getIdToken();
```

```csharp
// C#
var auth = FirebaseAuth.DefaultInstance;
var token = await auth.CurrentUser.GetIdTokenAsync();
```

---

## Authentication Endpoints

### POST /api/v1/auth/signup

Create a new user account with email and password (Firebase Auth).

**Request:**

```json
{
  "email": "rajesh@example.com",
  "password": "SecurePass@123",
  "fullName": "Vishal Chauhan",
  "phoneNumber": "+917906441952",
  "userType": 0
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Min 8 chars, 1 uppercase, 1 number, 1 special |
| fullName | string | No | User's full name |
| phoneNumber | string | No | E.164 format (+91XXXXXXXXXX) |
| userType | integer | Yes | 0=Buyer, 1=Vendor, 2=Admin |

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Signup successful. Use Firebase SDK to get your ID token.",
  "data": {
    "success": true,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firebaseUid": "xYz123AbC456",
      "email": "rajesh@example.com",
      "fullName": "Vishal Chauhan",
      "phoneNumber": "+917906441952",
      "userType": "Buyer",
      "status": "Active",
      "emailVerified": false,
      "phoneVerified": false,
      "createdAt": "2026-01-11T10:30:00Z"
    }
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "SecurePass@123",
    "fullName": "Vishal Chauhan",
    "phoneNumber": "+917906441952",
    "userType": 0
  }'
```

**C# Example:**

```csharp
using System.Net.Http;
using System.Text.Json;

var client = new HttpClient();
var request = new
{
    email = "rajesh@example.com",
    password = "SecurePass@123",
    fullName = "Vishal Chauhan",
    phoneNumber = "+917906441952",
    userType = 0
};

var response = await client.PostAsJsonAsync(
    "http://localhost:5001/api/v1/auth/signup",
    request
);

var result = await response.Content.ReadFromJsonAsync<ApiResponse>();
```

**JavaScript Example:**

```javascript
const response = await fetch('http://localhost:5001/api/v1/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'rajesh@example.com',
    password: 'SecurePass@123',
    fullName: 'Vishal Chauhan',
    phoneNumber: '+917906441952',
    userType: 0
  })
});

const result = await response.json();
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Email already registered",
  "errors": {
    "Email": ["Email already registered"]
  }
}
```

---

### POST /api/v1/auth/login

Login with email and password (returns Firebase tokens).

**Request:**

```json
{
  "email": "rajesh@example.com",
  "password": "SecurePass@123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk3...",
    "refreshToken": "AE0u-NfBe8YmxMHkJrJUQJr...",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "rajesh@example.com",
      "fullName": "Vishal Chauhan",
      "userType": "Buyer",
      "status": "Active"
    }
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "SecurePass@123"
  }'
```

**JavaScript Example:**

```javascript
const response = await fetch('http://localhost:5001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'rajesh@example.com',
    password: 'SecurePass@123'
  })
});

const { data } = await response.json();
const { idToken, refreshToken, user } = data;

// Store token for API calls
localStorage.setItem('firebaseIdToken', idToken);
```

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### POST /api/v1/auth/social

Sign in with Google or Apple (Firebase Auth).

**Request:**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk3...",
  "email": "rajesh@gmail.com",
  "fullName": "Vishal Chauhan",
  "phoneNumber": "+917906441952",
  "userType": 0
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Social sign-in successful",
  "data": {
    "success": true,
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk3...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firebaseUid": "google:123456789",
      "email": "rajesh@gmail.com",
      "fullName": "Vishal Chauhan",
      "userType": "Buyer",
      "emailVerified": true
    }
  }
}
```

**JavaScript Example (Google OAuth):**

```javascript
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();

// Sign in with Google
const result = await signInWithPopup(auth, provider);
const idToken = await result.user.getIdToken();

// Register/login in backend
const response = await fetch('http://localhost:5001/api/v1/auth/social', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  },
  body: JSON.stringify({
    idToken,
    userType: 0
  })
});
```

---

### POST /api/v1/auth/phone/send-otp

Send OTP to phone number for authentication.

**Request:**

```json
{
  "phoneNumber": "+917906441952"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": null
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/v1/auth/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+917906441952"}'
```

---

### POST /api/v1/auth/phone/verify-otp

Verify phone OTP and create/login user.

**Request:**

```json
{
  "phoneNumber": "+917906441952",
  "otpCode": "123456",
  "userType": 0
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP verified. Use Firebase Phone Auth to get your ID token.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebaseUid": "phone:+917906441952",
    "phoneNumber": "+917906441952",
    "userType": "Buyer",
    "phoneVerified": true,
    "createdAt": "2026-01-11T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Invalid OTP code"
}
```

---

### GET /api/v1/auth/me

Get current authenticated user profile.

**Headers:**

```
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebaseUid": "xYz123AbC456",
    "email": "rajesh@example.com",
    "fullName": "Vishal Chauhan",
    "phoneNumber": "+917906441952",
    "userType": "Buyer",
    "status": "Active",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLoginAt": "2026-01-11T12:30:00Z",
    "createdAt": "2026-01-11T10:30:00Z",
    "updatedAt": "2026-01-11T12:30:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk3..."
```

**JavaScript Example:**

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const idToken = await auth.currentUser.getIdToken();

const response = await fetch('http://localhost:5001/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});

const { data } = await response.json();
console.log('Current user:', data);
```

---

### POST /api/v1/auth/logout

Logout user (audit log only - actual logout is client-side).

**Headers:**

```
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully. Clear Firebase auth on client.",
  "data": null
}
```

**JavaScript Example:**

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();

// Backend logout (audit)
const idToken = await auth.currentUser.getIdToken();
await fetch('http://localhost:5001/api/v1/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` }
});

// Client logout (actual)
await auth.signOut();
```

---

### POST /api/v1/auth/forgot-password

Request password reset email.

**Request:**

```json
{
  "email": "rajesh@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "If the email exists, a password reset link will be sent",
  "data": null
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "rajesh@example.com"}'
```

---

### POST /api/v1/auth/resend-verification

Resend email verification.

**Request:**

```json
{
  "email": "rajesh@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Verification email sent",
  "data": null
}
```

---

## User Management Endpoints

### GET /api/v1/users

List all users (Admin only).

**Headers:**

```
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20, max: 100) |
| userType | integer | No | Filter by user type (0=Buyer, 1=Vendor, 2=Admin) |
| status | integer | No | Filter by status (0=Active, 1=Inactive, 2=Suspended) |
| search | string | No | Search by name, email, or phone |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "rajesh@example.com",
        "fullName": "Vishal Chauhan",
        "phoneNumber": "+917906441952",
        "userType": "Buyer",
        "status": "Active",
        "createdAt": "2026-01-11T10:30:00Z"
      }
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
curl -X GET "http://localhost:5001/api/v1/users?page=1&limit=20&userType=0" \
  -H "Authorization: Bearer {FIREBASE_ID_TOKEN}"
```

---

### GET /api/v1/users/{id}

Get user by ID.

**Headers:**

```
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | GUID | User ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebaseUid": "xYz123AbC456",
    "email": "rajesh@example.com",
    "fullName": "Vishal Chauhan",
    "phoneNumber": "+917906441952",
    "userType": "Buyer",
    "status": "Active",
    "emailVerified": true,
    "phoneVerified": true,
    "profileImageUrl": "https://cdn.realserv.com/profiles/abc123.jpg",
    "lastLoginAt": "2026-01-11T12:30:00Z",
    "createdAt": "2026-01-11T10:30:00Z",
    "updatedAt": "2026-01-11T12:30:00Z"
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

### PUT /api/v1/users/{id}

Update user profile.

**Headers:**

```
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Request:**

```json
{
  "fullName": "Vishal Chauhan Sharma",
  "phoneNumber": "+919876543211",
  "profileImageUrl": "https://cdn.realserv.com/profiles/new.jpg"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Vishal Chauhan Sharma",
    "phoneNumber": "+919876543211",
    "profileImageUrl": "https://cdn.realserv.com/profiles/new.jpg",
    "updatedAt": "2026-01-11T14:00:00Z"
  }
}
```

---

### DELETE /api/v1/users/{id}

Soft delete user (Admin only).

**Headers:**

```
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

## Buyer Profile Endpoints

### GET /api/v1/buyers

List all buyer profiles.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number |
| limit | integer | Items per page |
| isVerified | boolean | Filter by verification status |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "buyer_123",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "businessName": "Kumar Constructions",
        "preferredLanguage": "en",
        "isVerified": true,
        "createdAt": "2026-01-11T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 75,
      "totalPages": 4
    }
  }
}
```

---

### POST /api/v1/buyers

Create buyer profile.

**Request:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "businessName": "Kumar Constructions",
  "preferredLanguage": "en"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Buyer profile created",
  "data": {
    "id": "buyer_123",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "businessName": "Kumar Constructions",
    "preferredLanguage": "en",
    "isVerified": false,
    "createdAt": "2026-01-11T15:00:00Z"
  }
}
```

---

## Health & Monitoring

### GET /api/v1/health

Health check endpoint.

**Response (200 OK):**

```json
{
  "status": "healthy",
  "database": "connected",
  "firebase": "connected",
  "timestamp": "2026-01-11T12:00:00Z",
  "version": "1.0.0"
}
```

**cURL Example:**

```bash
curl http://localhost:5001/api/v1/health
```

---

## Error Codes

### HTTP Status Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid Firebase token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### RealServ Error Codes

| Code | HTTP | Description | Solution |
|------|------|-------------|----------|
| INVALID_FIREBASE_TOKEN | 401 | Firebase token invalid/expired | Re-authenticate |
| USER_NOT_FOUND | 404 | User doesn't exist | Check user ID |
| EMAIL_ALREADY_EXISTS | 409 | Email already registered | Use different email |
| INVALID_PASSWORD | 422 | Password doesn't meet requirements | Use strong password |
| INVALID_PHONE_NUMBER | 422 | Phone format invalid | Use +91XXXXXXXXXX |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait and retry |

---

## Rate Limiting

**Limits:**
- Authentication endpoints: 10 req/min per IP
- Read endpoints (GET): 100 req/min per user
- Write endpoints (POST/PUT/DELETE): 50 req/min per user

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1673452800
```

---

## Pagination

All list endpoints support pagination:

**Request:**
```
GET /users?page=1&limit=20
```

**Response:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Total Examples:** 50+
