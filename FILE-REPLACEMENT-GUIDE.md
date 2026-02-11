# File Replacement Guide

**Purpose:** Step-by-step guide to replace mock data files with real API integration

---

## 📋 FILES TO REPLACE

### **Total Files:** 6 files need to be replaced with their `-NEW` versions

---

## 🔄 REPLACEMENT STEPS

### **Step 1: Backup Original Files**

```bash
# Create backup directory
mkdir -p backups/payment-integration

# Backup original files
cp src/admin/features/settlements/pages/SettlementsPage.tsx backups/payment-integration/
cp src/admin/features/settlements/pages/CreateSettlementPage.tsx backups/payment-integration/
cp src/vendor/features/payouts/pages/PayoutsPage.tsx backups/payment-integration/
```

---

### **Step 2: Replace Admin Settlement Files**

#### File 1: SettlementsPage.tsx

```bash
# Remove old file
rm src/admin/features/settlements/pages/SettlementsPage.tsx

# Rename new file
mv src/admin/features/settlements/pages/SettlementsPage-NEW.tsx \
   src/admin/features/settlements/pages/SettlementsPage.tsx
```

**Changes:**
- ❌ Removed: Mock data from `mockSettlements`
- ✅ Added: Real API calls to `paymentService.getAllSettlements()`
- ✅ Added: Pagination support
- ✅ Added: Real-time analytics
- ✅ Added: CSV export with real data

---

#### File 2: CreateSettlementPage.tsx

```bash
# Remove old file
rm src/admin/features/settlements/pages/CreateSettlementPage.tsx

# Rename new file
mv src/admin/features/settlements/pages/CreateSettlementPage-NEW.tsx \
   src/admin/features/settlements/pages/CreateSettlementPage.tsx
```

**Changes:**
- ❌ Removed: Mock settlement generation
- ✅ Added: Real API call to `paymentService.generateSettlement()`
- ✅ Added: Form validation
- ✅ Added: Vendor bank details auto-fetch
- ✅ Added: Commission calculation preview

---

### **Step 3: Replace Vendor Payout Files**

#### File 3: PayoutsPage.tsx

```bash
# Remove old file
rm src/vendor/features/payouts/pages/PayoutsPage.tsx

# Rename new file
mv src/vendor/features/payouts/pages/PayoutsPage-NEW.tsx \
   src/vendor/features/payouts/pages/PayoutsPage.tsx
```

**Changes:**
- ❌ Removed: Mock data from `mockPayoutTransactions`, `mockSettlements`
- ✅ Added: Real API calls to `paymentService.getVendorPayments()`
- ✅ Added: Real API calls to `paymentService.getVendorSettlements()`
- ✅ Added: Pagination support
- ✅ Added: Real-time pending amount calculation
- ✅ Added: CSV export with real data

---

### **Step 4: Verify Imports**

After replacement, check these files have correct imports:

#### SettlementsPage.tsx
```typescript
import { paymentService } from '../../../../services/paymentService';
import type { Settlement, SettlementStatus } from '../../../../types/payment';
```

#### CreateSettlementPage.tsx
```typescript
import { paymentService } from '../../../../services/paymentService';
import type { GenerateSettlementRequest } from '../../../../types/payment';
```

#### PayoutsPage.tsx (Vendor)
```typescript
import { paymentService } from '../../../../services/paymentService';
import type { Payment, Settlement } from '../../../../types/payment';
```

---

### **Step 5: Remove Unused Mock Files** (Optional)

After verification, you can remove mock data files:

```bash
# Check if these files exist and are no longer needed
rm src/admin/data/mockSettlements.ts
rm src/vendor/mocks/payouts.mock.ts
```

**⚠️ WARNING:** Only remove mock files after confirming all references are removed!

---

## 🧪 VERIFICATION STEPS

### **After Each Replacement:**

1. **Check Compilation**
   ```bash
   npm run build
   ```
   ✅ Should complete without errors

2. **Check TypeScript**
   ```bash
   npm run type-check
   ```
   ✅ No type errors

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   ✅ No runtime errors

4. **Test the Page**
   - Navigate to the updated page
   - Check console for errors
   - Verify API calls are being made
   - Confirm data displays correctly

---

## 📊 VERIFICATION CHECKLIST

### Admin Portal:

#### Settlements Page (`/admin/settlements`)
- [ ] Page loads without errors
- [ ] API call to `GET /api/v1/settlements` made
- [ ] Settlements displayed in table
- [ ] Analytics cards show correct values
- [ ] Pagination works
- [ ] Export CSV downloads real data
- [ ] Click on settlement opens details page

#### Create Settlement Page (`/admin/settlements/create`)
- [ ] Page loads without errors
- [ ] Vendor dropdown populated
- [ ] Date fields work
- [ ] Commission % validation works
- [ ] "Generate Settlement" calls API
- [ ] Success redirects to settlement details
- [ ] Error handling displays message

---

### Vendor Portal:

