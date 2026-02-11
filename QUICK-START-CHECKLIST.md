# ✅ Quick Start Checklist

**Get your payment system running in 30 minutes to 4 hours!**

---

## 🎯 TL;DR - What to Do Now

1. ✅ All code is written and ready
2. ⏳ Create `.env` file (5 min)
3. ⏳ Fix auth context (20 min) 
4. ⏳ Verify service endpoints (varies)
5. ⏳ Test (30 min)

---

## ☑️ STEP-BY-STEP CHECKLIST

### **Phase 1: Environment Setup** (5 minutes)

- [ ] **1.1** Copy environment template
  ```bash
  cp .env.example .env
  ```

- [ ] **1.2** Open `.env` file
  ```bash
  nano .env  # or use your editor
  ```

- [ ] **1.3** Add your Razorpay Test Key
  ```bash
  # Get from: https://dashboard.razorpay.com/app/keys
  VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_HERE
  ```

- [ ] **1.4** Verify service URLs
  ```bash
  VITE_PAYMENT_SERVICE_URL=http://localhost:5007
  VITE_ORDER_SERVICE_URL=http://localhost:5004
  VITE_VENDOR_SERVICE_URL=http://localhost:5002
  ```

**✅ Phase 1 Complete!** Environment is configured.

---

### **Phase 2: Start Services** (5 minutes)

- [ ] **2.1** Start Payment Service
  ```bash
  # Terminal 1
  cd backend/src/services/PaymentService
  dotnet run
  # Should start on port 5007
  ```

- [ ] **2.2** Verify Payment Service
  ```bash
  curl http://localhost:5007/health
  # Should return: {"status": "healthy"}
  ```

- [ ] **2.3** Start Order Service
  ```bash
  # Terminal 2
  cd backend/src/services/OrderService
  dotnet run
  # Should start on port 5004
  ```

- [ ] **2.4** Start Vendor Service
  ```bash
  # Terminal 3
  cd backend/src/services/VendorService
  dotnet run
  # Should start on port 5002
  ```

- [ ] **2.5** Start Frontend
  ```bash
  # Terminal 4
  cd /path/to/frontend
  npm run dev
  # Should start on port 3000
  ```

**✅ Phase 2 Complete!** All services running.

---

### **Phase 3: Verify Service Endpoints** (5-10 minutes)

- [ ] **3.1** Test Order Service Endpoint
  ```bash
  curl http://localhost:5004/api/v1/orders/test-123
  ```
  - ✅ If returns order data: **Endpoint exists!** Skip to 3.3
  - ❌ If returns 404: **Need to create endpoint** (see Phase 4)

- [ ] **3.2** Test Vendor Service Endpoint
  ```bash
  curl http://localhost:5002/api/v1/vendors/test-123
  ```
  - ✅ If returns vendor data: **Endpoint exists!** Skip to Phase 5
  - ❌ If returns 404: **Need to create endpoint** (see Phase 4)

- [ ] **3.3** Document your results
  - Order Service endpoint exists: ☑️ Yes / ☐ No
  - Vendor Service endpoint exists: ☑️ Yes / ☐ No

**✅ Phase 3 Complete!** You know what needs to be done.

---

### **Phase 4: Create Missing Endpoints** (0-4 hours)

#### **IF Order Service endpoint is missing:**

- [ ] **4.1** Open OrdersController.cs
  ```bash
  cd backend/src/services/OrderService/Controllers
  nano OrdersController.cs
  ```

- [ ] **4.2** Add GET endpoint
  ```csharp
  [HttpGet("{id}")]
  public async Task<ActionResult<OrderDto>> GetOrder(string id)
  {
      var order = await _orderService.GetByIdAsync(id);
      if (order == null) return NotFound();
      return Ok(order);
  }
  ```

- [ ] **4.3** Add PATCH endpoint
  ```csharp
  [HttpPatch("{id}/payment-status")]
  public async Task<ActionResult> UpdatePaymentStatus(
      string id, 
      [FromBody] UpdatePaymentStatusRequest request)
  {
      await _orderService.UpdatePaymentStatusAsync(id, request.Status);
      return NoContent();
  }
  ```

- [ ] **4.4** Test the new endpoint
  ```bash
  curl http://localhost:5004/api/v1/orders/test-123
  ```

#### **IF Vendor Service endpoint is missing:**

- [ ] **4.5** Open VendorsController.cs
  ```bash
  cd backend/src/services/VendorService/Controllers
  nano VendorsController.cs
  ```

- [ ] **4.6** Add GET vendor endpoint
  ```csharp
  [HttpGet("{id}")]
  public async Task<ActionResult<VendorDto>> GetVendor(string id)
  {
      var vendor = await _vendorService.GetByIdAsync(id);
      if (vendor == null) return NotFound();
      return Ok(vendor);
  }
  ```

- [ ] **4.7** Add GET bank details endpoint
  ```csharp
  [HttpGet("{id}/bank-details")]
  public async Task<ActionResult<BankDetailsDto>> GetBankDetails(string id)
  {
      var bankDetails = await _vendorService.GetBankDetailsAsync(id);
      if (bankDetails == null) return NotFound();
      return Ok(bankDetails);
  }
  ```

- [ ] **4.8** Test the new endpoints
  ```bash
  curl http://localhost:5002/api/v1/vendors/test-123
  curl http://localhost:5002/api/v1/vendors/test-123/bank-details
  ```

**✅ Phase 4 Complete!** All required endpoints exist.

---

### **Phase 5: Fix Auth Context** (20 minutes)

