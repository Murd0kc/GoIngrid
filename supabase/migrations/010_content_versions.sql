create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in (
      'level',
      'module',
      'topic',
      'lesson',
      'section',
      'exercise',
      'assessment',
      'scenario'
    )),
  entity_id uuid not null,
  version_number integer not null default 1,
  status text not null default 'draft'
    check (status in (
      'draft',
      'linguistic_review',
      'pedagogical_review',
      'cefr_review',
      'approved',
      'published',
      'archived'
    )),
  content_snapshot jsonb not null,
  change_summary text,
  created_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  published_at timestamptz,
  unique(entity_type, entity_id, version_number)
);

create table if not exists public.content_validation_results (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.content_versions(id) on delete cascade,
  validation_type text not null
    check (validation_type in (
      'schema',
      'language',
      'pedagogy',
      'cefr',
      'answers',
      'accessibility',
      'license'
    )),
  status text not null
    check (status in ('passed', 'failed', 'warning')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.content_versions enable row level security;
alter table public.content_validation_results enable row level security;

create policy "Authenticated users can view published content versions"
on public.content_versions for select
to authenticated using (status = 'published');

create policy "Authenticated users can view validation results"
on public.content_validation_results for select
to authenticated using (
  exists (
    select 1
    from public.content_versions v
    where v.id = content_validation_results.version_id
      and v.status = 'published'
  )
);
