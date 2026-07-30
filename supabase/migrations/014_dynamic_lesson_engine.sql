alter table public.exercises
  add column if not exists content_code text,
  add column if not exists instruction text,
  add column if not exists content_payload jsonb not null default '{}'::jsonb,
  add column if not exists feedback_correct text,
  add column if not exists feedback_incorrect text;

create unique index if not exists exercises_content_code_key
  on public.exercises (content_code)
  where content_code is not null;

create or replace function public.get_lesson_player_content(p_lesson_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', l.id,
    'title', l.title,
    'objective', l.objective,
    'estimated_minutes', l.estimated_minutes,
    'estimated_seconds', l.estimated_seconds,
    'sort_order', l.sort_order,
    'skill_focus', l.skill_focus,
    'cefr_objectives', l.cefr_objectives,
    'sections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', ls.id,
          'section_type', ls.section_type,
          'title', ls.title,
          'content', ls.content,
          'sort_order', ls.sort_order
        )
        order by ls.sort_order
      )
      from public.lesson_sections ls
      where ls.lesson_id = l.id
    ), '[]'::jsonb),
    'exercises', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'content_code', e.content_code,
          'exercise_type', e.exercise_type,
          'skill', e.skill,
          'instruction', coalesce(e.instruction, e.prompt),
          'prompt', e.prompt,
          'explanation', e.explanation,
          'difficulty', e.difficulty,
          'estimated_seconds', e.estimated_seconds,
          'sort_order', e.sort_order,
          'content', e.content_payload,
          'options', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', eo.id,
                'option_text', eo.option_text,
                'sort_order', eo.sort_order
              )
              order by eo.sort_order
            )
            from public.exercise_options eo
            where eo.exercise_id = e.id
          ), '[]'::jsonb)
        )
        order by e.sort_order
      )
      from public.exercises e
      where e.lesson_id = l.id
        and e.is_published = true
    ), '[]'::jsonb)
  )
  from public.lessons l
  where l.id = p_lesson_id
    and l.is_published = true
    and auth.uid() is not null;
$$;

