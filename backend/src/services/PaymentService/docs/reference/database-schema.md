---
title: Database Schema Reference - Payment Service
service: Payment Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Database Schema Reference

**Service:** Payment Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Complete database schema documentation for 5 tables with relationships, indexes, and constraints.

---

## Table of Contents

1. [Overview](#overview)
2. [payments](#payments-table)
3. [payment_refunds](#payment_refunds-table)
4. [vendor_settlements](#vendor_settlements-table)
5. [settlement_line_items](#settlement_line_items-table)
6. [payment_webhooks](#payment_webhooks-table)
7. [Relationships](#relationships)
8. [Indexes](#indexes)
9. [Migrations](#migrations)

---

## Overview

**Database:** PostgreSQL 15+  
**Schema:** `public`  
**Total Tables:** 5  
**ORM:** Entity Framework Core 8

### Entity Relationship Diagram

```
┌─────────────────┐
│   payments      │
│  (Main table)   │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
    ┌────▼────────┐  ┌──▼──────────────┐
    │payment_     │  │vendor_          │
    │refunds      │  │settlements      │
    └─────────────┘  └────┬────────────┘
                          │
                     ┌────▼───────────────┐
                     │settlement_         │
                     │line_items          │
                     └────────────────────┘

┌──────────────────┐
│payment_webhooks  │
│  (Audit logs)    │
└──────────────────┘
```

---

## payments Table

Primary table for storing all payment transactions (online and COD).

### Schema

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    buyer_id UUID NOT NULL,
    vendor_id UUID,
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    
    -- Razorpay fields
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(200),
    
    -- Payment details
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(100),
    payment_error_code VARCHAR(50),
    payment_error_message VARCHAR(500),
    
    -- Metadata
    metadata VARCHAR(2000),
    notes VARCHAR(1000),
    
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| order_id | UUID | No | - | Order ID from Order Service |
| buyer_id | UUID | No | - | Buyer's user ID |
| vendor_id | UUID | Yes | NULL | Vendor's user ID |
| amount | NUMERIC(18,2) | No | - | Payment amount |
| currency | VARCHAR(3) | No | 'INR' | Currency code (ISO 4217) |
| payment_method | VARCHAR(50) | No | - | Payment method (online, cod, upi, card) |
| payment_status | VARCHAR(50) | No | 'pending' | Status (pending, success, failed, refunded) |
| razorpay_order_id | VARCHAR(100) | Yes | NULL | Razorpay order ID |
| razorpay_payment_id | VARCHAR(100) | Yes | NULL | Razorpay payment ID |
| razorpay_signature | VARCHAR(200) | Yes | NULL | Razorpay HMAC signature |
| payment_gateway | VARCHAR(50) | Yes | NULL | Gateway name (razorpay) |
| transaction_id | VARCHAR(100) | Yes | NULL | Transaction reference |
| payment_error_code | VARCHAR(50) | Yes | NULL | Error code if failed |
| payment_error_message | VARCHAR(500) | Yes | NULL | Error message if failed |
| metadata | VARCHAR(2000) | Yes | NULL | JSON metadata |
| notes | VARCHAR(1000) | Yes | NULL | Additional notes |
| paid_at | TIMESTAMP | Yes | NULL | Payment completion timestamp |
| created_at | TIMESTAMP | No | NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | No | NOW() | Record update timestamp |

### Enums

#### payment_method
- `online` - Online payment (Razorpay)
- `cod` - Cash on Delivery
- `upi` - UPI payment
- `card` - Credit/Debit card
- `netbanking` - Net banking

#### payment_status
- `pending` - Payment initiated, awaiting completion
- `processing` - Payment being processed
- `success` - Payment successfully completed
- `failed` - Payment failed
- `refunded` - Payment fully refunded
- `partially_refunded` - Payment partially refunded

### Constraints

```sql
-- Primary Key
ALTER TABLE payments ADD CONSTRAINT pk_payments PRIMARY KEY (id);

-- Check Constraints
ALTER TABLE payments ADD CONSTRAINT chk_amount_positive CHECK (amount > 0);
ALTER TABLE payments ADD CONSTRAINT chk_currency_valid CHECK (currency = 'INR');
ALTER TABLE payments ADD CONSTRAINT chk_payment_method_valid 
    CHECK (payment_method IN ('online', 'cod', 'upi', 'card', 'netbanking', 'wallet'));
ALTER TABLE payments ADD CONSTRAINT chk_payment_status_valid 
    CHECK (payment_status IN ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded'));

-- Unique Constraints
ALTER TABLE payments ADD CONSTRAINT uk_payments_razorpay_order_id 
    UNIQUE (razorpay_order_id);
ALTER TABLE payments ADD CONSTRAINT uk_payments_razorpay_payment_id 
    UNIQUE (razorpay_payment_id);
```

### Indexes

```sql
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_buyer_id ON payments(buyer_id);
CREATE INDEX idx_payments_vendor_id ON payments(vendor_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_method ON payments(payment_method);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_paid_at ON payments(paid_at DESC) WHERE paid_at IS NOT NULL;
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;
```

### Example Row

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "order_id": "order-uuid-here",
  "buyer_id": "buyer-uuid-here",
  "vendor_id": "vendor-uuid-here",
  "amount": 5000.00,
  "currency": "INR",
  "payment_method": "online",
  "payment_status": "success",
  "razorpay_order_id": "order_MjH5xQz9X7kLqP",
  "razorpay_payment_id": "pay_MjH5yfRKLPZwHR",
  "razorpay_signature": "9e7f8c6b5a4d3e2f1c0b9a8d7e6f5c4b",
  "payment_gateway": "razorpay",
  "transaction_id": "TXN-2026-0001",
  "metadata": "{\"order_number\": \"ORD-2026-0001\"}",
  "notes": "Payment for construction materials",
  "paid_at": "2026-01-11T10:32:00Z",
  "created_at": "2026-01-11T10:30:00Z",
  "updated_at": "2026-01-11T10:32:00Z"
}
```

---

## payment_refunds Table

Stores refund records for payments.

### Schema

```sql
CREATE TABLE payment_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    refund_reason VARCHAR(500) NOT NULL,
    refund_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    
    -- Razorpay fields
    razorpay_refund_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    
    -- Refund details
    refund_error_code VARCHAR(50),
    refund_error_message VARCHAR(500),
    
    -- Metadata
    notes VARCHAR(1000),
    
    -- Timestamps
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| payment_id | UUID | No | - | Foreign key to payments table |
| amount | NUMERIC(18,2) | No | - | Refund amount |
| currency | VARCHAR(3) | No | 'INR' | Currency code |
| refund_reason | VARCHAR(500) | No | - | Reason for refund |
| refund_status | VARCHAR(50) | No | 'pending' | Status (pending, processed, failed) |
| razorpay_refund_id | VARCHAR(100) | Yes | NULL | Razorpay refund ID |
| razorpay_payment_id | VARCHAR(100) | Yes | NULL | Razorpay payment ID |
| refund_error_code | VARCHAR(50) | Yes | NULL | Error code if failed |
| refund_error_message | VARCHAR(500) | Yes | NULL | Error message if failed |
| notes | VARCHAR(1000) | Yes | NULL | Additional notes |
| processed_at | TIMESTAMP | Yes | NULL | Refund processing timestamp |
| created_at | TIMESTAMP | No | NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | No | NOW() | Record update timestamp |

### Enums

#### refund_status
- `pending` - Refund initiated, awaiting processing
- `processing` - Refund being processed
- `processed` - Refund successfully completed
- `failed` - Refund failed

### Constraints

```sql
ALTER TABLE payment_refunds ADD CONSTRAINT fk_payment_refunds_payment_id 
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE;
ALTER TABLE payment_refunds ADD CONSTRAINT chk_refund_amount_positive CHECK (amount > 0);
ALTER TABLE payment_refunds ADD CONSTRAINT uk_payment_refunds_razorpay_refund_id 
    UNIQUE (razorpay_refund_id);
```

### Indexes

```sql
CREATE INDEX idx_payment_refunds_payment_id ON payment_refunds(payment_id);
CREATE INDEX idx_payment_refunds_status ON payment_refunds(refund_status);
CREATE INDEX idx_payment_refunds_created_at ON payment_refunds(created_at DESC);
```

---

## vendor_settlements Table

Stores vendor settlement records for payment distribution.

### Schema

```sql
CREATE TABLE vendor_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    commission_amount NUMERIC(18, 2) NOT NULL,
    commission_percentage NUMERIC(5, 2) NOT NULL,
    settlement_amount NUMERIC(18, 2) NOT NULL,
    settlement_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    
    -- Settlement details
    transaction_reference VARCHAR(100),
    settlement_error_message VARCHAR(500),
    
    -- Metadata
    notes VARCHAR(1000),
    
    -- Timestamps
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| vendor_id | UUID | No | - | Vendor user ID |
| start_date | TIMESTAMP | No | - | Settlement period start |
| end_date | TIMESTAMP | No | - | Settlement period end |
| total_amount | NUMERIC(18,2) | No | - | Total order amount |
| commission_amount | NUMERIC(18,2) | No | - | RealServ commission |
| commission_percentage | NUMERIC(5,2) | No | - | Commission % (10.0) |
| settlement_amount | NUMERIC(18,2) | No | - | Amount payable to vendor |
| settlement_status | VARCHAR(50) | No | 'pending' | Status |
| transaction_reference | VARCHAR(100) | Yes | NULL | Bank transaction reference |
| settlement_error_message | VARCHAR(500) | Yes | NULL | Error message if failed |
| notes | VARCHAR(1000) | Yes | NULL | Additional notes |
| processed_at | TIMESTAMP | Yes | NULL | Settlement processing timestamp |
| created_at | TIMESTAMP | No | NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | No | NOW() | Record update timestamp |

### Enums

#### settlement_status
- `pending` - Settlement created, awaiting processing
- `processing` - Settlement being processed
- `processed` - Settlement successfully completed
- `failed` - Settlement failed
- `cancelled` - Settlement cancelled

### Constraints

```sql
ALTER TABLE vendor_settlements ADD CONSTRAINT chk_settlement_date_range 
    CHECK (start_date < end_date);
ALTER TABLE vendor_settlements ADD CONSTRAINT chk_settlement_amounts_positive 
    CHECK (total_amount >= 0 AND commission_amount >= 0 AND settlement_amount >= 0);
ALTER TABLE vendor_settlements ADD CONSTRAINT chk_commission_percentage_valid 
    CHECK (commission_percentage >= 0 AND commission_percentage <= 100);
```

### Indexes

```sql
CREATE INDEX idx_vendor_settlements_vendor_id ON vendor_settlements(vendor_id);
CREATE INDEX idx_vendor_settlements_status ON vendor_settlements(settlement_status);
CREATE INDEX idx_vendor_settlements_dates ON vendor_settlements(start_date, end_date);
CREATE INDEX idx_vendor_settlements_created_at ON vendor_settlements(created_at DESC);
```

---

## settlement_line_items Table

Stores individual payment details within a settlement.

### Schema

```sql
CREATE TABLE settlement_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_id UUID NOT NULL REFERENCES vendor_settlements(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payments(id),
    order_id UUID NOT NULL,
    order_amount NUMERIC(18, 2) NOT NULL,
    commission_amount NUMERIC(18, 2) NOT NULL,
    settlement_amount NUMERIC(18, 2) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| settlement_id | UUID | No | - | Foreign key to vendor_settlements |
| payment_id | UUID | No | - | Foreign key to payments |
| order_id | UUID | No | - | Order ID |
| order_amount | NUMERIC(18,2) | No | - | Original order amount |
| commission_amount | NUMERIC(18,2) | No | - | Commission on this order |
| settlement_amount | NUMERIC(18,2) | No | - | Amount for vendor |
| paid_at | TIMESTAMP | No | - | Payment completion date |
| created_at | TIMESTAMP | No | NOW() | Record creation timestamp |

### Constraints

```sql
ALTER TABLE settlement_line_items ADD CONSTRAINT fk_settlement_line_items_settlement_id 
    FOREIGN KEY (settlement_id) REFERENCES vendor_settlements(id) ON DELETE CASCADE;
ALTER TABLE settlement_line_items ADD CONSTRAINT fk_settlement_line_items_payment_id 
    FOREIGN KEY (payment_id) REFERENCES payments(id);
```

### Indexes

```sql
CREATE INDEX idx_settlement_line_items_settlement_id ON settlement_line_items(settlement_id);
CREATE INDEX idx_settlement_line_items_payment_id ON settlement_line_items(payment_id);
```

---

## payment_webhooks Table

Audit log for Razorpay webhook events.

### Schema

```sql
CREATE TABLE payment_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100),
    payment_id UUID REFERENCES payments(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payload TEXT NOT NULL,
    response TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| event | VARCHAR(100) | No | - | Webhook event type |
| razorpay_payment_id | VARCHAR(100) | Yes | NULL | Razorpay payment ID |
| payment_id | UUID | Yes | NULL | Local payment ID |
| status | VARCHAR(50) | No | 'pending' | Processing status |
| payload | TEXT | No | - | Full webhook payload (JSON) |
| response | TEXT | Yes | NULL | Processing response |
| processed_at | TIMESTAMP | Yes | NULL | Processing timestamp |
| created_at | TIMESTAMP | No | NOW() | Record creation timestamp |

### Indexes

```sql
CREATE INDEX idx_payment_webhooks_event ON payment_webhooks(event);
CREATE INDEX idx_payment_webhooks_payment_id ON payment_webhooks(payment_id);
CREATE INDEX idx_payment_webhooks_created_at ON payment_webhooks(created_at DESC);
```

---

## Relationships

### One-to-Many

```
payments (1) ──── (N) payment_refunds
    ON DELETE CASCADE
    
vendor_settlements (1) ──── (N) settlement_line_items
    ON DELETE CASCADE
```

### Many-to-One

```
payment_refunds (N) ──── (1) payments
settlement_line_items (N) ──── (1) payments
settlement_line_items (N) ──── (1) vendor_settlements
payment_webhooks (N) ──── (1) payments
```

---

## Migrations

### Apply Migrations

```bash
# Apply all pending migrations
dotnet ef database update

# Apply specific migration
dotnet ef database update InitialCreate

# Rollback to previous migration
dotnet ef database update PreviousMigrationName
```

### Create New Migration

```bash
dotnet ef migrations add MigrationName
```

### Generate SQL Script

```bash
# Generate SQL for all migrations
dotnet ef migrations script

# Generate SQL for specific range
dotnet ef migrations script FromMigration ToMigration

# Generate idempotent script (safe to run multiple times)
dotnet ef migrations script --idempotent
```

---

## Database Maintenance

### Vacuum Tables

```sql
VACUUM ANALYZE payments;
VACUUM ANALYZE payment_refunds;
VACUUM ANALYZE vendor_settlements;
VACUUM ANALYZE settlement_line_items;
VACUUM ANALYZE payment_webhooks;
```

### Rebuild Indexes

```sql
REINDEX TABLE payments;
REINDEX TABLE payment_refunds;
REINDEX TABLE vendor_settlements;
```

### View Table Sizes

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Need More Help?

- **Configuration:** [configuration.md](./configuration.md)
- **Troubleshooting:** [troubleshooting.md](./troubleshooting.md)
- **API Reference:** [../../API_REFERENCE.md](../../API_REFERENCE.md)

---

**Document Status:** ✅ Complete  
**Total Tables:** 5  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com
