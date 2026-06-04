# Hotzy Foods — Full-Stack Redesign Architecture Plan

## 1. Overview

**Brand:** Hotzy Foods — Sri Lankan hot sauce & condiment brand (est. 2022)
**Current site:** hotzyfoods.com (WooCommerce-based)
**Goal:** Rebuild with modern stack (React + Next.js + tRPC + PostgreSQL)
**Design system:** "Vibrant Culinary Modernism" (Chili Red, Golden Glaze, Fresh Mint palette)

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Monorepo** | pnpm workspaces + Turborepo | Shared packages, parallel builds, single versioning |
| **Frontend** | Next.js 14 (App Router) + TypeScript strict | SSR for SEO, built-in API layer, image optimization |
| **Styling** | Tailwind CSS v3 + custom brand preset | Matches design system 1:1, utility-first |
| **State** | TanStack React Query (server) + Zustand (client) | Cache tRPC responses, client-side cart/auth |
| **Forms** | React Hook Form + Zod schemas | Type-safe, validated forms (admin CRUD) |
| **API** | tRPC v11 | End-to-end type safety, zero codegen |
| **Auth (Admin)** | NextAuth.js v5 (Auth.js) | Admin credentials, JWT sessions |
| **Auth (Customer)** | JWT (simple token) | Lightweight, no session store needed |
| **ORM** | Prisma | Type-safe queries, migrations, Studio GUI |
| **Database** | PostgreSQL 16 | Relational integrity for e-commerce data |
| **Validation** | Zod | Shared schemas between server & client |
| **Storage** | Uploadthing / Cloudinary | Image uploads for products, banners, team |
| **Dev tools** | ESLint, Prettier, Husky, lint-staged | Code quality enforced on commit |

## 3. Customer Flow

```
                    ┌─────────────────────────┐
                    │   Customer arrives       │
                    └────────┬────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   Browse products  │
                    │   Add to cart      │◄── No auth required
                    └────────┬──────────┘
                             │
                    ┌────────▼─────────┐
                    │   Checkout         │
                    └────────┬──────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
    ┌─────────────────┐           ┌───────────────────┐
    │  Guest checkout  │           │  Login / Register  │
    │  (email + name)   │           │  (optional)        │
    └────────┬─────────┘           └────────┬──────────┘
             │                              │
             └──────────┬───────────────────┘
                        ▼
              ┌────────────────────┐
              │  Order placed       │
              │  Confirmation shown │
              └────────┬───────────┘
                       │
              ┌────────▼───────────┐
              │  Order tracking     │
              │  via email link     │◄── Works for guests too
              │  or account orders  │
              └────────────────────┘
```

### Customer Auth Strategy
- **Guest checkout is first-class** — no forced registration
- **Post-checkout upsell** — "Create an account to track orders" after purchase
- **Order lookup** — guests can enter email + order number to see status without login
- **Customer != User** — `User` = admin staff, `Customer` = buyers

### Customer Pages
| Page | Route | Auth Required |
|---|---|---|
| Login / Register | `/login` | No |
| My Account | `/account` | Yes |
| Order History | `/account/orders` | Yes |
| Order Detail | `/account/orders/[id]` | Yes |
| Profile | `/account/profile` | Yes |
| Saved Addresses | `/account/addresses` | Yes |

## 4. Monorepo Directory Structure

