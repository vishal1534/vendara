# Payment Integration Test Scenarios

**Purpose:** Comprehensive test scenarios for validating the payment integration

---

## 🧪 TEST SCENARIOS

### 1. BUYER CHECKOUT FLOW

#### Test Case 1.1: Online Payment Success
**Steps:**
1. Navigate to `/checkout?orderId={valid-order-id}`
2. Select "Online Payment" method
3. Click "Pay Now"
4. Complete Razorpay checkout with test card: `4111 1111 1111 1111`
5. Wait for payment verification

**Expected Results:**
- ✅ Razorpay modal opens
- ✅ Payment processes successfully
- ✅ Redirect to `/payment-success`
- ✅ Payment status in DB = "success"
- ✅ Order status updated to "paid"
- ✅ Success toast displayed

**API Calls:**
1. `POST /api/v1/payments/create`
2. `POST /api/v1/payments/verify`
3. Order Service: `PATCH /api/v1/orders/{id}/payment-status`

---

#### Test Case 1.2: Online Payment Failure
**Steps:**
1. Navigate to `/checkout?orderId={valid-order-id}`
2. Select "Online Payment"
3. Click "Pay Now"
4. Use invalid test card or cancel payment

**Expected Results:**
- ✅ Error toast displayed
- ✅ Payment status = "failed"
- ✅ Error message logged
- ✅ User can retry

---

#### Test Case 1.3: COD Order
**Steps:**
1. Navigate to `/checkout?orderId={valid-order-id}`
2. Select "Cash on Delivery"
3. Click "Place Order"

**Expected Results:**
- ✅ Payment created with method="cod"
- ✅ Payment status = "pending"
- ✅ Redirect to success page
- ✅ Order confirmed

**API Calls:**
1. `POST /api/v1/payments/cod/create`

---

#### Test Case 1.4: Amount Mismatch Prevention
**Steps:**
1. Create order with total = ₹1000
2. Try to create payment with amount = ₹500

**Expected Results:**
- ❌ Payment creation fails
- ❌ Error: "Amount mismatch"
- ✅ Order validation prevents fraud

---

#### Test Case 1.5: Duplicate Payment Prevention
**Steps:**
1. Create payment for order X
2. Try to create another payment for same order X

**Expected Results:**
- ❌ Second payment fails
- ❌ Error: "Order already paid"
- ✅ Prevents duplicate charges

---

### 2. PAYMENT HISTORY

#### Test Case 2.1: View Payment History
**Steps:**
1. Login as buyer
2. Navigate to `/payments`
3. View list of payments

**Expected Results:**
- ✅ Paginated list displayed
- ✅ All buyer payments shown
- ✅ Status badges correct
- ✅ Dates formatted correctly

**API Calls:**
1. `GET /api/v1/payments/buyer/{buyerId}?page=1&pageSize=20`

---

#### Test Case 2.2: Search Payments
**Steps:**
1. Navigate to `/payments`
2. Search by transaction ID

**Expected Results:**
- ✅ Filtered results displayed
- ✅ Search works for payment ID
- ✅ Search works for order ID

---

#### Test Case 2.3: Filter by Status
**Steps:**
1. Navigate to `/payments`
2. Filter by "Success"

**Expected Results:**
- ✅ Only successful payments shown
- ✅ Filter persists on page reload

---

### 3. REFUND FLOW

#### Test Case 3.1: Request Refund
**Steps:**
1. Navigate to payment details page
2. Click "Request Refund"
3. Enter reason
4. Submit request

**Expected Results:**
- ✅ Refund created with status="pending"
- ✅ Success toast displayed
- ✅ Refund visible in history

**API Calls:**
1. `POST /api/v1/refunds`

---

#### Test Case 3.2: Process Refund (Admin)
**Steps:**
1. Login as admin
2. Navigate to `/admin/refunds`
3. Click "Process" on pending refund
4. Confirm processing

**Expected Results:**
- ✅ Razorpay refund initiated
- ✅ Refund status = "processing" → "completed"
- ✅ Money returned to customer

