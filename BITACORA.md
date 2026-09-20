# Bitácora del proyecto — sci-website

**Lectura obligatoria para cualquier agente (Claude u otro) que trabaje en este repo.**
Antes de tocar código del embudo `diagnostico-llc` (landings, `functions/api/diagnostico-*`, Supabase, Odoo o n8n), leer completo este documento. Ignorarlo lleva a repetir bugs ya corregidos o a romper piezas que viven fuera de git (Supabase, Odoo, n8n) y que este documento es la única fuente que las describe.

Última actualización: 2026-09-20.

---

## 1. Por qué existe este documento

Gran parte de la lógica de negocio de `diagnostico-llc` **no vive en este repositorio**. Vive en:

- **Supabase** (funciones SQL, columnas generadas, triggers) — proyecto `vzrrjkdhqqkxjedeukml`.
- **Odoo** (`sotomayorconsulting.odoo.com`) — campos Studio, automatizaciones (`base.automation`), campañas de marketing (`marketing.campaign`), plantilla de correo (`mailing.mailing`).
- **n8n** — workflows que reciben el webhook de Supabase y crean/actualizan el lead en Odoo.

`git log` no muestra nada de eso. Si un agente solo audita el repo, tiene una imagen incompleta y puede duplicar trabajo o reintroducir bugs. La sección 4 documenta ese estado "fuera de git" con el detalle necesario para operar sin tener que re-descubrirlo por prueba y error.

---

## 2. Índice completo de Pull Requests

<!-- pr-table-start -->
| # | Estado | Fecha | Título |
|---|---|---|---|
| #1 | Abierto | 2026-05-11 | Bump @iconify-json/mingcute from 1.2.6 to 1.2.7 |
| #2 | Abierto | 2026-05-11 | Bump rimraf from 6.1.2 to 6.1.3 |
| #3 | Abierto | 2026-05-11 | Bump @astrojs/starlight from 0.37.3 to 0.39.3 |
| #4 | Abierto | 2026-05-11 | Bump @tailwindcss/forms from 0.5.10 to 0.5.11 |
| #5 | Abierto | 2026-05-11 | Bump @astrojs/mdx from 4.3.13 to 6.0.1 |
| #6 | Abierto | 2026-07-27 | Update schedule confirmed validation page |
| #7 | Abierto | 2026-07-27 | Use pnpm as the sole package manager |
| #8 | Fusionado | 2026-07-30 | Polish LLC guide layout and CTA flow |
| #9 | Cerrado | 2026-07-30 | Tu ñaña |
| #10 | Fusionado | 2026-07-30 | Restore LLC guide Tailwind rendering |
| #11 | Abierto | 2026-07-30 | Delete src/pages/guia-llc-estados-unidos/index.html |
| #12 | Abierto | 2026-07-30 | Guia LLC Actualización de diseño |
| #13 | Fusionado | 2026-07-30 | Fix LLC guide CTA color rendering |
| #14 | Fusionado | 2026-07-30 | Restore LLC guide styles and CTA text |
| #15 | Fusionado | 2026-07-30 | Compile LLC guide styles with Astro |
| #16 | Fusionado | 2026-07-30 | Favicon-2026 |
| #17 | Abierto | 2026-07-30 | Delete public/images/logos/isotipo-favicon.png |
| #18 | Abierto | 2026-07-30 | isotipo-favicon-180x180 |
| #19 | Fusionado | 2026-07-30 | Optimize LLC guide favicon, icons and tracking |
| #20 | Fusionado | 2026-08-03 | Chore(image optimization from /insights and fix the utf8 content from .md from blogs) |
| #21 | Fusionado | 2026-08-03 | Fix/reorganitacion-from-tabs-useless |
| #22 | Fusionado | 2026-08-03 | Fix reserva pendiente styles delivery |
| #23 | Fusionado | 2026-08-03 | Publish static styles for reserva pendiente |
| #24 | Fusionado | 2026-08-07 | Sync V45 landing index and remove legacy versions |
| #25 | Fusionado | 2026-08-07 | Update agenda continuation landing |
| #26 | Fusionado | 2026-08-12 | Hero update and animations |
| #27 | Fusionado | 2026-08-12 | Delete src/pages/crea-tu-llc-en-usa/gracias-por-tu-registro/index.html |
| #28 | Abierto | 2026-08-12 | SCI post-registro-v23 |
| #29 | Fusionado | 2026-08-13 | post-registrov26 |
| #30 | Fusionado | 2026-08-19 | Add google Tag |
| #31 | Fusionado | 2026-08-19 | Update google tag manager |
| #32 | Fusionado | 2026-09-07 | fix: secuencia de eventos en página de gracias |
| #33 | Fusionado | 2026-09-07 | Feat/leads landing llc campanas |
| #34 | Fusionado | 2026-09-07 | fix(leads-landing): correcciones A/B + mejoras de conversión |
| #35 | Fusionado | 2026-09-07 | fix(gracias-por-tu-registro): CTA único + calendario Zcal usable en móvil |
| #36 | Fusionado | 2026-09-07 | fix(leads-landing): CTA + quita guard de host (A y B) |
| #37 | Fusionado | 2026-09-08 | feat(leads-landing): video de bienvenida en A y B |
| #38 | Fusionado | 2026-09-08 | feat(leads-landing): video peek + modal, redirige al form al terminar |
| #39 | Fusionado | 2026-09-08 | feat(leads-landing): video enmarcado bajo el CTA (estilo competencia) |
| #40 | Fusionado | 2026-09-08 | feat(leads-landing): video dentro del hero, bajo el CTA |
| #41 | Fusionado | 2026-09-08 | fix(leads-landing): video del hero — autoplay, play centrado, gancho |
| #42 | Fusionado | 2026-09-08 | feat(leads-landing): modelo VSL — form al final, hero sin formulario, envío único |
| #43 | Fusionado | 2026-09-10 | feat(diagnostico-llc): variantes A y B — embudo fase 1 |
| #44 | Cerrado | 2026-09-10 | docs(diagnostico-llc): guion de procesos de eventos TikTok |
| #45 | Fusionado | 2026-09-11 | docs(diagnostico-llc): guion de procesos de eventos TikTok |
| #46 | Fusionado | 2026-09-11 | feat(diagnostico-llc): Cloudflare Function + Supabase leads-xb (fase 2a) |
| #47 | Fusionado | 2026-09-11 | fix(diagnostico-llc): honeypot bloqueaba el submit por autofill de Chrome |
| #48 | Fusionado | 2026-09-11 | fix(functions): phone_e164 se corrompía cuando la landing mandaba ambos phone_raw y phone_e164 |
| #49 | Fusionado | 2026-09-11 | fix(diagnostico-llc): P0 auditoría UX móvil (A y B) |
| #50 | Fusionado | 2026-09-13 | fix(diagnostico-lead): corte a Supabase como ruta principal a Odoo |
| #51 | Fusionado | 2026-09-13 | feat(tiktok-capi): CAPI de TikTok same-origin en Cloudflare (diagnóstico A/B) |
| #52 | Fusionado | 2026-09-13 | feat(diagnostico): cablear telemetría de embudo (sendBeacon) |
| #53 | Fusionado | 2026-09-14 | fix(diagnostico): question_index de q6 violaba un CHECK y tumbaba el evento |
| #54 | Fusionado | 2026-09-14 | fix(tiktok-capi): Subscribe e InitiateCheckout bloqueados por whitelist incompleto |
| #55 | Fusionado | 2026-09-14 | fix(tiktok-capi): content_type/content_id inválidos y value dinámico en Schedule |
| #56 | Fusionado | 2026-09-14 | fix(diagnostico-lead): diag_link_lead antes del insert, no después |
| #57 | Fusionado | 2026-09-14 | fix(supabase): fuente pierde la red de ads sin ttclid/fbclid + sync de esquema |
| #58 | Fusionado | 2026-09-14 | feat(diagnostico-llc): validación de WhatsApp por país (A y B) |
| #59 | Fusionado | 2026-09-15 | feat(diagnostico): validar que nombre/apellido parezcan reales |
| #60 | Abierto | 2026-09-15 | feat(diagnostico): WhatsApp obligatorio en el gate (A y B) — pendiente de aprobación |
| #74 | Fusionado | 2026-09-18 | fix(diagnostico-llc): UX del paso de agenda (A y B) — orden del stepper, botón WhatsApp flotante, ancho del calendario, brillo del CTA |
| #75 | Fusionado | 2026-09-20 | feat(reserva-pendiente): hero de marca, popup de ayuda por inactividad y calendario Zcal compacto |
| #76 | Fusionado | 2026-09-20 | feat(gracias-por-tu-registro): hero premium, nav azul y calendario Zcal compacto |
| #77 | Fusionado | 2026-09-20 | feat(reserva-pendiente): revisión del hero (tag Agenda Pendiente, titular, CTA y nav) |
| #78 | Abierto | 2026-09-20 | feat(gracias-por-tu-registro): popup de ayuda tras 5 s de inactividad |
<!-- pr-table-end -->

Regenerar esta tabla con:
```bash
gh pr list --state all --limit 100 --json number,title,state,mergedAt,createdAt \
  --jq 'sort_by(.number) | .[] | [(.number|tostring), .state, (.mergedAt // .createdAt // "" | split("T")[0]), .title] | @tsv'
```

Los PR #1–#42 son trabajo anterior (guía LLC, landing "leads", tracking, video en hero) sin contexto detallado recuperado en esta bitácora — para entenderlos, leer el PR individual con `gh pr view <n> --json body`. A partir del **#43** empieza el embudo `diagnostico-llc`, que es el foco activo y el que se documenta en detalle abajo.

---

## 3. El embudo `diagnostico-llc` — arquitectura y cronología

### 3.1 Arquitectura de alto nivel

```
Landing (diagnostico-llc / diagnostico-llc-b, variantes A/B)
   │  quiz de 4-6 preguntas + gate (nombre, apellido, email, WhatsApp)
   ▼
functions/api/diagnostico-event.ts   (telemetría por sendBeacon, cada respuesta)
functions/api/diagnostico-lead.ts    (submit final del gate)
   │  ambos escriben a Supabase
   ▼
Supabase: tabla "leads-xb" (+ tablas de eventos/telemetría)
   │  columnas GENERATED (valor_diagnostico, etc.) calculan el tier del lead
   │  función diag_build_odoo_payload() arma el JSON para Odoo
   │  trigger -> webhook HTTP hacia n8n
   ▼
n8n: workflow "Paso 1b - leads-xb Odoo Sync" (5P9PAd7mknoJAZAf)
   │  llama a "Paso 2 - Landing Registro Ads V46 | Odoo" (dfVrD8ave246iDtY, workflow COMPARTIDO
   │  con otras campañas de ads, no exclusivo de diagnostico) para crear/actualizar el crm.lead
   │  luego el nodo "Odoo | Tag valor" escribe tags + campos Studio + marcas de nurture
   ▼
Odoo (crm.lead, stage_id=10)
   │  base.automation (WhatsApp needs_info / not_ready)
   │  marketing.campaign 9 "Ready_for_meeting_seguimiento inicial" (email + WhatsApp, alto valor)
```

### 3.2 Cronología de PRs de código (#43–#60)

