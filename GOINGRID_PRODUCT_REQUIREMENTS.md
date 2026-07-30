# GoIngrid — Requisitos del producto

## Visión

GoIngrid ayudará a personas hispanohablantes a comprender, recordar y usar inglés real. La aplicación debe reducir la traducción literal y desarrollar progresivamente comprensión, vocabulario, gramática, pronunciación, lectura, escritura y conversación.

## Usuario principal

Adulto o joven hispanohablante que:

- puede comenzar desde cero o incorporarse desde otro nivel;
- necesita explicaciones claras en español;
- dispone de sesiones cortas durante la semana;
- se desmotiva con ejercicios repetitivos;
- quiere comunicarse en viajes, estudio, trabajo y vida diaria;
- necesita saber por qué se equivocó y cómo mejorar.

## Propuesta de valor

GoIngrid combina:

- profundidad pedagógica;
- interacción dinámica;
- apoyo específico para hispanohablantes;
- práctica real de voz y conversación;
- adaptación por errores, tiempo y dominio;
- motivación saludable;
- contenido versionado y revisable.

La aplicación no debe limitarse a traducir, memorizar listas o responder selección múltiple.

## Alcance curricular

- Arquitectura preparada para A1, A2, B1, B2, C1 y C2.
- Prioridad de producción actual: A1.
- Ubicación inicial mediante diagnóstico general y por habilidad.
- Posibilidad de empezar desde cero sin realizar una prueba extensa.
- Rutas especiales futuras: viajes, trabajo, entrevistas y conversación.

## Capacidades del estudiante

### Inicio y ruta

- Crear cuenta e iniciar sesión.
- Elegir objetivo, disponibilidad y preferencia de aprendizaje.
- Realizar diagnóstico o comenzar desde A1.
- Continuar desde el último punto.
- Ver progreso, dominio, tiempo y recomendaciones.

### Aprendizaje

- Recibir teoría breve y suficiente.
- Estudiar ejemplos y contraejemplos.
- Practicar vocabulario en contexto.
- Escuchar distintas voces y velocidades.
- Grabar y mejorar pronunciación.
- Leer textos graduados e interactivos.
- Escribir respuestas guiadas y libres.
- Conversar con IA dentro del tema estudiado.
- Repasar errores y contenidos próximos a olvidarse.
- Demostrar transferencia en situaciones nuevas.

### Motivación

- Meta diaria flexible.
- Racha recuperable y no punitiva.
- Puntos ligados a aprendizaje real.
- Misiones y logros por dominio.
- Mensajes de avance específicos.
- Recomendaciones claras sobre qué hacer después.

## Tutor con inteligencia artificial

El tutor debe:

- conocer nivel, tema, objetivos y errores relevantes;
- usar inglés principalmente y español como apoyo;
- hacer preguntas graduadas;
- aceptar múltiples respuestas válidas;
- corregir una prioridad importante por turno;
- solicitar reformulación;
- guardar patrones de error;
- evitar inventar reglas o calificaciones sin evidencia;
- mantener la conversación dentro del objetivo pedagógico.

## Pronunciación

La evaluación debe priorizar inteligibilidad y progreso. Debe ofrecer:

- modelo de audio;
- grabación;
- transcripción;
- detección de omisiones o sustituciones;
- feedback sobre sonido, acento de palabra, ritmo y claridad;
- una acción concreta de mejora.

No se debe penalizar un acento extranjero comprensible ni reducir la evaluación a “correcto/incorrecto”.

## Progreso y datos

El sistema debe registrar:

- respuestas e intentos;
- errores;
- habilidad y contenido;
- tiempo de respuesta y sesión;
- pistas utilizadas;
- nivel de apoyo;
- confianza del estudiante;
- dominio estimado;
- repasos realizados;
- evolución oral y escrita.

## Panel administrativo

Debe permitir:

- revisar y versionar contenido;
- cambiar estados de aprobación;
- publicar o retirar contenido;
- consultar errores frecuentes;
- revisar métricas pedagógicas;
- administrar recursos de audio y escenarios de IA.

## Requisitos no funcionales

- Experiencia móvil primero y accesible.
- Arquitectura modular.
- Datos protegidos mediante RLS y privilegio mínimo.
- Secretos fuera de Git y del frontend.
- Contenido cargado desde Supabase, no escrito en componentes React.
- Migraciones e importaciones idempotentes.
- Backups verificables.
- Trazabilidad entre fuente canónica, versión y publicación.

## Métricas de éxito

- activación y finalización de la primera lección;
- sesiones activas por semana;
- abandono por etapa;
- retención a 1, 7, 14 y 30 días;
- reducción de errores recurrentes;
- mejora en pronunciación inteligible;
- dominio por habilidad;
- desempeño en tareas nuevas;
- continuidad voluntaria sin presión manipulativa.

## Fuera del alcance inmediato

Hasta validar T01 y T02 no se priorizarán:

- producción masiva de A2–C2;
- rankings sociales;
- tienda de recompensas;
- funciones decorativas sin impacto pedagógico;
- automatizaciones complejas que no apoyen el flujo principal.
