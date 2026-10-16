-- BookFlow Beauty MVP schema for Supabase/PostgreSQL.
-- Apply only after creating a Supabase project and reviewing the policies.
create extension if not exists pgcrypto;

create type public.artist_status as enum ('pending','approved','rejected','suspended');
create type public.subscription_status as enum ('trial','active','past_due','cancelled','expired');
create type public.enquiry_status as enum ('new','offered','accepted','declined','expired','booked','closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('artist','customer','admin')),
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  slug text not null unique,
  bio text not null default '',
  city text not null,
  area text not null,
  address_public text,
  latitude double precision,
  longitude double precision,
  travel_radius_km integer not null default 15 check (travel_radius_km between 1 and 200),
  starting_price integer check (starting_price >= 0),
  status public.artist_status not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  name text not null,
  description text not null default '',
  price_from integer not null check (price_from >= 0),
  duration_minutes integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  plan_code text not null check (plan_code in ('starter','pro','premium')),
  status public.subscription_status not null default 'trial',
  starts_at timestamptz,
  ends_at timestamptz,
  provider text,
  provider_subscription_id text,
  created_at timestamptz not null default now()
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  service_name text not null,
  event_date date not null,
  event_area text not null,
  event_city text not null,
  event_latitude double precision,
  event_longitude double precision,
  budget integer check (budget is null or budget >= 0),
  notes text not null default '',
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.enquiry_offers (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  distance_km numeric(8,2) not null,
  offer_order integer not null,
  status text not null default 'queued' check (status in ('queued','offered','accepted','declined','expired','skipped')),
  offered_at timestamptz,
  expires_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (enquiry_id, artist_id),
  unique (enquiry_id, offer_order)
);

create index artists_city_status_idx on public.artists(city, status);
create index services_artist_active_idx on public.services(artist_id, is_active);
create index enquiries_city_date_idx on public.enquiries(event_city, event_date);
create index enquiry_offers_queue_idx on public.enquiry_offers(enquiry_id, offer_order, status);

-- Enable RLS before adding client-facing API access.
alter table public.profiles enable row level security;
alter table public.artists enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.enquiries enable row level security;
alter table public.enquiry_offers enable row level security;

-- Intentionally no permissive policies are added here. Add and test least-privilege policies
-- before connecting a browser client. Enquiry routing and subscription validation must be server-side.
