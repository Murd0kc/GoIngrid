# GoIngrid — Especificación maestra

## Propósito

GoIngrid es una plataforma para que personas hispanohablantes aprendan inglés desde cero hasta C2 mediante explicación clara, práctica activa, contexto real, pronunciación inteligible, conversación, lectura, escritura, repetición espaciada y personalización.

La prioridad actual es completar y validar A1. Los niveles posteriores permanecen planificados, pero no deben distraer del desarrollo y la validación de una experiencia A1 excelente.

Este documento es el punto de entrada obligatorio del proyecto. Define qué documentos están vigentes, cuál es la fuente de verdad y cómo resolver contradicciones.

## Documentos vigentes

Solo estos documentos establecen reglas activas:

| Documento | Responsabilidad |
|---|---|
| `GOINGRID_MASTER_SPECIFICATION.md` | Dirección, jerarquía, fuentes de verdad y estado general. |
| `GOINGRID_PRODUCT_REQUIREMENTS.md` | Producto, usuarios, funciones y resultados esperados. |
| `GOINGRID_ENGINEERING_STANDARD.md` | Arquitectura, datos, seguridad, calidad y operación. |
| `GOINGRID_LEARNING_AND_CONTENT_STANDARD.md` | Metodología, experiencia dinámica, contrato de contenido y calidad pedagógica. |
| `GOINGRID_DEVELOPMENT_ROADMAP.md` | Fases, prioridades, estado y próximos entregables. |
| `README.md` | Entrada rápida al repositorio. |

Los archivos dentro de `docs/archive/` son históricos. Conservan decisiones y auditorías anteriores, pero no tienen autoridad sobre los documentos vigentes.

## Orden de autoridad

Cuando dos instrucciones difieran, se aplica este orden:

1. Seguridad, privacidad, legislación y protección de datos.
2. Esta especificación maestra.
3. Requisitos del producto.
4. Estándar de ingeniería.
5. Estándar de aprendizaje y contenido.
6. Roadmap vigente.
7. Código, pruebas y estado real verificado de Supabase.

Una contradicción no se resuelve silenciosamente. Debe registrarse, decidirse y corregirse en el documento responsable.

## Fuentes de verdad

### Producto y arquitectura

- Producto: `GOINGRID_PRODUCT_REQUIREMENTS.md`.
- Arquitectura y operación: `GOINGRID_ENGINEERING_STANDARD.md`.
- Metodología y experiencia: `GOINGRID_LEARNING_AND_CONTENT_STANDARD.md`.
- Prioridades y estado: `GOINGRID_DEVELOPMENT_ROADMAP.md`.

### Contenido

- Estructura curricular — niveles, módulos, temas y orden: `content/curriculum/`.
- Contenido pedagógico aprobado o en reconstrucción oficial: `content/canonical/`.
- Esquema canónico: `content/canonical/lesson.schema.json` y los contratos definidos en el estándar de aprendizaje.
- SQL de `supabase/seeds/`: artefacto generado; nunca es la fuente donde se redacta contenido.
- Supabase: estado operativo de los datos publicados; no reemplaza los archivos canónicos.

### Material preliminar

Estas carpetas contienen inventarios, transformaciones o contenido anterior y no son fuentes pedagógicas:

- `content/lessons/`
- `content/lessons/A1/final/`
- `content/lessons/A1/parts/`
- `content/rebuild/`
- `content/normalized/`

Pueden servir para comparar, recuperar ideas o mantener compatibilidad temporal. Ningún texto se considera aprobado por encontrarse allí o por estar importado en Supabase.

## Flujo oficial de contenido

```text
currículo
→ especificación canónica del tema
→ lecciones canónicas
→ validación automática
→ revisión lingüística
→ revisión pedagógica
→ revisión CEFR
→ aprobación
→ generación de seed
→ importación
→ prueba en la aplicación
→ publicación
```

Estados oficiales:

```text
planned
→ writing
→ structurally_validated
→ linguistic_review
→ pedagogical_review
→ cefr_review
→ approved
→ imported
→ published
```

Importar datos no significa que estén pedagógicamente aprobados. Publicar una pantalla tampoco demuestra dominio del estudiante.

## Estado verificado del proyecto

Fecha de consolidación: 2026-07-30.

- Infraestructura Docker, Caddy, Supabase y frontend desplegada.
- Aplicación accesible en `goingrid.interflowx.com`.
- Catálogo A1: 3 módulos y 30 temas.
- Base de datos: 120 lecciones y 1.200 ejercicios del lote preliminar.
- T01 y T02 tienen especificaciones canónicas de tema.
- T01 tiene cuatro lecciones canónicas en estado `structurally_validated`, pendientes de revisión lingüística, pedagógica y CEFR.
- T01 muestra la referencia completa del alfabeto en la aplicación.
- El nuevo motor dinámico está implementado localmente y pendiente de migración, despliegue y prueba integral en producción.
- El lote preliminar de 120 lecciones no está aprobado como contenido final.
- Ningún nivel A1 se considera terminado hasta validar contenido, experiencia, retención y transferencia.

## Decisión de producto vigente

Antes de producir en masa el resto de A1, se construirá una experiencia vertical completa con T01 y T02:

- inicio personalizado;
- lección por etapas;
- actividades variadas;
- feedback útil;
- persistencia de intentos;
- progreso y finalización;
- repaso adaptativo;
- voz y conversación contextual, cuando el motor correspondiente esté disponible.

La calidad de esa experiencia se valida antes de replicarla en los otros 28 temas.

## Regla de continuidad

Para comenzar una sesión:

1. Leer este documento.
2. Leer solo el documento especializado relacionado con el cambio.
3. Revisar `git status`.
4. Verificar archivos y estado real de Supabase cuando corresponda.
5. Declarar la fuente de verdad que se modificará.
6. Implementar, validar y actualizar el roadmap si cambió el estado.

No es necesario leer los documentos archivados salvo que se investigue una decisión histórica.

## Criterio general de terminado

Una función o contenido no está terminado solo porque compila, aparece en pantalla o tiene registros en la base de datos. Debe cumplir su criterio técnico, pedagógico y de experiencia, y contar con evidencia verificable.
