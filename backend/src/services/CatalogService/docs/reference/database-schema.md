---
title: Database Schema Reference
service: Catalog Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Database Schema Reference - Catalog Service

**Service:** Catalog Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Database:** PostgreSQL 16  
**Version:** 1.0.0

> **Quick Summary:** Complete PostgreSQL schema documentation including 6 tables, relationships, indexes, and sample queries.

---

## Overview

The Catalog Service uses **PostgreSQL 16** with **snake_case** naming convention for all database objects (tables, columns, indexes, constraints).

**Total Tables**: 6  
**Primary Keys**: UUID (Guid in C#)  
**Relationships**: Foreign keys with referential integrity  
**Seed Data**: 27 rows (10 categories, 11 materials, 6 labor services)

---

## Entity Relationship Diagram

```
┌─────────────────┐
│   categories    │ (10 rows: 5 material + 5 labor)
│   (hierarchy)   │
└────────┬────────┘
         │ 1:N
         │
    ┌────┴─────────────┬────────────────┐
    │                  │                │
┌───▼────────┐  ┌──────▼──────────┐   │
│ materials  │  │labor_categories │   │
│ (11 rows)  │  │   (6 rows)      │   │
└────┬───────┘  └────┬────────────┘   │
     │               │                 │
     │ 1:N           │ 1:N             │
     │               │                 │
┌────▼───────────────┐ ┌──────────────▼────────────┐
│vendor_inventories  │ │vendor_labor_availabilities│
│  (vendor-specific) │ │     (vendor-specific)     │
└────────────────────┘ └───────────────────────────┘
         │                          
         │ Referenced by            
┌────────▼────────────┐             
│  price_histories    │             
│  (audit trail)      │             
└─────────────────────┘             
```

---

## Table: `categories`

**Purpose**: Hierarchical category system for materials and labor

### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | NOT NULL | Primary key |
| `name` | varchar(100) | NOT NULL | Category name (e.g., "Cement", "Masonry") |
| `key` | varchar(50) | NULL | Unique identifier for frontend (e.g., "cement", "masonry") |
| `description` | varchar(500) | NULL | Category description |
| `type` | integer | NOT NULL | Category type: 1=Material, 2=Labor |
| `parent_category_id` | uuid | NULL | Parent category for hierarchy (self-referencing FK) |
| `icon_url` | varchar(500) | NULL | Icon URL for UI |
| `display_order` | integer | NOT NULL | Display order in UI |
| `is_active` | boolean | NOT NULL | Is category active? (default: true) |
| `created_at` | timestamp | NOT NULL | Creation timestamp |
| `updated_at` | timestamp | NOT NULL | Last update timestamp |

### Indexes

```sql
PRIMARY KEY (id)
INDEX idx_categories_name (name)
INDEX idx_categories_type (type)
INDEX idx_categories_type_is_active (type, is_active)
FOREIGN KEY (parent_category_id) REFERENCES categories(id)
```

### Sample Data

```sql
-- Material Categories
INSERT INTO categories (id, name, type, display_order, is_active) VALUES
('uuid1', 'Cement', 1, 1, true),
('uuid2', 'Bricks', 1, 2, true),
('uuid3', 'Steel & Iron', 1, 3, true),
('uuid4', 'Sand & Aggregates', 1, 4, true),
('uuid5', 'Paints & Putty', 1, 5, true);

-- Labor Categories
INSERT INTO categories (id, name, type, display_order, is_active) VALUES
('uuid6', 'Masonry', 2, 1, true),
('uuid7', 'Carpentry', 2, 2, true),
('uuid8', 'Electrical', 2, 3, true),
('uuid9', 'Plumbing', 2, 4, true),
('uuid10', 'Painting', 2, 5, true);
```

### Sample Queries

```sql
-- Get all material categories
SELECT * FROM categories WHERE type = 1 AND is_active = true ORDER BY display_order;

-- Get all labor categories
SELECT * FROM categories WHERE type = 2 AND is_active = true ORDER BY display_order;

-- Get category hierarchy (with parent)
SELECT c.id, c.name, c.type, p.name as parent_name
FROM categories c
LEFT JOIN categories p ON c.parent_category_id = p.id
WHERE c.is_active = true;
```

---

## Table: `materials`

**Purpose**: Construction materials catalog with base pricing

### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | NOT NULL | Primary key |
| `category_id` | uuid | NOT NULL | FK to categories table |
| `name` | varchar(200) | NOT NULL | Material name (e.g., "OPC 53 Grade Cement") |
| `description` | varchar(1000) | NULL | Detailed description |
| `sku` | varchar(50) | NULL | SKU or product code (e.g., "CEM-OPC53") |
| `base_price` | decimal(10,2) | NOT NULL | Platform reference price |
| `unit` | varchar(20) | NOT NULL | Unit (bag, kg, ton, piece, cft, sqft) |
| `min_order_quantity` | decimal(10,2) | NOT NULL | Minimum order quantity (default: 1) |
| `max_order_quantity` | decimal(10,2) | NULL | Maximum order quantity (optional) |
| `image_url` | varchar(500) | NULL | Product image URL |
| `brand` | varchar(100) | NULL | Brand name (e.g., "UltraTech", "ACC") |
| `specifications` | varchar(500) | NULL | Technical specifications |
| `hsn_code` | varchar(10) | NULL | HSN code for GST (e.g., "2523" for cement) |
| `gst_percentage` | decimal(5,2) | NOT NULL | GST percentage (default: 18) |
| `is_active` | boolean | NOT NULL | Is material active? (default: true) |
| `display_order` | integer | NOT NULL | Display order in UI |
| `is_popular` | boolean | NOT NULL | Featured/popular material? (default: false) |
| `tags` | text | NULL | JSON array of tags for search |
| `created_at` | timestamp | NOT NULL | Creation timestamp |
| `updated_at` | timestamp | NOT NULL | Last update timestamp |

### Indexes

```sql
PRIMARY KEY (id)
INDEX idx_materials_name (name)
INDEX idx_materials_sku (sku)
INDEX idx_materials_category_id (category_id)
INDEX idx_materials_category_id_is_active (category_id, is_active)
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
```

### Sample Data

```sql
INSERT INTO materials (id, category_id, name, sku, base_price, unit, brand, gst_percentage, is_popular) VALUES
('mat1', 'cement-cat-id', 'OPC 53 Grade Cement', 'CEM-OPC53', 440.00, 'bag (50kg)', 'UltraTech', 28, true),
('mat2', 'cement-cat-id', 'PPC Cement', 'CEM-PPC', 400.00, 'bag (50kg)', 'ACC', 28, true),
('mat3', 'bricks-cat-id', 'Red Clay Bricks', 'BRK-CLAY-RED', 8.50, 'piece', 'Local', 12, true),
('mat4', 'steel-cat-id', 'TMT Bar 12mm', 'STL-TMT12', 55.00, 'kg', 'Tata Tiscon', 18, true);
```

### Sample Queries

```sql
-- Get all materials with category name
SELECT m.*, c.name as category_name
FROM materials m
INNER JOIN categories c ON m.category_id = c.id
WHERE m.is_active = true
ORDER BY m.display_order;

-- Search materials by name
SELECT * FROM materials 
WHERE name ILIKE '%cement%' AND is_active = true;

-- Get popular materials
SELECT * FROM materials 
WHERE is_popular = true AND is_active = true 
ORDER BY display_order LIMIT 10;

-- Get materials by price range
SELECT * FROM materials 
WHERE base_price BETWEEN 100 AND 500 
AND is_active = true
ORDER BY base_price ASC;
```

---

## Table: `labor_categories`

**Purpose**: Skilled labor services with base rates

### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | NOT NULL | Primary key |
| `category_id` | uuid | NOT NULL | FK to categories table |
| `name` | varchar(100) | NOT NULL | Labor service name (e.g., "Skilled Mason") |
| `description` | varchar(500) | NULL | Service description |
| `base_hourly_rate` | decimal(10,2) | NOT NULL | Base hourly rate |
| `base_daily_rate` | decimal(10,2) | NOT NULL | Base daily rate (8 hours) |
| `skill_level` | integer | NOT NULL | Skill level: 1=Helper, 2=Skilled, 3=Expert |
| `icon_url` | varchar(500) | NULL | Icon URL for UI |
| `is_active` | boolean | NOT NULL | Is service active? (default: true) |
| `display_order` | integer | NOT NULL | Display order in UI |
| `is_popular` | boolean | NOT NULL | Featured service? (default: false) |
| `tags` | text | NULL | JSON array of tags |
| `minimum_experience_years` | integer | NULL | Required experience (years) |
| `certification_required` | boolean | NOT NULL | Certification required? (default: false) |
| `created_at` | timestamp | NOT NULL | Creation timestamp |
| `updated_at` | timestamp | NOT NULL | Last update timestamp |

### Indexes

```sql
PRIMARY KEY (id)
INDEX idx_labor_categories_name (name)
INDEX idx_labor_categories_category_id (category_id)
INDEX idx_labor_categories_category_id_is_active (category_id, is_active)
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
```

### Sample Data

```sql
INSERT INTO labor_categories (id, category_id, name, base_hourly_rate, base_daily_rate, skill_level, is_popular) VALUES
('lab1', 'masonry-cat-id', 'Skilled Mason', 75.00, 600.00, 2, true),
('lab2', 'masonry-cat-id', 'Mason Helper', 40.00, 320.00, 1, false),
('lab3', 'carpentry-cat-id', 'Skilled Carpenter', 80.00, 640.00, 2, true),
('lab4', 'electrical-cat-id', 'Electrician', 85.00, 680.00, 2, true),
('lab5', 'plumbing-cat-id', 'Plumber', 80.00, 640.00, 2, true),
('lab6', 'painting-cat-id', 'Painter', 70.00, 560.00, 2, true);
```

### Sample Queries

```sql
-- Get all labor services with category
SELECT lc.*, c.name as category_name
FROM labor_categories lc
INNER JOIN categories c ON lc.category_id = c.id
WHERE lc.is_active = true
ORDER BY lc.display_order;

-- Get labor by skill level
SELECT * FROM labor_categories 
WHERE skill_level = 2 AND is_active = true; -- Skilled workers

-- Get labor by hourly rate range
SELECT * FROM labor_categories 
WHERE base_hourly_rate BETWEEN 50 AND 100 
ORDER BY base_hourly_rate ASC;
```

---

## Table: `vendor_inventories`

**Purpose**: Vendor-specific material inventory with pricing and stock

### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | NOT NULL | Primary key |
| `vendor_id` | uuid | NOT NULL | Vendor ID (from Identity Service) |
| `material_id` | uuid | NOT NULL | FK to materials table |
| `is_available` | boolean | NOT NULL | Is material available from vendor? |
| `vendor_price` | decimal(10,2) | NOT NULL | Vendor-specific price |
| `stock_quantity` | decimal(10,2) | NOT NULL | Current stock quantity |
| `min_order_quantity` | decimal(10,2) | NOT NULL | Vendor's minimum order |
| `max_order_quantity` | decimal(10,2) | NULL | Vendor's maximum order (optional) |
| `stock_alert_threshold` | decimal(10,2) | NULL | Low stock alert threshold |
| `lead_time_days` | integer | NOT NULL | Lead time in days |
| `last_restocked_at` | timestamp | NULL | Last restock timestamp |
| `last_updated` | timestamp | NOT NULL | Last update timestamp |
| `created_at` | timestamp | NOT NULL | Creation timestamp |
| `updated_at` | timestamp | NOT NULL | Last update timestamp |

### Indexes

```sql
PRIMARY KEY (id)
UNIQUE INDEX idx_vendor_inventory_unique (vendor_id, material_id)
INDEX idx_vendor_inventories_vendor_id (vendor_id)
INDEX idx_vendor_inventories_material_id (material_id)
INDEX idx_vendor_inventories_vendor_id_is_available (vendor_id, is_available)
FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
```

### Sample Queries

```sql
-- Get vendor inventory with material details
SELECT vi.*, m.name, m.unit, m.brand
FROM vendor_inventories vi
INNER JOIN materials m ON vi.material_id = m.id
WHERE vi.vendor_id = 'vendor-uuid' AND vi.is_available = true;

-- Get low stock items for vendor
SELECT vi.*, m.name
FROM vendor_inventories vi
INNER JOIN materials m ON vi.material_id = m.id
WHERE vi.vendor_id = 'vendor-uuid' 
AND vi.stock_alert_threshold IS NOT NULL
AND vi.stock_quantity <= vi.stock_alert_threshold;

-- Get all vendors selling a specific material
SELECT vi.vendor_id, vi.vendor_price, vi.stock_quantity, vi.lead_time_days
FROM vendor_inventories vi
WHERE vi.material_id = 'material-uuid' AND vi.is_available = true
ORDER BY vi.vendor_price ASC;
```

---

## Table: `vendor_labor_availabilities`

**Purpose**: Vendor-specific labor service availability and rates

### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | NOT NULL | Primary key |
| `vendor_id` | uuid | NOT NULL | Vendor ID (from Identity Service) |
| `labor_category_id` | uuid | NOT NULL | FK to labor_categories table |
| `is_available` | boolean | NOT NULL | Is labor available from vendor? |
| `hourly_rate` | decimal(10,2) | NOT NULL | Vendor's hourly rate |
| `daily_rate` | decimal(10,2) | NOT NULL | Vendor's daily rate |
| `available_workers` | integer | NOT NULL | Number of workers available |
| `min_booking_hours` | integer | NOT NULL | Minimum booking hours (default: 4) |
| `last_updated` | timestamp | NOT NULL | Last update timestamp |
| `created_at` | timestamp | NOT NULL | Creation timestamp |
| `updated_at` | timestamp | NOT NULL | Last update timestamp |

### Indexes

```sql
PRIMARY KEY (id)
UNIQUE INDEX idx_vendor_labor_unique (vendor_id, labor_category_id)
INDEX idx_vendor_labor_availabilities_vendor_id (vendor_id)
INDEX idx_vendor_labor_availabilities_labor_category_id (labor_category_id)
INDEX idx_vendor_labor_availabilities_vendor_id_is_available (vendor_id, is_available)
FOREIGN KEY (labor_category_id) REFERENCES labor_categories(id) ON DELETE CASCADE
```

### Sample Queries

```sql
-- Get vendor labor availability
SELECT vla.*, lc.name, lc.skill_level
FROM vendor_labor_availabilities vla
INNER JOIN labor_categories lc ON vla.labor_category_id = lc.id
WHERE vla.vendor_id = 'vendor-uuid' AND vla.is_available = true;

-- Get all vendors offering a specific labor service
SELECT vla.vendor_id, vla.hourly_rate, vla.daily_rate, vla.available_workers
FROM vendor_labor_availabilities vla
WHERE vla.labor_category_id = 'labor-uuid' AND vla.is_available = true
ORDER BY vla.hourly_rate ASC;
```

---

## Table: `price_histories`

**Purpose**: Audit trail for all price changes (materials and labor)

### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | NOT NULL | Primary key |
| `item_type` | integer | NOT NULL | Item type: 1=Material, 2=Labor |
| `item_id` | uuid | NOT NULL | Material or LaborCategory ID |
| `item_name` | varchar(200) | NOT NULL | Item name (for quick reference) |
| `old_price` | decimal(10,2) | NOT NULL | Previous price |
| `new_price` | decimal(10,2) | NOT NULL | New price |
| `price_change` | decimal(10,2) | NOT NULL | Price difference (new - old) |
| `percentage_change` | decimal(10,2) | NOT NULL | Percentage change |
| `price_type` | varchar(50) | NOT NULL | Type: BasePrice, VendorPrice, HourlyRate, DailyRate |
| `vendor_id` | uuid | NULL | Vendor ID (if vendor-specific price) |
| `changed_by` | varchar(100) | NULL | User who made the change |
| `change_reason` | varchar(500) | NULL | Reason for price change |
| `changed_at` | timestamp | NOT NULL | When the change occurred |
| `created_at` | timestamp | NOT NULL | Creation timestamp |
| `updated_at` | timestamp | NOT NULL | Last update timestamp |

### Indexes

```sql
PRIMARY KEY (id)
INDEX idx_price_histories_item_id (item_id)
INDEX idx_price_histories_item_type (item_type)
INDEX idx_price_histories_vendor_id (vendor_id)
INDEX idx_price_histories_changed_at (changed_at)
INDEX idx_price_histories_composite (item_type, item_id, changed_at)
```

### Sample Queries

```sql
-- Get price history for a material
SELECT * FROM price_histories
WHERE item_id = 'material-uuid' AND item_type = 1
ORDER BY changed_at DESC;

-- Get recent price changes (last 30 days)
SELECT * FROM price_histories
WHERE changed_at >= NOW() - INTERVAL '30 days'
ORDER BY changed_at DESC;

-- Get price increase percentage > 10%
SELECT * FROM price_histories
WHERE percentage_change > 10
ORDER BY percentage_change DESC;
```

---

## Database Migrations

The Catalog Service uses **Entity Framework Core** migrations for schema management.

**Migration Files Location**: `/Migrations/`

**Current Migrations**:
1. `InitialCreate` - Creates all 6 tables
2. `AddEnhancementFeatures` - Adds price history, stock alerts, additional fields

**Apply Migrations**:
```bash
dotnet ef database update
```

**Create New Migration**:
```bash
dotnet ef migrations add MigrationName
```

---

## Connection String

**Development**:
```
Host=localhost;Database=realserv_catalog_db;Username=postgres;Password=postgres
```

**Production**:
```
Host=prod-rds.amazonaws.com;Database=catalog_db;Username=dbadmin;Password=<secret>
```

---

## Performance Considerations

### Indexes Strategy

**Optimized for**:
- Category filtering (`type`, `is_active`)
- Material search (`name`, `sku`, `category_id`)
- Vendor inventory lookups (`vendor_id`, `material_id`)
- Price history queries (`item_id`, `changed_at`)

### Query Optimization Tips

1. **Use indexes**: Filter by indexed columns (`category_id`, `is_active`)
2. **Avoid N+1**: Use `INNER JOIN` or Entity Framework `.Include()`
3. **Pagination**: Always use `LIMIT` and `OFFSET`
4. **Partial updates**: Update only changed fields

---

## Backup & Maintenance

**Automated Backups**: RDS automated backups (7-day retention)  
**Manual Backup**: `pg_dump` to S3 bucket  
**Maintenance Window**: Sunday 03:00-04:00 UTC

---

**Last Updated**: January 11, 2026  
**Schema Version**: 1.0.0  
**Database**: PostgreSQL 16
