-- =====================================================
-- Catalog Service - Initial Database Schema
-- =====================================================
-- Database: realserv_catalog_db
-- PostgreSQL Version: 16
-- Date: January 11, 2026
-- Migration: 001_InitialCreate
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: categories
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    key VARCHAR(50),
    description VARCHAR(500),
    type INTEGER NOT NULL,  -- 1=Material, 2=Labor
    parent_category_id UUID,
    icon_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_categories_parent_category_id 
        FOREIGN KEY (parent_category_id) 
        REFERENCES categories(id) 
        ON DELETE RESTRICT
);

-- Indexes for categories
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_type_is_active ON categories(type, is_active);
CREATE INDEX idx_categories_parent_category_id ON categories(parent_category_id);

-- =====================================================
-- TABLE: materials
-- =====================================================
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    sku VARCHAR(50),
    base_price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    min_order_quantity DECIMAL(10, 2) DEFAULT 1,
    brand VARCHAR(100),
    specifications VARCHAR(500),
    hsn_code VARCHAR(10),
    gst_percentage DECIMAL(5, 2) DEFAULT 18,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_materials_category_id 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE RESTRICT
);

-- Indexes for materials
CREATE INDEX idx_materials_name ON materials(name);
CREATE INDEX idx_materials_sku ON materials(sku);
CREATE INDEX idx_materials_category_id ON materials(category_id);
CREATE INDEX idx_materials_category_id_is_active ON materials(category_id, is_active);
CREATE INDEX idx_materials_is_active ON materials(is_active);
CREATE INDEX idx_materials_is_popular ON materials(is_popular);
CREATE INDEX idx_materials_brand ON materials(brand);

-- =====================================================
-- TABLE: labor_categories
-- =====================================================
CREATE TABLE IF NOT EXISTS labor_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    base_hourly_rate DECIMAL(10, 2) NOT NULL,
    base_daily_rate DECIMAL(10, 2) NOT NULL,
    skill_level INTEGER NOT NULL,  -- 1=Helper, 2=Skilled, 3=Expert
    minimum_experience_years INTEGER DEFAULT 0,
    certification_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_labor_categories_category_id 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE RESTRICT
);

-- Indexes for labor_categories
CREATE INDEX idx_labor_categories_name ON labor_categories(name);
CREATE INDEX idx_labor_categories_category_id ON labor_categories(category_id);
CREATE INDEX idx_labor_categories_skill_level ON labor_categories(skill_level);
CREATE INDEX idx_labor_categories_category_id_is_active ON labor_categories(category_id, is_active);

-- =====================================================
-- TABLE: vendor_inventories
-- =====================================================
CREATE TABLE IF NOT EXISTS vendor_inventories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL,
    material_id UUID NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    vendor_price DECIMAL(10, 2) NOT NULL,
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    min_order_quantity DECIMAL(10, 2) DEFAULT 1,
    stock_alert_threshold DECIMAL(10, 2) DEFAULT 0,
    lead_time_days INTEGER DEFAULT 0,
    last_restocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_vendor_inventories_material_id 
        FOREIGN KEY (material_id) 
        REFERENCES materials(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT uq_vendor_inventories_vendor_material 
        UNIQUE (vendor_id, material_id)
);

-- Indexes for vendor_inventories
CREATE INDEX idx_vendor_inventories_vendor_id ON vendor_inventories(vendor_id);
CREATE INDEX idx_vendor_inventories_material_id ON vendor_inventories(material_id);
CREATE INDEX idx_vendor_inventories_vendor_id_is_available ON vendor_inventories(vendor_id, is_available);
CREATE INDEX idx_vendor_inventories_material_id_is_available ON vendor_inventories(material_id, is_available);

-- =====================================================
-- TABLE: vendor_labor_availabilities
-- =====================================================
CREATE TABLE IF NOT EXISTS vendor_labor_availabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL,
    labor_category_id UUID NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    available_workers INTEGER DEFAULT 0,
    min_booking_hours INTEGER DEFAULT 4,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_vendor_labor_availabilities_labor_category_id 
        FOREIGN KEY (labor_category_id) 
        REFERENCES labor_categories(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT uq_vendor_labor_availabilities_vendor_labor 
        UNIQUE (vendor_id, labor_category_id)
);

