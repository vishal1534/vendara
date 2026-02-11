# Import Migration Guide

**Last Updated**: January 2026  
**Status**: Phase 1 Complete - Utilities Only

---

## Overview

This guide documents the migration to path aliases for better code organization and maintainability. We're taking a **gradual approach**, starting with utilities only.

## Current Status: Phase 1 - Shared Utilities

✅ **Completed:**
- Path aliases configured in `vite.config.ts`
- Shared utilities created (`formatCurrency`, `formatDate`, etc.)
- Sample files migrated (BuyersPage.tsx)

🔄 **Current Approach:**
- **UI components:** Keep using `@/app/components/ui/` (existing location)
- **Shared utilities:** Use `@shared/utils` (new shared location)  
- **Portal code:** Use `@admin` or `@vendor` aliases

📋 **Future:**
- Full UI component migration
- Shared types
- Shared hooks

---

## New Path Aliases

The following path aliases are now configured in `vite.config.ts`:

```typescript
{
  '@': './src',              // Root src directory
  '@shared': './src/shared', // Shared code between portals
  '@admin': './src/admin',   // Admin portal code
  '@vendor': './src/vendor', // Vendor portal code
}
```

---

## Migration Patterns

### Before (Old Relative Imports)

```typescript
// ❌ OLD - Relative imports
import { Button } from '../../../../app/components/ui/button';
import { Card } from '../../../../app/components/ui/card';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Order } from '../../../types/order';
```

### After (New Path Aliases)

```typescript
// ✅ NEW - Path aliases
import { Button } from '@shared/components/ui/button';
import { Card } from '@shared/components/ui/card';
import { formatCurrency } from '@shared/utils';
import { Order } from '@admin/types/order';
```

---

## Import Rules by Category

### 1. Shared UI Components

**Old:**
```typescript
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Dialog } from '../../../../app/components/ui/dialog';
```

**New:**
```typescript
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Dialog } from '@shared/components/ui/dialog';
```

**Or use index import:**
```typescript
import { Button, Input, Dialog } from '@shared/components/ui';
```

---

### 2. Shared Utilities

**Old:**
```typescript
// Inline formatting functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
```

**New:**
```typescript
import { formatCurrency, formatDate, formatTime } from '@shared/utils';
```

**Available utilities:**
- `formatCurrency(amount)` - Format with ₹ symbol
- `formatAmount(amount)` - Format without symbol
- `formatCurrencyWithDecimals(amount)` - With 2 decimal places
- `formatCurrencyCompact(amount)` - K/L/Cr notation
- `formatDate(date)` - "Jan 8, 2026"
- `formatDateShort(date)` - "08 Jan"
- `formatTime(time)` - "2:30 PM"
- `formatDateTime(date)` - "Jan 8, 2026 at 2:30 PM"
- `getRelativeTime(date)` - "2 hours ago"

---

### 3. Admin Portal Imports

**Old:**
```typescript
import { Order } from '../../../types/order';
import { mockOrders } from '../../../data/mockOrders';
import { DataTable } from '../../../components/common/DataTable';
```

**New:**
```typescript
import { Order } from '@admin/types/order';
import { mockOrders } from '@admin/data/mockOrders';
import { DataTable } from '@admin/components/common/DataTable';
```

---

### 4. Vendor Portal Imports

**Old:**
```typescript
import { VendorOrder } from '../../../types/vendorOrder';
import { mockVendorOrders } from '../../../mocks/orders.mock';
import { OrdersTable } from '../../../features/orders/components/OrdersTable';
```

**New:**
```typescript
import { VendorOrder } from '@vendor/types/vendorOrder';
import { mockVendorOrders } from '@vendor/mocks/orders.mock';
import { OrdersTable } from '@vendor/features/orders/components/OrdersTable';
```

---

## Complete Example Migration

### Admin Portal Page Example

**Before:**
```typescript
// src/admin/features/orders/pages/OrdersPage.tsx

import { Button } from '../../../../app/components/ui/button';
import { Card } from '../../../../app/components/ui/card';
import { Badge } from '../../../../app/components/ui/badge';
import { Input } from '../../../../app/components/ui/input';
import { Order } from '../../../types/order';
import { mockOrders } from '../../../data/mockOrders';
import { DataTable } from '../../../components/common/DataTable';
import { SearchFilterSection } from '../../../components/SearchFilterSection';

export function OrdersPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ... rest of component
}
```

**After:**
```typescript
// src/admin/features/orders/pages/OrdersPage.tsx

import { Button, Card, Badge, Input } from '@shared/components/ui';
import { formatCurrency, formatDate } from '@shared/utils';
import { Order } from '@admin/types/order';
import { mockOrders } from '@admin/data/mockOrders';
import { DataTable } from '@admin/components/common/DataTable';
import { SearchFilterSection } from '@admin/components/SearchFilterSection';

export function OrdersPage() {
  // Use imported formatCurrency directly
  // ... rest of component
}
```

---

## Benefits of New Structure

### ✅ Advantages