**API Calls:**
1. `POST /api/v1/refunds/{id}/process`
2. Razorpay API: Create refund

---

### 4. ADMIN PAYMENT MANAGEMENT

#### Test Case 4.1: View All Payments
**Steps:**
1. Login as admin
2. Navigate to `/admin/payments`

**Expected Results:**
- ✅ All platform payments displayed
- ✅ Analytics cards show correct stats
- ✅ Pagination works
- ✅ Export CSV works

**API Calls:**
1. `GET /api/v1/payments?page=1&pageSize=20`

---

#### Test Case 4.2: Update Payment Status
**Steps:**
1. View payment details
2. Click "Update Status"
3. Change status to "failed"
4. Add notes
5. Submit

**Expected Results:**
- ✅ Payment status updated
- ✅ Notes saved
- ✅ Timestamp recorded

**API Calls:**
1. `PATCH /api/v1/payments/{id}/status`

---

### 5. SETTLEMENT GENERATION

#### Test Case 5.1: Generate Settlement
**Steps:**
1. Login as admin
2. Navigate to `/admin/settlements/create`
3. Select vendor
4. Choose date range (e.g., last 7 days)
5. Set commission = 5%
6. Click "Generate"

**Expected Results:**
- ✅ Settlement created
- ✅ All payments in date range included
- ✅ Commission calculated correctly
- ✅ Vendor bank details fetched
- ✅ Settlement amount = Total - Commission - Tax

**API Calls:**
1. `POST /api/v1/settlements/generate`
2. Vendor Service: `GET /api/v1/vendors/{id}/bank-details`

---

#### Test Case 5.2: Commission Calculation
**Example:**
- Total Amount: ₹10,000
- Commission: 5%
- Tax: ₹180 (GST on commission)

**Expected Calculation:**
```
Commission Amount = 10,000 × 0.05 = ₹500
Tax Amount = 500 × 0.18 = ₹90
Settlement Amount = 10,000 - 500 - 90 = ₹9,410
```

**Verify:**
- ✅ Commission = ₹500
- ✅ Tax = ₹90
- ✅ Settlement = ₹9,410

---

#### Test Case 5.3: Process Settlement
**Steps:**
1. View settlement details
2. Click "Process Settlement"
3. Enter UTR number
4. Select settlement method = "NEFT"
5. Submit

**Expected Results:**
- ✅ Settlement status = "processing" → "completed"
- ✅ UTR number saved
- ✅ Settlement date recorded
- ✅ Vendor notified

**API Calls:**
1. `PATCH /api/v1/settlements/{id}/process`

---

### 6. VENDOR PAYOUT TRACKING

#### Test Case 6.1: View Pending Payouts
**Steps:**
1. Login as vendor
2. Navigate to `/vendor/payouts`
3. View "Pending Payments" tab

**Expected Results:**
- ✅ All successful but unsettled payments shown
- ✅ Pending amount calculated correctly
- ✅ Payment breakdown by order

**API Calls:**
1. `GET /api/v1/payments/vendor/{vendorId}`

---

#### Test Case 6.2: View Settlement History
**Steps:**
1. Navigate to "Settlement History" tab

**Expected Results:**
- ✅ All completed settlements shown
- ✅ Commission breakdown visible
- ✅ UTR numbers displayed
- ✅ Settlement amounts correct

**API Calls:**
1. `GET /api/v1/settlements/vendor/{vendorId}`

---

### 7. ERROR HANDLING

#### Test Case 7.1: Network Failure
**Steps:**
1. Disconnect internet
2. Try to create payment

**Expected Results:**
- ✅ Error toast: "Network error"
- ✅ Retry option available
- ✅ No partial data saved

---

#### Test Case 7.2: Payment Service Down
**Steps:**
1. Stop Payment Service
2. Try to checkout

**Expected Results:**
- ✅ Error: "Service unavailable"
- ✅ User-friendly message
- ✅ Support contact shown

---

#### Test Case 7.3: Razorpay API Failure
**Steps:**
1. Mock Razorpay API failure
2. Try to create payment

