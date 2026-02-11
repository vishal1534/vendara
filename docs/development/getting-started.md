# Getting Started with RealServ Development

**Last Updated**: January 2026

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) or your preferred editor

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd realserv
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- TypeScript
- Tailwind CSS v4
- React Router v7
- shadcn/ui components
- recharts
- And all other dependencies

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

---

## Portal Access

The project contains two web portals:

### Vendor Portal
- **URL**: `http://localhost:5173/vendor/login`
- **Entry**: `index.html`
- **Test Login**: Enter any phone number (e.g., `9876543210`)

### Admin Portal
- **URL**: `http://localhost:5173/admin/login`
- **Entry**: `admin.html`
- **Test Login**: Enter any phone number (e.g., `9999999999`)

---

## Project Structure Overview

```
/
├── src/
│   ├── admin/              # Admin Portal
│   ├── vendor/             # Vendor Portal
│   ├── app/                # Shared resources
│   └── styles/             # Global styles
│
├── docs/                   # Documentation
├── index.html              # Vendor Portal entry
├── admin.html              # Admin Portal entry
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Development Workflow

### Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

### Making Changes

1. **Choose the portal** you want to work on (admin or vendor)
2. **Navigate to the feature** in `/src/{portal}/features/`
3. **Make your changes** following the established patterns
4. **Test manually** in the browser
5. **Verify type safety** with TypeScript

---

## Key Directories

### `/src/admin/` - Admin Portal
- `app/` - App configuration and routing
- `features/` - Feature modules (dashboard, vendors, orders, etc.)
- `components/` - Shared components
- `context/` - Context providers
- `types/` - TypeScript types
- `data/` - Mock data
- `utils/` - Utility functions

### `/src/vendor/` - Vendor Portal
- `app/` - App configuration and routing
- `features/` - Feature modules (dashboard, orders, payouts, etc.)
- `components/` - Shared components
- `context/` - Context providers
- `types/` - TypeScript types
- `mocks/` - Mock data
- `utils/` - Utility functions

### `/src/app/components/ui/` - Shared UI Components
- shadcn/ui components used by both portals
- Buttons, inputs, dialogs, tables, etc.

---

## Common Tasks

### Adding a New Page

1. Create page component in `/src/{portal}/features/{feature}/pages/`
2. Add route in `/src/{portal}/app/routes.tsx`
3. Add navigation link in sidebar if needed

Example:
```typescript
// src/admin/features/reports/pages/ReportsPage.tsx
export function ReportsPage() {
  return <div>Reports Page</div>;
}

// Add to src/admin/app/routes.tsx
{
  path: 'reports',
  element: <ReportsPage />
}
```

### Creating a New Component

1. Create component file in appropriate directory
2. Define TypeScript interface for props
3. Export component
4. Import and use in pages

Example:
```typescript
// src/admin/components/common/InfoCard.tsx
interface InfoCardProps {
  title: string;
  value: string | number;
}

export function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-neutral-600">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
```

### Working with Mock Data

All features currently use mock data for the MVP. Mock data is located in:
- `/src/admin/data/` - Admin portal mock data
- `/src/vendor/mocks/` - Vendor portal mock data

To modify mock data:
1. Find the relevant mock file
2. Edit the data structure
3. Save - hot reload will apply changes

---

## Styling Guidelines

### Tailwind CSS v4

We use Tailwind CSS v4 for all styling:

```tsx
// Use utility classes
<div className="flex items-center gap-4 p-6 rounded-lg bg-white border border-neutral-200">
  <h2 className="text-xl font-semibold text-neutral-900">Title</h2>
</div>
```

### Theme Customization

Theme variables are defined in `/src/styles/theme.css`:
- Color tokens
- Typography scales
- Spacing units
- Border radius values

### Construction-Native Colors

```css
Primary:   #2F3E46  /* Steel Blue-Grey */
Secondary: #D2B48C  /* Sandstone */
Success:   #4A5D73  /* Success Blue-Grey */
Warning:   #C47A2C  /* Site Amber */
Error:     #8B2C2C  /* Brick Red */
```

---

## TypeScript

All code is written in TypeScript with strict mode enabled.

### Type Safety Tips

1. **Always define prop interfaces**
2. **Use type inference where possible**
3. **Avoid `any` - use `unknown` if needed**
4. **Define types for mock data**
5. **Use TypeScript's utility types** (Partial, Pick, Omit, etc.)

Example:
```typescript
// Define types
interface Product {
  id: string;
  name: string;
  price: number;
}

// Use types
const products: Product[] = [];
const getProduct = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
```

---

## Code Quality

### Before Committing

1. **Type check**: `npx tsc --noEmit`
2. **Test manually** in both desktop and mobile viewports
3. **Check browser console** for errors/warnings
4. **Review your changes** for code quality

### Code Standards

- Use descriptive variable and function names
- Keep components focused and small
- Extract reusable logic into hooks
- Follow existing patterns in the codebase
- Add comments only when necessary (code should be self-documenting)

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Type Errors

```bash
# Check all TypeScript errors
npx tsc --noEmit

# Common fix: restart TypeScript server in VS Code
# Command Palette > "TypeScript: Restart TS Server"
```

### Build Errors

```bash
# Clean install
rm -rf node_modules dist
npm install
npm run build
```

### Hot Reload Not Working

```bash
# Restart dev server
# Ctrl+C to stop
npm run dev
```

---

## VS Code Setup (Recommended)

### Recommended Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Error Translator**
- **Prettier - Code formatter**
- **ESLint**

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Next Steps

1. **Explore the codebase** - Browse through the features
2. **Read the architecture docs** - Understand the system design
3. **Check the standards** - Follow coding conventions
4. **Review the design system** - Learn the UI patterns
5. **Build something!** - Start with a small feature or bug fix

---

## Useful Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [recharts](https://recharts.org)

---

## Getting Help

- Check the [Architecture Documentation](../architecture/)
- Review [Engineering Standards](./standards.md)
- Consult the [Design System](./design-system.md)
- Ask the development team

---

**Happy Coding! 🚀**