- [ ] **5.1** Update CheckoutPage.tsx
  ```typescript
  // File: /src/buyer/pages/CheckoutPage.tsx
  
  // Add import at top:
  import { useAuth } from '../context/AuthContext';
  
  // Inside component, replace:
  const buyerId = 'buyer-123';
  
  // With:
  const { user } = useAuth();
  const buyerId = user.id; // or user.buyerId
  ```

- [ ] **5.2** Update PaymentHistoryPage.tsx
  ```typescript
  // File: /src/buyer/pages/PaymentHistoryPage.tsx
  
  // Same fix as above
  import { useAuth } from '../context/AuthContext';
  const { user } = useAuth();
  const buyerId = user.id;
  ```

- [ ] **5.3** Update PayoutsPage.tsx (Vendor)
  ```typescript
  // File: /src/vendor/features/payouts/pages/PayoutsPage.tsx
  
  // Add import:
  import { useAuth } from '../../../context/AuthContext';
  
  // Replace:
  const vendorId = 'vendor-123';
  
  // With:
  const { user } = useAuth();
  const vendorId = user.id; // or user.vendorId
  ```

- [ ] **5.4** Verify no TypeScript errors
  ```bash
  npm run type-check
  ```

**✅ Phase 5 Complete!** Auth integration done.

---

### **Phase 6: Test End-to-End** (30 minutes)

- [ ] **6.1** Navigate to checkout
  ```
  Open: http://localhost:3000/checkout?orderId=test-order-123
  ```

- [ ] **6.2** Select "Online Payment"

- [ ] **6.3** Click "Pay Now"

- [ ] **6.4** Complete Razorpay checkout
  ```
  Test Card: 4111 1111 1111 1111
  CVV: Any 3 digits
  Expiry: Any future date
  ```

- [ ] **6.5** Verify redirect to success page
  ```
  Should redirect to: /payment-success
  ```

- [ ] **6.6** Check payment in database
  ```sql
  SELECT * FROM Payments ORDER BY CreatedAt DESC LIMIT 1;
  -- Should show new payment with status='success'
  ```

- [ ] **6.7** Check order status updated
  ```sql
  SELECT * FROM Orders WHERE Id='test-order-123';
  -- PaymentStatus should be 'paid'
  ```

- [ ] **6.8** Test payment history
  ```
  Open: http://localhost:3000/payments
  -- Should show the payment you just made
  ```

- [ ] **6.9** Test admin view
  ```
  Open: http://localhost:3000/admin/payments
  -- Should show all payments
  ```

- [ ] **6.10** Test vendor view
  ```
  Open: http://localhost:3000/vendor/payouts
  -- Should show pending payments
  ```

**✅ Phase 6 Complete!** Everything works!

---

## 🎯 SUCCESS CRITERIA

### **You're done when:**
- ✅ All services start without errors
- ✅ Environment variables are set
- ✅ Auth context uses real user IDs
- ✅ Service endpoints respond correctly
- ✅ Checkout flow completes successfully
- ✅ Payment appears in database
- ✅ Order status updates
- ✅ Payment history shows data
- ✅ Admin portal works
- ✅ Vendor portal works

---

## ⏱️ TIME ESTIMATES

### **Best Case Scenario:**
- Environment setup: 5 min
- Services already have endpoints: 0 min
- Fix auth context: 20 min
- Testing: 30 min
- **Total: 55 minutes** ✅

### **Worst Case Scenario:**
- Environment setup: 10 min
- Create Order Service endpoints: 2 hours
- Create Vendor Service endpoints: 2 hours
- Fix auth context: 20 min
- Testing: 1 hour
- **Total: ~5 hours** ⏰

### **Most Likely:**
- Environment setup: 10 min
- Fix auth context: 30 min
- Some endpoint work: 1 hour
- Testing: 30 min
- **Total: ~2 hours** 🎯

---

## 🚨 TROUBLESHOOTING

### **Problem: Payment Service won't start**
```bash
# Check if port 5007 is in use
netstat -an | grep 5007

# Kill process on port if needed
lsof -ti:5007 | xargs kill -9
```

### **Problem: "Cannot find module 'paymentService'"**
```bash
# Service file might not be created
# Check: /src/services/paymentService.ts exists

# If missing, it should have been created earlier
# Check PAYMENT-INTEGRATION-COMPLETE.md
```

### **Problem: "User is undefined"**
```typescript
// Check if AuthContext is properly set up
// Make sure you're logged in
// Try console.log(user) to debug
```

### **Problem: CORS error**
```csharp
// In backend Program.cs, add:
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

app.UseCors("AllowAll");
```

---

## 📝 FINAL CHECKLIST

Before marking as complete:

- [ ] `.env` file created with real Razorpay key
- [ ] All 4 services running (Payment, Order, Vendor, Frontend)
- [ ] Order Service endpoints verified/created
- [ ] Vendor Service endpoints verified/created
- [ ] Auth context fixed in 3 files
- [ ] No TypeScript errors
- [ ] Checkout flow tested successfully
- [ ] Payment saved to database
- [ ] Order status updated
- [ ] Payment history works
- [ ] Admin portal shows payments
- [ ] Vendor portal shows payouts

---

## 🎉 COMPLETION

```
╔══════════════════════════════════════════════════╗
║                                                  ║
║   ✅ Checklist Complete!                        ║
║                                                  ║
║   Your payment system is now working!           ║
║                                                  ║
║   Next: Deploy to staging and test thoroughly   ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

---

**Use this checklist systematically, and you'll have a working payment system in no time!** 🚀

**Questions?** Check `/ALL-FIXES-APPLIED.md` for troubleshooting!
