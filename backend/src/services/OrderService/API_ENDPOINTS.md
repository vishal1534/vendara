# Order Service - API Endpoints

**Total Endpoints:** 27  
**Controllers:** 5  
**Version:** v1

---

## Base URL

```
http://localhost:5000/api/v1
```

---

## 1. Orders Controller

**Base Route:** `/api/v1/orders`  
**Endpoints:** 7

### 1.1 Get All Orders

```http
GET /api/v1/orders?includeDetails=false
```

**Query Parameters:**
- `includeDetails` (boolean) - Include order items, labor, payment, delivery

**Response:**
```json
{
  "success": true,
  "data": [{ /* order objects */ }],
  "count": 10
}
```

---

### 1.2 Get Order by ID

```http
GET /api/v1/orders/{id}
```

**Path Parameters:**
- `id` (guid) - Order ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "00000001-0000-0000-0000-000000000001",
    "orderNumber": "ORD-2026-00001",
    "customerId": "...",
    "vendorId": "...",
    "orderType": "Material",
    "status": "Completed",
    "items": [],
    "laborBookings": [],
    "payment": {},
    "delivery": {},
    "totalAmount": 28660.00
  }
}
```

---

### 1.3 Get Order by Order Number

```http
GET /api/v1/orders/by-number/{orderNumber}
```

**Path Parameters:**
- `orderNumber` (string) - Order number (e.g., ORD-2026-00001)

---

### 1.4 Create Order

```http
POST /api/v1/orders
```

**Request Body:**
```json
{
  "customerId": "c0000000-0000-0000-0000-000000000001",
  "vendorId": "v0000000-0000-0000-0000-000000000001",
  "orderType": "Combined",
  "deliveryAddressId": "a0000000-0000-0000-0000-000000000001",
  "items": [
    {
      "materialId": "33333333-3333-3333-3333-333333333301",
      "vendorInventoryId": "...",
      "quantity": 50,
      "notes": "OPC 53 Cement"
    }
  ],
  "laborBookings": [
    {
      "laborCategoryId": "44444444-4444-4444-4444-444444444401",
      "vendorLaborAvailabilityId": "...",
      "workerCount": 2,
      "startDate": "2026-01-15",
      "endDate": "2026-01-22",
      "daysBooked": 8
    }
  ],
  "paymentMethod": "Online",
  "deliveryMethod": "HomeDelivery",
  "expectedDeliveryDate": "2026-01-20",
  "customerNotes": "Please deliver between 8 AM - 12 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": { /* created order */ }
}
```

---

### 1.5 Update Order Status

```http
PATCH /api/v1/orders/{id}/status
```

**Request Body:**
```json
{
  "status": "Confirmed",
  "reason": "Order confirmed by vendor",
  "notes": "Workers assigned",
  "changedBy": "v0000000-0000-0000-0000-000000000001",
  "changedByType": "Vendor"
}
```

---

### 1.6 Cancel Order

```http
POST /api/v1/orders/{id}/cancel
```

**Request Body:**
```json
{
  "reason": "Customer requested cancellation",
  "notes": "Incorrect order placed",
  "changedBy": "c0000000-0000-0000-0000-000000000001",
  "changedByType": "Customer"
}
```

---

### 1.7 Get Order History

```http
GET /api/v1/orders/{id}/history
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "previousStatus": "Pending",
      "newStatus": "Confirmed",
      "changedBy": "...",
      "changedByType": "Vendor",
      "reason": "Order confirmed by vendor",
      "changedAt": "2026-01-11T10:30:00Z"
    }
  ]
}
```

---

## 2. Customer Orders Controller

**Base Route:** `/api/v1/customers/{customerId}/orders`  
**Endpoints:** 3

### 2.1 Get Customer Orders

```http
GET /api/v1/customers/{customerId}/orders?includeDetails=true
```

**Response:** List of customer's orders

---

### 2.2 Get Customer Orders by Status

```http
GET /api/v1/customers/{customerId}/orders/by-status/{status}
```

**Path Parameters:**
- `status` - Pending, Confirmed, Processing, Dispatched, Delivered, Completed, Cancelled

---

### 2.3 Get Customer Statistics

```http
GET /api/v1/customers/{customerId}/orders/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 15,
    "totalSpent": 185430.00,
    "ordersByStatus": {
      "pending": 2,
      "confirmed": 3,
      "processing": 1,
      "dispatched": 1,
      "completed": 7,
      "cancelled": 1
    }
  }
}
```

---

## 3. Vendor Orders Controller

**Base Route:** `/api/v1/vendors/{vendorId}/orders`  
**Endpoints:** 5

### 3.1 Get Vendor Orders

```http
GET /api/v1/vendors/{vendorId}/orders?includeDetails=true
```

---

### 3.2 Get Vendor Orders by Status

```http
GET /api/v1/vendors/{vendorId}/orders/by-status/{status}
```

---

### 3.3 Get Pending Orders

```http
GET /api/v1/vendors/{vendorId}/orders/pending
```

Returns orders requiring vendor action.

---

### 3.4 Get Active Orders

```http
GET /api/v1/vendors/{vendorId}/orders/active
```

Returns orders in progress (Confirmed, Processing, Ready, Dispatched).

---

### 3.5 Get Vendor Statistics

```http
GET /api/v1/vendors/{vendorId}/orders/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 42,
    "totalRevenue": 687500.00,
    "todayOrders": 3,
    "todayRevenue": 45600.00,
    "thisMonthOrders": 18,
    "thisMonthRevenue": 287430.00,
    "ordersByStatus": { /* ... */ }
  }
}
```

---

## 4. Delivery Addresses Controller

**Base Route:** `/api/v1/delivery-addresses`  
**Endpoints:** 7

### 4.1 Get Address by ID

```http
GET /api/v1/delivery-addresses/{id}
```

---

### 4.2 Get Customer Addresses

```http
GET /api/v1/delivery-addresses/customer/{customerId}
```

Returns all addresses for a customer, sorted by default first.

---

### 4.3 Get Default Address

```http
GET /api/v1/delivery-addresses/customer/{customerId}/default
```

---

### 4.4 Create Address

```http
POST /api/v1/delivery-addresses
```

**Request Body:**
```json
{
  "customerId": "c0000000-0000-0000-0000-000000000001",
  "label": "Construction Site - Hitech City",
  "contactName": "Vishal Chauhan",
  "contactPhone": "+91 7906441952",
  "addressLine1": "Plot No. 123, Hitech City Road",
  "addressLine2": "Near Cyber Towers",
  "landmark": "Opposite Mindspace IT Park",
  "city": "Hyderabad",
  "state": "Telangana",
  "postalCode": "500081",
  "latitude": 17.4435,
  "longitude": 78.3772,
  "isDefault": true
}
```

---

### 4.5 Update Address

```http
PUT /api/v1/delivery-addresses/{id}
```

Same request body as create.

---

### 4.6 Delete Address

```http
DELETE /api/v1/delivery-addresses/{id}
```

Soft delete - sets `isActive = false`.

---

### 4.7 Set as Default

```http
POST /api/v1/delivery-addresses/{id}/set-default?customerId={customerId}
```

---

## 5. Order Reports Controller

**Base Route:** `/api/v1/reports/orders`  
**Endpoints:** 4

### 5.1 Orders by Date Range

```http
GET /api/v1/reports/orders/by-date-range?startDate=2026-01-01&endDate=2026-01-31
```

**Query Parameters:**
- `startDate` (datetime)
- `endDate` (datetime)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [/* ... */],
    "summary": {
      "totalOrders": 42,
      "totalRevenue": 687500.00,
      "averageOrderValue": 16369.05,
      "ordersByStatus": [/* ... */],
      "ordersByType": [/* ... */]
    }
  }
}
```

