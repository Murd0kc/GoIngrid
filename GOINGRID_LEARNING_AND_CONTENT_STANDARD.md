# GoIngrid — Estándar de aprendizaje y contenido

## Propósito

Este documento es la única autoridad para metodología, experiencia dinámica, producción de contenido, actividades, evaluación y calidad pedagógica.

Incorpora y reemplaza el contenido vigente de:

- `GOINGRID_CONTENT_MASTER_PLAN.md`;
- `GOINGRID_LEARNING_EXPERIENCE_RULES.md`;
- `GOINGRID_DYNAMIC_LEARNING_EXPERIENCE_PLAN.md`;
- `GOINGRID_PEDAGOGICAL_DEPTH_STANDARD.md`;
- `content/LESSON_BLUEPRINT.md`;
- `content/LESSON_CONTENT_CONTRACT.md`;
- `content/QUALITY_RUBRIC.md`.

## Principio rector

Cada pantalla y actividad debe ayudar al estudiante a entender, practicar, recordar o usar el inglés. Si solo muestra información, debe existir una razón pedagógica clara o transformarse en una interacción.

Completar actividades, mantener una racha o acumular puntos no equivale a dominar el idioma.

## Enfoque pedagógico

GoIngrid debe:

- priorizar comunicación y significado;
- presentar contexto antes de formalizar una regla;
- explicar en español cuando reduzca confusión;
- reutilizar el inglés aprendido en contextos nuevos;
- combinar recuperación activa, repetición espaciada, intercalado y práctica distribuida;
- retirar apoyos gradualmente;
- integrar comprensión, producción, interacción y mediación;
- anticipar transferencia negativa del español;
- medir retención y transferencia, no solo aciertos inmediatos;
- mantener carga cognitiva adecuada al nivel.

## Alineación CEFR

Los niveles A1–C2 siguen el Marco Común Europeo como referencia de desempeño. Cada objetivo debe describir lo que el estudiante puede hacer, no únicamente la regla que conoce.

Las habilidades se registran por separado:

- comprensión auditiva;
- comprensión lectora;
- producción oral;
- producción escrita;
- interacción;
- mediación cuando corresponda;
- pronunciación inteligible;
- vocabulario y control lingüístico al servicio de la comunicación.

La prioridad de producción actual es A1.

## Fuente canónica

- El catálogo curricular vive en `content/curriculum/`.
- Los temas y lecciones aprobables viven en `content/canonical/`.
- Los archivos de otras carpetas son preliminares o derivados.
- Supabase recibe contenido generado desde la fuente canónica.

Un tema no debe declararse canónico si solo contiene un índice o una explicación general.

## Contrato obligatorio de un tema

Cada tema debe definir:

- ID estable, nivel, módulo y orden;
- nombre y alcance conceptual;
- objetivo comunicativo observable;
- resultados de aprendizaje;
- situaciones reales;
- teoría suficiente y progresiva;
- ejemplos y contraejemplos;
- lenguaje funcional;
- vocabulario y colocaciones;
- pronunciación;
- errores previsibles de hispanohablantes;
- secuencia de lecciones;
- tareas de escucha, lectura, escritura y conversación;
- repaso;
- evaluación y criterio de dominio;
- dependencias y reciclaje de contenido anterior.

La profundidad debe cubrir el concepto completo. Por ejemplo, un tema sobre el alfabeto incluye las 26 letras, nombres, pronunciación, reconocimiento, producción, deletreo y uso comunicativo.

## Contrato obligatorio de una lección

### Identidad

- `id`;
- nivel, módulo y tema;
- título;
- duración estimada;
- objetivo comunicativo;
- objetivos CEFR;
- prerrequisitos.

### Enseñanza

- contexto;
- activación;
- explicación en español;
- lenguaje clave;
- ejemplos;
- contraejemplos cuando sean útiles;
- notas para hispanohablantes;
- vocabulario;
- pronunciación.

### Actividades

Cada actividad debe incluir:

- ID estable;
- tipo;
- habilidad;
- etapa pedagógica;
- instrucción clara;
- estímulo o `prompt`;
- dificultad;
- duración estimada;
- error objetivo;
- respuesta correcta, respuestas aceptadas o rúbrica;
- feedback correcto;
- feedback incorrecto;
- pista;
- datos o recursos requeridos.

### Evaluación

- calendario de repaso;
- criterios de dominio;
- evaluación;
- tarea de transferencia;
- requisitos de finalización.

Las respuestas abiertas no se marcan automáticamente como correctas. Necesitan rúbrica, evaluación válida o estado pendiente.

## Secuencia dinámica de un tema

Cada tema sigue este flujo:

1. Activación mediante pregunta, imagen, audio o reto.
2. Presentación contextual.
3. Explicación visual y clara.
4. Ejemplos y contraste.
5. Escucha y reconocimiento.
6. Práctica guiada.
7. Recuperación con menos apoyo.
8. Producción personal.
9. Conversación contextual.
10. Repaso de errores.
11. Reto de transferencia.
12. Resumen y recomendación siguiente.

