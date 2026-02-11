# RealServ RBAC Permission Matrix

**Date**: January 12, 2026  
**Phase**: 6 - RBAC Enforcement  
**Purpose**: Define all permissions and their mapping to endpoints

---

## 🎯 Overview

RealServ uses a **resource:action** permission naming convention. Permissions are checked using the `[RequirePermission]` attribute on controller endpoints.

**Example:**
```csharp
[HttpPost]
[RequirePermission("orders:create")]
public async Task<IActionResult> CreateOrder(...)
```

---

## 👥 User Roles

| Role | Description | Typical Permissions |
|------|-------------|---------------------|
| **SuperAdmin** | Platform administrator | ALL permissions |
| **Admin** | Regional/ops admin | Most permissions except system config |
| **Buyer** | Home builder/customer | orders:*, profile:*, catalog:read |
| **Vendor** | Material/labor vendor | vendor:*, orders:read (own), inventory:* |
| **VendorStaff** | Vendor employee | Limited vendor operations |
| **Support** | Customer support agent | Read-only + dispute management |

---

## 📊 Permission Categories

### 1. Identity & User Management (`users:*`, `roles:*`)
### 2. Orders (`orders:*`)
### 3. Catalog Management (`catalog:*`, `materials:*`, `labor:*`)
### 4. Vendor Management (`vendors:*`, `inventory:*`)
### 5. Payments (`payments:*`, `refunds:*`, `settlements:*`)
### 6. Notifications (`notifications:*`)
### 7. Integration (`media:*`, `location:*`, `whatsapp:*`)
### 8. System (`system:*`, `reports:*`)

---

## 🔐 Complete Permission Matrix

### IdentityService Permissions

#### AuthController
| Endpoint | HTTP Method | Permission | Public? | Notes |
|----------|-------------|------------|---------|-------|
| `/api/v1/auth/register` | POST | None | ✅ Yes | Public registration |
| `/api/v1/auth/login` | POST | None | ✅ Yes | Public login |
| `/api/v1/auth/refresh` | POST | None | ✅ Yes | Refresh token (requires valid refresh token) |
| `/api/v1/auth/logout` | POST | None | 🔒 Auth only | Any authenticated user |
| `/api/v1/auth/verify-email` | POST | None | ✅ Yes | Email verification |
| `/api/v1/auth/forgot-password` | POST | None | ✅ Yes | Password reset request |
| `/api/v1/auth/reset-password` | POST | None | ✅ Yes | Password reset completion |

#### BuyersController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/buyers/profile` | GET | `buyers:read:own` | Buyer (own profile) |
| `PUT /api/v1/buyers/profile` | PUT | `buyers:update:own` | Buyer (own profile) |
| `POST /api/v1/buyers/addresses` | POST | `buyers:update:own` | Buyer (own addresses) |
| `PUT /api/v1/buyers/addresses/{id}` | PUT | `buyers:update:own` | Buyer (own addresses) |
| `DELETE /api/v1/buyers/addresses/{id}` | DELETE | `buyers:update:own` | Buyer (own addresses) |
| `GET /api/v1/buyers/{id}` | GET | `buyers:read` | Admin, Support |
| `GET /api/v1/buyers` | GET | `buyers:list` | Admin, Support |
| `PUT /api/v1/buyers/{id}` | PUT | `buyers:update` | Admin |
| `DELETE /api/v1/buyers/{id}` | DELETE | `buyers:delete` | Admin |

#### RolesController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/roles` | GET | `roles:read` | Admin |
| `POST /api/v1/roles` | POST | `roles:create` | SuperAdmin |
| `PUT /api/v1/roles/{id}` | PUT | `roles:update` | SuperAdmin |
| `DELETE /api/v1/roles/{id}` | DELETE | `roles:delete` | SuperAdmin |
| `GET /api/v1/roles/{id}/permissions` | GET | `roles:read` | Admin |
| `POST /api/v1/roles/{id}/permissions` | POST | `roles:update` | SuperAdmin |

---

### VendorService Permissions

#### VendorsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors` | GET | `vendors:list` | Admin, Support |
| `GET /api/v1/vendors/profile` | GET | `vendors:read:own` | Vendor (own profile) |
| `POST /api/v1/vendors` | POST | `vendors:create` | Admin (or public registration) |
| `GET /api/v1/vendors/{id}` | GET | `vendors:read` | Admin, Support, Buyer |
| `PUT /api/v1/vendors/{id}` | PUT | `vendors:update` OR `vendors:update:own` | Admin OR Vendor (own) |
| `DELETE /api/v1/vendors/{id}` | DELETE | `vendors:delete` | Admin |
| `PUT /api/v1/vendors/{id}/status` | PUT | `vendors:approve` | Admin |
| `PUT /api/v1/vendors/{id}/credit-limit` | PUT | `vendors:manage-credit` | Admin |

#### VendorInventoryController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/inventory` | GET | `inventory:read` OR `inventory:read:own` | Admin OR Vendor (own) |
| `POST /api/v1/vendors/{vendorId}/inventory` | POST | `inventory:create:own` | Vendor (own inventory) |
| `PUT /api/v1/vendors/{vendorId}/inventory/{id}` | PUT | `inventory:update:own` | Vendor (own inventory) |
| `DELETE /api/v1/vendors/{vendorId}/inventory/{id}` | DELETE | `inventory:delete:own` | Vendor (own inventory) |
| `PUT /api/v1/vendors/{vendorId}/inventory/{id}/stock` | PUT | `inventory:update:own` | Vendor (stock updates) |

#### VendorLaborController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/labor` | GET | `labor:read` OR `labor:read:own` | Admin OR Vendor (own) |
| `POST /api/v1/vendors/{vendorId}/labor` | POST | `labor:create:own` | Vendor (own labor) |
| `PUT /api/v1/vendors/{vendorId}/labor/{id}` | PUT | `labor:update:own` | Vendor (own labor) |
| `DELETE /api/v1/vendors/{vendorId}/labor/{id}` | DELETE | `labor:delete:own` | Vendor (own labor) |

#### VendorBankAccountsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/bank-accounts` | GET | `vendors:update:own` | Vendor (own) |
| `POST /api/v1/vendors/{vendorId}/bank-accounts` | POST | `vendors:update:own` | Vendor (own) |
| `PUT /api/v1/vendors/{vendorId}/bank-accounts/{id}` | PUT | `vendors:update:own` | Vendor (own) |
| `DELETE /api/v1/vendors/{vendorId}/bank-accounts/{id}` | DELETE | `vendors:update:own` | Vendor (own) |

#### VendorDocumentsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/documents` | GET | `vendors:read` OR `vendors:read:own` | Admin OR Vendor (own) |
| `POST /api/v1/vendors/{vendorId}/documents` | POST | `vendors:update:own` | Vendor (own) |
| `DELETE /api/v1/vendors/{vendorId}/documents/{id}` | DELETE | `vendors:update:own` | Vendor (own) |
| `PUT /api/v1/vendors/{vendorId}/documents/{id}/verify` | PUT | `vendors:approve` | Admin |

#### VendorServiceAreasController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/service-areas` | GET | None | Public (for search) |
| `POST /api/v1/vendors/{vendorId}/service-areas` | POST | `vendors:update:own` | Vendor (own) |
| `DELETE /api/v1/vendors/{vendorId}/service-areas/{id}` | DELETE | `vendors:update:own` | Vendor (own) |

#### VendorRatingsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/ratings` | GET | None | Public |
| `POST /api/v1/vendors/{vendorId}/ratings` | POST | `orders:rate` | Buyer (after order completion) |

#### VendorStatsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/stats` | GET | `vendors:read` OR `vendors:read:own` | Admin OR Vendor (own) |

#### VendorBusinessHoursController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/business-hours` | GET | None | Public |
| `PUT /api/v1/vendors/{vendorId}/business-hours` | PUT | `vendors:update:own` | Vendor (own) |

---

### OrderService Permissions

