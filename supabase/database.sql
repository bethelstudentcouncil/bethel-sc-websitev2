-- Bethel Student Council website — database schema
--
-- IMPORTANT: You are keeping your EXISTING Supabase project (the one
-- config.js already points to), which already has your real data in it
-- (officers, mission/vision text, your gallery photo, etc).
--
-- You do NOT need to run this file. It exists only as a backup/reference
-- of the schema your admin.html and index.html code expect, since this
-- file was missing from the original repo. Only run this if you are ever
-- setting up a brand-new, empty Supabase project from scratch — every
-- statement below is safe to re-run (it won't destroy existing data).

-- 1. Table that stores your whole site's content as one row (id = 1)
create table if not exists public.site_content (
  id integer primary key,
  draft jsonb not null default '{}'::jsonb,
  published jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  published_at timestamptz,
  updated_by uuid references auth.users(id),
  published_by uuid references auth.users(id)
);

insert into public.site_content (id, draft, published)
values (1, '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

-- 2. Table listing who is allowed to log into /admin
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id),
  email text
);

-- 3. Row Level Security
alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

-- Only authorized admins can read the full row (including unpublished drafts).
drop policy if exists "Public can read site_content" on public.site_content;
drop policy if exists "Admins can read site_content" on public.site_content;
create policy "Admins can read site_content"
  on public.site_content for select
  using (exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  ));

-- Public visitors can retrieve ONLY the published JSON document.
create or replace function public.get_published_site_content()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select published from public.site_content where id = 1), '{}'::jsonb);
$$;

revoke all on function public.get_published_site_content() from public;
grant execute on function public.get_published_site_content() to anon, authenticated;

-- Only signed-in admins (present in admin_users) can update site_content.
drop policy if exists "Admins can update site_content" on public.site_content;
create policy "Admins can update site_content"
  on public.site_content for update
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- A signed-in user can check whether THEY are an admin (their own row only).
drop policy if exists "Users can check their own admin status" on public.admin_users;
create policy "Users can check their own admin status"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- 4. Storage bucket for uploaded photos (officers, gallery, news covers)
insert into storage.buckets (id, name, public)
values ('website-images', 'website-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view website images" on storage.objects;
create policy "Public can view website images"
  on storage.objects for select
  using (bucket_id = 'website-images');

drop policy if exists "Signed-in users can upload website images" on storage.objects;
drop policy if exists "Admins can upload website images" on storage.objects;
create policy "Admins can upload website images"
  on storage.objects for insert
  with check (
    bucket_id = 'website-images'
    and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );
