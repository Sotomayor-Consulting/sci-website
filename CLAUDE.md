# Instrucciones para agentes — sci-website

**Antes de hacer cualquier cambio en este repo, lee [BITACORA.md](./BITACORA.md) completo.** No es opcional. Documenta:

- El historial completo de Pull Requests (qué se hizo y por qué).
- La arquitectura y cronología detallada del embudo `diagnostico-llc` (el foco activo del proyecto).
- Infraestructura que **no vive en este repositorio** y que `git log` no muestra: funciones SQL en Supabase, campos y automatizaciones en Odoo, workflows de n8n. Sin leer esto, es fácil romper piezas invisibles en el código o repetir bugs ya corregidos.
- Decisiones de producto ya tomadas y reversiones deliberadas (para no deshacerlas por error).
- Pendientes conocidos al momento de la última actualización.

Si vas a tocar `src/pages/diagnostico-llc*`, `functions/api/diagnostico-*`, o cualquier automatización relacionada (Supabase, Odoo, n8n), la sección 4 de BITACORA.md es obligatoria antes de escribir una sola línea.

Cuando termines un cambio significativo (un PR, un cambio directo en Supabase/Odoo/n8n), **actualiza BITACORA.md** en el mismo turno — es la única fuente de verdad para lo que vive fuera de este repo.