-- Indexes for vendor_labor_availabilities
CREATE INDEX idx_vendor_labor_availabilities_vendor_id ON vendor_labor_availabilities(vendor_id);
CREATE INDEX idx_vendor_labor_availabilities_labor_category_id ON vendor_labor_availabilities(labor_category_id);
CREATE INDEX idx_vendor_labor_availabilities_vendor_id_is_available ON vendor_labor_availabilities(vendor_id, is_available);

-- =====================================================
-- TABLE: price_histories
-- =====================================================
CREATE TABLE IF NOT EXISTS price_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type INTEGER NOT NULL,  -- 1=Material, 2=Labor, 3=VendorInventory, 4=VendorLabor
    item_id UUID NOT NULL,
    item_name VARCHAR(200),
    old_price DECIMAL(10, 2) NOT NULL,
    new_price DECIMAL(10, 2) NOT NULL,
    price_change DECIMAL(10, 2) NOT NULL,
    percentage_change DECIMAL(10, 2),
    price_type VARCHAR(50),  -- BasePrice, VendorPrice, HourlyRate, DailyRate
    changed_by UUID,
    reason VARCHAR(500),
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for price_histories
CREATE INDEX idx_price_histories_item_id ON price_histories(item_id);
CREATE INDEX idx_price_histories_item_type ON price_histories(item_type);
CREATE INDEX idx_price_histories_changed_at_desc ON price_histories(changed_at DESC);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Material Categories
INSERT INTO categories (id, name, key, description, type, icon_url, display_order, is_active) VALUES
    ('11111111-1111-1111-1111-111111111101', 'Cement', 'cement', 'Various types of cement for construction', 1, 'https://cdn.realserv.com/icons/cement.png', 1, TRUE),
    ('11111111-1111-1111-1111-111111111102', 'Bricks', 'bricks', 'Clay bricks and concrete blocks', 1, 'https://cdn.realserv.com/icons/bricks.png', 2, TRUE),
    ('11111111-1111-1111-1111-111111111103', 'Steel & Iron', 'steel-iron', 'TMT bars, angles, channels', 1, 'https://cdn.realserv.com/icons/steel.png', 3, TRUE),
    ('11111111-1111-1111-1111-111111111104', 'Sand & Aggregates', 'sand-aggregates', 'River sand, M-sand, aggregates', 1, 'https://cdn.realserv.com/icons/sand.png', 4, TRUE),
    ('11111111-1111-1111-1111-111111111105', 'Paints & Putty', 'paints-putty', 'Interior and exterior paints', 1, 'https://cdn.realserv.com/icons/paint.png', 5, TRUE);

-- Labor Categories
INSERT INTO categories (id, name, key, description, type, icon_url, display_order, is_active) VALUES
    ('22222222-2222-2222-2222-222222222201', 'Masonry', 'masonry', 'Brick laying and masonry work', 2, 'https://cdn.realserv.com/icons/masonry.png', 1, TRUE),
    ('22222222-2222-2222-2222-222222222202', 'Carpentry', 'carpentry', 'Wood work and carpentry', 2, 'https://cdn.realserv.com/icons/carpentry.png', 2, TRUE),
    ('22222222-2222-2222-2222-222222222203', 'Electrical', 'electrical', 'Electrical installations', 2, 'https://cdn.realserv.com/icons/electrical.png', 3, TRUE),
    ('22222222-2222-2222-2222-222222222204', 'Plumbing', 'plumbing', 'Plumbing and sanitary work', 2, 'https://cdn.realserv.com/icons/plumbing.png', 4, TRUE),
    ('22222222-2222-2222-2222-222222222205', 'Painting', 'painting', 'Interior and exterior painting', 2, 'https://cdn.realserv.com/icons/painting.png', 5, TRUE);

