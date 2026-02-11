# RealServ Vendor Portal Architecture

**Last Updated**: January 2026  
**Status**: Production Ready ✅

---

## Overview

The Vendor Portal is a desktop-first React web application for construction material vendors and labor providers to manage orders, track payouts, monitor performance, and update their catalog.

---

## Entry Points

### HTML Entry
**File**: `/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vendor-favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RealServ Vendor Portal</title>
    <meta name="description" content="Manage your orders, payouts, and catalog" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### JavaScript Entry
**File**: `/src/main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { VendorApp } from './vendor/app/VendorApp';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VendorApp />
  </React.StrictMode>
);
```

---

## Directory Structure

```
/src/vendor/
├── app/
│   ├── VendorApp.tsx         # Root component with providers
│   └── routes.tsx            # Route configuration
│
├── features/                 # Feature modules
│   ├── dashboard/           # Dashboard page
│   ├── orders/              # Order management
│   ├── payouts/             # Payout tracking
│   ├── performance/         # Performance analytics
│   ├── catalog/             # Catalog management
│   ├── settings/            # Vendor settings
│   ├── support/             # Support tickets
│   ├── notifications/       # Notifications
│   └── auth/                # Authentication
│
├── components/              # Shared components
│   ├── common/             # Common UI components
│   ├── layout/             # Layout components
│   └── notifications/      # Notification components
│
├── context/                # Context providers
│   ├── VendorAuthContext.tsx
│   ├── VendorNotificationsContext.tsx
│   ├── VendorOrdersContext.tsx
│   └── VendorSupportContext.tsx
│
├── mocks/                  # Mock data
│   ├── vendorProfile.mock.ts
│   ├── orders.mock.ts
│   ├── payouts.mock.ts
│   ├── performance.mock.ts
│   └── ...
│
├── types/                  # TypeScript types
│   ├── vendor.ts
│   ├── vendorOrder.ts
│   ├── payout.ts
│   ├── performance.ts
│   └── ...
│
├── utils/                  # Utility functions
│   ├── formatCurrency.ts
│   ├── formatDate.ts
│   └── documentDownload.ts
│
└── constants/              # Constants
    ├── serviceAreas.ts
    ├── vendorOrderStates.ts
    └── vendorRoutes.ts
