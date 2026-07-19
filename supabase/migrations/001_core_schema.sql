create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  native_language text not null default 'es',
  target_level text,
  daily_goal_minutes integer not null default 15,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.levels (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (code in ('A1','A2','B1','B2','C1','C2')),
  name text not null,
  description text,
  sort_order integer not null unique
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.levels(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null,
  unique(level_id, sort_order)
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null,
  unique(module_id, sort_order)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  title text not null,
  objective text,
  estimated_minutes integer not null default 10,
  sort_order integer not null,
  is_published boolean not null default false,
  unique(topic_id, sort_order)
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  exercise_type text not null,
  prompt text not null,
  explanation text,
  correct_answer jsonb,
  difficulty integer not null default 1 check (difficulty between 1 and 5),
  sort_order integer not null,
  is_published boolean not null default false,
  unique(lesson_id, sort_order)
);

create table public.exercise_options (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order integer not null
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','completed')),
  completion_percent numeric(5,2) not null default 0,
  last_score numeric(5,2),
  time_spent_seconds integer not null default 0,
  last_activity_at timestamptz,
  unique(user_id, lesson_id)
);

create table public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  answer jsonb,
  is_correct boolean not null,
  response_time_ms integer,
  created_at timestamptz not null default now()
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer not null default 0,
  lessons_completed integer not null default 0,
  exercises_completed integer not null default 0
);

alter table public.profiles enable row level security;
alter table public.levels enable row level security;
alter table public.modules enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_options enable row level security;
alter table public.user_progress enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.study_sessions enable row level security;

create policy "Users can view their profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Authenticated users can view published content"
on public.levels for select
to authenticated using (true);

create policy "Authenticated users can view modules"
on public.modules for select
to authenticated using (true);

create policy "Authenticated users can view topics"
on public.topics for select
to authenticated using (true);

create policy "Authenticated users can view published lessons"
on public.lessons for select
to authenticated using (is_published = true);

create policy "Authenticated users can view published exercises"
on public.exercises for select
to authenticated using (is_published = true);

create policy "Authenticated users can view exercise options"
on public.exercise_options for select
to authenticated using (true);

create policy "Users can manage their progress"
on public.user_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their attempts"
on public.exercise_attempts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their study sessions"
on public.study_sessions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