-- Materials
INSERT INTO materials (id, category_id, name, description, sku, base_price, unit, min_order_quantity, brand, specifications, hsn_code, gst_percentage, is_active, is_popular, display_order) VALUES
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'OPC 53 Grade Cement', 'Ordinary Portland Cement 53 Grade for high strength concrete', 'CEM-OPC53-UT', 440.00, 'bag (50kg)', 10, 'UltraTech', '53 Grade, Compressive Strength: 53 MPa', '2523', 28, TRUE, TRUE, 1),
    ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111101', 'PPC Cement', 'Portland Pozzolana Cement for general construction', 'CEM-PPC-ACC', 400.00, 'bag (50kg)', 10, 'ACC', 'PPC Grade, 50kg bag', '2523', 28, TRUE, TRUE, 2),
    ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111102', 'Red Clay Bricks', 'Standard red clay bricks for walls', 'BRK-RED-STD', 8.50, 'piece', 500, 'Local Kiln', 'Size: 9"x4"x3", Class A', '6904', 12, TRUE, TRUE, 3),
    ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111102', 'Fly Ash Bricks', 'Eco-friendly fly ash bricks', 'BRK-FA-ECO', 7.00, 'piece', 500, 'EcoBricks', 'Size: 9"x4"x3"', '6904', 12, TRUE, FALSE, 4),
    ('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111103', 'TMT Bar 12mm', 'Thermo-Mechanically Treated steel bars', 'STL-TMT12-JS', 55.00, 'kg', 100, 'JSW Steel', 'Grade: Fe 500D, 12mm dia', '7214', 18, TRUE, TRUE, 5),
    ('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111103', 'TMT Bar 16mm', 'Thermo-Mechanically Treated steel bars', 'STL-TMT16-JS', 54.50, 'kg', 100, 'JSW Steel', 'Grade: Fe 500D, 16mm dia', '7214', 18, TRUE, TRUE, 6),
    ('33333333-3333-3333-3333-333333333307', '11111111-1111-1111-1111-111111111104', 'River Sand', 'Natural river sand for construction', 'SND-RIV-NAT', 45.00, 'cft', 100, 'Local Supplier', 'Washed and graded', '2505', 5, TRUE, TRUE, 7),
    ('33333333-3333-3333-3333-333333333308', '11111111-1111-1111-1111-111111111104', 'M-Sand (Manufactured)', 'Manufactured sand as river sand alternative', 'SND-MSND-MFG', 40.00, 'cft', 100, 'Local Crusher', 'Graded manufactured sand', '2505', 5, TRUE, TRUE, 8),
    ('33333333-3333-3333-3333-333333333309', '11111111-1111-1111-1111-111111111104', '20mm Aggregates', 'Coarse aggregates for concrete', 'AGG-20MM', 50.00, 'cft', 100, 'Local Crusher', 'Size: 20mm nominal', '2517', 5, TRUE, FALSE, 9),
    ('33333333-3333-3333-3333-333333333310', '11111111-1111-1111-1111-111111111105', 'Emulsion Paint - White', 'Interior emulsion paint', 'PNT-EMU-WHT-AP', 385.00, 'liter', 4, 'Asian Paints', 'Interior, Washable', '3208', 18, TRUE, TRUE, 10),
    ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111105', 'Wall Putty - White', 'Acrylic wall putty', 'PTY-WALL-WHT-BP', 22.00, 'kg', 20, 'Birla Putty', 'White cement based', '3214', 18, TRUE, TRUE, 11);

-- Labor Services
INSERT INTO labor_categories (id, category_id, name, description, base_hourly_rate, base_daily_rate, skill_level, minimum_experience_years, certification_required, is_active, is_popular, display_order) VALUES
    ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', 'Skilled Mason', 'Expert masonry work for residential and commercial projects', 75.00, 600.00, 2, 3, FALSE, TRUE, TRUE, 1),
    ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222201', 'Mason Helper', 'Assistant for masonry work', 40.00, 320.00, 1, 0, FALSE, TRUE, FALSE, 2),
    ('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222202', 'Skilled Carpenter', 'Expert carpentry and woodwork', 80.00, 640.00, 2, 3, FALSE, TRUE, TRUE, 3),
    ('44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222203', 'Licensed Electrician', 'Licensed electrical work', 85.00, 680.00, 2, 5, TRUE, TRUE, TRUE, 4),
    ('44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222204', 'Skilled Plumber', 'Expert plumbing and sanitary work', 80.00, 640.00, 2, 3, FALSE, TRUE, TRUE, 5),
    ('44444444-4444-4444-4444-444444444406', '22222222-2222-2222-2222-222222222205', 'Skilled Painter', 'Interior and exterior painting expert', 70.00, 560.00, 2, 2, FALSE, TRUE, TRUE, 6);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Tables Created: 6
-- Categories: 10 (5 Material + 5 Labor)
-- Materials: 11
-- Labor Services: 6
-- =====================================================
