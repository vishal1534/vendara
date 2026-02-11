# NotificationService - Quickstart Guide

Get the NotificationService running locally in 5 minutes.

## Prerequisites

- ✅ .NET 8.0 SDK installed
- ✅ Docker Desktop running
- ✅ PostgreSQL and Redis (via Docker)

## Step 1: Start Dependencies (1 minute)

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Verify services are running
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE              STATUS    PORTS
abc123...      postgres:16        Up        0.0.0.0:5440->5432/tcp
def456...      redis:7-alpine     Up        0.0.0.0:6379->6379/tcp
```

## Step 2: Configure Environment (1 minute)

Create a `.env` file or set environment variables:

```bash
# Database
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5440;Database=realserv_notification_db;Username=postgres;Password=postgres"

# Redis
export ConnectionStrings__Redis="localhost:6379"

# AWS (for local testing, use LocalStack or mock)
export AWS__Region="ap-south-1"
export AWS__SES__FromEmail="noreply@realserv.in"

# WhatsApp (test credentials)
export WhatsApp__PhoneNumberId="TEST"
export WhatsApp__AccessToken="TEST"

# Firebase (optional for local dev)
export Firebase__CredentialPath="./firebase-credentials-dev.json"
```

## Step 3: Initialize Database (1 minute)

```bash
# Navigate to service directory
cd backend/src/services/NotificationService

# Run database migrations
dotnet ef database update

# Database will be created with:
# - notifications table
# - notification_templates table (with seed data)
# - user_notification_preferences table
```

## Step 4: Run the Service (1 minute)

```bash
# Start the service
dotnet run

# Or with hot reload
dotnet watch run
```

Expected output:
```
[12:00:00 INF] NotificationService starting on port 5010...
[12:00:01 INF] Database migration and seeding completed successfully
[12:00:01 INF] Now listening on: http://localhost:5010
```

## Step 5: Test the API (1 minute)

### Option A: Using Swagger UI

1. Open browser: http://localhost:5010
2. You'll see the Swagger UI with all endpoints
3. Try the `/health` endpoint first

### Option B: Using curl

```bash
# 1. Health check
curl http://localhost:5010/health

# 2. Get service info
curl http://localhost:5010/

# 3. Get all notification templates
curl http://localhost:5010/api/v1/notifications/templates

# 4. Send a test email notification (mock mode in dev)
curl -X POST http://localhost:5010/api/v1/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "recipientType": "buyer",
    "recipientEmail": "test@example.com",
    "notificationType": "order_created",
    "subject": "Test Order",
    "body": "This is a test notification."
  }'
```

## ✅ You're Ready!

The NotificationService is now running at **http://localhost:5010**

## Next Steps

### 1. Explore the API

Visit http://localhost:5010 to see all available endpoints in Swagger UI.

### 2. Configure Real Providers

For actual notification sending, configure:

**AWS SES (Email)**:
```bash
# Set AWS credentials
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_REGION="ap-south-1"

# Verify SES email
aws ses verify-email-identity --email-address noreply@realserv.in
```

**WhatsApp Business API**:
```bash
# Get credentials from Meta Business Suite
export WhatsApp__PhoneNumberId="your_phone_number_id"
export WhatsApp__AccessToken="your_permanent_token"
export WhatsApp__BusinessAccountId="your_business_account_id"
```

**Firebase FCM (Push Notifications)**:
```bash
# Download service account JSON from Firebase Console
# Place it in the project root
export Firebase__CredentialPath="./firebase-credentials.json"
```

**AWS SNS (SMS)**:
```bash
# Same AWS credentials as SES
# Enable SMS in AWS SNS console for your region
```

### 3. Read Full Documentation

- **[API Reference](./API_REFERENCE.md)** - All endpoints with examples
- **[Architecture](./docs/ARCHITECTURE.md)** - System design
- **[Database](./docs/DATABASE.md)** - Schema details
- **[Security](./docs/SECURITY.md)** - Security best practices
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues

## Common Commands

```bash
# View logs
tail -f logs/notification-service-*.txt

# Reset database
dotnet ef database drop --force
dotnet ef database update

# Run tests
dotnet test

# Build for production
dotnet publish -c Release
```

## Troubleshooting

### Can't connect to database?

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -p 5440 -U postgres -d realserv_notification_db
```

### Port 5010 already in use?

```bash
# Change port in appsettings.Development.json or use:
dotnet run --urls="http://localhost:5011"
```

### Redis connection error?

```bash
# Check Redis is running
docker ps | grep redis

# Test connection
redis-cli -h localhost -p 6379 ping
# Should return: PONG
```

## Support

- **Documentation**: `./docs/` folder
- **Issues**: Contact backend team
- **Slack**: #backend-dev

---

**Congratulations!** 🎉 You're now ready to send notifications with RealServ NotificationService.