**Expected Results:**
- ✅ Error logged
- ✅ Payment status = "failed"
- ✅ User notified

---

### 8. INTEGRATION TESTS

#### Test Case 8.1: End-to-End Payment Flow
**Steps:**
1. Create order in Order Service
2. Navigate to checkout
3. Complete payment
4. Verify order status
5. Check payment in database
6. Generate settlement
7. Process payout

**Expected Results:**
- ✅ All services communicate correctly
- ✅ Data consistency across services
- ✅ No orphaned records

---

#### Test Case 8.2: Order Service Integration
**Steps:**
1. Create payment for order
2. Verify payment
3. Check order status in Order Service

**Expected Results:**
- ✅ Order Service called via HTTP
- ✅ Order status = "paid"
- ✅ Payment ID linked to order

**API Calls:**
1. Order Service: `GET /api/v1/orders/{id}`
2. Order Service: `PATCH /api/v1/orders/{id}/payment-status`

---

#### Test Case 8.3: Vendor Service Integration
**Steps:**
1. Generate settlement for vendor
2. Check vendor bank details fetched

**Expected Results:**
- ✅ Vendor Service called
- ✅ Bank details retrieved
- ✅ Account number displayed

**API Calls:**
1. Vendor Service: `GET /api/v1/vendors/{id}/bank-details`

---

### 9. LOAD TESTING

#### Test Case 9.1: Concurrent Payments
**Steps:**
1. Simulate 100 concurrent checkout requests
2. Measure response times
3. Check success rate

**Expected Results:**
- ✅ All payments processed
- ✅ No race conditions
- ✅ Response time < 2s (p95)

---

#### Test Case 9.2: Settlement Generation Under Load
**Steps:**
1. Generate settlement with 1000+ payments
2. Measure processing time

**Expected Results:**
- ✅ Settlement generated successfully
- ✅ All payments included
- ✅ Calculation accurate
- ✅ Completion time < 30s

---

### 10. SECURITY TESTS

#### Test Case 10.1: Signature Verification
**Steps:**
1. Create Razorpay payment
2. Tamper with signature
3. Try to verify

**Expected Results:**
- ❌ Verification fails
- ❌ Payment status = "failed"
- ✅ Security log created

---

#### Test Case 10.2: Unauthorized Access
**Steps:**
1. Try to access `/api/v1/payments` without auth token
2. Try to access another user's payments

**Expected Results:**
- ❌ 401 Unauthorized
- ❌ No data returned

---

#### Test Case 10.3: SQL Injection Prevention
**Steps:**
1. Try search with SQL injection payload
2. E.g., `'; DROP TABLE Payments; --`

**Expected Results:**
- ✅ Payload escaped
- ✅ No SQL execution
- ✅ No data compromise

---

## 📊 TEST COVERAGE REQUIREMENTS

### Minimum Coverage:
- Unit Tests: 80%
- Integration Tests: 60%
- E2E Tests: Key flows only

### Critical Paths to Test:
1. ✅ Buyer checkout (Online)
2. ✅ Buyer checkout (COD)
3. ✅ Payment verification
4. ✅ Refund processing
5. ✅ Settlement generation
6. ✅ Vendor payout tracking

---

## 🛠️ TEST TOOLS

### Recommended Tools:
- **Unit Tests:** Jest, Vitest
- **Integration Tests:** Supertest, MSW
- **E2E Tests:** Cypress, Playwright
- **Load Tests:** k6, Artillery
- **API Tests:** Postman, Insomnia

---

## ✅ TEST EXECUTION CHECKLIST

### Before Each Release:
- [ ] Run all unit tests
- [ ] Run integration tests
- [ ] Execute E2E scenarios
- [ ] Perform load testing
- [ ] Security audit
- [ ] Manual smoke testing
- [ ] Test on staging environment
- [ ] Verify all API integrations

---

**Total Test Scenarios:** 30  
**Critical Tests:** 10  
**Estimated Test Time:** 2-3 hours (manual)  
**Automated Test Time:** 15-20 minutes

**Status:** Ready for execution  
**Last Updated:** January 11, 2026
