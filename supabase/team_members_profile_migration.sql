alter table public.team_members
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists role text,
  add column if not exists photo_url text,
  add column if not exists notes text;
