---
title: API Reference - Payment Service
service: Payment Service
category: api-reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Payment Service API Reference

**Service:** Payment Service  
**Category:** API Reference  
**Last Updated:** January 11, 2026  
**API Version:** v1.0.0  
**Service Version:** 1.0.0

> **Quick Summary:** Complete API reference with 50+ code examples for payment processing, refunds, settlements, and Razorpay webhooks.

---

## Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [Payments Endpoints (12)](#payments-endpoints)
3. [Refunds Endpoints (7)](#refunds-endpoints)
4. [Settlements Endpoints (8)](#settlements-endpoints)
5. [Webhooks Endpoints (3)](#webhooks-endpoints)
6. [Analytics Endpoints (5)](#analytics-endpoints)
7. [Error Codes](#error-codes)
8. [Rate Limiting](#rate-limiting)
9. [Pagination](#pagination)

---

## Base URL & Authentication

### Base URLs

```
Production:   https://api.realserv.com/payment
Staging:      https://staging-api.realserv.com/payment
Development:  http://localhost:5007
```

### Authentication

All protected endpoints require a **Firebase ID token** in the `Authorization` header:

```bash
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**How to get Firebase ID token:**

```javascript
// JavaScript/TypeScript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const idToken = await auth.currentUser.getIdToken();
```

```csharp
// C#
var auth = FirebaseAuth.DefaultInstance;
var token = await auth.CurrentUser.GetIdTokenAsync();
```

---

## Payments Endpoints

### POST /api/v1/payments/create

Create a new online payment order with Razorpay integration.

**Request:**

```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "buyerId": "buyer-uuid-here",
  "vendorId": "vendor-uuid-here",
  "amount": 5000.00,
  "currency": "INR",
  "paymentMethod": "online",
  "metadata": {
    "orderNumber": "ORD-2026-0001"
  },
  "notes": "Payment for construction materials"
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | UUID | Yes | Order ID from Order Service |
| buyerId | UUID | Yes | Buyer's user ID |
| vendorId | UUID | Yes | Vendor's user ID |
| amount | decimal | Yes | Payment amount (min: 1.00) |
| currency | string | Yes | Currency code (default: "INR") |
| paymentMethod | string | Yes | "online" or "cod" |
| metadata | object | No | Additional metadata |
| notes | string | No | Payment notes |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-here",
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 5000.00,
    "currency": "INR",
    "paymentMethod": "online",
    "paymentStatus": "pending",
    "razorpayOrderId": "order_MjH5xQz9X7kLqP",
    "createdAt": "2026-01-11T10:30:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5007/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "buyerId": "buyer-uuid-here",
    "vendorId": "vendor-uuid-here",
    "amount": 5000.00,
    "currency": "INR",
    "paymentMethod": "online"
  }'
```

**JavaScript Example:**

```javascript
const response = await fetch('http://localhost:5007/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    orderId: '550e8400-e29b-41d4-a716-446655440000',
    buyerId: 'buyer-uuid-here',
    vendorId: 'vendor-uuid-here',
    amount: 5000.00,
    currency: 'INR',
    paymentMethod: 'online'
  })
});

const data = await response.json();
console.log('Payment created:', data.data.razorpayOrderId);
```

**C# Example:**

```csharp
var request = new CreatePaymentRequest
{
    OrderId = Guid.Parse("550e8400-e29b-41d4-a716-446655440000"),
    BuyerId = Guid.Parse("buyer-uuid-here"),
    VendorId = Guid.Parse("vendor-uuid-here"),
    Amount = 5000.00m,
    Currency = "INR",
    PaymentMethod = "online"
};

var response = await httpClient.PostAsJsonAsync(
    "http://localhost:5007/api/v1/payments/create", 
    request
);

var result = await response.Content.ReadFromJsonAsync<ApiResponse<PaymentResponse>>();
```

**Error Responses:**

```json
// 400 Bad Request - Invalid Order
{
  "success": false,
  "error": {
    "code": "INVALID_ORDER",
    "message": "Order cannot be paid (already paid, cancelled, or amount mismatch)"
  }
}

// 500 Internal Server Error
{
  "success": false,
  "error": {
    "code": "PAYMENT_CREATION_FAILED",
    "message": "Failed to create payment",
    "details": "Razorpay API error: Invalid key_id"
  }
}
```

---

### POST /api/v1/payments/cod/create

Create a Cash on Delivery (COD) payment record.

**Request:**

```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440001",
  "buyerId": "buyer-uuid-here",
  "vendorId": "vendor-uuid-here",
  "amount": 3500.00,
  "currency": "INR",
  "paymentMethod": "cod",
  "notes": "COD payment for cement order"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-here",
    "orderId": "550e8400-e29b-41d4-a716-446655440001",
    "buyerId": "buyer-uuid-here",
    "vendorId": "vendor-uuid-here",
    "amount": 3500.00,
    "currency": "INR",
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "createdAt": "2026-01-11T10:35:00Z",
    "updatedAt": "2026-01-11T10:35:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5007/api/v1/payments/cod/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440001",
    "buyerId": "buyer-uuid-here",
    "vendorId": "vendor-uuid-here",
    "amount": 3500.00,
    "currency": "INR",
    "paymentMethod": "cod"
  }'
```

---

### POST /api/v1/payments/verify

Verify Razorpay payment signature after buyer completes payment.

**Request:**

```json
{
  "razorpayOrderId": "order_MjH5xQz9X7kLqP",
  "razorpayPaymentId": "pay_MjH5yfRKLPZwHR",
  "razorpaySignature": "9e7f8c6b5a4d3e2f1c0b9a8d7e6f5c4b3a2d1e0f9c8b7a6d5e4f3c2b1a0d9e8f"
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| razorpayOrderId | string | Yes | Razorpay order ID |
| razorpayPaymentId | string | Yes | Razorpay payment ID |
| razorpaySignature | string | Yes | HMAC SHA256 signature |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-here",
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 5000.00,
    "paymentStatus": "success",
    "razorpayOrderId": "order_MjH5xQz9X7kLqP",
    "razorpayPaymentId": "pay_MjH5yfRKLPZwHR",
    "paidAt": "2026-01-11T10:32:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5007/api/v1/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "razorpayOrderId": "order_MjH5xQz9X7kLqP",
    "razorpayPaymentId": "pay_MjH5yfRKLPZwHR",
    "razorpaySignature": "9e7f8c6b5a4d3e2f1c0b9a8d7e6f5c4b3a2d1e0f9c8b7a6d5e4f3c2b1a0d9e8f"
  }'
```

**JavaScript Example (Frontend Integration):**

```javascript
// Step 1: Create payment order (server-side)
const createResponse = await fetch('/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify(orderDetails)
});

const { data: payment } = await createResponse.json();

// Step 2: Open Razorpay checkout (client-side)
const options = {
  key: 'rzp_test_YOUR_KEY_ID',
  amount: payment.amount * 100, // Amount in paise
  currency: payment.currency,
  order_id: payment.razorpayOrderId,
  name: 'RealServ',
  description: 'Construction Materials Order',
  handler: async function (response) {
    // Step 3: Verify payment signature (server-side)
    const verifyResponse = await fetch('/api/v1/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseToken}`
      },
      body: JSON.stringify({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      })
    });

    const verifyData = await verifyResponse.json();
    if (verifyData.success) {
      alert('Payment successful!');
    }
  }
};

