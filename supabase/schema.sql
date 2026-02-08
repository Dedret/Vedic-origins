-- Orders table with Razorpay support
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text not null default 'cod_pending',
  payment_method text not null,
  total numeric not null,
  cod_fee numeric default 0,
  currency text not null default 'INR',
  phone text not null,
  email text,
  address jsonb not null,
  notes text,
  tracking_code text,
  -- Razorpay fields
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id text not null,
  name text not null,
  price numeric not null,
  qty int not null,
  currency text not null default 'INR'
);

create index on orders (status);
create index on orders (created_at);
create index on orders (user_id);
create index on orders (razorpay_order_id);

-- Products table
create table if not exists products (
  id text primary key,
  name text not null,
  description text,
  type text not null, -- 'cow' or 'buffalo'
  size text not null, -- '250ml', '500ml', '750ml', '1l'
  mrp numeric not null,
  sale_price numeric not null,
  image_url text,
  in_stock boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on products (type);
create index on products (in_stock);

-- Insert sample products
insert into products (id, name, description, type, size, mrp, sale_price, image_url) values
  ('cow-250ml', 'A2 Gir Cow Ghee - 250ml', 'Medicinal Grade. Golden Yellow. Good for Heart.', 'cow', '250ml', 1200, 1000, 'cow0.jpg'),
  ('cow-500ml', 'A2 Gir Cow Ghee - 500ml', 'Medicinal Grade. Golden Yellow. Good for Heart.', 'cow', '500ml', 2300, 2000, 'cow1.jpg'),
  ('cow-750ml', 'A2 Gir Cow Ghee - 750ml', 'Medicinal Grade. Golden Yellow. Good for Heart.', 'cow', '750ml', 3400, 3000, 'cow2.jpg'),
  ('cow-1l', 'A2 Gir Cow Ghee - 1 Litre', 'Medicinal Grade. Golden Yellow. Good for Heart.', 'cow', '1l', 4500, 4000, 'cow3.jpg'),
  ('buffalo-250ml', 'Pure Buffalo Ghee - 250ml', 'High Fat. White Granular. Best for Cooking.', 'buffalo', '250ml', 700, 500, 'buff0.jpg'),
  ('buffalo-500ml', 'Pure Buffalo Ghee - 500ml', 'High Fat. White Granular. Best for Cooking.', 'buffalo', '500ml', 1300, 1000, 'buff1.jpg'),
  ('buffalo-750ml', 'Pure Buffalo Ghee - 750ml', 'High Fat. White Granular. Best for Cooking.', 'buffalo', '750ml', 1900, 1500, 'buff2.jpg'),
  ('buffalo-1l', 'Pure Buffalo Ghee - 1 Litre', 'High Fat. White Granular. Best for Cooking.', 'buffalo', '1l', 2500, 2000, 'buff3.jpg')
on conflict (id) do nothing;

-- User profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  email text,
  default_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- RLS policies for profiles
-- Users can read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, phone)
  values (
    new.id,
    new.email,
    new.phone
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update timestamp function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_orders_updated_at before update on orders
  for each row execute procedure update_updated_at_column();
  
create trigger update_products_updated_at before update on products
  for each row execute procedure update_updated_at_column();
  
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

