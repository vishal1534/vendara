# RealServ Design System Quick Reference

**For**: Developers building features in Admin or Vendor portals  
**Updated**: January 10, 2026

---

## The One Thing to Remember

RealServ has **two intentional design languages**:

| Portal | Style | Borders | Radius | For |
|--------|-------|---------|--------|-----|
| **Admin** | Professional | `border` (1px) | `rounded-lg` (8px) | Operations team |
| **Vendor** | Approachable | `border-2` (2px) | `rounded-xl` (12px) | Small businesses |

**This is intentional, not a bug.** ✅

---

## Quick Templates

### Admin Portal Components

```tsx
// Card
<div className="bg-white border border-neutral-200 rounded-lg p-6">
  {/* content */}
</div>

// Info Banner
<div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
  {/* content */}
</div>

// Section with divider
<div className="border-b border-neutral-200">
```

### Vendor Portal Components

```tsx
// Card
<div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
  {/* content */}
</div>

// Info Banner
<div className="bg-warning-50 border-2 border-warning-200 rounded-xl p-4">
  {/* content */}
</div>

// Section with divider
<div className="border-b-2 border-neutral-200">
```

---

## Copy-Paste Checklist

### Admin → Vendor
- [ ] `border` → `border-2`
- [ ] `rounded-lg` → `rounded-xl` (for cards)

### Vendor → Admin
- [ ] `border-2` → `border`
- [ ] `rounded-xl` → `rounded-lg`

---

## What's Identical ✅

- Colors (construction-native palette)
- Typography (fonts, sizes, weights)
- Spacing (padding, margin, gap)
- Icons (Lucide React)
- Components (shadcn/ui)
- Behavior (interactions, states)

---

## Full Documentation

| Need | Document |
|------|----------|
| **Complete design philosophy** | `/DESIGN_SYSTEM_PHILOSOPHY.md` |
| **Search+filter pattern** | `/SEARCH_FILTER_DESIGN_STANDARD.md` |
| **Why we made this decision** | `/DESIGN_DECISION_SUMMARY.md` |
| **Historical analysis** | `/DESIGN_SYSTEM_INCONSISTENCY_ANALYSIS.md` |

---

## When in Doubt

Ask: **"Who am I building this for?"**

- **Admin team** → 1px/8px
- **Vendors** → 2px/12px

That's it! 🎯
