# GoIngrid — Especificación maestra del proyecto

Este documento coordina requisitos, arquitectura, currículo, contrato de contenido, calidad y estado operativo. No reemplaza los documentos especializados: define su relación, autoridad y fuentes de verdad.

## Producto

GoIngrid es una plataforma modular para que personas hispanohablantes aprendan inglés desde A1 hasta C2 mediante comunicación contextual, práctica activa, pronunciación inteligible, comprensión auditiva, lectura, escritura, conversación con IA, repetición espaciada y progreso medible.

Completar actividades, acumular puntos o mantener una racha no equivale a dominar el idioma.

## Jerarquía de autoridad

Cuando dos documentos difieran, se aplica este orden:

1. Seguridad, privacidad y protección de datos.
2. `GOINGRID_ENGINEERING_RULES.md`.
3. `PRODUCT_REQUIREMENTS.md`.
4. `GOINGRID_CONTENT_MASTER_PLAN.md`.
5. `GOINGRID_LEARNING_EXPERIENCE_RULES.md`.
6. `content/LESSON_CONTENT_CONTRACT.md`.
7. `content/QUALITY_RUBRIC.md`.
8. `GOINGRID_DEVELOPMENT_PLAN.md`.
9. `GOINGRID_STARTUP_CHECKLIST.md`.
10. `CONTENT_PRODUCTION_STATUS.md`.

Las contradicciones deben registrarse y resolverse explícitamente.

## Función de cada documento

| Documento | Función |
|---|---|
| `PRODUCT_REQUIREMENTS.md` | Requisitos funcionales y de producto. |
| `GOINGRID_ENGINEERING_RULES.md` | Arquitectura, seguridad, modularidad y continuidad técnica. |
| `GOINGRID_CONTENT_MASTER_PLAN.md` | Currículo, metodología y alcance A1–C2. |
| `GOINGRID_LEARNING_EXPERIENCE_RULES.md` | Motivación saludable, UX de aprendizaje, IA y progreso. |
| `content/LESSON_CONTENT_CONTRACT.md` | Esquema obligatorio de cada lección y actividad. |
| `content/LESSON_BLUEPRINT.md` | Secuencia didáctica para construir una lección. |
| `content/QUALITY_RUBRIC.md` | Rúbrica y motivos de rechazo. |
| `GOINGRID_QUALITY_GOVERNANCE_PLAN.md` | Preflight, puertas de calidad y prevención de errores. |
| `GOINGRID_DEVELOPMENT_PLAN.md` | Fases y orden de implementación. |
| `GOINGRID_STARTUP_CHECKLIST.md` | Infraestructura, despliegue y operación. |
| `CONTENT_REBUILD_PLAN.md` | Reconstrucción específica de A1. |
| `CONTENT_PRODUCTION_STATUS.md` | Estado verificable del contenido. |
| `README.md` | Entrada rápida y enlaces principales. |

## Fuentes de verdad

- Requisitos: `PRODUCT_REQUIREMENTS.md`.
- Arquitectura: `GOINGRID_ENGINEERING_RULES.md`.
- Currículo: `GOINGRID_CONTENT_MASTER_PLAN.md`.
- Experiencia: `GOINGRID_LEARNING_EXPERIENCE_RULES.md`.
- Contrato JSON: `content/LESSON_CONTENT_CONTRACT.md`.
- Lecciones reconstruidas actuales: `content/rebuild/`.
- Base de datos: estado real consultado en Supabase.
- Contenido antiguo: `content/lessons/A1/final/`, congelado y no publicable.

La base de datos se sincroniza únicamente mediante un importador validado desde `content/rebuild/` hasta que una decisión documentada establezca otra ruta.

## Estados oficiales

`planned` → `writing` → `structurally_validated` → `linguistic_review` → `pedagogical_review` → `cefr_review` → `approved` → `imported` → `published`.

La validación estructural no equivale a aprobación pedagógica. La importación tampoco equivale a publicación.

## Estado actual conocido

- Nivel producido: A1.
- Módulos: M1, M2 y M3.
- Temas: 30.
- Lecciones: 120.
- Actividades: 1.200.
- Estado: estructuralmente validado; pendiente de revisión lingüística, pedagógica, CEFR y recursos multimedia reales.
- Publicación en Supabase: bloqueada hasta superar las puertas de calidad.

## Puertas antes de importar

1. Validar esquema JSON y códigos.
2. Comparar catálogo, orden y referencias con Supabase.
3. Revisar respuestas, distractores, feedback y ambigüedades.
4. Confirmar escucha, pronunciación, lectura, escritura, conversación y transferencia.
5. Diferenciar guiones de audio de archivos de audio reales.
6. Evaluar pronunciación por inteligibilidad y mejora accionable.
7. Evaluar respuestas abiertas con rúbrica o estado pendiente.
8. Ejecutar revisión lingüística, pedagógica y CEFR.
9. Generar preflight.
10. Importar de forma idempotente, reversible y versionada.

## Regla de continuidad

Antes de cualquier cambio importante se debe leer este documento y los documentos especializados relacionados, revisar Git, verificar Supabase y declarar qué fuente de verdad se modifica. Después se ejecutan validaciones y se actualiza el estado documental.
