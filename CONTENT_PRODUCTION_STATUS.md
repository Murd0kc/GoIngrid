# GoIngrid - Estado de produccion de contenido

Este archivo controla el avance real del contenido. Un tema solo se marca como terminado cuando tiene archivos completos, validacion automatica, revision linguistica, revision pedagogica, revision CEFR y preparacion para importacion.

## Estados permitidos

planned, writing, validated, linguistic_review, pedagogical_review, cefr_review, approved, imported

## Reglas

- No marcar un tema como terminado por tener solo el indice.
- No marcar una leccion como completa si faltan actividades o habilidades.
- No importar contenido en estado writing o validated.
- Registrar errores y correcciones antes de cambiar de estado.
- Mantener los codigos estables aunque cambie el texto.

## Resumen actual

| Nivel | Temas planificados | Temas con contenido | Validados | Importados |
|---|---:|---:|---:|---:|
| A1 | 30 | 1 | 1 | 0 |
| A2 | pendiente de catalogo | 0 | 0 | 0 |
| B1 | pendiente de catalogo | 0 | 0 | 0 |
| B2 | pendiente de catalogo | 0 | 0 | 0 |
| C1 | pendiente de catalogo | 0 | 0 | 0 |
| C2 | pendiente de catalogo | 0 | 0 | 0 |

## Definicion de terminado por tema

- 4 a 6 lecciones completas.
- 10 a 15 actividades por leccion.
- Escucha, pronunciacion, lectura, escritura y conversacion.
- Actividad de transferencia.
- Evaluacion de dominio.
- Repaso espaciado.
- Respuestas y retroalimentacion.
- Validacion JSON.
- Revision linguistica, pedagogica y CEFR.
- Archivo listo para importacion idempotente.