```

---

## Pages & Routes

### Core Pages (9 Total)

| Route | Page | Description |
|-------|------|-------------|
| `/vendor/login` | Login | Authentication page |
| `/vendor/dashboard` | Dashboard | Overview with KPIs |
| `/vendor/orders` | Orders | Order history table |
| `/vendor/orders/:id` | Order Details | Individual order view |
| `/vendor/payouts` | Payouts | Transaction ledger |
| `/vendor/performance` | Performance | Analytics & metrics |
| `/vendor/catalog` | Catalog | Item management |
| `/vendor/settings` | Settings | Vendor profile |
| `/vendor/support` | Support | Support tickets |
| `/vendor/support/:id` | Ticket Details | Ticket conversation |
| `/vendor/notifications` | Notifications | Notification center |

---

## Key Features

### 1. Dashboard
- **KPI Cards**: Orders, revenue, acceptance rate, response time
- **Active Orders**: Real-time order status
- **Quick Metrics**: 6 key performance indicators
- **Quick Actions**: Navigation shortcuts

### 2. Order Management
- **Order Table**: Comprehensive order history
- **Filters**: Status, date range, search
- **CSV Export**: Download order data
- **Order Details**: Full order view with timeline
- **Payout Breakdown**: Settlement calculations
- **Status Tracking**: Real-time order status

### 3. Payout Tracking
- **Transaction History**: Complete payout ledger
- **Settlement Tracking**: Countdown to next settlement
- **Bank Details**: Masked account information
- **CSV Export**: Export for accounting
- **Bi-weekly Cycle**: Settlements on 1st & 15th

### 4. Performance Analytics
- **Performance Score**: 0-100 scoring system
- **Rating System**: Excellent, Good, Fair, Poor
- **Key Metrics**: Acceptance rate, on-time delivery, response time
- **Order Volume Chart**: 3-month trend visualization
- **Issue Log**: Performance issues tracking

### 5. Catalog Management
- **Two Tabs**: My Catalog / All Available Items
- **20-Item Master Catalog**: Across 5 categories
- **Categories**: Cement, Sand, Aggregate, Steel, Bricks
- **WhatsApp Updates**: Update availability via WhatsApp
- **Payout Rates**: Vendor-specific rates

### 6. Settings
- **Business Information**: Contact and location details
- **KYC Documents**: Upload and verification status
- **Bank Account**: Masked account details
- **Availability Toggle**: Enable/disable with WhatsApp sync
- **Read-Only Design**: Updates via support channel

### 7. Support System
- **Ticket Creation**: Submit support requests
- **Ticket Tracking**: View ticket status and history
- **Conversations**: Multi-message thread support
- **Priority Levels**: Low, Medium, High, Critical

---

## State Management

### Context Providers

#### VendorAuthContext
```typescript
interface VendorAuthContextType {
  vendor: Vendor | null;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

#### VendorOrdersContext
```typescript
interface VendorOrdersContextType {
  orders: VendorOrder[];
  activeOrders: VendorOrder[];
  getOrderById: (id: string) => VendorOrder | undefined;
  updateOrderStatus: (id: string, status: VendorOrderStatus) => void;
  isLoading: boolean;
}
```

#### VendorNotificationsContext
```typescript
interface VendorNotificationsContextType {
  notifications: VendorNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}
```

---

## Component Architecture

### Layout Components
- **VendorLayout**: Main layout with sidebar and header
- **VendorHeader**: Top navigation with user menu and notifications
- **VendorSidebar**: Left navigation menu
- **VendorSelector**: Vendor account switcher (for multi-vendor users)

### Feature Components

#### Orders
- **OrdersTable**: Order list with filters and sorting
- **OrderFilters**: Status and date range filters
- **ExportButton**: CSV export functionality

#### Performance
- **PerformanceScore**: Circular gauge display
- **MetricsGrid**: Key metrics cards
- **OrderVolumeChart**: Trend visualization
- **IssueLog**: Performance issues list

#### Catalog
- **CatalogTable**: Catalog item list
- **WhatsAppUpdateBanner**: Update instructions

#### Settings
- **BusinessInfoCard**: Business details display
- **KYCDocumentsCard**: Document upload and status
- **BankDetailsCard**: Bank account information
- **AvailabilityCard**: Availability toggle

---

## Data Flow

### Current (MVP)
```
Component → Context → Mock Data
         ← State ←
```

### Production Architecture
```
Component → Context → API Service → Backend
         ← State ← Response ←
```

---

## Mock Data

### Vendor Profile
**Name**: Chauhan Cement Suppliers  
**Category**: Materials Supplier  
**Location**: Kukatpally, Hyderabad

### Mock Data Files
- `vendorProfile.mock.ts` - Vendor details
- `orders.mock.ts` - 30 orders across various statuses
- `payouts.mock.ts` - Transaction history
- `performance.mock.ts` - Metrics and analytics
- `catalog.mock.ts` - 20 catalog items
- `support.mock.ts` - Support tickets
- `notifications.mock.ts` - Notification data

---

## Responsive Design

| Breakpoint | Layout | Optimizations |
|------------|--------|---------------|
| Desktop (1024px+) | Full features, multi-column | Primary target |
| Tablet (768-1023px) | Responsive grids | Scrollable tables |
| Mobile (<768px) | Single-column | Touch-friendly UI |

**Primary Target**: Desktop users (vendors reviewing reports and managing orders)

---

## Design System

### Construction-Native Colors
```css
Primary:   #2F3E46  /* Steel Blue-Grey */
Secondary: #D2B48C  /* Sandstone */
Success:   #4A5D73  /* Success Blue-Grey */
Warning:   #C47A2C  /* Site Amber */
Error:     #8B2C2C  /* Brick Red */
Neutrals:  Cement-inspired greys
```

### Typography
- **Headings**: System font stack
- **Body**: Inter or system fonts
- **Numbers**: Tabular figures for financial data

---

## Performance Optimizations

- **Code Splitting**: Lazy-loaded feature routes
- **Memoization**: React.memo for order lists
- **Optimized Renders**: Proper dependency arrays
- **Debounced Search**: 300ms debounce on filters
- **CSV Export**: Client-side export with efficient data transformation

---

## Security Features

- Protected routes requiring authentication
- Masked sensitive data (bank accounts, documents)
- Read-only critical information
- Secure WhatsApp integration patterns
- Input validation and sanitization

---

## WhatsApp Integration

### Update Catalog Availability
```
Send WhatsApp to: +91 9876543210
Format: "ITEM_NAME - Available/Unavailable"
Example: "Cement 50kg - Available"
```

### Update General Availability
Toggle in Settings syncs with WhatsApp notification

---

## CSV Export Features

### Orders Export
- All order data including status, amounts, dates
- Filtered results export
- Date range export

### Payouts Export
- Transaction history
- Settlement details
- Account reference for bookkeeping

---

## Testing Strategy

### Current (MVP)
- Manual testing across all features
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Responsive design testing
- Data accuracy verification

### Production
- Unit tests for utilities
- Component tests for critical UI
- Integration tests for order flows
- E2E tests for complete workflows

---

## Deployment

### Build Command
```bash
npm run build
```

### Output
- **Directory**: `/dist`
- **Entry**: `index.html`
- **Optimized**: Code splitting, minification, tree shaking

### Environment Variables
```env
VITE_API_URL=https://api.realserv.com
VITE_WS_URL=wss://api.realserv.com
VITE_WHATSAPP_NUMBER=+917906441952
```

---

## Future Enhancements

- Real-time order updates via WebSocket
- Push notifications for new orders
- Advanced analytics with custom reports
- Mobile app (React Native)
- Vendor-to-vendor messaging
- Automated catalog updates
- Inventory management
- Advanced performance insights

---

**Related Documentation**:
- [System Overview](./system-overview.md)
- [Admin Portal Architecture](./admin-portal.md)
- [Engineering Standards](../development/standards.md)
