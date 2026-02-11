# RBAC Complete Implementation Script

**Date**: January 12, 2026  
**Purpose**: Full RBAC implementation across all 7 services  
**Status**: Ready to Execute

---

## 🎯 Executive Summary

This script provides the complete RBAC implementation for all 40 controllers across all 7 services. Each controller has been analyzed, and the appropriate `[RequirePermission]` attributes and ownership checks have been documented.

**Progress:**
- ✅ IdentityService: Complete (2 controllers, 25 endpoints)
- ⏳ VendorService: Ready (9 controllers, 45 endpoints)
- ⏳ OrderService: Ready (7 controllers, 35 endpoints)
- ⏳ CatalogService: Ready (9 controllers, 30 endpoints)
- ⏳ PaymentService: Ready (4 controllers, 15 endpoints)
- ⏳ NotificationService: Ready (3 controllers, 10 endpoints)
- ⏳ IntegrationService: Ready (3 controllers, 8 endpoints)

---

## 📋 Standard Code Additions

### Add to ALL Controllers

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;
```

---

## 🔐 Service-by-Service Implementation

### VendorService

#### 1. VendorsController

**File**: `/backend/src/services/VendorService/Controllers/VendorsController.cs`

**Additions:**
```csharp
// Add to using statements
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

// Apply to endpoints:
[HttpGet]
[RequirePermission("vendors:list")]
public async Task<IActionResult> GetAllVendors(...)

[HttpGet("profile")]
[RequirePermission("vendors:read:own")]
public async Task<IActionResult> GetOwnProfile()
{
    var userId = this.GetCurrentUserId();
    var vendor = await _vendorService.GetVendorByUserId(userId);
    return Ok(vendor);
}

[HttpPost]
[RequirePermission("vendors:create")]
public async Task<IActionResult> CreateVendor(...)

[HttpGet("{id}")]
// Public or admin - no permission if public vendor directory
public async Task<IActionResult> GetVendorById(Guid id)

[HttpPut("{id}")]
[RequirePermission("vendors:update")]
public async Task<IActionResult> UpdateVendor(Guid id, UpdateVendorRequest request)
{
    // Get vendor to check ownership
    var vendor = await _vendorService.GetVendorAsync(id);
    
    // Allow admin OR own vendor
    var authCheck = this.EnforceOwnershipOrAdmin(vendor.UserId);
    if (authCheck != null) return authCheck;
    
    var result = await _vendorService.UpdateVendor(id, request);
    return Ok(result);
}

[HttpDelete("{id}")]
[RequirePermission("vendors:delete")]
public async Task<IActionResult> DeleteVendor(Guid id)

[HttpPut("{id}/status")]
[RequirePermission("vendors:approve")]
public async Task<IActionResult> UpdateVendorStatus(...)

[HttpPut("{id}/credit-limit")]
[RequirePermission("vendors:manage-credit")]
public async Task<IActionResult> UpdateCreditLimit(...)
```

#### 2. VendorInventoryController

**File**: `/backend/src/services/VendorService/Controllers/VendorInventoryController.cs`

**Additions:**
```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/inventory")]
public async Task<IActionResult> GetVendorInventory(Guid vendorId)
{
    // Check if admin OR own vendor
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var hasAdminPermission = await CheckPermissionAsync("inventory:read");
    var hasOwnPermission = await CheckPermissionAsync("inventory:read:own") && this.IsOwner(vendor.UserId);
    
    if (!hasAdminPermission && !hasOwnPermission)
        return Forbid();
    
    var inventory = await _inventoryService.GetVendorInventory(vendorId);
    return Ok(inventory);
}

[HttpPost("vendors/{vendorId}/inventory")]
[RequirePermission("inventory:create:own")]
public async Task<IActionResult> CreateInventoryItem(Guid vendorId, CreateInventoryRequest request)
{
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    var result = await _inventoryService.CreateInventoryItem(vendorId, request);
    return Ok(result);
}

[HttpPut("vendors/{vendorId}/inventory/{id}")]
[RequirePermission("inventory:update:own")]
public async Task<IActionResult> UpdateInventoryItem(Guid vendorId, Guid id, UpdateInventoryRequest request)
{
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    var result = await _inventoryService.UpdateInventoryItem(id, request);
    return Ok(result);
}

[HttpDelete("vendors/{vendorId}/inventory/{id}")]
[RequirePermission("inventory:delete:own")]
public async Task<IActionResult> DeleteInventoryItem(Guid vendorId, Guid id)
{
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    await _inventoryService.DeleteInventoryItem(id);
    return NoContent();
}

