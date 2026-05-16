
-- Fix function search_path
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Restrict trigger/internal functions
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;

-- Tighten permissive inserts
drop policy if exists "messages public insert" on public.messages;
create policy "messages public insert" on public.messages
  for insert with check (
    length(trim(name)) between 1 and 200
    and length(trim(email)) between 3 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(trim(message)) between 1 and 5000
  );

drop policy if exists "page_views public insert" on public.page_views;
create policy "page_views public insert" on public.page_views
  for insert with check (
    length(trim(path)) between 1 and 500
  );