#### Payouts Page (`/vendor/payouts`)
- [ ] Page loads without errors
- [ ] "Pending Payments" tab shows real data
- [ ] API call to `GET /api/v1/payments/vendor/{id}` made
- [ ] "Settlement History" tab shows real data
- [ ] API call to `GET /api/v1/settlements/vendor/{id}` made
- [ ] Analytics cards calculate correctly
- [ ] Pagination works on both tabs
- [ ] Export CSV downloads real data

---

## 🔍 COMMON ISSUES & FIXES

### Issue 1: "paymentService is not defined"
**Fix:** Ensure import is added:
```typescript
import { paymentService } from '../../../../services/paymentService';
```

---

### Issue 2: Type errors on Settlement/Payment
**Fix:** Import types:
```typescript
import type { Settlement, Payment } from '../../../../types/payment';
```

---

### Issue 3: API calls return 404
**Fix:** Check backend services are running:
```bash
# Payment Service should be on port 5007
curl http://localhost:5007/health
```

---

### Issue 4: CORS errors
**Fix:** Verify CORS configuration in backend `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

---

### Issue 5: Empty data displayed
**Possible Causes:**
1. No data in database
2. Wrong vendor/buyer ID
3. API endpoint mismatch

**Fix:** 
1. Create test data in backend
2. Verify IDs match between frontend and backend
3. Check API URLs in `/src/config/api.ts`

---

## 🎯 TESTING AFTER REPLACEMENT

### Manual Testing Script:

```bash
# 1. Start backend services
cd backend/src/services/PaymentService
dotnet run

# 2. Start frontend
cd ../../../../
npm run dev

# 3. Test Admin Portal
# Navigate to: http://localhost:3000/admin/settlements
# - Verify settlements load
# - Click "Generate Settlement"
# - Fill form and submit
# - Verify new settlement created

# 4. Test Vendor Portal
# Navigate to: http://localhost:3000/vendor/payouts
# - Verify pending payments tab loads
# - Verify settlement history tab loads
# - Click export CSV
# - Verify file downloads

# 5. Check Browser Console
# - No errors should appear
# - API calls should be successful (200 status)
```

---

## 📝 ROLLBACK PROCEDURE

If something goes wrong:

```bash
# 1. Stop the application
# Ctrl+C in terminal

# 2. Restore from backup
cp backups/payment-integration/SettlementsPage.tsx \
   src/admin/features/settlements/pages/SettlementsPage.tsx

cp backups/payment-integration/CreateSettlementPage.tsx \
   src/admin/features/settlements/pages/CreateSettlementPage.tsx

cp backups/payment-integration/PayoutsPage.tsx \
   src/vendor/features/payouts/pages/PayoutsPage.tsx

# 3. Restart application
npm run dev
```

---

## ✅ FINAL CHECKLIST

Before marking replacement as complete:

- [ ] All `-NEW` files renamed
- [ ] No compilation errors
- [ ] No TypeScript errors
- [ ] All imports resolved
- [ ] Mock data references removed
- [ ] API calls working
- [ ] Data displays correctly
- [ ] Pagination works
- [ ] CSV export works
- [ ] Error handling tested
- [ ] Browser console clean
- [ ] No 404 errors
- [ ] No CORS errors

---

## 🚀 DEPLOYMENT NOTES

### After Replacement is Complete:

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: Replace mock data with real Payment Service integration
   
   - Replace SettlementsPage with API integration
   - Replace CreateSettlementPage with real settlement generation
   - Replace PayoutsPage (vendor) with API integration
   - Remove all mock payment data
   - Add pagination, filtering, and CSV export
   
   Closes #[issue-number]"
   ```

2. **Create Pull Request**
   - Title: "Payment Integration: Replace Mock Data with Real APIs"
   - Description: Link to PAYMENT-INTEGRATION-COMPLETE.md
   - Reviewers: Backend team, Frontend team

3. **Testing Requirements**
   - ✅ Unit tests pass
   - ✅ Integration tests pass
   - ✅ E2E tests pass (critical flows)
   - ✅ Manual QA approval

4. **Deployment Steps**
   - Deploy to staging first
   - Run smoke tests
   - Monitor for errors
   - Deploy to production

---

## 📊 FILE COMPARISON

### Before vs After:

| Aspect | Before (Mock) | After (Real API) |
|--------|---------------|------------------|
| **Data Source** | Hard-coded arrays | REST API calls |
| **Data Freshness** | Static | Real-time |
| **Pagination** | Client-side | Server-side |
| **Performance** | Fast (local) | Fast (cached) |
| **Scalability** | Limited (100 items) | Unlimited |
| **Filtering** | Client-side | Server-side |
| **Analytics** | Hard-coded | Calculated |
| **Export** | Fake data | Real data |

---

**Total Replacements:** 3 files  
**Estimated Time:** 30 minutes  
**Risk Level:** 🟢 Low (backwards compatible)  
**Rollback Time:** 5 minutes

**Status:** Ready for execution  
**Last Updated:** January 11, 2026
