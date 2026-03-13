
create table if not exists profiles (
  id uuid primary key,
  full_name text not null,
  email text unique not null,
  university text,
  role text not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  section text not null,
  room_type text not null,
  pricing_type text not null,
  price numeric not null,
  available_from date not null,
  available_until date not null,
  room_size text not null,
  furnished text not null,
  listing_status text not null default 'draft',
  contract_status text not null default 'missing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  url text not null,
  storage_path text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid unique not null references listings(id) on delete cascade,
  landlord_id uuid not null references profiles(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  review_status text not null default 'pending',
  reviewer_admin_id uuid references profiles(id),
  review_notes text,
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists chat_threads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  landlord_id uuid not null references profiles(id) on delete cascade,
  tenant_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(listing_id, tenant_id)
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references chat_threads(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  text text not null,
  sent_at timestamptz not null default now()
);

create view listings_public_view as
select
  l.id,
  l.title,
  l.description,
  l.section,
  l.room_type,
  l.pricing_type,
  l.price,
  l.available_from,
  l.available_until,
  l.room_size,
  l.furnished,
  l.listing_status,
  l.contract_status,
  l.created_at,
  p.full_name as landlord_name,
  (
    select lp.url
    from listing_photos lp
    where lp.listing_id = l.id
    order by lp.order_index asc, lp.created_at asc
    limit 1
  ) as cover_photo_url
from listings l
join profiles p on p.id = l.landlord_id;

create view admin_listing_review_view as
select
  l.*,
  p.full_name as landlord_name,
  p.email as landlord_email,
  c.id as contract_id,
  c.file_name,
  c.storage_path,
  c.review_status,
  c.review_notes,
  c.uploaded_at
from listings l
join profiles p on p.id = l.landlord_id
left join contracts c on c.listing_id = l.id;