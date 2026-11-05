-- Plak dit in Supabase > SQL Editor > New query en voer het uit.

create table if not exists public.editors (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection in ('article', 'case', 'service', 'page', 'settings')),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  version integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection, slug)
);

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.editors where user_id = auth.uid());
$$;

-- Verhoogt de versie bij elke wijziging, zodat het formulier gelijktijdige bewerkingen kan herkennen.
create or replace function public.touch_content_entry()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' then
    new.version := old.version + 1;
  end if;
  return new;
end;
$$;

drop trigger if exists touch_content_entry on public.content_entries;
create trigger touch_content_entry
  before insert or update on public.content_entries
  for each row execute function public.touch_content_entry();

alter table public.editors enable row level security;
alter table public.content_entries enable row level security;

drop policy if exists "editors see themselves" on public.editors;
create policy "editors see themselves" on public.editors
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "published is public" on public.content_entries;
create policy "published is public" on public.content_entries
  for select to anon, authenticated using (status = 'published');

drop policy if exists "editors read all" on public.content_entries;
create policy "editors read all" on public.content_entries
  for select to authenticated using (public.is_editor());

drop policy if exists "editors insert" on public.content_entries;
create policy "editors insert" on public.content_entries
  for insert to authenticated with check (public.is_editor());

drop policy if exists "editors update" on public.content_entries;
create policy "editors update" on public.content_entries
  for update to authenticated using (public.is_editor()) with check (public.is_editor());

drop policy if exists "editors delete" on public.content_entries;
create policy "editors delete" on public.content_entries
  for delete to authenticated using (public.is_editor());

-- Maak daarna onder Authentication > Users een gebruiker aan en voer dit uit met jouw e-mailadres:
-- insert into public.editors (user_id) select id from auth.users where email = 'JOUW-EMAIL@VOORBEELD.NL';