[HttpPut("vendors/{vendorId}/inventory/{id}/stock")]
[RequirePermission("inventory:update:own")]
public async Task<IActionResult> UpdateStock(Guid vendorId, Guid id, UpdateStockRequest request)
{
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    var result = await _inventoryService.UpdateStock(id, request);
    return Ok(result);
}
```

#### 3. VendorLaborController

**File**: `/backend/src/services/VendorService/Controllers/VendorLaborController.cs`

**Pattern**: Same as VendorInventoryController but with `labor:*` permissions

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/labor")]
// Admin OR own vendor

[HttpPost("vendors/{vendorId}/labor")]
[RequirePermission("labor:create:own")]
// + ownership check

[HttpPut("vendors/{vendorId}/labor/{id}")]
[RequirePermission("labor:update:own")]
// + ownership check

[HttpDelete("vendors/{vendorId}/labor/{id}")]
[RequirePermission("labor:delete:own")]
// + ownership check
```

#### 4. VendorBankAccountsController

**File**: `/backend/src/services/VendorService/Controllers/VendorBankAccountsController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

// All endpoints use [RequirePermission("vendors:update:own")] + ownership check
[HttpGet("vendors/{vendorId}/bank-accounts")]
[HttpPost("vendors/{vendorId}/bank-accounts")]
[HttpPut("vendors/{vendorId}/bank-accounts/{id}")]
[HttpDelete("vendors/{vendorId}/bank-accounts/{id}")]
[RequirePermission("vendors:update:own")]
// Each needs: this.EnforceOwnership(vendor.UserId)
```

#### 5. VendorDocumentsController

**File**: `/backend/src/services/VendorService/Controllers/VendorDocumentsController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/documents")]
// Admin OR own vendor

[HttpPost("vendors/{vendorId}/documents")]
[RequirePermission("vendors:update:own")]
// + ownership check

[HttpDelete("vendors/{vendorId}/documents/{id}")]
[RequirePermission("vendors:update:own")]
// + ownership check

[HttpPut("vendors/{vendorId}/documents/{id}/verify")]
[RequirePermission("vendors:approve")]
// Admin only
```

#### 6. VendorServiceAreasController

**File**: `/backend/src/services/VendorService/Controllers/VendorServiceAreasController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/service-areas")]
[AllowAnonymous] // Public

[HttpPost("vendors/{vendorId}/service-areas")]
[RequirePermission("vendors:update:own")]
// + ownership check

[HttpDelete("vendors/{vendorId}/service-areas/{id}")]
[RequirePermission("vendors:update:own")]
// + ownership check
```

#### 7. VendorRatingsController

**File**: `/backend/src/services/VendorService/Controllers/VendorRatingsController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/ratings")]
[AllowAnonymous] // Public

[HttpPost("vendors/{vendorId}/ratings")]
[RequirePermission("orders:rate")]
// + verify buyer completed order with this vendor
public async Task<IActionResult> RateVendor(Guid vendorId, CreateRatingRequest request)
{
    var userId = this.GetCurrentUserId();
    
    // Verify buyer has completed order with this vendor
    var hasCompletedOrder = await _orderService.UserHasCompletedOrderWithVendor(userId, vendorId);
    if (!hasCompletedOrder)
    {
        return BadRequest(new { message = "You can only rate vendors you have completed orders with" });
    }
    
    var rating = await _ratingService.CreateRating(vendorId, userId, request);
    return Ok(rating);
}
```

#### 8. VendorStatsController

**File**: `/backend/src/services/VendorService/Controllers/VendorStatsController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/stats")]
public async Task<IActionResult> GetVendorStats(Guid vendorId)
{
    // Admin OR own vendor
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var authCheck = this.EnforceOwnershipOrAdmin(vendor.UserId);
    if (authCheck != null) return authCheck;
    
    var stats = await _statsService.GetVendorStats(vendorId);
    return Ok(stats);
}
```

#### 9. VendorBusinessHoursController

**File**: `/backend/src/services/VendorService/Controllers/VendorBusinessHoursController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/business-hours")]
[AllowAnonymous] // Public

[HttpPut("vendors/{vendorId}/business-hours")]
[RequirePermission("vendors:update:own")]
// + ownership check
```

---

### OrderService

#### 1. OrdersController

