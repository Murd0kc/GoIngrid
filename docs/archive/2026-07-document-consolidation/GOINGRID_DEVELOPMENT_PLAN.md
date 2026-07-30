# GoIngrid - Plan de desarrollo

## Objetivo

Construir una plataforma para aprender ingles desde A1 hasta C2 mediante practica activa, contenido contextual, conversacion, pronunciacion, repeticion espaciada y progreso medible.

## Fases

1. Documentacion, requisitos y reglas permanentes.
2. DNS, carpetas, redes y aislamiento del servidor.
3. Repositorio y estructura modular.
4. Esquema Supabase, migraciones y RLS.
5. Catalogo curricular como fuente unica de verdad.
6. Validadores de estructura, contenido, respuestas y consistencia.
7. Produccion final de contenido A1-C2.
8. Importador validado hacia Supabase.
9. Frontend del estudiante y consumo del contenido desde la base de datos.
10. Diagnostico, perfil, progreso, tiempo, errores y recomendaciones.
11. Repaso espaciado, conversaciones IA, escritura y pronunciacion.
12. Panel administrativo, analitica, n8n, backups y observabilidad.
13. Pruebas, staging, beta y produccion.

Cada fase necesita entregables, pruebas y criterios de aceptacion antes de avanzar.

## Regla de contenido

El contenido definitivo se crea y valida primero en `content/`. No se hardcodea en React ni se crea mediante SQL manual aislado. Despues se importa a Supabase con un proceso idempotente que detecta faltantes, duplicados y referencias invalidas.

La checklist operativa esta en `GOINGRID_STARTUP_CHECKLIST.md`.
