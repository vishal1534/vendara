# Shared Code Structure

**Last Updated**: January 2026  
**Status**: Production-Ready

---

## Overview

The `/src/shared` directory contains code that is shared between the Admin and Vendor portals. This structure improves maintainability, reduces duplication, and creates clear boundaries between portal-specific and shared code.

---

## Directory Structure

```
src/shared/
├── components/
│   └── ui/                    # Shared UI components (shadcn/ui)
│       ├── index.ts           # Re-exports from /src/app/components/ui
│       └── utils.ts           # cn() utility function
│
├── utils/                     # Shared utility functions
│   ├── formatCurrency.ts      # Currency formatting utilities
│   ├── formatDate.ts          # Date/time formatting utilities
│   └── index.ts               # Central export point
│
├── types/                     # Shared TypeScript types (future)
│   └── index.ts
│
├── hooks/                     # Shared React hooks (future)
│   └── index.ts
│
├── constants/                 # Shared constants (future)
│   └── index.ts
│
├── lib/                       # Third-party library configs (future)
│   └── index.ts
│
└── README.md                  # This documentation
```

---

## Components

### UI Components (`/src/shared/components/ui/`)

All shadcn/ui components are re-exported from their original location in `/src/app/components/ui/`. This maintains backward compatibility while establishing the new shared structure.

**Usage:**
```typescript
// Individual imports
import { Button } from '@shared/components/ui/button';
import { Card } from '@shared/components/ui/card';

// Bulk import from index
import { Button, Card, Dialog } from '@shared/components/ui';
```

**Available Components:**
- Accordion, Alert, Alert Dialog, Aspect Ratio
- Avatar, Badge, Breadcrumb, Button
- Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Command, Context Menu
- Dialog, Drawer, Dropdown Menu
- Form, Hover Card
- Input, Input OTP
- Label, Menubar, Navigation Menu
- Pagination, Popover, Progress
- Radio Group, Resizable, Scroll Area
- Select, Separator, Sheet, Sidebar, Skeleton, Slider
- Sonner (toast), Switch
- Table, Tabs, Textarea
- Toggle, Toggle Group, Tooltip

**Utility Functions:**
```typescript
import { cn } from '@shared/components/ui/utils';

// Merge Tailwind classes
const className = cn('base-class', condition && 'conditional-class');
```

---

## Utilities

### Currency Formatting (`/src/shared/utils/formatCurrency.ts`)

**Functions:**

#### `formatCurrency(amount: number): string`
Format amount with ₹ symbol
```typescript
formatCurrency(1500)        // "₹1,500"
formatCurrency(45000)       // "₹45,000"
formatCurrency(1234567)     // "₹12,34,567"
```

#### `formatAmount(amount: number): string`
Format amount without currency symbol
```typescript
formatAmount(1500)          // "1,500"
formatAmount(45000)         // "45,000"
```

#### `formatCurrencyWithDecimals(amount: number): string`
Format with 2 decimal places
```typescript
formatCurrencyWithDecimals(1500.5)   // "₹1,500.50"
formatCurrencyWithDecimals(45000)    // "₹45,000.00"
```

#### `formatCurrencyCompact(amount: number): string`
Compact notation (K/L/Cr)
```typescript
formatCurrencyCompact(5000)          // "₹5.0K"
formatCurrencyCompact(150000)        // "₹1.5L"
formatCurrencyCompact(25000000)      // "₹2.5Cr"
```

**Indian Numbering System:**
- K = Thousand (1,000)
- L = Lakh (1,00,000)
- Cr = Crore (1,00,00,000)

---

### Date & Time Formatting (`/src/shared/utils/formatDate.ts`)

**Functions:**

#### `formatDate(date: string | Date): string`
Standard date format
```typescript
formatDate('2026-01-08')              // "Jan 8, 2026"
formatDate(new Date())                // "Jan 8, 2026"
```

#### `formatDateShort(date: string | Date): string`
Short date format
```typescript
formatDateShort('2026-01-08')         // "08 Jan"
```

#### `formatDateFull(date: string | Date): string`
Full date format
```typescript
formatDateFull('2026-01-08')          // "Wednesday, January 8, 2026"
```

