# Database Schema - Identity Service

**Version:** 1.0  
**Database:** PostgreSQL 16+  
**ORM:** Entity Framework Core 8.0  
**Migration Status:** Production Ready

---

## Table of Contents

- [Overview](#overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Enums](#enums)
- [Base Entities](#base-entities)
- [Core Tables](#core-tables)
- [RBAC Tables](#rbac-tables)
- [Indexes](#indexes)
- [Constraints](#constraints)
- [Seed Data](#seed-data)
- [Migration Guide](#migration-guide)

---

## Overview

The Identity Service database manages **authentication, authorization, and user profiles** for all 3 user types in the RealServ platform:

- **Admin** - Platform administrators with RBAC permissions
- **Vendor** - Material suppliers and labor providers
- **Buyer** - Individual home builders

**Total Tables:** 11
- Core Tables: 7 (users, buyer_profiles, admin_profiles, delivery_addresses, user_sessions, phone_otps, email_otps)
- RBAC Tables: 4 (roles, permissions, role_permissions, user_roles)

**Key Features:**
- ✅ Single Identity Service for all user types (industry best practice)
- ✅ Firebase Authentication integration
- ✅ Role-Based Access Control (RBAC) with 6 roles and 50 permissions
- ✅ Multi-role support (1:N user-to-role mapping)
- ✅ Soft delete on all entities
- ✅ Audit trails (created_by, updated_by)
- ✅ Phone and Email OTP verification
- ✅ Session tracking with device management

---

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o| buyer_profiles : "has one"
    users ||--o| admin_profiles : "has one (deprecated)"
    users ||--o{ user_roles : "has many"
    users ||--o{ user_sessions : "has many"
    
    buyer_profiles ||--o{ delivery_addresses : "has many"
    
    roles ||--o{ user_roles : "has many"
    roles ||--o{ role_permissions : "has many"
    
    permissions ||--o{ role_permissions : "has many"
    
    users {
        uuid id PK
        string firebase_uid UK
        string phone_number UK
        string email
        string full_name
        int user_type "Admin=3, Vendor=2, Buyer=1"
        int status "Active=1, Inactive=2, Suspended=3, Deleted=4"
        timestamptz last_login_at
        string profile_image_url
        boolean email_verified
        boolean phone_verified
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
        uuid created_by
        uuid updated_by
    }
    
    buyer_profiles {
        uuid id PK
        uuid user_id FK_UK
        string business_name
        string preferred_language "default: en"
        boolean is_verified "default: false"
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    delivery_addresses {
        uuid id PK
        uuid buyer_profile_id FK
        string label
        string address_line1
        string address_line2
        string city
        string state
        string pincode
        double latitude
        double longitude
        boolean is_default "default: false"
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    admin_profiles {
        uuid id PK
        uuid user_id FK_UK
        string role "DEPRECATED - use user_roles"
        jsonb permissions "DEPRECATED - use role_permissions"
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    user_sessions {
        uuid id PK
        uuid user_id FK
        string device_id
        string device_type "mobile, web, whatsapp"
        string fcm_token
        timestamptz last_active_at
        boolean is_active "default: true"
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    phone_otps {
        uuid id PK
        string phone_number
        string otp_code
        timestamptz expires_at
        boolean is_verified "default: false"
        int attempt_count "default: 0"
        timestamptz verified_at
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    email_otps {
        uuid id PK
        string email
        string otp_code
        timestamptz expires_at
        boolean is_verified "default: false"
        int attempt_count "default: 0"
        timestamptz verified_at
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    roles {
        uuid id PK
        string name UK "super_admin, operations, support, finance, vendor, buyer"
        string display_name
        string description
        int user_type "Admin=3, Vendor=2, Buyer=1"
        boolean is_active "default: true"
        boolean is_system_role "default: false, prevents deletion"
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
        uuid created_by
        uuid updated_by
    }
    
    permissions {
        uuid id PK
        string name UK "vendors.view, orders.update"
        string display_name
        string description
        string category "vendors, orders, buyers, etc."
        boolean is_active "default: true"
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    role_permissions {
        uuid id PK
        uuid role_id FK
        uuid permission_id FK
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
    
    user_roles {
        uuid id PK
        uuid user_id FK
        uuid role_id FK
        timestamptz assigned_at
        uuid assigned_by "Admin who assigned the role"
        timestamptz created_at
        timestamptz updated_at
        boolean is_deleted
    }
```

---

## Enums

### UserType
**Location:** `/backend/src/shared/Enums/UserType.cs`  
**Database Type:** `integer`

| Value | Name | Description |
|-------|------|-------------|
| 1 | Buyer | Individual home builders who order materials/labor |
| 2 | Vendor | Material suppliers and labor providers |
| 3 | Admin | Platform administrators |

**Usage:**
```sql
SELECT * FROM users WHERE user_type = 1; -- Buyers
SELECT * FROM users WHERE user_type = 2; -- Vendors
SELECT * FROM users WHERE user_type = 3; -- Admins
```

### UserStatus
**Location:** `/backend/src/shared/Enums/UserType.cs`  
**Database Type:** `integer`

| Value | Name | Description |
|-------|------|-------------|
| 1 | Active | Account is active and can use the platform |
| 2 | Inactive | Account is temporarily inactive |
| 3 | Suspended | Account is suspended by admin |
| 4 | Deleted | Account is soft-deleted |

**Usage:**
```sql
SELECT * FROM users WHERE status = 1; -- Active users
SELECT * FROM users WHERE status = 3; -- Suspended users
```

---

## Base Entities

All entities inherit from one of these base classes:

### BaseEntity
**Location:** `/backend/src/shared/Entities/BaseEntity.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Unique identifier (auto-generated GUID) |
| `created_at` | timestamptz | NOT NULL | UTC timestamp when record was created |
| `updated_at` | timestamptz | NULL | UTC timestamp when record was last updated |
| `is_deleted` | boolean | NOT NULL, DEFAULT false | Soft delete flag |

**Tables using BaseEntity:**
- `buyer_profiles`
- `delivery_addresses`
- `admin_profiles`
- `user_sessions`
- `phone_otps`
- `email_otps`
- `permissions`
- `role_permissions`
- `user_roles`

### AuditableEntity
**Location:** `/backend/src/shared/Entities/BaseEntity.cs`  
**Inherits:** `BaseEntity` + audit fields

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `created_by` | uuid | NULL | User ID who created this record |
| `updated_by` | uuid | NULL | User ID who last updated this record |

**Tables using AuditableEntity:**
- `users`
- `roles`

---

## Core Tables

### 1. users

**Purpose:** Core user accounts for all user types (Admin, Vendor, Buyer)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique user identifier |
| `firebase_uid` | varchar(128) | NOT NULL, UNIQUE | - | Firebase Authentication UID |
| `phone_number` | varchar(20) | NOT NULL, UNIQUE | - | Primary phone number |
| `email` | varchar(255) | NULL | - | Email address (optional) |
| `full_name` | varchar(255) | NULL | - | User's full name |
| `user_type` | integer | NOT NULL | - | UserType enum (1=Buyer, 2=Vendor, 3=Admin) |
| `status` | integer | NOT NULL | 1 | UserStatus enum (1=Active, 2=Inactive, 3=Suspended, 4=Deleted) |
| `last_login_at` | timestamptz | NULL | - | Last successful login timestamp |
| `profile_image_url` | varchar(500) | NULL | - | URL to profile image |
| `email_verified` | boolean | NOT NULL | false | Email verification status |
| `phone_verified` | boolean | NOT NULL | false | Phone verification status |
| `created_at` | timestamptz | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |
| `created_by` | uuid | NULL | - | User who created this record |
| `updated_by` | uuid | NULL | - | User who last updated this record |

**Indexes:**
- `idx_users_firebase_uid` (UNIQUE) - Lookup by Firebase UID
- `idx_users_phone_number` (UNIQUE) - Lookup by phone number
- `idx_users_email` - Lookup by email

**Relationships:**
- `buyer_profiles` (1:1) - Has one buyer profile (if UserType = Buyer)
- `admin_profiles` (1:1) - Has one admin profile (if UserType = Admin) [DEPRECATED]
- `user_roles` (1:N) - Has many role assignments
- `user_sessions` (1:N) - Has many active sessions

**Notes:**
- Firebase UID is the primary authentication identifier
- Phone number is required and unique across all users
- Email is optional but indexed for performance
- UserType cannot be changed after creation
- Vendor users do NOT have a vendor profile table (managed in Vendor Service)

---

### 2. buyer_profiles

**Purpose:** Buyer-specific profile data

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique profile identifier |
| `user_id` | uuid | NOT NULL, UNIQUE, FK → users.id | - | Reference to user account |
| `business_name` | varchar(255) | NULL | - | Optional business/project name |
| `preferred_language` | varchar(10) | NULL | 'en' | Language preference (en, hi, te) |
| `is_verified` | boolean | NOT NULL | false | Profile verification status |
| `created_at` | timestamptz | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_buyer_profiles_user_id` (UNIQUE) - One profile per user

**Relationships:**
- `users` (N:1) - Belongs to one user
- `delivery_addresses` (1:N) - Has many delivery addresses

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE DELETE)

**Notes:**
- Created automatically when a user signs up with UserType.Buyer
- `business_name` is optional - many individual builders don't have a business
- Verification is done by admin review of uploaded documents

---

### 3. delivery_addresses

**Purpose:** Delivery addresses for buyer orders

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique address identifier |
| `buyer_profile_id` | uuid | NOT NULL, FK → buyer_profiles.id | - | Reference to buyer profile |
| `label` | varchar(100) | NOT NULL | - | Address label (e.g., "Home", "Site 1") |
| `address_line1` | varchar(500) | NOT NULL | - | Street address line 1 |
| `address_line2` | varchar(500) | NULL | - | Street address line 2 (optional) |
| `city` | varchar(100) | NOT NULL | - | City name |
| `state` | varchar(100) | NOT NULL | - | State name |
| `pincode` | varchar(10) | NOT NULL | - | Postal code |
| `latitude` | double precision | NULL | - | GPS latitude (for delivery routing) |
| `longitude` | double precision | NULL | - | GPS longitude (for delivery routing) |
| `is_default` | boolean | NOT NULL | false | Default address for orders |
| `created_at` | timestamptz | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_delivery_addresses_buyer_profile_id` - Lookup addresses by buyer

**Relationships:**
- `buyer_profiles` (N:1) - Belongs to one buyer profile

**Foreign Keys:**
- `buyer_profile_id` → `buyer_profiles.id` (CASCADE DELETE)

**Notes:**
- Buyers can have multiple delivery addresses (construction sites)
- Only one address can be marked as `is_default = true` per buyer
- Lat/long coordinates are used for delivery fee calculation and routing
- Application logic should ensure only one default address per buyer

---

### 4. admin_profiles

**⚠️ DEPRECATED - Use `user_roles` with RBAC instead**

**Purpose:** Admin-specific profile data (kept for backward compatibility)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique profile identifier |
| `user_id` | uuid | NOT NULL, UNIQUE, FK → users.id | - | Reference to user account |
| `role` | varchar(50) | NOT NULL | 'admin' | **DEPRECATED** - Use `user_roles` instead |
| `permissions` | jsonb | NULL | - | **DEPRECATED** - Use `role_permissions` instead |
| `created_at` | timestamptz | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_admin_profiles_user_id` (UNIQUE) - One profile per user

**Relationships:**
- `users` (N:1) - Belongs to one user

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE DELETE)

**Migration Path:**
1. New admin users should be assigned roles via `user_roles` table
2. Existing admin users should be migrated to RBAC
3. `role` and `permissions` fields will be removed in future version
4. Table will be deprecated once all admins are migrated to RBAC

---

### 5. user_sessions

**Purpose:** Track active user sessions across devices

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique session identifier |
| `user_id` | uuid | NOT NULL, FK → users.id | - | Reference to user account |
| `device_id` | varchar(255) | NOT NULL | - | Unique device identifier |
| `device_type` | varchar(50) | NOT NULL | - | Device type (mobile, web, whatsapp) |
| `fcm_token` | varchar(255) | NULL | - | Firebase Cloud Messaging token for push notifications |
| `last_active_at` | timestamptz | NOT NULL | `now()` | Last activity timestamp |
| `is_active` | boolean | NOT NULL | true | Session active status |
| `created_at` | timestamptz | NOT NULL | `now()` | Session creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_user_sessions_user_id` - Lookup sessions by user

**Relationships:**
- `users` (N:1) - Belongs to one user

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE DELETE)

**Notes:**
- Users can have multiple active sessions (e.g., web + mobile)
- `device_type` tracks access channel: 'mobile', 'web', 'whatsapp'
- Vendors accessing via WhatsApp will have `device_type = 'whatsapp'`
- Sessions are invalidated when user logs out or token expires
- FCM tokens are used for push notifications

---

### 6. phone_otps

**Purpose:** Phone OTP codes for authentication and verification

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique OTP record identifier |
| `phone_number` | varchar(20) | NOT NULL | - | Phone number for OTP |
| `otp_code` | varchar(6) | NOT NULL | - | 6-digit OTP code |
| `expires_at` | timestamptz | NOT NULL | - | OTP expiration timestamp (typically +5 minutes) |
| `is_verified` | boolean | NOT NULL | false | OTP verification status |
| `attempt_count` | integer | NOT NULL | 0 | Number of verification attempts |
| `verified_at` | timestamptz | NULL | - | Timestamp when OTP was verified |
| `created_at` | timestamptz | NOT NULL | `now()` | OTP generation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_phone_otps_phone_number` - Lookup OTPs by phone number

**Notes:**
- OTP expires after 5 minutes (configurable)
- Maximum 3 verification attempts before OTP is invalidated
- New OTP request invalidates previous OTP for same phone number
- Verified OTPs are kept for audit trail
- Old OTPs are periodically cleaned up (e.g., delete after 30 days)

**Security:**
- OTP codes should be 6 digits (100000-999999)
- Rate limiting: Max 3 OTP requests per phone per hour
- Brute force protection: Max 3 verification attempts

---

### 7. email_otps

**Purpose:** Email OTP codes for email verification

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique OTP record identifier |
| `email` | varchar(255) | NOT NULL | - | Email address for OTP |
| `otp_code` | varchar(6) | NOT NULL | - | 6-digit OTP code |
| `expires_at` | timestamptz | NOT NULL | - | OTP expiration timestamp (typically +10 minutes) |
| `is_verified` | boolean | NOT NULL | false | OTP verification status |
| `attempt_count` | integer | NOT NULL | 0 | Number of verification attempts |
| `verified_at` | timestamptz | NULL | - | Timestamp when OTP was verified |
| `created_at` | timestamptz | NOT NULL | `now()` | OTP generation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_email_otps_email` - Lookup OTPs by email

**Notes:**
- OTP expires after 10 minutes (configurable, longer than phone OTP)
- Maximum 3 verification attempts before OTP is invalidated
- New OTP request invalidates previous OTP for same email
- Verified OTPs are kept for audit trail
- Old OTPs are periodically cleaned up (e.g., delete after 30 days)

**Security:**
- Same security considerations as phone OTPs
- Rate limiting: Max 3 OTP requests per email per hour
- Brute force protection: Max 3 verification attempts

---

## RBAC Tables

### 8. roles

**Purpose:** Role definitions for RBAC system

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique role identifier |
| `name` | varchar(50) | NOT NULL, UNIQUE | - | Role name (snake_case, e.g., 'super_admin') |
| `display_name` | varchar(100) | NOT NULL | - | Human-readable name (e.g., 'Super Admin') |
| `description` | varchar(255) | NULL | - | Role description |
| `user_type` | integer | NOT NULL | - | UserType enum - restricts role to user type |
| `is_active` | boolean | NOT NULL | true | Role active status |
| `is_system_role` | boolean | NOT NULL | false | System role (cannot be deleted if true) |
| `created_at` | timestamptz | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |
| `created_by` | uuid | NULL | - | User who created this role |
| `updated_by` | uuid | NULL | - | User who last updated this role |

**Indexes:**
- `idx_roles_name` (UNIQUE) - Lookup role by name

**Relationships:**
- `user_roles` (1:N) - Has many user assignments
- `role_permissions` (1:N) - Has many permission assignments

**System Roles (6 total):**

| Name | Display Name | User Type | Description |
|------|--------------|-----------|-------------|
| `super_admin` | Super Admin | Admin | Full system access - all features, no limits |
| `operations` | Operations | Admin | Business operations - vendor/buyer/order management |
| `support` | Support | Admin | Customer support - limited access, ticket management |
| `finance` | Finance | Admin | Financial operations - settlements, payments |
| `vendor` | Vendor | Vendor | Vendor - can access via portal or WhatsApp |
| `buyer` | Buyer | Buyer | Individual home builder |

**Notes:**
- `user_type` enforces role-to-user-type validation (e.g., admin roles can't be assigned to buyers)
- `is_system_role = true` prevents deletion of core roles
- Custom roles can be created by super_admin
- Role names must be unique across all user types

---

### 9. permissions

**Purpose:** Granular permission definitions

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique permission identifier |
| `name` | varchar(50) | NOT NULL, UNIQUE | - | Permission name (e.g., 'vendors.view') |
| `display_name` | varchar(100) | NOT NULL | - | Human-readable name (e.g., 'View Vendors') |
| `description` | varchar(255) | NULL | - | Permission description |
| `category` | varchar(50) | NOT NULL | - | Permission category (e.g., 'vendors', 'orders') |
| `is_active` | boolean | NOT NULL | true | Permission active status |
| `created_at` | timestamptz | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_permissions_name` (UNIQUE) - Lookup permission by name

**Relationships:**
- `role_permissions` (1:N) - Has many role assignments

**Permission Categories:**

| Category | Count | Examples | User Types |
|----------|-------|----------|------------|
| `vendors` | 5 | vendors.view, vendors.approve, vendors.suspend | Admin |
| `buyers` | 4 | buyers.view, buyers.edit, buyers.suspend | Admin |
| `orders` | 5 | orders.view, orders.update, orders.cancel | Admin |
| `catalog` | 4 | catalog.view, catalog.create, catalog.update | Admin |
| `delivery` | 2 | delivery.view, delivery.manage | Admin |
| `settlements` | 3 | settlements.view, settlements.process | Admin |
| `support` | 3 | support.view, support.respond, support.close | Admin |
| `analytics` | 1 | analytics.view | Admin |
| `reports` | 2 | reports.view, reports.export | Admin |
| `system` | 3 | system.logs, system.settings, system.users | Admin |
| `vendor` | 9 | vendor.profile.view, vendor.orders.view | Vendor |
| `buyer` | 7 | buyer.profile.view, buyer.orders.create | Buyer |

**Total Permissions:** 50
- Admin: 39 permissions across 10 categories
- Vendor: 9 permissions
- Buyer: 7 permissions

**Notes:**
- Naming convention: `category.action` (e.g., `vendors.approve`)
- Permissions are fine-grained for maximum flexibility
- New permissions can be added dynamically
- Permissions can be grouped by category for easier management

---

### 10. role_permissions

**Purpose:** Many-to-Many junction table linking roles to permissions

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique mapping identifier |
| `role_id` | uuid | NOT NULL, FK → roles.id | - | Reference to role |
| `permission_id` | uuid | NOT NULL, FK → permissions.id | - | Reference to permission |
| `created_at` | timestamptz | NOT NULL | `now()` | Mapping creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_role_permissions_role_id` - Lookup permissions by role
- `idx_role_permissions_permission_id` - Lookup roles by permission
- `idx_role_permissions_unique` (UNIQUE) - Composite unique on (role_id, permission_id)

**Relationships:**
- `roles` (N:1) - Belongs to one role
- `permissions` (N:1) - Belongs to one permission

**Foreign Keys:**
- `role_id` → `roles.id` (CASCADE DELETE)
- `permission_id` → `permissions.id` (CASCADE DELETE)

**Notes:**
- Composite unique index prevents duplicate role-permission assignments
- Cascade delete: If role or permission is deleted, mapping is also deleted
- Seeded with default role-permission mappings (see RoleSeedData.cs)

**Permission Counts by Role:**

| Role | Permission Count |
|------|------------------|
| super_admin | 50 (all) |
| operations | 23 |
| support | 9 |
| finance | 9 |
| vendor | 9 |
| buyer | 7 |

---

### 11. user_roles

**Purpose:** Many-to-Many junction table linking users to roles (1:N - user can have multiple roles)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique mapping identifier |
| `user_id` | uuid | NOT NULL, FK → users.id | - | Reference to user |
| `role_id` | uuid | NOT NULL, FK → roles.id | - | Reference to role |
| `assigned_at` | timestamptz | NOT NULL | `now()` | Role assignment timestamp |
| `assigned_by` | uuid | NULL | - | Admin user who assigned this role |
| `created_at` | timestamptz | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | timestamptz | NULL | - | Last update timestamp |
| `is_deleted` | boolean | NOT NULL | false | Soft delete flag |

**Indexes:**
- `idx_user_roles_user_id` - Lookup roles by user
- `idx_user_roles_role_id` - Lookup users by role
- `idx_user_roles_unique` (UNIQUE) - Composite unique on (user_id, role_id)

**Relationships:**
- `users` (N:1) - Belongs to one user
- `roles` (N:1) - Belongs to one role

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE DELETE)
- `role_id` → `roles.id` (CASCADE DELETE)

**Notes:**
- **Multi-role support**: A user can have multiple roles (e.g., admin with both 'operations' and 'finance' roles)
- Composite unique index prevents duplicate user-role assignments
- `assigned_by` creates audit trail of who assigned roles
- Auto-assignment: Buyers and vendors get their default role on signup
- Cascade delete: If user or role is deleted, mapping is also deleted

**Role Validation:**
- Application logic enforces `role.user_type == user.user_type`
- Example: Cannot assign 'super_admin' role (UserType.Admin) to a buyer (UserType.Buyer)

---

## Indexes

### Summary

| Table | Index Name | Type | Columns | Purpose |
|-------|------------|------|---------|---------|
| users | idx_users_firebase_uid | UNIQUE | firebase_uid | Firebase auth lookup |
| users | idx_users_phone_number | UNIQUE | phone_number | Phone number uniqueness |
| users | idx_users_email | INDEX | email | Email lookup |
| buyer_profiles | idx_buyer_profiles_user_id | UNIQUE | user_id | One profile per user |
| delivery_addresses | idx_delivery_addresses_buyer_profile_id | INDEX | buyer_profile_id | Address lookup |
| admin_profiles | idx_admin_profiles_user_id | UNIQUE | user_id | One profile per user |
| user_sessions | idx_user_sessions_user_id | INDEX | user_id | Session lookup |
| phone_otps | idx_phone_otps_phone_number | INDEX | phone_number | OTP lookup |
| email_otps | idx_email_otps_email | INDEX | email | OTP lookup |
| roles | idx_roles_name | UNIQUE | name | Role name uniqueness |
| permissions | idx_permissions_name | UNIQUE | name | Permission name uniqueness |
| role_permissions | idx_role_permissions_role_id | INDEX | role_id | Permission lookup by role |
| role_permissions | idx_role_permissions_permission_id | INDEX | permission_id | Role lookup by permission |
| role_permissions | idx_role_permissions_unique | UNIQUE | role_id, permission_id | Prevent duplicates |
| user_roles | idx_user_roles_user_id | INDEX | user_id | Role lookup by user |
| user_roles | idx_user_roles_role_id | INDEX | role_id | User lookup by role |
| user_roles | idx_user_roles_unique | UNIQUE | user_id, role_id | Prevent duplicates |

**Total Indexes:** 17

**Performance Notes:**
- All foreign keys have indexes for join performance
- Unique indexes enforce data integrity
- Composite unique indexes on junction tables prevent duplicate mappings

---

## Constraints

### Primary Keys
All tables use UUID primary keys with default value `gen_random_uuid()`

### Unique Constraints
| Table | Columns | Purpose |
|-------|---------|---------|
| users | firebase_uid | Firebase UID uniqueness |
| users | phone_number | Phone number uniqueness |
| buyer_profiles | user_id | One profile per user |
| admin_profiles | user_id | One profile per user |
| roles | name | Role name uniqueness |
| permissions | name | Permission name uniqueness |
| role_permissions | (role_id, permission_id) | Prevent duplicate mappings |
| user_roles | (user_id, role_id) | Prevent duplicate assignments |

### Foreign Key Constraints
All foreign keys use `ON DELETE CASCADE` to maintain referential integrity:

| Table | Column | References | On Delete |
|-------|--------|------------|-----------|
| buyer_profiles | user_id | users.id | CASCADE |
| delivery_addresses | buyer_profile_id | buyer_profiles.id | CASCADE |
| admin_profiles | user_id | users.id | CASCADE |
| user_sessions | user_id | users.id | CASCADE |
| role_permissions | role_id | roles.id | CASCADE |
| role_permissions | permission_id | permissions.id | CASCADE |
| user_roles | user_id | users.id | CASCADE |
| user_roles | role_id | roles.id | CASCADE |

**Cascade Behavior:**
- Deleting a user → Deletes all buyer_profiles, admin_profiles, user_sessions, user_roles
- Deleting a buyer_profile → Deletes all delivery_addresses
- Deleting a role → Deletes all user_roles and role_permissions
- Deleting a permission → Deletes all role_permissions

### Check Constraints
Currently none. Future considerations:
- `users.user_type` IN (1, 2, 3)
- `users.status` IN (1, 2, 3, 4)
- `phone_otps.attempt_count` <= 3
- `email_otps.attempt_count` <= 3

---

## Seed Data

### Location
`/backend/src/services/IdentityService/Data/Seeds/RoleSeedData.cs`

### Seeded Data

#### Roles (6 total)
```
Admin Roles (4):
  - super_admin (all permissions)
  - operations (23 permissions)
  - support (9 permissions)
  - finance (9 permissions)

Vendor Roles (1):
  - vendor (9 permissions)

Buyer Roles (1):
  - buyer (7 permissions)
```

#### Permissions (50 total)
```
Admin Permissions (39):
  Vendors: 5 permissions
  Buyers: 4 permissions
  Orders: 5 permissions
  Catalog: 4 permissions
  Delivery: 2 permissions
  Settlements: 3 permissions
  Support: 3 permissions
  Analytics: 1 permission
  Reports: 2 permissions
  System: 3 permissions

Vendor Permissions (9):
  Profile: 2 permissions
  Orders: 4 permissions
  Catalog: 2 permissions
  Settlements: 1 permission

Buyer Permissions (7):
  Profile: 2 permissions
  Orders: 3 permissions
  Catalog: 1 permission
  Addresses: 1 permission
```

#### Role-Permission Mappings
All role-permission mappings are seeded based on the RBAC design in `RBAC_SCENARIOS.md`

### Running Seed Data

**Option 1: Automatic (via migrations)**
```bash
dotnet ef database update
```

**Option 2: Manual (via SQL script)**
```bash
# Generate SQL script
dotnet ef migrations script -o migration.sql

# Run script
psql -U postgres -d realserv_identity -f migration.sql
```

**Option 3: Application startup**
Seed data can be applied on application startup via `DbContext` configuration.

---

## Migration Guide

### Initial Migration

```bash
# Navigate to Identity Service directory
cd /backend/src/services/IdentityService

# Create initial migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### Creating New Migrations

```bash
# After modifying entities
dotnet ef migrations add DescriptiveMigrationName

# Review generated migration
# File: Migrations/{timestamp}_DescriptiveMigrationName.cs

# Apply migration
dotnet ef database update
```

### Rollback Migration

```bash
# Rollback to specific migration
dotnet ef database update PreviousMigrationName

# Rollback all migrations
dotnet ef database update 0

# Remove last migration (if not applied)
dotnet ef migrations remove
```

### Production Migrations

**Best Practices:**

1. **Never auto-migrate in production**
   ```csharp
   // DON'T DO THIS in production
   await dbContext.Database.MigrateAsync();
   ```

2. **Generate SQL scripts for review**
   ```bash
   dotnet ef migrations script --idempotent -o migration.sql
   ```

3. **Apply via database migration tool** (e.g., Flyway, Liquibase, or manual SQL)

4. **Backup database before migration**
   ```bash
   pg_dump -U postgres realserv_identity > backup.sql
   ```

5. **Test migrations in staging first**

---

## Database Maintenance

### Cleanup Tasks

#### 1. Old OTP Records
**Frequency:** Daily  
**Query:**
```sql
-- Delete OTPs older than 30 days
DELETE FROM phone_otps WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM email_otps WHERE created_at < NOW() - INTERVAL '30 days';
```

#### 2. Inactive Sessions
**Frequency:** Weekly  
**Query:**
```sql
-- Mark sessions inactive if no activity for 30 days
UPDATE user_sessions 
SET is_active = false 
WHERE last_active_at < NOW() - INTERVAL '30 days' 
  AND is_active = true;

-- Delete inactive sessions older than 90 days
DELETE FROM user_sessions 
WHERE is_active = false 
  AND updated_at < NOW() - INTERVAL '90 days';
```

#### 3. Soft-Deleted Records
**Frequency:** Monthly  
**Query:**
```sql
-- Hard delete soft-deleted records older than 90 days
DELETE FROM delivery_addresses 
WHERE is_deleted = true 
  AND updated_at < NOW() - INTERVAL '90 days';

-- Repeat for other tables as needed
```

### Performance Monitoring

#### Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;
```

#### Table Sizes
```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Slow Queries
Enable and monitor `pg_stat_statements` extension:
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

---

## Database Backup & Recovery

### Backup Strategy

**1. Automated Daily Backups**
```bash
# Via cron job
0 2 * * * pg_dump -U postgres realserv_identity | gzip > /backups/identity_$(date +\%Y\%m\%d).sql.gz
```

**2. Point-in-Time Recovery**
- Enable WAL archiving in PostgreSQL
- Configure continuous archiving
- Retain WAL files for 7 days

**3. Pre-Migration Backups**
```bash
pg_dump -U postgres realserv_identity > pre_migration_backup.sql
```

### Recovery

**Full Database Restore:**
```bash
# Drop existing database
dropdb -U postgres realserv_identity

# Create new database
createdb -U postgres realserv_identity

# Restore from backup
gunzip -c backup.sql.gz | psql -U postgres realserv_identity
```

**Table-Level Restore:**
```bash
# Extract specific table from backup
pg_restore -U postgres -d realserv_identity -t users backup.dump
```

---

## Security Considerations

### Sensitive Data

| Table | Column | Protection |
|-------|--------|------------|
| users | phone_number | PII - encrypt in transit, consider hashing |
| users | email | PII - encrypt in transit |
| users | firebase_uid | Sensitive - never expose in logs |
| phone_otps | otp_code | Sensitive - expire after 5 minutes |
| email_otps | otp_code | Sensitive - expire after 10 minutes |

### Access Control

**Row-Level Security (RLS):**
Not currently implemented, but consider for:
- Users can only view/edit their own data
- Admins can view all data based on permissions
- Vendors can only view their own orders

**Database User Permissions:**
```sql
-- Application user (least privilege)
CREATE USER realserv_identity_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE realserv_identity TO realserv_identity_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO realserv_identity_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO realserv_identity_app;

-- Read-only user (for reporting)
CREATE USER realserv_identity_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE realserv_identity TO realserv_identity_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO realserv_identity_readonly;
```

### Audit Trail

All tables with `AuditableEntity` have:
- `created_by` - Track who created the record
- `updated_by` - Track who modified the record
- `created_at` / `updated_at` - Track when changes occurred

Additional audit logging should be implemented at application level for:
- Failed login attempts
- Password reset requests
- Role/permission changes
- Admin actions (suspend user, approve vendor, etc.)

---

## Connection Strings

### Development
```
Host=localhost;Port=5432;Database=realserv_identity;Username=postgres;Password=postgres;Include Error Detail=true
```

### Production
```
Host=prod-db.example.com;Port=5432;Database=realserv_identity;Username=realserv_identity_app;Password=***;SSL Mode=Require;Trust Server Certificate=true
```

### Environment Variables
```bash
export IDENTITY_DB_HOST=localhost
export IDENTITY_DB_PORT=5432
export IDENTITY_DB_NAME=realserv_identity
export IDENTITY_DB_USER=postgres
export IDENTITY_DB_PASSWORD=postgres
```

---

## Version History

| Version | Date | Changes | Migration |
|---------|------|---------|-----------|
| 1.0 | 2026-01-11 | Initial schema with RBAC | InitialCreate |

---

## References

- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RBAC Scenarios](../RBAC_SCENARIOS.md)
- [API Reference](../../API_REFERENCE.md)
- [Seed Data](../../Data/Seeds/RoleSeedData.cs)

---

## Support

For schema-related questions or issues:
1. Check [Troubleshooting Guide](./troubleshooting.md)
2. Review [Error Codes](./error-codes.md)
3. Consult [API Reference](../../API_REFERENCE.md)
4. Contact: backend-team@realserv.com
