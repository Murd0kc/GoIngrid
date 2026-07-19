# GoIngrid - Checklist de inicio

## Regla principal

GoIngrid es independiente de English Coach. No se reutilizaran tablas, variables, contenedores, volumenes, claves ni dominios entre ambos proyectos.

## Documentacion

- Leer `README.md`.
- Leer `PRODUCT_REQUIREMENTS.md`.
- Leer `GOINGRID_DEVELOPMENT_PLAN.md`.
- Leer `GOINGRID_CONTENT_MASTER_PLAN.md`.
- Leer `GOINGRID_ENGINEERING_RULES.md`.
- Confirmar que `content/curriculum/` es la fuente unica de verdad.

## Repositorio

- Trabajar desde `E:\GoIngrid`.
- Mantener cambios en Git.
- Usar ramas por bloque funcional.
- No subir secretos, `.env` ni datos de usuarios.

## Infraestructura

- DNS de `goingrid.interflowx.com` apuntando a `45.58.127.91`.
- Carpetas independientes en `/opt/goingrid/`.
- Red Docker propia y nombres de servicio unicos.
- Caddy configurado sin romper rutas existentes.
- Supabase independiente.

## Datos y contenido

- Crear migraciones y RLS.
- Crear el catalogo curricular A1-C2.
- Validar duplicados, faltantes, referencias, respuestas y duracion.
- Producir contenido completo antes de publicarlo.
- Importar mediante un proceso idempotente.
- Mantener estados de revision y versionado.

## Aplicacion base

- React + Vite modular.
- Cliente Supabase.
- Variables `.env.example` y `.gitignore`.
- `npm run lint` y `npm run build` funcionando.

## MVP del estudiante

- Registro e inicio de sesion.
- Diagnostico inicial.
- Perfil por habilidades.
- Ruta personalizada.
- Lecciones dinamicas.
- Ejercicios interactivos.
- Progreso, errores y tiempo.
- Repaso inteligente.
- Objetivos flexibles.

## IA y pronunciacion

- Edge Functions seguras.
- Conversacion bilingue contextual.
- Correccion de escritura y habla.
- Audio, transcripcion y evaluacion de inteligibilidad.

## Administracion y operaciones

- Panel administrativo.
- Versionado y aprobacion de contenido.
- Analitica pedagogica.
- Workflows n8n, recordatorios, backups y observabilidad.

## Lanzamiento

- Pruebas locales.
- Pruebas de autenticacion y RLS.
- Staging.
- Backup.
- Validacion de `goingrid.interflowx.com`.
- Beta controlada.

## Criterio para avanzar

No se comienza una fase si la anterior no tiene documentacion, pruebas y criterios de aceptacion claros.
