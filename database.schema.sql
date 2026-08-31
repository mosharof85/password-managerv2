-- Password Manager Schema for Supabase
-- Run this in Supabase SQL Editor

-- Entries table (same as Google Sheets)
create table if not exists entries (
  id uuid default gen_random_uuid() primary key,
  domain text not null unique,
  wp_user text,
  wp_password text,
  login_url text,
  notes text,
  hosting_url text,
  hosting_user text,
  hosting_password text,
  ftp_url text,
  ftp_user text,
  ftp_password text,
  port text,
  ftp_directory text,
  private_key text,
  local_directory text,
  ssh_host text,
  ssh_port text,
  ssh_user text,
  ssh_pass text,
  ssh_key_ref text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Agent commands table (for future use if needed)
create table if not exists agent_commands (
  id text primary key,
  action text not null,
  payload jsonb not null,
  status text default 'pending' check (status in ('pending', 'delivered', 'done', 'failed')),
  result_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Storage bucket for SSH keys
insert into storage.buckets (id, name, public) values ('ssh-keys', 'ssh-keys', false)
on conflict (id) do nothing;

-- Enable RLS
alter table entries enable row level security;
alter table agent_commands enable row level security;

-- Policies for entries (single user access)
create policy "Users can view own entries" on entries for select using (true);
create policy "Users can insert own entries" on entries for insert with check (true);
create policy "Users can update own entries" on entries for update using (true);
create policy "Users can delete own entries" on entries for delete using (true);

-- Policies for agent commands
create policy "Users can view agent commands" on agent_commands for select using (true);
create policy "Users can insert agent commands" on agent_commands for insert with check (true);
create policy "Users can update agent commands" on agent_commands for update using (true);

-- Function to update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for entries
create trigger set_updated_at before update on entries
for each row execute function update_updated_at();

-- Storage policies for SSH keys
create policy "Users can upload SSH keys" on storage.objects for insert with check (bucket_id = 'ssh-keys');
create policy "Users can download SSH keys" on storage.objects for select using (bucket_id = 'ssh-keys');
create policy "Users can delete SSH keys" on storage.objects for delete using (bucket_id = 'ssh-keys');
