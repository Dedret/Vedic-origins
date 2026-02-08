create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id text,
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
  created_at timestamptz default now()
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
