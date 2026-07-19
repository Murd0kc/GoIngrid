create table if not exists public.lesson_sections (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  section_type text not null check (
    section_type in (
      'explanation',
      'examples',
      'pronunciation',
      'listening',
      'reading',
      'writing',
      'conversation',
      'review'
    )
  ),
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null,
  unique(lesson_id, sort_order)
);

alter table public.lesson_sections enable row level security;

create policy "Authenticated users can view lesson sections"
on public.lesson_sections for select
to authenticated using (
  exists (
    select 1
    from public.lessons l
    where l.id = lesson_sections.lesson_id
      and l.is_published = true
  )
);
