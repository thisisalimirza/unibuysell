create extension if not exists "pgcrypto";

create type public.enrollment_status as enum (
  'verified_student',
  'verified_medical_student'
);

create type public.listing_category as enum (
  'Textbooks',
  'Medical Gear',
  'Electronics',
  'Subleases'
);

create type public.listing_condition as enum (
  'New',
  'Like New',
  'Good',
  'Fair'
);

create type public.listing_status as enum (
  'available',
  'pending',
  'sold'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null unique,
  university_domain text not null,
  university_name text not null,
  enrollment_status public.enrollment_status not null default 'verified_student',
  avatar_url text,
  rating numeric(2, 1) not null default 5.0 check (rating >= 1.0 and rating <= 5.0),
  review_count integer not null default 0 check (review_count >= 0),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint institutional_email_only check (
    email ~* '^[^@]+@[^@]+$'
    and lower(split_part(email, '@', 2)) not in (
      'aol.com',
      'gmail.com',
      'googlemail.com',
      'hotmail.com',
      'icloud.com',
      'live.com',
      'mail.com',
      'me.com',
      'msn.com',
      'outlook.com',
      'proton.me',
      'protonmail.com',
      'yahoo.com',
      'ymail.com'
    )
    and (
      lower(split_part(email, '@', 2)) like '%.edu'
      or lower(split_part(email, '@', 2)) like '%mail.edu'
      or lower(split_part(email, '@', 2)) like '%.edu.get'
      or lower(split_part(email, '@', 2)) like '%edu.get'
    )
  )
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) between 20 and 2000),
  price integer not null check (price > 0),
  category public.listing_category not null,
  condition public.listing_condition not null,
  images text[] not null default '{}',
  status public.listing_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint buyer_is_not_seller check (buyer_id <> seller_id),
  constraint unique_buyer_seller_listing unique (buyer_id, seller_id, listing_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  chat_room_id uuid not null references public.chat_rooms(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint one_transaction_per_listing unique (listing_id),
  constraint one_transaction_per_chat unique (chat_room_id),
  constraint transaction_buyer_is_not_seller check (buyer_id <> seller_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 8 and 500),
  created_at timestamptz not null default now(),
  constraint one_review_per_transaction_participant unique (transaction_id, reviewer_id),
  constraint reviewer_is_not_reviewee check (reviewer_id <> reviewee_id)
);

create view public.public_profiles with (security_invoker = false) as
select
  id,
  full_name,
  university_domain,
  university_name,
  enrollment_status,
  avatar_url,
  rating,
  review_count,
  verified_at
from public.profiles
where verified_at is not null;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.messages enable row level security;
alter table public.transactions enable row level security;
alter table public.reviews enable row level security;

create function public.is_verified_profile(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = profile_id
      and verified_at is not null
  );
$$;

create function public.is_chat_participant(room_id uuid, profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_rooms
    where id = room_id
      and (buyer_id = profile_id or seller_id = profile_id)
  );
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  email_domain text;
begin
  email_domain := lower(split_part(new.email, '@', 2));

  insert into public.profiles (
    id,
    full_name,
    email,
    university_domain,
    university_name,
    enrollment_status,
    verified_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Verified student'),
    lower(new.email),
    email_domain,
    coalesce(new.raw_user_meta_data ->> 'university_name', 'Verified Institution'),
    coalesce(
      (new.raw_user_meta_data ->> 'enrollment_status')::public.enrollment_status,
      'verified_student'
    ),
    new.email_confirmed_at
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    university_domain = excluded.university_domain,
    university_name = excluded.university_name,
    enrollment_status = excluded.enrollment_status,
    verified_at = excluded.verified_at,
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create trigger on_auth_user_updated
after update of email_confirmed_at, raw_user_meta_data on auth.users
for each row execute function public.handle_new_user();

create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger touch_listings_updated_at
before update on public.listings
for each row execute function public.touch_updated_at();

create function public.refresh_profile_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    rating = coalesce((
      select round(avg(rating)::numeric, 1)
      from public.reviews
      where reviewee_id = new.reviewee_id
    ), 5.0),
    review_count = (
      select count(*)::integer
      from public.reviews
      where reviewee_id = new.reviewee_id
    )
  where id = new.reviewee_id;

  return new;
end;
$$;

create trigger refresh_profile_rating_after_review
after insert on public.reviews
for each row execute function public.refresh_profile_rating();

create policy "Users can read their own private profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Verified users can read listings"
on public.listings for select
to authenticated
using (public.is_verified_profile(auth.uid()));

create policy "Verified sellers can create listings"
on public.listings for insert
to authenticated
with check (seller_id = auth.uid() and public.is_verified_profile(auth.uid()));

create policy "Sellers can update their listings"
on public.listings for update
to authenticated
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

create policy "Sellers can delete their listings"
on public.listings for delete
to authenticated
using (seller_id = auth.uid());

create policy "Participants can read chat rooms"
on public.chat_rooms for select
to authenticated
using (buyer_id = auth.uid() or seller_id = auth.uid());

create policy "Verified buyers can create chat rooms"
on public.chat_rooms for insert
to authenticated
with check (
  buyer_id = auth.uid()
  and public.is_verified_profile(auth.uid())
  and exists (
    select 1
    from public.listings
    where listings.id = listing_id
      and listings.seller_id = seller_id
      and listings.seller_id <> auth.uid()
      and listings.status <> 'sold'
  )
);

create policy "Participants can read messages"
on public.messages for select
to authenticated
using (public.is_chat_participant(chat_room_id, auth.uid()));

create policy "Participants can send messages"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.is_chat_participant(chat_room_id, auth.uid())
);

create policy "Participants can read transactions"
on public.transactions for select
to authenticated
using (buyer_id = auth.uid() or seller_id = auth.uid());

create policy "Sellers can complete chat transactions"
on public.transactions for insert
to authenticated
with check (
  seller_id = auth.uid()
  and exists (
    select 1
    from public.chat_rooms
    where chat_rooms.id = chat_room_id
      and chat_rooms.listing_id = listing_id
      and chat_rooms.buyer_id = buyer_id
      and chat_rooms.seller_id = auth.uid()
  )
);

create policy "Verified users can read transaction reviews"
on public.reviews for select
to authenticated
using (public.is_verified_profile(auth.uid()));

create policy "Transaction participants can create reviews"
on public.reviews for insert
to authenticated
with check (
  reviewer_id = auth.uid()
  and exists (
    select 1
    from public.transactions
    where transactions.id = transaction_id
      and (
        (transactions.buyer_id = auth.uid() and transactions.seller_id = reviewee_id)
        or (transactions.seller_id = auth.uid() and transactions.buyer_id = reviewee_id)
      )
  )
);

grant usage on schema public to anon, authenticated;
grant select on public.public_profiles to authenticated;
grant select, insert, update, delete on public.listings to authenticated;
grant select, insert on public.chat_rooms to authenticated;
grant select, insert on public.messages to authenticated;
grant select, insert on public.transactions to authenticated;
grant select, insert on public.reviews to authenticated;
grant select, update on public.profiles to authenticated;

alter publication supabase_realtime add table public.messages;