const razorpay = new Razorpay(options);
razorpay.open();
```

**Error Responses:**

```json
// 400 Bad Request - Invalid Signature
{
  "success": false,
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Payment signature verification failed"
  }
}
```

---

### GET /api/v1/payments/{id}

Get payment details by payment ID.

**Request:**

```bash
GET /api/v1/payments/payment-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-here",
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "buyerId": "buyer-uuid-here",
    "vendorId": "vendor-uuid-here",
    "amount": 5000.00,
    "currency": "INR",
    "paymentMethod": "online",
    "paymentStatus": "success",
    "paymentGateway": "razorpay",
    "razorpayOrderId": "order_MjH5xQz9X7kLqP",
    "razorpayPaymentId": "pay_MjH5yfRKLPZwHR",
    "paidAt": "2026-01-11T10:32:00Z",
    "createdAt": "2026-01-11T10:30:00Z",
    "updatedAt": "2026-01-11T10:32:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5007/api/v1/payments/payment-uuid-here \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

### GET /api/v1/payments/order/{orderId}

Get payment details by order ID.

**Request:**

```bash
GET /api/v1/payments/order/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-here",
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 5000.00,
    "paymentStatus": "success",
    "paymentMethod": "online"
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5007/api/v1/payments/order/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

### GET /api/v1/payments/buyer/{buyerId}

Get all payments for a buyer with pagination.

**Request:**

```bash
GET /api/v1/payments/buyer/buyer-uuid-here?page=1&pageSize=20&status=success
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number (1-indexed) |
| pageSize | integer | No | 20 | Items per page (max: 100) |
| status | string | No | all | Filter by status: pending, success, failed |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "payment-uuid-1",
        "orderId": "order-uuid-1",
        "amount": 5000.00,
        "currency": "INR",
        "paymentMethod": "online",
        "paymentStatus": "success",
        "paidAt": "2026-01-11T10:32:00Z",
        "createdAt": "2026-01-11T10:30:00Z"
      },
      {
        "id": "payment-uuid-2",
        "orderId": "order-uuid-2",
        "amount": 3500.00,
        "currency": "INR",
        "paymentMethod": "cod",
        "paymentStatus": "success",
        "paidAt": "2026-01-10T15:20:00Z",
        "createdAt": "2026-01-10T09:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

**cURL Example:**

```bash
curl -X GET "http://localhost:5007/api/v1/payments/buyer/buyer-uuid-here?page=1&pageSize=20&status=success" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

### GET /api/v1/payments/vendor/{vendorId}

Get all payments for a vendor with pagination.

**Request:**

```bash
GET /api/v1/payments/vendor/vendor-uuid-here?page=1&pageSize=20
```

**Response:** Same structure as buyer payments endpoint.

---

### PATCH /api/v1/payments/{id}/status

Update payment status (Admin/Vendor only).

**Request:**

```json
{
  "paymentStatus": "success",
  "notes": "COD payment collected by vendor"
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| paymentStatus | string | Yes | "pending", "success", "failed" |
| notes | string | No | Status change notes |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-here",
    "orderId": "order-uuid-here",
    "paymentStatus": "success",
    "updatedAt": "2026-01-11T12:00:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X PATCH http://localhost:5007/api/v1/payments/payment-uuid-here/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "paymentStatus": "success",
    "notes": "COD payment collected by vendor"
  }'
```

---

### GET /api/v1/payments

Get all payments with filters (Admin only).

**Request:**

```bash
GET /api/v1/payments?page=1&pageSize=20&status=success&method=online&startDate=2026-01-01&endDate=2026-01-11
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |
| status | string | No | all | Filter by status |
| method | string | No | all | Filter by method: online, cod |
| startDate | string | No | - | Start date (ISO 8601) |
| endDate | string | No | - | End date (ISO 8601) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "payment-uuid-1",
        "orderId": "order-uuid-1",
        "buyerId": "buyer-uuid-1",
        "vendorId": "vendor-uuid-1",
        "amount": 5000.00,
        "currency": "INR",
        "paymentMethod": "online",
        "paymentStatus": "success",
        "razorpayPaymentId": "pay_MjH5yfRKLPZwHR",
        "paidAt": "2026-01-11T10:32:00Z",
        "createdAt": "2026-01-11T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 150,
      "totalPages": 8
    },
    "summary": {
      "totalAmount": 750000.00,
      "onlinePayments": 120,
      "codPayments": 30
    }
  }
}
```

---

### DELETE /api/v1/payments/{id}

Delete a payment record (Admin only, only pending payments).

**Request:**

```bash
DELETE /api/v1/payments/payment-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Payment deleted successfully"
  }
}
```

**Error Response:**

```json
// 400 Bad Request - Cannot delete
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_PAYMENT",
    "message": "Cannot delete payment with status: success"
  }
}
```

---

### POST /api/v1/payments/{id}/cancel

Cancel a pending payment.

**Request:**

```json
{
  "cancelReason": "Order cancelled by buyer"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "payment-uuid-here",
    "paymentStatus": "failed",
    "notes": "Cancelled: Order cancelled by buyer",
    "cancelledAt": "2026-01-11T12:30:00Z"
  }
}
```

---

## Refunds Endpoints

### POST /api/v1/refunds

Initiate a refund for a successful payment.

**Request:**

```json
{
  "paymentId": "payment-uuid-here",
  "amount": 5000.00,
  "refundReason": "Order cancelled by buyer",
  "notes": "Full refund requested"
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| paymentId | UUID | Yes | Payment ID to refund |
| amount | decimal | Yes | Refund amount (max: payment amount) |
| refundReason | string | Yes | Reason for refund |
| notes | string | No | Additional notes |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "refund-uuid-here",
    "paymentId": "payment-uuid-here",
    "amount": 5000.00,
    "currency": "INR",
    "refundReason": "Order cancelled by buyer",
    "refundStatus": "pending",
    "razorpayRefundId": "rfnd_MjH6VxJkL8wPqR",
    "createdAt": "2026-01-11T13:00:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5007/api/v1/refunds \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "paymentId": "payment-uuid-here",
    "amount": 5000.00,
    "refundReason": "Order cancelled by buyer",
    "notes": "Full refund requested"
  }'
