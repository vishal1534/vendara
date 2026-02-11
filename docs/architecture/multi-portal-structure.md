# Multi-Portal Project Structure - Best Practices

**Last Updated**: January 2026  
**Context**: RealServ Admin + Vendor Web Portals

---

## Table of Contents

1. [Current Structure Analysis](#current-structure-analysis)
2. [Industry Best Practices](#industry-best-practices)
3. [Recommended Structure](#recommended-structure)
4. [Sharing Code Between Portals](#sharing-code-between-portals)
5. [Build & Deployment](#build--deployment)
6. [Pros & Cons of Different Approaches](#pros--cons-of-different-approaches)
7. [Migration Path (if needed)](#migration-path-if-needed)

---

## Current Structure Analysis

### ✅ Your Current Structure is EXCELLENT

```
/
├── src/
│   ├── admin/              # Admin Portal (isolated)
│   ├── vendor/             # Vendor Portal (isolated)
│   ├── app/                # Shared resources
│   │   └── components/ui/  # Shared UI components
│   └── styles/             # Global styles
│
├── index.html              # Vendor entry
├── admin.html              # Admin entry
└── vite.config.ts          # Multi-entry build
```

**Why This Is Good:**
- ✅ Clear separation of concerns
- ✅ Each portal is self-contained
- ✅ Shared code is explicit (in `/app`)
- ✅ Easy to reason about
- ✅ Scales well for 2-3 portals
- ✅ Single build config
- ✅ Shared dependencies

---

## Industry Best Practices

### Approach 1: Portal-Based Structure (Current - ⭐ Recommended for 2-3 portals)

```
src/
├── admin/                    # Admin Portal
│   ├── app/
│   ├── features/
│   ├── components/
│   ├── context/
│   ├── types/
│   └── utils/
│
├── vendor/                   # Vendor Portal
│   ├── app/
│   ├── features/
│   ├── components/
│   ├── context/
│   ├── types/
│   └── utils/
│
├── shared/                   # Shared across portals
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── common/          # Business components used by both
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utilities
│   ├── hooks/               # Shared hooks
│   └── constants/           # Shared constants
│
└── styles/                   # Global styles
```

**Best For:**
- 2-5 portals
- Moderate code sharing
- Different domains (admin, vendor, customer)
- Teams working on different portals

**RealServ Fit**: ⭐⭐⭐⭐⭐ Perfect fit

---

### Approach 2: Monorepo with Workspaces (For 5+ apps or microservices)

```
packages/
├── admin-portal/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── vendor-portal/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── ui-components/           # Shared UI library
│   ├── src/
│   └── package.json
│
└── shared-utils/            # Shared utilities
    ├── src/
    └── package.json
```

**Tools**: Turborepo, Nx, Lerna, pnpm workspaces

**Best For:**
- 5+ applications
- Independent deployment schedules
- Different teams owning different apps
- Need for versioned shared libraries

**RealServ Fit**: ⭐⭐ Overkill for 2 portals

---

### Approach 3: Feature-Based Monolith (Not recommended for multi-portal)

```
src/
├── features/
│   ├── orders/
│   ├── vendors/
│   └── ...
├── portals/
│   ├── admin/
│   └── vendor/
```

**RealServ Fit**: ⭐ Not suitable - portals have different features

---

## Recommended Structure (Enhanced Current)

### Option A: Keep Current + Enhance Shared (⭐ Recommended)

```
src/
├── admin/                    # Admin Portal
│   ├── app/
│   │   ├── AdminApp.tsx
│   │   └── routes.tsx
│   ├── features/
│   │   ├── dashboard/
│   │   ├── vendors/
│   │   ├── orders/
│   │   └── settlements/
│   ├── components/
│   │   ├── common/          # Admin-specific components
│   │   ├── layout/
│   │   └── feedback/
│   ├── context/
│   ├── types/
│   ├── hooks/               # Admin-specific hooks
│   ├── utils/               # Admin-specific utils
│   └── data/                # Mock data
│
├── vendor/                   # Vendor Portal
│   ├── app/
│   │   ├── VendorApp.tsx
│   │   └── routes.tsx
│   ├── features/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── payouts/
│   │   └── performance/
│   ├── components/
│   │   ├── common/          # Vendor-specific components
│   │   └── layout/
│   ├── context/
│   ├── types/
│   ├── hooks/               # Vendor-specific hooks
│   ├── utils/               # Vendor-specific utils
│   └── mocks/               # Mock data
│
├── shared/                   # NEW: Explicit shared code
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── forms/           # Shared form components
│   │   └── data-display/    # Shared tables, charts, etc.
│   ├── types/               # Shared types (Order, User, etc.)
│   │   ├── common.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── utils/               # Shared utilities
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── hooks/               # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   ├── constants/           # Shared constants
│   │   ├── orderStates.ts
│   │   ├── apiEndpoints.ts
│   │   └── index.ts
│   └── lib/                 # Third-party configs
│       ├── api.ts           # API client
│       └── utils.ts
│
└── styles/                   # Global styles
    ├── index.css
    ├── theme.css
    ├── tailwind.css
    └── fonts.css
```

**Migration from Current:**
```bash
# 1. Create shared directory
mkdir src/shared

# 2. Move /src/app to /src/shared
mv src/app/components/ui src/shared/components/ui

# 3. Create shared utilities
mkdir -p src/shared/{types,utils,hooks,constants,lib}

# 4. Move duplicated utils
# If vendor/utils/formatCurrency.ts and admin/utils/formatCurrency.ts are identical:
mv src/vendor/utils/formatCurrency.ts src/shared/utils/
mv src/vendor/utils/formatDate.ts src/shared/utils/
```

---

## Sharing Code Between Portals

### What to Share

#### ✅ ALWAYS Share:
1. **UI Components** (buttons, inputs, dialogs)
   - Location: `/src/shared/components/ui/`
   - Example: shadcn/ui components

2. **Utility Functions** (formatters, validators)
   - Location: `/src/shared/utils/`
   - Example: `formatCurrency()`, `formatDate()`

3. **Type Definitions** (if same domain)
   - Location: `/src/shared/types/`
   - Example: `Order`, `User`, `Product`

4. **Constants** (if same values)
   - Location: `/src/shared/constants/`
   - Example: Order states, status enums

5. **Hooks** (generic utilities)
   - Location: `/src/shared/hooks/`
   - Example: `useDebounce`, `useMediaQuery`

#### ⚠️ SHARE WITH CAUTION:
1. **Business Logic Components**
   - Only if truly identical
   - Example: OrderCard might differ between portals

2. **API Services**
   - Share API client, not necessarily all endpoints
   - Admin and Vendor might call different APIs

#### ❌ NEVER Share:
1. **Feature Components**
   - Admin dashboard ≠ Vendor dashboard
   - Keep in respective portals

2. **Context Providers**
   - Different auth, different state
   - Keep portal-specific

3. **Routes/Pages**
   - Always portal-specific

---

## Code Sharing Rules

### Rule 1: Share by Import Path Convention

```typescript
// ✅ GOOD: Explicit imports
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { Order } from '@/shared/types/order';

// ❌ BAD: Importing from other portal
import { VendorCard } from '@/vendor/components/VendorCard'; // in admin code
```

### Rule 2: Use Path Aliases

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["./src/shared/*"],
      "@admin/*": ["./src/admin/*"],
      "@vendor/*": ["./src/vendor/*"]
    }
  }
}
```

**vite.config.ts:**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@vendor': path.resolve(__dirname, './src/vendor'),
    },
  },
});
```

### Rule 3: Document Shared Code

```typescript
/**
 * Shared utility for formatting currency
 * Used by: Admin Portal, Vendor Portal
 * 
 * @example
 * formatCurrency(1234.56) // "₹1,234.56"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}
```

---

## Build & Deployment

### Current Setup (Multi-Entry Vite)

**vite.config.ts:**
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
      output: {
        manualChunks: (id) => {
          // Shared code goes to 'shared' chunk
          if (id.includes('src/shared')) return 'shared';
          
          // Portal-specific chunks
          if (id.includes('src/admin')) return 'admin';
          if (id.includes('src/vendor')) return 'vendor';
          
          // Third-party dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('recharts')) return 'recharts';
            return 'vendor-deps';
          }
        },
      },
    },
  },
});
```

### Build Output Structure

```
dist/
├── index.html              # Vendor Portal
├── admin.html              # Admin Portal
├── assets/
│   ├── shared-[hash].js    # Shared code
│   ├── admin-[hash].js     # Admin code
│   ├── vendor-[hash].js    # Vendor code
│   ├── react-[hash].js     # React library
│   └── vendor-deps-[hash].js
```

### Deployment Strategies

#### Strategy 1: Same Domain, Different Paths (Current)
```
realserv.com/
├── /vendor/          → index.html
└── /admin/           → admin.html
```

#### Strategy 2: Subdomains (Recommended for Production)
```
vendor.realserv.com   → index.html
admin.realserv.com    → admin.html
```

**Nginx Config:**
```nginx
# Vendor Portal
server {
  server_name vendor.realserv.com;
  root /var/www/realserv/dist;
  index index.html;
}

