#!/bin/bash

# =====================================================
# Catalog Service - Database Migration Script
# =====================================================
# Run this script to create the database schema and seed data
# =====================================================

set -e  # Exit on error

echo "=========================================="
echo "Catalog Service - Database Migration"
echo "=========================================="
echo ""

# Configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-realserv_catalog_db}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is accessible
echo "Checking PostgreSQL connection..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw postgres; then
    echo "✅ PostgreSQL is accessible"
else
    echo "❌ Cannot connect to PostgreSQL"
    echo "   Please ensure PostgreSQL is running and credentials are correct"
    exit 1
fi

# Create database if it doesn't exist
echo ""
echo "Creating database (if not exists)..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME"
echo "✅ Database ready: $DB_NAME"

# Run migration
echo ""
echo "Running migration script..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 001_InitialCreate.sql

# Verify tables created
echo ""
echo "Verifying tables..."
TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")
echo "✅ Tables created: $TABLE_COUNT"

# Verify seed data
echo ""
echo "Verifying seed data..."
MATERIAL_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM materials")
LABOR_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM labor_categories")
CATEGORY_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM categories")

echo "✅ Categories: $CATEGORY_COUNT (expected: 10)"
echo "✅ Materials: $MATERIAL_COUNT (expected: 11)"
echo "✅ Labor Services: $LABOR_COUNT (expected: 6)"

# Summary
echo ""
echo "=========================================="
echo "Migration Complete! ✅"
echo "=========================================="
echo ""
echo "Database: $DB_NAME"
echo "Tables: $TABLE_COUNT"
echo "Categories: $CATEGORY_COUNT"
echo "Materials: $MATERIAL_COUNT"
echo "Labor Services: $LABOR_COUNT"
echo ""
echo "Next Steps:"
echo "  1. Start the Catalog Service: cd .. && dotnet run"
echo "  2. Test health: curl http://localhost:5000/health"
echo "  3. Test API: curl http://localhost:5000/api/v1/materials"
echo ""
