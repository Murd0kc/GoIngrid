alter table public.lessons
  add column if not exists skill_focus text[] not null default '{}',
  add column if not exists cefr_objectives text[] not null default '{}',
  add column if not exists estimated_seconds integer not null default 600,
  add column if not exists reviewed_by text,
  add column if not exists reviewed_at timestamptz;

alter table public.lesson_sections
  add column if not exists source_type text not null default 'original',
  add column if not exists source_reference text,
  add column if not exists audio_script text;

alter table public.exercises
  add column if not exists skill text not null default 'grammar',
  add column if not exists target_error text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists estimated_seconds integer not null default 45,
  add column if not exists cefr_objective text,
  add column if not exists source_type text not null default 'original',
  add column if not exists source_reference text;

create table if not exists public.exercise_feedback (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  feedback_type text not null check (
    feedback_type in ('correct', 'incorrect', 'hint', 'explanation')
  ),
  trigger_value text,
  message text not null,
  language text not null default 'es'
);

create table if not exists public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  reviewer_role text not null check (
    reviewer_role in ('linguistic', 'pedagogical', 'cefr', 'technical')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'needs_changes', 'rejected')
  ),
  comments text,
  reviewed_at timestamptz,
  check (lesson_id is not null or exercise_id is not null)
);

alter table public.exercise_feedback enable row level security;
alter table public.content_reviews enable row level security;

create policy "Authenticated users can view exercise feedback"
on public.exercise_feedback for select
to authenticated using (true);
