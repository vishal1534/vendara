---
title: Configuration Reference - Identity Service
service: Identity Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Configuration Reference - Identity Service

**Service:** Identity Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete reference for all environment variables and configuration settings.

---

## Configuration File: appsettings.json

### Development Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*",
  "Urls": "http://localhost:5001",
  
  "ConnectionStrings": {
    "IdentityServiceDb": "Host=localhost;Port=5432;Database=realserv_identity;Username=postgres;Password=postgres"
  },
  
  "Firebase": {
    "ProjectId": "your-firebase-project-id",
    "CredentialsPath": "firebase-admin-sdk.json",
    "ApiKey": "YOUR_FIREBASE_WEB_API_KEY"
  },
  
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000", "http://localhost:5173"]
  },
  
  "RateLimit": {
    "AuthEndpoints": 10,
    "ReadEndpoints": 100,
    "WriteEndpoints": 50
  }
}
```

### Production Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error"
    }
  },
  "AllowedHosts": "api.realserv.com",
  "Urls": "http://0.0.0.0:8080",
  
  "ConnectionStrings": {
    "IdentityServiceDb": "${IDENTITY_DB_CONNECTION_STRING}"
  },
  
  "Firebase": {
    "ProjectId": "${FIREBASE_PROJECT_ID}",
    "CredentialsPath": "/app/secrets/firebase-admin-sdk.json",
    "ApiKey": "${FIREBASE_API_KEY}"
  },
  
  "Cors": {
    "AllowedOrigins": ["https://app.realserv.com", "https://admin.realserv.com"]
  }
}
```

---

## Environment Variables

### Required

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| **IDENTITY_DB_CONNECTION_STRING** | PostgreSQL connection string | `Host=db.realserv.com;Database=identity;...` | - |
| **FIREBASE_PROJECT_ID** | Firebase project ID | `realserv-prod` | - |
| **FIREBASE_API_KEY** | Firebase web API key | `AIzaSyC...` | - |

### Optional

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| **ASPNETCORE_ENVIRONMENT** | Environment name | `Development`, `Staging`, `Production` | `Production` |
| **ASPNETCORE_URLS** | Service URLs | `http://0.0.0.0:8080` | `http://localhost:5000` |
| **LOG_LEVEL** | Logging level | `Information`, `Warning`, `Error` | `Information` |

---

## Configuration Sections

### ConnectionStrings

**PostgreSQL Database Connection**

```json
{
  "ConnectionStrings": {
    "IdentityServiceDb": "Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require"
  }
}
```

**Parameters:**
- `Host`: Database server hostname
- `Port`: Database port (default: 5432)
- `Database`: Database name
- `Username`: Database user
- `Password`: Database password
- `SSL Mode`: SSL mode (Require for production)

---

### Firebase

**Firebase Authentication Configuration**

```json
{
  "Firebase": {
    "ProjectId": "your-project-id",
    "CredentialsPath": "path/to/firebase-admin-sdk.json",
    "ApiKey": "YOUR_API_KEY"
  }
}
```

**Parameters:**
- `ProjectId`: Firebase project ID (from Firebase Console)
- `CredentialsPath`: Path to Firebase Admin SDK JSON file
- `ApiKey`: Firebase web API key (for REST API calls)

**How to get credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save as `firebase-admin-sdk.json`

---

### Cors

**Cross-Origin Resource Sharing**

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://app.realserv.com"
    ]
  }
}
```

**Development:**
```json
["http://localhost:3000", "http://localhost:5173"]
```

**Production:**
```json
["https://app.realserv.com", "https://admin.realserv.com"]
```

---

### RateLimit

**API Rate Limiting**

```json
{
  "RateLimit": {
    "AuthEndpoints": 10,
    "ReadEndpoints": 100,
    "WriteEndpoints": 50
  }
}
```

**Parameters:**
- `AuthEndpoints`: Requests/minute for auth endpoints (signup, login)
- `ReadEndpoints`: Requests/minute for GET endpoints
- `WriteEndpoints`: Requests/minute for POST/PUT/DELETE endpoints

---

## Docker Environment Variables

### docker-compose.yml

```yaml
services:
  identity-service:
    image: realserv/identity-service:latest
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://0.0.0.0:8080
      - IDENTITY_DB_CONNECTION_STRING=Host=postgres;Database=identity;Username=postgres;Password=${DB_PASSWORD}
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
      - FIREBASE_API_KEY=${FIREBASE_API_KEY}
    volumes:
      - ./firebase-admin-sdk.json:/app/secrets/firebase-admin-sdk.json:ro
```

### .env File

```bash
# Database
DB_PASSWORD=secure_password_here

# Firebase
FIREBASE_PROJECT_ID=realserv-prod
FIREBASE_API_KEY=AIzaSyC...

# Application
ASPNETCORE_ENVIRONMENT=Production
LOG_LEVEL=Warning
```

---

## Kubernetes ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: identity-service-config
data:
  appsettings.json: |
    {
      "Logging": {
        "LogLevel": {
          "Default": "Warning"
        }
      },
      "Cors": {
        "AllowedOrigins": ["https://app.realserv.com"]
      }
    }
```

## Kubernetes Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: identity-service-secrets
type: Opaque
stringData:
  connection-string: "Host=postgres;Database=identity;Username=postgres;Password=..."
  firebase-project-id: "realserv-prod"
  firebase-api-key: "AIzaSyC..."
```

---

## Validation

### Configuration Validation at Startup

The service validates configuration on startup:

```csharp
// Program.cs
var firebaseProjectId = builder.Configuration["Firebase:ProjectId"];
if (string.IsNullOrEmpty(firebaseProjectId))
{
    throw new InvalidOperationException("Firebase:ProjectId is required");
}

var connectionString = builder.Configuration.GetConnectionString("IdentityServiceDb");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("ConnectionString is required");
}
```

---

## Configuration by Environment

### Development

```json
{
  "Logging": {"LogLevel": {"Default": "Information"}},
  "ConnectionStrings": {
    "IdentityServiceDb": "Host=localhost;Database=realserv_identity_dev;..."
  },
  "Firebase": {
    "ProjectId": "realserv-dev"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

### Staging

```json
{
  "Logging": {"LogLevel": {"Default": "Information"}},
  "ConnectionStrings": {
    "IdentityServiceDb": "${IDENTITY_DB_CONNECTION_STRING}"
  },
  "Firebase": {
    "ProjectId": "realserv-staging"
  },
  "Cors": {
    "AllowedOrigins": ["https://staging.realserv.com"]
  }
}
```

### Production

```json
{
  "Logging": {"LogLevel": {"Default": "Warning"}},
  "ConnectionStrings": {
    "IdentityServiceDb": "${IDENTITY_DB_CONNECTION_STRING}"
  },
  "Firebase": {
    "ProjectId": "realserv-prod"
  },
  "Cors": {
    "AllowedOrigins": ["https://app.realserv.com"]
  }
}
```

---

## Troubleshooting

### Issue: Firebase authentication fails

**Check:**
```bash
# Verify Firebase credentials exist
ls firebase-admin-sdk.json

# Check project ID matches
cat appsettings.json | grep ProjectId
```

### Issue: Database connection fails

**Check:**
```bash
# Test connection
docker exec -it postgres psql -U postgres -d realserv_identity

# Verify connection string
echo $IDENTITY_DB_CONNECTION_STRING
```

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026
