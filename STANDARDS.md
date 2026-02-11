# RealServ Engineering Standards

**Version:** 1.0  
**Last Updated:** January 2026  
**Applies To:** React Web, React Native Mobile

> **Note:** This document contains standards applicable to both platforms. Sections marked with 🌐 are **Web-only**, sections marked with 📱 are **React Native-only**, and unmarked sections are **universal**.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Code Standards](#code-standards)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Security](#security)
7. [Performance](#performance)
8. [Testing](#testing)
9. [Error Handling](#error-handling)
10. [Accessibility](#accessibility)
11. [Git Workflow](#git-workflow)
12. [Documentation](#documentation)
13. [Platform-Specific Guidelines](#platform-specific-guidelines)
14. [TypeScript Configuration](#typescript-configuration)
15. [Design System (RealServ Brand)](#design-system-realserv-brand)
16. [Form Handling](#form-handling)
17. [User Feedback (Toasts)](#user-feedback-toasts)
18. [Loading States](#loading-states)
19. [Date & Time Handling](#date--time-handling)
20. [Constants & Enums](#constants--enums)
21. [Code Review Checklist](#code-review-checklist)

---

## 1. Project Structure

### React Web Structure

```
src/
├── app/                          # Application entry
│   ├── App.tsx                   # Root component
│   └── routes.tsx                # Route definitions
├── components/                   # Shared components
│   ├── ui/                       # Base UI components (buttons, inputs)
│   ├── common/                   # Shared business components
│   └── layout/                   # Layout components
├── features/                     # Feature-based modules
│   ├── materials/
│   │   ├── components/          # Feature-specific components
│   │   ├── hooks/               # Feature-specific hooks
│   │   ├── services/            # Feature API services
│   │   ├── types/               # Feature type definitions
│   │   └── utils/               # Feature utilities
│   ├── services/
│   ├── orders/
│   └── auth/
├── lib/                         # External library configs
│   ├── api.ts                   # API client setup
│   └── utils.ts                 # Shared utilities
├── hooks/                       # Global custom hooks
├── context/                     # React context providers
├── constants/                   # App-wide constants
├── types/                       # Global type definitions
├── assets/                      # Static assets
│   ├── images/
│   └── icons/
└── styles/                      # Global styles
    ├── index.css
    ├── theme.css
    └── fonts.css
```

### React Native Structure

```
src/
├── app/                         # Application entry
├── components/                  # Shared components
├── features/                    # Feature modules (same as web)
├── navigation/                  # Navigation configuration
│   ├── RootNavigator.tsx
│   ├── TabNavigator.tsx
│   └── types.ts
├── lib/                         # Utilities
├── hooks/                       # Custom hooks
├── context/                     # Context providers
├── constants/                   # Constants
├── types/                       # Type definitions
└── assets/                      # Static assets
```

### Naming Conventions

- **Components:** PascalCase (e.g., `ProductCard.tsx`)
- **Utilities/Hooks:** camelCase (e.g., `useCart.ts`, `formatPrice.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces:** PascalCase with descriptive names (e.g., `OrderItem`, `ApiResponse`)
- **Folders:** lowercase-kebab or lowercase

---

## 2. Code Standards

### General Principles

1. **Single Responsibility:** Each function/component does one thing
2. **DRY (Don't Repeat Yourself):** Extract reusable logic
3. **KISS (Keep It Simple):** Prefer simplicity over cleverness
4. **Explicit over Implicit:** Clear code > clever code
5. **Consistency:** Follow established patterns

### Code Style

```typescript
// ✅ GOOD: Clear, descriptive names
const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// ❌ BAD: Unclear names
const calc = (i: any) => i.reduce((s, x) => s + x.p * x.q, 0);
```

### Component Structure

```typescript
// Standard component structure
import { useState, useEffect } from 'react';
import type { ComponentProps } from './types';

// 1. Type definitions
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

// 2. Component
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // 2.1. Hooks
  const [quantity, setQuantity] = useState(1);
  
  // 2.2. Event handlers
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };
  
  // 2.3. Render logic
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

// 3. Default export (if needed)
export default ProductCard;
```

### File Organization Rules

1. **One component per file** (except tightly coupled components)
2. **Colocate related files** (component + styles + tests in same folder if large)
3. **Index files for public API** (export only what's needed)
4. **Max 300 lines per file** (refactor if exceeded)

---

## 3. Component Architecture

### Component Types

#### 1. Presentation Components (UI Components)

Pure, reusable, no business logic.

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  variant = 'primary', 
  children, 
  onClick,
  disabled = false 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

#### 2. Container Components (Feature Components)

Connected to state, handles business logic.

```typescript
// features/materials/components/MaterialsList.tsx
import { useMaterials } from '../hooks/useMaterials';
import { ProductCard } from '@/components/ui/ProductCard';

export function MaterialsList() {
  const { materials, loading, error } = useMaterials();
  const { addToCart } = useCart();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="materials-grid">
      {materials.map(material => (
        <ProductCard
          key={material.id}
          product={material}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  );
}
```

#### 3. Layout Components

Page structure components.

```typescript
// components/layout/MainLayout.tsx
interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### Component Composition

Prefer composition over prop drilling.

```typescript
// ✅ GOOD: Composition
<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>

// ❌ BAD: Too many props
<Card 
  title="Product Name"
  content={content}
  headerProps={{ /* */ }}
  contentProps={{ /* */ }}
/>
```

---

## 4. State Management

### State Hierarchy

1. **Local State (useState):** Component-specific UI state
2. **Shared State (Context):** Cross-component state (cart, user, theme)
3. **Server State (React Query/SWR):** API data with caching
4. **URL State (Router):** Navigation state

### Local State Example

```typescript
function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);
  
  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));
  
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{quantity}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

### Context API Pattern

```typescript
// context/CartContext.tsx
interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };
  
  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  const clearCart = () => setItems([]);
  
  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

### Custom Hooks for Logic Reuse

```typescript
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
}
```

---

## 5. API Integration

### API Client Setup

```typescript
// lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new ApiError(response.status, 'Request failed');
      }
      
      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'GET' });
    return response.data;
  }
  
  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.data;
  }
  
  private handleError(error: any): Error {
    if (error instanceof ApiError) {
      return error;
    }
    return new Error('Network error');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Service Layer Pattern

```typescript
// features/materials/services/materialsService.ts
import { apiClient } from '@/lib/api';
import type { Material } from '../types';

export const materialsService = {
  async getAll(): Promise<Material[]> {
    return apiClient.get<Material[]>('/materials');
  },
  
  async getById(id: string): Promise<Material> {
    return apiClient.get<Material>(`/materials/${id}`);
  },
  
  async searchMaterials(query: string): Promise<Material[]> {
    return apiClient.get<Material[]>(`/materials/search?q=${query}`);
  },
};
```

### Custom Hook for Data Fetching

```typescript
// features/materials/hooks/useMaterials.ts
import { useState, useEffect } from 'react';
import { materialsService } from '../services/materialsService';
import type { Material } from '../types';

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    materialsService.getAll()
      .then(data => {
        if (mounted) {
          setMaterials(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, []);
  
  return { materials, loading, error };
}
```

---

## 6. Security

### Environment Variables

```typescript
// ✅ GOOD: Use environment variables for sensitive data
const API_KEY = import.meta.env.VITE_API_KEY;

// ❌ BAD: Hardcoded secrets
const API_KEY = 'abc123xyz';
```

### Input Sanitization

```typescript
// lib/sanitize.ts
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .slice(0, 1000); // Limit length
}
```

### Authentication Token Handling

```typescript
// lib/auth.ts
const TOKEN_KEY = 'auth_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Add to API requests
export async function authenticatedRequest(url: string, options?: RequestInit) {
  const token = authStorage.getToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}
```

### Security Rules

1. **Never commit secrets** to version control
2. **Validate all user input** on client and server
3. **Use HTTPS** for all API calls in production
4. **Implement rate limiting** for API calls
5. **Sanitize user-generated content** before display
6. **Use secure storage** for sensitive data (never localStorage for tokens in production)

---

## 7. Performance

### Code Splitting

```typescript
// Lazy load routes
import { lazy, Suspense } from 'react';

const MaterialsPage = lazy(() => import('@/features/materials/pages/MaterialsPage'));
const ServicesPage = lazy(() => import('@/features/services/pages/ServicesPage'));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization

```typescript
import { useMemo, useCallback } from 'react';

function ProductsList({ products }: { products: Product[] }) {
  // Memoize expensive calculations
  const sortedProducts = useMemo(() => {
    return products.sort((a, b) => a.price - b.price);
  }, [products]);
  
  // Memoize callbacks passed to children
  const handleAddToCart = useCallback((productId: string) => {
    // Add to cart logic
  }, []);
  
  return (
    <div>
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
      ))}
    </div>
  );
}
```

### Image Optimization

```typescript
// Use proper image formats and lazy loading
<img
  src={product.imageUrl}
  alt={product.name}
  loading="lazy"
  width={300}
  height={300}
/>
```

### Performance Checklist

- [ ] Use React.memo() for expensive components
- [ ] Implement virtual scrolling for long lists
- [ ] Lazy load images and components
- [ ] Debounce search inputs
- [ ] Cache API responses
- [ ] Minimize bundle size
- [ ] Use production builds
- [ ] Implement proper loading states

---

## 8. Testing

### Unit Tests

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Integration Tests

```typescript
// features/materials/MaterialsPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MaterialsPage } from './MaterialsPage';

describe('MaterialsPage', () => {
  it('displays materials after loading', async () => {
    render(<MaterialsPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Cement')).toBeInTheDocument();
      expect(screen.getByText('Sand')).toBeInTheDocument();
    });
  });
});
```

### Testing Standards

1. **Test user behavior**, not implementation
2. **Write tests for critical paths** (checkout, cart, orders)
3. **Mock external dependencies** (API calls)
4. **Aim for 80%+ coverage** on critical features
5. **Keep tests simple and readable**

---

## 9. Error Handling

### Error Boundary

```typescript
// components/common/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Error Handling Pattern

```typescript
// utils/errorHandler.ts
export function handleError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Usage in component
function ProductDetails() {
  const [error, setError] = useState<string | null>(null);
  
  const loadProduct = async () => {
    try {
      const product = await materialsService.getById(id);
      setProduct(product);
    } catch (err) {
      setError(handleError(err));
    }
  };
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  // ...
}
```

---

## 10. Accessibility

### Semantic HTML

```typescript
// ✅ GOOD: Semantic HTML
<nav>
  <ul>
    <li><a href="/materials">Materials</a></li>
    <li><a href="/services">Services</a></li>
  </ul>
</nav>

// ❌ BAD: Divs for everything
<div className="nav">
  <div className="nav-item" onClick={goTo}>Materials</div>
</div>
```

### ARIA Labels

```typescript
<button
  onClick={addToCart}
  aria-label="Add cement to cart"
>
  <ShoppingCartIcon />
</button>

<input
  type="search"
  placeholder="Search materials..."
  aria-label="Search materials and services"
/>
```

### Keyboard Navigation

```typescript
function Modal({ isOpen, onClose, children }: ModalProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus trap logic
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  return isOpen ? (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null;
}
```

### Accessibility Checklist

- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states are visible
- [ ] Screen reader tested

---

## 11. Git Workflow

### Branch Naming

```
feature/materials-listing
fix/cart-quantity-bug
hotfix/payment-crash
chore/update-dependencies
```

### Commit Messages

```
feat: add materials category page
fix: resolve cart total calculation error
chore: update react to v18
docs: add API integration guide
refactor: extract cart logic to custom hook
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

---

## 12. Documentation

### Component Documentation

```typescript
/**
 * ProductCard displays material or service information
 * 
 * @param product - Product data to display
 * @param onAddToCart - Callback when add to cart is clicked
 * 
 * @example
 * ```tsx
 * <ProductCard
 *   product={cementProduct}
 *   onAddToCart={(id) => console.log(id)}
 * />
 * ```
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
}
```

### Function Documentation

```typescript
/**
 * Calculates the total price including delivery charges
 * 
 * @param items - Cart items
 * @param deliveryCharge - Delivery fee
 * @returns Total price in rupees
 */
export function calculateTotal(items: CartItem[], deliveryCharge: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal + deliveryCharge;
}
```

### README Requirements

Each feature module should have:
- Purpose and scope
- API documentation
- Component usage examples
- Known limitations

---

## 13. Platform-Specific Guidelines

### 🌐 React Web-Only Guidelines

#### Routing
- Use **React Router** (`react-router-dom`)
- Use `BrowserRouter` for web applications
- Implement code splitting with lazy loading

#### Styling
- Use **Tailwind CSS** following RealServ brand guidelines
- Custom CSS modules for complex components
- Media queries for responsive design

#### Storage
- Use `localStorage` for client-side persistence
- Use `sessionStorage` for temporary data

#### Build Tools
- Vite for development and production builds
- ESLint + Prettier for code quality

---

### 📱 React Native-Only Guidelines

#### Navigation
- Use **React Navigation** (`@react-navigation/native`)
- Use `NavigationContainer` as root component
- Implement native stack and tab navigators

#### Styling
- Use **StyleSheet** API for styling
- Use **NativeWind** for Tailwind-like utility classes (optional)
- Platform-specific styles with `Platform.select()`

```typescript
// Platform-specific styles
const styles = StyleSheet.create({
  container: {
    padding: Platform.select({
      ios: 16,
      android: 12,
    }),
  },
});
```

#### Storage
- Use **AsyncStorage** (`@react-native-async-storage/async-storage`) for persistence
- Never use `localStorage` (not available)

```typescript
// React Native storage
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
```

#### Build Tools
- Metro bundler for development
- React Native CLI or Expo for builds
- ESLint for code quality

#### Platform-Specific Components
- Use `Platform` module for conditional rendering
- Use native components (`View`, `Text`, `TouchableOpacity`)

```typescript
// Platform-specific components
import { Platform, View, Text } from 'react-native';

function ProductCard() {
  return (
    <View>
      <Text>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
    </View>
  );
}
```

---

## Key Differences Summary

| Aspect | React Web | React Native |
|--------|-----------|--------------|
| **Routing** | React Router | React Navigation |
| **Styling** | Tailwind CSS, CSS Modules | StyleSheet, NativeWind |
| **Storage** | localStorage, sessionStorage | AsyncStorage |
| **Components** | HTML elements (`<div>`, `<button>`) | Native components (`<View>`, `<TouchableOpacity>`) |
| **Images** | `<img>` tag | `<Image>` component |
| **Navigation** | `<Link>`, `useNavigate()` | `navigation.navigate()` |
| **Build** | Vite | Metro bundler |
| **Deployment** | Web hosting | App stores (iOS/Android) |

---

## Universal Standards (Apply to Both)

✅ **Code Standards** - Naming, structure, principles  
✅ **Component Architecture** - Presentation, container, layout patterns  
✅ **State Management** - useState, Context API patterns  
✅ **API Integration** - Service layer, hooks, error handling  
✅ **Security** - Input validation, auth patterns  
✅ **Testing** - Unit and integration test patterns  
✅ **Error Handling** - Error boundaries, error handling patterns  
✅ **Git Workflow** - Branch naming, commit messages  
✅ **Documentation** - Component and function documentation  

---

## 14. TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "ESNext"],
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### ESLint Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["@typescript-eslint", "react", "react-hooks", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

## 15. Design System (RealServ Brand)

### Brand Colors

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}
```

### Brand Typography

```css
:root {
  --font-family: 'Roboto', sans-serif;
  --font-size-base: 16px;
  --font-weight-normal: 400;
  --font-weight-bold: 700;
}
```

### Brand Icons

- Use **Font Awesome** for icons
- Import icons as needed

```typescript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faHome} />
```

---

## 16. Form Handling

### Formik for Form Management

```typescript
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export function RegistrationForm() {
  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="name" placeholder="Name" />
          <ErrorMessage name="name" component="div" className="error" />
          
          <Field type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" className="error" />
          
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" className="error" />
          
          <button type="submit" disabled={isSubmitting}>
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
}
```

---

## 17. User Feedback (Toasts)

### React Toastify for Notifications

```typescript
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function App() {
  return (
    <div>
      <button onClick={() => showToast('Success!', 'success')}>Show Success Toast</button>
      <ToastContainer />
    </div>
  );
}
```

---

## 18. Loading States

### React Spinners for Loading Indicators

```typescript
import { RingLoader } from 'react-spinners';
import 'react-spinners/css/RingLoader.css';

export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <RingLoader color="#007bff" size={50} />
    </div>
  );
}

export function App() {
  return (
    <div>
      <LoadingSpinner />
    </div>
  );
}
```

---

## 19. Date & Time Handling

### Luxon for Date and Time

```typescript
import { DateTime } from 'luxon';

export function formatDate(date: Date | string): string {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL);
}

export function App() {
  return (
    <div>
      <p>Today's date: {formatDate(new Date())}</p>
    </div>
  );
}
```

---

## 20. Constants & Enums

### Constants for Reusable Values

```typescript
// constants/index.ts
export const API_BASE_URL = 'https://api.realserv.com';
export const MAX_CART_ITEMS = 10;
export const DEFAULT_DELIVERY_CHARGE = 50;
```

### Enums for Categorical Data

```typescript
// types/index.ts
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
```

---

## 21. Code Review Checklist

### General Checks

- [ ] **Code Quality:** Follows coding standards and best practices
- [ ] **Documentation:** Includes comments and documentation for complex logic
- [ ] **Testing:** Includes unit and integration tests
- [ ] **Security:** No hard-coded secrets, input validation, secure storage
- [ ] **Performance:** Optimized for performance, lazy loading, memoization
- [ ] **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation
- [ ] **Git Workflow:** Follows branch naming and commit message conventions
- [ ] **Build Tools:** Uses appropriate build tools and configurations

### React Web Specific

- [ ] **Routing:** Uses React Router for navigation
- [ ] **Styling:** Uses Tailwind CSS for styling
- [ ] **Storage:** Uses localStorage and sessionStorage for client-side persistence
- [ ] **Build Tools:** Uses Vite for development and production builds

### React Native Specific

- [ ] **Navigation:** Uses React Navigation for navigation
- [ ] **Styling:** Uses StyleSheet for styling
- [ ] **Storage:** Uses AsyncStorage for persistence
- [ ] **Build Tools:** Uses Metro bundler for development

---

## Standards Review

This document should be reviewed quarterly and updated as the application evolves.

**Next Review:** April 2026