- **#43** — Landings A/B del embudo (fase 1): quiz interactivo, sin backend propio aún.
- **#45** — Guion de procesos de eventos TikTok (documentación).
- **#46** — Fase 2a: Cloudflare Function (`functions/api/diagnostico-lead.ts`) + tabla `leads-xb` en Supabase. Primer punto en que el lead se persiste.
- **#47** — Fix: el honeypot anti-bot bloqueaba envíos legítimos por autofill de Chrome.
- **#48** — Fix: `phone_e164` se corrompía si la landing mandaba `phone_raw` y `phone_e164` a la vez.
- **#49** — Auditoría P0 de UX móvil en A y B.
- **#50** — Supabase pasa a ser la ruta principal hacia Odoo (antes era un camino secundario/directo).
- **#51** — CAPI de TikTok same-origin vía Cloudflare, para el tracking server-side del embudo.
- **#52** — Telemetría de embudo por `sendBeacon` (`diagnostico-event.ts`), pregunta por pregunta.
- **#53** — Fix: `question_index` de la pregunta 6 violaba un CHECK constraint y tumbaba el evento.
- **#54, #55** — Fixes de CAPI de TikTok: whitelist de eventos incompleta (Subscribe/InitiateCheckout bloqueados), `content_type`/`content_id` inválidos, `value` dinámico mal calculado en el Schedule.
- **#56** — Fix de orden: `diag_link_lead` corría antes del insert real, no después (condición de carrera).
- **#57** — Fix: el campo `fuente` perdía la red de ads cuando no había `ttclid`/`fbclid` en la URL; incluye sync de esquema Supabase → repo (`supabase/migrations/`).
- **#58** — Validación de WhatsApp por país (rango de dígitos según código de país) en A y B.
- **#59** — Validación de que nombre/apellido "parezcan reales" (`looksLikeRealName`) en el quiz (P2) y en el gate — ver detalle en 3.4.
- **#60** (abierto, pendiente de aprobación) — WhatsApp pasa a ser obligatorio en el gate (antes era opcional). Reversión deliberada de una decisión anterior de reducir fricción — ver 3.4.
- **#74** (abierto) — UX del paso de agenda (resultado → Zcal), en A y B, tras una auditoría de funnel en Supabase (ver 5): el stepper "Etapa X · [Nombre]" ahora va debajo del título del veredicto (antes iba después de todo el bloque de resultado); botón flotante de WhatsApp (mismo modelo que `BtnWhatsapp.astro`, alineado a la izquierda para no chocar con el CTA del informe) en vez del enlace-texto casi invisible que existía; `.cal-frame iframe` con `width:100% !important` para que un estilo inline que a veces mete el script de Zcal no angoste el calendario; brillo diagonal (sheen) en el botón "Agendar mi revisión"/CTA primario, con loop de 3.4s y respeto a `prefers-reduced-motion`. No toca el gate, WhatsApp obligatorio, ni nada de Supabase/Odoo/n8n.

### 3.3 Qué pasó fuera de PRs (esta sesión, 2026-09-14/15)

Todo lo siguiente se hizo directamente contra Supabase/Odoo/n8n vía API, **no está en git**, y se detalla completo en la sección 4:

1. Auditoría y rediseño de `valor_diagnostico` (el tier alto/mediano/bajo que ve Odoo) para que dependa también de la calidad real de los datos de contacto y del nombre, no solo de las respuestas del quiz.
2. Prioridad absoluta de "identidad no creíble" sobre cualquier señal explícita (ruta advisor / "quiero Zoom") al calcular la intención (`diag_compute_intension`), para que un lead con datos falsos no llegue a `ready_for_meeting` solo por haber marcado que quería agendar.
3. Diagnóstico y arreglo del correo de diagnóstico vacío (`mailing.mailing` id 51): tenía 8 expresiones QWeb que parseaban texto libre con etiquetas hardcodeadas solo para la variante B. Se reemplazaron por 4 campos Studio nuevos en `crm.lead`, poblados dinámicamente desde n8n.
4. Conexión del pipeline de diagnóstico a automatizaciones de WhatsApp (`needs_info`/`not_ready`) que ya existían en Odoo para otro flujo, pero nunca recibían la marca necesaria para dispararse desde diagnóstico.
5. Activación de la campaña de marketing `ready_for_meeting` (id 9) y de las automatizaciones anteriores.

### 3.4 Decisiones de producto y reversiones (para no repetirlas al revés)