#### OrdersController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/orders` | GET | `orders:list` | Admin, Support |
| `POST /api/v1/orders` | POST | `orders:create` | Buyer |
| `GET /api/v1/orders/{id}` | GET | `orders:read` OR `orders:read:own` | Admin OR Buyer/Vendor (own) |
| `PUT /api/v1/orders/{id}` | PUT | `orders:update` | Admin |
| `DELETE /api/v1/orders/{id}` | DELETE | `orders:delete` | Admin |
| `PUT /api/v1/orders/{id}/cancel` | PUT | `orders:cancel:own` | Buyer (own order, within time limit) |

#### CustomerOrdersController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/customers/{customerId}/orders` | GET | `orders:read:own` | Buyer (own orders) |
| `GET /api/v1/customers/{customerId}/orders/{orderId}` | GET | `orders:read:own` | Buyer (own order) |

#### VendorOrdersController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/orders` | GET | `orders:read:own` | Vendor (assigned orders) |
| `PUT /api/v1/vendors/{vendorId}/orders/{orderId}/accept` | PUT | `orders:accept` | Vendor |
| `PUT /api/v1/vendors/{vendorId}/orders/{orderId}/reject` | PUT | `orders:reject` | Vendor |
| `PUT /api/v1/vendors/{vendorId}/orders/{orderId}/status` | PUT | `orders:update-status` | Vendor |

#### DisputesController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/orders/{orderId}/disputes` | GET | `disputes:read` OR `disputes:read:own` | Admin/Support OR Buyer/Vendor (own) |
| `POST /api/v1/orders/{orderId}/disputes` | POST | `disputes:create` | Buyer, Vendor |
| `PUT /api/v1/disputes/{id}/resolve` | PUT | `disputes:resolve` | Admin, Support |

#### OrderIssuesController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/orders/{orderId}/issues` | GET | `orders:read:own` | Buyer/Vendor (own order) |
| `POST /api/v1/orders/{orderId}/issues` | POST | `orders:report-issue` | Buyer, Vendor |
| `PUT /api/v1/issues/{id}/resolve` | PUT | `orders:resolve-issue` | Vendor, Support |

#### OrderReportsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/orders/reports/summary` | GET | `reports:orders` | Admin |
| `GET /api/v1/orders/reports/vendor-performance` | GET | `reports:vendors` | Admin |

#### DeliveryAddressesController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/delivery-addresses` | GET | `buyers:read:own` | Buyer (own addresses) |
| `POST /api/v1/delivery-addresses` | POST | `buyers:update:own` | Buyer |
| `PUT /api/v1/delivery-addresses/{id}` | PUT | `buyers:update:own` | Buyer |
| `DELETE /api/v1/delivery-addresses/{id}` | DELETE | `buyers:update:own` | Buyer |

---

### CatalogService Permissions

#### CategoriesController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/categories` | GET | None | Public |
| `GET /api/v1/categories/{id}` | GET | None | Public |
| `POST /api/v1/categories` | POST | `catalog:manage` | Admin |
| `PUT /api/v1/categories/{id}` | PUT | `catalog:manage` | Admin |
| `DELETE /api/v1/categories/{id}` | DELETE | `catalog:manage` | Admin |

#### MaterialsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/materials` | GET | None | Public |
| `GET /api/v1/materials/{id}` | GET | None | Public |
| `POST /api/v1/materials` | POST | `catalog:manage` | Admin |
| `PUT /api/v1/materials/{id}` | PUT | `catalog:manage` | Admin |
| `DELETE /api/v1/materials/{id}` | DELETE | `catalog:manage` | Admin |
| `PUT /api/v1/materials/{id}/activate` | PUT | `catalog:manage` | Admin |
| `PUT /api/v1/materials/{id}/deactivate` | PUT | `catalog:manage` | Admin |

#### LaborCategoriesController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/labor-categories` | GET | None | Public |
| `GET /api/v1/labor-categories/{id}` | GET | None | Public |
| `POST /api/v1/labor-categories` | POST | `catalog:manage` | Admin |
| `PUT /api/v1/labor-categories/{id}` | PUT | `catalog:manage` | Admin |
| `DELETE /api/v1/labor-categories/{id}` | DELETE | `catalog:manage` | Admin |

