# Search + Filter Design Standard

**Version**: 1.0  
**Date**: January 10, 2026  
**Status**: Official Standard  
**Scope**: Admin Portal & Vendor Portal

---

## Important: Portal-Specific Styling

⚠️ **The search+filter component architecture is IDENTICAL across both portals, but the visual styling is INTENTIONALLY DIFFERENT.**

See `/DESIGN_SYSTEM_PHILOSOPHY.md` for the complete rationale.

### Admin Portal (Professional / Infrastructure-Grade)
- **Border**: `border` (1px solid)
- **Radius**: `rounded-lg` (8px)
- **Target Users**: RealServ operations team, power users
- **Style**: Minimal, efficient, professional

### Vendor Portal (Friendly / Consumer-Facing)
- **Border**: `border-2` (2px solid)
- **Radius**: `rounded-xl` (12px)
- **Target Users**: Small business owners, local vendors
- **Style**: Clear, approachable, easy to use

**The architecture, behavior, and usage patterns are 100% identical—only the border thickness and radius differ.**

---

## Executive Summary

After reviewing the search+filter implementation in both portals, we have a **consistent component architecture** but with **minor visual differences** in border styling. This document standardizes the pattern across both portals.

---

## Current Implementation Analysis

### Component Structure ✅ **IDENTICAL**

Both portals use the same `SearchFilterSection` component with identical:
- **Props interface** (searchPlaceholder, searchValue, onSearchChange, children, activeFilters, onClearAll)
- **ActiveFilter interface** (type, label, value, onRemove)
- **3-section layout**: Search Bar → Filter Toolbar → Active Filter Chips
- **Conditional rendering** of active filter chips section
- **Children pattern** for flexible filter controls

### Visual Differences - **INTENTIONAL DESIGN DECISION**

Both portals use identical component architecture, but with different visual styling optimized for their audiences:

| Element | Admin Portal | Vendor Portal | Rationale |
|---------|-------------|---------------|-----------|
| **Container border** | `border border-neutral-200` (1px) | `border-2 border-neutral-200` (2px) | Admin = professional, Vendor = approachable |
| **Container radius** | `rounded-lg` (8px) | `rounded-xl` (12px) | Admin = subtle, Vendor = friendly |
| **Search divider** | `border-b border-neutral-200` (1px) | `border-b-2 border-neutral-200` (2px) | Consistent with portal style |
| **Filter chips border** | `border-t border-primary-100` (1px) | `border-t-2 border-primary-100` (2px) | Consistent with portal style |
| **Chip button border** | `border border-neutral-300` (1px) | `border-2 border-neutral-300` (2px) | Consistent with portal style |

**This is intentional**, not a bug. See `/DESIGN_SYSTEM_PHILOSOPHY.md` for complete rationale.

---

## Standardized Patterns (Portal-Specific)

### 1. Visual Design

```
┌─────────────────────────────────────────────────────┐  ← 1px border, rounded-lg
│  Search Bar (white background)                      │
│  [🔍 Search placeholder...]                         │
├─────────────────────────────────────────────────────┤  ← 1px divider
│  Filter Toolbar (neutral-50 background)             │
│  [Dropdown ▼] [Dropdown ▼] [Button] [Button]       │
├─────────────────────────────────────────────────────┤  ← 1px divider (only if filters active)
│  Active Filters (primary-50/30 background)          │
│  Active filters: [Status: Active ×] [Clear all]    │
└─────────────────────────────────────────────────────┘
```

### 2. Component Code

**Location**: 
- Admin: `/src/admin/components/SearchFilterSection.tsx`
- Vendor: `/src/vendor/components/SearchFilterSection.tsx`

**Standard Implementation**:

```tsx
/**
 * SearchFilterSection Component
 * 
 * Standardized search + filter pattern for all list/table views
 * Follows RealServ Design Standards v1.0
 * 
 * @see /DESIGN_STANDARDS.md for full documentation
 */

import { ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../app/components/ui/input';

interface ActiveFilter {
  type: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface SearchFilterSectionProps {
  // Search
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;

  // Filters (rendered as children for flexibility)
  children: ReactNode;

  // Active filters
  activeFilters: ActiveFilter[];
  onClearAll: () => void;
}

export function SearchFilterSection({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
  activeFilters,
  onClearAll,
}: SearchFilterSectionProps) {
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      {/* Section 1: Search Bar */}
      <div className="p-4 border-b border-neutral-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Section 2: Filter Toolbar */}
      <div className="px-4 py-3 bg-neutral-50">
        <div className="flex items-center gap-3 flex-wrap">
          {children}
        </div>
      </div>

      {/* Section 3: Active Filter Chips (only shown when filters active) */}
      {hasActiveFilters && (
        <div className="px-4 py-3 bg-primary-50/30 border-t border-primary-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-neutral-600">Active filters:</span>
            
            {activeFilters.map((filter, index) => (
              <button
                key={index}
                onClick={filter.onRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
              >
                <span className="font-medium text-neutral-500">{filter.label}:</span>
                <span>{filter.value}</span>
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            ))}
            
            <button
              onClick={onClearAll}
              className="text-xs text-primary-700 hover:text-primary-800 font-medium underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 3. Usage Pattern

### Standard Page Implementation

```tsx
import { useState } from 'react';
import { SearchFilterSection } from '../../../components/SearchFilterSection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';

