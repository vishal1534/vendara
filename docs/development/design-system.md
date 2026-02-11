# RealServ Design System

**Last Updated**: January 2026  
**Version**: 1.0

> 📖 **Note**: For detailed design standards including all feedback components, see `/DESIGN_STANDARDS.md` in the project root.

---

## Overview

The RealServ design system is built on construction-native colors and infrastructure-grade UI patterns, creating a professional aesthetic specifically tailored for the construction industry.

---

## Color Palette

### Construction-Native Colors

Our color palette is derived from real construction materials:

```css
/* Primary - Steel Blue-Grey */
--primary-50: #F0F2F3;
--primary-100: #D9DFE1;
--primary-600: #2F3E46;
--primary-700: #252F35;
--primary-800: #1A2329;

/* Secondary - Sandstone */
--secondary-50: #FAF8F5;
--secondary-100: #F0EBE3;
--secondary-600: #D2B48C;
--secondary-700: #B8956B;

/* Success - Success Blue-Grey */
--success-600: #4A5D73;
--success-700: #3A4A5C;

/* Warning - Site Amber */
--warning-50: #FEF7EE;
--warning-600: #C47A2C;
--warning-700: #A86524;

/* Error - Brick Red */
--error-50: #FEF2F2;
--error-600: #8B2C2C;
--error-700: #722323;

/* Neutral - Cement-inspired Greys */
--neutral-50: #FAFAFA;
--neutral-100: #F5F5F5;
--neutral-200: #E5E5E5;
--neutral-300: #D4D4D4;
--neutral-400: #A3A3A3;
--neutral-500: #737373;
--neutral-600: #525252;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;
```

### Color Usage

| Color | Use Case | Example |
|-------|----------|---------|
| **Primary** | Main actions, headers, navigation | Primary buttons, active nav items |
| **Secondary** | Secondary actions, accents | Secondary buttons, badges |
| **Success** | Confirmations, completed states | Success messages, completed orders |
| **Warning** | Warnings, pending states | Warning alerts, pending items |
| **Error** | Errors, critical states | Error messages, failed items |
| **Neutral** | Text, borders, backgrounds | Body text, card borders |

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

### Type Scale

| Size | Token | Usage |
|------|-------|-------|
| 12px | `text-xs` | Captions, labels |
| 14px | `text-sm` | Body text, form inputs |
| 16px | `text-base` | Primary body text |
| 18px | `text-lg` | Subheadings |
| 20px | `text-xl` | Section headings |
| 24px | `text-2xl` | Page titles |
| 30px | `text-3xl` | Large numbers, KPIs |

### Font Weights

| Weight | Token | Usage |
|--------|-------|-------|
| 400 | `font-normal` | Body text |
| 500 | `font-medium` | Labels, emphasis |
| 600 | `font-semibold` | Headings, buttons |
| 700 | `font-bold` | Strong emphasis |

---

## Spacing

Consistent spacing using Tailwind's spacing scale:

| Token | Size | Usage |
|-------|------|-------|
| `gap-1` / `p-1` | 4px | Tight spacing |
| `gap-2` / `p-2` | 8px | Small spacing |
| `gap-3` / `p-3` | 12px | Default spacing |
| `gap-4` / `p-4` | 16px | Medium spacing |
| `gap-6` / `p-6` | 24px | Large spacing |
| `gap-8` / `p-8` | 32px | Extra large spacing |

---

## Components

### Buttons

```tsx
// Primary Button
<Button variant="default">
  Primary Action
</Button>

// Secondary Button
<Button variant="outline">
  Secondary Action
</Button>

// Destructive Button
<Button variant="destructive">
  Delete
</Button>

// Ghost Button
<Button variant="ghost">
  Cancel
</Button>
```

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
  <CardFooter>
    {/* footer actions */}
  </CardFooter>
