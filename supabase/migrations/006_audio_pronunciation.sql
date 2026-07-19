create table if not exists public.audio_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  section_id uuid references public.lesson_sections(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  storage_path text not null,
  transcript text,
  language text not null default 'en',
  accent text,
  voice_type text,
  duration_seconds integer,
  source_type text not null default 'original',
  source_reference text,
  created_at timestamptz not null default now(),
  check (
    lesson_id is not null
    or section_id is not null
    or exercise_id is not null
  )
);

create table if not exists public.pronunciation_targets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  target_text text not null,
  phonetic_text text,
  target_sounds text[] not null default '{}',
  explanation_es text,
  common_spanish_error text,
  sort_order integer not null default 1
);

create table if not exists public.pronunciation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid references public.pronunciation_targets(id) on delete set null,
  audio_path text,
  recognized_text text,
  pronunciation_score numeric(5,2),
  intelligibility_score numeric(5,2),
  rhythm_score numeric(5,2),
  intonation_score numeric(5,2),
  detected_errors jsonb not null default '[]'::jsonb,
  feedback jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audio_assets enable row level security;
alter table public.pronunciation_targets enable row level security;
alter table public.pronunciation_attempts enable row level security;

create policy "Authenticated users can view audio assets"
on public.audio_assets for select
to authenticated using (true);

create policy "Authenticated users can view pronunciation targets"
on public.pronunciation_targets for select
to authenticated using (true);

create policy "Users can manage pronunciation attempts"
on public.pronunciation_attempts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
