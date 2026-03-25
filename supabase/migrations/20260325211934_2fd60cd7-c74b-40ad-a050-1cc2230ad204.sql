
-- Create app_role enum
create type public.app_role as enum ('admin', 'customer');

-- profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  full_name text not null,
  email text not null,
  created_at timestamptz default now()
);

-- user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'customer',
  unique (user_id, role)
);

-- brands table
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text default '🚗',
  created_at timestamptz default now()
);

-- categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text default 'engine',
  created_at timestamptz default now()
);

-- products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null,
  category_id uuid references public.categories(id) on delete set null,
  brand_ids uuid[] default '{}',
  price numeric not null default 0,
  stock integer not null default 0,
  description text default '',
  image_url text default '',
  is_sale boolean default false,
  is_new boolean default false,
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  items jsonb not null default '[]',
  total numeric not null default 0,
  status text not null default 'Новий',
  delivery_info jsonb default '{}',
  created_at timestamptz default now()
);

-- settings table (single row)
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  store_name text default 'АвтоДеталі',
  phone text default '',
  email text default '',
  address text default '',
  footer_description text default ''
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Security definer function to check roles (avoids RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Function to get user role
create or replace function public.get_user_role(_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text
  from public.user_roles
  where user_id = _user_id
  limit 1
$$;

-- Trigger function to create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer');
  return new;
end;
$$;

-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS Policies

-- profiles
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

-- user_roles
create policy "Users can read own role"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Admins can update roles"
  on public.user_roles for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert roles"
  on public.user_roles for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

-- brands: public read, admin CRUD
create policy "Anyone can read brands"
  on public.brands for select
  to anon, authenticated
  using (true);

create policy "Admins can insert brands"
  on public.brands for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update brands"
  on public.brands for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete brands"
  on public.brands for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- categories: public read, admin CRUD
create policy "Anyone can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Admins can insert categories"
  on public.categories for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update categories"
  on public.categories for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete categories"
  on public.categories for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- products: public read, admin CRUD
create policy "Anyone can read products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Admins can insert products"
  on public.products for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products"
  on public.products for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete products"
  on public.products for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- orders: users read own, admin reads all, users insert own, admin updates
create policy "Users can read own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Users can insert own orders"
  on public.orders for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- settings: public read, admin write
create policy "Anyone can read settings"
  on public.settings for select
  to anon, authenticated
  using (true);

create policy "Admins can update settings"
  on public.settings for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert settings"
  on public.settings for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

create policy "Anyone can read product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- Insert default settings
insert into public.settings (store_name, phone, email, address, footer_description)
values (
  'АвтоДеталі',
  '+380 (44) 123-45-67',
  'info@avtodetal.ua',
  'м. Київ, вул. Автомобільна, 15',
  'Інтернет-магазин автозапчастин з доставкою по Україні. Більше 500 000 позицій для будь-якого автомобіля.'
);

-- Insert default brands
insert into public.brands (name, logo_url) values
  ('Toyota', '🚗'), ('Volkswagen', '🚙'), ('BMW', '🏎️'), ('Mercedes', '🚘'),
  ('Ford', '🚐'), ('Renault', '🚕'), ('Fiat', '🚗'), ('Opel', '🚙'),
  ('Skoda', '🏎️'), ('Hyundai', '🚘'), ('Kia', '🚐'), ('Audi', '🚕');

-- Insert default categories
insert into public.categories (name, icon) values
  ('Двигун', 'engine'), ('Гальмівна система', 'brake'), ('Підвіска', 'suspension'),
  ('Фільтри', 'filter'), ('Кузов', 'body'), ('Електрика', 'electric'),
  ('Трансмісія', 'transmission'), ('Охолодження', 'cooling');