</Card>
```

### Badges

```tsx
// Status Badges
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline">Draft</Badge>
```

### Stats Cards (Admin & Vendor)

```tsx
<StatsCard
  title="Total Orders"
  value="1,234"
  change="+12.5%"
  trend="up"
  icon={<Package className="w-5 h-5" />}
/>
```

---

## Layout Patterns

### Page Layout

```tsx
export function Page() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Page Title
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Page description
          </p>
        </div>
        <Button>Primary Action</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard {...} />
      </div>

      {/* Main Content */}
      <Card>
        <CardContent>
          {/* content */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Search & Filter Pattern

```tsx
<SearchFilterSection
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search orders..."
  filters={
    <>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </>
  }
  activeFilters={activeFilters}
  onClearFilters={handleClearFilters}
/>
```

---

## Feedback Components

### Toasts (Sonner)

```tsx
import { toast } from 'sonner';

toast.success('Order created successfully');
toast.error('Failed to process request');
toast.info('Processing your request...');
toast.warning('Please review before submitting');
```

### Loading States

```tsx
// Full page loading
<LoadingState message="Loading orders..." />

// Inline loading
{loading ? (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-neutral-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
) : (
  <Content />
)}
```

### Empty States

```tsx
<EmptyState
  icon={<Package className="w-12 h-12" />}
  title="No orders found"
  description="There are no orders matching your criteria"
  action={
    <Button onClick={handleAction}>
      Create Order
    </Button>
  }
/>
```

### Error States

```tsx
<ErrorState
  message="Failed to load data"
  onRetry={handleRetry}
/>
```

---

## Data Display

### Tables

```tsx
<DataTable
  data={orders}
  columns={[
    {
      key: 'orderNumber',
      label: 'Order Number',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (order) => <StatusBadge status={order.status} />,
    },
  ]}
  searchable
  searchPlaceholder="Search orders..."
/>
```

### Status Indicators

```tsx
<StatusBadge status="completed" />
<StatusBadge status="pending" />
<StatusBadge status="cancelled" />
```

---

## Forms

### Form Layout

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <Label htmlFor="name">Name *</Label>
    <Input
      id="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </div>
  
  <div>
    <Label htmlFor="category">Category</Label>
    <Select value={category} onValueChange={setCategory}>
      <SelectTrigger id="category">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="materials">Materials</SelectItem>
        <SelectItem value="labor">Labor</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  <div className="flex gap-3 justify-end">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit">
      Submit
    </Button>
  </div>
</form>
```

---

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Responsive Patterns

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* items */}
</div>

// Responsive text
<h1 className="text-xl md:text-2xl lg:text-3xl">Title</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* content */}
</div>

// Hide on mobile
<div className="hidden md:block">
  {/* desktop only */}
</div>

// Show on mobile only
<div className="block md:hidden">
  {/* mobile only */}
</div>
```

---

## Icons

We use **lucide-react** for all icons:

```tsx
import { 
  Package, 
  User, 
  Settings, 
  ChevronRight,
  Search,
  Filter 
} from 'lucide-react';

<Package className="w-5 h-5 text-neutral-600" />
```

### Icon Sizes

| Size | Class | Usage |
|------|-------|-------|
| 16px | `w-4 h-4` | Small icons, inline |
| 20px | `w-5 h-5` | Default icons |
| 24px | `w-6 h-6` | Larger icons |
| 48px | `w-12 h-12` | Empty states |

---

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Provide labels for form inputs
- Use ARIA attributes when needed
- Ensure sufficient color contrast (WCAG AA)
- Support keyboard navigation
- Provide focus indicators

---

## Resources

- **Complete Design Standards**: `/DESIGN_STANDARDS.md`
- **shadcn/ui Documentation**: [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **lucide-react Icons**: [lucide.dev](https://lucide.dev)

---

**For complete design standards including all feedback components and detailed specifications, refer to `/DESIGN_STANDARDS.md` in the project root.**
