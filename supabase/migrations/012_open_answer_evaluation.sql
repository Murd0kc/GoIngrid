alter table public.exercise_attempts
  alter column is_correct drop not null;

alter table public.exercise_attempts
  add column if not exists evaluation_status text not null default 'graded'
  check (evaluation_status in ('graded', 'pending', 'reviewed'));