```

**JavaScript Example:**

```javascript
const response = await fetch('http://localhost:5007/api/v1/refunds', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    paymentId: 'payment-uuid-here',
    amount: 5000.00,
    refundReason: 'Order cancelled by buyer',
    notes: 'Full refund requested'
  })
});

const data = await response.json();
console.log('Refund initiated:', data.data.razorpayRefundId);
```

**Error Responses:**

```json
// 400 Bad Request - Payment not eligible
{
  "success": false,
  "error": {
    "code": "PAYMENT_NOT_ELIGIBLE",
    "message": "Payment is not eligible for refund (status: pending)"
  }
}

// 400 Bad Request - Amount exceeded
{
  "success": false,
  "error": {
    "code": "REFUND_AMOUNT_EXCEEDED",
    "message": "Refund amount exceeds payment amount"
  }
}
```

---

### GET /api/v1/refunds/{id}

Get refund details by refund ID.

**Request:**

```bash
GET /api/v1/refunds/refund-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "refund-uuid-here",
    "paymentId": "payment-uuid-here",
    "amount": 5000.00,
    "currency": "INR",
    "refundReason": "Order cancelled by buyer",
    "refundStatus": "processed",
    "razorpayRefundId": "rfnd_MjH6VxJkL8wPqR",
    "processedAt": "2026-01-11T13:05:00Z",
    "createdAt": "2026-01-11T13:00:00Z"
  }
}
```

---

### GET /api/v1/refunds/payment/{paymentId}

Get all refunds for a payment.

**Request:**

```bash
GET /api/v1/refunds/payment/payment-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "refund-uuid-1",
      "amount": 2500.00,
      "refundReason": "Partial order cancellation",
      "refundStatus": "processed",
      "processedAt": "2026-01-11T13:05:00Z"
    },
    {
      "id": "refund-uuid-2",
      "amount": 2500.00,
      "refundReason": "Remaining amount refund",
      "refundStatus": "processed",
      "processedAt": "2026-01-11T14:10:00Z"
    }
  ]
}
```

---

### GET /api/v1/refunds/buyer/{buyerId}

Get all refunds for a buyer with pagination.

**Request:**

```bash
GET /api/v1/refunds/buyer/buyer-uuid-here?page=1&pageSize=20
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "refund-uuid-here",
        "paymentId": "payment-uuid-here",
        "orderId": "order-uuid-here",
        "amount": 5000.00,
        "refundReason": "Order cancelled by buyer",
        "refundStatus": "processed",
        "processedAt": "2026-01-11T13:05:00Z",
        "createdAt": "2026-01-11T13:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 3,
      "totalPages": 1
    }
  }
}
```

---

### GET /api/v1/refunds

Get all refunds with filters (Admin only).

**Request:**

```bash
GET /api/v1/refunds?page=1&pageSize=20&status=processed&startDate=2026-01-01
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |
| status | string | No | all | Filter by status: pending, processed, failed |
| startDate | string | No | - | Start date (ISO 8601) |
| endDate | string | No | - | End date (ISO 8601) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "refund-uuid-1",
        "paymentId": "payment-uuid-1",
        "amount": 5000.00,
        "refundReason": "Order cancelled",
        "refundStatus": "processed",
        "processedAt": "2026-01-11T13:05:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 45,
      "totalPages": 3
    },
    "summary": {
      "totalRefundAmount": 225000.00,
      "processedRefunds": 40,
      "pendingRefunds": 5
    }
  }
}
```

---

### PATCH /api/v1/refunds/{id}/status

Update refund status manually (Admin only).

**Request:**

```json
{
  "refundStatus": "processed",
  "notes": "Refund processed manually"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "refund-uuid-here",
    "refundStatus": "processed",
    "processedAt": "2026-01-11T14:00:00Z"
  }
}
```

---

### DELETE /api/v1/refunds/{id}

Cancel a pending refund (Admin only).

**Request:**

```bash
DELETE /api/v1/refunds/refund-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Refund cancelled successfully"
  }
}
```

---

## Settlements Endpoints

### POST /api/v1/settlements/generate

Generate a new vendor settlement for a date range.

**Request:**

```json
{
  "vendorId": "vendor-uuid-here",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-11T23:59:59Z",
  "notes": "Weekly settlement for vendor"
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vendorId | UUID | Yes | Vendor user ID |
| startDate | string | Yes | Start date (ISO 8601) |
| endDate | string | Yes | End date (ISO 8601) |
| notes | string | No | Settlement notes |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "settlement-uuid-here",
    "vendorId": "vendor-uuid-here",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-01-11T23:59:59Z",
    "totalAmount": 50000.00,
    "commissionAmount": 5000.00,
    "commissionPercentage": 10.0,
    "settlementAmount": 45000.00,
    "settlementStatus": "pending",
    "lineItemsCount": 12,
    "createdAt": "2026-01-11T15:00:00Z"
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5007/api/v1/settlements/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "vendorId": "vendor-uuid-here",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-01-11T23:59:59Z"
  }'
