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

5. Run `supabase/schema.sql`, then make sure these public storage buckets exist:
   - `shoe-photos`
   - `promo-banners`

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

6. In Supabase, run `supabase/schema.sql`, make sure the storage buckets are created, and add the public URL domain to Auth URL settings if admin login redirects are used later.

## Routes

- `/`
- `/booking`
- `/status`
- `/franchise`
- `/drop-point`
- `/admin/login`
- `/admin`
- `/admin/banners`
- `/admin/orders`
- `/admin/franchise`
- `/admin/services`
- `/admin/drop-points`
- `/admin/testimonials`

## Promo Banner

Homepage promo banners are managed at `/admin/banners`. Use up to 3 active slides.

Recommended image size:

- `1920 x 900 px` for a wide storefront banner
- `1920 x 1080 px` if the photo needs more vertical room
- Keep the main subject centered because the banner uses `object-cover` on desktop and mobile

## Admin Login

Admin login uses Supabase Auth.

1. Open Supabase Dashboard.
2. Go to Authentication, then create a user with email and password.
3. Copy the created user's UID.
4. Run this SQL in Supabase SQL Editor:

```sql
insert into public.admin_profiles (id, full_name, role)
values ('PASTE_AUTH_USER_UID_HERE', 'Admin DR. SHOE', 'admin')
on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role;
```

5. Login at `/admin/login` using the email and password from step 2.

## Customer Status

Customers can check booking status at `/status` using the same WhatsApp number used for booking. This lookup is handled by a server route using `SUPABASE_SERVICE_ROLE_KEY`; do not expose the service role key in the browser.
