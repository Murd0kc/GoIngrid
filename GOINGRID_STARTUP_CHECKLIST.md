# GoIngrid — Checklist de inicio

## Regla principal

GoIngrid es independiente de English Coach. No se reutilizarán tablas, `.env`, contenedores, volúmenes, claves ni dominios entre ambos proyectos.

## Orden de inicio

### 1. Documentación

- Leer `README.md`.
- Leer `GOINGRID_DEVELOPMENT_PLAN.md`.
- Leer `PRODUCT_REQUIREMENTS.md`.
- Confirmar el alcance del MVP.
- Confirmar la primera unidad curricular que se producirá.

### 2. Repositorio local

- Trabajar desde `E:\GoIngrid`.
- Mantener cambios en Git.
- Usar ramas para cada bloque funcional.
- No subir secretos, `.env` ni datos de usuarios.

### 3. Infraestructura

- Crear el subdominio `goingrid.interflowx.com` en Cloudflare apuntando a `45.58.127.91`.
- Crear carpetas independientes en `/opt/goingrid/`.
- Crear una red Docker propia o nombres de servicio únicos.
- Configurar Caddy sin modificar las rutas existentes.
- Reservar un proyecto/base de datos Supabase independiente.

### 4. Aplicación base

- Crear frontend React + Vite.
- Añadir configuración de ESLint.
- Añadir cliente Supabase.
- Crear estructura modular por dominios.
- Crear variables `.env.example` y `.gitignore`.
- Validar `npm run lint` y `npm run build`.

### 5. Datos y contenido

- Crear migraciones Supabase.
- Crear niveles A1–C2 y habilidades.
- Crear unidades, temas, lecciones y bloques.
- Crear ejercicios, opciones, correcciones y evaluaciones.
- Aplicar RLS antes de conectar usuarios reales.

### 6. MVP del estudiante

- Registro e inicio de sesión.
- Diagnóstico inicial.
- Perfil por habilidades.
- Ruta personalizada.
- Lección dinámica.
- Ejercicios interactivos.
- Progreso y tiempo de estudio.
- Repaso inteligente.
- Objetivo semanal.

### 7. IA y pronunciación

- Crear Edge Functions seguras.
- Integrar conversación bilingüe.
- Añadir corrección contextual.
- Añadir práctica de escritura.
- Añadir audio y transcripción.
- Medir inteligibilidad y evolución, no solo una puntuación.

### 8. Administración y automatizaciones

- Crear panel administrativo.
- Gestionar contenido y versiones.
- Consultar analítica pedagógica.
- Importar workflows de n8n.
- Configurar recordatorios y resúmenes.

### 9. Validación y lanzamiento

- Ejecutar pruebas locales.
- Probar autenticación y RLS.
- Probar flujos de aprendizaje.
- Crear backup de Supabase.
- Desplegar staging.
- Validar `goingrid.interflowx.com`.
- Invitar usuarios beta.

## Criterio para avanzar

No se comienza una fase si la anterior no tiene documentación, pruebas y criterios de aceptación claros.