#### SearchController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/search/materials` | GET | None | Public |
| `GET /api/v1/search/labor` | GET | None | Public |
| `POST /api/v1/search/advanced` | POST | None | Public |

#### VendorInventoryController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/catalog` | GET | None | Public (available inventory) |

#### VendorLaborController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/vendors/{vendorId}/labor-catalog` | GET | None | Public (available labor) |

#### CatalogStatsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/catalog/stats` | GET | `catalog:stats` | Admin |

#### BulkOperationsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `POST /api/v1/bulk/materials/import` | POST | `catalog:manage` | Admin |
| `POST /api/v1/bulk/materials/update-prices` | POST | `catalog:manage` | Admin |

---

### PaymentService Permissions

#### PaymentsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/payments` | GET | `payments:list` | Admin |
| `POST /api/v1/payments` | POST | `payments:create` | Buyer (for own orders) |
| `GET /api/v1/payments/{id}` | GET | `payments:read` OR `payments:read:own` | Admin OR Buyer/Vendor (own) |
| `GET /api/v1/orders/{orderId}/payments` | GET | `payments:read:own` | Buyer, Vendor (own order) |
| `PUT /api/v1/payments/{id}/verify` | PUT | Internal | System only (webhook) |

#### RefundsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/refunds` | GET | `refunds:list` | Admin |
| `POST /api/v1/refunds` | POST | `refunds:create` | Admin, Support |
| `GET /api/v1/refunds/{id}` | GET | `refunds:read` OR `refunds:read:own` | Admin OR Buyer (own) |
| `GET /api/v1/payments/{paymentId}/refunds` | GET | `refunds:read:own` | Buyer (own payment) |

#### SettlementsController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/settlements` | GET | `settlements:list` | Admin |
| `GET /api/v1/vendors/{vendorId}/settlements` | GET | `settlements:read:own` | Vendor (own settlements) |
| `POST /api/v1/settlements` | POST | `settlements:create` | Admin (manual settlement) |
| `PUT /api/v1/settlements/{id}/process` | PUT | `settlements:process` | Admin |

#### WebhooksController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `POST /api/v1/webhooks/razorpay` | POST | None | Public (Razorpay signature validated) |

---

### NotificationService Permissions

#### NotificationController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `POST /api/v1/notifications/send` | POST | `notifications:send` | Internal services only |
| `POST /api/v1/notifications/whatsapp` | POST | `notifications:send` | Internal services only |
| `POST /api/v1/notifications/email` | POST | `notifications:send` | Internal services only |
| `GET /api/v1/users/{userId}/notifications` | GET | `notifications:read:own` | User (own notifications) |
| `PUT /api/v1/notifications/{id}/read` | PUT | `notifications:read:own` | User (own notification) |

#### TemplateController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/templates` | GET | `templates:read` | Admin |
| `POST /api/v1/templates` | POST | `templates:manage` | Admin |
| `PUT /api/v1/templates/{id}` | PUT | `templates:manage` | Admin |
| `DELETE /api/v1/templates/{id}` | DELETE | `templates:manage` | Admin |

#### PreferenceController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/users/{userId}/preferences` | GET | `notifications:read:own` | User (own preferences) |
| `PUT /api/v1/users/{userId}/preferences` | PUT | `notifications:update:own` | User (own preferences) |

---

### IntegrationService Permissions

#### MediaController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `POST /api/v1/media/upload` | POST | `media:upload` | Buyer, Vendor (authenticated) |
| `DELETE /api/v1/media/{id}` | DELETE | `media:delete:own` | User (own media) OR Admin |
| `GET /api/v1/media/{id}` | GET | None | Public (if not sensitive) |

#### LocationController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `GET /api/v1/location/geocode` | GET | `location:search` | Buyer, Vendor |
| `GET /api/v1/location/reverse-geocode` | GET | `location:search` | Buyer, Vendor |
| `GET /api/v1/location/pincodes/search` | GET | None | Public |

