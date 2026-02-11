---
title: Error Codes - Identity Service
service: Identity Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Error Codes - Identity Service

**Service:** Identity Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete reference of all HTTP status codes and RealServ-specific error codes with solutions.

---

## HTTP Status Codes

### 2xx Success

| Code | Name | Description | When Used |
|------|------|-------------|-----------|
| **200** | OK | Request successful | GET, PUT, DELETE successful |
| **201** | Created | Resource created | POST successful |
| **204** | No Content | Success with no response body | DELETE successful (alternative) |

---

### 4xx Client Errors

| Code | Name | Description | Common Causes |
|------|------|-------------|---------------|
| **400** | Bad Request | Invalid request format or parameters | Missing required fields, invalid JSON, wrong data types |
| **401** | Unauthorized | Missing or invalid authentication | No Firebase token, expired token, invalid token |
| **403** | Forbidden | Insufficient permissions | User doesn't have required role, trying to access another user's data |
| **404** | Not Found | Resource doesn't exist | Invalid user ID, deleted resource |
| **409** | Conflict | Resource already exists | Duplicate email, duplicate phone number |
| **422** | Unprocessable Entity | Validation failed | Invalid email format, weak password, invalid phone number |
| **429** | Too Many Requests | Rate limit exceeded | Sending too many requests in short time |

---

### 5xx Server Errors

| Code | Name | Description | Action |
|------|------|-------------|--------|
| **500** | Internal Server Error | Unexpected server error | Retry after a moment, contact support if persists |
| **503** | Service Unavailable | Service temporarily down | Retry after a moment, check status page |

---

## RealServ Error Codes

### Authentication Errors

| Error Code | HTTP | Message | Cause | Solution |
|------------|------|---------|-------|----------|
| **INVALID_FIREBASE_TOKEN** | 401 | Firebase token invalid or expired | Token expired, tampered, or from wrong project | Re-authenticate with Firebase SDK |
| **FIREBASE_AUTH_FAILED** | 401 | Firebase authentication failed | Firebase service unavailable | Retry or check Firebase status |
| **UNAUTHORIZED_ACCESS** | 401 | User not authenticated | Missing Authorization header | Include Firebase token in header |
| **INSUFFICIENT_PERMISSIONS** | 403 | User lacks required permissions | User trying to access admin-only endpoint | Check user role and permissions |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FIREBASE_TOKEN",
    "message": "Firebase token invalid or expired",
    "details": "Token has expired. Please re-authenticate."
  }
}
```

**Solution:**
```javascript
// Re-authenticate
const auth = getAuth();
const freshToken = await auth.currentUser.getIdToken(true);
```

---

### User Management Errors

| Error Code | HTTP | Message | Cause | Solution |
|------------|------|---------|-------|----------|
| **USER_NOT_FOUND** | 404 | User not found | Invalid user ID or deleted user | Verify user ID exists |
| **EMAIL_ALREADY_EXISTS** | 409 | Email already registered | Duplicate email during signup | Use different email or login |
| **PHONE_ALREADY_EXISTS** | 409 | Phone number already registered | Duplicate phone during signup | Use different phone or login |
| **USER_ALREADY_EXISTS** | 409 | User already exists for this Firebase UID | Trying to register existing Firebase user | Use login instead |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email already registered",
    "details": "A user with this email already exists. Try logging in instead."
  }
}
```

---

### Validation Errors

| Error Code | HTTP | Message | Cause | Solution |
|------------|------|---------|-------|----------|
| **INVALID_EMAIL_FORMAT** | 422 | Invalid email format | Email doesn't match pattern | Use valid email (user@domain.com) |
| **INVALID_PASSWORD** | 422 | Password doesn't meet requirements | Weak password | Min 8 chars, 1 uppercase, 1 number, 1 special |
| **INVALID_PHONE_NUMBER** | 422 | Invalid phone number format | Phone not in E.164 format | Use +91XXXXXXXXXX format |
| **INVALID_USER_TYPE** | 422 | Invalid user type | UserType not 0, 1, or 2 | Use 0=Buyer, 1=Vendor, 2=Admin |
| **MISSING_REQUIRED_FIELD** | 422 | Required field missing | Required field not provided | Include all required fields |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Password doesn't meet requirements",
    "details": "Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character"
  },
  "errors": {
    "Password": ["Password must be at least 8 characters", "Password must contain 1 uppercase letter"]
  }
}
```

---

### OTP Errors

| Error Code | HTTP | Message | Cause | Solution |
|------------|------|---------|-------|----------|
| **OTP_NOT_FOUND** | 404 | No OTP found for this phone | OTP not sent or expired | Request new OTP |
| **OTP_EXPIRED** | 400 | OTP has expired | OTP older than 5 minutes | Request new OTP |
| **INVALID_OTP** | 400 | Invalid OTP code | Wrong OTP entered | Enter correct OTP |
| **OTP_ALREADY_VERIFIED** | 400 | OTP already used | Trying to reuse OTP | Request new OTP |
| **MAX_OTP_ATTEMPTS** | 429 | Maximum OTP attempts exceeded | Too many failed verifications | Wait 15 minutes or request new OTP |

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "Invalid OTP code",
    "details": "The OTP code you entered is incorrect. 2 attempts remaining."
  }
}
```