create or replace function public.submit_exercise_attempt(
  p_exercise_id uuid,
  p_answer jsonb,
  p_response_time_ms integer default null
)
returns table (
  attempt_id uuid,
  is_correct boolean,
  evaluation_status text,
  feedback text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_exercise public.exercises%rowtype;
  v_option_id uuid;
  v_answer_value jsonb;
  v_correct_value jsonb;
  v_is_correct boolean;
  v_evaluation_status text;
  v_feedback text;
  v_attempt_id uuid;
  v_payload_status text;
  v_answer_text text;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_answer is null or pg_catalog.pg_column_size(p_answer) > 65536 then
    raise exception 'Answer payload is missing or too large' using errcode = '22023';
  end if;

  select e.*
  into v_exercise
  from public.exercises e
  where e.id = p_exercise_id
    and e.is_published = true;

  if not found then
    raise exception 'Exercise not found' using errcode = 'P0002';
  end if;

  v_payload_status := coalesce(
    v_exercise.content_payload #>> '{evaluation,status}',
    ''
  );
  v_answer_value := p_answer -> 'value';
  v_correct_value := coalesce(v_exercise.correct_answer, '[]'::jsonb);

  if p_answer ->> 'kind' = 'option' then
    begin
      v_option_id := (p_answer ->> 'option_id')::uuid;
    exception when invalid_text_representation then
      raise exception 'Invalid option identifier' using errcode = '22023';
    end;

    select eo.is_correct
    into v_is_correct
    from public.exercise_options eo
    where eo.id = v_option_id
      and eo.exercise_id = p_exercise_id;

    if not found then
      raise exception 'Option does not belong to exercise' using errcode = '22023';
    end if;

    v_evaluation_status := 'graded';
  elsif v_payload_status = 'pending_rubric'
    or jsonb_array_length(v_correct_value) = 0 then
    v_is_correct := null;
    v_evaluation_status := 'pending';
  elsif jsonb_typeof(v_answer_value) = 'string' then
    v_answer_text := lower(regexp_replace(trim(v_answer_value #>> '{}'), '\s+', ' ', 'g'));

    select exists (
      select 1
      from jsonb_array_elements_text(v_correct_value) accepted(value)
      where lower(regexp_replace(trim(accepted.value), '\s+', ' ', 'g')) = v_answer_text
    )
    into v_is_correct;

    v_evaluation_status := 'graded';
  elsif jsonb_typeof(v_answer_value) = 'array' then
    if v_exercise.exercise_type = 'interactive_reading'
      and jsonb_typeof(v_correct_value -> 0) = 'array' then
      select
        jsonb_array_length(v_answer_value) = jsonb_array_length(v_correct_value)
        and coalesce(bool_and(exists (
          select 1
          from jsonb_array_elements_text(correct_item.value) accepted(value)
          where lower(regexp_replace(trim(accepted.value), '\s+', ' ', 'g'))
            =
            lower(regexp_replace(trim(answer_item.value), '\s+', ' ', 'g'))
        )), false)
      into v_is_correct
      from jsonb_array_elements_text(v_answer_value) with ordinality answer_item(value, position)
      join jsonb_array_elements(v_correct_value) with ordinality correct_item(value, position)
        using (position);
    elsif v_exercise.exercise_type ~ '(match|sort|map)' then
      select not exists (
        (
          select lower(regexp_replace(trim(value), '\s+', ' ', 'g'))
          from jsonb_array_elements_text(v_answer_value)
          except
          select lower(regexp_replace(trim(value), '\s+', ' ', 'g'))
          from jsonb_array_elements_text(v_correct_value)
        )
        union all
        (
          select lower(regexp_replace(trim(value), '\s+', ' ', 'g'))
          from jsonb_array_elements_text(v_correct_value)
          except
          select lower(regexp_replace(trim(value), '\s+', ' ', 'g'))
          from jsonb_array_elements_text(v_answer_value)
        )
      )
      into v_is_correct;
    else
      select coalesce(
        bool_and(
          answer_item.value is not null
          and correct_item.value is not null
          and lower(regexp_replace(trim(answer_item.value), '\s+', ' ', 'g'))
            =
            lower(regexp_replace(trim(correct_item.value), '\s+', ' ', 'g'))
        ),
        false
      )
      into v_is_correct
      from jsonb_array_elements_text(v_answer_value) with ordinality answer_item(value, position)
      full join jsonb_array_elements_text(v_correct_value) with ordinality correct_item(value, position)
        using (position);
    end if;

    v_evaluation_status := 'graded';
  else
    v_is_correct := null;
    v_evaluation_status := 'pending';
  end if;

  v_feedback := case
    when v_evaluation_status = 'pending'
      then 'Tu respuesta quedó registrada para revisión. Puedes continuar.'
    when v_is_correct
      then coalesce(v_exercise.feedback_correct, v_exercise.explanation, 'Correcto. Continúa.')
    else coalesce(v_exercise.feedback_incorrect, v_exercise.explanation, 'Revisa la pista e inténtalo otra vez.')
  end;

  insert into public.exercise_attempts (
    user_id,
    exercise_id,
    answer,
    is_correct,
    evaluation_status,
    response_time_ms
  )
  values (
    v_user_id,
    p_exercise_id,
    p_answer,
    v_is_correct,
    v_evaluation_status,
    greatest(0, least(coalesce(p_response_time_ms, 0), 3600000))
  )
  returning id into v_attempt_id;

  return query
  select v_attempt_id, v_is_correct, v_evaluation_status, v_feedback;
end;
$$;

revoke all on function public.get_lesson_player_content(uuid) from public;
revoke all on function public.submit_exercise_attempt(uuid, jsonb, integer) from public;

grant execute on function public.get_lesson_player_content(uuid) to authenticated;
grant execute on function public.submit_exercise_attempt(uuid, jsonb, integer) to authenticated;

-- El contenido publicado se entrega únicamente mediante la función anterior.
-- Así el navegador no puede consultar correct_answer ni is_correct directamente.
revoke select on public.exercises from anon, authenticated;
revoke select on public.exercise_options from anon, authenticated;
