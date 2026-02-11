# Stat Card Design Standard

## Overview

This document defines the standardized design pattern for stat cards (KPI cards, metric cards) across RealServ portals. All stat cards must follow this consistent design to maintain visual coherence and professional appearance.

## Problem Statement

Inconsistent stat card layouts across the application create visual clutter and reduce professionalism:
- Some cards have icons on the right
- Some cards have icons centered or in different positions
- Inconsistent spacing and hierarchy
- Different text sizes and colors

## Standard Design Pattern

### ✅ Correct Layout

```
┌─────────────────────────────────────┐
│  Label                      [Icon]  │
│  Value (Large)                      │
│  Subtitle / Trend                   │
└─────────────────────────────────────┘
```

**Structure:**
- **Left Side**: Text content (label, value, subtitle/trend) - takes full width
- **Right Side**: Icon in colored background box - fixed size, top-aligned

### Visual Specifications

#### Container
- Background: `bg-white`
- Border: `border-2 border-neutral-200`
- Radius: `rounded-xl`
- Padding: `p-6`
- Layout: `flex items-start justify-between`

#### Left Content Area
- Wrapper: `flex-1` (takes remaining space)
- Label: `text-sm text-neutral-600 mb-1`
- Value: `text-2xl font-bold text-neutral-900`
- Subtitle (if no trend): `text-xs text-neutral-500 mt-1`
- Trend (if provided): `mt-2 flex items-center gap-1`
  - Value: `text-sm font-medium text-success-600` or `text-error-600`
  - Label: `text-xs text-neutral-500`

#### Right Icon Area
- Container: `w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`
- Background: Contextual (e.g., `bg-primary-100`, `bg-success-100`)
- Icon: `w-6 h-6` with contextual color (e.g., `text-primary-700`)

## Component API

### Vendor Portal: `<StatCard />`

```tsx
import { StatCard } from '../components/StatCard';
import { Package } from 'lucide-react';

<StatCard
  icon={Package}
  iconBgColor="bg-primary-100"
  iconColor="text-primary-700"
  label="Active Orders"
  value={4}
  subtitle="Orders in progress"
/>

// With trend
<StatCard
  icon={TrendingUp}
  iconBgColor="bg-success-100"
  iconColor="text-success-700"
  label="This Month"
  value={28}
  trend={{ value: 15.2, label: 'vs last month' }}
/>
```

**Props:**
- `icon: LucideIcon` - Icon component from lucide-react
- `iconBgColor?: string` - Background color class (default: `bg-primary-100`)
- `iconColor?: string` - Icon color class (default: `text-primary-700`)
- `label: string` - Top label text
- `value: string | number` - Main metric value
- `subtitle?: string` - Bottom descriptive text (mutually exclusive with trend)
- `trend?: { value: number; label: string }` - Trend indicator with percentage and label

### Admin Portal: `<StatsCard />`

```tsx
import { StatsCard } from '../components/common/StatsCard';
import { Users } from 'lucide-react';

<StatsCard
  title="Total Users"
  value="1,234"
  icon={Users}
  iconColor="text-primary-600"
  iconBgColor="bg-primary-100"
  trend={{ value: 12.5, label: 'vs last month' }}
/>
```

**Props:**
- `title: string` - Top label text
- `value: string | number` - Main metric value
- `icon: LucideIcon` - Icon component
- `iconColor?: string` - Icon color class (default: `text-primary-600`)
- `iconBgColor?: string` - Background color class (default: `bg-primary-100`)
- `trend?: { value: number; label: string }` - Trend indicator

## Icon Color Palette

Use semantic colors to convey meaning:

| Context | Background | Icon | Usage |
|---------|-----------|------|-------|
| Primary | `bg-primary-100` | `text-primary-700` | Default, active items |
| Success | `bg-success-100` | `text-success-700` | Positive metrics, growth |
| Warning | `bg-warning-100` | `text-warning-700` | Pending, attention needed |
| Error | `bg-error-100` | `text-error-700` | Issues, declined items |
| Secondary | `bg-secondary-100` | `text-secondary-700` | Neutral metrics |
| Neutral | `bg-neutral-100` | `text-neutral-700` | Generic data |

### Dashboard Examples

