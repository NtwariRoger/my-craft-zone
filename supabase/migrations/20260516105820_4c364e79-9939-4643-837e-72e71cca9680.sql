
create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  user_count int;
begin
  select count(*) into user_count from auth.users;
  if user_count = 1 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_new_user_role() from public, anon, authenticated;

create trigger on_auth_user_created_role
  after insert on auth.users
  for each row execute function public.handle_new_user_role();
