# GoIngrid - Requisitos del producto

## Producto

- Curriculo alineado con A1, A2, B1, B2, C1 y C2.
- Contenido dinamico en PostgreSQL/Supabase.
- Practica activa y actividades variadas.
- Diagnostico general y por habilidad.
- Seguimiento de tiempo, respuestas, errores, valoraciones y retencion.
- Repeticion espaciada y recomendaciones personalizadas.
- Conversacion bilingue con IA.
- Pronunciacion basada en inteligibilidad y evolucion individual.
- Lecturas graduadas, audios, escritura y tareas integradas.
- Gamificacion moderada y objetivos flexibles.
- Panel administrativo con control de contenido.
- Arquitectura modular sin archivos monoliticos.
- Proyecto, base de datos, variables y despliegue independientes de English Coach.

## Fuente y calidad del contenido

- `content/curriculum/` es la fuente unica de verdad.
- Supabase no debe divergir del catalogo curricular.
- Todo contenido pasa validacion estructural, linguistica, pedagogica, CEFR y tecnica.
- Estados: `draft`, `linguistic_review`, `pedagogical_review`, `cefr_review`, `approved`, `published`.
- Las migraciones ejecutadas no se editan; las correcciones usan migraciones nuevas e idempotentes.
- No se aceptan prototipos ni contenido provisional como producto final.

## Orden de autoridad

En caso de contradiccion:

1. Seguridad y privacidad.
2. `GOINGRID_ENGINEERING_RULES.md`.
3. Este documento.
4. `GOINGRID_CONTENT_MASTER_PLAN.md`.
5. `GOINGRID_DEVELOPMENT_PLAN.md`.
6. `GOINGRID_STARTUP_CHECKLIST.md`.
