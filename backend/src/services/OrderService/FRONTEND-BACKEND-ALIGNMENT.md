# Order Service - Frontend-Backend Alignment Review

**Date:** January 11, 2026  
**Review Status:** ⚠️ Gaps Identified

---

## 🔍 Comparison Summary

After reviewing the frontend code (Admin Portal & Vendor Portal), I've identified **critical gaps** between what the frontend expects and what the Order Service currently provides.

---

## ❌ **CRITICAL GAPS IDENTIFIED**

### 1. **Order Status Mismatch**

**Frontend (Admin Portal) expects:**
```typescript
type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'active'
  | 'completed' 
  | 'cancelled'
  | 'disputed';
```

**Backend provides:**
```csharp
enum OrderStatus {
  Draft = 1,
  Pending = 2,
  Confirmed = 3,
  Processing = 4,
  Ready = 5,
  Dispatched = 6,
  Delivered = 7,
  Completed = 8,
  Cancelled = 9,
  Rejected = 10,
  Refunded = 11
}
```

**⚠️ Issues:**
- Frontend uses `'active'` - Backend has `Processing`, `Ready`, `Dispatched` (need to map)
- Frontend expects `'disputed'` - **Backend is MISSING dispute functionality**
- Frontend uses lowercase strings - Backend uses PascalCase enums
- Backend has `Draft`, `Rejected`, `Refunded`, `Delivered` - Frontend doesn't expect these

---

### 2. **Vendor Order Status Mismatch**

**Frontend (Vendor Portal) expects:**
```typescript
enum VendorOrderStatus {
  OFFERED = 'offered',           // NEW ORDER - not responded yet
  ACCEPTED = 'accepted',         
  REJECTED = 'rejected',         
  IN_PROGRESS = 'in_progress',   
  READY = 'ready',               // Ready for delivery/pickup
  COMPLETED = 'completed',       
  ISSUE = 'issue',               // Issue reported
  CANCELLED = 'cancelled',       
}
```

**Backend provides:**
- No separate vendor-specific order statuses
- No `OFFERED` state for pending vendor acceptance
- No `ISSUE` state for reported problems
- No `IN_PROGRESS` state (uses `Processing` instead)

**⚠️ Critical:** Vendor portal has completely different workflow expectations!

---

### 3. **MISSING: Dispute Management System**

**Frontend (Admin Portal) expects:**

```typescript
interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  
  // Dispute Details
  reason: DisputeReason; // 10 different reasons
  description: string;
  status: DisputeStatus; // 7 different statuses
  priority: DisputePriority; // 4 levels
  
  // Financial Impact
  disputedAmount: number;
  refundAmount?: number;
  
  // Evidence
  evidence: DisputeEvidence[];
  
  // Assignment & Resolution
  assignedTo?: string;
  resolutionNote?: string;
  
  // Timeline
  timeline: DisputeTimeline[];
}

type DisputeReason =
  | 'wrong_items'
  | 'damaged_items'
  | 'missing_items'
  | 'quality_issue'
  | 'quantity_mismatch'
  | 'late_delivery'
  | 'wrong_pricing'
  | 'vendor_no_show'
  | 'incomplete_work'
  | 'other';

type DisputeStatus = 
  | 'open'
  | 'under_review'
  | 'resolved_refund'
  | 'resolved_replacement'
  | 'resolved_partial_refund'
  | 'rejected'
  | 'escalated';
```

**Backend provides:**
- ❌ **NO Dispute entity**
- ❌ **NO Dispute endpoints**
- ❌ **NO Dispute management**
- ❌ **NO Evidence attachments**
- ❌ **NO Dispute timeline**

---

### 4. **MISSING: Platform Fee & Vendor Payout Fields**

**Frontend (Admin & Vendor) expects:**

```typescript
// Admin Portal
interface Order {
  subtotal: number;
  platformFee: number;      // ❌ MISSING
  deliveryFee: number;
  tax: number;
  total: number;
  settlementId?: string;    // ❌ MISSING
}

// Vendor Portal
interface VendorOrder {
  basePayoutAmount: number;      // ❌ MISSING
  realservFee?: number;          // ❌ MISSING (platform fee)
  logisticsFee?: number;         // ❌ MISSING
  deductions?: number;           // ❌ MISSING
  totalPayoutAmount: number;     // ❌ MISSING
  settlementId?: string;         // ❌ MISSING
  settlementDate?: string;       // ❌ MISSING
  settlementStatus?: 'pending' | 'processing' | 'settled'; // ❌ MISSING
}
```

