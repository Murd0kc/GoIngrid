alter table public.topics
  add column if not exists learning_overview jsonb not null default '{}'::jsonb;
