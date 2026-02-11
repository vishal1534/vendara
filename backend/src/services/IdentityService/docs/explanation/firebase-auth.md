---
title: Firebase Authentication Integration
service: Identity Service
category: explanation
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: architects
---

# Firebase Authentication Integration - Identity Service

**Service:** Identity Service  
**Category:** Explanation  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Why we use Firebase Auth exclusively and how it integrates with the Identity Service backend.

---

## 🎯 Key Principle

**Firebase handles ALL token management:**
- ✅ ID tokens (JWT format)
- ✅ Refresh tokens
- ✅ Token verification
- ✅ Token expiration
- ✅ Social auth (Google, Apple)
- ✅ Phone auth
- ✅ Email/password auth

**Our backend:**
- ✅ Stores user data in PostgreSQL
- ✅ Verifies Firebase ID tokens
- ✅ Maps Firebase UID to our User entity
- ❌ Does NOT generate custom JWT tokens
- ❌ Does NOT manage refresh tokens

---

## 📊 Architecture Flow

```
┌─────────┐         ┌──────────┐         ┌─────────────┐
│ Client  │────────>│ Firebase │────────>│   Backend   │
│  (Web/  │<────────│   Auth   │<────────│  (Identity  │
│ Mobile) │         │          │         │   Service)  │
└─────────┘         └──────────┘         └─────────────┘
     │                    │                      │
     │   1. Authenticate  │                      │
     │ ─────────────────> │                      │
     │                    │                      │
     │   2. ID Token      │                      │
     │ <───────────────── │                      │
     │                    │                      │
     │   3. API Request + Firebase ID Token      │
     │ ────────────────────────────────────────> │
     │                    │                      │
     │                    │  4. Verify Token     │
     │                    │ <─────────────────── │
     │                    │                      │
     │                    │  5. Token Valid +    │
     │                    │     User Info        │
     │                    │ ───────────────────> │
     │                    │                      │
     │   6. API Response                         │
     │ <──────────────────────────────────────── │
```

---

## 🔧 Why Firebase Auth?

### 1. **Industry Standard**
- Used by millions of apps globally
- Battle-tested security
- Regular security updates from Google
- Compliance certifications (SOC2, ISO 27001, etc.)

### 2. **Less Code to Maintain**
- **-836 lines** of custom JWT code removed
- No custom token generation
- No custom refresh token logic
- No token database tables

### 3. **Better Security**
- Google-managed signing keys
- Automatic key rotation
- Built-in token validation
- Protection against common attacks (CSRF, XSS, etc.)

### 4. **Simpler Client Integration**
```typescript
// Before (custom JWT - confusing)
const customToken = await api.login();        // Custom JWT
const firebaseToken = await firebase.signIn(); // Firebase token
// Which token to use where? 🤔

// After (Firebase only - clear)
const auth = firebase.auth();
const idToken = await user.getIdToken();      // Use everywhere ✅
```

### 5. **Auto Token Refresh**
```typescript
// Firebase SDK handles refresh automatically
const auth = firebase.auth();
const token = await auth.currentUser.getIdToken(); // Auto-refreshed

// Manual refresh if needed
const freshToken = await auth.currentUser.getIdToken(true);
```

---

## 🔑 Supported Authentication Methods

| Method | Client Setup | Backend Endpoint | Token Source |
|--------|--------------|------------------|--------------|
| **Email/Password** | Firebase SDK | `/auth/signup`, `/auth/login` | Firebase |
| **Google OAuth** | Firebase SDK | `/auth/social` | Firebase |
| **Apple Sign-In** | Firebase SDK | `/auth/social` | Firebase |
| **Phone OTP** | Custom + Firebase | `/auth/phone/send-otp`, `/auth/phone/verify-otp` | Firebase |
| **Password Reset** | Firebase SDK | `/auth/forgot-password` | Firebase |
| **Email Verification** | Firebase SDK | `/auth/resend-verification` | Firebase |

---

## 💻 Client-Side Implementation

