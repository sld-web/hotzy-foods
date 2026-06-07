# Hotzy Foods — Full-Stack E-Commerce Platform

> **Live Demo:** [hotzy.vercel.app](https://hotzy.vercel.app)  
> **Tech Stack:** Next.js 16, TypeScript 6, tRPC v11, Prisma 6, PostgreSQL 16, Tailwind CSS  
> **Architecture:** pnpm Workspace Monorepo | Storefront + Admin Panel + Shared API

---

## Overview

A complete e-commerce platform for Hotzy Foods, a Sri Lankan hot sauce brand. The platform consists of a customer-facing storefront and a comprehensive admin panel with real-time analytics, inventory management, order processing, and customer insights.

---

## Screenshots

### Storefront

|                Home Page                |                Products Listing                 |                   Product Detail                    |
| :-------------------------------------: | :---------------------------------------------: | :-------------------------------------------------: |
| ![Home](/screenshots/01-store-home.png) | ![Products](/screenshots/02-store-products.png) | ![Detail](/screenshots/03-store-product-detail.png) |

|              Shopping Cart              |                About Page                 |
| :-------------------------------------: | :---------------------------------------: |
| ![Cart](/screenshots/04-store-cart.png) | ![About](/screenshots/05-store-about.png) |

### Admin Panel

|                   Login                   |                     Dashboard                     |                     Analytics                     |
| :---------------------------------------: | :-----------------------------------------------: | :-----------------------------------------------: |
| ![Login](/screenshots/06-admin-login.png) | ![Dashboard](/screenshots/07-admin-dashboard.png) | ![Analytics](/screenshots/08-admin-analytics.png) |

|                    Inventory                     |                   Orders                    |                     Customers                     |
| :----------------------------------------------: | :-----------------------------------------: | :-----------------------------------------------: |
| ![Inventory](/screenshots/09-admin-products.png) | ![Orders](/screenshots/10-admin-orders.png) | ![Customers](/screenshots/11-admin-customers.png) |

|                     Promotions                      |               Website Settings                |
| :-------------------------------------------------: | :-------------------------------------------: |
| ![Promotions](/screenshots/12-admin-promotions.png) | ![Website](/screenshots/13-admin-website.png) |

---

## Features

### Storefront

- **Responsive Hero Section** — Full-viewport hero with dynamic background image, tagline, and CTA buttons. Content managed via admin panel.
- **Product Catalog** — Grid layout with category filtering, badges (Bestseller, New, Vegan, Gluten-Free), heat level indicator (SpiceMeter), and price display with compare-at pricing.
- **Product Detail** — Full product information with image, description, SHU heat scale, dietary tags, and add-to-cart functionality.
- **Shopping Cart** — Zustand-powered client-side cart with quantity controls, promo code support, and order summary.
- **Page View Tracking** — Automatic analytics tracking on route changes for traffic analysis.
- **Mobile-First Navigation** — Hamburger menu on mobile, persistent sidebar on desktop.

### Admin Panel

- **Authentication** — JWT-based admin login with zustand-persisted sessions and automatic logout on token expiry.
- **Dashboard** — KPI cards showing total revenue, orders, customers, and products with quick-links to key actions.
- **Customer Analytics** — Comprehensive analytics page with four sections:
  - **Traffic Analysis** — Active time segments (Morning/Afternoon/Evening/Night), visits by day of week, device breakdown (Mobile/Desktop/Tablet via user-agent regex), daily trend bar chart, and top pages table.
  - **Order Analytics** — Orders by day of week, peak order times grouped into segments, order device breakdown, and order value distribution buckets.
  - **Geographic Distribution** — Top cities with order counts and revenue, province breakdown table.
  - **Customer Overview** — KPI cards (registered customers, repeat purchase rate, total orders, avg order value), customer segment breakdown.
- **Inventory Management** — Product CRUD with stock tracking, heat levels, dietary tags, and image management.
- **Order Management** — Order listing with status tracking, customer details, and line items.
- **Customer Management** — Customer directory with order history and segmentation.
- **Promotions** — Promo code management with percentage/fixed/free-shipping types, usage limits, and scheduling.
- **Website Settings** — Live-editable site content including hero section, contact info, social links, and shipping configuration.

### Architecture Highlights

- **tRPC v11** — End-to-end type-safe API with HTTP GET for queries and POST for mutations. Single shared router (`@hotzy/api`) consumed by both storefront and admin.
- **Prisma + PostgreSQL** — Raw SQL queries for complex analytics aggregations (EXTRACT, CASE, regex matching) combined with Prisma's type-safe query builder for CRUD.
- **Monorepo Structure** — 7 packages shared across apps: `@hotzy/api`, `@hotzy/database`, `@hotzy/ui`, `@hotzy/validators`, `@hotzy/config-tailwind`, `@hotzy/config-typescript`.
- **Seed Data** — 18 sample customers (6 segments), 74 orders (30 days of data), 650+ page views for realistic demo experience.

---

## Technical Details

| Area                 | Implementation                                               |
| -------------------- | ------------------------------------------------------------ |
| **Framework**        | Next.js 16.2.7 App Router (Turbopack)                        |
| **API Layer**        | tRPC v11 with `@trpc/server/adapters/fetch`                  |
| **Database**         | PostgreSQL 16 via Prisma 6 (db push for schema sync)         |
| **State Management** | Zustand with persist middleware                              |
| **Styling**          | Tailwind CSS v4 with shared design tokens                    |
| **Auth**             | JWT (jsonwebtoken) with Bearer token headers                 |
| **Monorepo**         | pnpm workspaces (9 apps/packages)                            |
| **UI Components**    | Shared `@hotzy/ui` package (Card, Badge, Button, SpiceMeter) |

---

## Project Structure

```
hotzy/
├── apps/
│   ├── admin/          # Admin panel (port 3001)
│   │   └── src/app/
│   │       ├── admin/  # Protected admin pages
│   │       └── api/    # tRPC route handler
│   └── store/          # Customer storefront (port 3000)
│       └── src/app/
│           ├── (shop)/ # Public pages (home, products, cart, about)
│           └── api/    # tRPC route handler
├── packages/
│   ├── api/            # Shared tRPC routers
│   ├── database/       # Prisma schema + migrations + seed
│   ├── ui/             # Shared UI components
│   ├── validators/     # Zod schemas
│   └── config-*/       # Shared configs (tailwind, typescript)
└── scripts/            # Utility scripts (screenshots, etc.)
```

---

## Running the Project

```bash
# Prerequisites: Docker (PostgreSQL), pnpm
docker start hotzy-postgres
pnpm install
pnpm -F @hotzy/database run db:push
pnpm -F @hotzy/database run db:seed

# Start both apps
pnpm --dir apps/admin dev    # → http://localhost:3001
pnpm --dir apps/store dev    # → http://localhost:3000

# Admin credentials
Email:    admin@hotzyfoods.com
Password: admin123
```

---

_Built with Next.js 16, tRPC v11, Prisma 6, PostgreSQL 16, and Tailwind CSS._