La interfaz revela las etapas progresivamente. No presenta toda la teoría, ejercicios y resultados en una sola pantalla saturada.

## Secuencia dinámica de una lección

Una lección utiliza las etapas pertinentes:

1. Activación.
2. Input comprensible.
3. Comprensión global y específica.
4. Identificación del patrón o sonido.
5. Explicación.
6. Práctica controlada.
7. Recuperación.
8. Pronunciación.
9. Producción guiada.
10. Conversación.
11. Transferencia.
12. Repaso.

No todas las etapas requieren el mismo número de actividades, pero comprensión, producción y transferencia no pueden faltar en una lección final de tema.

## Progresión de dificultad

Todo aprendizaje debe avanzar:

```text
reconocer
→ comprender en contexto
→ producir con apoyo
→ producir sin apoyo
→ transferir a una situación nueva
→ recuperar después de un intervalo
```

La aplicación no debe declarar dominio basándose únicamente en selección múltiple.

## Variedad de actividades

Se combinan según el objetivo:

- selección contextual;
- asociación de palabra, imagen, audio y significado;
- ordenar palabras o turnos;
- completar con significado;
- clasificar;
- detectar y corregir errores;
- discriminación auditiva;
- dictado graduado;
- escucha global, específica e inferencial;
- repetición y shadowing;
- grabación;
- lectura en voz alta;
- respuesta escrita;
- diálogos ramificados;
- conversación con IA;
- simulaciones;
- mini-historias;
- tareas integradas;
- tarjetas de recuperación;
- evaluaciones acumulativas.

No se presentan secuencias largas con la misma plantilla. La variedad debe servir al objetivo; no es decoración.

## Cantidad y duración

No existe un número rígido que garantice aprendizaje.

Como rango de planificación:

- un tema suele requerir 4–8 lecciones;
- una lección suele contener 8–16 interacciones significativas;
- la duración recomendada de una sesión principal es 10–15 minutos;
- algunas tareas orales, lecturas, evaluaciones o conversaciones pueden durar más.

Estos rangos pueden modificarse si la cobertura, la carga cognitiva y la evidencia de dominio lo justifican. No se añaden preguntas triviales para aumentar conteos.

Las 4 lecciones y 10 actividades actuales por tema son una estructura preliminar, no una definición automática de terminado.

## Teoría y explicación

La teoría debe:

- ser correcta y suficiente;
- dividirse en segmentos;
- usar lenguaje claro en español;
- incluir ejemplos naturales en inglés;
- mostrar cómo funciona en una situación;
- comparar con el español cuando sea útil;
- señalar límites y excepciones necesarias para el nivel;
- evitar simplificaciones que generen una regla falsa.

Después de explicar, el estudiante debe hacer algo con la información.

## Vocabulario

El vocabulario se aprende mediante:

- imagen o contexto;
- significado;
- audio;
- pronunciación;
- ejemplo;
- recuperación;
- uso personal;
- reciclaje posterior.

Las lecturas y conversaciones reutilizan vocabulario anterior. El estudiante puede marcar palabras conocidas y consultar significado contextual.

## Escucha

Una actividad de escucha debe diferenciar:

- archivo o recurso de audio;
- voz y variante;
- velocidad;
- transcripción;
- texto de respaldo;
- objetivo;
- preguntas;
- feedback.

Mostrar un texto como si fuera audio es motivo de rechazo. Se utilizan voces y velocidades variadas de manera gradual.

## Pronunciación

Cada objetivo fonético debe incluir:

- modelo escrito y audio;
- IPA cuando ayude;
- explicación comprensible de boca o lengua;
- contraste con el español;
- pares mínimos cuando sean útiles;
- palabra, frase y uso contextual;
- grabación;
- feedback accionable.

La evaluación distingue:

- reconocimiento;
- sustituciones y omisiones;
- sonidos objetivo;
- acento de palabra;
- ritmo;
- entonación;
- pausas;
- claridad global.

Se prioriza inteligibilidad. No se castiga un acento extranjero comprensible ni se presenta una puntuación binaria como diagnóstico completo.

## Lectura interactiva

Cada tema debe incluir diálogos, mensajes, perfiles, escenas o mini-historias apropiadas al nivel.

Al seleccionar una palabra, el estudiante puede consultar:

- significado contextual;
- pronunciación;
- ejemplo;
- categoría;
- estado “conocida” o “para repasar”.

La lectura incluye propósito, comprensión global, información específica y una respuesta personal, resumen o tarea de mediación según el nivel.

## Escritura

La producción escrita avanza:

```text
modelo
→ completar
→ reconstruir
→ escribir con guía
→ escribir una respuesta propia
→ revisar y reformular
```

La evaluación acepta variantes válidas y usa criterios de significado, claridad y forma relevante.

## Conversación con IA

Cada escenario define:

