insert into public.levels (code, name, description, sort_order)
values
  ('A1', 'Principiante', 'Frases básicas y necesidades cotidianas.', 1),
  ('A2', 'Básico', 'Comunicación sencilla en situaciones previsibles.', 2),
  ('B1', 'Intermedio', 'Conversación independiente sobre experiencias y opiniones.', 3),
  ('B2', 'Intermedio alto', 'Debates, textos complejos y comunicación profesional.', 4),
  ('C1', 'Avanzado', 'Comunicación fluida, precisa y con matices.', 5),
  ('C2', 'Dominio', 'Comprensión y expresión prácticamente completas.', 6)
on conflict (code) do nothing;