#### `formatTime(time: string): string`
12-hour time format
```typescript
formatTime('14:30')                   // "2:30 PM"
formatTime('09:00')                   // "9:00 AM"
formatTime('2026-01-08T14:30:00Z')    // "2:30 PM"
```

#### `formatDateTime(date: string | Date): string`
Combined date and time
```typescript
formatDateTime('2026-01-08T14:30:00')  // "Jan 8, 2026 at 2:30 PM"
```

#### `formatDateTimeShort(date: string | Date): string`
Short date and time
```typescript
formatDateTimeShort('2026-01-08T14:30:00')  // "08 Jan, 2:30 PM"
```

#### `getRelativeTime(date: string | Date): string`
Relative time from now
```typescript
getRelativeTime(new Date())                    // "Just now"
getRelativeTime(new Date(Date.now() - 60000))  // "1 min ago"
getRelativeTime(new Date(Date.now() - 7200000)) // "2 hours ago"
getRelativeTime('2026-01-01')                   // "7 days ago" or formatted date
```

#### `formatDateForInput(date: string | Date): string`
ISO format for input fields
```typescript
formatDateForInput(new Date())        // "2026-01-08"
```

---

## Usage Examples

### Before (Duplicated Code)

**Admin Portal:**
```typescript
// src/admin/features/orders/pages/OrdersPage.tsx
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN');
};
```

**Vendor Portal:**
```typescript
// src/vendor/features/payouts/pages/PayoutsPage.tsx
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
// Same duplication!
```

### After (Shared Utilities)

**Both Portals:**
```typescript
import { formatCurrency, formatDate } from '@shared/utils';

// Use directly
const total = formatCurrency(order.total);
const orderDate = formatDate(order.createdAt);
```

**Benefits:**
- ✅ Single source of truth
- ✅ Consistent formatting across portals
- ✅ Easier to update (change once, applies everywhere)
- ✅ Better tested (test once, trust everywhere)

---

## Import Patterns

### Recommended Imports

```typescript
// UI Components - Individual
import { Button } from '@shared/components/ui/button';
import { Card } from '@shared/components/ui/card';

// UI Components - Bulk
import { Button, Card, Dialog, Input } from '@shared/components/ui';

// Utilities - Named imports
import { formatCurrency, formatDate } from '@shared/utils';

// Utilities - Specific file
import { formatCurrency } from '@shared/utils/formatCurrency';
import { formatDate } from '@shared/utils/formatDate';

// CN utility
import { cn } from '@shared/components/ui/utils';
```

---

## Rules & Guidelines

### ✅ DO:

1. **Use shared utilities** instead of duplicating code
2. **Import from `@shared`** using path aliases
3. **Document** what portals use each shared module
4. **Test** shared code thoroughly (affects both portals)
5. **Keep it simple** - only share truly identical code
6. **Version carefully** - breaking changes affect both portals

### ❌ DON'T:

1. **Don't put portal-specific logic** in shared code
2. **Don't create tight coupling** between portals via shared code
3. **Don't over-abstract** - share when it makes sense
4. **Don't forget to update docs** when adding shared code
5. **Don't import `@admin` in vendor** or vice versa
6. **Don't share just to share** - duplication is okay if code will diverge

---

## Adding New Shared Code

### Checklist for New Shared Code

Before adding code to `/src/shared`:

1. **Is it truly identical?**
   - Will both portals use the exact same implementation?
   - Or will it need customization per portal?

2. **Will it stay identical?**
   - Is this code stable or likely to diverge?
   - Do portals have different future requirements?

3. **Is it reusable?**
   - Does it make sense as a standalone utility?
   - Or is it tightly coupled to one portal's logic?

4. **Is it well-tested?**
   - Can you write tests that apply to both use cases?
   - Does it handle edge cases?

If "YES" to all → **Add to `/src/shared`**  
If "NO" to any → **Keep it portal-specific**

---

### Example: Adding a New Utility

**Step 1: Create the utility**
```typescript
// /src/shared/utils/formatPhoneNumber.ts

/**
 * Format Indian phone number
 * 
 * @shared Used by: Admin Portal, Vendor Portal
 * 
 * @param phone - 10-digit phone number
 * @returns Formatted phone number (e.g., "+91 7906441952")
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    return phone; // Return as-is if invalid
  }
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}
```