- rol;
- contexto;
- objetivo;
- apertura;
- vocabulario y estructuras esperadas;
- dificultad;
- ayudas permitidas;
- errores objetivo;
- preguntas de seguimiento;
- criterios de éxito;
- condición de cierre.

La IA:

- habla principalmente en inglés;
- usa español como apoyo graduado;
- acepta múltiples respuestas válidas;
- explica sin resolver automáticamente;
- corrige una prioridad importante por turno;
- solicita reformulación;
- reutiliza errores posteriormente;
- permanece vinculada al currículo;
- no inventa puntuaciones ni hechos.

## Feedback

Ante un error, el sistema debe indicar:

- qué entendió de la respuesta;
- cuál es la forma o intención esperada;
- por qué;
- error típico relevante;
- ejemplo adicional;
- pista o nueva oportunidad.

El feedback debe ser breve durante el flujo y ampliable. “Correcto” o “incorrecto” sin explicación no es suficiente.

## Repaso adaptativo

El sistema registra:

- error;
- habilidad;
- dificultad;
- tiempo;
- intentos;
- pistas;
- confianza;
- último repaso;
- dominio estimado.

Genera:

- repaso inmediato de errores;
- repaso diario;
- repetición espaciada;
- repaso semanal;
- repaso acumulativo;
- recuperación de contenido olvidado.

El calendario inicial puede usar 1, 3, 7, 14 y 30 días, ajustado por desempeño.

## Evaluación auténtica

Cada tema debe incluir:

- comprobaciones durante la lección;
- prueba breve de comprensión;
- producción escrita u oral;
- tarea integrada;
- situación nueva;
- evaluación de retención posterior.

El dominio considera precisión, comprensión, producción, pronunciación, fluidez apropiada al nivel, retención y transferencia.

## Experiencia de inicio

La pantalla principal debe mostrar:

- continuación de la última lección;
- meta diaria;
- racha;
- progreso;
- habilidades que necesitan repaso;
- una recomendación principal.

Siempre debe existir una acción clara para comenzar.

## Motivación saludable

Se pueden usar:

- puntos por práctica significativa;
- bonificación por corregir un error;
- rachas recuperables;
- misiones semanales;
- insignias por dominio;
- desafíos opcionales;
- mensajes de avance específicos.

No se usan:

- culpa;
- miedo a perder progreso;
- presión excesiva;
- recompensas aleatorias manipulativas;
- rankings obligatorios;
- velocidad como sustituto de comprensión.

El objetivo es constancia voluntaria, no dependencia.

## Personalización

La adaptación puede modificar:

- dificultad;
- cantidad de apoyo;
- idioma de explicación;
- ritmo;
- selección de repaso;
- ejemplos;
- tipo de práctica;
- siguiente recomendación.

No debe ocultar objetivos esenciales ni aprobar contenido que no se ha demostrado.

## Rúbrica de calidad

Cada criterio se califica de 0 a 2:

| Criterio | Exigencia máxima |
|---|---|
| Objetivo | Observable y demostrable |
| Progresión | Comprensión, práctica, producción y transferencia |
| Naturalidad | Inglés actual y útil |
| Nivel | Carga cognitiva apropiada |
| Hispanohablantes | Errores anticipados y practicados |
| Escucha | Audio, propósito y comprensión |
| Pronunciación | Modelo, práctica y feedback |
| Conversación | Turnos, variación y seguimiento |
| Feedback | Específico y accionable |
| Transferencia | Situación nueva y relevante |

Una lección requiere al menos 18/20 y ningún criterio puede obtener 0.

## Rechazo automático

Se rechaza contenido si:

- todas las actividades usan la misma plantilla;
- falta teoría esencial;
- una respuesta depende de una frase arbitraria;
- existen respuestas ambiguas no previstas;
- se presenta texto como audio;
- se califica pronunciación como binaria;
- una respuesta abierta se marca siempre correcta;
- faltan criterios de producción;
- hay caracteres corruptos;
- las instrucciones no indican qué hacer;
- el contenido no corresponde al nivel;
- no existe transferencia.

## Originalidad y licencias

Los textos, diálogos, ejercicios y audios deben ser originales, de dominio público o contar con licencia documentada. No se copian contenidos de EWA, Duolingo, Babbel, libros o cursos protegidos.

Las aplicaciones externas sirven como referencia de producto, no como fuente para copiar materiales.

## Puerta de publicación

Antes de publicar:

1. Validar JSON y referencias.
2. Validar respuestas y distractores.
3. Revisar inglés y español.
4. Revisar CEFR.
5. Revisar errores para hispanohablantes.
6. Confirmar habilidades y transferencia.
7. Confirmar recursos reales.
8. Ejecutar la rúbrica.
9. Importar de forma idempotente.
10. Probar la experiencia completa.

## Criterio de terminado

Una función, lección o tema no está terminado si solo muestra información o permite completar ejercicios. Debe demostrar explicación, práctica, feedback, recuerdo, uso real y una siguiente acción comprensible.
