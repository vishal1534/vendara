# Integration Service

WhatsApp messaging, media uploads to S3, and location services for the RealServ construction materials marketplace in Hyderabad.

## Key Features

- 💬 **WhatsApp Bot** - Send/receive messages via Meta Business API (text, templates, media)
- 📁 **Media Upload** - Upload files to AWS S3 with automatic validation and categorization
- 📍 **Location Services** - Geocoding, reverse geocoding, and distance calculation with Google Maps
- ⚡ **Performance** - 90-day geocoding cache, Redis support, optimized S3 storage
- 🔐 **Security** - Webhook signature verification, JWT auth, input validation, rate limiting
- 🎯 **Production Ready** - Retry policies, circuit breakers, audit logging, background cleanup jobs

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for 5-minute Docker setup.

```bash
# Start dependencies
docker-compose up -d postgres redis

# Configure settings
cp appsettings.example.json appsettings.Development.json
# Edit appsettings.Development.json with your credentials

# Run migrations
dotnet ef database update

# Start service
dotnet run
# Service starts on http://localhost:5011
```

## Documentation

### Core Documentation
- **[Quick Start](./QUICKSTART.md)** - 5-minute setup guide
- **[API Reference](./API_REFERENCE.md)** - Complete API docs with 50+ examples
- **[Guides](./guides/)** - How-to guides for WhatsApp, media, and location features
- **[Examples](./examples/)** - Working code samples (C#, Python, JavaScript, Postman)

### Technical Documentation
- **[Reference Docs](./docs/reference/)** - Error codes, config, database schema, troubleshooting
- **[How-To Guides](./docs/how-to-guides/)** - Deploy, optimize, monitor, security
- **[Architecture](./docs/explanation/)** - System design and decisions

## API Overview

### WhatsApp API
```bash
POST /api/v1/whatsapp/send/text           # Send text message
POST /api/v1/whatsapp/send/template       # Send template message
POST /api/v1/whatsapp/send/media          # Send media (image/doc/video/audio)
POST /api/v1/whatsapp/webhook             # Receive messages from Meta
GET  /api/v1/whatsapp/history/phone/{id}  # Message history
```

### Media API
```bash
POST   /api/v1/media/upload               # Upload single file
POST   /api/v1/media/upload/multiple      # Upload multiple files (max 10)
GET    /api/v1/media/{fileId}             # Get file details
POST   /api/v1/media/presigned-url        # Generate temporary S3 URL
DELETE /api/v1/media/{fileId}             # Soft delete file
```

### Location API
```bash
POST /api/v1/location/geocode             # Address → coordinates
POST /api/v1/location/reverse-geocode     # Coordinates → address
POST /api/v1/location/distance            # Calculate distance with Google Maps
POST /api/v1/location/distance/haversine  # Calculate distance (no API calls)
```

**Full API Documentation**: [API_REFERENCE.md](./API_REFERENCE.md)

## Tech Stack

- **.NET 8.0** - Modern C# with ASP.NET Core
- **PostgreSQL 15** - Primary database with JSONB support
- **Redis** - Distributed caching (optional)
- **Entity Framework Core 8** - ORM with migrations
- **FluentValidation** - Request validation
- **Polly** - Retry policies and circuit breakers
- **Serilog** - Structured logging
- **Docker** - Containerization

### External Integrations
- **Meta WhatsApp Business API** (v18.0) - Messaging
- **AWS S3** - File storage
- **Google Maps API** - Geocoding and distance calculations
- **Firebase** - JWT authentication

## Configuration

### Required Settings

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=realserv_integration;...",
    "Redis": "localhost:6379"
  },
  "WhatsApp": {
    "PhoneNumberId": "YOUR_PHONE_NUMBER_ID",
    "AccessToken": "YOUR_ACCESS_TOKEN",
    "AppSecret": "YOUR_APP_SECRET",
    "VerifyToken": "YOUR_VERIFY_TOKEN"
  },
  "AWS": {
    "Region": "ap-south-1",
    "S3": {
      "BucketName": "realserv-media",
      "MediaUrlPrefix": "https://realserv-media.s3.ap-south-1.amazonaws.com/"
    }
  },
  "GoogleMaps": {
    "ApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
  }
}
```

See [Configuration Reference](./docs/reference/configuration.md) for all settings.

## Security Features

✅ **WhatsApp Webhook Signature Verification** - HMAC-SHA256 validation  
✅ **JWT Authentication** - Firebase tokens with role-based access  
✅ **Input Validation** - FluentValidation on all requests  
✅ **Rate Limiting** - 1000 req/hour general, 20 req/min uploads, 100 req/min webhooks  
✅ **Audit Logging** - Track all sensitive operations  
✅ **File Validation** - Size limits (100MB max), extension whitelist  

## Performance

- **Geocoding Cache** - 90-day database cache reduces Google Maps API costs
- **Redis Caching** - Optional distributed cache for file metadata
- **Retry Policies** - 3 retries with exponential backoff for WhatsApp & Google Maps
- **Circuit Breakers** - Open after 5 failures, prevents cascading errors
- **Background Jobs** - Automatic cache cleanup every 24 hours
- **Streaming Uploads** - Handle large files without memory issues

## Deployment

### Docker
```bash
docker build -t realserv-integration-service .
docker run -p 5011:5011 \
  -e ConnectionStrings__DefaultConnection="..." \
  -e WhatsApp__AccessToken="..." \
  realserv-integration-service
```

### Production Checklist
- ✅ Set all environment variables
- ✅ Run database migrations
- ✅ Configure AWS S3 bucket + CloudFront CDN
- ✅ Register WhatsApp webhook with Meta
- ✅ Enable Google Maps API with billing
- ✅ Set up monitoring (CloudWatch, Serilog)
- ✅ Configure backup strategy

See [Deploy to Production](./docs/how-to-guides/deploy-to-production.md) for details.

## Monitoring & Health Checks

```bash
# Health check endpoint
curl http://localhost:5011/health

# Swagger UI (development only)
open http://localhost:5011
```

**Logs**: `logs/integration-service-YYYY-MM-DD.txt` (daily rotation)

## Database

### Tables
- **audit_logs** - Tracks all sensitive operations (WhatsApp sends, file uploads)
- **whatsapp_messages** - Message history (sent & received)
- **media_files** - File metadata with S3 keys
- **location_caches** - Geocoding results (90-day TTL)

See [Database Schema](./docs/reference/database-schema.md) for full details.

## Troubleshooting

**Common Issues**:
- [WhatsApp webhook verification fails](./docs/reference/troubleshooting.md#whatsapp-webhook)
- [S3 upload permission denied](./docs/reference/troubleshooting.md#s3-permissions)
- [Google Maps API quota exceeded](./docs/reference/troubleshooting.md#google-maps-quota)
- [Redis connection timeout](./docs/reference/troubleshooting.md#redis-timeout)

See [Troubleshooting Guide](./docs/reference/troubleshooting.md) for more.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## Support

- **Documentation**: [Full Docs](./docs/)
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Issues**: [GitHub Issues](https://github.com/realserv/backend/issues)
- **Email**: tech@realserv.in

## License

Proprietary - RealServ © 2026

---

**Service**: Integration Service  
**Version**: 1.0.0  
**Port**: 5011  
**Status**: ✅ Production Ready  
**Last Updated**: January 12, 2026
