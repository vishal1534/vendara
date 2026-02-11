# Shared Code

This directory contains code shared between the Admin and Vendor portals.

## Structure

```
shared/
├── components/
│   └── ui/           # Shared UI components (shadcn/ui)
├── utils/            # Shared utility functions
├── types/            # Shared TypeScript types
├── hooks/            # Shared React hooks
├── constants/        # Shared constants
└── lib/              # Third-party library configurations
```

## Usage

Import shared code using the `@shared` alias:

```typescript
import { Button } from '@shared/components/ui/button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { Order } from '@shared/types/order';
```

## Guidelines

- Only add code here if it's truly identical across portals
- Document what uses each shared module
- Keep portal-specific code in respective portal directories
