create table if not exists public.bookings (
  id text primary key,
  code text not null unique,
  pin text not null,
  client_name text not null,
  client_phone text not null,
  event_date date not null,
  package text not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'completed')),
  assigned_team text[] not null default '{}',
  team_locked boolean not null default false,
  request_status text not null default 'Belum Isi' check (request_status in ('Belum Isi', 'Sudah Isi')),
  request_detail jsonb,
  rating smallint check (rating between 1 and 5),
  review_comment text,
  review_date date,
  remaining_bill bigint not null default 0 check (remaining_bill >= 0),
  drive_url text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_event_date_idx on public.bookings (event_date);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  phone text,
  email text,
  role text,
  photo_url text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id text primary key,
  type text not null check (type in ('in', 'out')),
  amount bigint not null check (amount > 0),
  description text not null,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
alter table public.team_members enable row level security;
alter table public.transactions enable row level security;

revoke all on public.bookings, public.team_members, public.transactions from anon, authenticated;
grant all on public.bookings, public.team_members, public.transactions to service_role;