**File**: `/backend/src/services/OrderService/Controllers/OrdersController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet]
[RequirePermission("orders:list")]
public async Task<IActionResult> GetAllOrders(...)

[HttpPost]
[RequirePermission("orders:create")]
public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
{
    var userId = this.GetCurrentUserId();
    request.CustomerId = userId; // Ensure user creates order for themselves
    
    var order = await _orderService.CreateOrder(request);
    return Ok(order);
}

[HttpGet("{id}")]
public async Task<IActionResult> GetOrderById(Guid id)
{
    var order = await _orderService.GetOrderAsync(id);
    
    // Admin OR buyer/vendor involved in order
    var userId = this.GetCurrentUserId();
    var isInvolved = order.CustomerId == userId || order.VendorId == userId;
    
    if (!this.IsAdmin() && !isInvolved)
    {
        return Forbid();
    }
    
    return Ok(order);
}

[HttpPut("{id}")]
[RequirePermission("orders:update")]
public async Task<IActionResult> UpdateOrder(...)

[HttpDelete("{id}")]
[RequirePermission("orders:delete")]
public async Task<IActionResult> DeleteOrder(...)

[HttpPut("{id}/cancel")]
[RequirePermission("orders:cancel:own")]
public async Task<IActionResult> CancelOrder(Guid id)
{
    var order = await _orderService.GetOrderAsync(id);
    
    // Verify ownership
    var ownershipCheck = this.EnforceOwnership(order.CustomerId);
    if (ownershipCheck != null) return ownershipCheck;
    
    // Verify within cancellation window
    var canCancel = await _orderService.CanCancelOrder(id);
    if (!canCancel)
    {
        return BadRequest(new { message = "Order cannot be cancelled at this time" });
    }
    
    await _orderService.CancelOrder(id);
    return Ok();
}
```

#### 2. CustomerOrdersController

**File**: `/backend/src/services/OrderService/Controllers/CustomerOrdersController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("customers/{customerId}/orders")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetCustomerOrders(Guid customerId)
{
    var ownershipCheck = this.EnforceOwnership(customerId);
    if (ownershipCheck != null) return ownershipCheck;
    
    var orders = await _orderService.GetOrdersByCustomerId(customerId);
    return Ok(orders);
}

[HttpGet("customers/{customerId}/orders/{orderId}")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetCustomerOrder(Guid customerId, Guid orderId)
{
    var ownershipCheck = this.EnforceOwnership(customerId);
    if (ownershipCheck != null) return ownershipCheck;
    
    var order = await _orderService.GetOrderAsync(orderId);
    
    // Verify order belongs to customer
    if (order.CustomerId != customerId)
    {
        return NotFound();
    }
    
    return Ok(order);
}
```

#### 3. VendorOrdersController

**File**: `/backend/src/services/OrderService/Controllers/VendorOrdersController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("vendors/{vendorId}/orders")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetVendorOrders(Guid vendorId)
{
    // Get vendor to check user ID
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    var orders = await _orderService.GetOrdersByVendorId(vendorId);
    return Ok(orders);
}

[HttpPut("vendors/{vendorId}/orders/{orderId}/accept")]
[RequirePermission("orders:accept")]
public async Task<IActionResult> AcceptOrder(Guid vendorId, Guid orderId)
{
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    await _orderService.AcceptOrder(orderId);
    return Ok();
}

[HttpPut("vendors/{vendorId}/orders/{orderId}/reject")]
[RequirePermission("orders:reject")]
public async Task<IActionResult> RejectOrder(Guid vendorId, Guid orderId)
{
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    await _orderService.RejectOrder(orderId);
    return Ok();
}

[HttpPut("vendors/{vendorId}/orders/{orderId}/status")]
[RequirePermission("orders:update-status")]
public async Task<IActionResult> UpdateOrderStatus(Guid vendorId, Guid orderId, UpdateOrderStatusRequest request)
{
    var vendor = await _vendorService.GetVendorAsync(vendorId);
    var ownershipCheck = this.EnforceOwnership(vendor.UserId);
    if (ownershipCheck != null) return ownershipCheck;
    
    await _orderService.UpdateOrderStatus(orderId, request);
    return Ok();
}
```

#### 4. DisputesController