**Backend provides:**
```csharp
decimal SubtotalAmount;
decimal GstAmount;
decimal DeliveryCharges;
decimal DiscountAmount;
decimal TotalAmount;
// ❌ No platformFee
// ❌ No vendor payout breakdown
// ❌ No settlement tracking
```

---

### 5. **MISSING: Offer/Expiration System (Vendor Portal)**

**Frontend (Vendor Portal) expects:**

```typescript
interface VendorOrder {
  offeredAt: string;           // When order was offered
  offerExpiresAt?: string;     // ❌ MISSING - deadline to accept
  respondedAt?: string;        // ❌ MISSING
  acceptedAt?: string;         // ✅ Can track via status history
  rejectedAt?: string;         // ✅ Can track via status history
}
```

**Backend provides:**
- No offer expiration tracking
- No response deadline logic
- No auto-rejection after expiration

---

### 6. **MISSING: Issue Reporting (Vendor Portal)**

**Frontend (Vendor Portal) expects:**

```typescript
interface VendorOrder {
  hasIssue?: boolean;
  issueReported?: boolean;
  issueDescription?: string;
  issueReportedAt?: string;
  issueResolvedAt?: string;
  issueResolution?: string;
}
```

**Backend provides:**
- ❌ No issue tracking on orders
- ❌ No issue reporting endpoints
- ❌ No issue resolution workflow

---

### 7. **Order Item Structure Differences**

**Frontend (Admin) expects:**
```typescript
interface OrderItem {
  id: string;
  name: string;
  category: string;          // ❌ Backend doesn't store category on item
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  specifications?: string;   // ❌ Backend has "notes" instead
}
```

**Backend provides:**
```csharp
class OrderItem {
  Guid MaterialId;
  string MaterialName;
  string? Sku;
  string Unit;
  decimal UnitPrice;
  decimal Quantity;
  decimal GstPercentage;
  decimal GstAmount;
  decimal TotalAmount;
  string? Notes;
  // ❌ No category field
  // ❌ No specifications field (has notes)
}
```

---

### 8. **Payment Status Mismatch**

**Frontend expects:**
```typescript
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
```

**Backend provides:**
```csharp
enum PaymentStatus {
  Pending = 1,
  Authorized = 2,         // ❌ Frontend doesn't expect
  Paid = 3,
  Failed = 4,             // ❌ Frontend doesn't expect
  Refunded = 5,
  PartiallyRefunded = 6,  // Frontend expects 'partial'
  Cancelled = 7           // ❌ Frontend doesn't expect
}
```

---

### 9. **MISSING: Buyer Fields**

**Frontend expects:**
```typescript
interface Order {
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
}
```

**Backend provides:**
```csharp
Guid CustomerId;  // ✅ Has ID
// ❌ No customer name, phone, location on order
// (Would need to fetch from Identity Service)
```

---

### 10. **MISSING: Vendor Type Classification**

**Frontend expects:**
```typescript
interface Order {
  vendorType: string; // e.g., "Material Supplier", "Labor Provider"
}
```

**Backend provides:**
```csharp
Guid VendorId;
// ❌ No vendor type/classification
```

---

### 11. **Rating & Review Fields**

**Frontend expects:**
```typescript
interface Order {
  rating?: number;
  reviewText?: string;
}
```

**Backend provides:**
- ❌ No rating field
- ❌ No review field
- ❌ No review system

---

### 12. **Delivery Slot Format Difference**

**Frontend expects:**
```typescript
deliverySlot?: string; // "9:00 AM - 11:00 AM"
// OR
deliverySlot?: {
  date: string;
  startTime: string;
  endTime: string;
}
```

**Backend provides:**
```csharp
DateTime? ScheduledDate; // Single date only
// ❌ No time slot structure
// ❌ No start/end time
```

---

## ✅ **WHAT WORKS (Aligned)**

