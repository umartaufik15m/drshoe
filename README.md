# DR. SHOE Website

Modern Next.js website for DR. SHOE, Shoes Laundry & Treatment Bekasi, with booking, franchise inquiry, WhatsApp CTA, Supabase storage/database integration, and a basic admin dashboard.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill Supabase values in `.env.local`.

4. Run `supabase/schema.sql` in the Supabase SQL editor.

5. Create a public storage bucket named `shoe-photos` for shoe photo uploads.

6. Start development:

```bash
npm run dev
```

## Deploy to Vercel

1. Push this project to GitHub.

2. Import the GitHub repository in Vercel.

3. Add these Environment Variables in Vercel Project Settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

4. Build settings are already prepared in `vercel.json`:

```bash
Install Command: npm ci
Build Command: npm run vercel-build
```

5. After Vercel gives the production domain, update `NEXT_PUBLIC_SITE_URL` with that domain and redeploy.

6. In Supabase, run `supabase/schema.sql`, create the `shoe-photos` storage bucket, and add the public URL domain to Auth URL settings if admin login redirects are used later.

## Routes

- `/`
- `/booking`
- `/franchise`
- `/drop-point`
- `/admin/login`
- `/admin`
- `/admin/orders`
- `/admin/franchise`
- `/admin/services`
- `/admin/drop-points`
- `/admin/testimonials`