**File**: `/backend/src/services/OrderService/Controllers/DisputesController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("orders/{orderId}/disputes")]
public async Task<IActionResult> GetOrderDisputes(Guid orderId)
{
    var order = await _orderService.GetOrderAsync(orderId);
    var userId = this.GetCurrentUserId();
    
    // Admin, Support, OR involved party
    var isInvolved = order.CustomerId == userId || order.VendorId == userId;
    if (!this.IsAdmin() && !this.HasRole("Support") && !isInvolved)
    {
        return Forbid();
    }
    
    var disputes = await _disputeService.GetOrderDisputes(orderId);
    return Ok(disputes);
}

[HttpPost("orders/{orderId}/disputes")]
[RequirePermission("disputes:create")]
public async Task<IActionResult> CreateDispute(Guid orderId, CreateDisputeRequest request)
{
    var order = await _orderService.GetOrderAsync(orderId);
    var userId = this.GetCurrentUserId();
    
    // Verify user is involved in order
    var isInvolved = order.CustomerId == userId || order.VendorId == userId;
    if (!isInvolved)
    {
        return Forbid();
    }
    
    var dispute = await _disputeService.CreateDispute(orderId, userId, request);
    return Ok(dispute);
}

[HttpPut("disputes/{id}/resolve")]
[RequirePermission("disputes:resolve")]
public async Task<IActionResult> ResolveDispute(Guid id, ResolveDisputeRequest request)
{
    await _disputeService.ResolveDispute(id, request);
    return Ok();
}
```

#### 5. OrderIssuesController

**File**: `/backend/src/services/OrderService/Controllers/OrderIssuesController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("orders/{orderId}/issues")]
[RequirePermission("orders:read:own")]
public async Task<IActionResult> GetOrderIssues(Guid orderId)
{
    var order = await _orderService.GetOrderAsync(orderId);
    var userId = this.GetCurrentUserId();
    
    // Verify involved in order
    var isInvolved = order.CustomerId == userId || order.VendorId == userId;
    if (!this.IsAdmin() && !isInvolved)
    {
        return Forbid();
    }
    
    var issues = await _issueService.GetOrderIssues(orderId);
    return Ok(issues);
}

[HttpPost("orders/{orderId}/issues")]
[RequirePermission("orders:report-issue")]
public async Task<IActionResult> ReportIssue(Guid orderId, CreateIssueRequest request)
{
    var order = await _orderService.GetOrderAsync(orderId);
    var userId = this.GetCurrentUserId();
    
    // Verify involved in order
    var isInvolved = order.CustomerId == userId || order.VendorId == userId;
    if (!isInvolved)
    {
        return Forbid();
    }
    
    var issue = await _issueService.CreateIssue(orderId, userId, request);
    return Ok(issue);
}

[HttpPut("issues/{id}/resolve")]
[RequirePermission("orders:resolve-issue")]
public async Task<IActionResult> ResolveIssue(Guid id, ResolveIssueRequest request)
{
    await _issueService.ResolveIssue(id, request);
    return Ok();
}
```

#### 6. OrderReportsController

**File**: `/backend/src/services/OrderService/Controllers/OrderReportsController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

[HttpGet("orders/reports/summary")]
[RequirePermission("reports:orders")]
public async Task<IActionResult> GetOrdersSummary(...)

[HttpGet("orders/reports/vendor-performance")]
[RequirePermission("reports:vendors")]
public async Task<IActionResult> GetVendorPerformance(...)
```

#### 7. DeliveryAddressesController

**File**: `/backend/src/services/OrderService/Controllers/DeliveryAddressesController.cs`

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

// All endpoints use [RequirePermission("buyers:update:own")] + ownership check
[HttpGet]
[HttpPost]
[HttpPut("{id}")]
[HttpDelete("{id}")]
[RequirePermission("buyers:update:own")]
```

---

### CatalogService

#### Admin-Only Endpoints

All Create/Update/Delete operations use:
```csharp
[RequirePermission("catalog:manage")]
```

#### Public Endpoints

All GET endpoints (browsing) use:
```csharp
[AllowAnonymous]
```

#### Specific Controllers:

1. **CategoriesController**: GET = Public, POST/PUT/DELETE = `catalog:manage`
2. **MaterialsController**: GET = Public, POST/PUT/DELETE = `catalog:manage`
3. **LaborCategoriesController**: GET = Public, POST/PUT/DELETE = `catalog:manage`
4. **SearchController**: All endpoints = Public
5. **VendorInventoryController**: All GET = Public
6. **VendorLaborController**: All GET = Public
7. **CatalogStatsController**: `[RequirePermission("catalog:stats")]`
8. **BulkOperationsController**: `[RequirePermission("catalog:manage")]`

---

### PaymentService

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

// PaymentsController
[HttpGet] → [RequirePermission("payments:list")]
[HttpPost] → [RequirePermission("payments:create")] + verify own order
[HttpGet("{id}")] → Admin OR own payment
[HttpGet("orders/{orderId}/payments")] → [RequirePermission("payments:read:own")] + verify own order

// RefundsController
[HttpGet] → [RequirePermission("refunds:list")]
[HttpPost] → [RequirePermission("refunds:create")]
[HttpGet("{id}")] → Admin OR own refund
[HttpGet("payments/{paymentId}/refunds")] → [RequirePermission("refunds:read:own")] + verify own payment

// SettlementsController
[HttpGet] → [RequirePermission("settlements:list")]
[HttpGet("vendors/{vendorId}/settlements")] → [RequirePermission("settlements:read:own")] + ownership
[HttpPost] → [RequirePermission("settlements:create")]
[HttpPut("{id}/process")] → [RequirePermission("settlements:process")]

// WebhooksController
[HttpPost("webhooks/razorpay")] → Public (Razorpay signature validation)
```

