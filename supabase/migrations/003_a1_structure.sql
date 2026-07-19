do $$
declare
  a1_id uuid;
  foundations_id uuid;
  sentences_id uuid;
  daily_id uuid;
begin
  select id into a1_id
  from public.levels
  where code = 'A1';

  insert into public.modules (level_id, title, description, sort_order)
  values (
    a1_id,
    'Bases fundamentales',
    'Los elementos esenciales para comenzar a comprender y formar frases en inglés.',
    1
  )
  on conflict (level_id, sort_order)
  do update set title = excluded.title
  returning id into foundations_id;

  insert into public.modules (level_id, title, description, sort_order)
  values (
    a1_id,
    'Construcción de oraciones',
    'Cómo organizar palabras y expresar ideas sencillas.',
    2
  )
  on conflict (level_id, sort_order)
  do update set title = excluded.title
  returning id into sentences_id;

  insert into public.modules (level_id, title, description, sort_order)
  values (
    a1_id,
    'Comunicación cotidiana',
    'Situaciones prácticas para usar el inglés desde el primer día.',
    3
  )
  on conflict (level_id, sort_order)
  do update set title = excluded.title
  returning id into daily_id;

  insert into public.topics (module_id, title, description, sort_order)
  values
    (foundations_id, 'El alfabeto y los sonidos principales', 'Reconocer letras, sonidos y deletrear palabras.', 1),
    (foundations_id, 'Pronombres personales', 'Usar I, you, he, she, it, we y they.', 2),
    (foundations_id, 'Verbo to be', 'Formar afirmaciones, preguntas y negaciones con am, is y are.', 3),
    (foundations_id, 'Artículos', 'Usar a, an y the en contextos cotidianos.', 4),
    (foundations_id, 'Sustantivos y plurales', 'Identificar sustantivos y formar plurales comunes.', 5),
    (foundations_id, 'Adjetivos', 'Describir personas, objetos y lugares.', 6),
    (foundations_id, 'Adjetivos posesivos', 'Expresar pertenencia con my, your, his, her, our y their.', 7),
    (foundations_id, 'Demostrativos', 'Usar this, that, these y those.', 8),
    (foundations_id, 'There is y there are', 'Describir lo que existe en un lugar.', 9),
    (foundations_id, 'Preposiciones básicas', 'Usar in, on, at, under, behind y next to.', 10)
  on conflict (module_id, sort_order)
  do update set title = excluded.title;

  insert into public.topics (module_id, title, description, sort_order)
  values
    (sentences_id, 'Orden de las palabras', 'Formar oraciones afirmativas correctamente.', 1),
    (sentences_id, 'Presente simple', 'Hablar de rutinas, hechos y hábitos.', 2),
    (sentences_id, 'Auxiliares do y does', 'Formar preguntas y negaciones.', 3),
    (sentences_id, 'Palabras interrogativas', 'Usar what, where, when, why, who y how.', 4),
    (sentences_id, 'Adverbios de frecuencia', 'Expresar con qué frecuencia ocurre algo.', 5)
  on conflict (module_id, sort_order)
  do update set title = excluded.title;

  insert into public.topics (module_id, title, description, sort_order)
  values
    (daily_id, 'Presentarse', 'Decir el nombre, origen, profesión y datos básicos.', 1),
    (daily_id, 'La familia', 'Hablar de familiares y relaciones.', 2),
    (daily_id, 'La casa y los objetos', 'Describir espacios y pertenencias.', 3),
    (daily_id, 'Rutinas diarias', 'Contar actividades habituales.', 4),
    (daily_id, 'Comida y compras', 'Pedir productos y expresar preferencias.', 5)
  on conflict (module_id, sort_order)
  do update set title = excluded.title;
end $$;
