# RealServ Admin Portal Architecture

**Last Updated**: January 2026  
**Status**: Production Ready ✅

---

## Overview

The Admin Portal is a desktop-first React web application for RealServ's operations team to manage vendors, orders, buyers, settlements, catalog, and platform operations.

---

## Entry Points

### HTML Entry
**File**: `/admin.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/admin-favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RealServ Admin Portal</title>
    <meta name="description" content="RealServ Operations Dashboard" />
    <meta name="robots" content="noindex, nofollow" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/admin-main.tsx"></script>
  </body>
</html>
```

### JavaScript Entry
**File**: `/src/admin-main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './admin/app/AdminApp';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
```

---

## Directory Structure

```
/src/admin/
├── app/
│   ├── AdminApp.tsx          # Root component with providers
│   └── routes.tsx            # Route configuration
│
├── features/                 # Feature modules
│   ├── dashboard/           # Dashboard page
│   ├── vendors/             # Vendor management
│   ├── orders/              # Order oversight
│   ├── buyers/              # Buyer management
│   ├── catalog/             # Materials & labor catalog
│   ├── settlements/         # Settlement processing
│   ├── analytics/           # Analytics & reporting
│   ├── delivery/            # Delivery zones
│   ├── notifications/       # Admin notifications
│   ├── support/             # Support ticketing
│   ├── logs/                # System logs
│   ├── settings/            # Platform settings
│   └── auth/                # Authentication
│
├── components/              # Shared components
│   ├── common/             # Common UI components
│   ├── layout/             # Layout components
│   ├── feedback/           # Feedback components
│   └── vendors/            # Vendor-specific components
│
├── context/                # Context providers
│   ├── AdminAuthContext.tsx
│   └── AdminNotificationsContext.tsx
│
├── data/                   # Mock data generators
│   ├── mockOrders.ts
│   ├── mockBuyers.ts
│   ├── mockSettlements.ts
│   └── ...
│
├── mocks/                  # Static mock data
│   ├── vendors.mock.ts
│   ├── admins.mock.ts
│   └── dashboard.mock.ts
│
├── types/                  # TypeScript types
│   ├── admin.ts
│   ├── vendor.ts
│   ├── buyer.ts
│   ├── order.ts
│   ├── settlement.ts
│   └── ...
│
├── utils/                  # Utility functions
│   └── export.ts
│
└── hooks/                  # Custom hooks
    └── usePermissions.ts
```

---

## Pages & Routes

### Core Pages (17 Total)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | Login | Authentication page |
| `/admin/dashboard` | Dashboard | Operations overview |
| `/admin/vendors` | Vendors | Vendor management list |
| `/admin/vendors/:id` | Vendor Profile | Individual vendor details |
| `/admin/vendors/:id/edit` | Vendor Edit | Edit vendor information |
| `/admin/vendors/onboard` | Vendor Onboarding | New vendor onboarding |
| `/admin/orders` | Orders | Order oversight list |
| `/admin/orders/:id` | Order Details | Individual order details |
| `/admin/buyers` | Buyers | Buyer management list |
| `/admin/buyers/:id` | Buyer Profile | Individual buyer details |
| `/admin/catalog/materials` | Materials Catalog | Materials management |
| `/admin/catalog/materials/:id` | Material Details | Individual material details |
| `/admin/catalog/labor` | Labor Services | Labor services management |
| `/admin/catalog/labor/:id` | Labor Details | Individual service details |
| `/admin/settlements` | Settlements | Settlement processing list |
| `/admin/settlements/create` | Create Settlement | Manual settlement creation |
| `/admin/settlements/:id` | Settlement Details | Individual settlement details |
| `/admin/analytics` | Analytics | Platform analytics |
| `/admin/delivery-zones` | Delivery Zones | Delivery zone management |
| `/admin/notifications` | Notifications | Admin notifications |
| `/admin/support` | Support Tickets | Support ticket list |
| `/admin/support/:id` | Ticket Details | Individual ticket details |
| `/admin/logs` | System Logs | System activity logs |
| `/admin/settings` | Platform Settings | Platform configuration |

---

## Key Features

### 1. Dashboard
- Real-time KPIs (orders, revenue, vendors, buyers)
- Quick stats grid
- Recent activity feed
- Quick actions

### 2. Vendor Management
- Complete vendor listing with search/filters
- Vendor profiles with financial data
- Onboarding workflow
- Status management
- Performance tracking
- Document verification

### 3. Order Management
- Comprehensive order oversight
- Advanced filters (status, type, date, vendor, buyer)
- Order details with timeline
- Status tracking
- Dispute management