---

### NotificationService

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

// NotificationController
[HttpPost("send")] → Internal only (X-Internal-API-Key)
[HttpPost("whatsapp")] → Internal only
[HttpPost("email")] → Internal only
[HttpGet("users/{userId}/notifications")] → [RequirePermission("notifications:read:own")] + ownership
[HttpPut("{id}/read")] → [RequirePermission("notifications:read:own")] + ownership

// TemplateController
[HttpGet] → [RequirePermission("templates:read")]
[HttpPost] → [RequirePermission("templates:manage")]
[HttpPut("{id}")] → [RequirePermission("templates:manage")]
[HttpDelete("{id}")] → [RequirePermission("templates:manage")]

// PreferenceController
[HttpGet("users/{userId}/preferences")] → [RequirePermission("notifications:read:own")] + ownership
[HttpPut("users/{userId}/preferences")] → [RequirePermission("notifications:update:own")] + ownership
```

---

### IntegrationService

```csharp
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

// MediaController
[HttpPost("upload")] → [RequirePermission("media:upload")]
[HttpDelete("{id}")] → [RequirePermission("media:delete:own")] + ownership OR media:delete
[HttpGet("{id}")] → Public OR permission-based

// LocationController
[HttpGet("geocode")] → [RequirePermission("location:search")]
[HttpGet("reverse-geocode")] → [RequirePermission("location:search")]
[HttpGet("pincodes/search")] → Public

// WhatsAppController
[HttpPost("send")] → Internal only (X-Internal-API-Key)
[HttpGet("status/{messageId}")] → Internal only
```

---

## ✅ Completion Checklist

### IdentityService
- [x] BuyersController (10 endpoints)
- [x] RolesController (15 endpoints)
- [x] AuthController (N/A - public)
- [x] HealthController (N/A - public)

### VendorService
- [ ] VendorsController (8 endpoints)
- [ ] VendorInventoryController (5 endpoints)
- [ ] VendorLaborController (4 endpoints)
- [ ] VendorBankAccountsController (4 endpoints)
- [ ] VendorDocumentsController (4 endpoints)
- [ ] VendorServiceAreasController (3 endpoints)
- [ ] VendorRatingsController (2 endpoints)
- [ ] VendorStatsController (1 endpoint)
- [ ] VendorBusinessHoursController (2 endpoints)

### OrderService
- [ ] OrdersController (6 endpoints)
- [ ] CustomerOrdersController (2 endpoints)
- [ ] VendorOrdersController (4 endpoints)
- [ ] DisputesController (3 endpoints)
- [ ] OrderIssuesController (3 endpoints)
- [ ] OrderReportsController (2 endpoints)
- [ ] DeliveryAddressesController (4 endpoints)

### CatalogService
- [ ] CategoriesController (5 endpoints)
- [ ] MaterialsController (7 endpoints)
- [ ] LaborCategoriesController (5 endpoints)
- [ ] SearchController (3 endpoints)
- [ ] VendorInventoryController (1 endpoint)
- [ ] VendorLaborController (1 endpoint)
- [ ] CatalogStatsController (1 endpoint)
- [ ] BulkOperationsController (2 endpoints)

### PaymentService
- [ ] PaymentsController (4 endpoints)
- [ ] RefundsController (4 endpoints)
- [ ] SettlementsController (4 endpoints)
- [ ] WebhooksController (1 endpoint)

### NotificationService
- [ ] NotificationController (5 endpoints)
- [ ] TemplateController (4 endpoints)
- [ ] PreferenceController (2 endpoints)

### IntegrationService
- [ ] MediaController (3 endpoints)
- [ ] LocationController (3 endpoints)
- [ ] WhatsAppController (2 endpoints)

---

**Created**: January 12, 2026  
**Total Endpoints**: 168  
**Completed**: 25 (IdentityService)  
**Remaining**: 143 (6 services)  
**Status**: ✅ Ready to Execute