```
hotzy/
├── .github/workflows/
│   ├── ci.yml                          # Lint, typecheck, test on PR
│   └── deploy.yml                      # Vercel deploy on main
├── apps/
│   ├── store/                          # Customer-facing app
│   │   ├── public/
│   │   │   ├── images/
│   │   │   └── favicon.ico
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (shop)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [slug]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── cart/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── about/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── (auth)/
│   │   │   │   │   └── login/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── account/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── orders/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── addresses/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── api/trpc/[trpc]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── globals.css
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── home/
│   │   │   │   │   ├── hero-section.tsx
│   │   │   │   │   ├── hot-deals-grid.tsx
│   │   │   │   │   ├── category-explorer.tsx
│   │   │   │   │   └── featured-products.tsx
│   │   │   │   ├── product/
│   │   │   │   │   ├── product-card.tsx
│   │   │   │   │   ├── product-grid.tsx
│   │   │   │   │   ├── product-gallery.tsx
│   │   │   │   │   ├── filter-bar.tsx
│   │   │   │   │   └── nutrition-accordion.tsx
│   │   │   │   ├── cart/
│   │   │   │   │   ├── cart-item.tsx
│   │   │   │   │   └── order-summary.tsx
│   │   │   │   ├── account/
│   │   │   │   │   ├── order-card.tsx
│   │   │   │   │   ├── address-card.tsx
│   │   │   │   │   └── order-tracker.tsx
│   │   │   │   └── layout/
│   │   │   │       ├── navbar.tsx
│   │   │   │       ├── footer.tsx
│   │   │   │       └── mobile-drawer.tsx
│   │   │   ├── lib/
│   │   │   │   ├── trpc.ts
│   │   │   │   ├── utils.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── auth.ts
│   │   │   └── providers/
│   │   │       ├── trpc-provider.tsx
│   │   │       └── auth-provider.tsx
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── admin/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   │   └── login/
│       │   │   │       └── page.tsx
│       │   │   ├── admin/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx
│       │   │   │   ├── inventory/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── products/
│       │   │   │   │   ├── new/
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── orders/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── customers/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── promotions/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── website/
│       │   │   │       └── page.tsx
│       │   │   ├── api/trpc/[trpc]/
│       │   │   │   └── route.ts
│       │   │   ├── globals.css
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── admin-sidebar.tsx
│       │   │   │   └── admin-topbar.tsx
│       │   │   ├── dashboard/
│       │   │   │   ├── kpi-card.tsx
│       │   │   │   ├── sales-chart.tsx
│       │   │   │   ├── top-products.tsx
│       │   │   │   └── recent-orders.tsx
│       │   │   ├── inventory/
│       │   │   │   └── product-table.tsx
│       │   │   ├── products/
│       │   │   │   ├── product-form.tsx
│       │   │   │   └── media-upload.tsx
│       │   │   ├── orders/
│       │   │   │   ├── order-card.tsx
│       │   │   │   └── order-status-tabs.tsx
│       │   │   ├── customers/
│       │   │   │   └── customer-table.tsx
│       │   │   └── promotions/
│       │   │       ├── promo-table.tsx
│       │   │       └── campaign-card.tsx
│       │   ├── lib/
│       │   │   ├── trpc.ts
│       │   │   ├── utils.ts
│       │   │   └── constants.ts
│       │   └── providers/
│       │       └── trpc-provider.tsx
│       ├── tailwind.config.ts
│       ├── next.config.ts
│       └── package.json
│
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── spice-meter.tsx
│   │   │   ├── kpi-card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── filter-chips.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── progress-steps.tsx
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── database/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       ├── index.ts
│   │       ├── seed.ts
│   │       └── utils.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/
│   │   └── src/
│   │       ├── root.ts
│   │       ├── trpc.ts
│   │       ├── routers/
│   │       │   ├── product.ts
│   │       │   ├── category.ts
│   │       │   ├── order.ts
│   │       │   ├── customer.ts
│   │       │   ├── customer-auth.ts
│   │       │   ├── customer-order.ts
│   │       │   ├── promo.ts
│   │       │   ├── campaign.ts
│   │       │   ├── dashboard.ts
│   │       │   ├── auth.ts
│   │       │   └── upload.ts
│   │       └── middleware/
│   │           ├── admin-auth.ts
│   │           └── customer-auth.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── validators/
│   │   └── src/
│   │       ├── product.ts
│   │       ├── order.ts
│   │       ├── promo.ts
│   │       ├── auth.ts
│   │       ├── customer.ts
│   │       └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── config-tailwind/
│   │   ├── src/
│   │   │   └── preset.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── config-typescript/
│       ├── base.json
│       ├── nextjs.json
│       └── react-library.json
│
├── docker-compose.yml
├── .gitignore
├── .prettierrc
├── .npmrc
├── .env.example
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## 5. Database Schema (Prisma)

```prisma
enum HeatLevel { MILD MEDIUM HOT XTREME }
enum OrderStatus { PENDING PROCESSING SHIPPED COMPLETED CANCELLED }
enum PromoType { PERCENTAGE FREE_SHIPPING FIXED_AMOUNT }
enum PromoStatus { ACTIVE SCHEDULED EXPIRED }
enum CampaignStatus { LIVE DRAFT }
enum UserRole { ADMIN SUPER_ADMIN }

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         UserRole @default(ADMIN)
  avatar       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Customer {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  name          String?
  phone         String?
  isGuest       Boolean   @default(true)
  totalOrders   Int       @default(0)
  totalSpent    Decimal   @default(0)
  segment       String?
  loyaltyPoints Int       @default(0)
  notes         String?
  addresses     Address[]
  orders        Order[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Address {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  label      String?
  name       String
  phone      String
  line1      String
  line2      String?
  city       String
  province   String
  isDefault  Boolean  @default(false)
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  icon        String?
  description String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  products    Product[]
}

model Product {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  sku             String      @unique
  description     String
  price           Decimal
  compareAtPrice  Decimal?
  costPrice       Decimal?
  stockLevel      Int         @default(0)
  lowStockThreshold Int       @default(10)
  heatLevel       HeatLevel?
  shuMin          Int?
  shuMax          Int?
  weight          Decimal?
  isActive        Boolean     @default(true)
  isFeatured      Boolean     @default(false)
  isBestseller    Boolean     @default(false)
  isNew           Boolean     @default(false)
  dietaryTags     String[]
  metaTitle       String?
  metaDesc        String?
  categoryId      String
  category        Category    @relation(fields: [categoryId], references: [id])
  images          ProductImage[]
  orderItems      OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  alt       String?
  sortOrder Int     @default(0)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Order {
  id               String      @id @default(cuid())
  orderNumber      String      @unique
  customerId       String?
  customer         Customer?   @relation(fields: [customerId], references: [id])
  status           OrderStatus @default(PENDING)
  subtotal         Decimal
  shippingCost     Decimal     @default(0)
  tax              Decimal     @default(0)
  total            Decimal
  promoCodeId      String?
  promoCode        PromoCode?  @relation(fields: [promoCodeId], references: [id])
  discountAmount   Decimal     @default(0)
  shippingName     String
  shippingPhone    String?
  shippingAddress  String
  shippingCity     String
  shippingProvince String?
  shippingCountry  String      @default("Sri Lanka")
  notes            String?
  paidAt           DateTime?
  shippedAt        DateTime?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  items            OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  unitPrice Decimal
  subtotal  Decimal
}

model PromoCode {
  id             String      @id @default(cuid())
  code           String      @unique
  type           PromoType
  value          Decimal
  minOrderAmount Decimal?    @default(0)
  maxUses        Int?
  currentUses    Int         @default(0)
  maxPerUser     Int?        @default(1)
  status         PromoStatus @default(ACTIVE)
  startsAt       DateTime?
  expiresAt      DateTime?
  description    String?
  createdAt      DateTime    @default(now())
  orders         Order[]
}

model Campaign {
  id          String          @id @default(cuid())
  title       String
  description String?
  status      CampaignStatus  @default(DRAFT)
  imageUrl    String?
  placement   String
  linkUrl     String?
  sortOrder   Int             @default(0)
  views       Int             @default(0)
  startsAt    DateTime?
  endsAt      DateTime?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model TeamMember {
  id        String  @id @default(cuid())
  name      String
  role      String
  photoUrl  String?
  bio       String?
  sortOrder Int     @default(0)
  isActive  Boolean @default(true)
}

model SiteSettings {
  id                   String  @id @default("singleton")
  brandName            String  @default("Hotzy Foods")
  tagline              String  @default("Bold Flavor. Zero Limits.")
  logoUrl              String?
  faviconUrl           String?
  currency             String  @default("LKR")
  currencySymbol       String  @default("Rs.")
  taxRate              Decimal @default(0)
  shippingBase         Decimal @default(0)
  freeShippingThreshold Decimal?
  socialLinks           Json?
  contactEmail         String?
  contactPhone         String?
  contactWhatsApp      String?
  address              String?
  updatedAt            DateTime @updatedAt
}
```

## 6. tRPC Router Structure

```typescript
// packages/api/src/root.ts
export const appRouter = router({
  // Customer-facing (public)
  product:      productRouter,
  category:     categoryRouter,
  customerAuth: customerAuthRouter,     // login, register, forgotPassword
  customerOrder: customerOrderRouter,    // list, byId, trackByEmail

  // Admin (protected - requires admin auth)
  admin: router({
    auth:       authRouter,
    dashboard:  dashboardRouter,
    product:    productAdminRouter,
    order:      orderAdminRouter,
    customer:   customerRouter,
    promo:      promoRouter,
    campaign:   campaignRouter,
    upload:     uploadRouter,
    settings:   settingsRouter,
  }),
});
export type AppRouter = typeof appRouter;
```

### Key tRPC Procedures

```typescript
// ─── Customer API (public) ───
product.list({ category?, heatLevel?, search?, sort?, page?, limit? })
product.bySlug({ slug })
product.featured({})
category.list({})
customerAuth.register({ email, password, name }) → { token, customer }
customerAuth.login({ email, password }) → { token, customer }
customerOrder.list({}) → Order[]                    // Requires customer auth
customerOrder.byId({ id }) → Order                  // Requires customer auth
customerOrder.trackByEmail({ email, orderNumber }) → Order  // Guest access
order.create({ items, shipping, promoCode? }) → Order  // Public checkout

// ─── Admin API (protected) ───
admin.auth.login({ email, password }) → { token, user }
admin.auth.me({}) → User
admin.dashboard.stats({ period? }) → { totalSales, orders, newCustomers, aov, trends }
admin.product.list({ search?, category?, status?, page?, limit? })
admin.product.create({ ...productData, images[] })
admin.product.update({ id, ...data })
admin.product.delete({ id })
admin.order.list({ status?, search?, page?, limit? })
admin.order.updateStatus({ id, status })
admin.customer.list({ search?, segment?, page?, limit? })
admin.promo.list({ status? })
admin.promo.create({ code, type, value, ... })
admin.promo.update({ id, ... })
admin.promo.delete({ id })
admin.campaign.list({})
admin.campaign.create({ title, imageUrl, placement, ... })
admin.campaign.update({ id, ... })
admin.campaign.delete({ id })
admin.settings.get({})
admin.settings.update({ ...settings })
```

## 7. Brand Design Tokens (Tailwind Preset)

```typescript
// packages/config-tailwind/src/preset.ts
export default {
  theme: {
    extend: {
      colors: {
        primary:            '#b20028',
        'primary-container': '#d7263d',
        'on-primary':       '#ffffff',
        secondary:          '#745b00',
        'secondary-container': '#fecb00',
        tertiary:           '#006539',
        'tertiary-container': '#008149',
        'chili-red':        '#D7263D',
        'golden-glaze':     '#FFCC00',
        'fresh-mint':       '#3CB371',
        surface:            '#f9f9f9',
        'surface-dim':      '#dadada',
        'surface-container': '#eeeeee',
        'surface-gray':     '#F8F8F8',
        'on-surface':       '#1b1b1b',
        error:              '#ba1a1a',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body:    ['Work Sans', 'sans-serif'],
      },
      fontSize: {
        'display-lg':    ['48px', { lineHeight: '56px', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-mobile': ['36px', { lineHeight: '42px', fontWeight: '800', letterSpacing: '-0.02em' }],
        'headline-lg':   ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-md':   ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'body-lg':       ['18px', { lineHeight: '28px' }],
        'body-md':       ['16px', { lineHeight: '24px' }],
        'label-md':      ['14px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '0.02em' }],
        'label-sm':      ['12px', { lineHeight: '16px', fontWeight: '700' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      spacing: {
        'margin-desktop': '40px',
        'margin-mobile':  '16px',
        gutter:           '24px',
        'stack-sm':       '4px',
        'stack-md':       '16px',
        'stack-lg':       '32px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
};
```

## 8. Git Strategy

```
main            Production-ready, protected branch
└── develop     Integration branch
    ├── feat/p1-foundation       Monorepo, Prisma, UI kit, design tokens
    ├── feat/p2-auth-dashboard   Admin auth + dashboard
    ├── feat/p3-product-crud     Product CRUD + media upload
    ├── feat/p4-order-fulfill    Orders, customers, promotions
    ├── feat/p5-website-custom   Website customization, campaigns
    ├── feat/p6-storefront       Customer pages (home, products, detail)
    ├── feat/p7-cart-checkout    Cart + checkout flow
    └── feat/p8-about-polish     About, account pages, SEO, polish

Commit convention:
  feat:     New feature
  fix:      Bug fix
  chore:    Tooling, config, deps
  refactor: Code change with no functional change
  docs:     Documentation
  db:       Migration or seed changes
```

## 9. Implementation Phases

| Phase | Branch | Deliverables |
|---|---|---|
| **P1: Foundation** | `feat/p1-foundation` | Monorepo scaffold, Prisma schema + migration, Tailwind preset, shared UI components (Button, Card, Badge, Input, SpiceMeter, StatusBadge, DataTable, Modal, Toast, Spinner, SearchBar, FilterChips, Accordion), docker-compose, CI setup, .gitignore, .env.example |
| **P2: Auth + Dashboard** | `feat/p2-auth-dashboard` | Admin login page, NextAuth setup, tRPC auth router, Dashboard page — KPI cards, sales chart (Recharts), top products list, recent orders table |
| **P3: Product CRUD** | `feat/p3-product-crud` | Product list with data table (sort, paginate, search), Add product form (multi-step: details → media → review), Edit product, Media upload with preview, Category management |
| **P4: Orders + Customers + Promos** | `feat/p4-order-fulfill` | Order list with filter tabs (pending/processing/shipped/completed), order detail cards, status update actions, customer insights table with search + segment filter, promo code CRUD, campaign cards |
| **P5: Website Customization** | `feat/p5-website-custom` | Banner manager, featured categories editor, site settings page, team members management |
| **P6: Customer Storefront** | `feat/p6-storefront` | Home page (hero section, hot deals bento grid, category explorer, featured products), Products listing + filters + search + pagination, Product detail (gallery, spice meter, dietary tags, accordion) |
| **P7: Cart + Checkout** | `feat/p7-cart-checkout` | Cart page (items, quantity adjusters, promo code, summary), Checkout form (shipping info), Order confirmation, Guest checkout flow |
| **P8: Account + About + Polish** | `feat/p8-about-polish` | Customer login/register, Account dashboard, Order history, Order detail + tracking, Address management, About Us page, SEO metadata, 404 page, loading states, error boundaries, mobile responsiveness |

## 10. Authentication Architecture

### Admin Auth (NextAuth.js)
```
- Admin visits /admin/login → enters email + password
- NextAuth validates against User table (bcrypt compare)
- JWT token issued in httpOnly cookie
- tRPC protectedProcedure checks session
- Unauthorized → 401 redirect to /admin/login
```

### Customer Auth (Simple JWT)
```
- Customer registers / logs in via tRPC mutation
- Server validates credentials, issues JWT
- JWT stored in localStorage
- Sent as Bearer token in tRPC context
- Guest checkout: no token, order linked to email
```

## 11. File Upload Strategy

```
- Images stored in Uploadthing (or Cloudinary)
- tRPC upload router generates presigned URLs
- Admin uploads images directly from browser to Uploadthing
- URL saved in ProductImage / Campaign / TeamMember tables
- Supported formats: jpg, png, webp
- Max 5MB per image
- Automatic thumbnail generation on upload
```

## 12. Docker Compose (Local Dev)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: hotzy
      POSTGRES_USER: hotzy
      POSTGRES_PASSWORD: hotzy_dev
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

## 13. Environment Variables

```env
# Database
DATABASE_URL=postgresql://hotzy:hotzy_dev@localhost:5432/hotzy

# Admin Auth (NextAuth)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Customer Auth (JWT)
JWT_SECRET=your-jwt-secret-here

# File Upload (Uploadthing)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

## 14. Customer Pages Inventory

| Page | Route | Directory | From Design |
|---|---|---|---|
| Home | `/` | `apps/store/src/app/(shop)/page.tsx` | `hotzy_foods_home_desktop` |
| Products | `/products` | `apps/store/src/app/(shop)/products/page.tsx` | `hotzy_foods_our_products_desktop` |
| Product Detail | `/products/[slug]` | `apps/store/src/app/(shop)/products/[slug]/page.tsx` | `hotzy_foods_product_detail_desktop` |
| Cart | `/cart` | `apps/store/src/app/(shop)/cart/page.tsx` | `hotzy_foods_shopping_cart_desktop` |
| About Us | `/about` | `apps/store/src/app/(shop)/about/page.tsx` | `hotzy_foods_about_us_desktop` |
| Login | `/login` | `apps/store/src/app/(auth)/login/page.tsx` | New (from existing site) |
| Account | `/account` | `apps/store/src/app/account/page.tsx` | New |
| Order History | `/account/orders` | `apps/store/src/app/account/orders/page.tsx` | New |
| Order Detail | `/account/orders/[id]` | `apps/store/src/app/account/orders/[id]/page.tsx` | New |
| Profile | `/account/profile` | `apps/store/src/app/account/profile/page.tsx` | New |
| Addresses | `/account/addresses` | `apps/store/src/app/account/addresses/page.tsx` | New |

## 15. Admin Pages Inventory

| Page | Route | Directory | From Design |
|---|---|---|---|
| Login | `/login` | `apps/admin/src/app/(auth)/login/page.tsx` | New |
| Dashboard | `/admin` | `apps/admin/src/app/admin/page.tsx` | `admin_dashboard` |
| Inventory | `/admin/inventory` | `apps/admin/src/app/admin/inventory/page.tsx` | `admin_inventory_management` |
| Add Product | `/admin/products/new` | `apps/admin/src/app/admin/products/new/page.tsx` | `admin_add_new_product` |
| Edit Product | `/admin/products/[id]` | `apps/admin/src/app/admin/products/[id]/page.tsx` | `admin_add_product_refined_media_upload` |
| Orders | `/admin/orders` | `apps/admin/src/app/admin/orders/page.tsx` | `admin_order_fulfillment` |
| Customers | `/admin/customers` | `apps/admin/src/app/admin/customers/page.tsx` | `admin_customer_insights` |
| Promotions | `/admin/promotions` | `apps/admin/src/app/admin/promotions/page.tsx` | `admin_promotions_promo_codes` |
| Website | `/admin/website` | `apps/admin/src/app/admin/website/page.tsx` | `admin_website_customization` |