export function OrdersPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<OrderType | 'all'>('all');

  // Active filters for chips
  const activeFilters = [];
  if (statusFilter !== 'all') {
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusConfig[statusFilter].label,
      onRemove: () => setStatusFilter('all'),
    });
  }
  if (typeFilter !== 'all') {
    activeFilters.push({
      type: 'type',
      label: 'Type',
      value: typeConfig[typeFilter].label,
      onRemove: () => setTypeFilter('all'),
    });
  }

  const clearAllFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Manage and track all orders
        </p>
      </div>

      {/* Search + Filter Section */}
      <SearchFilterSection
        searchPlaceholder="Search by order number, buyer, or vendor..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
      >
        {/* Filter dropdowns */}
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as OrderType | 'all')}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="labor">Labor</SelectItem>
          </SelectContent>
        </Select>
      </SearchFilterSection>

      {/* Data Table */}
      <DataTable data={filteredOrders} columns={columns} />
    </div>
  );
}
```

---

## 4. Filter Control Types

### A. Dropdown Filters (Recommended for status, type, category)

```tsx
<Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectTrigger className="w-[160px] bg-white">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Statuses</SelectItem>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
  </SelectContent>
</Select>
```

**Use when:**
- Single-selection filters
- 3-10 options
- Mutually exclusive values (status, type)

### B. Toggle Button Filters (Use for categories/tags)

```tsx
{categories.map(category => (
  <button
    key={category}
    onClick={() => handleToggleCategory(category)}
    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
      selectedCategories.includes(category)
        ? 'bg-primary-100 border-primary-300 text-primary-700'
        : 'bg-white border-neutral-200 text-neutral-700 hover:border-primary-200 hover:bg-neutral-50'
    }`}
  >
    {category}
  </button>
))}
```

**Use when:**
- Multi-selection allowed
- Visual category labels
- 2-6 options
- Quick toggle behavior

### C. Date Range Picker

```tsx
<DateRangePicker
  dateRange={dateRange}
  onDateRangeChange={setDateRange}
/>
```

**Use when:**
- Filtering by date ranges
- Time-series data

---

## 5. Design Specifications

### Colors

| Element | Color | Usage |
|---------|-------|-------|
| **Container background** | `bg-white` | Main container |
| **Container border** | `border-neutral-200` | 1px solid |
| **Search background** | `bg-white` | Search input area |
| **Filter toolbar background** | `bg-neutral-50` | Light grey tint |
| **Active filters background** | `bg-primary-50/30` | Light blue tint (30% opacity) |
| **Active filters border-top** | `border-primary-100` | Blue-tinted divider |
| **Chip background** | `bg-white` | Filter chip |
| **Chip border** | `border-neutral-300` | Default state |
| **Chip hover border** | `border-neutral-400` | Hover state |
| **Chip text** | `text-neutral-700` | Main text |
| **Chip label** | `text-neutral-500` | "Status:" label |

### Spacing

| Element | Padding/Margin |
|---------|----------------|
| **Search section** | `p-4` (16px) |
| **Filter toolbar** | `px-4 py-3` (16px horizontal, 12px vertical) |
| **Active filters section** | `px-4 py-3` |
| **Filter items gap** | `gap-3` (12px) |
| **Chip gap** | `gap-2` (8px) |
| **Chip padding** | `px-3 py-1.5` (12px horizontal, 6px vertical) |

### Typography

| Element | Style |
|---------|-------|
| **Search placeholder** | Default input text |
| **Active filters label** | `text-xs font-medium text-neutral-600` |
| **Chip label** | `font-medium text-neutral-500` |
| **Chip value** | `text-sm text-neutral-700` |
| **Clear all button** | `text-xs font-medium underline` |

### Borders & Radii

| Element | Value |
|---------|-------|
| **Container border** | `border` (1px) |
| **Container radius** | `rounded-lg` (8px) |
| **Section dividers** | `border-b` / `border-t` (1px) |
| **Chip radius** | `rounded-full` |
| **Chip border** | `border` (1px) |

---

## 6. Responsive Behavior

### Desktop (≥1024px)
- All filters in single row
- Filter controls maintain minimum widths
- Chips wrap to new line if many active

### Tablet (768-1023px)
- Filters wrap to multiple rows if needed
- Maintain gap spacing
- Full-width search bar

### Mobile (<768px)
- Full-width search bar
- Filter dropdowns stack vertically
- Consider collapsible filter section for complex filters
- Horizontal scroll for chips if many active

---

## 7. Accessibility

✅ **Keyboard Navigation**
- Tab through search input → filter controls → chip remove buttons → clear all
- Enter/Space to activate buttons and selects
- Escape to clear search input

✅ **Screen Readers**
- Clear labels for all inputs
- Announce active filter count
- Announce when filters are added/removed

✅ **ARIA**
- `role="search"` on search input container
- `aria-label` on remove buttons
- `aria-live="polite"` on filter count

---

## 8. When to Use

### ✅ Use SearchFilterSection for:
- **List pages** with 20+ items (Orders, Vendors, Buyers, Materials, Tickets)
- **Table views** requiring search and filtering
- **Catalog pages** with category/type filters
- **Notification/Message lists**

### ❌ Do NOT use for:
- **Dashboard pages** (use stats cards instead)
- **Detail pages** (single record, no filtering needed)
- **Forms** (use form controls directly)
- **Settings pages** (no list to filter)
- **Simple lists** (<10 items, no search needed)

---

## 9. Portal-Specific Implementation Notes

### Admin Portal
Use the 1px border / 8px radius pattern shown in the code example above. This creates a professional, infrastructure-grade appearance optimized for power users.

### Vendor Portal
Use the 2px border / 12px radius pattern. Simply replace:
- `border` → `border-2`
- `rounded-lg` → `rounded-xl` (for container)
- All other dividers and chips get `border-2` as well

This creates a friendlier, more approachable appearance optimized for small business owners.

**Both patterns follow the exact same component architecture** - only visual weights differ.

---

## 10. Examples from Codebase

### Admin Portal Examples
✅ **Properly implemented**:
- `/src/admin/features/orders/pages/OrdersPage.tsx`
- `/src/admin/features/vendors/pages/VendorsPage.tsx`
- `/src/admin/features/buyers/pages/BuyersPage.tsx`
- `/src/admin/features/catalog/pages/MaterialsCatalogPage.tsx`
- `/src/admin/features/support/pages/SupportTicketsPage.tsx`

### Vendor Portal Examples
✅ **Properly implemented (with 2px/12px style)**:
- `/src/vendor/features/orders/pages/OrdersPage.tsx`
- `/src/vendor/features/catalog/pages/CatalogPage.tsx`
- `/src/vendor/features/support/pages/TicketsPage.tsx`
- `/src/vendor/features/notifications/pages/NotificationsPage.tsx`

---

## 11. Design Principles

### 1. **Consistency**
Same pattern everywhere = faster development, better UX, easier maintenance.

### 2. **Infrastructure-Grade UI**
Clean 1px borders, subtle backgrounds, professional appearance matching enterprise admin tools.

### 3. **Progressive Disclosure**
- Search always visible
- Filters always visible
- Active filter chips only show when filters applied

### 4. **Immediate Feedback**
- Filters apply instantly (no "Apply" button)
- Active filters show as removable chips
- "Clear all" provides quick reset

### 5. **Flexible Architecture**
- Children pattern allows any filter control type
- ActiveFilter interface supports any filter structure
- Composable and reusable

---

## Version History

**v1.0** - January 10, 2026  
**Status**: ✅ Both portals standardized with intentional design differences  
**Decision**: Option A - Document intentional UX differences (see `/DESIGN_SYSTEM_PHILOSOPHY.md`)

---

## Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| **Component architecture** | ✅ Identical across both portals | Fully standardized |
| **Props interface** | ✅ Identical across both portals | Fully standardized |
| **Layout structure** | ✅ Identical across both portals | Fully standardized |
| **Border styling** | ✅ Intentionally different | Admin = 1px, Vendor = 2px |
| **Border radius** | ✅ Intentionally different | Admin = 8px, Vendor = 12px |
| **Functionality** | ✅ Identical across both portals | Fully standardized |

**Current State**: Both portals use consistent SearchFilterSection architecture with portal-specific visual styling optimized for their target users. This is an intentional design decision, not a bug.

**No further action needed.** ✅