---

### Rate Limiting Errors

| Error Code | HTTP | Message | Cause | Solution |
|------------|------|---------|-------|----------|
| **RATE_LIMIT_EXCEEDED** | 429 | Rate limit exceeded | Too many requests | Wait and retry after specified time |

**Example:**
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

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1673452860
Retry-After: 60
```

---

### Database Errors

| Error Code | HTTP | Message | Cause | Solution |
|------------|------|---------|-------|----------|
| **DATABASE_ERROR** | 500 | Database connection failed | DB unavailable, timeout | Retry request, contact support if persists |
| **CONSTRAINT_VIOLATION** | 409 | Database constraint violated | Duplicate key, foreign key violation | Check data integrity |

---

## Error Response Format

### Standard Error Response

```json
{
  "success": false,
  "message": "Error message here",
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message",
    "details": "Additional context"
  }
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Email": ["Email is required", "Email format invalid"],
    "Password": ["Password must be at least 8 characters"]
  }
}
```

---

## Handling Errors

### JavaScript/TypeScript

```javascript
try {
  const response = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const result = await response.json();

  if (!result.success) {
    // Handle error
    switch (result.error?.code) {
      case 'EMAIL_ALREADY_EXISTS':
        // Show login option
        break;
      case 'INVALID_PASSWORD':
        // Show password requirements
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Wait and retry
        setTimeout(() => retry(), result.error.retryAfter * 1000);
        break;
      default:
        // Generic error
        console.error(result.message);
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### C#

```csharp
try
{
    var response = await client.PostAsJsonAsync("/api/v1/auth/signup", userData);
    var result = await response.Content.ReadFromJsonAsync<ApiResponse>();

    if (!result.Success)
    {
        switch (result.Error?.Code)
        {
            case "EMAIL_ALREADY_EXISTS":
                // Handle duplicate email
                break;
            case "INVALID_FIREBASE_TOKEN":
                // Re-authenticate
                await RefreshToken();
                break;
            default:
                throw new Exception(result.Message);
        }
    }
}
catch (HttpRequestException ex)
{
    // Network error
    logger.LogError(ex, "API request failed");
}
```

---

## Common Error Scenarios

### Scenario 1: Token Expired

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FIREBASE_TOKEN",
    "message": "Firebase token invalid or expired"
  }
}
```

**Solution:**
```javascript
// Refresh token
const auth = getAuth();
const freshToken = await auth.currentUser.getIdToken(true);

// Retry request
const response = await fetch('/api/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${freshToken}` }
});
```

---

### Scenario 2: Validation Failed

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Email": ["Email format invalid"],
    "Password": ["Password must be at least 8 characters"]
  }
}
```

**Solution:**
```javascript
// Show field-specific errors
Object.entries(result.errors).forEach(([field, messages]) => {
  showError(field, messages.join(', '));
});
```

---

### Scenario 3: Rate Limited

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

**Solution:**
```javascript
// Wait and retry
const retryAfter = result.error.retryAfter * 1000;
setTimeout(() => retryRequest(), retryAfter);
```

---

## Quick Reference Table

| Error Code | HTTP | Quick Fix |
|------------|------|-----------|
| INVALID_FIREBASE_TOKEN | 401 | Refresh token: `getIdToken(true)` |
| EMAIL_ALREADY_EXISTS | 409 | Try login instead |
| INVALID_PASSWORD | 422 | Use 8+ chars, 1 upper, 1 number, 1 special |
| INVALID_PHONE_NUMBER | 422 | Use +91XXXXXXXXXX format |
| OTP_EXPIRED | 400 | Request new OTP |
| RATE_LIMIT_EXCEEDED | 429 | Wait and retry |
| USER_NOT_FOUND | 404 | Verify user ID |

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Total Error Codes:** 20+
