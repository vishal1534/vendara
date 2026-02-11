# Development Setup Guide

Complete guide to set up your local development environment for RealServ backend.

## Prerequisites

### Required Software

1. **.NET 8 SDK**
   ```bash
   # Download from: https://dotnet.microsoft.com/download/dotnet/8.0
   
   # Verify installation
   dotnet --version
   # Should output: 8.0.x
   ```

2. **Docker Desktop**
   ```bash
   # Download from: https://www.docker.com/products/docker-desktop
   
   # Verify installation
   docker --version
   docker-compose --version
   ```

3. **Git**
   ```bash
   # Download from: https://git-scm.com/downloads
   
   # Verify installation
   git --version
   ```

4. **IDE** (Choose one)
   - **Visual Studio 2022** (Recommended for Windows)
   - **JetBrains Rider** (Cross-platform, paid)
   - **VS Code** with C# extension (Free, lightweight)

### Optional but Recommended

5. **PostgreSQL Client** (for database access)
   - **pgAdmin**: https://www.pgadmin.org/
   - **DataGrip**: https://www.jetbrains.com/datagrip/
   - **Azure Data Studio**: https://docs.microsoft.com/sql/azure-data-studio/

6. **API Testing Tool**
   - **Postman**: https://www.postman.com/downloads/
   - **Insomnia**: https://insomnia.rest/download
   - **HTTPie**: https://httpie.io/

7. **Redis Client** (for cache inspection)
   - **RedisInsight**: https://redis.com/redis-enterprise/redis-insight/
   - **Redis Commander**: `npm install -g redis-commander`

## Repository Setup

### 1. Clone Repository

```bash
git clone https://github.com/RealServ/realserv-backend.git
cd realserv-backend
```

### 2. Restore NuGet Packages

```bash
# Restore packages for entire solution
dotnet restore

# Or restore for specific service
cd src/services/UserManagementService
dotnet restore
```

## Local Development with Docker

### 1. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, LocalStack
docker-compose up -d postgres-users postgres-vendor postgres-order postgres-payment redis localstack

# Verify services are running
docker-compose ps
```

### 2. Create Environment Variables

Create `.env` file in root:

```bash
# Copy example
cp .env.example .env

# Edit with your values
nano .env
```

`.env` file contents:
```env
# Firebase (Test Environment)
FIREBASE_PROJECT_ID=realserv-mvp-test
GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-sdk-test.json

# Razorpay (Test Mode)
RAZORPAY_TEST_KEY_ID=rzp_test_your_key_id
RAZORPAY_TEST_KEY_SECRET=your_test_secret

# WhatsApp (Test)
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Google Maps API
GOOGLE_MAPS_API_KEY=your_api_key

# AWS (LocalStack for local dev)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:4566
```

### 3. Download Firebase Admin SDK JSON

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `realserv-mvp-test`
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save as `firebase-admin-sdk-test.json` in root directory

**⚠️ IMPORTANT**: Never commit this file to Git (it's in `.gitignore`)

### 4. Initialize Databases

```bash
# Run database initialization script
./scripts/setup/init-databases.sh

# Or manually run migrations for each service
cd src/services/UserManagementService
dotnet ef database update

cd ../VendorService
dotnet ef database update

# Repeat for other services...
```

### 5. Seed Initial Data

```bash
# Run seed script
./scripts/setup/seed-data.sh

# Or run manually via SQL
psql -h localhost -U postgres -d realserv_users_db -f scripts/seeds/users.sql
psql -h localhost -U postgres -d realserv_catalog_db -f scripts/seeds/catalog.sql
```

## Running Services Locally

### Option 1: Run All Services with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Services will be available at:
# User Management Service: http://localhost:5001
# Vendor Service: http://localhost:5002
# Buyer Service: http://localhost:5003
# Order Service: http://localhost:5004
# Catalog Service: http://localhost:5005
# Settlement Service: http://localhost:5006
# Payment Service: http://localhost:5007
# Delivery Service: http://localhost:5008
# Location Service: http://localhost:5009
# Notification Service: http://localhost:5010
# Support Service: http://localhost:5011
# Media Service: http://localhost:5012
# WhatsApp Gateway: http://localhost:5013
```

### Option 2: Run Individual Service (for development)

```bash
# Start infrastructure only
docker-compose up -d postgres-users redis

# Run service from IDE or command line
cd src/services/UserManagementService
dotnet run

# Or with watch (auto-reload on file changes)
dotnet watch run

# Service will start at https://localhost:5001
```

### Option 3: Debug from IDE

**Visual Studio 2022:**
1. Open `RealServ.Backend.sln`
2. Right-click on service project → Set as Startup Project
3. Press F5 to debug

**VS Code:**
1. Open workspace
2. Press F5
3. Select service to debug from dropdown

**Rider:**
1. Open solution
2. Select service from run configurations
3. Click Debug button

## Testing APIs

### Swagger UI

Each service has Swagger UI (Development mode only):

- User Management: http://localhost:5001/swagger
- Order Service: http://localhost:5004/swagger
- Payment Service: http://localhost:5007/swagger

### Postman Collection

1. Import collection: `docs/api/postman/RealServ-Backend.postman_collection.json`
2. Import environment: `docs/api/postman/Local.postman_environment.json`
3. Get Firebase token (see below)
4. Set token in environment variable
5. Start making requests

### Get Firebase Authentication Token

**Option 1: Via Firebase Console**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Get custom token
firebase auth:export --project realserv-mvp-test
```

**Option 2: Via API**
```bash
# Register user
curl -X POST http://localhost:5001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+917906441952",
    "email": "test@example.com",
    "userType": "vendor"
  }'