### Matching Fields:
- ✅ Order ID and Order Number
- ✅ Customer ID (frontend calls it buyerId)
- ✅ Vendor ID
- ✅ Order items with quantity, unit, price
- ✅ Delivery address
- ✅ Timestamps (createdAt, updatedAt, deliveredAt)
- ✅ Cancellation reason
- ✅ Notes/description

### Matching Concepts:
- ✅ Order status workflow (with mapping needed)
- ✅ Payment tracking
- ✅ Delivery tracking
- ✅ Order history/timeline

---

## 🔧 **REQUIRED BACKEND CHANGES**

### Priority 1: CRITICAL (Blocking Frontend)

1. **Add Dispute Management System**
   - Create `Dispute` entity with all fields
   - Create `DisputeEvidence` entity
   - Create `DisputeTimeline` entity
   - Add 10+ dispute-related endpoints
   - Add dispute status to Order entity

2. **Add Platform Fee & Vendor Payout Structure**
   - Add `PlatformFee` to Order
   - Add `VendorPayoutAmount` to Order
   - Add `LogisticsFee` to Order
   - Add `Deductions` to Order
   - Add `SettlementId` to Order
   - Add settlement status tracking

3. **Add Vendor Offer/Acceptance System**
   - Add `OfferedAt` to Order
   - Add `OfferExpiresAt` to Order
   - Add `RespondedAt` to Order
   - Add auto-rejection logic
   - Add vendor notification system

4. **Add Issue Reporting System**
   - Add issue fields to Order entity
   - Add issue reporting endpoints
   - Add issue resolution workflow
   - Link to disputes

### Priority 2: HIGH (Frontend Degradation)

5. **Enhance Order Entity**
   - Add `Rating` field
   - Add `ReviewText` field
   - Add `BuyerName` (denormalized)
   - Add `BuyerPhone` (denormalized)
   - Add `BuyerLocation` (denormalized)
   - Add `VendorType` (denormalized)

6. **Enhance OrderItem Entity**
   - Add `Category` field
   - Rename `Notes` to `Specifications` (or add both)

7. **Enhance Delivery Entity**
   - Add `DeliverySlotStart` time
   - Add `DeliverySlotEnd` time
   - Or restructure as JSON object

8. **Add Status Mapping**
   - Map backend statuses to frontend expectations
   - Handle `'active'` → (`Processing` | `Ready` | `Dispatched`)
   - Add API response transformers

### Priority 3: MEDIUM (Nice to Have)

9. **Align Payment Status**
   - Map `PartiallyRefunded` → `'partial'`
   - Hide backend-only statuses from frontend

10. **Add Vendor-Specific Endpoints**
    - `GET /api/v1/vendors/{vendorId}/orders/offered` - Pending acceptance
    - `POST /api/v1/vendors/{vendorId}/orders/{orderId}/accept`
    - `POST /api/v1/vendors/{vendorId}/orders/{orderId}/reject`
    - `POST /api/v1/vendors/{vendorId}/orders/{orderId}/mark-ready`
    - `POST /api/v1/vendors/{vendorId}/orders/{orderId}/report-issue`

---

## 📋 **NEW ENTITIES NEEDED**

### 1. Dispute Entity
```csharp
public class Dispute
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; }
    
    // Dispute Details
    public DisputeReason Reason { get; set; }
    public string Description { get; set; }
    public DisputeStatus Status { get; set; }
    public DisputePriority Priority { get; set; }
    
    // Financial
    public decimal DisputedAmount { get; set; }
    public decimal? RefundAmount { get; set; }
    
    // Assignment
    public Guid? AssignedTo { get; set; }
    public DateTime? AssignedAt { get; set; }
    
    // Resolution
    public string? ResolutionNote { get; set; }
    public Guid? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    
    // Evidence and Timeline
    public ICollection<DisputeEvidence> Evidence { get; set; }
    public ICollection<DisputeTimeline> Timeline { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### 2. DisputeEvidence Entity
```csharp
public class DisputeEvidence
{
    public Guid Id { get; set; }
    public Guid DisputeId { get; set; }
    public Dispute Dispute { get; set; }
    
