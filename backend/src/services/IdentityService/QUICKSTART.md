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

- **.NET 8.0 SDK** installed ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
- **Firebase project** created ([Firebase Console](https://console.firebase.google.com/))
- **PostgreSQL 16+** (via Docker)

---

## 1. Clone & Configure

```bash
# Clone repository
git clone https://github.com/realserv/backend.git
cd backend/src/services/IdentityService

# Copy configuration template
cp appsettings.example.json appsettings.json
```

**Edit `appsettings.json` with your Firebase credentials:**

```json
{
  "ConnectionStrings": {
    "IdentityServiceDb": "Host=localhost;Database=realserv_identity;Username=postgres;Password=postgres"
  },
  "Firebase": {
    "ProjectId": "your-firebase-project-id",
    "CredentialsPath": "firebase-admin-sdk.json",
    "ApiKey": "YOUR_FIREBASE_WEB_API_KEY"
  }
}
```

**Download Firebase Admin SDK JSON:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save as `firebase-admin-sdk.json` in service root

---

## 2. Start Dependencies

```bash
# From /backend directory
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

**Verify PostgreSQL is running:**
```bash
docker ps | grep postgres
```

**Expected output:**
```
CONTAINER ID   IMAGE         STATUS         PORTS
abc123def456   postgres:16   Up 2 minutes   0.0.0.0:5432->5432/tcp
```

---

## 3. Run Database Migrations

```bash
# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create database and run migrations
dotnet ef database update
```

**Expected output:**
```
Build started...
Build succeeded.
Applying migration '20260111_InitialCreate'...
Done.
```

---

## 4. Start Service

```bash
dotnet run
```

**Expected output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

---

## 5. First Request

**Test health endpoint:**
```bash
curl http://localhost:5001/api/v1/health
```

**Expected Output:**
```json
{
  "status": "healthy",
  "database": "connected",
  "firebase": "connected",
  "timestamp": "2026-01-11T12:00:00Z"
}
```

---

## 6. Test Authentication

**Signup a new user:**
```bash
curl -X POST http://localhost:5001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "fullName": "Test User",
    "phoneNumber": "+917906441952",
    "userType": 0
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Signup successful. Use Firebase SDK to get your ID token.",
  "data": {
    "success": true,
    "user": {
      "id": "a1b2c3d4-e5f6-...",
      "firebaseUid": "xyz123abc456",
      "email": "test@example.com",
      "fullName": "Test User",
      "phoneNumber": "+917906441952",
      "userType": "Buyer",
      "status": "Active"
    }
  }
}
```

---

## ✅ You're Done!

Your Identity Service is running on **`http://localhost:5001`**

### Next Steps:

1. **[Authenticate with Firebase](./docs/how-to-guides/firebase-authentication.md)** - Complete Firebase integration
2. **[Create Buyer Profile](./docs/how-to-guides/buyer-profiles.md)** - Manage buyer profiles
3. **[API Reference](./API_REFERENCE.md)** - Explore all endpoints
4. **[Postman Collection](./examples/postman/)** - Import ready-to-use API collection

---

## Common Issues

### Port 5001 Already in Use

**Solution:** Change port in `appsettings.json`
```json
{
  "Urls": "http://localhost:5002"
}
```

### Database Connection Failed

**Check PostgreSQL is running:**
```bash
docker ps | grep postgres
```

**Check connection string:**
```bash
# Test PostgreSQL connection
docker exec -it postgres psql -U postgres -d realserv_identity
```

### Firebase Authentication Failed

**Verify credentials:**
```bash
# Check Firebase credentials file exists
ls firebase-admin-sdk.json

# Verify Firebase project ID in appsettings.json matches Firebase Console
cat appsettings.json | grep ProjectId
```

### Migration Failed

**Reset database:**
```bash
# Drop database
dotnet ef database drop

# Recreate and run migrations
dotnet ef database update
```

---

## Development Tools

### Swagger UI
Open **[http://localhost:5001/swagger](http://localhost:5001/swagger)** to explore APIs interactively.

### Database Client
```bash
# Connect to PostgreSQL
docker exec -it postgres psql -U postgres -d realserv_identity

# List tables
\dt

# View users table
SELECT * FROM users;
```

### View Logs
```bash
# Real-time logs
dotnet run --verbosity detailed

# Or use Docker logs
docker-compose logs -f identity-service
```

---

## What's Next?

### Tutorials
- [Getting Started Tutorial](./docs/tutorials/getting-started.md) - Complete beginner guide

### How-To Guides
- [Deploy to Production](./docs/how-to-guides/deploy-to-production.md)
- [Setup Firebase](./docs/how-to-guides/firebase-authentication.md)
- [Monitor and Debug](./docs/how-to-guides/monitor-and-debug.md)

### Reference
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Database Schema](./docs/reference/database-schema.md) - PostgreSQL schema
- [Error Codes](./docs/reference/error-codes.md) - All error codes

---

**Need Help?**  
- 📖 [Full Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/realserv/backend/issues)
- 💬 [Ask Questions](https://github.com/realserv/backend/discussions)

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Status:** Production Ready