- **WhatsApp opcional → obligatorio**: en algún punto anterior se hizo opcional a propósito para reducir fricción en el gate. El 2026-09-15 el usuario pidió explícitamente revertir esto y hacerlo obligatorio (PR #60), porque la calidad de datos de contacto importa más que la tasa de conversión del formulario. Si un agente ve el campo como opcional en el futuro y "lo arregla" haciéndolo opcional de nuevo, **eso sería un retroceso**, a menos que el usuario lo pida explícitamente otra vez.
- **`valor_diagnostico` no es solo el resultado del quiz**: un lead puede responder perfecto y aun así calificar "bajo" si su nombre o email/teléfono no parecen reales (ver `diag_name_looks_real`, `diag_contact_quality_ok`). Esto fue una corrección deliberada tras detectar leads obviamente falsos (ids Odoo 4063, 4055) calificando "alto valor".
- **La intención (`intension`) no es un espejo 1:1 del valor**: una señal explícita del usuario (ruta advisor o "sí quiero Zoom") puede llevarlo a `ready_for_meeting` aunque su valor sea medio/bajo — **excepto** si la identidad no es creíble, en cuyo caso siempre gana `not_ready`. Ver función completa en 4.1.
- **No se debe validar el nombre solo por longitud**: se probaron varias librerías de validación de nombres (Parsley, FormValidation, Bouncer.js, Just-validate, Clearout) y ninguna sirve para este caso (o son solo estructurales, o son de pago/entrenadas para EE. UU.). La validación es una heurística propia (`looksLikeRealName`) replicada en cliente y en servidor (SQL) — ver 4.1.

### 3.5 Landings LLC heredadas (flujo separado de `diagnostico-llc`)

- El 2026-09-18 se migraron a Astro y componentes Starwind las variantes `tu_llc_en_usa`, `tu-llc_en-usa/index_B` y `tu_llc-en_usa`, conservando su diseño y comportamiento responsive.
- Estas variantes envían el lead a `functions/api/leads.ts` mediante `/api/leads`; **no** forman parte del pipeline `diagnostico-llc` descrito arriba y no deben conectarse por accidente a `diagnostico-lead.ts`.
- El calendario Zcal solo se muestra después de un POST exitoso. Se conservan el evento `lead_datos_completados`, el identificador opcional `llcLeadSubmissionId` y los parámetros Zcal `name`, `email`, `smsPhone`, `a0`, `a1`, `a2` y `a3`.
- `functions/api/leads.ts` no se modificó durante la migración y no se hicieron envíos reales de prueba.

### 3.6 Landing `reserva-pendiente` (PR #75, 2026-09-20)

Página donde el lead que ya completó el registro elige horario en Zcal (`https://zcal.co/t/agendar-asesoria-llc/60min`). No pertenece al pipeline `diagnostico-llc` ni escribe en Supabase/Odoo/n8n: todo vive en este repo.

**Cómo se sirve (trampa habitual):**
- `src/pages/reserva-pendiente/index.html` lo procesa Astro, pero `styles.css` y `tailwind.css` se sirven desde `public/reserva-pendiente/` (PR #22/#23). Las de `src/pages/reserva-pendiente/` son la fuente: `styles.css` debe quedar idéntico en ambos sitios y `public/reserva-pendiente/tailwind.css` es el **compilado** de Tailwind v4 a partir de `src/pages/reserva-pendiente/tailwind.css`.
- Ese compilado escanea **solo** `index.html` (≈17 KB; antes pesaba 130 KB por escanear todo el repo). El HTML no genera clases dinámicas (el JS solo alterna `is-visible`/`data-step`, que viven en `styles.css`). Si se añaden clases de Tailwind al HTML hay que recompilarlo, o no tendrán estilo. Los colores de marca están en el `@theme` (`brand` `#0d2636`, `gold` `#b98d33`, `onBrand`).
- Logo: solo `logo_azul_horizontal` (`public/images/logos/`, en 320/640/853 px, PNG cuantizado con **borde azul sólido**: el original traía píxeles semitransparentes en el borde que dibujaban una línea sobre el header). Se eliminó `src/images/logos/logo_azul_200x200.png` (nada más lo usaba). Favicon y `apple-touch-icon` siguen siendo `isotipo-redondo.png`; `og:image` es el logo horizontal.

**Contenido y decisiones de producto:**
- Hero centrado (revisión del 2026-09-20): tag **"Agenda Pendiente"** con icono de reloj (`schedule`, no un check: la agenda aún no está reservada), texto destacado "Da el siguiente paso" (dorado, dentro del `<h1>` como `.hero-kicker`, con un ": " solo para lectores de pantalla), titular "Tu negocio en Estados Unidos, / estructurado para operar **globalmente**" (el dorado es solo un acento en esa palabra; peso 700), subtítulo "Incorpora tu LLC, prepara tu estructura bancaria y mantén tus obligaciones al día desde una sola plataforma." (a propósito no promete que la apertura bancaria esté garantizada), CTA "Agenda tu asesoría gratuita →" (46 px de alto, radio 8 px) hacia `#calendario` (scroll suave en la misma página; el calendario queda compacto y con las fechas a la vista) y pruebas "Asesoría personalizada · Por Zoom · En español". Los logos de Mercury y Relay **ya no van en el hero** (para no sugerir una alianza oficial); `public/mercury.svg` y `public/relay.svg` siguen usándose en `diagnostico-llc`. El logo del nav es un 20 % mayor (57.6 px en móvil, 67.2 px en escritorio) con más margen; la tarjeta del calendario tiene radio de 16 px y una sombra más sutil.
- **No hay cifras ni afirmaciones sin verificar** (la referencia de diseño traía "5.000 empresas", "150 países", ONU, Techstars, domain: no se copiaron). **No se menciona duración**: el usuario pidió quitar "30 minutos" y el widget en vivo mostró "60 min" el 2026-09-20, mientras las notas de `leads-landing` dicen "dura 30 min, slug /60min": verificar en Zcal.
- Popup de ayuda (`<dialog id="help-popup">`): aparece tras 5 s sin interacción, una vez por sesión (`sessionStorage["sci_help_popup_seen"]`). No se muestra si la pestaña está oculta, si el calendario está a la vista, ni si el usuario ya hizo clic dentro del iframe. Ofrece "Reserva una llamada gratuita" (cierra y baja a la agenda) y WhatsApp (`https://api.whatsapp.com/send?phone=17542252904&text=Hola.%20Me%20gustar%C3%ADa%20pedir%20mas%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20Sotomayor%20Consulting.`).
- CTA fijo de móvil: solo aparece con scroll mientras no se ven ni el CTA del hero ni el calendario, y solo en móvil (`md:hidden`).

**Tracking:** GTM y TikTok Pixel no cambian. Eventos nuevos: `cta_hero_calendar`, `cta_popup_calendar`, `cta_popup_whatsapp` y `help_popup_shown`. Los que contienen "calendar" disparan también `Contact` de TikTok (lógica preexistente del script).

**Recorte del encabezado de Zcal (parte frágil):** el iframe es de otro dominio (no se puede inyectar HTML/CSS y no hay opción oficial: `embed=1&embedType=iframe` sigue mostrando el encabezado). Se oculta el encabezado interno (avatar, nombre, título del evento, duración) con `.agenda-viewport` (container query) › `.agenda-crop` (`overflow:hidden`) › iframe con `margin-top` negativo:

| Ancho del iframe | El encabezado de Zcal termina en | Recorte (`--crop`) |
|---|---|---|
| < 440 px | 305 px | 325 px |
| 440–599 px | 273 px | 293 px |
| ≥ 600 px | 300 px | 320 px |

- Solo la vista inicial (calendario) tiene ese encabezado; las vistas de horas y de formulario empiezan arriba del todo y quedarían recortadas. Zcal no envía `postMessage`, pero cada avance de vista añade una entrada al historial de la pestaña (las flechas de mes no): un `setInterval` compara `history.length` e ignora los cambios de `location.hash` propios (las anclas a `#calendario` también suman historial). Al avanzar pone `data-step="advanced"` en `.agenda-crop`, que quita el recorte y sube la altura a 760 px (720 px en escritorio).
- Limitaciones: si el usuario pulsa "Atrás" dentro de Zcal el encabezado reaparece (no se puede detectar); si Zcal cambia su diseño hay que **volver a medir** (captura con Edge del enlace en un iframe de ancho fijo y buscar por bandas de píxeles dónde termina el encabezado).

### 3.7 Landing `crea-tu-llc-en-usa/gracias-por-tu-registro` (PR #76, 2026-09-20)

Página de "registro completado" que muestra el calendario de Zcal (`https://zcal.co/t/agendar-asesoria-llc/60min?embed=1`). Es un HTML autónomo con **CSS inline propio** (tokens en `:root`: navy `#0e2438`/`#0d2636`, dorado `#d6a144`, fuentes Poppins + Open Sans), no usa el Tailwind de `reserva-pendiente`. No escribe en Supabase/Odoo/n8n.

**Qué cambió (solo hero, nav, tarjeta del calendario y un script; el resto de la página no se tocó):**
- **Hero** con la estructura dictada por el usuario, en este orden: etiqueta "✓ Registro completado" › preheadline "Da el siguiente paso" (dentro del `<h1>`, con un ": " solo para lectores de pantalla) › headline "Incorpora tu LLC / o ponla en orden" (2ª línea dorada, peso 500) › propuesta de valor corta (2–3 líneas) › tres indicadores con iconos lineales (Estructura · Banca · Cumplimiento) › CTA "Agenda tu asesoría gratuita →" › confianza "Por Zoom · En español". "Gratuita" aparece **una sola vez** en el hero (a propósito: menos redundancia = más exclusividad). Se quitaron los logos de Mercury/Relay del hero porque la franja "Partners oficiales" queda justo debajo.
- **Nav**: header azul sólido `#0d2636` con `logo_azul_horizontal` (`public/images/logos/`, 320/640/853 px, borde azul sólido; mismos archivos que el PR #75). El azul del header debe coincidir con el del PNG o se ve un recuadro. El CTA dorado del header sigue apareciendo solo al pasar el CTA del hero.
- **Tarjeta del calendario**: blanca, flotante (máx. 640 px, solape ~28–44 px sobre el hero, ≥54 px de separación bajo el contenido del hero, sombra suave). Se eliminó la insignia "Asesoría gratuita · por Zoom" y el subtítulo largo sobre nombre/correo/WhatsApp; queda "Elige tu horario / Elige el día y la hora.".
- **Recorte del encabezado de Zcal** (avatar, nombre del equipo, título del evento, duración): el iframe es de otro dominio (no se puede editar su HTML; `embed=1` no lo oculta). Se recorta con `.cal-frame` (container query) › `.cal-crop` (`overflow:hidden`) › iframe con `margin-top` negativo. Medidas según el **ancho del iframe**: < 440 px el encabezado termina en 305 px → recorte 325; 440–599 px → 273 → 293; ≥ 600 px → 300 → 320 (alto visible 480 px). Solo la vista inicial tiene ese encabezado; las de horas y formulario empiezan arriba del todo. Zcal no envía `postMessage`, pero cada avance de vista suma una entrada al historial de la pestaña (las flechas de mes no): un `setInterval` compara `history.length` (ignora cambios de `location.hash` propios) y pone `data-step="advanced"` en `.cal-crop`, que quita el recorte (760 px; 720 px en escritorio). Limitaciones: tras "Atrás" dentro de Zcal el encabezado reaparece; si Zcal cambia su diseño hay que volver a medir.
- **Script**: `sotoScrollToCalendar` ahora usa `block:'start'` (antes `'center'`) para que la tarjeta quede bajo el header con las fechas a la vista; el `scroll-margin-top` sigue la altura del header (`--header-h`: 72 px móvil, 84 px escritorio). El tracking (`data-cta`, `data-scroll-calendar`, `data-track-schedule`, GTM/TikTok/Meta/CAPI) no cambió.

**Hallazgos de la auditoría del 2026-09-20 que este PR NO corrige** (para próximos pasos): ver "Pendientes" (sección 5).

---

### 3.8 Popup de ayuda en `gracias-por-tu-registro` (PR #78, 2026-09-20)

Se añadió a `crea-tu-llc-en-usa/gracias-por-tu-registro` el mismo popup por inactividad que tiene `reserva-pendiente` (3.6). Solo cambia `gracias-por-tu-registro/index.html` (CSS `.help-popup*`, un `<dialog id="help-popup">` antes de `.stickybar` y un bloque JS dentro del `DOMContentLoaded`).

- **Comportamiento**: `<dialog>` nativo con `showModal()`; se abre a los 5 s sin `pointerdown/pointermove/keydown/scroll/wheel/touchstart`, una vez por sesión (`sessionStorage['sci_help_popup_seen']`). No se abre si la pestaña está oculta, si `#agendar` ocupa la zona central de la pantalla o si el iframe de Zcal tiene el foco (en esos casos rearma el temporizador). Cierra con la X, "No, gracias, ya lo averiguaré.", clic en el fondo y Esc.
- **Salidas**: "Elegir mi horario" (cierra y llama a `sotoScrollToCalendar('help_popup')`) y WhatsApp con `https://api.whatsapp.com/send?phone=17542252904&text=Hola…` (el mismo de `reserva-pendiente`; la barra fija móvil sigue usando `wa.link/jx59a9`).
- **Copy**: tuteo (como el resto de la página), sin duración ni "gratuita" ("Sin compromiso."). El popup no se oculta por la barra fija móvil: el `<dialog>` la tapa mientras está abierto.
- **Tracking**: `help_popup_shown` (dataLayer), `cta_click` con `popup-calendar`/`popup-wa` (handler genérico de `a[data-cta]`; el de WhatsApp dispara `Contact`) y `calendar_scroll_cta_clicked` con `source_context: help_popup`. Nota preexistente: el CTA del hero se registra con `source_context: other` (falta mapear `.hero` en el handler).

---

## 4. Infraestructura fuera de git (la parte crítica)

### 4.1 Supabase (proyecto `vzrrjkdhqqkxjedeukml`)

Funciones SQL relevantes (todas en el esquema `public`, aplicadas vía Management API, no vía migración versionada salvo que se indique lo contrario):

- **`diag_contact_quality_ok(p_email, p_phone_e164)`** — valida formato de email, rechaza prefijos basura y dominios desechables; si hay teléfono, exige E.164 válido, no todo el mismo dígito (chequeado sobre los últimos 9 dígitos para no confundir el código de país) y no secuencial.
- **`diag_name_looks_real(p_name)`** — espejo en SQL de `looksLikeRealName()` del cliente: regex `^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ''\-\s]{2,59}$` (mínimo 3 caracteres), lista de palabras basura, rechaza 3+ caracteres repetidos, exige al menos una vocal.
- **`valor_diagnostico`** (columna `GENERATED ALWAYS ... STORED` en `leads-xb`) — `'bajo'` si falla `diag_contact_quality_ok` o `diag_name_looks_real` (nombre o apellido); si no, `'alto'`/`'mediano'`/`'bajo'` según `diag_stage_id` (3+/2/1).
- **`diag_compute_intension(p_route, p_wants_zoom, p_valor DEFAULT NULL, p_identity_ok DEFAULT true)`** — devuelve el texto exacto que Odoo/n8n interpretan como intención:
  1. Si `p_identity_ok` es falso → `'No estoy listo para agendar, prefiero explorar primero'` (gana sobre todo lo demás).
  2. Si hay señal explícita (`route` advisor/zcal o `wants_zoom` sí) → `'Sí, quiero analizar mi caso con un experto'`.
  3. Si no, según `p_valor`: `alto` → mismo texto de "quiero analizar"; `bajo` → mismo texto de "no estoy listo"; `mediano`/nulo → `'Primero quiero entender un poco más'`.
  Estos tres textos exactos (con esas palabras clave: *"analizar mi caso"*, *"entender un poco"*, *"no estoy listo"*) son los que el workflow de n8n "Paso 2" busca por substring para resolver `x_studio_intencion_1` a `ready_for_meeting`/`needs_info`/`not_ready`. **Si se cambia el texto, hay que actualizar el matching en n8n (ver 4.3) o se rompe la clasificación.**
- **`diag_build_odoo_payload(p_lead_id)`** — arma el JSON completo que se manda a Odoo vía n8n. Incluye, entre otros: `intension` (el texto de arriba), `valor_diagnostico`, `diag_stage_id`, `diag_stage_title`, `diagnostico` (respuestas detalladas vía `v_diagnostico_lead_respuestas`), y dos campos agregados el 2026-09-14 para el fix del correo:
  - `diag_riesgo_label` — extraído con una sola regex confiable desde `diag->>'diagnostico_summary'` (texto ya generado por el cliente en `buildDiagnosticSummary()`), patrón `RESULTADO: [Etapa X/4 - Label]`.
  - `diag_resultado_texto` — todo lo que va después de `] ` en ese mismo resumen.

Notas operativas:
- `leads-xb` **no acumula histórico**: un resubmit del mismo `lead_id` sobrescribe la fila. Si se necesita ver qué cambió entre envíos, hay que mirar `mail.message` (chatter) en Odoo, no Supabase.
- Cambiar la firma de una función (agregar parámetro) exige `DROP FUNCTION` explícito del overload viejo o Postgres tira error de ambigüedad al llamarla con menos argumentos.
- Cambiar una columna `GENERATED STORED` recalcula **todas** las filas existentes al hacer `DROP`/`ADD` de la columna (no basta con `CREATE OR REPLACE` de la función que usa).

### 4.2 Odoo (`sotomayorconsulting.odoo.com`, db `sotomayor-consulting-sotomayorconsulting-main-29604708`)

**Campos Studio en `crm.lead` (model_id 712), creados 2026-09-14/15:**
| Campo | Tipo | Uso |
|---|---|---|
| `x_studio_diag_riesgo` | integer | número de etapa (1-4) para el badge del correo |
| `x_studio_diag_riesgo_label` | char | etiqueta "Etapa X/4 — Label" |
| `x_studio_diag_resultado` | html | párrafo "Nuestra lectura profesional" |
| `x_studio_diag_resumen_tabla` | html | filas `<tr>` de la tabla "Resumen de tu situación" (puede venir vacía si la telemetría del lead no cubrió todas las preguntas) |
| `x_nurture_needs_info_source` / `x_nurture_not_ready_source` | char (preexistente, de otro flujo) | marca `'n8n_post_create_pending'` que dispara las automatizaciones de WhatsApp; ver 4.4 |

**Tags (`crm.tag`)**: id 51 "Alto valor" (color 10), id 52 "Mediano valor" (color 3), id 53 "Bajo valor" (color 1). Se aplican/quitan en cada sync según `valor_diagnostico`.

**Automatizaciones de WhatsApp (`base.automation`)** — **no exclusivas de diagnostico**, son de un sistema más viejo ("stage 10 intent") reutilizado:
- id **75** ("Needs info…") y **81** ("Not ready…") — versión legacy, `active: false`, sin gate de idempotencia. No tocar, quedan de referencia histórica.
- id **100** ("WhatsApp inicial | Needs info | al crear stage 10") y **101** (ídem "Not ready") — versión **activa**, disparan cuando `stage_id=10` AND `x_studio_intencion_1` coincide AND el campo `x_nurture_*_source` = `'n8n_post_create_pending'`. La acción del servidor busca un `whatsapp.message` existente por teléfono+plantilla antes de mandar (idempotente: no duplica envíos aunque el trigger corra varias veces).
- **`marketing.campaign` id 9** ("Ready_for_meeting_seguimiento inicial") — dominio `stage_id in [10] AND x_studio_intencion_1 ilike 'ready_for_meeting' AND sin fecha/link de agenda`. Contiene 9 actividades: WhatsApp inicial, el email de diagnóstico (`mailing.mailing` id 51), y 3 emails + 2 WhatsApp más escalonados hasta 5 días. **Activada el 2026-09-15** (`action_start_campaign`), aplica de inmediato a todo lead que ya califique, no solo a los futuros.

**`mailing.mailing` id 51** ("Diagnóstico | Informe + CTA agenda") — plantilla QWeb del correo. Reescrita el 2026-09-15 para leer `object.x_studio_diag_riesgo`, `object.x_studio_diag_riesgo_label`, `object.x_studio_diag_resultado`, `object.x_studio_diag_resumen_tabla` en vez de 8 expresiones `t-out` que hacían `.split()` sobre `object.description` con etiquetas hardcodeadas solo válidas para la variante B del embudo (la causa raíz del correo que llegaba vacío). Para probar cambios a esta plantilla: el wizard de "Enviar prueba" normal **no** ejecuta el motor QWeb real (usa un composer distinto que ignora `t-out`/`t-if`); la única forma confiable de ver el render real es acotar temporalmente `mailing_domain` a un lead específico (`[["id","=",<id>]]`), usar el modelo `mailing.mailing.test` (método `send_mail_test`), y **revertir el dominio a `[]` inmediatamente después**.

### 4.3 n8n

Dos workflows relevantes:

- **`5P9PAd7mknoJAZAf`** — "Paso 1b - leads-xb Odoo Sync (Diagnostico Supabase)". Recibe el webhook de Supabase, llama a Paso 2 (abajo) para crear/actualizar el lead, y luego el nodo **"Odoo | Tag valor"** escribe en una sola llamada: `tag_ids` (alto/mediano/bajo), los 4 campos `x_studio_diag_*` del correo, y (desde 2026-09-15) `x_nurture_needs_info_source`/`x_nurture_not_ready_source`, calculados por substring sobre `body.intension` (mismo matching que el nodo "intension" de Paso 2, ver abajo) — **nunca** sobre `valor_diagnostico` directo, porque una señal explícita del usuario puede llevar a `ready_for_meeting` aunque el valor sea medio/bajo, y poner la marca de nurture en ese caso dispararía un WhatsApp contradictorio con el email de `ready_for_meeting`.
- **`dfVrD8ave246iDtY`** — "Paso 2 - Landing Registro Ads V46 | Odoo". **Workflow compartido con otras campañas de ads**, no exclusivo de diagnostico. Contiene el nodo de código **"intension"** que interpreta el texto libre de `intension` (el que devuelve `diag_compute_intension`) por substring: `'analizar mi caso'` → `ready_for_meeting`, `'entender un poco'` → `needs_info`, `'no estoy listo'` → `not_ready` (default si no matchea nada: `needs_info`). También setea `stage_id=10` y `x_studio_intencion_1` en los nodos "Create Lead" / "Odoo | Update Existing Lead". Si se cambia el texto que devuelve la función de Supabase, este nodo debe actualizarse en el mismo cambio.

Acceso: ambos vía API REST de n8n (`N8N_URL`/`N8N_API_TOKEN` en `.env` de la raíz del monorepo `SotoAds`, no de este repo). El PUT de `/workflows/:id` exige mandar `settings` con **solo** `{executionOrder: ...}` — si se reenvía el objeto `settings` completo tal cual lo devuelve el GET, la API lo rechaza por "additional properties". Nunca renombrar un nodo sin actualizar `connections` (está indexado por nombre, no por id).

### 4.4 Cómo se conecta todo (resumen para debug rápido)

Si un lead de diagnóstico no recibe el correo o el WhatsApp esperado, revisar en este orden:
1. ¿Se guardó bien en `leads-xb`? (`valor_diagnostico`, `diag->>'diagnostico_summary'`).
2. ¿`diag_build_odoo_payload()` devuelve `intension` con el texto correcto y los campos `diag_riesgo_label`/`diag_resultado_texto` no vacíos?
3. ¿Llegó el webhook a n8n? (revisar ejecuciones del workflow `5P9PAd7mknoJAZAf`).
4. ¿El lead en Odoo tiene `stage_id=10`, `x_studio_intencion_1` correcto, y los campos `x_studio_diag_*` poblados?
5. Para WhatsApp needs_info/not_ready: ¿tiene `x_nurture_*_source = 'n8n_post_create_pending'`? ¿tiene teléfono? (sin teléfono la acción no manda nada, silenciosamente).
6. Para el email de `ready_for_meeting`: ¿la campaña 9 está `running`? ¿el lead no tiene ya `x_studio_fecha_agenda_dt`/`x_studio_link_agenda` (eso lo saca del dominio)?

---

## 5. Pendientes conocidos al cierre de esta bitácora (2026-09-16)

- **`gracias-por-tu-registro` — auditoría del 2026-09-20 (14/20), sin corregir en el PR #76**: (P1) `--gold-ink #a9741f` da 4.03:1 sobre blanco y 3.65:1 sobre `#faf3e4` en texto pequeño (`.eyebrow`, `.pa-badge` de 10.9 px, `.fav` de 9.9 px); la barra fija móvil `.stickybar` lleva `aria-hidden="true"` pero contiene enlaces enfocables; la consola de producción avisa que el **Meta Pixel `687519373002559` no está disponible en este dominio por sus "traffic permission settings"** (se arregla en Events Manager, no en el repo); TikTok Pixel rechaza eventos con "Invalid Event Name Format" y "Missing content_id". (P2) 10 de 24 elementos interactivos miden menos de 44 px (enlaces "Leer ↗", footer, logo del footer); textos de 9.9–13 px; el foco `#2a5580` casi no se ve sobre fondos oscuros; jerarquía h1/h2 plana en el resto de la página; la página mide ~9600 px en móvil. (P3) tres mosaicos de icono sobre h3, cuatro etiquetas distintas del mismo CTA en el resto de la página, "gratis" repetido en la barra fija y en CTAs de otras secciones, y el logo del footer sigue siendo `Recurso-7.png` de WordPress. Además esta página usa Open Sans/Poppins y `#0e2438`, mientras `reserva-pendiente` usa Inter y `#0d2636`: decidir qué identidad manda en todo el embudo.
- **`reserva-pendiente` (PR #75) — decisiones pendientes del usuario**: (a) el popup y el botón dicen "Reserva una llamada gratuita" (viene de la referencia): la landing de producción `crea-tu-llc-en-usa/gracias-por-tu-registro` ya ofrece una "asesoría gratuita … por Zoom, sin compromiso", lo que respalda el texto, pero falta confirmación explícita del usuario; (b) las etiquetas de CTA no son uniformes (hero "Agenda tu asesoría gratuita", header "Elegir horario", fijo móvil "Elegir mi horario", popup "Reserva una llamada gratuita"); (c) mezcla de tú/usted heredada de la referencia ("Comience" y "Si tiene preguntas…" frente a "Selecciona…"); (d) Zcal vuelve a pedir nombre, correo y WhatsApp aunque la página dice "Sin repetir formularios": se pueden prellenar con `name`, `email` y `smsPhone` en la URL (como hacen las landings de `leads-landing`), no implementado; (e) `<title>` y `og:description` conservan el copy anterior ("Elige tu horario…"); (f) la landing `gracias-por-tu-registro` ya publica "+5.000 empresas incorporadas · 10 años · Partner de Mercury & Relay" y Trustpilot 4,3/5, así que esas cifras son de la empresa y pueden usarse aquí si el usuario lo aprueba; "150 países", ONU, Techstars y domain (de la referencia de diseño) siguen sin respaldo en el repo.
- **Entorno de desarrollo del repo (2026-09-20)**: `astro dev` no arranca desde una copia en la unidad virtual de Google Drive (`G:`): un `npm install` fallido dejó ~119 de 521 paquetes de `node_modules` con `package.json` ausente o truncado (errores EBADF/EPERM). Reinstalar con `pnpm install --frozen-lockfile` en un disco local. `package-lock.json` está **obsoleto** (Astro 5 frente a Astro 7 en `package.json`): el lockfile vigente es `pnpm-lock.yaml` (`packageManager: pnpm@9.15.9`, PR #7), no usar `npm ci`. En entornos con agente, Astro 7 lanza `astro dev` en segundo plano y lo mata a los 30 s si no arranca; forzar modo directo con `ASTRO_DEV_BACKGROUND=1`.
- **Race condition en sync a Odoo confirmada con datos reales (lead 4076, 2026-09-15)**: cada cambio de camino en el resultado (`goGuide`/`goAdvisor`/`goPlatform`/`switchToWhatsappFirst`) llamaba `pushLeadUpdate()` de inmediato, disparando su propio pipeline completo (Cloudflare -> Supabase `leads-xb` -> trigger `diag_leads_xb_sync` -> n8n Paso 1b -> Paso 2 -> Odoo) en paralelo para el mismo `lead_id`. Un usuario cambiando de camino 2 veces en 8s generó 3 ejecuciones simultáneas de Paso 2 (n8n exec ids 142021/142022/142024, todas a las 23:30:2x) compitiendo por escribir el mismo lead Odoo 4076. Al menos una corrida resolvió `resolved_lead_id="4076"` correctamente (confirmado leyendo el runData de la ejecución 142024), pero el estado final en Odoo quedó sin `tag_ids`, sin `x_studio_diag_riesgo/resultado`, sin `x_nurture_*_source` — la corrida que terminó de escribir último ganó, y fue la que cayó en la rama de error (`sync_error: "sin resolved_lead_id: revisar subworkflow Odoo"` en `leads-xb`, pese a que el dato en Supabase es correcto). Bug secundario hallado de paso: `inferIntention()` en Paso 2 (nodo "Normalize Lead Identity") no reconoce el valor crudo `intension` que manda esta landing cuando no matchea ninguna de las 3 frases canónicas, cayendo al default `needs_info` aunque `wants_zoom_meeting` sea `"si"`.
  - **Fix aplicado (cliente, PR #68)**: `pushLeadUpdate()` en A y B ahora debounce de 1.5s con número de secuencia — si el usuario cambia de camino de nuevo antes de que venza el timer, se cancela el envío anterior. Reduce la frecuencia de la carrera, no la elimina del todo (el cliente no controla el orden de llegada al servidor).
  - **Fix pendiente (n8n, manual)**: `Odoo | Tag valor` y `Odoo | Nota diagnostico` en Paso 1b (`5P9PAd7mknoJAZAf`) tienen `onError: continueRegularOutput` — si el write a Odoo falla, la ejecución sigue como si nada, invisible. Cambiar "On Error" a "Stop Workflow" (default) en ambos nodos desde la UI de n8n — bloqueado para hacerlo por API en esta sesión (permiso de producción), pendiente de que el usuario lo aplique manualmente.
  - **Lead Odoo 4076** sigue sin tag/campos de diagnóstico corregidos — pendiente de re-disparar `diag_push_to_odoo('l_bf7664c4-a5b8-451c-a9c5-4848990656da')` a mano (una sola vez, sin competencia) si el usuario lo pide.
- **PR #60** (WhatsApp obligatorio) abierto, conflicto ya resuelto contra `main`, esperando aprobación explícita del usuario para el merge.
- **`x_studio_diag_resumen_tabla`** puede llegar vacío si la telemetría del lead no cubrió todas las preguntas del quiz (visto en un lead sintético de prueba). No confirmado como bug real en leads reales — pendiente de verificar con un lead real re-sincronizado.
- **Lead Odoo 4008** (tier `needs_info`, con teléfono, nunca procesado) es el único lead histórico elegible para un backfill manual del WhatsApp de needs_info. No se disparó — requiere decisión explícita del usuario porque es un envío real e irreversible.
- **Limpieza de leads de prueba**: lead sintético Odoo 4070 (`EmailQA Test`) y su fila en Supabase (`l_qaemail_1789441015`) siguen sin borrarse.
- **Gap conocido, no cerrado**: la validación de email en cliente solo chequea formato; el chequeo de dominios desechables/prefijos basura solo existe server-side (`diag_contact_quality_ok`). Se preguntó si valía la pena espejarlo en cliente y no se decidió.
- **PR #74 — pendiente de verificar con el iframe real de Zcal en móvil**: el `width:100% !important` sobre `.cal-frame iframe` se probó simulando el bloque del calendario (el sandbox de desarrollo no tiene salida de red hacia `static.zcal.co`). Falta confirmar en un navegador con internet real que el iframe real de Zcal también llena el ancho completo en mobile.
- **Auditoría de funnel (2026-09-18, esta sesión)**: revisando Supabase (`v_diagnostico_funcion_embudo`, `zcal_bookings`) se encontró que `SCHEDULE_MODE=shadow` (variable del monorepo raíz, no de este repo — vive en el bridge/n8n que procesa el webhook de Zcal) hace que ninguna reserva real se escriba en producción; los 12 registros de `zcal_bookings` de la ventana 16–17 sep 2026 son todos `processing_mode:"shadow"`. Esto es INFRA fuera de este repo (ver sección 1) y sigue sin resolverse — bloquea que cualquier mejora de este PR se traduzca en citas reales hasta que se cambie esa variable a producción.

---

## 6. Convenciones para quien edite esta bitácora

- Agregar entradas nuevas **arriba** de la sección de pendientes correspondiente, no al final del archivo.
- Cuando un PR se fusiona, mover su fila de "Abierto" a "Fusionado" en la tabla (o regenerarla con el comando de la sección 2).
- Cualquier cambio hecho directo en Supabase/Odoo/n8n (fuera de un PR) **debe** documentarse aquí en la sección 4, con la fecha, porque es la única fuente de verdad fuera de esos mismos sistemas.