**Step 2: Export from index**
```typescript
// /src/shared/utils/index.ts
export { formatPhoneNumber } from './formatPhoneNumber';
```

**Step 3: Use in portals**
```typescript
// Admin or Vendor portal
import { formatPhoneNumber } from '@shared/utils';

const displayPhone = formatPhoneNumber(user.phone);
```

**Step 4: Document**
- Add to this file under "Utilities" section
- Update import migration guide
- Add JSDoc comments

---

## Future Enhancements

### Planned Additions

#### Shared Types (`/src/shared/types/`)
For types truly identical across portals:
```typescript
// /src/shared/types/common.ts
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';
```

#### Shared Hooks (`/src/shared/hooks/`)
For reusable React hooks:
```typescript
// /src/shared/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  // ... implementation
}
```

#### Shared Constants (`/src/shared/constants/`)
For constants used by both portals:
```typescript
// /src/shared/constants/orderStates.ts
export const ORDER_STATES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  // ...
} as const;
```

#### Shared API Client (`/src/shared/lib/`)
For API configuration:
```typescript
// /src/shared/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  // ... config
});
```

---

## Migration Status

### ✅ Completed

- [x] Create `/src/shared` directory structure
- [x] Add path aliases to `vite.config.ts`
- [x] Create shared UI components bridge
- [x] Extract currency formatting utilities
- [x] Extract date/time formatting utilities
- [x] Create comprehensive documentation
- [x] Update sample files (BuyersPage.tsx)

### 🔄 In Progress

- [ ] Migrate all admin portal imports
- [ ] Migrate all vendor portal imports

### 📋 Planned

- [ ] Extract common types to `/src/shared/types`
- [ ] Create shared hooks in `/src/shared/hooks`
- [ ] Add shared constants
- [ ] Create shared API client
- [ ] Add unit tests for shared utilities

---

## Testing Shared Code

### Manual Testing

After making changes to shared code:

1. **Test in Admin Portal**
   - Navigate to pages using the utility
   - Verify output is correct
   - Check edge cases

2. **Test in Vendor Portal**
   - Same verification as admin
   - Ensure consistent behavior

3. **Visual Regression**
   - Check UI components render correctly
   - Verify formatting looks good

### Automated Testing (Future)

```typescript
// /src/shared/utils/__tests__/formatCurrency.test.ts
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats basic amount', () => {
    expect(formatCurrency(1500)).toBe('₹1,500');
  });

  it('handles large amounts', () => {
    expect(formatCurrency(1234567)).toBe('₹12,34,567');
  });
});
```

---

## Troubleshooting

### Import not found

**Problem:** `Cannot find module '@shared/utils'`

**Solutions:**
1. Restart dev server after vite.config changes
2. Check path alias in `vite.config.ts`
3. Verify file exists at expected path
4. Clear build cache: `rm -rf node_modules/.vite`

### Types not working

**Problem:** TypeScript can't find types from `@shared`

**Solutions:**
1. Check `tsconfig.json` has correct paths (if exists)
2. Restart TypeScript server in IDE
3. Rebuild project

### Different output than expected

**Problem:** Formatted values look wrong

**Solutions:**
1. Check function parameters
2. Verify locale settings ('en-IN' for India)
3. Check date-fns version
4. Review function documentation

---

## Related Documentation

- [Multi-Portal Structure Guide](./multi-portal-structure.md)
- [Independent Deployment Guide](./independent-deployment-guide.md)
- [Import Migration Guide](../development/import-migration-guide.md)
- [Development Standards](../development/standards.md)

---

## Maintenance

### Regular Tasks

- [ ] Review shared code usage quarterly
- [ ] Remove unused shared code
- [ ] Update documentation when adding new utilities
- [ ] Refactor when patterns emerge
- [ ] Consider extracting to packages when scaling to 5+ portals

### Change Log

**January 2026:**
- Initial shared code structure
- Currency formatting utilities
- Date/time formatting utilities
- UI components bridge

---

## Support

For questions or issues with shared code:

1. Check this documentation first
2. Review import migration guide
3. Check function JSDoc comments
4. Test in isolation
5. Ask team for help

---

**Remember:** Shared code is powerful but requires discipline. Only share what's truly identical and will remain so!