# Admin Portal
server {
  server_name admin.realserv.com;
  root /var/www/realserv/dist;
  index admin.html;
}
```

#### Strategy 3: Separate Deployments (Advanced)
- Build separately for each portal
- Deploy to different CDNs/servers
- Independent scaling

---

## Pros & Cons of Different Approaches

### Current Structure (Portal-Based in Single Repo)

**Pros:**
- ✅ Simple mental model
- ✅ Easy to navigate
- ✅ Single dependency tree
- ✅ Shared code is clear
- ✅ One build command
- ✅ Easy local development
- ✅ Atomic commits across portals

**Cons:**
- ❌ All portals deploy together
- ❌ Can't version portals independently
- ❌ Larger bundle size (both portals in one build)
- ❌ Risk of accidental cross-portal imports

**Best For:** 2-3 portals, same team, coordinated releases

---

### Monorepo with Workspaces

**Pros:**
- ✅ Independent deployments
- ✅ Versioned shared libraries
- ✅ Can use different tech stacks per portal
- ✅ Smaller bundle per portal
- ✅ Clear ownership boundaries

**Cons:**
- ❌ More complex setup
- ❌ Requires monorepo tooling (Turborepo, Nx)
- ❌ More config files to maintain
- ❌ Longer initial learning curve
- ❌ Potential for version conflicts

**Best For:** 5+ apps, multiple teams, independent releases

---

## Recommendations for RealServ

### Short Term (Current - Keep It!) ✅

**Continue with current structure with minor enhancements:**

1. **Create `/src/shared` directory**
   ```bash
   mkdir -p src/shared/{components,types,utils,hooks,constants,lib}
   ```

2. **Move truly shared code to `/src/shared`**
   - UI components (already in `/src/app/components/ui/`)
   - Duplicate utilities (formatCurrency, formatDate)
   - Shared types (Order, User, etc.)

3. **Add path aliases**
   ```json
   // tsconfig.json
   {
     "paths": {
       "@shared/*": ["./src/shared/*"],
       "@admin/*": ["./src/admin/*"],
       "@vendor/*": ["./src/vendor/*"]
     }
   }
   ```

4. **Document shared code**
   - Add JSDoc to shared utilities
   - Create `/src/shared/README.md`

5. **Enforce import rules**
   - Use ESLint to prevent cross-portal imports
   - Only allow imports from `@shared`

---

### Long Term (If Scaling to 5+ Portals)

**Consider Monorepo with Turborepo:**

1. **Move to packages structure**
   ```
   packages/
   ├── admin-portal/
   ├── vendor-portal/
   ├── buyer-portal/
   ├── ui-library/
   └── shared-utils/
   ```

2. **Use Turborepo for orchestration**
   ```json
   {
     "pipeline": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": ["dist/**"]
       }
     }
   }
   ```

3. **Independent deployments**
   - Each portal has its own CI/CD
   - Deploy on different schedules

---

## Best Practices Summary

### ✅ DO:

1. **Keep portals isolated** - Each portal is self-contained
2. **Share explicitly** - Only share what's truly common
3. **Use path aliases** - Make imports clear (`@shared`, `@admin`, `@vendor`)
4. **Document shared code** - Explain what uses it
5. **Code splitting** - Split by portal in build
6. **Consistent naming** - Same structure in both portals
7. **Type safety** - Shared types prevent drift

### ❌ DON'T:

1. **Cross-portal imports** - Admin importing from Vendor
2. **Share everything** - Only share what's identical
3. **Premature abstraction** - Don't abstract until needed
4. **Ignore bundle size** - Monitor shared chunk size
5. **Mix concerns** - Keep business logic portal-specific
6. **Forget to update shared** - Update docs when changing shared code

---

## Example Migration

### Before (Current):
```typescript
// src/vendor/utils/formatCurrency.ts
export function formatCurrency(amount: number) { /* ... */ }

// src/admin/utils/formatCurrency.ts
export function formatCurrency(amount: number) { /* ... */ }  // Duplicate!
```

### After (Recommended):
```typescript
// src/shared/utils/formatCurrency.ts
/**
 * Format currency in INR
 * @shared Used by: Admin Portal, Vendor Portal
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

// src/admin/features/orders/OrdersPage.tsx
import { formatCurrency } from '@shared/utils/formatCurrency';

// src/vendor/features/payouts/PayoutsPage.tsx
import { formatCurrency } from '@shared/utils/formatCurrency';
```

---

## Conclusion

**For RealServ (2 portals):**
- ✅ Current structure is excellent
- ✅ Enhance with `/src/shared` directory
- ✅ Add path aliases for clarity
- ✅ Keep build config as-is
- ✅ Deploy as subdomains

**Your current approach is industry best practice for 2-3 portals. Don't overcomplicate!**

---

## Resources

- [Turborepo Docs](https://turbo.build/repo)
- [Vite Multi-Page Apps](https://vitejs.dev/guide/build.html#multi-page-app)
- [Nx Monorepo](https://nx.dev)
- [pnpm Workspaces](https://pnpm.io/workspaces)
