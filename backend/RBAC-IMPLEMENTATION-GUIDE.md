# RBAC Implementation Guide

**Date**: January 12, 2026  
**Phase**: 6 - RBAC Enforcement  
**Purpose**: Apply `[RequirePermission]` to all protected endpoints

---

## 🎯 Quick Start

### Step 1: Add Using Statement

```csharp
using RealServ.Shared.Observability.Authorization;
```

### Step 2: Apply Attribute to Controller Methods

```csharp
[HttpPost]
[RequirePermission("orders:create")]
public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
{
    // Only users with "orders:create" permission can access
    return Ok();
}
```

### Step 3: Handle "Own Resource" Access

For endpoints where users can only access their own resources:

```csharp
[HttpGet("customers/{customerId}/orders")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetCustomerOrders(Guid customerId)
{
    // Get current user ID from JWT
    var currentUserId = User.FindFirst("sub")?.Value;
    
    // Verify the user is accessing their own resources
    if (customerId.ToString() != currentUserId)
    {
        return Forbid(); // 403 Forbidden
    }
    
    // User is accessing their own orders
    var orders = await _orderService.GetOrdersByCustomerId(customerId);
    return Ok(orders);
}
```

---

## 📋 Implementation Checklist

### IdentityService

#### ✅ AuthController
- [x] `/register` - Public (no permission)
- [x] `/login` - Public (no permission)
- [x] `/refresh` - Public (no permission)
- [x] `/logout` - Authenticated only (no specific permission)

#### ⏳ BuyersController
- [ ] `GET /buyers/profile` - `[RequirePermission("buyers:read:own")]`
- [ ] `PUT /buyers/profile` - `[RequirePermission("buyers:update:own")]`
- [ ] `POST /buyers/addresses` - `[RequirePermission("buyers:update:own")]`
- [ ] `PUT /buyers/addresses/{id}` - `[RequirePermission("buyers:update:own")]`
- [ ] `DELETE /buyers/addresses/{id}` - `[RequirePermission("buyers:update:own")]`
- [ ] `GET /buyers/{id}` (admin) - `[RequirePermission("buyers:read")]`
- [ ] `GET /buyers` (list) - `[RequirePermission("buyers:list")]`
- [ ] `PUT /buyers/{id}` - `[RequirePermission("buyers:update")]`
- [ ] `DELETE /buyers/{id}` - `[RequirePermission("buyers:delete")]`

#### ⏳ RolesController
- [ ] `GET /roles` - `[RequirePermission("roles:read")]`
- [ ] `POST /roles` - `[RequirePermission("roles:create")]`
- [ ] `PUT /roles/{id}` - `[RequirePermission("roles:update")]`
- [ ] `DELETE /roles/{id}` - `[RequirePermission("roles:delete")]`
- [ ] `GET /roles/{id}/permissions` - `[RequirePermission("roles:read")]`
- [ ] `POST /roles/{id}/permissions` - `[RequirePermission("roles:update")]`

---

### VendorService

#### ⏳ VendorsController
- [ ] `GET /vendors` (list) - `[RequirePermission("vendors:list")]`
- [ ] `GET /vendors/profile` (own) - `[RequirePermission("vendors:read:own")]` + ownership check
- [ ] `POST /vendors` - `[RequirePermission("vendors:create")]` OR public registration
- [ ] `GET /vendors/{id}` - Public or `[RequirePermission("vendors:read")]`
- [ ] `PUT /vendors/{id}` - `[RequirePermission("vendors:update")]` OR `vendors:update:own` + check
- [ ] `DELETE /vendors/{id}` - `[RequirePermission("vendors:delete")]`
- [ ] `PUT /vendors/{id}/status` - `[RequirePermission("vendors:approve")]`
- [ ] `PUT /vendors/{id}/credit-limit` - `[RequirePermission("vendors:manage-credit")]`

#### ⏳ VendorInventoryController
- [ ] `GET /vendors/{vendorId}/inventory` - `[RequirePermission("inventory:read")]` OR `inventory:read:own` + check
- [ ] `POST /vendors/{vendorId}/inventory` - `[RequirePermission("inventory:create:own")]` + ownership check
- [ ] `PUT /vendors/{vendorId}/inventory/{id}` - `[RequirePermission("inventory:update:own")]` + ownership check
- [ ] `DELETE /vendors/{vendorId}/inventory/{id}` - `[RequirePermission("inventory:delete:own")]` + ownership check
- [ ] `PUT /vendors/{vendorId}/inventory/{id}/stock` - `[RequirePermission("inventory:update:own")]` + ownership check

