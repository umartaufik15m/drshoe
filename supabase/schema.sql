create extension if not exists pgcrypto;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price int not null default 0,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.drop_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  address text,
  maps_url text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.drop_points
add column if not exists maps_url text;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text,
  shoe_type text,
  shoe_material text,
  service_id uuid references public.services(id) on delete set null,
  service_name text,
  service_price int,
  quantity int default 1,
  surcharge_total int default 0,
  is_express boolean default false,
  express_surcharge_total int default 0,
  estimated_total int,
  delivery_method text check (delivery_method in ('direct', 'pickup', 'drop_point')) default 'direct',
  drop_point_id uuid references public.drop_points(id) on delete set null,
  drop_point_name text,
  image_url text,
  notes text,
  status text check (status in ('new', 'confirmed', 'picked_up', 'in_treatment', 'quality_check', 'ready', 'completed', 'cancelled')) default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders
add column if not exists service_price int;

alter table public.orders
add column if not exists surcharge_total int default 0;

alter table public.orders
add column if not exists is_express boolean default false;

alter table public.orders
add column if not exists express_surcharge_total int default 0;

alter table public.orders
add column if not exists estimated_total int;

create table if not exists public.franchise_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  city text,
  has_location boolean,
  estimated_capital text,
  partnership_type text check (partnership_type in ('franchise_outlet', 'drop_point_partner', 'investor_partner', 'coffee_shop_community_collab')),
  notes text,
  status text check (status in ('new', 'contacted', 'qualified', 'rejected', 'closed')) default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int check (rating >= 1 and rating <= 5) default 5,
  service_name text,
  comment text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.before_after (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  service_name text,
  before_image_url text,
  after_image_url text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

insert into public.services (name, slug, description, price, sort_order)
values
  ('Fast Clean', 'fast-clean', 'Cleaning cepat untuk sepatu dengan kotoran ringan.', 40000, 1),
  ('Deep Clean', 'deep-clean', 'Pembersihan menyeluruh bagian luar, dalam, midsole, dan outsole.', 45000, 2),
  ('Extra Dirty', 'extra-dirty', 'Treatment untuk sepatu dengan kondisi sangat kotor.', 60000, 3),
  ('Unyellowing', 'unyellowing', 'Treatment untuk sol atau bagian sepatu yang menguning.', 60000, 4),
  ('Repaint', 'repaint', 'Cat ulang bagian sepatu tertentu agar terlihat lebih segar.', 150000, 5)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  sort_order = excluded.sort_order;

insert into public.drop_points (name, slug, maps_url, description)
values
  ('Kopi Peneleh', 'kopi-peneleh', 'https://maps.app.goo.gl/MqY5fdgP135bJnY16', 'Drop point resmi DR. SHOE.'),
  ('Coffee Studio', 'coffee-studio', 'https://maps.app.goo.gl/T5MWyFhLBETNnB3v5', 'Drop point resmi DR. SHOE.')
on conflict (slug) do update set
  name = excluded.name,
  maps_url = excluded.maps_url,
  description = excluded.description;

insert into public.testimonials (customer_name, rating, service_name, comment)
values
  ('Rafi', 5, 'Deep Clean', 'Sepatu harian jadi wangi dan bersih lagi. Adminnya responsif.'),
  ('Nadia', 5, 'Unyellowing', 'Bagian sol yang menguning jauh lebih rapi. Hasilnya kelihatan banget.'),
  ('Dimas', 5, 'Fast Clean', 'Cocok buat sepatu kerja yang perlu bersih cepat.');

insert into public.before_after (title, service_name, description)
values
  ('Sneakers Daily Wear', 'Deep Clean', 'Upper, midsole, dan outsole dibersihkan menyeluruh.'),
  ('White Sole Recovery', 'Unyellowing', 'Treatment untuk mengurangi tampilan sol yang menguning.'),
  ('Canvas Refresh', 'Fast Clean', 'Cleaning cepat untuk noda ringan pada sepatu harian.');

alter table public.orders enable row level security;
alter table public.services enable row level security;
alter table public.drop_points enable row level security;
alter table public.franchise_inquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.before_after enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services for select
using (is_active = true);

drop policy if exists "Public can read active drop points" on public.drop_points;
create policy "Public can read active drop points"
on public.drop_points for select
using (is_active = true);

drop policy if exists "Public can read active testimonials" on public.testimonials;
create policy "Public can read active testimonials"
on public.testimonials for select
using (is_active = true);

drop policy if exists "Public can read active before after" on public.before_after;
create policy "Public can read active before after"
on public.before_after for select
using (is_active = true);

drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders"
on public.orders for insert
with check (true);

drop policy if exists "Public can insert franchise inquiries" on public.franchise_inquiries;
create policy "Public can insert franchise inquiries"
on public.franchise_inquiries for insert
with check (true);

drop policy if exists "Admins can read profiles" on public.admin_profiles;
create policy "Admins can read profiles"
on public.admin_profiles for select
using (id = auth.uid());

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
on public.orders for all
using (
  exists (
    select 1 from public.admin_profiles
    where admin_profiles.id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where admin_profiles.id = auth.uid()
  )
);

drop policy if exists "Admins can manage franchise inquiries" on public.franchise_inquiries;
create policy "Admins can manage franchise inquiries"
on public.franchise_inquiries for all
using (
  exists (
    select 1 from public.admin_profiles
    where admin_profiles.id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where admin_profiles.id = auth.uid()
  )
);

drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services"
on public.services for all
using (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

drop policy if exists "Admins can manage drop points" on public.drop_points;
create policy "Admins can manage drop points"
on public.drop_points for all
using (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
on public.testimonials for all
using (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

drop policy if exists "Admins can manage before after" on public.before_after;
create policy "Admins can manage before after"
on public.before_after for all
using (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));
