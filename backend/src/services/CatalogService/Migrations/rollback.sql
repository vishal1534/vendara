-- =====================================================
-- Catalog Service - Rollback Migration
-- =====================================================
-- WARNING: This will DELETE ALL TABLES and DATA
-- Use only in development/testing environments
-- =====================================================

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS price_histories CASCADE;
DROP TABLE IF EXISTS vendor_labor_availabilities CASCADE;
DROP TABLE IF EXISTS vendor_inventories CASCADE;
DROP TABLE IF EXISTS labor_categories CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop UUID extension (optional, comment out if used by other apps)
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- =====================================================
-- Rollback Complete
-- =====================================================
-- All tables have been dropped
-- Database is now empty
-- =====================================================

SELECT 'Rollback complete - all tables dropped' AS status;