#### ⏳ VendorLaborController
- [ ] `GET /vendors/{vendorId}/labor` - `[RequirePermission("labor:read")]` OR `labor:read:own` + check
- [ ] `POST /vendors/{vendorId}/labor` - `[RequirePermission("labor:create:own")]` + ownership check
- [ ] `PUT /vendors/{vendorId}/labor/{id}` - `[RequirePermission("labor:update:own")]` + ownership check
- [ ] `DELETE /vendors/{vendorId}/labor/{id}` - `[RequirePermission("labor:delete:own")]` + ownership check

#### ⏳ VendorBankAccountsController
- [ ] All endpoints - `[RequirePermission("vendors:update:own")]` + ownership check

#### ⏳ VendorDocumentsController
- [ ] `GET /vendors/{vendorId}/documents` - `[RequirePermission("vendors:read")]` OR `vendors:read:own` + check
- [ ] `POST /vendors/{vendorId}/documents` - `[RequirePermission("vendors:update:own")]` + ownership check
- [ ] `DELETE /vendors/{vendorId}/documents/{id}` - `[RequirePermission("vendors:update:own")]` + ownership check
- [ ] `PUT /vendors/{vendorId}/documents/{id}/verify` - `[RequirePermission("vendors:approve")]`

#### ⏳ VendorServiceAreasController
- [ ] `GET /vendors/{vendorId}/service-areas` - Public
- [ ] `POST /vendors/{vendorId}/service-areas` - `[RequirePermission("vendors:update:own")]` + ownership check
- [ ] `DELETE /vendors/{vendorId}/service-areas/{id}` - `[RequirePermission("vendors:update:own")]` + ownership check

#### ⏳ VendorRatingsController
- [ ] `GET /vendors/{vendorId}/ratings` - Public
- [ ] `POST /vendors/{vendorId}/ratings` - `[RequirePermission("orders:rate")]` + verify completed order

#### ⏳ VendorStatsController
- [ ] `GET /vendors/{vendorId}/stats` - `[RequirePermission("vendors:read")]` OR `vendors:read:own` + check

#### ⏳ VendorBusinessHoursController
- [ ] `GET /vendors/{vendorId}/business-hours` - Public
- [ ] `PUT /vendors/{vendorId}/business-hours` - `[RequirePermission("vendors:update:own")]` + ownership check

---

### OrderService

#### ⏳ OrdersController
- [ ] `GET /orders` (list all) - `[RequirePermission("orders:list")]`
- [ ] `POST /orders` - `[RequirePermission("orders:create")]`
- [ ] `GET /orders/{id}` - `[RequirePermission("orders:read")]` OR `orders:read:own` + check
- [ ] `PUT /orders/{id}` - `[RequirePermission("orders:update")]`
- [ ] `DELETE /orders/{id}` - `[RequirePermission("orders:delete")]`
- [ ] `PUT /orders/{id}/cancel` - `[RequirePermission("orders:cancel:own")]` + ownership + time check

#### ⏳ CustomerOrdersController
- [ ] `GET /customers/{customerId}/orders` - `[RequirePermission("orders:read:own")]` + ownership check
- [ ] `GET /customers/{customerId}/orders/{orderId}` - `[RequirePermission("orders:read:own")]` + ownership check

#### ⏳ VendorOrdersController
- [ ] `GET /vendors/{vendorId}/orders` - `[RequirePermission("orders:read:own")]` + ownership check
- [ ] `PUT /vendors/{vendorId}/orders/{orderId}/accept` - `[RequirePermission("orders:accept")]` + ownership check
- [ ] `PUT /vendors/{vendorId}/orders/{orderId}/reject` - `[RequirePermission("orders:reject")]` + ownership check
- [ ] `PUT /vendors/{vendorId}/orders/{orderId}/status` - `[RequirePermission("orders:update-status")]` + ownership check

