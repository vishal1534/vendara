# Scripts

Utility scripts for development, deployment, and maintenance.

## Structure

```
scripts/
├── setup/          # Initial setup scripts
├── deploy/         # Deployment scripts
├── migrations/     # Database migration scripts
├── seeds/          # Database seed scripts
└── monitoring/     # Health check and monitoring scripts
```

## Setup Scripts

### init-databases.sh

Initialize all PostgreSQL databases for local development.

```bash
./scripts/setup/init-databases.sh
```

### seed-data.sh

Seed initial data (categories, test users, etc.).

```bash
./scripts/setup/seed-data.sh
```

### setup-aws.sh

Set up AWS resources using Terraform.

```bash
./scripts/setup/setup-aws.sh dev
```

## Deployment Scripts

### deploy-dev.sh

Deploy all services to development environment.

```bash
./scripts/deploy/deploy-dev.sh
```

### deploy-staging.sh

Deploy all services to staging environment.

```bash
./scripts/deploy/deploy-staging.sh
```

### deploy-production.sh

Deploy all services to production environment (requires confirmation).

```bash
./scripts/deploy/deploy-production.sh
```

### deploy-service.sh

Deploy a specific service.

```bash
./scripts/deploy/deploy-service.sh UserManagementService dev
```

## Migration Scripts

### run-migrations.sh

Run database migrations for all services.

```bash
./scripts/migrations/run-migrations.sh
```

### rollback-migration.sh

Rollback last migration for a service.

```bash
./scripts/migrations/rollback-migration.sh UserManagementService
```

### generate-migration.sh

Generate a new migration for a service.

```bash
./scripts/migrations/generate-migration.sh UserManagementService AddUserPhoneNumber
```

## Seed Scripts

Located in `scripts/seeds/`:
- `users.sql` - Sample users
- `catalog.sql` - Material and labor categories
- `service-areas.sql` - Default service areas

## Monitoring Scripts

### check-health.sh

Check health of all services.

```bash
./scripts/monitoring/check-health.sh
```

### check-logs.sh

Tail logs for a specific service.

```bash
./scripts/monitoring/check-logs.sh UserManagementService
```

### backup-databases.sh

Backup all databases to S3.

```bash
./scripts/monitoring/backup-databases.sh
```

## Usage Examples

### Full Local Setup

```bash
# 1. Start Docker containers
docker-compose up -d

# 2. Initialize databases
./scripts/setup/init-databases.sh

# 3. Run migrations
./scripts/migrations/run-migrations.sh

# 4. Seed data
./scripts/setup/seed-data.sh

# 5. Start services
cd src/services/UserManagementService
dotnet run
```

### Deploy New Feature

```bash
# 1. Run tests
dotnet test

# 2. Build services
dotnet build

# 3. Deploy to dev
./scripts/deploy/deploy-dev.sh

# 4. Check health
./scripts/monitoring/check-health.sh

# 5. Check logs
./scripts/monitoring/check-logs.sh UserManagementService
```

## Script Templates

### Bash Script Template

```bash
#!/bin/bash

# Script: script-name.sh
# Purpose: Brief description
# Usage: ./script-name.sh [args]

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Main script logic
main() {
    info "Starting script..."
    
    # Your code here
    
    info "Script completed successfully!"
}

# Run main function
main "$@"
```

## Best Practices

1. **Always check exit codes** - Use `set -e`
2. **Use meaningful variable names**
3. **Add usage documentation** at the top
4. **Validate inputs** before execution
5. **Provide clear error messages**
6. **Log important steps**
7. **Make scripts idempotent** (can run multiple times safely)
8. **Add confirmation prompts** for destructive operations

## Next Steps

1. Create init-databases.sh
2. Create seed-data.sh
3. Create deployment scripts
4. Test all scripts locally
5. Document usage in wiki
