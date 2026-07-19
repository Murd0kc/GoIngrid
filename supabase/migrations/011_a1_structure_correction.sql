do $$
declare
  v_foundations_id uuid;
  v_sentences_id uuid;
  v_daily_id uuid;
begin
  select id into v_foundations_id
  from public.modules
  where title = 'Bases fundamentales'
  limit 1;

  select id into v_sentences_id
  from public.modules
  where title = 'Construcción de oraciones'
  limit 1;

  select id into v_daily_id
  from public.modules
  where title = 'Comunicación cotidiana'
  limit 1;

  update public.topics
  set title = 'Artículos a, an y the'
  where module_id = v_foundations_id
    and title = 'Artículos';

  update public.topics
  set title = 'Orden correcto de las palabras'
  where module_id = v_sentences_id
    and title = 'Orden de las palabras';

  update public.topics
  set title = 'Presentarse y dar información personal'
  where module_id = v_daily_id
    and title = 'Presentarse';

  update public.topics
  set title = 'Familia y relaciones'
  where module_id = v_daily_id
    and title = 'La familia';

  update public.topics
  set title = 'Casa y objetos cotidianos'
  where module_id = v_daily_id
    and title = 'La casa y los objetos';

  update public.topics
  set title = 'Rutinas diarias'
  where module_id = v_daily_id
    and title = 'Rutinas diarias';

  update public.topics
  set title = 'Comida, compras y preferencias'
  where module_id = v_daily_id
    and title = 'Comida y compras';

  update public.topics
  set sort_order = sort_order + 100
  where module_id = v_sentences_id
    and sort_order in (4, 5);

  update public.topics
  set title = 'Preguntas y respuestas',
      sort_order = 4
  where module_id = v_sentences_id
    and sort_order = 104;

  update public.topics
  set title = 'Adverbios de frecuencia',
      sort_order = 6
  where module_id = v_sentences_id
    and sort_order = 105;

  insert into public.topics (module_id, title, description, sort_order)
  values
    (v_sentences_id, 'Negaciones', 'Expresar que algo no ocurre o no es cierto.', 5),
    (v_sentences_id, 'Palabras interrogativas', 'Usar what, where, when, why, who y how.', 7),
    (v_sentences_id, 'Pronombres de objeto', 'Usar me, you, him, her, us y them.', 8),
    (v_sentences_id, 'Sustantivos contables y no contables', 'Hablar de cantidades y objetos.', 9),
    (v_sentences_id, 'Some, any, much, many, few y little', 'Expresar cantidades correctamente.', 10)
  on conflict (module_id, sort_order)
  do update set
    title = excluded.title,
    description = excluded.description;

  insert into public.topics (module_id, title, description, sort_order)
  values
    (v_daily_id, 'Hora, fechas y calendario', 'Hablar de horarios, fechas y eventos.', 6),
    (v_daily_id, 'Lugares y direcciones', 'Pedir y dar indicaciones sencillas.', 7),
    (v_daily_id, 'Transporte y viajes básicos', 'Usar transporte y resolver situaciones simples de viaje.', 8),
    (v_daily_id, 'Trabajo y estudio', 'Hablar de actividades laborales y académicas.', 9),
    (v_daily_id, 'Situaciones de ayuda y necesidades', 'Pedir ayuda y expresar necesidades cotidianas.', 10)
  on conflict (module_id, sort_order)
  do update set
    title = excluded.title,
    description = excluded.description;
end $$;
