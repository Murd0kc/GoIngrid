create table if not exists public.conversation_scenarios (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  description text,
  role_name text not null,
  role_instructions text not null,
  context text not null,
  opening_message text not null,
  target_language text not null default 'en',
  support_language text not null default 'es',
  difficulty integer not null default 1 check (difficulty between 1 and 5),
  target_vocabulary text[] not null default '{}',
  target_grammar text[] not null default '{}',
  success_criteria jsonb not null default '{}'::jsonb,
  is_published boolean not null default false
);

create table if not exists public.conversation_turns (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references public.conversation_scenarios(id) on delete cascade,
  turn_order integer not null,
  expected_intent text,
  example_response text,
  correction_guidance text,
  unique(scenario_id, turn_order)
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id uuid references public.conversation_scenarios(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  language_mode text not null default 'mixed'
    check (language_mode in ('english', 'mixed', 'spanish_support')),
  turns_count integer not null default 0,
  duration_seconds integer not null default 0,
  evaluation jsonb not null default '{}'::jsonb
);

create table if not exists public.ai_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  sender text not null check (sender in ('user', 'ai', 'system')),
  text_content text,
  audio_path text,
  detected_language text,
  correction jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.conversation_scenarios enable row level security;
alter table public.conversation_turns enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_conversation_messages enable row level security;

create policy "Authenticated users can view published scenarios"
on public.conversation_scenarios for select
to authenticated using (is_published = true);

create policy "Authenticated users can view scenario turns"
on public.conversation_turns for select
to authenticated using (
  exists (
    select 1
    from public.conversation_scenarios s
    where s.id = conversation_turns.scenario_id
      and s.is_published = true
  )
);

create policy "Users can manage their AI conversations"
on public.ai_conversations for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their AI messages"
on public.ai_conversation_messages for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
