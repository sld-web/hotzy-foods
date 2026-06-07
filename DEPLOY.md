# Deployment Guide — Hotzy Foods on Vercel + Supabase

## Prerequisites

- GitHub account (code already pushed to `github.com/sld-web/hotzy-foods`)
- Vercel account (free at vercel.com)
- Supabase account (free at supabase.com)

---

## Step 1: Create a Supabase PostgreSQL Database

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New project"**
3. Fill in:
   - **Name:** `hotzy-foods`
   - **Database Password:** Click "Generate a secure password" and **save it somewhere safe**
   - **Region:** Choose the closest to Sri Lanka (Singapore `ap-southeast-1` is best)
   - **Pricing Plan:** Free
4. Click **"Create new project"** and wait ~2 minutes for provisioning
5. Once ready, go to **Project Settings → Database → Connection string**
6. Copy the **URI** connection string — it looks like:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```
7. **Important:** Replace `postgres` at the end with `hotzy` (the database name):
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/hotzy
   ```

---

## Step 2: Deploy the Storefront on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New" → "Project"**
3. Import the `sld-web/hotzy-foods` repository
4. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/store`
   - **Build Command:** Keep default (Vercel will use vercel.json)
5. **Environment Variables** (click "Add"):
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | The Supabase URI from Step 1 |
   | `JWT_SECRET` | Click "Generate" or use a random string (e.g., `hotzy-jwt-secret-2024-random-string`) |
6. Click **"Deploy"**
7. Wait ~3 minutes for the first build
8. Once done, Vercel gives you a URL like `https://hotzy-foods-xxxx.vercel.app`

---

## Step 3: Deploy the Admin Panel on Vercel

1. Back in the Vercel dashboard, click **"Add New" → "Project"**
2. Import the **same** `sld-web/hotzy-foods` repository again
3. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/admin`
   - **Build Command:** Keep default
4. **Environment Variables:**
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Same Supabase URI as Step 2 |
   | `JWT_SECRET` | **Same value** as Step 2 (must match for auth to work) |
5. Click **"Deploy"**

---

## Step 4: Seed the Database

After both apps are deployed, seed the database with sample data:

1. Open your terminal
2. Run:

   ```bash
   # Install the Vercel CLI
   npm install -g vercel

   # Log in (opens browser for authentication)
   vercel login

   # Set DATABASE_URL as an environment variable for the seed command
   export DATABASE_URL="your-supabase-uri-here"

   # Install dependencies locally
   cd hotzy-foods
   pnpm install

   # Push the Prisma schema to Supabase
   pnpm -F @hotzy/database run db:push

   # Seed sample data
   pnpm -F @hotzy/database run db:seed
   ```

   **Alternative:** You can also use the Supabase SQL Editor:
   1. Go to your Supabase project dashboard
   2. Open **SQL Editor**
   3. Run the following to create tables (Prisma migration SQL), then seed manually

---

## Step 5: Configure Custom Domains (Optional)

1. In the Vercel dashboard for each project, go to **Settings → Domains**
2. Add your custom domain (e.g., `store.hotzyfoods.com` and `admin.hotzyfoods.com`)
3. Update your DNS records as instructed by Vercel

---

## Step 6: Update Environment Variables for Production

Once you know the production URLs, update the existing env vars:

**Storefront env vars:**

- `NEXT_PUBLIC_SITE_URL` → `https://store.hotzyfoods.com` (or your Vercel URL)

**Admin env vars:**

- `NEXT_PUBLIC_ADMIN_URL` → `https://admin.hotzyfoods.com` (or your Vercel URL)

Go to each project's **Vercel Dashboard → Settings → Environment Variables** to add/update.

---

## Credentials

After seeding, log in with:

- **Admin:** `admin@hotzyfoods.com` / `admin123`
- **Sample Customer:** `sarah@example.com` / `password123`

---

## Architecture Notes

```
store.hotzyfoods.com ──▶ Vercel (apps/store) ──▶ Supabase PostgreSQL
admin.hotzyfoods.com ──▶ Vercel (apps/admin) ──▶ Supabase PostgreSQL
                              │
                              └── Both share the same DATABASE_URL and JWT_SECRET
```

- Both apps connect to the **same** Supabase database
- Both apps use the **same** `JWT_SECRET` so admin login tokens work
- The storefront tracks page views, admin panel reads analytics from the same data

---

## Troubleshooting

| Problem                           | Solution                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Build fails with `pnpm not found` | In Vercel project Settings, enable "Use pnpm" in the "General" section                                             |
| `DATABASE_URL` connection refused | In Supabase dashboard → Database, check if "Connection pooling" is enabled. Use the pooled URL (port 6543) instead |
| Login returns "UNAUTHORIZED"      | Make sure `JWT_SECRET` is the **exact same** in both Vercel projects                                               |
| Admin pages show "No data yet"    | Run the seed command to populate sample data                                                                       |
| Images not loading                | Upload images via the admin Website Settings page, or add them to `apps/admin/public/`                             |
