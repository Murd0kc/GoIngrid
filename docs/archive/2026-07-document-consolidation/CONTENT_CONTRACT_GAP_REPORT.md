# GoIngrid — Informe de diferencias del contrato de contenido

## Fecha de auditoría

2026-07-24

## Alcance

Se compararon los 120 archivos de `content/rebuild/` y sus 1.200 actividades contra `LESSON_CONTENT_CONTRACT.md`.

## Resultado

- JSON válidos: 120/120.
- Actividades válidas estructuralmente: 1.200/1.200.
- Campo `id` en actividades: 1.200/1.200.
- Campos `type`, `skill` e `instruction`: 1.200/1.200.
- `explanation_es`: 116/120.
- `prompt` normalizado: 252/1.200.
- `estimated_seconds` en actividades: 500/1.200.
- `target_error`: 0/1.200.
- `hint`: 0/1.200.
- `feedback_correct` y `feedback_incorrect` normalizados: 500/1.200.
- Actividades identificadas como escritura: 3/120 lecciones.
- Audio real asociado: 0; existen guiones textuales en algunas actividades.

## Diferencias críticas

1. El contrato exige una estructura normalizada, pero los JSON usan variantes como `answer`, `answers`, `correct`, `correct_answer` y `correct_answers`.
2. No todas las actividades tienen `prompt`, `difficulty`, `target_error`, `hint` y feedback normalizado.
3. El lote actual no cubre escritura de forma suficiente.
4. El lote contiene principalmente `audio_text`, no recursos de audio reales.
5. Faltan de forma uniforme `cefr_objectives`, `key_language`, `examples`, `pronunciation_targets`, `review_schedule`, `assessment_items`, `transfer_task` y `completion_requirements`.
6. Las conversaciones con IA no tienen una estructura universal de rol, apertura, límites, criterios de dominio y evaluación.

## Decisión

El lote es estructuralmente legible, pero no cumple todavía el contrato final de importación. No debe publicarse ni importarse como contenido aprobado.

## Corrección requerida

Antes del importador final se debe crear una normalización explícita que conserve el contenido original, convierta respuestas a una estructura común, añada dificultad, error objetivo, feedback, pistas, recursos de audio, escritura, criterios CEFR y repaso. La normalización debe generar una nueva versión y no sobrescribir silenciosamente los archivos originales.
