---
title: Quick Start - Vendor Service
service: Vendor Service
category: quickstart
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Quick Start - Vendor Service

**Service:** Vendor Service  
**Category:** Quick Start  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Get the Vendor Service running in 5 minutes with Docker or locally.

---

## Prerequisites

- **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/) or use Docker
- **Redis 7+** - [Download here](https://redis.io/download) or use Docker
- **Firebase Project** - [Create project](https://console.firebase.google.com/)
- **Docker Desktop** _(optional)_ - [Download here](https://www.docker.com/products/docker-desktop/)

---

## Option 1: Quick Start with Docker (Recommended)

### 1. Clone Repository

```bash
git clone https://github.com/realserv/backend.git
cd backend/src/services/VendorService
```

### 2. Configure Environment

Create `appsettings.Development.json`:

```json
{
  "Firebase": {
    "ProjectId": "your-firebase-project-id"
  },
  "ConnectionStrings": {
    "VendorServiceDb": "Host=localhost;Port=5432;Database=realserv_vendor;Username=postgres;Password=postgres",
    "Redis": "localhost:6379"
  },
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:3001"
  ]
}
```

### 3. Start Dependencies

```bash
# Start PostgreSQL and Redis
cd ../../../
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

**Verify dependencies are running:**
```bash
docker ps

# Expected output:
# postgres:15-alpine (port 5432)
# redis:7-alpine (port 6379)
```

### 4. Run Database Migrations

```bash
cd src/services/VendorService
dotnet ef database update
```

**Expected output:**
```
Applying migration '20260111_InitialCreate'...
Done.
```

### 5. Start the Service

```bash
dotnet run
```

**Expected output:**
```
🚀 Vendor Service starting...
🌍 Environment: Development
🔐 Security: CORS ✓ | Rate Limiting ✓ | Auth ✓ | Caching ✓
📊 Database: PostgreSQL
💾 Cache: Redis
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5002
Application started. Press Ctrl+C to shut down.
```

### 6. Test the Service

```bash
curl http://localhost:5002/health
```

**Expected response:**
```json
{
  "status": "Healthy",
  "timestamp": "2026-01-11T12:00:00Z",
  "checks": {
    "database": "Healthy",
    "redis": "Healthy"
  }
}
```

---

## Option 2: Manual Setup (Without Docker)

### 1. Install Prerequisites

- Install .NET 8.0 SDK
- Install PostgreSQL 15+
- Install Redis 7+

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE realserv_vendor;
\q
```

### 3. Start Redis

```bash
# Windows
redis-server

# macOS/Linux
sudo systemctl start redis
# or
redis-server /usr/local/etc/redis.conf
```

### 4. Clone & Configure

```bash
git clone https://github.com/realserv/backend.git
cd backend/src/services/VendorService

# Copy configuration
cp appsettings.example.json appsettings.Development.json

# Edit with your values
nano appsettings.Development.json
```

### 5. Run Migrations & Start

```bash
dotnet restore
dotnet ef database update
dotnet run
```

---

## ✅ Verify Installation

### 1. Check Health Endpoint

```bash
curl http://localhost:5002/health
```

### 2. Access Swagger UI

Open browser: **http://localhost:5002**

You should see the Swagger interactive API documentation.

### 3. Test an Endpoint

```bash
# Get all vendors (requires authentication)
curl -X GET http://localhost:5002/api/v1/vendors \
  -H "Authorization: Bearer YOUR_FIREBASE_JWT_TOKEN"
```

---

## 🎉 You're Done!

Your Vendor Service is now running on **http://localhost:5002**

### What's Next?

1. **[Authentication](./guides/authentication.md)** - Set up Firebase authentication
2. **[Register Vendor](./guides/vendor-registration.md)** - Create your first vendor profile
3. **[Manage Inventory](./guides/inventory-management.md)** - Add materials to catalog
4. **[API Reference](./API_REFERENCE.md)** - Explore all 48 endpoints
5. **[Integration](./docs/how-to-guides/service-integration.md)** - Connect with other services

---

## 🔧 Common Issues

### Port 5002 Already in Use

**Error:** `Address already in use`

**Solution:** Change port in `appsettings.json`:
```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5003"
      }
    }
  }
}
```

### Database Connection Failed

**Error:** `Connection refused` or `Could not connect to server`

**Solution:**
1. Verify PostgreSQL is running: `docker ps` or `systemctl status postgresql`
2. Check connection string in `appsettings.Development.json`
3. Ensure database exists: `psql -U postgres -c "\l" | grep realserv_vendor`

### Redis Connection Failed

**Error:** `It was not possible to connect to the redis server`

**Solution:**
1. Verify Redis is running: `docker ps` or `systemctl status redis`
2. Test Redis connection: `redis-cli ping` (should return `PONG`)
3. Check connection string in `appsettings.Development.json`

### Firebase Authentication Failed

**Error:** `Firebase initialization failed` or `Invalid token`

**Solution:**
1. Verify Firebase Project ID is correct
2. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
   ```
3. Or use Firebase emulator for local development: [Setup Firebase Emulator](./docs/how-to-guides/firebase-emulator.md)

### Migration Failed

**Error:** `A connection to the database could not be established`

**Solution:**
```bash
# Reset database
dotnet ef database drop -f
dotnet ef database update
```

### NuGet Package Restore Failed

**Error:** `Unable to resolve package`

**Solution:**
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore
```

---

## 📝 Configuration Options

### appsettings.json Structure

```json
{
  "Firebase": {
    "ProjectId": "your-firebase-project-id"
  },
  "ConnectionStrings": {
    "VendorServiceDb": "Host=localhost;Database=realserv_vendor;Username=postgres;Password=postgres",
    "Redis": "localhost:6379"
  },
  "AllowedOrigins": ["http://localhost:3000"],
  "RateLimiting": {
    "PermitLimit": 100,
    "Window": 60,
    "QueueLimit": 10
  },
  "Caching": {
    "DefaultTTLMinutes": 5,
    "VendorTTLMinutes": 10
  },
  "Pagination": {
    "DefaultPageSize": 20,
    "MaxPageSize": 100
  }
}
```

---

## 🐳 Docker Commands

### Start All Services

```bash
cd backend
docker-compose -f docker-compose.dev.yml up -d
```

### Stop All Services

```bash
docker-compose -f docker-compose.dev.yml down
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f postgres
docker-compose -f docker-compose.dev.yml logs -f redis
```

### Rebuild Service

```bash
docker-compose -f docker-compose.dev.yml up -d --build vendor-service
```

---

## 🚀 Production Deployment

For production deployment, see:
- [Deploy to Azure](./docs/how-to-guides/deploy-to-azure.md)
- [Deploy to AWS](./docs/how-to-guides/deploy-to-aws.md)
- [Deploy to Kubernetes](./docs/how-to-guides/deploy-to-kubernetes.md)

---

## 📞 Need Help?

- **Documentation:** [Full docs](./docs/)
- **API Reference:** [API_REFERENCE.md](./API_REFERENCE.md)
- **Examples:** [examples/](./examples/)
- **Issues:** Create an issue on GitHub
- **Email:** support@realserv.com

---

**Estimated Setup Time:** 5 minutes  
**Difficulty:** Easy ⭐

---

**Updated:** January 11, 2026  
**Version:** 1.0.0