1. **Cleaner Imports** - No more `../../../../` nonsense
2. **Easier Refactoring** - Move files without breaking imports
3. **Clear Ownership** - `@admin` vs `@vendor` vs `@shared`
4. **DRY Code** - Shared utilities prevent duplication
5. **Better IDE Support** - Auto-complete works better
6. **Scalability** - Easy to add new portals

### 🎯 Best Practices

1. **Use `@shared` for:**
   - UI components (buttons, inputs, dialogs)
   - Utility functions (formatting, validation)
   - Common types (if truly identical)
   - Hooks (if truly reusable)

2. **Use `@admin` or `@vendor` for:**
   - Portal-specific components
   - Portal-specific types
   - Portal-specific business logic
   - Portal-specific context providers

3. **Never do:**
   - ❌ Import from `@admin` in vendor code
   - ❌ Import from `@vendor` in admin code
   - ❌ Put portal-specific code in `@shared`

---

## Migration Checklist

### Files to Update

#### Admin Portal
- [ ] `/src/admin/features/**/*.tsx` - All feature pages/components
- [ ] `/src/admin/components/**/*.tsx` - All admin components
- [ ] `/src/admin/app/AdminApp.tsx` - Main app file
- [ ] `/src/admin/context/*.tsx` - Context providers

#### Vendor Portal
- [ ] `/src/vendor/features/**/*.tsx` - All feature pages/components
- [ ] `/src/vendor/components/**/*.tsx` - All vendor components
- [ ] `/src/vendor/app/VendorApp.tsx` - Main app file
- [ ] `/src/vendor/context/*.tsx` - Context providers

### Common Replacements

Use find-and-replace (with regex) in your editor:

1. **UI Components:**
   ```
   Find:    from ['"](\.\.\/)+app\/components\/ui\/
   Replace: from '@shared/components/ui/
   ```

2. **Admin Types:**
   ```
   Find:    from ['"](\.\.\/)+types\/
   Replace: from '@admin/types/
   ```

3. **Admin Data:**
   ```
   Find:    from ['"](\.\.\/)+data\/
   Replace: from '@admin/data/
   ```

4. **Vendor Mocks:**
   ```
   Find:    from ['"](\.\.\/)+mocks\/
   Replace: from '@vendor/mocks/
   ```

---

## Testing After Migration

1. **Build Test:**
   ```bash
   npm run build
   ```

2. **Type Check:**
   - Ensure no TypeScript errors in IDE
   - Check import resolution

3. **Manual Testing:**
   - Navigate through all pages in both portals
   - Verify formatters work correctly
   - Check that UI components render properly

---

## Example Files Already Migrated

✅ **Completed:**
- `/src/admin/features/buyers/pages/BuyersPage.tsx`

---

## Quick Reference

### Shared Imports
```typescript
// UI Components
import { Button, Card, Badge, Input, Dialog } from '@shared/components/ui';

// Utils
import { 
  formatCurrency, 
  formatDate, 
  formatTime,
  formatDateTime 
} from '@shared/utils';

// CN utility (for Tailwind)
import { cn } from '@shared/components/ui/utils';
```

### Admin Portal Imports
```typescript
// Types
import { Order, Vendor, Settlement } from '@admin/types';

// Data/Mocks
import { mockOrders } from '@admin/data/mockOrders';

// Components
import { DataTable } from '@admin/components/common/DataTable';
import { AdminHeader } from '@admin/components/layout/AdminHeader';

// Context
import { useAdminAuth } from '@admin/context/AdminAuthContext';
```

### Vendor Portal Imports
```typescript
// Types
import { VendorOrder, Payout } from '@vendor/types';

// Mocks
import { mockOrders } from '@vendor/mocks/orders.mock';

// Components
import { OrdersTable } from '@vendor/features/orders/components/OrdersTable';
import { VendorHeader } from '@vendor/components/layout/VendorHeader';

// Context
import { useVendorAuth } from '@vendor/context/VendorAuthContext';
```

---

## Support

If you encounter issues:

1. Check that `vite.config.ts` has the correct aliases
2. Restart your dev server after vite.config changes
3. Clear build cache if needed
4. Check for typos in import paths
5. Ensure files exist at the expected paths

---

## Next Steps

1. Continue migrating admin portal files
2. Migrate vendor portal files
3. Extract common types to `@shared/types` if truly identical
4. Document any portal-specific patterns
5. Update this guide with lessons learned

---

## Recommended Import Pattern (Current)

**Use this pattern for all new/updated code:**

```typescript
// ✅ UI Components - Use existing @ alias
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

// ✅ Shared Utilities - Use relative path for now
// From /src/admin/features/buyers/pages/BuyersPage.tsx:
import { formatCurrency, formatDate } from '../../../../shared/utils';

// ✅ Admin-specific - Use @admin alias
import { Order } from '@admin/types/order';
import { mockOrders } from '@admin/data/mockOrders';
import { DataTable } from '@admin/components/common/DataTable';

// ✅ Vendor-specific - Use @vendor alias (from vendor files)
import { VendorOrder } from '@vendor/types/vendorOrder';
import { mockOrders } from '@vendor/mocks/orders.mock';
```

**Note:** The `@shared` alias is configured but use relative paths for shared utilities until we verify the alias works in all contexts. The `@admin` and `@vendor` aliases work correctly.