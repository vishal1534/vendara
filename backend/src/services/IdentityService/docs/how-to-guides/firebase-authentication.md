---
title: Firebase Authentication Setup
service: Identity Service
category: how-to-guide
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# How to Set Up Firebase Authentication

**Service:** Identity Service  
**Category:** How-To Guide  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Step-by-step guide to configure Firebase Authentication for RealServ Identity Service.

---

## Prerequisites

- Google account
- Access to [Firebase Console](https://console.firebase.google.com/)
- 15 minutes

---

## Step 1: Create Firebase Project

### 1.1 Create Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project details:
   - **Project name:** `realserv-dev` (or your environment name)
   - **Project ID:** Will auto-generate (e.g., `realserv-dev-a1b2c`)
   - Click **"Continue"**

### 1.2 Configure Google Analytics (Optional)

1. Enable Google Analytics: **No** (not needed for authentication)
2. Click **"Create project"**
3. Wait for project creation (~30 seconds)
4. Click **"Continue"**

---

## Step 2: Enable Authentication Methods

### 2.1 Navigate to Authentication

1. In Firebase Console, select your project
2. Click **"Authentication"** in left sidebar
3. Click **"Get started"**

### 2.2 Enable Email/Password Authentication

1. Click **"Sign-in method"** tab
2. Click **"Email/Password"**
3. Enable **"Email/Password"** toggle
4. **Do NOT enable** "Email link (passwordless sign-in)"
5. Click **"Save"**

**Result:** ✅ Email/Password authentication enabled

---

### 2.3 Enable Google Sign-In

1. Click **"Add new provider"**
2. Select **"Google"**
3. Enable toggle
4. Enter project support email: `support@realserv.com`
5. Click **"Save"**

**Result:** ✅ Google OAuth enabled

---

### 2.4 Enable Phone Authentication (Optional)

1. Click **"Add new provider"**
2. Select **"Phone"**
3. Enable toggle
4. **Test phone numbers** (for development):
   - Phone number: `+911234567890`
   - Verification code: `123456`
5. Click **"Save"**

**Result:** ✅ Phone authentication enabled

---

### 2.5 Enable Apple Sign-In (Optional - iOS only)

1. Click **"Add new provider"**
2. Select **"Apple"**
3. Enable toggle
4. Configure Apple Developer credentials:
   - **Services ID:** (from Apple Developer Console)
   - **OAuth code flow:** Select checkbox
   - **Team ID:** (from Apple Developer)
   - **Private Key:** Upload .p8 file
5. Click **"Save"**

**Result:** ✅ Apple Sign-In enabled (iOS apps)

---

## Step 3: Get Firebase Admin SDK Credentials

### 3.1 Generate Service Account Key

1. Click **"Project settings"** (gear icon in left sidebar)
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. In confirmation dialog, click **"Generate key"**
5. JSON file downloads automatically

**Downloaded file:** `realserv-dev-firebase-adminsdk-xyz123.json`

### 3.2 Rename and Move File

```bash
# Rename to standard name
mv ~/Downloads/realserv-dev-firebase-adminsdk-*.json firebase-admin-sdk.json

# Move to Identity Service directory
mv firebase-admin-sdk.json /path/to/backend/src/services/IdentityService/

# Set permissions (important!)
chmod 600 firebase-admin-sdk.json
```

**Security Warning:** 🔒 Never commit this file to version control!

Add to `.gitignore`:
```gitignore
# Firebase credentials
firebase-admin-sdk.json
**/firebase-admin-sdk*.json
```

---

## Step 4: Get Firebase Web API Key

### 4.1 Get API Key

1. In Firebase Console, click **"Project settings"**
2. Under **"General"** tab, scroll to **"Your apps"**
3. If no web app exists:
   - Click **"Add app"** → Select **Web (</>)**
   - Enter nickname: `RealServ Web`
   - **Do NOT** check "Firebase Hosting"
   - Click **"Register app"**
4. Copy **"API Key"** (looks like `AIzaSyC...`)

**Example:**
```
Web API Key: AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 Note Your Project ID

In the same screen, note:
- **Project ID:** `realserv-dev`
- **App ID:** `1:123456789:web:abc123def456`

---

## Step 5: Configure Identity Service

### 5.1 Update appsettings.json

Edit `/backend/src/services/IdentityService/appsettings.json`:

```json
{
  "Firebase": {
    "ProjectId": "realserv-dev",
    "CredentialsPath": "firebase-admin-sdk.json",
    "ApiKey": "AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Replace:**
- `realserv-dev` → Your Firebase project ID
- `AIzaSyCxxx...` → Your Firebase web API key

### 5.2 Verify File Structure

```bash
IdentityService/
├── appsettings.json               # Contains Firebase config
├── firebase-admin-sdk.json        # Admin SDK credentials (DO NOT COMMIT)
├── Program.cs
└── ...
```

### 5.3 Test Configuration

```bash
# Start the service
cd /path/to/backend/src/services/IdentityService
dotnet run

# Should see in logs:
# info: Firebase initialized with project ID: realserv-dev
```

---

## Step 6: Configure Firebase for Production

### 6.1 Create Production Project

Repeat Steps 1-4 with production settings:
- **Project name:** `realserv-prod`
- **Enable same authentication methods**
- **Download separate service account key**

### 6.2 Environment-Specific Configuration

**Development (appsettings.Development.json):**
```json
{
  "Firebase": {
    "ProjectId": "realserv-dev",
    "CredentialsPath": "firebase-admin-sdk-dev.json",
    "ApiKey": "AIzaSyC_DEV_KEY"
  }
}
```

**Production (appsettings.Production.json):**
```json
{
  "Firebase": {
    "ProjectId": "realserv-prod",
    "CredentialsPath": "/app/secrets/firebase-admin-sdk.json",
    "ApiKey": "${FIREBASE_API_KEY}"
  }
}
```

**Production Environment Variables:**
```bash
export FIREBASE_API_KEY="AIzaSyC_PROD_KEY"
```

---

## Step 7: Test Authentication

### 7.1 Test Email/Password Signup

```bash
curl -X POST http://localhost:5001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "fullName": "Test User",
    "userType": 0
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": {
      "email": "test@example.com",
      "fullName": "Test User",
      "userType": "Buyer"
    }
  }
}
```

### 7.2 Test Login

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "idToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "AE0u-NfBe8Ymx...",
    "expiresIn": 3600
  }
}
```

### 7.3 Verify in Firebase Console

1. Go to Firebase Console → **Authentication** → **Users**
2. You should see the test user listed
3. Email should be verified (if email verification enabled)

---

## Step 8: Configure Client SDK

### 8.1 Web Client (JavaScript/TypeScript)

**Install Firebase SDK:**
```bash
npm install firebase
```

**Initialize Firebase:**
```typescript
// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "realserv-dev.firebaseapp.com",
  projectId: "realserv-dev",
  storageBucket: "realserv-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

**Get firebaseConfig:**
1. Firebase Console → **Project settings** → **General** tab
2. Scroll to **"Your apps"** → Select your web app
3. Copy configuration object

### 8.2 Test Client Authentication

```typescript
import { auth } from './firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Login
const userCredential = await signInWithEmailAndPassword(
  auth,
  'test@example.com',
  'Test@123456'
);

// Get ID token
const idToken = await userCredential.user.getIdToken();

// Use token for API calls
const response = await fetch('http://localhost:5001/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

---

## Step 9: Security Configuration

### 9.1 Configure Authorized Domains

1. Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **"Authorized domains"**
3. Add your domains:
   - Development: `localhost`
   - Staging: `staging.realserv.com`
   - Production: `app.realserv.com`, `admin.realserv.com`

### 9.2 Password Policy (Optional)

1. **Authentication** → **Settings** → **Password policy**
2. Configure:
   - Minimum length: **8 characters**
   - Require uppercase: **Yes**
   - Require lowercase: **Yes**
   - Require numeric: **Yes**
   - Require non-alphanumeric: **Yes**

### 9.3 Email Templates

1. **Authentication** → **Templates**
2. Customize email templates:
   - **Email verification**
   - **Password reset**
   - **Email change**
3. Add RealServ branding and support email

---

## Step 10: Monitoring & Quotas

### 10.1 Check Usage Quotas

1. Firebase Console → **Authentication** → **Usage**
2. Monitor:
   - Daily active users
   - Authentication requests
   - Email sends

### 10.2 Upgrade to Blaze Plan (Production)

**Spark Plan (Free):**
- ✅ 10,000 phone verifications/month
- ✅ Unlimited email authentication
- ❌ Limited to 1GB storage

**Blaze Plan (Pay-as-you-go):**
- ✅ Unlimited phone verifications ($0.01/verification)
- ✅ Unlimited email authentication (free)
- ✅ Production-ready

**Upgrade:**
1. Firebase Console → **Spark** (top left)
2. Click **"Upgrade"**
3. Select **"Blaze"** plan

---

## Troubleshooting

### Issue: "Firebase Admin SDK error"

**Check credentials file:**
```bash
# Verify file exists
ls firebase-admin-sdk.json

# Verify JSON is valid
cat firebase-admin-sdk.json | jq

# Check permissions
ls -la firebase-admin-sdk.json
# Should be: -rw------- (600)
```

### Issue: "Invalid API key"

**Verify API key:**
1. Firebase Console → **Project settings** → **General**
2. Check **Web API Key** matches `appsettings.json`

### Issue: "Authentication failed" on client

**Check authorized domains:**
1. Firebase Console → **Authentication** → **Settings**
2. Add your domain to **Authorized domains**

---

## Quick Reference

### Firebase Console URLs

| Resource | URL |
|----------|-----|
| **Console Home** | https://console.firebase.google.com/ |
| **Authentication** | https://console.firebase.google.com/project/{PROJECT_ID}/authentication |
| **Project Settings** | https://console.firebase.google.com/project/{PROJECT_ID}/settings/general |
| **Usage & Billing** | https://console.firebase.google.com/project/{PROJECT_ID}/usage |

### Key Files

```
IdentityService/
├── appsettings.json                  # Firebase config (ProjectId, ApiKey)
├── firebase-admin-sdk.json           # Service account key (DO NOT COMMIT)
└── .gitignore                        # Must exclude credentials
```

### Environment Variables

```bash
# Development
FIREBASE_PROJECT_ID=realserv-dev
FIREBASE_API_KEY=AIzaSyC_DEV_KEY

# Production
FIREBASE_PROJECT_ID=realserv-prod
FIREBASE_API_KEY=AIzaSyC_PROD_KEY
```

---

## Next Steps

1. ✅ Firebase configured and tested
2. → [Test authentication flows](../tutorials/getting-started.md)
3. → [Configure email templates](#step-9-security-configuration)
4. → [Deploy to production](./deploy-to-production.md)

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Estimated Time:** 15 minutes
