# Contrato de contenido de lecciones

## Estado de implementación del contrato

Este documento define el formato final requerido para importar contenido aprobado. Los archivos actuales de `content/rebuild/` son una versión estructural inicial y sus diferencias están documentadas en `content/CONTENT_CONTRACT_GAP_REPORT.md`.

No se debe crear un importador que asuma que `answer`, `correct`, `correct_answer` y `correct_answers` son equivalentes sin una etapa explícita de normalización y validación.

La versión final debe normalizar como mínimo `cefr_objectives`, `key_language`, `examples`, `difficulty`, `estimated_seconds`, `target_error`, `prompt`, `correct_answer` o `accepted_answers`, `feedback_correct`, `feedback_incorrect`, `hint`, `review_schedule`, `assessment_items`, `transfer_task` y `completion_requirements`.

Las actividades de escucha deben distinguir `audio_asset`, `transcript` y `audio_text` de respaldo. Las actividades abiertas deben incluir rúbrica o estado de evaluación pendiente. Las actividades de pronunciación deben incluir objetivo, modelo, criterios de inteligibilidad y feedback accionable.

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