### 4. Buyer Management
- Buyer listing and profiles
- Order history
- Activity tracking
- KYC status
- Verification management

### 5. Catalog Management
- Materials catalog (200+ items)
- Labor services catalog
- Category management
- Pricing oversight
- Stock tracking
- Vendor offerings

### 6. Settlement Processing
- Settlement creation workflow
- Payment recording
- Settlement history
- Status tracking
- Breakdown calculations
- Date range filtering

### 7. Analytics
- Platform metrics
- Revenue analytics
- Vendor performance
- Order trends
- Buyer analytics

### 8. Support System
- Ticket management
- Internal notes
- Priority tracking
- Status updates
- Multi-party conversations

---

## State Management

### Context Providers

#### AdminAuthContext
```typescript
interface AdminAuthContextType {
  admin: Admin | null;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

#### AdminNotificationsContext
```typescript
interface AdminNotificationsContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
}
```

---

## Component Architecture

### Layout Components
- **AdminLayout**: Main layout with sidebar and header
- **AdminHeader**: Top navigation with user menu and notifications
- **AdminSidebar**: Left navigation with feature links

### Common Components
- **DataTable**: Reusable table with sorting, filtering, pagination
- **SearchFilterSection**: Standardized search/filter pattern
- **StatsCard**: KPI display cards
- **StatusBadge**: Status indicators
- **DateRangePicker**: Date range selection

### Feedback Components
- **Alert**: Inline feedback messages
- **ConfirmationDialog**: Action confirmations
- **EmptyState**: Empty content placeholders
- **ErrorState**: Error displays with recovery
- **LoadingState**: Loading indicators
- **StatusIndicator**: Live status indicators

---

## Data Flow

### MVP Architecture
```
Component → Context → Mock Data
         ← State ←
```

### Production-Ready Architecture
```
Component → Context → API Service → Backend
         ← State ← Response ←
```

---

## Role-Based Access Control (RBAC)

### Admin Roles
- **Super Admin**: Full access
- **Operations Manager**: Vendor, order, settlement management
- **Support Agent**: Support tickets, buyer management
- **Finance Manager**: Settlements, payouts, analytics
- **Catalog Manager**: Catalog and pricing management

### Permission System
```typescript
interface AdminPermissions {
  vendors: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  };
  orders: { view: boolean; update: boolean; cancel: boolean };
  settlements: { view: boolean; create: boolean; process: boolean };
  catalog: { view: boolean; edit: boolean };
  buyers: { view: boolean; edit: boolean; verify: boolean };
  support: { view: boolean; respond: boolean; close: boolean };
  analytics: { view: boolean; export: boolean };
  settings: { view: boolean; edit: boolean };
}
```

---

## Design Patterns

### Feature-Based Structure
Each feature is self-contained with:
- Pages
- Components (feature-specific)
- Types (if needed)

### Component Patterns
- Compound components for complex UI
- Render props for flexibility
- Custom hooks for reusable logic
- Context for shared state

### Code Organization
- Separation of concerns
- Single responsibility principle
- DRY (Don't Repeat Yourself)
- Type safety with TypeScript

---

## Performance Optimizations

- **Code Splitting**: Lazy-loaded routes
- **Memoization**: React.memo for expensive components
- **Virtualization**: Large lists use virtual scrolling
- **Debouncing**: Search inputs debounced
- **Caching**: Mock data cached in context

---

## Security Features

- Protected routes with authentication
- Role-based permissions
- Masked sensitive data (bank accounts, documents)
- Input validation
- XSS prevention
- CSRF protection (when integrated with backend)

---

## Testing Strategy

### Current (MVP)
- Manual testing of all features
- Browser compatibility testing
- Responsive design testing

### Production
- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Integration tests for critical flows
- E2E tests with Playwright/Cypress

---

## Deployment

### Build Command
```bash
npm run build
```

### Output
- **Directory**: `/dist`
- **Entry**: `admin.html`
- **Chunks**: Optimized code splitting

### Environment Variables
```env
VITE_API_URL=https://api.realserv.com
VITE_WS_URL=wss://api.realserv.com
VITE_ENV=production
```

---

## Future Enhancements

- Real-time order updates via WebSocket
- Advanced analytics with custom date ranges
- Bulk operations (bulk approve, bulk update)
- Export to multiple formats (CSV, Excel, PDF)
- Advanced search with filters
- Automated settlement generation
- Email notifications for critical events
- Activity audit logs
- Advanced reporting dashboards

---

**Related Documentation**:
- [System Overview](./system-overview.md)
- [Vendor Portal Architecture](./vendor-portal.md)
- [Engineering Standards](../development/standards.md)
