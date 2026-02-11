# IntegrationService - Quick Start Guide

**Service**: IntegrationService  
**Version**: 1.0.0  
**Port**: 5011

---

## Prerequisites

Before running the IntegrationService, ensure you have:

1. **.NET 8 SDK** installed
2. **PostgreSQL 15+** running
3. **Redis** running (optional but recommended for caching)
4. **AWS Account** with S3 bucket configured
5. **WhatsApp Business API** credentials from Meta
6. **Google Maps API** key

---

## Quick Setup

### 1. Database Setup

```bash
# Create database
createdb realserv_integration

# Navigate to service directory
cd /backend/src/services/IntegrationService

# Run migrations
dotnet ef database update
```

### 2. Configure Environment Variables

Create `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=realserv_integration_dev;Username=postgres;Password=your_password",
    "Redis": "localhost:6379"
  },
  "Firebase": {
    "ProjectId": "realserv-mvp",
    "CredentialPath": "/path/to/firebase-credentials.json"
  },
  "AWS": {
    "Region": "ap-south-1",
    "S3": {
      "BucketName": "realserv-media-dev",
      "MediaUrlPrefix": "https://realserv-media-dev.s3.ap-south-1.amazonaws.com/"
    }
  },
  "WhatsApp": {
    "PhoneNumberId": "YOUR_PHONE_NUMBER_ID",
    "AccessToken": "YOUR_ACCESS_TOKEN",
    "VerifyToken": "YOUR_VERIFY_TOKEN"
  },
  "GoogleMaps": {
    "ApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
  }
}
```

### 3. Configure AWS Credentials

```bash
# Option 1: AWS CLI
aws configure

# Option 2: Environment variables
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_DEFAULT_REGION="ap-south-1"
```

### 4. Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://realserv-media-dev

# Configure CORS (for web uploads)
aws s3api put-bucket-cors --bucket realserv-media-dev --cors-configuration file://cors.json
```

**cors.json**:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 5. Start the Service

```bash
dotnet run
```

Service will start on: `http://localhost:5011`

### 6. Verify Service is Running

```bash
curl http://localhost:5011/health
```

Expected response: `Healthy`

---

## Testing Endpoints

### Test 1: Upload a File

```bash
curl -X POST http://localhost:5011/api/v1/media/upload \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "uploadContext=test" \
  -F "isPublic=true"
```

### Test 2: Geocode an Address

```bash
curl -X POST http://localhost:5011/api/v1/location/geocode \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Kukatpally, Hyderabad"
  }'
```

### Test 3: Send WhatsApp Message

```bash
curl -X POST http://localhost:5011/api/v1/whatsapp/send/text \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+917906441952",
    "message": "Hello from RealServ!"
  }'
```

---

## WhatsApp Webhook Setup

### 1. Configure Webhook in Meta App Dashboard

1. Go to **Meta for Developers** → Your App → WhatsApp → Configuration
2. Set **Webhook URL**: `https://your-domain.com/api/v1/whatsapp/webhook`
3. Set **Verify Token**: (same as `WhatsApp:VerifyToken` in config)
4. Subscribe to webhook fields: `messages`, `message_status`

### 2. Test Webhook Locally (ngrok)

```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Start ngrok tunnel
ngrok http 5011

# Use the ngrok URL in Meta dashboard
# e.g., https://abc123.ngrok.io/api/v1/whatsapp/webhook
```

---

## Common Issues & Solutions

### Issue 1: "Failed to connect to database"

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string in appsettings.json
```

### Issue 2: "AWS S3 Access Denied"

**Solution**:
- Verify AWS credentials are configured
- Check S3 bucket permissions
- Ensure bucket name matches configuration

### Issue 3: "Google Maps API quota exceeded"

**Solution**:
- Check API key in Google Cloud Console
- Enable billing if not enabled
- Use Haversine distance calculation as fallback

### Issue 4: "WhatsApp webhook verification failed"

**Solution**:
- Ensure `WhatsApp:VerifyToken` in config matches Meta dashboard
- Check service is publicly accessible
- Verify webhook URL is correct

---

## Swagger UI

Access interactive API documentation:

**URL**: `http://localhost:5011`

Features:
- Test all endpoints directly from browser
- View request/response schemas
- JWT authentication support

---

## Database Schema

### Tables

1. **whatsapp_messages** - WhatsApp message history
2. **media_files** - Uploaded file metadata
3. **location_cache** - Geocoding cache (90-day TTL)

### Key Indexes

- `whatsapp_messages`: phone_number, user_id, created_at
- `media_files`: s3_key (unique), uploaded_by_user_id
- `location_cache`: normalized_address (unique), coordinates

---

## Performance Tips

### 1. Enable Redis Caching

Redis significantly improves performance for:
- Geocoding results (cached for 90 days)
- Frequently accessed file metadata

```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

### 2. S3 CloudFront CDN (Production)

For production, use CloudFront to cache S3 files:

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name realserv-media.s3.amazonaws.com
```

### 3. Database Connection Pooling

Already configured in `Program.cs`:
- Max pool size: 100
- Connection timeout: 30s

---

## Monitoring

### Logs

Logs are written to:
- **Console**: Real-time logs
- **File**: `logs/integration-service-YYYY-MM-DD.txt`

### Health Check

Monitor service health:

```bash
curl http://localhost:5011/health
```

Checks:
- PostgreSQL connection
- Redis connection (if configured)

---

## Next Steps

1. **Configure WhatsApp Templates** in Meta Business Manager
2. **Set up CloudWatch** for production monitoring
3. **Configure backup strategy** for database
4. **Set up CI/CD pipeline** for automated deployments

---

## API Documentation

Full API reference: [API_REFERENCE.md](./API_REFERENCE.md)

---

**Last Updated**: January 12, 2026  
**Maintainer**: RealServ Tech Team