    public string Type { get; set; } // image, document, video
    public string Url { get; set; }
    public string UploadedBy { get; set; }
    public string UploadedByRole { get; set; } // buyer, vendor, admin
    public string? Description { get; set; }
    public DateTime UploadedAt { get; set; }
}
```

### 3. DisputeTimeline Entity
```csharp
public class DisputeTimeline
{
    public Guid Id { get; set; }
    public Guid DisputeId { get; set; }
    public Dispute Dispute { get; set; }
    
    public string Actor { get; set; }
    public string ActorRole { get; set; }
    public string Action { get; set; }
    public string Description { get; set; }
    public string? Metadata { get; set; } // JSON
    public DateTime Timestamp { get; set; }
}
```

### 4. OrderIssue Entity
```csharp
public class OrderIssue
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; }
    
    public string Description { get; set; }
    public string? Resolution { get; set; }
    public DateTime ReportedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public Guid ReportedBy { get; set; }
    public Guid? ResolvedBy { get; set; }
}
```

---

## 📝 **ENHANCED ORDER ENTITY**

```csharp
public class Order
{
    // Existing fields...
    
    // NEW FIELDS NEEDED:
    
    // Financial Breakdown
    public decimal PlatformFee { get; set; }
    public decimal VendorPayoutAmount { get; set; }
    public decimal LogisticsFee { get; set; }
    public decimal Deductions { get; set; }
    
    // Denormalized Buyer Info
    public string BuyerName { get; set; }
    public string BuyerPhone { get; set; }
    public string BuyerLocation { get; set; }
    
    // Denormalized Vendor Info
    public string VendorName { get; set; }
    public string VendorType { get; set; }
    
    // Offer/Acceptance
    public DateTime? OfferedAt { get; set; }
    public DateTime? OfferExpiresAt { get; set; }
    public DateTime? RespondedAt { get; set; }
    
    // Rating & Review
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
    
    // Settlement
    public Guid? SettlementId { get; set; }
    public DateTime? SettlementDate { get; set; }
    public string? SettlementStatus { get; set; }
    
    // Dispute
    public Guid? DisputeId { get; set; }
    public Dispute? Dispute { get; set; }
    public bool HasActiveDispute { get; set; }
    
    // Issues
    public ICollection<OrderIssue> Issues { get; set; }
}
```

---

## 🎯 **RECOMMENDED ACTION PLAN**

### Immediate (Today)
1. ✅ Add `PlatformFee`, `VendorPayoutAmount` to Order entity
2. ✅ Add `Rating`, `ReviewText` to Order entity
3. ✅ Add `SettlementId` to Order entity
4. ✅ Add denormalized buyer/vendor fields

### This Week
5. ✅ Create Dispute management system (3 entities, 10+ endpoints)
6. ✅ Create Issue reporting system
7. ✅ Add offer/expiration tracking
8. ✅ Add delivery time slot structure

### Next Week
9. ✅ Add vendor-specific action endpoints
10. ✅ Add status mapping layer
11. ✅ Update documentation
12. ✅ Create migration scripts

---

## 📊 **COMPLETION ESTIMATE**

| Feature | Entities | Endpoints | Effort |
|---------|----------|-----------|--------|
| Dispute System | 3 | 12 | 2-3 days |
| Issue Reporting | 1 | 5 | 1 day |
| Order Enhancements | 1 | 0 | 0.5 day |
| Vendor Actions | 0 | 6 | 1 day |
| Status Mapping | 0 | 0 | 0.5 day |
| **TOTAL** | **5** | **23** | **5-6 days** |

---

## ⚠️ **CRITICAL FINDINGS**

The Order Service is **60% aligned** with frontend expectations. Major gaps:

1. ❌ **NO Dispute Management** (critical for admin portal)
2. ❌ **NO Platform Fee/Payout tracking** (critical for vendor portal & settlements)
3. ❌ **NO Issue Reporting** (critical for vendor portal)
4. ❌ **NO Offer/Expiration** (affects vendor UX)
5. ⚠️ **Status mismatch** (needs mapping layer)

**Recommendation:** Implement Priority 1 features IMMEDIATELY to support frontend functionality.

---

**Last Updated:** January 11, 2026  
**Reviewed By:** System Architect  
**Status:** ⚠️ Requires Enhancement
