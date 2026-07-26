# GoIngrid - Estado de produccion de contenido

## Decisión vigente

El contenido A1 anterior está congelado como material preliminar. La cantidad importada a Supabase no equivale a contenido pedagógicamente aprobado. La reconstrucción seguirá `CONTENT_REBUILD_PLAN.md`, `content/LESSON_BLUEPRINT.md` y `content/QUALITY_RUBRIC.md`.

Este archivo controla el avance real del contenido. Un tema solo se marca como terminado cuando tiene archivos completos, validacion automatica, revision linguistica, revision pedagogica, revision CEFR y preparacion para importacion. La fuente actual de las lecciones reconstruidas es `content/rebuild/`; la jerarquia documental se define en `GOINGRID_MASTER_SPECIFICATION.md`.

## Estados permitidos

planned, writing, validated, linguistic_review, pedagogical_review, cefr_review, approved, imported

## Reglas

- No marcar un tema como terminado por tener solo el indice.
- No marcar una leccion como completa si faltan actividades o habilidades.
- No importar contenido en estado writing o validated.
- Registrar errores y correcciones antes de cambiar de estado.
- Mantener los codigos estables aunque cambie el texto.

## Resumen actual

| Nivel | Temas planificados | Temas con contenido | Validados | Importados |
|---|---:|---:|---:|---:|
| A1 | 30 | 30 | 0 aprobados | 0 |
| A2 | pendiente de catalogo | 0 | 0 | 0 |
| B1 | pendiente de catalogo | 0 | 0 | 0 |
| B2 | pendiente de catalogo | 0 | 0 | 0 |
| C1 | pendiente de catalogo | 0 | 0 | 0 |
| C2 | pendiente de catalogo | 0 | 0 | 0 |

## Definicion de terminado por tema

- 4 a 6 lecciones completas.
- 10 a 15 actividades por leccion.
- Escucha, pronunciacion, lectura, escritura y conversacion.
- Actividad de transferencia.
- Evaluacion de dominio.
- Repaso espaciado.
- Respuestas y retroalimentacion.
- Validacion JSON.
- Revision linguistica, pedagogica y CEFR.
- Archivo listo para importacion idempotente.
