# Identity Service

Authentication, user management, and profiles for RealServ construction marketplace.

## Key Features

- 🔐 **Firebase Authentication** - Email/password, Google OAuth, Apple Sign-In
- 👤 **User Management** - Buyers, vendors, and admins with role-based access
- 📱 **Phone OTP** - WhatsApp/SMS OTP for phone authentication
- 🏗️ **Buyer Profiles** - Business name, addresses, GST details
- 🔑 **Token Management** - Firebase ID tokens for all API access
- ✉️ **Email Verification** - Firebase-managed email verification

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup.

```bash
# 1. Clone and configure
cd backend/src/services/IdentityService
cp appsettings.example.json appsettings.json

# 2. Start dependencies
docker-compose up -d postgres redis

# 3. Run migrations
dotnet ef database update

# 4. Start service
dotnet run

# Service running on http://localhost:5001
```

## Documentation

- **[Quick Start](./QUICKSTART.md)** - 5-minute setup guide
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Guides](./docs/how-to-guides/)** - How-to guides and tutorials
- **[Examples](./examples/)** - Working code examples
- **[Full Documentation](./docs/)** - Complete documentation

## API Overview

### Authentication Endpoints
```
POST   /api/v1/auth/signup              # Email/password signup
POST   /api/v1/auth/login               # Email/password login
POST   /api/v1/auth/social              # Social login (Google/Apple)
POST   /api/v1/auth/phone/send-otp      # Send phone OTP
POST   /api/v1/auth/phone/verify-otp    # Verify phone OTP
GET    /api/v1/auth/me                  # Get current user
POST   /api/v1/auth/logout              # Logout
```

### User Management Endpoints
```
GET    /api/v1/users                    # List users
GET    /api/v1/users/{id}               # Get user by ID
PUT    /api/v1/users/{id}               # Update user
DELETE /api/v1/users/{id}               # Delete user
```

See [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation with 50+ examples.

## Tech Stack

- **.NET 8.0** (C# LTS)
- **PostgreSQL 16** - Primary database
- **Entity Framework Core 8** - ORM
- **Firebase Authentication** - Auth provider
- **Redis 7** - Caching (optional)
- **Docker** - Containerization

## Firebase Authentication

This service uses **Firebase Auth exclusively** for all token management:
- ✅ Firebase ID tokens (JWT format)
- ✅ Firebase refresh tokens
- ✅ Client-side token refresh (Firebase SDK)
- ❌ No custom JWT generation
- ❌ No custom refresh tokens

See [FIREBASE-AUTH.md](./docs/explanation/firebase-auth.md) for complete Firebase integration guide.

## Architecture

```
┌─────────┐         ┌──────────┐         ┌─────────────┐
│ Client  │────────>│ Firebase │────────>│   Identity  │
│  (Web/  │<────────│   Auth   │<────────│   Service   │
│ Mobile) │         │          │         │ (This API)  │
└─────────┘         └──────────┘         └─────────────┘
     │                    │                      │
     │   1. Authenticate  │                      │
     │ ─────────────────> │                      │
     │   2. ID Token      │                      │
     │ <───────────────── │                      │
     │   3. API Request + Firebase ID Token      │
     │ ────────────────────────────────────────> │
     │   4. Verify Token                         │
     │                    │ <─────────────────── │
     │   5. API Response                         │
     │ <──────────────────────────────────────── │
```

## Project Structure

```
IdentityService/
├── Controllers/          # API controllers
├── Services/            # Business logic
├── Repositories/        # Data access layer
├── Models/
│   ├── Entities/        # Database entities
│   └── DTOs/            # Data transfer objects
├── Data/                # DbContext, migrations
├── docs/                # Full documentation
├── examples/            # Code examples
├── QUICKSTART.md        # 5-minute setup
├── API_REFERENCE.md     # API documentation
└── README.md            # This file
```

## Database Schema

### Core Tables
- **users** - User accounts (Firebase UID, email, phone, user type)
- **buyer_profiles** - Buyer-specific data
- **admin_profiles** - Admin-specific data  
- **delivery_addresses** - Buyer delivery addresses
- **phone_otps** - Phone OTP verification
- **email_otps** - Email OTP verification
- **user_sessions** - Session tracking

See [docs/reference/database-schema.md](./docs/reference/database-schema.md) for complete schema documentation.

## Configuration

Key configuration in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "IdentityServiceDb": "Host=localhost;Database=realserv_identity;..."
  },
  "Firebase": {
    "ProjectId": "your-firebase-project-id",
    "CredentialsPath": "firebase-admin-sdk.json",
    "ApiKey": "YOUR_FIREBASE_WEB_API_KEY"
  }
}
```

See [docs/reference/configuration.md](./docs/reference/configuration.md) for all configuration options.

## Development

### Prerequisites
- .NET 8.0 SDK
- PostgreSQL 16+
- Docker Desktop (optional)
- Firebase project with credentials

### Run Locally
```bash
# Restore packages
dotnet restore

# Run migrations
dotnet ef database update

# Start service
dotnet run

# Run tests
dotnet test
```

### Docker
```bash
# Build image
docker build -t realserv/identity-service .

# Run container
docker run -p 5001:8080 realserv/identity-service
```

## Testing

```bash
# Health check
curl http://localhost:5001/api/v1/health

# Signup (returns Firebase tokens)
curl -X POST http://localhost:5001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "fullName": "Test User",
    "userType": 0
  }'

# Protected endpoint (requires Firebase ID token)
curl http://localhost:5001/api/v1/auth/me \
  -H "Authorization: Bearer {FIREBASE_ID_TOKEN}"
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## Support & Documentation

- **Issues**: Report bugs and request features
- **Documentation**: [Complete documentation](./docs/)
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Examples**: [examples/](./examples/)

## License

Proprietary - Vendara © 2026

---

**Service Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Status:** Production Ready  
**Maintainer:** Vendara Backend Team
