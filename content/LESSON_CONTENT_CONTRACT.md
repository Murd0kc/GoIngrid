# Contrato de contenido de lecciones

Cada archivo de lección final debe contener todos los campos siguientes. Un archivo incompleto no puede importarse a Supabase.

## Identidad

- `id`: código estable, por ejemplo `A1-M1-T01-L01`.
- `level`.
- `module_code`.
- `topic`.
- `title`.
- `estimated_seconds`.
- `cefr_objectives`.
- `communication_goal`.

## Enseñanza

- `context`.
- `explanation_es`.
- `key_language`.
- `examples`.
- `spanish_speaker_notes`.
- `vocabulary`.
- `pronunciation_targets`.

## Actividades

Cada actividad debe tener:

- `id`.
- `type`.
- `skill`.
- `instruction`.
- `prompt`.
- `difficulty`.
- `estimated_seconds`.
- `target_error`.
- `correct_answer` o criterio de evaluación.
- `feedback_correct`.
- `feedback_incorrect`.
- `hint`.

Las actividades deben cubrir, cuando corresponda:

- gramática;
- vocabulario;
- escucha;
- pronunciación;
- lectura;
- escritura;
- conversación;
- interacción;
- repaso.

## Recursos

- `listening`: guion, transcripción, audio esperado y preguntas.
- `reading`: texto, vocabulario, comprensión e inferencia.
- `speaking`: modelo, grabación, criterios de inteligibilidad y feedback.
- `writing`: tarea, extensión, criterios y ejemplo de respuesta.
- `ai_roleplay`: rol, contexto, objetivo, apertura, límites y criterios de dominio.

## Evaluación

- `review_schedule`.
- `mastery_criteria`.
- `assessment_items`.
- `transfer_task`.
- `completion_requirements`.

## Calidad

- El contenido debe ser original o tener fuente/licencia documentada.
- Las respuestas deben ser inequívocas cuando el tipo de ejercicio lo requiera.
- El nivel CEFR y la dificultad deben corresponder al objetivo.
- Los ejemplos deben ser naturales y útiles para hispanohablantes.
- No se permite contenido de relleno ni ejercicios repetidos sin propósito.
