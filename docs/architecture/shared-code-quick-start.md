# Shared Code - Quick Start Guide

**Last Updated**: January 2026  
**For**: Developers working on RealServ portals

---

## TL;DR - What Changed?

✅ **New shared utilities** for currency and date formatting  
✅ **Path aliases** configured (`@shared`, `@admin`, `@vendor`)  
✅ **Cleaner imports** - no more `../../../../`

---

## How to Use (Copy & Paste)

### Currency Formatting

```typescript
// ✅ DO THIS
import { formatCurrency } from '@shared/utils';

const price = formatCurrency(1500); // "₹1,500"
```

```typescript
// ❌ DON'T DO THIS
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
```

### Date Formatting

```typescript
// ✅ DO THIS
import { formatDate, formatTime, formatDateTime } from '@shared/utils';

const orderDate = formatDate('2026-01-08'); // "Jan 8, 2026"
const deliveryTime = formatTime('14:30');   // "2:30 PM"
const timestamp = formatDateTime(new Date()); // "Jan 8, 2026 at 2:30 PM"
```

### Complete Import Pattern

```typescript
// UI Components - keep using @ alias
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

// Shared utilities - NEW!
import { formatCurrency, formatDate } from '@shared/utils';

// Portal-specific code
import { Order } from '@admin/types/order';
import { mockOrders } from '@admin/data/mockOrders';
import { DataTable } from '@admin/components/common/DataTable';
```

---

## Available Utilities

### Currency

| Function | Example Output |
|----------|---------------|
| `formatCurrency(1500)` | ₹1,500 |
| `formatAmount(1500)` | 1,500 |
| `formatCurrencyWithDecimals(1500.5)` | ₹1,500.50 |
| `formatCurrencyCompact(150000)` | ₹1.5L |

### Date & Time

| Function | Example Output |
|----------|---------------|
| `formatDate('2026-01-08')` | Jan 8, 2026 |
| `formatDateShort('2026-01-08')` | 08 Jan |
| `formatTime('14:30')` | 2:30 PM |
| `formatDateTime(new Date())` | Jan 8, 2026 at 2:30 PM |
| `getRelativeTime(new Date())` | Just now |

---

## Path Aliases

| Alias | Points To | Use For |
|-------|-----------|---------|
| `@` | `/src` | Root imports |
| `@shared` | `/src/shared` | Shared utilities, types, hooks |
| `@admin` | `/src/admin` | Admin portal code |
| `@vendor` | `/src/vendor` | Vendor portal code |

---

## Rules

### ✅ DO:

- Use `@shared/utils` for formatting functions
- Use `@admin` or `@vendor` for portal-specific code
- Remove inline formatter functions

### ❌ DON'T:

- Create duplicate formatting functions
- Import `@admin` code in vendor portal (or vice versa)
- Put portal-specific logic in `@shared`

---

## Need More Info?

- **Full details**: [Shared Code Structure](./shared-code-structure.md)
- **Migration guide**: [Import Migration Guide](../development/import-migration-guide.md)
- **Standards**: [Engineering Standards](../development/standards.md)

---

**Questions?** Check the documentation or ask the team!
