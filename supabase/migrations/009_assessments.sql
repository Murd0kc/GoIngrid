create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  level_id uuid references public.levels(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  title text not null,
  assessment_type text not null
    check (assessment_type in (
      'diagnostic',
      'topic',
      'module',
      'level',
      'placement'
    )),
  instructions text,
  passing_score numeric(5,2) not null default 70,
  is_published boolean not null default false,
  check (
    level_id is not null
    or module_id is not null
    or topic_id is not null
  )
);

create table if not exists public.assessment_items (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  skill text not null,
  points numeric(6,2) not null default 1,
  sort_order integer not null,
  unique(assessment_id, sort_order)
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score numeric(5,2),
  skill_scores jsonb not null default '{}'::jsonb,
  passed boolean,
  feedback jsonb not null default '{}'::jsonb
);

create table if not exists public.mastery_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id uuid references public.levels(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  skill text not null,
  mastery_score numeric(5,2) not null default 0,
  attempts_count integer not null default 0,
  last_assessed_at timestamptz,
  is_mastered boolean not null default false,
  unique(user_id, level_id, module_id, topic_id, skill)
);

alter table public.assessments enable row level security;
alter table public.assessment_items enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.mastery_records enable row level security;

create policy "Authenticated users can view published assessments"
on public.assessments for select
to authenticated using (is_published = true);

create policy "Authenticated users can view assessment items"
on public.assessment_items for select
to authenticated using (
  exists (
    select 1
    from public.assessments a
    where a.id = assessment_items.assessment_id
      and a.is_published = true
  )
);

create policy "Users can manage assessment attempts"
on public.assessment_attempts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage mastery records"
on public.mastery_records for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
