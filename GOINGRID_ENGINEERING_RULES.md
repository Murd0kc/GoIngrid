# GoIngrid — Reglas Permanentes de Desarrollo

Este documento es obligatorio para todas las sesiones y cambios futuros del proyecto.

## Fuente de verdad

- El currículo y el contenido se definen primero en archivos versionados dentro de `content/`.
- La base de datos se genera o sincroniza desde esos archivos.
- No se mantienen estructuras paralelas sin validación.
- Los IDs funcionales y códigos de contenido deben ser estables.

## Validación antes de avanzar

Antes de crear o importar contenido se debe comprobar:

- niveles, módulos, temas, lecciones y actividades;
- duplicados, faltantes y referencias inválidas;
- campos obligatorios y tipos de datos;
- respuestas correctas y distractores;
- duración y volumen de práctica;
- habilidades CEFR cubiertas;
- compatibilidad entre archivos y Supabase.

Si existe una inconsistencia, el proceso se detiene hasta corregirla.

## Migraciones y base de datos

- Las migraciones ejecutadas no se editan ni se borran.
- Toda corrección se realiza con una migración nueva e idempotente.
- No se cargan contenidos provisionales como si fueran finales.
- Cada migración se valida antes y después de ejecutarse.
- Las políticas RLS se revisan junto con cada tabla nueva.

## Producción de contenido

- El contenido debe ser completo, original, contextual y adecuado al CEFR.
- Cada actividad necesita objetivo, instrucciones, respuesta, retroalimentación, habilidad, dificultad y duración.
- Deben incluirse gramática, vocabulario, escucha, pronunciación, conversación, lectura, escritura, repaso y evaluación.
- El contenido para hispanohablantes debe anticipar errores de transferencia del español.
- Nada se publica sin revisión lingüística, pedagógica, CEFR y técnica.

## Estados de publicación

Todo contenido debe seguir este flujo:

```text
draft
→ linguistic_review
→ pedagogical_review
→ cefr_review
→ approved
→ published
```

## Calidad de software

- La arquitectura debe mantenerse modular y escalable.
- Frontend, backend, contenido, migraciones, IA y operaciones deben estar separados.
- No se hardcodea contenido educativo en componentes de interfaz.
- Los cambios se prueban localmente antes de desplegarse.
- Los secretos nunca se guardan en Git ni se comparten en el chat.
- Antes de cada cambio importante se revisan `PRODUCT_REQUIREMENTS.md`, `GOINGRID_DEVELOPMENT_PLAN.md`, `GOINGRID_CONTENT_MASTER_PLAN.md` y este archivo.

## Regla de continuidad

Si una sesión se interrumpe, el estado debe recuperarse leyendo estos documentos, revisando Git y verificando el estado real de Supabase. No se debe asumir que una tarea está terminada sin evidencia.
