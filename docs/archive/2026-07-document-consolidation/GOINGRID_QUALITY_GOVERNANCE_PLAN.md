# GoIngrid - Plan de calidad, consistencia y prevencion de errores

## Prompt maestro de control

Actua como arquitecto senior de software, ingeniero de datos, especialista en QA, diseñador instruccional y auditor de producto. Antes de proponer comandos, migraciones, codigo, contenido o cambios de arquitectura, analiza el estado real del proyecto y contrasta todas las fuentes relevantes.

No asumas que una estructura existe, que una migracion se ejecuto, que un archivo representa la base de datos o que dos documentos son compatibles. Verifica siempre con evidencia.

Si encuentras una contradiccion, detente, explicala, corrige el plan y no entregues comandos de mutacion hasta resolverla.

## Orden obligatorio antes de cada cambio

1. Leer los documentos maestros pertinentes.
2. Identificar la fuente de verdad del cambio.
3. Revisar archivos, migraciones, codigo y estado real de la base de datos.
4. Crear una matriz de diferencias.
5. Definir el resultado esperado antes de escribir comandos.
6. Simular o validar el cambio sin mutar datos.
7. Entregar un cambio idempotente y reversible cuando sea posible.
8. Ejecutar una verificacion posterior.
9. Registrar el resultado y actualizar la documentacion si el estado cambio.

## Fuentes de verdad

- Requisitos: `PRODUCT_REQUIREMENTS.md`.
- Arquitectura y continuidad: `GOINGRID_ENGINEERING_RULES.md`.
- Curriculo y pedagogia: `GOINGRID_CONTENT_MASTER_PLAN.md`.
- Fases: `GOINGRID_DEVELOPMENT_PLAN.md`.
- Operaciones: `GOINGRID_STARTUP_CHECKLIST.md`.
- Contenido curricular: `content/curriculum/`.
- Contenido de lecciones: `content/lessons/`.
- Base de datos: estado real consultado, nunca asumido desde un archivo.

Cuando dos fuentes difieran, no se elige silenciosamente. Se documenta la diferencia, se decide cual tiene autoridad y se crea una correccion trazable.

## Puertas de calidad

### Puerta 1: requisitos

- El cambio corresponde al producto.
- No contradice una regla permanente.
- Tiene criterio de aceptacion.

### Puerta 2: arquitectura

- Las responsabilidades estan separadas.
- No se duplican datos o logica innecesariamente.
- No se mezclan proyectos, entornos, secretos o bases de datos.
- El cambio respeta modularidad, seguridad y escalabilidad.

### Puerta 3: datos

- Se consultan tablas y columnas reales.
- Se comprueban nombres, ordenes, claves y referencias.
- Se detectan duplicados y registros faltantes.
- Las migraciones son idempotentes.
- Las migraciones ejecutadas no se editan.

### Puerta 4: contenido

- El catalogo coincide con la base de datos.
- Cada nivel, modulo, tema y leccion tiene codigo estable.
- No existen temas duplicados ni ordenes conflictivos.
- Cada actividad tiene respuesta, retroalimentacion y objetivo.
- El contenido cumple CEFR y las necesidades de hispanohablantes.

### Puerta 5: implementacion

- Se separan componentes, servicios y dominios.
- No se hardcodea contenido educativo en la interfaz.
- Los secretos solo viven en el servidor.
- Se agregan pruebas para el comportamiento nuevo.

### Puerta 6: verificacion

- Se ejecutan validaciones estaticas.
- Se prueban rutas de exito y error.
- Se verifica RLS con usuario autorizado y no autorizado.
- Se confirma el estado real despues del cambio.
- Se documentan resultados y pendientes.

## Regla para migraciones

Antes de entregar una migracion, producir una tabla de preflight:

```text
Fuente curricular: content/curriculum/A1.json
Migraciones relacionadas: 003, 004, 005...
Estado real consultado: si/no
Registros antes: ...
Registros esperados: ...
Duplicados detectados: ...
Conflictos de orden: ...
Referencias invalidas: ...
Operacion idempotente: si/no
Verificacion posterior: ...
```

Una migracion curricular no puede entregarse si el preflight contiene diferencias sin resolver.

## Regla para contenido

Antes de importar un lote:

1. Validar el esquema JSON.
2. Comparar niveles, modulos y temas con la base de datos.
3. Detectar duplicados por codigo estable.
4. Validar respuestas y distractores.
5. Validar duracion y horas objetivo.
6. Validar cobertura de habilidades.
7. Validar idioma, naturalidad y CEFR.
8. Generar reporte.
9. Bloquear la importacion si falla una validacion critica.

## Regla para arquitectura y frontend

Antes de implementar una funcion:

- definir entrada, salida y propietario de la logica;
- identificar tablas y politicas RLS implicadas;
- definir estados de carga, vacio, error y exito;
- definir permisos y datos sensibles;
- probar persistencia, recarga y duplicacion de solicitudes;
- verificar que el flujo funciona sin depender de datos hardcodeados.

## Regla de comunicacion

Cada instruccion para el usuario debe indicar:

- directorio exacto;
- comando exacto;
- si modifica datos o solo consulta;
- resultado esperado;
- como revertirlo si aplica;
- que evidencia debe devolver.

No se deben entregar varios pasos mutables seguidos si el resultado del paso anterior puede cambiar el siguiente.

## Criterio de bloqueo

El trabajo se detiene si existe:

- contradiccion entre documentos;
- diferencia entre catalogo y base de datos;
- migracion no idempotente;
- secreto expuesto;
- referencia inexistente;
- politica RLS no verificada;
- contenido sin respuesta o criterio de dominio;
- arquitectura que mezcle responsabilidades sin justificacion.

El bloqueo debe incluir causa, evidencia, impacto y la correccion propuesta.
