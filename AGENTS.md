# AGENTS.md — CineSelect Frontend

## Project Overview
React 18 + TypeScript + Vite cinema booking platform. Dark theme UI with Tailwind CSS, Zustand state management, and React Router.

## Commands
All commands run from `frontend/` directory.

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint (zero warnings allowed) |
| `npm run preview` | Preview production build |

**Note:** No test framework is configured. To add tests, install Vitest: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom` and add `"test": "vitest"` to scripts.

## Code Style

### Formatting
- **Indentation:** 4 spaces (see `vite.config.ts`, `tailwind.config.js`, `App.tsx`)
- **Semicolons:** Required
- **Quotes:** Single quotes for strings
- **Trailing commas:** None
- **Line length:** No hard limit, keep readable

### TypeScript
- `strict: true` — no implicit any, strict null checks
- `noUnusedLocals: true` — remove unused imports/variables
- `noUnusedParameters: true` — remove unused function params
- Use `interface` for object shapes, `type` for unions/intersections
- All types live in `src/types/index.ts`
- Use `ApiResponse<T>` wrapper for API responses
- Prefer explicit return types on public functions

### Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `Button`, `SeatSelector` |
| Hooks | camelCase, `use` prefix | `useAuth`, `useBookingState` |
| Stores | camelCase, `use` prefix + `Store` suffix | `useAuthStore`, `useBookingStore` |
| Types/Interfaces | PascalCase | `Movie`, `BookingState` |
| Files | PascalCase for components, camelCase for others | `Button.tsx`, `api.ts` |
| Tailwind colors | `cs-` prefix | `bg-cs-dark`, `text-cs-accent` |

### Imports
- Group imports: React/libs first, then local (relative paths)
- Use relative imports (`../types`, `./components/common/Button`)
- No path aliases configured in tsconfig
- Default export for pages and services; named exports for components/hooks

### Component Patterns
```tsx
import React from 'react';

interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  return (
    <element className={`... ${className}`} {...props}>
      {children}
    </element>
  );
};
```

### State Management (Zustand)
- Define state interface in the store file
- Use `create<StateInterface>()` pattern
- Actions are methods within the store
- Auth state persists via `localStorage`

### Error Handling
- Throw `Error` with descriptive Russian messages for user-facing errors
- Wrap async calls in try/catch in stores
- API methods throw on auth failures, not-found, validation errors
- Use `console.error` for debugging, not user display

### Styling
- Tailwind CSS with custom `cs-*` color tokens
- Dark theme: black background (`#000000`), dark surfaces (`#111111`)
- Border color: `#222222`, accent: `#6ba9d5`, VIP gold: `#C5A059`
- Framer Motion for animations
- Inline `className` composition with template literals

### Project Structure
```
frontend/src/
├── components/
│   ├── booking/    # SeatSelector, etc.
│   ├── common/     # Button, Input, Modal, LoadingSpinner
│   ├── layout/     # Header, Footer, Layout
│   └── user/       # Dashboard, BookingHistory, DigitalTicket
├── hooks/          # useAuth, useBookingState
├── pages/          # Route components (Home, Movies, Login, etc.)
├── services/       # api.ts (mock), poiskkinoApi.ts (external API)
├── stores/         # Zustand stores (auth, booking)
├── styles/         # globals.css
├── types/          # index.ts — all TypeScript types
└── utils/          # Helper functions
```

### API Layer
- `src/services/api.ts` — mock API with in-memory database
- `src/services/poiskkinoApi.ts` — external PoiskKino API integration
- Mock API simulates network delay (200-500ms)
- External API key from `VITE_POISKKINO_API_KEY` env var

### Git / Workflow
- No lint-staged or pre-commit hooks configured
- Run `npm run lint` before committing
- Run `npm run build` to verify type-checking passes
