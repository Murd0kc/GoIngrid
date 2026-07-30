# GoIngrid — Roadmap de desarrollo

## Objetivo actual

Transformar T01 y T02 en una experiencia dinámica, medible y pedagógicamente completa. Solo después se replicará el motor y el estándar en el resto de A1.

## Estado al 2026-07-30

| Área | Estado | Evidencia o pendiente |
|---|---|---|
| Infraestructura | Operativa | Docker, Caddy, Supabase y frontend desplegados. |
| Currículo A1 | Estructurado | 3 módulos y 30 temas. |
| Lote preliminar | Importado | 120 lecciones y 1.200 ejercicios; no aprobado pedagógicamente. |
| T01 | Vertical canónica en validación | Tema y 4 lecciones en `content/canonical`; validación estructural aprobada. Faltan revisiones lingüística, pedagógica, CEFR y prueba integral en producción. |
| T02 | Tema canónico parcial | Teoría canónica creada; falta validar despliegue y experiencia dinámica. |
| Motor de lección | Reconstrucción local | Arquitectura modular, recorrido por etapas, componentes variados y evaluación en servidor implementados; falta migrar y validar en producción. |
| Progreso | Parcial | Existen tablas y guardado básico; falta modelo de dominio y recomendaciones. |
| Voz | Pendiente | Grabación básica no equivale a evaluación de pronunciación. |
| IA contextual | Pendiente | Debe integrarse al objetivo de cada tema. |
| A1 final | Bloqueado | Requiere validar la vertical T01–T02. |

## Fase 0 — Consolidación

Estado: completada.

- Documentación unificada.
- Fuentes de verdad definidas.
- Material anterior marcado como preliminar o archivado.
- Prioridad centrada en experiencia dinámica.

## Fase 1 — Vertical dinámica T01–T02

### Entregables

- Inicio con “continuar”, meta diaria y recomendación.
- Vista de tema con teoría interactiva.
- Lección dividida en etapas.
- Barra de progreso.
- Componentes para selección, ordenamiento, asociación, texto abierto, escucha y pronunciación.
- Feedback específico y segundo intento.
- Pantalla de finalización con resultados y siguiente acción.
- Persistencia de sesión, intento y tiempo.

### Criterio de terminado

Un estudiante nuevo puede completar T01 y T02 sin instrucciones externas, entiende qué hacer en cada actividad, recibe feedback útil y puede continuar después de cerrar sesión.

## Fase 2 — Dominio y repaso adaptativo

### Entregables

- Dominio por habilidad y contenido.
- Cola de repaso espaciado.
- Repaso de errores.
- Recomendación diaria.
- Metas flexibles y rachas recuperables.
- Panel de progreso comprensible.

### Criterio de terminado

El sistema selecciona qué repasar según desempeño y puede explicar al estudiante por qué recomienda esa práctica.

## Fase 3 — Voz e IA

### Entregables

- Audio real asociado a contenido.
- Grabación y transcripción.
- Feedback de inteligibilidad.
- Lectura en voz alta.
- Conversaciones contextuales de T01 y T02.
- Corrección de una prioridad por turno.
- Registro de errores relevantes.

### Criterio de terminado

El estudiante completa una interacción oral relacionada con el tema y recibe una mejora concreta y verificable.

## Fase 4 — Reconstrucción completa de A1

Orden:

1. Finalizar y validar M1.
2. Revisar progresión acumulativa.
3. Reconstruir M2.
4. Reconstruir M3.
5. Ejecutar evaluación de nivel A1.

Cada tema pasa por creación canónica, validación estructural, revisión lingüística, revisión pedagógica, revisión CEFR, importación y prueba en la aplicación.

## Fase 5 — Administración y operación

- Flujo editorial.
- Versionado y publicación.
- Métricas pedagógicas.
- Backups automatizados.
- Observabilidad.
- Automatizaciones n8n.
- Entorno de staging.

## Fase 6 — Beta

- Usuarios de prueba hispanohablantes.
- Medición de activación, abandono y comprensión.
- Pruebas de retención.
- Entrevistas breves.
- Corrección de UX y contenido.
- Decisión informada antes de producir A2.

## Auditoría técnica del motor anterior

La auditoría del 2026-07-30 confirmó:

- `App.jsx` mezclaba autenticación, consultas, navegación, evaluación, grabación y progreso.
- todas las actividades se reducían a selección, texto abierto o grabación;
- las respuestas correctas llegaban al navegador;
- las respuestas abiertas se mostraban visualmente como correctas aunque estuvieran pendientes;
- la grabación se describía como guardada sin haberse subido;
- el tiempo de cada respuesta se calculaba desde el inicio de la lección;
- la última actividad cerraba la vista sin ejecutar correctamente la finalización;
- no existía un recorrido pedagógico por etapas ni resumen final.

Estos defectos son incompatibles con la especificación activa y no deben reaparecer.

## Próximo bloque de trabajo

1. Aplicar la migración `014_dynamic_lesson_engine.sql`.
2. Regenerar e importar `A1_CONTENT_SEED.sql` para publicar los contratos de actividad.
3. Desplegar el frontend modular.
4. Probar T01 de principio a fin en escritorio y móvil.
5. Corregir las inconsistencias pedagógicas detectadas en T01.
6. Aplicar y validar el mismo motor en T02.

## Política de prioridad

Se prioriza en este orden:

1. Comprensión del estudiante.
2. Calidad y transferencia.
3. Flujo funcional.
4. Seguridad y confiabilidad.
5. Retención saludable.
6. Escala de contenido.
7. Funciones decorativas.

## Actualización

Este documento se actualiza únicamente cuando una fase cambia de estado o aparece evidencia nueva. Los conteos deben provenir de archivos o consultas verificables.