```

**JavaScript Example:**

```javascript
const response = await fetch('http://localhost:5007/api/v1/settlements/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    vendorId: 'vendor-uuid-here',
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-01-11T23:59:59Z',
    notes: 'Weekly settlement'
  })
});

const data = await response.json();
console.log('Settlement generated:', data.data.settlementAmount);
```

---

### GET /api/v1/settlements/{id}

Get settlement details by settlement ID.

**Request:**

```bash
GET /api/v1/settlements/settlement-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "settlement-uuid-here",
    "vendorId": "vendor-uuid-here",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-01-11T23:59:59Z",
    "totalAmount": 50000.00,
    "commissionAmount": 5000.00,
    "commissionPercentage": 10.0,
    "settlementAmount": 45000.00,
    "settlementStatus": "pending",
    "lineItems": [
      {
        "id": "line-item-uuid-1",
        "paymentId": "payment-uuid-1",
        "orderId": "order-uuid-1",
        "orderAmount": 5000.00,
        "commissionAmount": 500.00,
        "settlementAmount": 4500.00,
        "paidAt": "2026-01-05T10:30:00Z"
      }
    ],
    "createdAt": "2026-01-11T15:00:00Z"
  }
}
```

---

### GET /api/v1/settlements/vendor/{vendorId}

Get all settlements for a vendor with pagination.

**Request:**

```bash
GET /api/v1/settlements/vendor/vendor-uuid-here?page=1&pageSize=20&status=processed
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |
| status | string | No | all | Filter by status: pending, processing, processed, failed |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "settlement-uuid-1",
        "startDate": "2026-01-01T00:00:00Z",
        "endDate": "2026-01-11T23:59:59Z",
        "settlementAmount": 45000.00,
        "settlementStatus": "processed",
        "processedAt": "2026-01-12T10:00:00Z",
        "lineItemsCount": 12
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 5,
      "totalPages": 1
    }
  }
}
```

---

### GET /api/v1/settlements

Get all settlements with filters (Admin only).

**Request:**

```bash
GET /api/v1/settlements?page=1&pageSize=20&status=pending
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "settlement-uuid-1",
        "vendorId": "vendor-uuid-1",
        "settlementAmount": 45000.00,
        "settlementStatus": "pending",
        "lineItemsCount": 12,
        "createdAt": "2026-01-11T15:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 25,
      "totalPages": 2
    },
    "summary": {
      "totalSettlementAmount": 1125000.00,
      "pendingSettlements": 15,
      "processedSettlements": 10
    }
  }
}
```

---

### PATCH /api/v1/settlements/{id}/process

Process a settlement (mark as processing/processed).

**Request:**

```json
{
  "settlementStatus": "processed",
  "transactionReference": "TXN-2026-0001",
  "notes": "Payment transferred to vendor bank account"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "settlement-uuid-here",
    "settlementStatus": "processed",
    "transactionReference": "TXN-2026-0001",
    "processedAt": "2026-01-12T10:00:00Z"
  }
}
```

---

### PATCH /api/v1/settlements/{id}/cancel

Cancel a pending settlement.

**Request:**

```json
{
  "cancelReason": "Incorrect date range"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "settlement-uuid-here",
    "settlementStatus": "cancelled",
    "cancelledAt": "2026-01-12T11:00:00Z"
  }
}
```

---

### GET /api/v1/settlements/{id}/line-items

Get settlement line items with pagination.

**Request:**

```bash
GET /api/v1/settlements/settlement-uuid-here/line-items?page=1&pageSize=20
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "line-item-uuid-1",
        "settlementId": "settlement-uuid-here",
        "paymentId": "payment-uuid-1",
        "orderId": "order-uuid-1",
        "orderAmount": 5000.00,
        "commissionAmount": 500.00,
        "settlementAmount": 4500.00,
        "paidAt": "2026-01-05T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 12,
      "totalPages": 1
    }
  }
}
```

---

### DELETE /api/v1/settlements/{id}

Delete a pending settlement (Admin only).

**Request:**

```bash
DELETE /api/v1/settlements/settlement-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Settlement deleted successfully"
  }
}
```

---

## Webhooks Endpoints

### POST /api/v1/webhooks/razorpay

Receive webhook events from Razorpay (public endpoint, signature-verified).

**Request Headers:**

```
X-Razorpay-Signature: {HMAC_SHA256_SIGNATURE}
```

**Request Body (payment.captured):**

```json
{
  "entity": "event",
  "account_id": "acc_XXXXXX",
  "event": "payment.captured",
  "contains": ["payment"],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_MjH5yfRKLPZwHR",
        "entity": "payment",
        "amount": 500000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_MjH5xQz9X7kLqP",
        "method": "upi",
        "captured": true,
        "created_at": 1705050720
      }
    }
  },
  "created_at": 1705050725
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Webhook processed successfully",
    "event": "payment.captured",
    "paymentId": "payment-uuid-here"
  }
}
```

**Supported Events:**
- `payment.captured` - Payment successfully captured
- `payment.failed` - Payment failed
- `refund.processed` - Refund successfully processed
- `refund.failed` - Refund failed

**Error Response:**

```json
// 400 Bad Request - Invalid Signature
{
  "success": false,
  "error": {
    "code": "INVALID_WEBHOOK_SIGNATURE",
    "message": "Webhook signature verification failed"
  }
}
```

---

### GET /api/v1/webhooks

Get webhook logs with filters (Admin only).

**Request:**

```bash
GET /api/v1/webhooks?page=1&pageSize=20&event=payment.captured&status=success
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |
| event | string | No | all | Filter by event type |
| status | string | No | all | Filter by status: success, failed |
| startDate | string | No | - | Start date (ISO 8601) |
| endDate | string | No | - | End date (ISO 8601) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "webhook-uuid-1",
        "event": "payment.captured",
        "razorpayPaymentId": "pay_MjH5yfRKLPZwHR",
        "paymentId": "payment-uuid-here",
        "status": "success",
        "payload": { ... },
        "processedAt": "2026-01-11T10:32:05Z",
        "createdAt": "2026-01-11T10:32:05Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 150,
      "totalPages": 8
    }
  }
}
```

---

### GET /api/v1/webhooks/{id}

Get webhook log details by ID (Admin only).

**Request:**

```bash
GET /api/v1/webhooks/webhook-uuid-here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "webhook-uuid-here",
    "event": "payment.captured",
    "razorpayPaymentId": "pay_MjH5yfRKLPZwHR",
    "paymentId": "payment-uuid-here",
    "status": "success",
    "payload": {
      "entity": "event",
      "event": "payment.captured",
      "payload": { ... }
    },
    "response": "Payment status updated to success",
    "processedAt": "2026-01-11T10:32:05Z",
    "createdAt": "2026-01-11T10:32:05Z"
  }
}
```

---

## Analytics Endpoints

### GET /api/v1/payments/analytics/summary

Get payment analytics summary.

**Request:**

```bash
GET /api/v1/payments/analytics/summary?startDate=2026-01-01&endDate=2026-01-11
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalPayments": 150,
    "totalAmount": 750000.00,
    "successfulPayments": 135,
    "successfulAmount": 675000.00,
    "failedPayments": 10,
    "failedAmount": 50000.00,
    "pendingPayments": 5,
    "pendingAmount": 25000.00,
    "onlinePayments": 120,
    "onlineAmount": 600000.00,
    "codPayments": 30,
    "codAmount": 150000.00,
    "averagePaymentAmount": 5000.00
  }
}
```

---

### GET /api/v1/refunds/analytics/summary

Get refund analytics summary.

**Request:**

```bash
GET /api/v1/refunds/analytics/summary?startDate=2026-01-01&endDate=2026-01-11
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalRefunds": 45,
    "totalRefundAmount": 225000.00,
    "processedRefunds": 40,
    "processedAmount": 200000.00,
    "pendingRefunds": 5,
    "pendingAmount": 25000.00,
    "averageRefundAmount": 5000.00,
    "refundRate": 30.0
  }
}
```

---

### GET /api/v1/settlements/analytics/summary

Get settlement analytics summary.

**Request:**

```bash
GET /api/v1/settlements/analytics/summary?startDate=2026-01-01&endDate=2026-01-11
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalSettlements": 25,
    "totalSettlementAmount": 1125000.00,
    "processedSettlements": 10,
    "processedAmount": 450000.00,
    "pendingSettlements": 15,
    "pendingAmount": 675000.00,
    "totalCommission": 125000.00,
    "averageCommissionRate": 10.0
  }
}
```

---

### GET /api/v1/payments/analytics/by-date

Get payment analytics grouped by date.

**Request:**

```bash
GET /api/v1/payments/analytics/by-date?startDate=2026-01-01&endDate=2026-01-11&groupBy=day
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | string | Yes | - | Start date (ISO 8601) |
| endDate | string | Yes | - | End date (ISO 8601) |
| groupBy | string | No | day | Group by: day, week, month |

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-11",
      "totalPayments": 15,
      "totalAmount": 75000.00,
      "successfulPayments": 13,
      "successfulAmount": 65000.00,
      "failedPayments": 2,
      "failedAmount": 10000.00
    },
    {
      "date": "2026-01-10",
      "totalPayments": 12,
      "totalAmount": 60000.00,
      "successfulPayments": 11,
      "successfulAmount": 55000.00,
      "failedPayments": 1,
      "failedAmount": 5000.00
    }
  ]
}
```

---

### GET /api/v1/payments/analytics/by-vendor

Get payment analytics grouped by vendor.

**Request:**

```bash
GET /api/v1/payments/analytics/by-vendor?startDate=2026-01-01&endDate=2026-01-11&top=10
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "vendorId": "vendor-uuid-1",
      "vendorName": "Krishna Materials",
      "totalPayments": 25,
      "totalAmount": 125000.00,
      "successRate": 96.0
    },
    {
      "vendorId": "vendor-uuid-2",
      "vendorName": "Hyderabad Cement Co",
      "totalPayments": 20,
      "totalAmount": 100000.00,
      "successRate": 95.0
    }
  ]
}
```

---

## Error Codes

### Common Error Codes

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `INVALID_ORDER` | 400 | Order is not valid for payment | Verify order status and amount |
| `PAYMENT_CREATION_FAILED` | 500 | Failed to create payment | Check Razorpay credentials |
| `INVALID_SIGNATURE` | 400 | Payment signature verification failed | Ensure correct signature calculation |
| `PAYMENT_NOT_FOUND` | 404 | Payment not found | Verify payment ID |
| `PAYMENT_NOT_ELIGIBLE` | 400 | Payment not eligible for refund | Check payment status |
| `REFUND_AMOUNT_EXCEEDED` | 400 | Refund amount exceeds payment | Reduce refund amount |
| `REFUND_CREATION_FAILED` | 500 | Failed to create refund | Check Razorpay configuration |
| `SETTLEMENT_NOT_FOUND` | 404 | Settlement not found | Verify settlement ID |
| `SETTLEMENT_GENERATION_FAILED` | 500 | Failed to generate settlement | Check date range and vendor payments |
| `INVALID_WEBHOOK_SIGNATURE` | 400 | Webhook signature invalid | Verify webhook secret |
| `UNAUTHORIZED` | 401 | Missing or invalid token | Provide valid Firebase token |
| `FORBIDDEN` | 403 | Insufficient permissions | Verify user role |

[View Complete Error Codes →](./docs/reference/error-codes.md)

---

## Rate Limiting

**Current Limits:**
- **Per IP:** 100 requests per minute
- **Per User:** 60 requests per minute
- **Webhook Endpoint:** No rate limit (signature-verified)

**Rate Limit Headers:**

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705050780
```

**Rate Limit Exceeded Response (429):**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 30
  }
}
```

---

## Pagination

All list endpoints support pagination with the following parameters:

**Query Parameters:**
- `page` (integer, default: 1) - Page number (1-indexed)
- `pageSize` (integer, default: 20, max: 100) - Items per page

**Pagination Response:**

```json
{
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

**Document Status:** ✅ Complete  
**Total Endpoints:** 35  
**Total Examples:** 50+  
**Last Updated:** January 11, 2026

---

**Maintained by:** RealServ Backend Team  
**Contact:** backend@realserv.com  
**Support:** [docs/reference/troubleshooting.md](./docs/reference/troubleshooting.md)
