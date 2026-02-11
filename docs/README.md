# RealServ Documentation

Welcome to the RealServ documentation. This directory contains all technical documentation for the RealServ platform.

---

## 📌 Root Documentation (Important)

Key design and engineering standards are located in the project root:

- [**/STANDARDS.md**](../STANDARDS.md) - Complete engineering standards (web + mobile)
- [**/ATTRIBUTIONS.md**](../ATTRIBUTIONS.md) - Third-party libraries and licenses
- [**/DESIGN_SYSTEM_PHILOSOPHY.md**](../DESIGN_SYSTEM_PHILOSOPHY.md) - Dual design system rationale
- [**/DESIGN_SYSTEM_QUICK_REFERENCE.md**](../DESIGN_SYSTEM_QUICK_REFERENCE.md) - Quick reference guide
- [**/SEARCH_FILTER_DESIGN_STANDARD.md**](../SEARCH_FILTER_DESIGN_STANDARD.md) - Filter component standards

---

## 📁 Documentation Structure

### 📐 [Architecture](./architecture/)
System architecture, technical design, and platform overviews
- [System Overview](./architecture/system-overview.md) - High-level system architecture
- [Admin Portal](./architecture/admin-portal.md) - Admin portal architecture
- [Vendor Portal](./architecture/vendor-portal.md) - Vendor portal architecture

### 💻 [Development](./development/)
Development guides, standards, and best practices
- [Getting Started](./development/getting-started.md) - Development environment setup
- [Engineering Standards](./development/standards.md) - Code standards and best practices
- [Design System](./development/design-system.md) - UI/UX design system and components

### 📋 [Planning](./planning/)
Implementation plans and project roadmaps
- [Admin Implementation Plan](./planning/admin-implementation-plan.md) - Admin portal implementation plan
- [Vendor Implementation Plan](./planning/vendor-implementation-plan.md) - Vendor portal implementation plan

### 📚 [Reference](./reference/)
Reference materials, wireframes, and attributions
- [Wireframes](./reference/wireframes/) - All platform wireframes
- [Brand Guide](./reference/brand-guide.html) - RealServ brand guidelines
- [Attributions](./reference/attributions.md) - Third-party libraries and credits

---

## 🚀 Quick Links

| Document | Purpose | Audience |
|----------|---------|----------|
| [System Overview](./architecture/system-overview.md) | Understand platform architecture | All |
| [Getting Started](./development/getting-started.md) | Setup development environment | Developers |
| [Engineering Standards](./development/standards.md) | Follow coding standards | Developers |
| [Design System](./development/design-system.md) | Implement UI components | Developers, Designers |
| [Admin Portal Architecture](./architecture/admin-portal.md) | Understand admin portal | Product, Engineering |
| [Vendor Portal Architecture](./architecture/vendor-portal.md) | Understand vendor portal | Product, Engineering |

---

## 📦 Project Overview

**RealServ** is a hyperlocal construction materials marketplace for Hyderabad, enabling individual home builders to order small quantities of materials and book skilled labor with fixed pricing.

### Platform Components

1. **Buyer App** (Mobile - iOS/Android)
   - Mobile-only React Native application
   - For individual home builders
   - Separate from this web codebase

2. **Vendor Portal** (Web - Desktop-first)
   - React web application
   - For material suppliers and labor providers
   - Production-ready ✅

3. **Admin Portal** (Web - Desktop-first)
   - React web application
   - For RealServ operations team
   - Production-ready ✅

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Routing**: React Router v7
- **Charts**: recharts
- **Build**: Vite

---

## 📞 Support

For questions or issues:
1. Check relevant documentation sections
2. Review code comments and inline documentation
3. Consult engineering standards
4. Reach out to the development team

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production Ready