# Get token from Firebase (using Firebase SDK in your client)
# Or use Firebase REST API
```

**Option 3: Use Test Token**

For local development, you can bypass Firebase auth (disable `[Authorize]` attribute temporarily).

⚠️ **Never deploy to production with auth disabled!**

## Running Tests

### Unit Tests

```bash
# Run all unit tests
dotnet test tests/unit/

# Run specific test project
dotnet test tests/unit/UserManagementService.Tests/

# Run with coverage
dotnet test tests/unit/ --collect:"XPlat Code Coverage"
```

### Integration Tests

```bash
# Ensure Docker is running (tests use Testcontainers)
docker ps

# Run integration tests
dotnet test tests/integration/

# Tests will automatically:
# - Start PostgreSQL container
# - Run migrations
# - Execute tests
# - Clean up containers
```

### E2E Tests

```bash
# Ensure all services are running
docker-compose up -d

# Run E2E tests
dotnet test tests/e2e/
```

## Database Management

### View Databases

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres

# List databases
\l

# Connect to specific database
\c realserv_users_db

# List tables
\dt

# Query data
SELECT * FROM users;
```

### Run Migrations

```bash
# Create new migration
cd src/services/UserManagementService
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName

# Generate SQL script
dotnet ef migrations script > migration.sql
```

### Reset Database

```bash
# Drop and recreate database
cd src/services/UserManagementService
dotnet ef database drop
dotnet ef database update
```

## Common Issues & Solutions

### Issue: Cannot connect to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL container is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres-users

# Check logs
docker-compose logs postgres-users
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port 5432 (PostgreSQL)
lsof -i :5432

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Issue: Firebase authentication failing

**Solution:**
1. Verify `firebase-admin-sdk-test.json` exists
2. Check Firebase project ID in appsettings.json
3. Ensure Firebase Admin SDK is initialized in Program.cs
4. Check token expiry (Firebase tokens expire after 1 hour)

### Issue: EF migrations failing

**Solution:**
```bash
# Clear previous migration
dotnet ef migrations remove

# Recreate migration
dotnet ef migrations add InitialCreate

# Check connection string
echo $ConnectionStrings__DefaultConnection
```

### Issue: Docker out of disk space

**Solution:**
```bash
# Remove unused containers
docker system prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df
```

## Development Workflow

### Daily Workflow

1. **Start infrastructure**
   ```bash
   docker-compose up -d postgres-users redis
   ```

2. **Pull latest changes**
   ```bash
   git pull origin main
   ```

3. **Restore packages** (if dependencies changed)
   ```bash
   dotnet restore
   ```

4. **Run migrations** (if new migrations)
   ```bash
   dotnet ef database update
   ```

5. **Start service**
   ```bash
   dotnet run
   ```

6. **Make changes**

7. **Run tests**
   ```bash
   dotnet test
   ```

8. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push
   ```

### Working on a Feature

1. **Create feature branch**
   ```bash
   git checkout -b feature/user-registration
   ```

2. **Make changes**

3. **Run tests**
   ```bash
   dotnet test
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: implement user registration"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/user-registration
   ```

6. **Create Pull Request on GitHub**

## IDE Configuration

### Visual Studio 2022

1. **Install Extensions:**
   - ReSharper (optional, paid)
   - CodeMaid
   - Git Extensions

2. **Configure Docker:**
   - Tools → Options → Container Tools
   - Enable "Automatically start Docker Desktop"

### VS Code

1. **Install Extensions:**
   ```bash
   code --install-extension ms-dotnettools.csharp
   code --install-extension ms-azuretools.vscode-docker
   code --install-extension eamodio.gitlens
   code --install-extension ms-vscode.vscode-typescript-next
   ```

2. **Configure launch.json:**
   Already included in `.vscode/launch.json`

### Rider

1. **Configure Docker:**
   - File → Settings → Build, Execution, Deployment → Docker
   - Connect to Docker daemon

2. **Enable Hot Reload:**
   - File → Settings → Build, Execution, Deployment → Debugger
   - Enable "Hot Reload"

## Useful Commands

### .NET CLI

```bash
# Create new project
dotnet new webapi -n ServiceName

# Add package
dotnet add package PackageName

# Remove package
dotnet remove package PackageName

# List packages
dotnet list package

# Clean build
dotnet clean

# Build
dotnet build

# Run
dotnet run

# Publish
dotnet publish -c Release
```

### Docker

```bash
# Build image
docker build -t user-management-service .

# Run container
docker run -p 5001:80 user-management-service

# View logs
docker logs <container-id>

# Execute command in container
docker exec -it <container-id> bash

# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)
```

### Git

```bash
# Create branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit
git commit -m "feat: add feature"

# Push
git push origin feature/my-feature

# Pull latest
git pull origin main

# Merge main into feature branch
git checkout feature/my-feature
git merge main

# Rebase
git rebase main
```

## Next Steps

1. ✅ Complete this setup guide
2. ✅ Verify all services start locally
3. ✅ Run all tests
4. ✅ Make a test API call with Postman
5. ✅ Read [Architecture Documentation](docs/backend/backend-architecture-plan.md)
6. ✅ Read [Implementation Plan](docs/backend/implementation-plan.md)
7. ✅ Start implementing your assigned service!

## Need Help?

- **Architecture Questions**: Ask Tech Lead
- **Environment Issues**: Ask DevOps Engineer
- **Business Logic Questions**: Ask Product Manager
- **Slack**: #backend-dev channel
- **Documentation**: Check `/docs` folder

## Additional Resources

- [.NET Documentation](https://docs.microsoft.com/dotnet)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [ASP.NET Core](https://docs.microsoft.com/aspnet/core)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Firebase Admin SDK (.NET)](https://firebase.google.com/docs/admin/setup)
- [Razorpay API Documentation](https://razorpay.com/docs/api)