### Email/Password Login
```typescript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);

// Get Firebase ID token
const idToken = await userCredential.user.getIdToken();

// Use this token for ALL API requests
localStorage.setItem('firebaseIdToken', idToken);
```

### Google OAuth
```typescript
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);

// Get Firebase ID token
const idToken = await result.user.getIdToken();

// Register/login in our backend
await fetch('/api/v1/auth/social', {
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

### API Requests
```typescript
const idToken = await firebase.auth().currentUser.getIdToken();

const response = await fetch('/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🖥️ Backend Implementation

### Program.cs - Firebase Auth Middleware
```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Configure Firebase Authentication
var firebaseProjectId = builder.Configuration["Firebase:ProjectId"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Firebase validates tokens
        options.Authority = $"https://securetoken.google.com/{firebaseProjectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{firebaseProjectId}",
            ValidateAudience = true,
            ValidAudience = firebaseProjectId,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Add authentication/authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.Run();
```

### Protected Controller Endpoint
```csharp
[HttpGet("me")]
[Authorize] // Validates Firebase token
public async Task<ActionResult<UserResponse>> GetCurrentUser()
{
    // Extract Firebase UID from validated token
    var firebaseUid = User.FindFirst("firebase_uid")?.Value;
    
    var user = await _userRepository.GetByFirebaseUidAsync(firebaseUid);
    return Ok(user);
}
```

---

## ✅ Token Lifecycle

### 1. Token Creation
- Created by Firebase when user authenticates
- Contains Firebase UID, email, email_verified, etc.
- Expires after 1 hour (default)

### 2. Token Usage
```typescript
// Get current token
const idToken = await firebase.auth().currentUser.getIdToken();

// Use in API calls
fetch('/api/v1/resource', {
  headers: { 'Authorization': `Bearer ${idToken}` }
});
```

### 3. Token Refresh
```typescript
// Firebase SDK auto-refreshes tokens before expiration
// Manual refresh (if needed):
const freshToken = await firebase.auth().currentUser.getIdToken(true);
```

### 4. Token Revocation
```typescript
// Logout (client-side)
await firebase.auth().signOut();

// Backend logout (audit only)
await fetch('/api/v1/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` }
});
```

---

## 🚫 What We Don't Do

### ❌ Custom JWT Generation
```csharp
// REMOVED - NO LONGER NEEDED
// var accessToken = _jwtTokenService.GenerateAccessToken(user);
```

### ❌ Custom Refresh Tokens
```csharp
// REMOVED - Firebase handles this
// var refreshToken = await _refreshTokenRepository.CreateAsync(...);
```

### ❌ Token Storage in Database
```csharp
// REMOVED - No refresh_tokens table
// public DbSet<RefreshToken> RefreshTokens { get; set; }
```

---

## 🔒 Security Benefits

1. ✅ **Industry-standard security** - Firebase is battle-tested
2. ✅ **Automatic token rotation** - Firebase SDK handles it
3. ✅ **Secure token storage** - Firebase SDK manages storage
4. ✅ **XSS protection** - httpOnly cookies (if configured)
5. ✅ **CSRF protection** - Token-based auth
6. ✅ **No secret management** - Firebase handles signing keys
7. ✅ **Automatic updates** - Firebase SDK updates automatically

---

## 📦 Required Configuration

### appsettings.json
```json
{
  "Firebase": {
    "ProjectId": "your-firebase-project-id",
    "CredentialsPath": "firebase-admin-sdk.json",
    "ApiKey": "YOUR_FIREBASE_WEB_API_KEY"
  }
}
```

### Firebase Admin SDK
Download from Firebase Console → Project Settings → Service Accounts → Generate New Private Key

---

## 📚 Additional Resources

- **Firebase Auth Docs:** https://firebase.google.com/docs/auth
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup
- **ASP.NET Core JWT:** https://docs.microsoft.com/en-us/aspnet/core/security/authentication/

---

**Status:** ✅ Firebase-Only Authentication Implemented  
**Custom JWT:** ❌ Removed  
**Production Ready:** ✅ Yes
