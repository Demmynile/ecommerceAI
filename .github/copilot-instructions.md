# eCommerceAI Codebase Instructions for AI Agents

## Project Overview
**eCommerceAI** is a Next.js 16 + Sanity 4 headless CMS e-commerce platform with Clerk authentication. It uses App Router, TypeScript, Tailwind CSS, and shadcn/ui components.

**Key Stack:**
- **Frontend**: Next.js 16.1.1 (App Router, React 19)
- **CMS**: Sanity 4 with next-sanity 11
- **Auth**: Clerk for user management
- **Styling**: Tailwind CSS 4, shadcn/ui, styled-components
- **Code Quality**: Biome 2.2.0 (linter/formatter, replaces ESLint)
- **Type Safety**: TypeScript strict mode, React Compiler enabled

---

## Architecture Patterns

### Next.js App Router Structure
```
app/
  ├── layout.tsx                    # Root layout with ClerkProvider
  ├── globals.css                   # Tailwind directives
  ├── (app)/                        # Public customer-facing routes
  │   ├── layout.tsx
  │   └── page.tsx                  # Home page (skeleton structure)
  ├── (admin)/                      # Admin routes (empty, ready for expansion)
  └── studio/[[...tool]]/           # Sanity Studio mounted at /studio
      └── page.tsx                  # NextStudio component wrapper
```

**Pattern**: Route groups (parentheses) isolate concerns - `(app)` for customer, `(admin)` for backend operations. Studio route uses catch-all for Sanity's dynamic routing.

### Sanity CMS Integration
**Client Setup** ([sanity/lib/client.ts](sanity/lib/client.ts)):
- Uses `next-sanity` createClient with CDN enabled (set `useCdn: false` for ISR/revalidation)
- Environment variables from [sanity/env.ts](sanity/env.ts): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- API version locked to `2026-01-15`

**Schema Structure** ([sanity/schemaTypes/index.ts](sanity/schemaTypes/index.ts)):
- Currently empty `types: []` - schemas should be defined as individual files and imported here
- Use pattern: `export default defineType({...})` per document type
- Studio auto-discovers types from this index

**Studio Configuration** ([sanity.config.ts](sanity.config.ts)):
- Mounted at `/studio` route with structureTool and visionTool (GROQ query builder)
- Structure defined in [sanity/structure.ts](sanity/structure.ts) using `S.documentTypeListItems()`

---

## Development Workflows

### Local Development
```bash
npm run dev                # Start Next.js dev server (http://localhost:3000)
npm run build              # Build for production
npm run start              # Run production build locally
```

### Code Quality
```bash
npm run lint               # Run Biome linter across project (replaces ESLint)
npm run format --write     # Auto-format code with Biome
```

**Biome Configuration** ([biome.json](biome.json)):
- Checks: TypeScript, JSX, React, Next.js rules all set to "recommended"
- Formatter: 2-space indentation, spaces (not tabs)
- Auto-organize imports enabled
- Ignores: node_modules, .next, dist, build

### Sanity CLI
```bash
sanity schema deploy      # Deploy schema changes to cloud
sanity manage             # Open Sanity management dashboard
npx sanity@latest docs    # Open Sanity documentation
```

---

## Key Conventions & Patterns

### Type Paths & Aliases
All imports use `@/*` alias pointing to project root (defined in [tsconfig.json](tsconfig.json#L22)):
```typescript
import { cn } from "@/lib/utils"           // Utility helpers
import { client } from "@/sanity/lib/client" // CMS client
import { ClerkProvider } from "@clerk/nextjs"
```

### UI Component Pattern (shadcn/ui)
- Install components: `npx shadcn-ui@latest add [component-name]`
- Components go in `components/ui/` with Tailwind styling
- Use `cn()` utility from [lib/utils.ts](lib/utils.ts) to merge classNames safely:
```typescript
<button className={cn("px-4 py-2", isActive && "bg-blue-600")} />
```

### Client vs Server Components
- Root layout wraps `ClerkProvider` (forces client boundary)
- App layout repeats `ClerkProvider` (already wrapped in root)
- Home page `/app/(app)/page.tsx` is currently a skeleton with three section comments:
  - Feature Product Carousel
  - Page Banner
  - Category Tiles

### Styling Strategy
- **Tailwind CSS 4**: Primary styling engine
- **styled-components**: Already in dependencies (currently unused)
- **CSS Variables**: Shadcn uses CSS variables for theming (in globals.css)
- Avoid inline styles; use Tailwind classes or `cn()` helper

### Environment Variables
- All Sanity vars are prefixed `NEXT_PUBLIC_` (used in browser)
- Clerk vars typically: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Store in `.env.local` (git-ignored)

---

## Common Tasks

### Add a Sanity Document Type
1. Create `sanity/schemaTypes/product.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    { name: 'name', type: 'string', validation: (R) => R.required() },
    { name: 'price', type: 'number' },
  ],
})
```
2. Import in `sanity/schemaTypes/index.ts`: `import product from './product'`
3. Add to schema types array: `types: [product]`
4. Deploy: `sanity schema deploy`

### Add a Page/Route
1. Create `app/(app)/products/page.tsx`
2. Fetch from Sanity using `client.fetch(groq)` if server component
3. Use page skeleton structure (already in home)

### Integrate New shadcn Component
1. `npx shadcn-ui@latest add button` (installs to components/ui/)
2. Import and use: `import { Button } from "@/components/ui/button"`
3. Style with Tailwind classes

---

## Testing & Quality Checks
- **No Jest/Vitest configured** - consider adding for unit tests
- **Linting**: Run `npm run lint` before commits (enforced by Biome VCS pre-commit)
- **Formatting**: Run `npm run format --write` to auto-fix code style
- **Type checking**: TypeScript strict mode enabled (tsconfig.json)

---

## Important Files Reference
| File | Purpose |
|------|---------|
| [sanity.config.ts](sanity.config.ts) | Sanity Studio config (basePath, plugins, schema) |
| [sanity/env.ts](sanity/env.ts) | Environment variable validation & export |
| [sanity/lib/client.ts](sanity/lib/client.ts) | Configured Sanity client for data fetching |
| [app/layout.tsx](app/layout.tsx) | Root layout with ClerkProvider |
| [tsconfig.json](tsconfig.json) | TypeScript config with `@/*` path alias |
| [biome.json](biome.json) | Code quality rules (linter/formatter) |
| [components.json](components.json) | shadcn/ui registry configuration |

---

## Gotchas & Notes
- **ClerkProvider is duplicated**: Root layout and app layout both wrap it - consider removing from app layout
- **Schema is empty**: All product/category/order types still need to be created
- **Admin routes empty**: Implement admin dashboard in `app/(admin)/`
- **React Compiler enabled**: Stable in Next.js 16; helps with re-render optimization
- **Biome replaces ESLint**: Different command syntax; check Biome docs for rule names
- **API versioning locked**: If Sanity API changes, update date in `sanity/env.ts`
