# GoIngrid — Estándar de ingeniería

## Principios

- Separar interfaz, dominio, datos, contenido, IA y operaciones.
- Mantener una sola fuente de verdad por responsabilidad.
- Diseñar cambios idempotentes y verificables.
- Proteger secretos y datos personales.
- Evitar archivos monolíticos y lógica duplicada.
- No declarar terminado un cambio sin pruebas proporcionales a su riesgo.

## Arquitectura vigente

- Frontend: React y Vite.
- Cliente de datos: Supabase JavaScript.
- Backend: Supabase autohospedado.
- Base de datos: PostgreSQL.
- Autenticación, Storage, Realtime y Edge Functions: Supabase.
- Proxy y TLS: Caddy.
- Contenedores: Docker Compose.
- Automatización: n8n, compartible con otros proyectos mediante credenciales, flujos y redes aislados.
- Servidor: Ubuntu.

GoIngrid debe permanecer aislado de English Coach y de futuros proyectos mediante carpetas, variables, bases de datos, volúmenes, redes y nombres de servicio propios.

## Límites de responsabilidad

### Frontend

- Renderiza estados y captura interacción.
- No contiene contenido educativo definitivo.
- No almacena claves privadas.
- No decide dominio pedagógico sin reglas del backend.
- Se organiza por funciones o dominios, no en un único componente.

### Supabase

- Conserva usuarios, currículo publicado, intentos, progreso y configuraciones.
- Aplica RLS.
- Ejecuta operaciones sensibles mediante funciones seguras.
- Mantiene referencias y restricciones de integridad.

### Contenido

- Se redacta y revisa en `content/canonical/`.
- Se valida antes de generar SQL.
- Los seeds son artefactos derivados.
- El código estable de cada entidad no cambia por ajustes de texto.

### Inteligencia artificial

- Se invoca desde servidor o Edge Function.
- Nunca expone claves en el navegador.
- Recibe contexto mínimo necesario.
- Devuelve respuestas estructuradas y validables.
- No sustituye reglas deterministas de progreso, permisos o integridad.

## Modelo y migraciones

- Las migraciones aplicadas son inmutables.
- Toda corrección usa una migración nueva.
- Cada migración debe ser idempotente cuando sea posible.
- Antes de ejecutar se verifican tablas, columnas, restricciones, registros y dependencias reales.
- Cada tabla nueva incluye decisión explícita de RLS.
- Las operaciones destructivas requieren backup, alcance exacto y plan de reversión.
- Las claves técnicas y nombres de variables PL/pgSQL deben evitar colisiones con columnas.
- Los campos JSON deben validarse antes de insertarse.

## Canal de contenido

```text
content/curriculum
→ content/canonical
→ validadores
→ generadores
→ supabase/seeds
→ preflight
→ Supabase
→ prueba funcional
```

Un generador debe:

- fallar ante datos inválidos;
- producir resultados deterministas;
- registrar cantidades;
- detectar IDs duplicados y referencias faltantes;
- conservar caracteres UTF-8;
- no sobrescribir contenido canónico.

## Frontend

Cada función debe cubrir:

- carga;
- vacío;
- éxito;
- error;
- permisos;
- recarga;
- persistencia;
- accesibilidad;
- dispositivos móviles;
- ausencia de datos opcionales.

Las actividades se implementan con componentes separados por tipo. El motor de lección coordina la secuencia, pero la evaluación, el progreso y la presentación no deben quedar mezclados en un componente monolítico.

### Contrato del motor de lección

La implementación se separa por responsabilidad:

- `features/auth`: sesión y acceso.
- `features/curriculum`: módulos, temas, introducción y selección de lecciones.
- `features/lesson-player`: recorrido, estados, componentes de actividad y finalización.
- `features/lesson-player/domain`: reglas puras de secuencia, progreso y puntuación.
- `lessonRepository`: único acceso del reproductor a Supabase.

El navegador recibe solamente instrucciones, estímulos, opciones públicas y contenido pedagógico. Las respuestas correctas y la propiedad `is_correct` no forman parte del contrato público. La evaluación determinista se ejecuta en PostgreSQL mediante una función autenticada; las respuestas abiertas conservan estado pendiente hasta contar con una rúbrica o evaluador real.

Una lección se representa como un recorrido de estados explícitos:

```text
orientación
→ activación
→ explicación
→ ejemplos
→ vocabulario y forma
→ escucha
→ pronunciación
→ lectura o escritura
→ interacción
→ transferencia
→ recuperación
→ resultado
```

Cada paso guarda su identidad, etapa pedagógica y estado. El tiempo de respuesta se mide por actividad, el progreso final se guarda antes de abandonar el reproductor y una respuesta pendiente nunca se presenta como correcta.

## Seguridad

- Secretos únicamente en variables del servidor.
- `.env` y backups sensibles fuera de Git.
- RLS probada con usuario autorizado, usuario distinto y sesión anónima.
- Claves de servicio nunca llegan al frontend.
- Datos de voz y conversaciones tienen política de retención explícita.
- Logs no deben incluir contraseñas, tokens ni contenido sensible completo.
- Dependencias y contenedores se actualizan de forma controlada.

## Puertas de calidad

### Antes de programar

- Confirmar requisito y criterio de aceptación.
- Identificar fuente de verdad.
- Revisar impacto en datos, permisos y contenido.

### Antes de cambiar datos

- Consultar el esquema real.
- Contar registros relevantes.
- Detectar conflictos y duplicados.
- Crear backup si existe riesgo material.
- Validar SQL sin aplicar cuando sea posible.

### Antes de desplegar

- `git status` revisado.
- Validaciones de contenido exitosas.
- lint, build y pruebas exitosas.
- Variables y redes verificadas.
- Migraciones y seeds identificados.
- Plan de reversión disponible.

### Después de desplegar

- Contenedores saludables.
- Rutas HTTPS respondiendo.
- API probada.
- Flujo principal probado con usuario real de prueba.
- Errores del navegador y logs revisados.
- Estado del roadmap actualizado.

## Git

- Cambios pequeños y coherentes.
- Mensajes de commit descriptivos.
- No mezclar correcciones no relacionadas.
- No subir archivos generados localmente salvo que el repositorio los use para despliegue.
- No modificar trabajo ajeno sin comprobar el estado.

## Operación

- Backups de PostgreSQL y volúmenes con prueba periódica de restauración.
- Caddy es el único servicio público en 80/443.
- Base de datos y servicios internos no publican puertos innecesarios.
- n8n puede servir a otros proyectos, pero cada flujo usa credenciales, etiquetas y variables aisladas.
- La observabilidad debe cubrir disponibilidad, errores, latencia, fallos de importación y eventos pedagógicos esenciales.

## Regla de comunicación técnica

Toda instrucción operativa debe indicar:

- directorio;
- comando;
- si consulta o modifica;
- resultado esperado;
- validación posterior;
- reversión cuando aplique.

No se encadenan cambios dependientes cuando el resultado de un paso puede modificar el siguiente.