#### ⏳ DisputesController
- [ ] `GET /orders/{orderId}/disputes` - `[RequirePermission("disputes:read")]` OR `disputes:read:own` + check
- [ ] `POST /orders/{orderId}/disputes` - `[RequirePermission("disputes:create")]` + verify involved in order
- [ ] `PUT /disputes/{id}/resolve` - `[RequirePermission("disputes:resolve")]`

#### ⏳ OrderIssuesController
- [ ] `GET /orders/{orderId}/issues` - `[RequirePermission("orders:read:own")]` + ownership check
- [ ] `POST /orders/{orderId}/issues` - `[RequirePermission("orders:report-issue")]` + involved check
- [ ] `PUT /issues/{id}/resolve` - `[RequirePermission("orders:resolve-issue")]`

#### ⏳ OrderReportsController
- [ ] `GET /orders/reports/summary` - `[RequirePermission("reports:orders")]`
- [ ] `GET /orders/reports/vendor-performance` - `[RequirePermission("reports:vendors")]`

#### ⏳ DeliveryAddressesController
- [ ] All endpoints - `[RequirePermission("buyers:update:own")]` + ownership check

---

### CatalogService

#### ⏳ CategoriesController
- [ ] `GET /categories` - Public
- [ ] `GET /categories/{id}` - Public
- [ ] `POST /categories` - `[RequirePermission("catalog:manage")]`
- [ ] `PUT /categories/{id}` - `[RequirePermission("catalog:manage")]`
- [ ] `DELETE /categories/{id}` - `[RequirePermission("catalog:manage")]`

#### ⏳ MaterialsController
- [ ] `GET /materials` - Public
- [ ] `GET /materials/{id}` - Public
- [ ] `POST /materials` - `[RequirePermission("catalog:manage")]`
- [ ] `PUT /materials/{id}` - `[RequirePermission("catalog:manage")]`
- [ ] `DELETE /materials/{id}` - `[RequirePermission("catalog:manage")]`
- [ ] `PUT /materials/{id}/activate` - `[RequirePermission("catalog:manage")]`
- [ ] `PUT /materials/{id}/deactivate` - `[RequirePermission("catalog:manage")]`

#### ⏳ LaborCategoriesController
- [ ] `GET /labor-categories` - Public
- [ ] `GET /labor-categories/{id}` - Public
- [ ] `POST /labor-categories` - `[RequirePermission("catalog:manage")]`
- [ ] `PUT /labor-categories/{id}` - `[RequirePermission("catalog:manage")]`
- [ ] `DELETE /labor-categories/{id}` - `[RequirePermission("catalog:manage")]`

#### ⏳ SearchController
- [ ] All endpoints - Public

#### ⏳ VendorInventoryController
- [ ] `GET /vendors/{vendorId}/catalog` - Public

#### ⏳ VendorLaborController  
- [ ] `GET /vendors/{vendorId}/labor-catalog` - Public

#### ⏳ CatalogStatsController
- [ ] `GET /catalog/stats` - `[RequirePermission("catalog:stats")]`

#### ⏳ BulkOperationsController
- [ ] `POST /bulk/materials/import` - `[RequirePermission("catalog:manage")]`
- [ ] `POST /bulk/materials/update-prices` - `[RequirePermission("catalog:manage")]`

---

### PaymentService

#### ⏳ PaymentsController
- [ ] `GET /payments` (list all) - `[RequirePermission("payments:list")]`
- [ ] `POST /payments` - `[RequirePermission("payments:create")]` + ownership check (for own order)
- [ ] `GET /payments/{id}` - `[RequirePermission("payments:read")]` OR `payments:read:own` + check
- [ ] `GET /orders/{orderId}/payments` - `[RequirePermission("payments:read:own")]` + ownership check
- [ ] `PUT /payments/{id}/verify` - Internal only (webhook)

#### ⏳ RefundsController
- [ ] `GET /refunds` (list all) - `[RequirePermission("refunds:list")]`
- [ ] `POST /refunds` - `[RequirePermission("refunds:create")]`
- [ ] `GET /refunds/{id}` - `[RequirePermission("refunds:read")]` OR `refunds:read:own` + check
- [ ] `GET /payments/{paymentId}/refunds` - `[RequirePermission("refunds:read:own")]` + ownership check

