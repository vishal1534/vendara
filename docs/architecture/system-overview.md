# RealServ System Architecture

**Last Updated**: January 2026  
**Status**: Production Ready

---

## Overview

RealServ is a hyperlocal construction materials marketplace platform for Hyderabad, enabling individual home builders to order small quantities of materials and book skilled labor with fixed pricing and no vendor negotiation.

---

## Platform Components

### 1. Buyer App (Mobile - iOS/Android)
- **Platform**: React Native / Flutter / Native mobile app
- **Repository**: Separate mobile repository (NOT part of this web codebase)
- **Users**: Individual home builders in Hyderabad
- **Key Features**:
  - Browse and order construction materials
  - Book skilled labor services
  - Track order status
  - Fixed pricing, no negotiation
  - Hyperlocal delivery

### 2. Vendor Portal (Web - Desktop-first) ✅
- **Platform**: React web application
- **Entry Point**: `index.html` → `/src/main.tsx` → `/src/vendor/app/VendorApp.tsx`
- **URL**: `vendor.realserv.com` or `realserv.com`
- **Users**: Material suppliers and labor providers
- **Status**: Production-ready ✅
- **Key Features**:
  - Dashboard with KPIs
  - Order management
  - Payout tracking
  - Performance analytics
  - Catalog management
  - Settings and profile

### 3. Admin Portal (Web - Desktop-first) ✅
- **Platform**: React web application
- **Entry Point**: `admin.html` → `/src/admin-main.tsx` → `/src/admin/app/AdminApp.tsx`
- **URL**: `admin.realserv.com`
- **Users**: RealServ operations team
- **Status**: Production-ready ✅
- **Key Features**:
  - Operations dashboard
  - Vendor management
  - Order oversight
  - Buyer management
  - Catalog management
  - Settlements processing
  - Analytics and reporting
  - System logs and support

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: recharts
- **Icons**: lucide-react
- **Date Handling**: date-fns

### Architecture Pattern
- Feature-based module structure
- Context API for state management
- Mock data layer (for MVP)
- Component-driven development
- Type-safe with TypeScript

---

## Web Codebase Structure

```
/
├── index.html              # Vendor Portal entry
├── admin.html              # Admin Portal entry
│
├── src/
│   ├── main.tsx            # Vendor Portal JavaScript entry
│   ├── admin-main.tsx      # Admin Portal JavaScript entry
│   │
│   ├── vendor/             # Vendor Portal (Production ✅)
│   │   ├── app/
│   │   ├── features/
│   │   ├── components/
│   │   ├── context/
│   │   ├── mocks/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── admin/              # Admin Portal (Production ✅)
│   │   ├── app/
│   │   ├── features/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── mocks/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── app/                # Shared resources
│   │   └── components/ui/  # shadcn/ui components
│   │
│   └── styles/             # Global styles
```

---

## Build Configuration

### Multi-Entry Point Setup (Vite)

The project uses Vite with multiple entry points to serve both portals:

```typescript
build: {
  rollupOptions: {
    input: {
      main: 'index.html',    // Vendor Portal
      admin: 'admin.html',   // Admin Portal
    }
  }
}
```

### Code Splitting Strategy
- **Admin chunk**: All admin portal code
- **Vendor chunk**: All vendor portal code
- **Shared chunks**: React Router, recharts, other dependencies

---

## Design System

### Construction-Native Color Palette

```css
Primary:   #2F3E46  /* Steel Blue-Grey */
Secondary: #D2B48C  /* Sandstone */
Success:   #4A5D73  /* Success Blue-Grey */
Warning:   #C47A2C  /* Site Amber */
Error:     #8B2C2C  /* Brick Red */
Neutrals:  Cement-inspired greys
```

**Design Philosophy**: Colors derived from real construction materials for a professional, infrastructure-grade aesthetic.

---

## MVP Approach

### Current Implementation
- **Mock data layer** for all features
- **Manual processes** for settlements and status updates
- **Client-side state** management with Context API
- **No backend integration** (ready for API integration)

### Production Readiness
Both portals are production-ready with:
- ✅ Complete feature implementation
- ✅ Type-safe TypeScript code
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ User feedback (toasts, modals)
- ✅ Clean, maintainable code

---

## Deployment

### Vendor Portal
- **URL**: `vendor.realserv.com` or `realserv.com`
- **Entry**: `index.html`
- **Target**: Desktop-first (responsive)

### Admin Portal
- **URL**: `admin.realserv.com`
- **Entry**: `admin.html`
- **Target**: Desktop-first
- **Security**: Internal operations team only

---

## Next Steps for Backend Integration

1. **API Layer**: Replace mock data with API calls
2. **Authentication**: Implement JWT-based auth
3. **Real-time Updates**: WebSocket integration
4. **File Upload**: Document and image handling
5. **Payment Gateway**: Settlement processing integration

---

## Security Considerations

- Protected routes with authentication
- Role-based access control (Admin portal)
- Masked sensitive data (bank details, documents)
- Input validation and sanitization
- Secure session management
- HTTPS enforcement in production

---

## Performance Optimizations

- Code splitting by portal and features
- Lazy loading for routes
- Optimized bundle sizes
- Image optimization
- Memoized components
- Efficient re-renders with proper hooks

---

**For detailed architecture of each portal**:
- [Admin Portal Architecture](./admin-portal.md)
- [Vendor Portal Architecture](./vendor-portal.md)
