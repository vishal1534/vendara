# RealServ Engineering Standards

**Version**: 1.0  
**Last Updated**: January 2026  
**Applies To**: React Web (Admin & Vendor Portals)

> 📖 **Note**: For the complete engineering standards document covering both web and mobile platforms, see `/STANDARDS.md` in the project root.

---

## Quick Reference

This document provides a quick reference to the key engineering standards for the RealServ web applications.

---

## Project Structure

Both portals follow a feature-based structure:

```
/src/{portal}/
├── app/                  # App configuration & routing
├── features/            # Feature modules
│   └── {feature}/
│       ├── pages/       # Feature pages
│       ├── components/  # Feature-specific components
│       └── ...
├── components/          # Shared components
│   ├── common/         # Reusable components
│   ├── layout/         # Layout components
│   └── feedback/       # Feedback components (admin only)
├── context/            # Context providers
├── types/              # TypeScript types
├── mocks/ or data/     # Mock data
└── utils/              # Utility functions
```

---

## Code Standards

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Type definitions
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export function Component({ title, onAction }: ComponentProps) {
  // 3.1. State and hooks
  const [isActive, setIsActive] = useState(false);
  
  // 3.2. Event handlers
  const handleClick = () => {
    setIsActive(true);
    onAction();
  };
  
  // 3.3. Render
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
}
```

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities/Hooks**: camelCase (`useCart.ts`, `formatPrice.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`OrderItem`, `ApiResponse`)

---

## TypeScript

- Always use TypeScript strict mode
- Define interfaces for all component props
- Avoid `any` - use `unknown` if type is truly unknown
- Use type inference where possible
- Define types for mock data structures

---

## Styling with Tailwind CSS v4

- Use utility classes for all styling
- Follow construction-native color palette
- Responsive design with breakpoint prefixes (`md:`, `lg:`)
- Maintain consistency across portals

### Construction-Native Colors

```css
Primary:   #2F3E46  /* Steel Blue-Grey */
Secondary: #D2B48C  /* Sandstone */
Success:   #4A5D73  /* Success Blue-Grey */
Warning:   #C47A2C  /* Site Amber */
Error:     #8B2C2C  /* Brick Red */
Neutrals:  Cement-inspired greys
```

---

## Component Patterns

### Presentation Components (UI)

Pure, reusable, no business logic:

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

### Container Components (Features)

Connected to state, handles business logic:

```typescript
export function OrdersList() {
  const { orders, loading } = useOrders();
  
  if (loading) return <LoadingState />;
  
  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

---

## State Management

### Use the Right Tool

1. **Local State (useState)**: Component-specific UI state
2. **Context API**: Cross-component state (auth, notifications)
3. **URL State (Router)**: Navigation and filters
4. **Props**: Parent-to-child data flow

### Context Pattern

```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

---

## Error Handling

### Try-Catch Pattern

```typescript
const handleSubmit = async () => {
  try {
    setLoading(true);
    await apiCall();
    toast.success('Success!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Something went wrong');
  } finally {
    setLoading(false);
  }
};
```

### Error Boundaries

Use ErrorBoundary component for React errors:

```typescript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## User Feedback

### Toast Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('Order created successfully');

// Error
toast.error('Failed to create order');

// Info
toast.info('Processing your request');

// Warning
toast.warning('Please review before submitting');
```

### Loading States

```typescript
{loading ? (
  <LoadingState message="Loading orders..." />
) : (
  <OrdersList orders={orders} />
)}
```

---

## Best Practices

### Do's ✅

- Write self-documenting code with clear names
- Keep components small and focused
- Extract reusable logic into hooks
- Use TypeScript for type safety
- Follow established patterns in codebase
- Test manually in browser before committing

### Don'ts ❌

- Don't use `any` type
- Don't create overly complex components (>300 lines)
- Don't repeat code - extract to utilities
- Don't ignore TypeScript errors
- Don't commit code without testing
- Don't add unnecessary comments (code should be clear)

---

## Code Review Checklist

Before submitting code:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Code follows naming conventions
- [ ] Components are properly typed
- [ ] No console errors in browser
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] User feedback (loading, errors, success) is present
- [ ] Code follows existing patterns
- [ ] Unnecessary comments removed

---

## Common Patterns

### Data Table with Filters

```typescript
export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <SearchFilterSection
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={/* ... */}
    >
      <DataTable data={filteredOrders} columns={columns} />
    </SearchFilterSection>
  );
}
```

### Form Handling

```typescript
export function CreateForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submit
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## Resources

- **Complete Standards**: `/STANDARDS.md`
- **Architecture**: [/docs/architecture/](../architecture/)
- **Getting Started**: [getting-started.md](./getting-started.md)
- **Design System**: [design-system.md](./design-system.md)

---

**For complete engineering standards covering all platforms and advanced topics, refer to `/STANDARDS.md` in the project root.**
