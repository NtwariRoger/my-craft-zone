
-- ============ ROLES ============
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- profile auto-create
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- profile RLS
create policy "profiles select own" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = user_id);
create policy "profiles admin select all" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));

-- user_roles RLS
create policy "user_roles self read" on public.user_roles for select using (auth.uid() = user_id);
create policy "user_roles admin all" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ============ CONTENT TABLES ============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  technologies text[] not null default '{}',
  github_url text,
  demo_url text,
  image_url text,
  category text not null default 'personal',
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create trigger trg_projects_updated before update on public.projects for each row execute function public.set_updated_at();
create policy "projects public read" on public.projects for select using (true);
create policy "projects admin write" on public.projects for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level int not null default 80 check (level between 0 and 100),
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.skills enable row level security;
create policy "skills public read" on public.skills for select using (true);
create policy "skills admin write" on public.skills for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.gallery enable row level security;
create policy "gallery public read" on public.gallery for select using (true);
create policy "gallery admin write" on public.gallery for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "messages public insert" on public.messages for insert with check (true);
create policy "messages admin read" on public.messages for select using (public.has_role(auth.uid(), 'admin'));
create policy "messages admin update" on public.messages for update using (public.has_role(auth.uid(), 'admin'));
create policy "messages admin delete" on public.messages for delete using (public.has_role(auth.uid(), 'admin'));

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
create trigger trg_blog_updated before update on public.blog_posts for each row execute function public.set_updated_at();
create policy "blog public read published" on public.blog_posts for select using (published = true);
create policy "blog admin read all" on public.blog_posts for select using (public.has_role(auth.uid(), 'admin'));
create policy "blog admin write" on public.blog_posts for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  quote text not null,
  avatar_url text,
  rating int not null default 5 check (rating between 1 and 5),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;
create policy "testimonials public read" on public.testimonials for select using (true);
create policy "testimonials admin write" on public.testimonials for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  year int,
  credential_url text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.certifications enable row level security;
create policy "certifications public read" on public.certifications for select using (true);
create policy "certifications admin write" on public.certifications for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  price text,
  features text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.services enable row level security;
create policy "services public read" on public.services for select using (true);
create policy "services admin write" on public.services for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);
alter table public.page_views enable row level security;
create policy "page_views public insert" on public.page_views for insert with check (true);
create policy "page_views admin read" on public.page_views for select using (public.has_role(auth.uid(), 'admin'));