**Orders Dashboard:**
```tsx
// Active orders - primary
<StatCard
  icon={Package}
  iconBgColor="bg-primary-100"
  iconColor="text-primary-700"
  label="Active Orders"
  value={4}
  subtitle="Orders in progress"
/>

// Growth metric - success
<StatCard
  icon={TrendingUp}
  iconBgColor="bg-success-100"
  iconColor="text-success-700"
  label="This Month"
  value={28}
  subtitle="Total orders"
/>

// Pending money - warning
<StatCard
  icon={Wallet}
  iconBgColor="bg-warning-100"
  iconColor="text-warning-700"
  label="Pending Payout"
  value="₹28,875"
  subtitle="Awaiting settlement"
/>

// Total earnings - secondary
<StatCard
  icon={DollarSign}
  iconBgColor="bg-secondary-100"
  iconColor="text-secondary-700"
  label="Total Earned"
  value="₹0"
  subtitle="All time earnings"
/>
```

## Grid Layout

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard ... />
  <StatCard ... />
  <StatCard ... />
  <StatCard ... />
</div>
```

**Breakpoints:**
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 4 columns
- Gap: `gap-4` (1rem / 16px)

## Do's and Don'ts

### ✅ DO
- Always place icon top-right
- Use semantic colors consistently
- Maintain 2xl font size for values
- Keep labels concise (1-3 words)
- Use proper icon size (w-6 h-6)
- Add flex-shrink-0 to icon container
- Use trend OR subtitle, not both

### ❌ DON'T
- Don't center icons
- Don't place icons on the left
- Don't use custom icon sizes
- Don't mix different border styles
- Don't use background colors on cards
- Don't create inline stat card markup
- Don't omit iconBgColor for visual consistency

## Implementation Checklist

When adding a new stat card to a page:

- [ ] Import StatCard/StatsCard component
- [ ] Choose appropriate icon from lucide-react
- [ ] Select semantic color pair (background + icon color)
- [ ] Use short, clear label
- [ ] Format value appropriately (currency, number, etc.)
- [ ] Add subtitle OR trend, not both
- [ ] Wrap multiple cards in responsive grid
- [ ] Test on mobile, tablet, and desktop

## Examples by Use Case

### Financial Metrics
```tsx
<StatCard
  icon={DollarSign}
  iconBgColor="bg-success-100"
  iconColor="text-success-700"
  label="Revenue"
  value={formatCurrency(145000)}
  trend={{ value: 23.5, label: 'vs last month' }}
/>
```

### Count Metrics
```tsx
<StatCard
  icon={Users}
  iconBgColor="bg-primary-100"
  iconColor="text-primary-700"
  label="Active Users"
  value={1234}
  subtitle="Logged in today"
/>
```

### Status Indicators
```tsx
<StatCard
  icon={AlertCircle}
  iconBgColor="bg-error-100"
  iconColor="text-error-700"
  label="Open Issues"
  value={7}
  subtitle="Requires attention"
/>
```

### Performance Metrics
```tsx
<StatCard
  icon={TrendingUp}
  iconBgColor="bg-success-100"
  iconColor="text-success-700"
  label="Conversion Rate"
  value="94.2%"
  trend={{ value: 5.3, label: 'vs last week' }}
/>
```

## Migration Guide

### Before (Inline Markup)
```tsx
<div className="bg-white rounded-xl border-2 border-neutral-200 p-6">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <p className="text-sm text-neutral-600 mb-1">Active Orders</p>
      <p className="text-2xl font-bold text-neutral-900">4</p>
      <p className="text-xs text-neutral-500 mt-1">Orders in progress</p>
    </div>
    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <Package className="w-6 h-6 text-primary-700" />
    </div>
  </div>
</div>
```

### After (Component)
```tsx
<StatCard
  icon={Package}
  iconBgColor="bg-primary-100"
  iconColor="text-primary-700"
  label="Active Orders"
  value={4}
  subtitle="Orders in progress"
/>
```

## Testing

Verify your stat cards:

1. **Visual Consistency**: All icons aligned top-right
2. **Responsive**: Test on mobile, tablet, desktop
3. **Accessibility**: Labels are readable, sufficient color contrast
4. **Content**: Values format correctly (currency, numbers)
5. **Hover States**: No unexpected interactions
6. **Grid Layout**: Proper spacing and alignment

## Related Standards

- [DESIGN_SYSTEM_PHILOSOPHY.md](/DESIGN_SYSTEM_PHILOSOPHY.md) - Overall design principles
- [SEARCH_FILTER_DESIGN_STANDARD.md](/SEARCH_FILTER_DESIGN_STANDARD.md) - Search/filter patterns
- [/src/vendor/components/StatCard.tsx](/src/vendor/components/StatCard.tsx) - Implementation
- [/src/admin/components/common/StatsCard.tsx](/src/admin/components/common/StatsCard.tsx) - Admin implementation

## Version History

- **v1.0** (2026-01-12): Initial standard based on vendor portal audit
