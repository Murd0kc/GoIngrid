create table if not exists public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  target_text text not null,
  skill text not null,
  ease_factor numeric(4,2) not null default 2.50,
  interval_days integer not null default 0,
  repetition_count integer not null default 0,
  difficulty integer not null default 1 check (difficulty between 1 and 5),
  confidence integer check (confidence between 1 and 5),
  last_result boolean,
  last_reviewed_at timestamptz,
  next_review_at timestamptz not null default now(),
  error_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique(user_id, exercise_id)
);

create table if not exists public.learning_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_type text not null
    check (goal_type in ('daily_minutes', 'weekly_lessons', 'level_target', 'custom')),
  target_value jsonb not null,
  starts_on date not null default current_date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  exercise_id uuid references public.exercises(id) on delete set null,
  recommendation_type text not null
    check (recommendation_type in (
      'review',
      'continue',
      'reinforce',
      'challenge',
      'conversation',
      'pronunciation'
    )),
  reason text not null,
  priority integer not null default 1,
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

alter table public.review_items enable row level security;
alter table public.learning_goals enable row level security;
alter table public.recommendations enable row level security;

create policy "Users can manage their review items"
on public.review_items for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their learning goals"
on public.learning_goals for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their recommendations"
on public.recommendations for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