#### WhatsAppController
| Endpoint | HTTP Method | Permission | Who Can Access |
|----------|-------------|------------|----------------|
| `POST /api/v1/whatsapp/send` | POST | Internal | Internal services only |
| `GET /api/v1/whatsapp/status/{messageId}` | GET | Internal | Internal services only |

---

## 🎯 Permission Aggregation by Role

### SuperAdmin
```json
{
  "permissions": ["*"]
}
```
**Note:** SuperAdmin has ALL permissions

### Admin
```json
{
  "permissions": [
    "buyers:*",
    "vendors:*",
    "orders:*",
    "catalog:*",
    "payments:*",
    "refunds:*",
    "settlements:*",
    "disputes:*",
    "reports:*",
    "templates:*",
    "roles:read"
  ]
}
```

### Buyer
```json
{
  "permissions": [
    "buyers:read:own",
    "buyers:update:own",
    "orders:create",
    "orders:read:own",
    "orders:cancel:own",
    "orders:rate",
    "orders:report-issue",
    "payments:create",
    "payments:read:own",
    "refunds:read:own",
    "notifications:read:own",
    "notifications:update:own",
    "media:upload",
    "media:delete:own",
    "location:search"
  ]
}
```

### Vendor
```json
{
  "permissions": [
    "vendors:read:own",
    "vendors:update:own",
    "inventory:create:own",
    "inventory:read:own",
    "inventory:update:own",
    "inventory:delete:own",
    "labor:create:own",
    "labor:read:own",
    "labor:update:own",
    "labor:delete:own",
    "orders:read:own",
    "orders:accept",
    "orders:reject",
    "orders:update-status",
    "orders:resolve-issue",
    "payments:read:own",
    "settlements:read:own",
    "disputes:read:own",
    "disputes:create",
    "notifications:read:own",
    "notifications:update:own",
    "media:upload",
    "media:delete:own",
    "location:search"
  ]
}
```

### Support
```json
{
  "permissions": [
    "buyers:read",
    "buyers:list",
    "vendors:read",
    "vendors:list",
    "orders:read",
    "orders:list",
    "disputes:read",
    "disputes:resolve",
    "orders:resolve-issue",
    "refunds:create",
    "refunds:read",
    "payments:read"
  ]
}
```

---

## 📝 Implementation Notes

### Permission Naming Convention

**Format:** `resource:action[:scope]`

- **resource**: The entity being accessed (orders, vendors, payments)
- **action**: The operation (create, read, update, delete, list, manage)
- **scope**: Optional scope (own, all) - defaults to "all" if not specified

**Examples:**
- `orders:create` - Create any order
- `orders:read:own` - Read only own orders
- `vendors:update:own` - Update only own vendor profile
- `catalog:manage` - Full catalog management (CRUD)

### Special Actions

- `manage` - Implies create, read, update, delete
- `list` - Read multiple items (often with filters)
- `approve` - Admin approval action
- `accept`/`reject` - Vendor order actions

### Public Endpoints

Public endpoints (no authentication required):
- Auth endpoints (login, register, password reset)
- Catalog browsing (materials, categories, search)
- Vendor listings and service areas
- Health checks

### Internal-Only Endpoints

Some endpoints are for internal service-to-service communication only:
- Notification sending (`notifications:send`)
- WhatsApp messaging
- Payment verification webhooks

These should use `X-Internal-API-Key` authentication, not user permissions.

---

## 🧪 Testing RBAC

### Test Cases

1. **Unauthorized Access** - User without permission gets 403
2. **Own Resource Access** - Buyer can read own orders, not others
3. **Admin Override** - Admin can access any resource
4. **Public Access** - Unauthenticated users can browse catalog
5. **Cross-Service** - Permission checked via IdentityService

### Example Test

```bash
# Buyer tries to access another buyer's orders (should fail)
curl -H "Authorization: Bearer BUYER_TOKEN" \
  http://localhost:5004/api/v1/customers/OTHER_BUYER_ID/orders

# Expected: 403 Forbidden

# Admin accesses the same endpoint (should succeed)
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5004/api/v1/orders

# Expected: 200 OK
```

---

**Created**: January 12, 2026  
**Next**: Apply `[RequirePermission]` attributes to all controllers
