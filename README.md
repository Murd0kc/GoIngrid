# GoIngrid

Plataforma de aprendizaje de inglés para hispanohablantes, diseñada para desarrollar comprensión, vocabulario, gramática, pronunciación, lectura, escritura y conversación mediante una experiencia dinámica y adaptativa.

## Prioridad actual

Completar una experiencia vertical de alta calidad con A1-M1-T01 y A1-M1-T02 antes de producir el resto de A1.

## Documentación vigente

Lee primero:

1. `GOINGRID_MASTER_SPECIFICATION.md`
2. El documento especializado relacionado con tu cambio:
   - `GOINGRID_PRODUCT_REQUIREMENTS.md`
   - `GOINGRID_ENGINEERING_STANDARD.md`
   - `GOINGRID_LEARNING_AND_CONTENT_STANDARD.md`
   - `GOINGRID_DEVELOPMENT_ROADMAP.md`

Los documentos de `docs/archive/` son históricos y no establecen reglas vigentes.

## Fuentes de verdad

```text
content/curriculum/  → estructura curricular
content/canonical/   → contenido pedagógico oficial
supabase/seeds/      → artefactos generados
Supabase             → datos publicados y estado operativo
```

`content/lessons/`, `content/rebuild/` y `content/normalized/` contienen material preliminar o de transición.

## Tecnología

- React y Vite
- Supabase y PostgreSQL
- Docker Compose
- Caddy
- n8n
- OpenAI para funciones de tutoría, conversación y evaluación asistida

## Estado

- Infraestructura y frontend desplegados.
- Catálogo A1 creado.
- Lote preliminar de 120 lecciones importado, pero no aprobado como contenido final.
- T01 y T02 cuentan con especificaciones canónicas de tema.
- T01 cuenta con cuatro lecciones canónicas en validación.
- El motor de aprendizaje dinámico está implementado localmente y pendiente de despliegue y prueba integral.

## Verificación local

Desde la raíz del repositorio:

```bash
node tools/verify_project.mjs
```

Este comando valida currículo, lecciones canónicas, inventario preliminar, auditoría pedagógica, pruebas del frontend y compilación de producción.