#### ⏳ SettlementsController
- [ ] `GET /settlements` (list all) - `[RequirePermission("settlements:list")]`
- [ ] `GET /vendors/{vendorId}/settlements` - `[RequirePermission("settlements:read:own")]` + ownership check
- [ ] `POST /settlements` - `[RequirePermission("settlements:create")]`
- [ ] `PUT /settlements/{id}/process` - `[RequirePermission("settlements:process")]`

#### ⏳ WebhooksController
- [ ] `POST /webhooks/razorpay` - Public (Razorpay signature validation)

---

### NotificationService

#### ⏳ NotificationController
- [ ] `POST /notifications/send` - Internal only (use `X-Internal-API-Key`)
- [ ] `POST /notifications/whatsapp` - Internal only
- [ ] `POST /notifications/email` - Internal only
- [ ] `GET /users/{userId}/notifications` - `[RequirePermission("notifications:read:own")]` + ownership check
- [ ] `PUT /notifications/{id}/read` - `[RequirePermission("notifications:read:own")]` + ownership check

#### ⏳ TemplateController
- [ ] `GET /templates` - `[RequirePermission("templates:read")]`
- [ ] `POST /templates` - `[RequirePermission("templates:manage")]`
- [ ] `PUT /templates/{id}` - `[RequirePermission("templates:manage")]`
- [ ] `DELETE /templates/{id}` - `[RequirePermission("templates:manage")]`

#### ⏳ PreferenceController
- [ ] `GET /users/{userId}/preferences` - `[RequirePermission("notifications:read:own")]` + ownership check
- [ ] `PUT /users/{userId}/preferences` - `[RequirePermission("notifications:update:own")]` + ownership check

---

### IntegrationService

#### ⏳ MediaController
- [ ] `POST /media/upload` - `[RequirePermission("media:upload")]`
- [ ] `DELETE /media/{id}` - `[RequirePermission("media:delete:own")]` + ownership check OR `media:delete`
- [ ] `GET /media/{id}` - Public (if not sensitive) OR permission-based

#### ⏳ LocationController
- [ ] `GET /location/geocode` - `[RequirePermission("location:search")]`
- [ ] `GET /location/reverse-geocode` - `[RequirePermission("location:search")]`
- [ ] `GET /location/pincodes/search` - Public

#### ⏳ WhatsAppController
- [ ] `POST /whatsapp/send` - Internal only (use `X-Internal-API-Key`)
- [ ] `GET /whatsapp/status/{messageId}` - Internal only

---

## 🔧 Implementation Patterns

### Pattern 1: Simple Permission Check

For admin-only or role-specific endpoints:

```csharp
[HttpPost]
[RequirePermission("catalog:manage")]
public async Task<IActionResult> CreateMaterial(CreateMaterialRequest request)
{
    // Only admins with "catalog:manage" permission can access
    var material = await _catalogService.CreateMaterial(request);
    return Ok(material);
}
```

### Pattern 2: Own Resource Access

For endpoints where users access their own resources:

```csharp
[HttpGet("customers/{customerId}/orders")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetCustomerOrders(Guid customerId)
{
    // Get current user ID from JWT
    var currentUserId = Guid.Parse(User.FindFirst("sub")?.Value ?? throw new UnauthorizedAccessException());
    
    // Check ownership
    if (customerId != currentUserId)
    {
        _logger.LogWarning("User {UserId} attempted to access orders for {CustomerId}", currentUserId, customerId);
        return Forbid(); // 403 Forbidden
    }
    
    var orders = await _orderService.GetOrdersByCustomerId(customerId);
    return Ok(orders);
}
```

### Pattern 3: Dual Permission (Admin OR Own)

Allow both admin access and own resource access:

```csharp
[HttpGet("vendors/{vendorId}/inventory")]
public async Task<IActionResult> GetVendorInventory(Guid vendorId)
{
    var currentUserId = Guid.Parse(User.FindFirst("sub")?.Value ?? throw new UnauthorizedAccessException());
    
    // Check if user has admin permission
    var hasAdminPermission = await _permissionService.HasPermissionAsync(currentUserId, "inventory:read");
    
    // Check if user is accessing their own vendor inventory
    var hasOwnPermission = await _permissionService.HasPermissionAsync(currentUserId, "inventory:read:own");
    var isOwnVendor = await _vendorService.IsVendorOwner(vendorId, currentUserId);
    
    if (!hasAdminPermission && !(hasOwnPermission && isOwnVendor))
    {
        return Forbid();
    }
    
    var inventory = await _inventoryService.GetVendorInventory(vendorId);
    return Ok(inventory);
}
```

