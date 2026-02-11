# NotificationService

Multi-channel notification service for RealServ MVP marketplace. Handles email, WhatsApp, SMS, and push notifications with template management and user preferences.

## Overview

**Version:** 1.0.0  
**Port:** 5010  
**Database:** `realserv_notification_db` (PostgreSQL)  
**Status:** ✅ Production-Ready

### Key Features

- ✅ **Multi-Channel Notifications**: Email (SES), WhatsApp, SMS (SNS), Push (FCM)
- ✅ **Template Management**: Reusable notification templates with variable substitution
- ✅ **User Preferences**: Granular control over notification channels and types
- ✅ **Notification History**: Complete audit trail of all sent notifications
- ✅ **Delivery Tracking**: Track notification status (pending, sent, delivered, failed)
- ✅ **Provider Integration**: AWS SES, WhatsApp Business API, AWS SNS, Firebase FCM

## Quick Links

- **[API Reference](./API_REFERENCE.md)** - Complete API documentation with 50+ examples
- **[Quickstart Guide](./QUICKSTART.md)** - Get started in 5 minutes
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and patterns
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

## API Endpoints Summary

### Notifications
- `POST /api/v1/notifications/email` - Send email notification
- `POST /api/v1/notifications/whatsapp` - Send WhatsApp notification
- `POST /api/v1/notifications/sms` - Send SMS notification
- `POST /api/v1/notifications/push` - Send push notification
- `GET /api/v1/notifications/{id}` - Get notification by ID
- `GET /api/v1/notifications/user/{userId}` - Get user notification history

### Templates
- `GET /api/v1/notifications/templates` - Get all templates
- `GET /api/v1/notifications/templates/{id}` - Get template by ID
- `GET /api/v1/notifications/templates/by-name/{name}` - Get template by name
- `POST /api/v1/notifications/templates` - Create template (Admin)
- `PUT /api/v1/notifications/templates/{id}` - Update template (Admin)
- `DELETE /api/v1/notifications/templates/{id}` - Delete template (Admin)

### Preferences
- `GET /api/v1/notifications/preferences/{userId}` - Get user preferences
- `PUT /api/v1/notifications/preferences/{userId}` - Update preferences

## Quick Start

### Prerequisites

- .NET 8.0 SDK
- PostgreSQL 16
- Redis 7
- AWS Account (SES, SNS configured)
- WhatsApp Business API access
- Firebase project with FCM enabled

### Local Development

```bash
# 1. Start dependencies
docker-compose up -d postgres redis

# 2. Set environment variables
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5440;Database=realserv_notification_db;Username=postgres;Password=postgres"
export AWS__Region="ap-south-1"
export WhatsApp__AccessToken="your_token"
export Firebase__CredentialPath="./firebase-credentials.json"

# 3. Run migrations
dotnet ef database update

# 4. Run the service
dotnet run

# 5. Access Swagger UI
open http://localhost:5010
```

## Architecture

```
NotificationService/
├── Controllers/          # API endpoints (3 controllers)
├── Services/            # Business logic (7 services)
│   ├── EmailService.cs         # AWS SES integration
│   ├── WhatsAppService.cs      # WhatsApp Business API
│   ├── SmsService.cs           # AWS SNS integration
│   ├── PushNotificationService.cs  # Firebase FCM
│   └── NotificationManagementService.cs
├── Repositories/        # Data access layer
├── Models/              # DTOs, Entities, Requests
├── Data/                # DbContext, migrations, seeder
└── Middleware/          # Request logging
```

## Database Schema

### Tables
- **notifications** - Notification history and status
- **notification_templates** - Reusable message templates
- **user_notification_preferences** - User channel preferences

See [Database Schema](./docs/DATABASE.md) for complete details.

## Technology Stack

- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL 16 with EF Core
- **Cache**: Redis 7
- **Email**: AWS SES
- **SMS**: AWS SNS
- **WhatsApp**: WhatsApp Business API (Cloud API)
- **Push**: Firebase Cloud Messaging (FCM)
- **Logging**: Serilog

## Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5440;Database=realserv_notification_db;...",
    "Redis": "localhost:6379"
  },
  "AWS": {
    "Region": "ap-south-1",
    "SES": {
      "FromEmail": "noreply@realserv.in"
    }
  },
  "WhatsApp": {
    "PhoneNumberId": "YOUR_PHONE_NUMBER_ID",
    "AccessToken": "YOUR_ACCESS_TOKEN"
  },
  "Firebase": {
    "CredentialPath": "/path/to/firebase-credentials.json"
  }
}
```

## Example Usage

### Send Email Notification

```bash
curl -X POST http://localhost:5010/api/v1/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "recipientType": "buyer",
    "recipientEmail": "buyer@example.com",
    "notificationType": "order_created",
    "subject": "Order Confirmed",
    "body": "Your order #12345 has been confirmed."
  }'
```

### Send WhatsApp Notification

```bash
curl -X POST http://localhost:5010/api/v1/notifications/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "recipientType": "buyer",
    "recipientPhone": "+917906441952",
    "notificationType": "order_created",
    "templateName": "order_confirmation",
    "language": "en",
    "parameters": {
      "1": "John",
      "2": "12345",
      "3": "5000"
    }
  }'
```

## Testing

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true
```

## Documentation

- **[API Reference](./API_REFERENCE.md)** - All endpoints with examples
- **[Quickstart](./QUICKSTART.md)** - Get started guide
- **[Architecture](./docs/ARCHITECTURE.md)** - System design
- **[Database](./docs/DATABASE.md)** - Schema documentation
- **[Security](./docs/SECURITY.md)** - Security practices
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues
- **[Deployment](./docs/DEPLOYMENT.md)** - Production deployment

## Monitoring

- **Health Check**: `GET /health`
- **Service Info**: `GET /`
- **Logs**: `logs/notification-service-*.txt`

## Support

- **Documentation**: See [docs/](./docs/) folder
- **Issues**: Contact backend team
- **Slack**: #backend-dev

## License

© 2026 RealServ. All rights reserved.