---

### 5.2 Orders by Status

```http
GET /api/v1/reports/orders/by-status/{status}
```

---

### 5.3 Daily Summary

```http
GET /api/v1/reports/orders/daily-summary?date=2026-01-11
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-01-11",
    "totalOrders": 8,
    "completedOrders": 3,
    "pendingOrders": 2,
    "processingOrders": 2,
    "cancelledOrders": 1,
    "totalRevenue": 87450.00,
    "averageOrderValue": 10931.25
  }
}
```

---

### 5.4 Monthly Summary

```http
GET /api/v1/reports/orders/monthly-summary?year=2026&month=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "month": 1,
    "monthName": "January 2026",
    "totalOrders": 42,
    "completedOrders": 35,
    "cancelledOrders": 2,
    "totalRevenue": 687500.00,
    "averageOrderValue": 16369.05,
    "materialOrders": 28,
    "laborOrders": 8,
    "combinedOrders": 6
  }
}
```

---

## Order Status Values

```
Draft = 1
Pending = 2
Confirmed = 3
Processing = 4
Ready = 5
Dispatched = 6
Delivered = 7
Completed = 8
Cancelled = 9
Rejected = 10
Refunded = 11
```

---

## Payment Method Values

```
CashOnDelivery = 1
Online = 2
BankTransfer = 3
Credit = 4
Cheque = 5
```

---

## Delivery Method Values

```
HomeDelivery = 1
SelfPickup = 2
ExpressDelivery = 3
ScheduledDelivery = 4
```

---

## Error Responses

### 404 Not Found

```json
{
  "success": false,
  "message": "Order not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An error occurred while processing the request"
}
```

---

**Last Updated:** January 11, 2026  
**API Version:** v1