### Pattern 4: Public Endpoints

No permission required, but may need authentication:

```csharp
[HttpGet("materials")]
[AllowAnonymous] // or no attribute if public
public async Task<IActionResult> GetMaterials([FromQuery] MaterialSearchRequest request)
{
    // Public endpoint - anyone can browse materials
    var materials = await _catalogService.SearchMaterials(request);
    return Ok(materials);
}
```

### Pattern 5: Internal Service Endpoints

For service-to-service communication only:

```csharp
[HttpPost("internal/notifications/send")]
// No [RequirePermission] - protected by InternalApiAuthenticationMiddleware
public async Task<IActionResult> SendNotification(SendNotificationRequest request)
{
    // This endpoint uses X-Internal-API-Key authentication
    // Protected by app.UseInternalApiAuth("/internal")
    
    await _notificationService.Send(request);
    return Ok();
}
```

---

## 🧪 Testing RBAC

### Test 1: Unauthorized Access

```bash
# User without permission tries to create material
curl -X POST http://localhost:5005/api/v1/materials \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'

# Expected: 403 Forbidden
```

### Test 2: Own Resource Access

```bash
# Buyer accesses their own orders
curl -H "Authorization: Bearer BUYER_TOKEN" \
  http://localhost:5004/api/v1/customers/BUYER_ID/orders

# Expected: 200 OK

# Buyer tries to access another buyer's orders
curl -H "Authorization: Bearer BUYER_TOKEN" \
  http://localhost:5004/api/v1/customers/OTHER_BUYER_ID/orders

# Expected: 403 Forbidden
```

### Test 3: Admin Access

```bash
# Admin accesses any resource
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5004/api/v1/orders

# Expected: 200 OK
```

### Test 4: Public Access

```bash
# Unauthenticated user browses catalog
curl http://localhost:5005/api/v1/materials

# Expected: 200 OK
```

---

## 📝 Helper Extension Method

Create a helper to simplify ownership checks:

```csharp
// In a shared extensions file
public static class ControllerExtensions
{
    public static Guid GetCurrentUserId(this ControllerBase controller)
    {
        var userIdClaim = controller.User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return Guid.Parse(userIdClaim);
    }
    
    public static bool IsOwner(this ControllerBase controller, Guid resourceOwnerId)
    {
        var currentUserId = controller.GetCurrentUserId();
        return currentUserId == resourceOwnerId;
    }
}
```

Usage:

```csharp
[HttpGet("customers/{customerId}/orders")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetCustomerOrders(Guid customerId)
{
    if (!this.IsOwner(customerId))
    {
        return Forbid();
    }
    
    var orders = await _orderService.GetOrdersByCustomerId(customerId);
    return Ok(orders);
}
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Forgetting Ownership Check

```csharp
// WRONG - Only checks permission, not ownership
[HttpGet("customers/{customerId}/orders")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetCustomerOrders(Guid customerId)
{
    // Missing ownership check!
    return Ok(await _orderService.GetOrdersByCustomerId(customerId));
}
```

```csharp
// CORRECT - Checks both permission and ownership
[HttpGet("customers/{customerId}/orders")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetCustomerOrders(Guid customerId)
{
    if (!this.IsOwner(customerId))
        return Forbid();
    
    return Ok(await _orderService.GetOrdersByCustomerId(customerId));
}
```

### ❌ Mistake 2: Using Wrong Permission Scope

```csharp
// WRONG - Using "orders:read" instead of "orders:read:own"
[HttpGet("customers/{customerId}/orders")]
[RequirePermission("orders:read")]  // ← Too broad
public async Task<IActionResult> GetCustomerOrders(Guid customerId)
{
    // This would allow any authenticated user to access any orders
}
```

### ❌ Mistake 3: Protecting Public Endpoints

```csharp
// WRONG - Catalog browsing should be public
[HttpGet("materials")]
[RequirePermission("catalog:read")]  // ← Unnecessary
public async Task<IActionResult> GetMaterials()
{
    // This prevents unauthenticated users from browsing
}
```

---

**Created**: January 12, 2026  
**Next**: Apply to all controllers
