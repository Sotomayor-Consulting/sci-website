# Bitácora del proyecto — sci-website

**Lectura obligatoria para cualquier agente (Claude u otro) que trabaje en este repo.**
Antes de tocar código del embudo `diagnostico-llc` (landings, `functions/api/diagnostico-*`, Supabase, Odoo o n8n), leer completo este documento. Ignorarlo lleva a repetir bugs ya corregidos o a romper piezas que viven fuera de git (Supabase, Odoo, n8n) y que este documento es la única fuente que las describe.

Última actualización: 2026-09-25.

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
| #78 | Fusionado | 2026-09-20 | feat(gracias-por-tu-registro): popup de ayuda tras 5 s de inactividad |
| #79 | Cerrado | 2026-09-20 | fix(reserva-pendiente): versionar las URLs del CSS para evitar hoja de estilos vieja en caché — su cambio se fusionó dentro de #80 |
| #80 | Fusionado | 2026-09-20 | feat(reserva-pendiente): hero premium (titular en 3 líneas, indicadores, CTA y tarjeta flotante) |
| #81 | Fusionado | 2026-09-20 | fix(agenda): el recorte del encabezado de Zcal tapaba los campos del formulario en móvil (primera corrección: alturas por paso y detector con fallback) + logo de gracias +10 % |
| #82 | Fusionado | 2026-09-20 | fix(agenda): en móvil no se recorta nunca el iframe de Zcal (horas y formulario siempre visibles), tarjeta a borde completo en <360 px y cabecera de gracias que se esconde sobre el calendario |
| #85 | Abierto | 2026-09-25 | feat(reserva-pendiente): mensaje del hero alineado a la pieza publicitaria "LLC + Banca + Cobros" y se elimina el disclaimer regulatorio |
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
- Hero centrado (revisión "premium" del 2026-09-20, PR #80). Orden, de arriba abajo: etiqueta fina **"Agenda Pendiente"** con icono de reloj dorado (`schedule`, no un check: la agenda aún no está reservada) › preheadline **"Da el siguiente paso"** (dorado, peso 600, dentro del `<h1>` como `.hero-kicker`, con un ": " solo para lectores de pantalla) › titular en 3 bloques `.hero-line` "Tu negocio en Estados Unidos, / estructurado para operar / **globalmente**" (peso 700; "globalmente" en dorado, peso 500 y 2 px más grande; en ≥768 px cada bloque es `nowrap`) › propuesta de valor "Incorpora tu LLC, organiza tu estructura bancaria y mantén tus obligaciones al día desde una sola plataforma." (a propósito no promete que la apertura bancaria esté garantizada) › tres indicadores con icono lineal dorado **Estructura · Banca · Cumplimiento** (`.hero-indicators`, mismo orden que la frase anterior) › CTA "Agenda tu asesoría gratuita →" (`.hero-cta`: 50 px, radio 10 px, flecha SVG fina) hacia `#calendario` (scroll suave en la misma página; el calendario queda compacto y con las fechas a la vista) › línea de confianza "Asesoría personalizada · Por Zoom · En español" (`.hero-points`, texto con puntos). **El dorado se reserva a "Da el siguiente paso", "globalmente" y los iconos**; el resto es blanco o azul-gris. Pesos a propósito distintos para dar jerarquía (700 titular › 600 preheadline y CTA › 500 indicadores y acento › 400 texto). Fondo: azul `#0d2636` con degradado vertical casi imperceptible. Los logos de Mercury y Relay **ya no van en el hero** (para no sugerir una alianza oficial); `public/mercury.svg` y `public/relay.svg` siguen usándose en `diagnostico-llc`. El logo del nav mide 72 px en móvil y 83 px en escritorio (+~15 % respecto a la revisión anterior) con más margen lateral.
- **Tarjeta del calendario flotante (trampa de CSS):** `#calendario` tiene margen superior negativo (-64/-80 px) para subir sobre el hero. Su contenedor `<div class="bg-background flow-root">` **necesita `flow-root`**: sin él el margen se colapsa a través del contenedor y su fondo claro tapa los últimos 80 px del hero, de modo que la tarjeta queda pegada al borde en vez de flotar. La tarjeta tiene radio 14 px, borde casi imperceptible y sombra en capas muy suave; el título es `.calendar-title` (18/21 px) y el subtítulo `.calendar-sub` (13 px).
- **No hay cifras ni afirmaciones sin verificar** (la referencia de diseño traía "5.000 empresas", "150 países", ONU, Techstars, domain: no se copiaron). **No se menciona duración**: el usuario pidió quitar "30 minutos" y el widget en vivo mostró "60 min" el 2026-09-20, mientras las notas de `leads-landing` dicen "dura 30 min, slug /60min": verificar en Zcal.
- Popup de ayuda (`<dialog id="help-popup">`): aparece tras 5 s sin interacción, una vez por sesión (`sessionStorage["sci_help_popup_seen"]`). No se muestra si la pestaña está oculta, si el calendario está a la vista, ni si el usuario ya hizo clic dentro del iframe. Ofrece "Reserva tu asesoría gratis" (cierra y baja a la agenda; antes decía "llamada", pero el negocio **no hace llamadas**: es una reunión por Zoom, corregido el 2026-09-25) con la nota "Asesoría gratis, sin compromiso." y WhatsApp (`https://api.whatsapp.com/send?phone=17542252904&text=Hola.%20Me%20gustar%C3%ADa%20pedir%20mas%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20Sotomayor%20Consulting.`).
- CTA fijo de móvil: solo aparece con scroll mientras no se ven ni el CTA del hero ni el calendario, y solo en móvil (`md:hidden`).

**Tracking:** GTM y TikTok Pixel no cambian. Eventos nuevos: `cta_hero_calendar`, `cta_popup_calendar`, `cta_popup_whatsapp` y `help_popup_shown`. Los que contienen "calendar" disparan también `Contact` de TikTok (lógica preexistente del script).

**Recorte del encabezado de Zcal (parte frágil):** el iframe es de otro dominio (no se puede inyectar HTML/CSS y no hay opción oficial: `embed=1&embedType=iframe` sigue mostrando el encabezado). Se oculta el encabezado interno (avatar, nombre, título del evento, duración) con `.agenda-viewport` (container query) › `.agenda-crop` (`overflow:hidden`) › iframe con `margin-top` negativo:

| Ancho del iframe | El encabezado de Zcal termina en | Recorte (`--crop`) |
|---|---|---|
| < 440 px | 305 px | 325 px |
| 440–599 px | 273 px | 293 px |
| ≥ 600 px | 300 px | 320 px |

- Solo la vista inicial (calendario) tiene ese encabezado; las vistas de horas y de formulario empiezan arriba del todo y quedarían recortadas. Zcal no envía `postMessage`, pero cada avance de vista añade una entrada al historial de la pestaña (las flechas de mes no): un `setInterval` compara `history.length` e ignora los cambios de `location.hash` propios (las anclas a `#calendario` también suman historial). **Máquina de pasos (PR #81):** sin `data-step` = calendario recortado (480 px); primer avance → `data-step="times"` (recorte 0, alto 760 px; 820 en ≥600 px); segundo avance → `data-step="form"` (alto 1080 px; 1240 en ≥600 px). En cada avance, si la tarjeta quedó fuera de pantalla, se lleva al inicio (`scrollIntoView`) para que se vea el comienzo de la vista nueva.
- **Bug corregido en los PR #81 y #82 (2026-09-20): el recorte tapaba las horas y los campos del formulario en móvil.** Causas: (1) el detector solo veía `history.length`, que el navegador **satura en 50 entradas** (con 50 deja de crecer y el detector queda ciego) y que **en teléfonos reales no fue fiable** (el usuario seguía viendo cortadas las horas tras elegir fecha); con el detector ciego el recorte de 325 px se quedaba aplicado; (2) el alto fijo de 760/720 px era menor que el formulario (medido: 892 px en móvil de 341 px de ancho, 1011 px con errores de validación; 1055/1173 px en ≥600 px, donde Zcal añade el avatar encima). **Regla vigente: en móvil y táctil (`@media (pointer:coarse), (max-width:767px)`) NUNCA se recorta** (`--crop:0`, alto base 1040 px; `data-step="form"` sube a 1080/1240 px): se ve la cabecera de Zcal en el primer paso, pero horas y formulario quedan siempre visibles aunque el detector falle (se probó apagándolo con `History.prototype.length` fijo). Solo en escritorio con mouse se recorta, con la máquina de pasos: sin `data-step` = calendario recortado (480 px); primer avance → `times` (760/820 px); segundo → `form` (1080/1240 px); si `history.length ≥ 48` al empezar no se recorta, y si el teclado se abre (`visualViewport` −150 px) con el foco en el iframe se pasa a `form`. En cada avance, si la tarjeta quedó fuera de pantalla, se lleva al inicio. **Teléfonos de ≤ 359 px:** con 320 px el iframe quedaba de 286 px y Zcal cortaba la columna del domingo y la flecha de mes siguiente; la tarjeta del calendario va de borde a borde (`.calendar-card{margin-inline:-1rem}`) y el iframe recibe 318–320 px. Zcal restaura un borrador (fecha/hora elegidas) al recargar y hace el push él mismo: el detector lo trata como avance (correcto). Al probar en el navegador de pruebas usar una pestaña con historial corto.
- Limitaciones: en escritorio, si el usuario pulsa "Atrás" dentro de Zcal el encabezado reaparece (no se puede detectar) y el iframe conserva el alto del paso más avanzado (queda espacio en blanco debajo); si Zcal cambia su diseño hay que **volver a medir** (captura con Edge del enlace en un iframe de ancho fijo y buscar por bandas de píxeles dónde termina el encabezado; el alto del formulario se mide con `document.documentElement.scrollHeight` abriendo Zcal solo, con ese mismo ancho de ventana). Zcal no ofrece parámetro ni evento para ocultar su cabecera (docs de help.zcal.co/share/embed revisadas el 2026-09-20).

### 3.7 Landing `crea-tu-llc-en-usa/gracias-por-tu-registro` (PR #76, 2026-09-20)

Página de "registro completado" que muestra el calendario de Zcal (`https://zcal.co/t/agendar-asesoria-llc/60min?embed=1`). Es un HTML autónomo con **CSS inline propio** (tokens en `:root`: navy `#0e2438`/`#0d2636`, dorado `#d6a144`, fuentes Poppins + Open Sans), no usa el Tailwind de `reserva-pendiente`. No escribe en Supabase/Odoo/n8n.

**Qué cambió (solo hero, nav, tarjeta del calendario y un script; el resto de la página no se tocó):**
- **Hero** con la estructura dictada por el usuario, en este orden: etiqueta "✓ Registro completado" › preheadline "Da el siguiente paso" (dentro del `<h1>`, con un ": " solo para lectores de pantalla) › headline "Incorpora tu LLC / o ponla en orden" (2ª línea dorada, peso 500) › propuesta de valor corta (2–3 líneas) › tres indicadores con iconos lineales (Estructura · Banca · Cumplimiento) › CTA "Agenda tu asesoría gratuita →" › confianza "Por Zoom · En español". "Gratuita" aparece **una sola vez** en el hero (a propósito: menos redundancia = más exclusividad). Se quitaron los logos de Mercury/Relay del hero porque la franja "Partners oficiales" queda justo debajo.
- **Nav**: header azul sólido `#0d2636` con `logo_azul_horizontal` (`public/images/logos/`, 320/640/853 px, borde azul sólido; mismos archivos que el PR #75). El azul del header debe coincidir con el del PNG o se ve un recuadro. El CTA dorado del header sigue apareciendo solo al pasar el CTA del hero.
- **Tarjeta del calendario**: blanca, flotante (máx. 640 px, solape ~28–44 px sobre el hero, ≥54 px de separación bajo el contenido del hero, sombra suave). Se eliminó la insignia "Asesoría gratuita · por Zoom" y el subtítulo largo sobre nombre/correo/WhatsApp; queda "Elige tu horario / Elige el día y la hora.".
- **Recorte del encabezado de Zcal** (avatar, nombre del equipo, título del evento, duración): mismo mecanismo y **misma regla que en `reserva-pendiente` (ver 3.6)**: solo en escritorio con mouse; en móvil/táctil no se recorta nunca (`.cal-crop`, alto base 1040 px, `data-step="form"` 1080/1240 px) y por debajo de 360 px la tarjeta `.book` va de borde a borde para que Zcal reciba ≥ 300 px. Medidas del recorte de escritorio según el ancho del iframe: < 440 px el encabezado termina en 305 px → 325; 440–599 px → 273 → 293; ≥ 600 px → 300 → 320 (alto 480 px). La cabecera de esta página es `position:sticky` (72/84 px): `html{scroll-padding-top:calc(var(--header-h) + 12px)}` y, en móvil, `.header.is-away` (JS en el scroll) la **esconde mientras la tarjeta del calendario pasa bajo ella**, para que nunca tape las horas ni los campos del formulario cuando el navegador enfoca uno. Logo del nav +10 % (50.8 px en móvil, 55.7 px en escritorio).
- **Script**: `sotoScrollToCalendar` ahora usa `block:'start'` (antes `'center'`) para que la tarjeta quede bajo el header con las fechas a la vista; el `scroll-margin-top` sigue la altura del header (`--header-h`: 72 px móvil, 84 px escritorio). El tracking (`data-cta`, `data-scroll-calendar`, `data-track-schedule`, GTM/TikTok/Meta/CAPI) no cambió.

**Hallazgos de la auditoría del 2026-09-20 que este PR NO corrige** (para próximos pasos): ver "Pendientes" (sección 5).


**Foto de fondo del hero (2026-09-21, misma en 3.6 y 3.7):** el hero lleva una foto de rascacielos (origen `src/images/Hero_Sotomayor.avif`) **debajo** del azul, para que el tema sea "business" sin perder contraste. Archivos en `public/images/hero/`: `hero-business-1920.avif` (150 KB), `-1280.avif` (82 KB) y `-m-720.avif` (60 KB, recorte vertical solo para ≤700 px). Markup: `<div class="hero-bg" aria-hidden="true"><picture>…</picture></div>` como primer hijo de `.hero`, con `fetchpriority="high"`. CSS: `.hero{position:relative;isolation:isolate}`, `.hero-bg{position:absolute;inset:0;z-index:-1;overflow:hidden}`, imagen `object-fit:cover` y velo azul `linear-gradient(rgba(13,38,54,.90) → .80 → rgba(16,45,69,.94))` en `.hero-bg::after`. **Trampa:** `.hero` debe ser `position:relative`; sin eso la foto se ancla al viewport y tapa el header (pasó en `reserva-pendiente`). En `reserva-pendiente` el CSS va en `styles.css` (idéntico en `src/` y `public/`, versión de caché subida a `?v=20260921a`), no en Tailwind, así que no hay que recompilarlo. Mismo patrón que `.hero-bg` de `diagnostico-llc`. **Nav y hero alineados con `gracias-por-tu-registro` (2026-09-21, solo en 3.6):** el usuario eligió `gracias-por-tu-registro` como referencia de equilibrio, así que `reserva-pendiente` copia su sistema visual sin cambiar su texto: Poppins (titular, etiqueta, indicadores, CTA) + Open Sans (propuesta de valor y línea de confianza), dorado `#d6a144` (kicker, última línea del titular, iconos, punto separador), titular `clamp(1.85rem, .8rem + 4.6vw, 3.6rem)`, CTA de 48 px con radio 8 px, etiqueta de 20 px con icono en círculo dorado (aquí un reloj, no un check) y `padding-top` del hero `clamp(52px,7vw,104px)`. Lo de arriba sobre "peso 700/500", tamaño de "globalmente" y `nowrap` en ≥768 px **ya no aplica**: ahora `nowrap` solo en ≥960 px (con la tipografía grande, a 768 px la primera línea desbordaría). **Nav:** ya no usa Tailwind; es `.site-header` (sticky, mismo ancho de contenedor que gracias: `min(1120px, 100% - 2·gutter - 8px)`, logo 72,2/83,3 px, `--header-h` 96,2/115,3 px). El CTA "Elegir horario" del header es dorado, solo escritorio, y **aparece solo al pasar el CTA del hero** (IntersectionObserver con `rootMargin:-70px`; clase `.js` en `<html>` desde el `<head>`); en móvil/táctil la cabecera se esconde (`.is-away`) mientras la tarjeta del calendario pasa bajo ella, igual que en 3.7. `html{scroll-padding-top}` sigue a `--header-h`; **no** poner `scroll-margin-top` extra en `#calendario` (se suma al padding y la tarjeta queda 130 px más abajo). `--hero-overlap` (64/80 px) debe coincidir con el margen negativo `-mt-16 md:-mt-20` de `#calendario`. Las fuentes nuevas se piden en el `<head>` (Poppins 500/600/700, Open Sans 400); el resto de la página sigue en Inter. **SEO (2026-09-21):** todas las landings del embudo llevan `<meta name="robots" content="noindex,nofollow">`: `diagnostico-llc`, `diagnostico-llc-b`, `gracias-por-tu-registro`, `leads-landing/*` y, desde hoy, `reserva-pendiente` y `leads-landing/asesoria-llc-usa-diagnostico-agenda` (les faltaba). `robots.txt.ts` deja pasar a Googlebot (`Allow: /`), así que el `noindex` sí se lee; no bloquear esas rutas en robots.txt o el meta dejaría de verse. **Nav estándar y barra fija (2026-09-21, prueba en móvil real sobre el preview):** (1) el `logo_azul_horizontal` original trae ~25 % de aire arriba y abajo (el dibujo ocupa solo el 49 % del alto), por eso con logo de 72 px la barra de 96 px se veía enorme frente a un logo visible de ~35 px. Se generaron `logo_azul_horizontal-trim-368.png` y `-552.png` (recortados al dibujo, 4,43:1, borde azul sólido) y el estándar pasó a **barra de 66 px con logo de 40 px (34 px en ≤430 px)**, que es lo que ya usaban `leads-landing/*` (con `Recurso-4.png`, que viene recortado). Aplicado en `gracias-por-tu-registro`, `reserva-pendiente` (`--header-h: 66px`) y `diagnostico-llc`/`-b` (`.logo-bar` padding 13 px, logo 40 px; el `scroll-margin-top:88px` de los pasos se dejó: solo da más aire). El logo del footer de `reserva-pendiente` sigue con el PNG sin recortar (48 px de alto, no se tocó). **No estandarizado aún:** `leads-landing/asesoria-llc-usa-diagnostico-agenda` (header blanco de 82/70 px con logo en chip blanco) y el color/alineación (leads-landing = blanco con logo azul y CTA ghost; gracias/reserva = azul con logo a la izquierda; diagnostico = azul centrado sin CTA). (2) **Barra fija inferior de móvil (`.stickybar`): regla "un solo CTA activo a la vez"** — se muestra solo cuando no hay a la vista ningún `a[href="#agendar"]` (fuera de `.stickybar`, `.header` y `<dialog>`) ni el formulario/tarjeta `#agendar`; antes en `gracias-por-tu-registro` salía en la primera vista junto al CTA del hero. Mismo bloque JS en `gracias-por-tu-registro`, `abrir-llc-primera-vez` y `corregir-llc-existente` (estas dos antes la mostraban al pasar el hero y la escondían solo en el formulario, así que convivía con los CTA de sección). En `gracias-por-tu-registro` el CTA del header se oculta en ≤820 px para no duplicar la barra. `reserva-pendiente` ya cumplía la regla (umbral de scroll + CTA del hero + calendario) y `diagnostico-llc`/`-b` solo muestran su `sticky-cta` en la pantalla de resultado, al salir de la vista el CTA en línea. **Barra dorada bajo el nav (2026-09-21):** `gracias-por-tu-registro` y `reserva-pendiente` llevan una barra dorada `#d6a144` de 2 px (pseudo-elemento `::after` del header, `position:absolute; bottom:0`, no cambia el alto de 66 px; por eso el header debe ser `position:sticky/relative`). En `reserva-pendiente` va en `styles.css` (versión de caché `?v=20260921e`). Las demás landings (`leads-landing/*`, `diagnostico-llc*`) aún no la tienen.

**Foto de fondo del hero (2026-09-21, misma en 3.6 y 3.7):** el hero lleva una foto de rascacielos (origen `src/images/Hero_Sotomayor.avif`) **debajo** del azul, para que el tema sea "business" sin perder contraste. Archivos en `public/images/hero/`: `hero-business-1920.avif` (150 KB), `-1280.avif` (82 KB) y `-m-720.avif` (60 KB, recorte vertical solo para ≤700 px). Markup: `<div class="hero-bg" aria-hidden="true"><picture>…</picture></div>` como primer hijo de `.hero`, con `fetchpriority="high"`. CSS: `.hero{position:relative;isolation:isolate}`, `.hero-bg{position:absolute;inset:0;z-index:-1;overflow:hidden}`, imagen `object-fit:cover` y velo azul `linear-gradient(rgba(13,38,54,.90) → .80 → rgba(16,45,69,.94))` en `.hero-bg::after`. **Trampa:** `.hero` debe ser `position:relative`; sin eso la foto se ancla al viewport y tapa el header (pasó en `reserva-pendiente`). En `reserva-pendiente` el CSS va en `styles.css` (idéntico en `src/` y `public/`, versión de caché subida a `?v=20260921a`), no en Tailwind, así que no hay que recompilarlo. Mismo patrón que `.hero-bg` de `diagnostico-llc`. **Logo del header (2026-09-21):** en `gracias-por-tu-registro` mide igual que en `reserva-pendiente` (72,2 px de alto en móvil, 83,3 px en escritorio; `sizes` 193/224 px). Por eso `--header-h` pasó a 96,2/115,3 px (logo + 12/16 px de aire arriba y abajo, como el `py-3 md:py-4` de reserva); si se cambia el logo, hay que cambiar `--header-h` a la vez, porque de él dependen `scroll-padding-top` y `scroll-margin-top`.
---

### 3.8 Popup de ayuda en `gracias-por-tu-registro` (PR #78, 2026-09-20)

Se añadió a `crea-tu-llc-en-usa/gracias-por-tu-registro` el mismo popup por inactividad que tiene `reserva-pendiente` (3.6). Solo cambia `gracias-por-tu-registro/index.html` (CSS `.help-popup*`, un `<dialog id="help-popup">` antes de `.stickybar` y un bloque JS dentro del `DOMContentLoaded`).

- **Comportamiento**: `<dialog>` nativo con `showModal()`; se abre a los 5 s sin `pointerdown/pointermove/keydown/scroll/wheel/touchstart`, una vez por sesión (`sessionStorage['sci_help_popup_seen']`). No se abre si la pestaña está oculta, si `#agendar` ocupa la zona central de la pantalla o si el iframe de Zcal tiene el foco (en esos casos rearma el temporizador). Cierra con la X, "No, gracias, ya lo averiguaré.", clic en el fondo y Esc.
- **Salidas**: "Elegir mi horario" (cierra y llama a `sotoScrollToCalendar('help_popup')`) y WhatsApp con `https://api.whatsapp.com/send?phone=17542252904&text=Hola…` (el mismo de `reserva-pendiente`; la barra fija móvil sigue usando `wa.link/jx59a9`).
- **Copy**: tuteo (como el resto de la página), sin duración ni "gratuita" ("Sin compromiso."). El popup no se oculta por la barra fija móvil: el `<dialog>` la tapa mientras está abierto.
- **Tracking**: `help_popup_shown` (dataLayer), `cta_click` con `popup-calendar`/`popup-wa` (handler genérico de `a[data-cta]`; el de WhatsApp dispara `Contact`) y `calendar_scroll_cta_clicked` con `source_context: help_popup`. Nota preexistente: el CTA del hero se registra con `source_context: other` (falta mapear `.hero` en el handler).

### 3.9 Google Tag Manager y Cloudflare Rocket Loader (2026-09-21)

- Se retiró `@astrojs/partytown` del proyecto. GTM `GTM-TNRQGDM` vuelve a cargarse con el snippet oficial asíncrono en el hilo principal; el modo híbrido anterior (`text/partytown` en producción y script directo en debug/local) impedía una detección consistente en Tag Assistant y complicaba `dataLayer` y los píxeles de terceros.
- Los scripts de arranque de GTM en `MainLayout.astro` y `GoogleTagManager.astro` llevan `data-cfasync="false"` porque Cloudflare Rocket Loader estaba reescribiendo su `type` y demorando su ejecución. Si Cloudflare ignora esa exclusión, desactivar Rocket Loader para las rutas afectadas mediante una Configuration Rule.
- El resolvedor DNS local `ifibramax.local` (`200.63.105.194`) devolvía NXDOMAIN para `www.googletagmanager.com`, mientras los DNS públicos sí resolvían. Si GTM sigue sin cargar tras el despliegue, separar este bloqueo de red local del comportamiento del sitio y probar con `1.1.1.1` o `8.8.8.8`.

### 3.10 Revisión de copy regulatorio para publicidad (2026-09-22)

- Se auditó el contenido público en español, inglés y portugués para evitar atribuir a SCI la emisión, aprobación u obtención directa de documentos, registros, identificadores, visas o cuentas decididos por autoridades y proveedores externos.
- Se actualizaron las páginas de LLC para profesionales, holdings internacionales, Stripe, servicios legales, visas, tributación, contabilidad, mantenimiento anual, el timeline y los datos estructurados. El patrón vigente es: SCI orienta, prepara documentación, apoya la presentación y da seguimiento; el Estado, IRS, autoridad migratoria, Stripe, banco u otro tercero decide aceptación, emisión, aprobación y plazos.
- Se corrigieron datos estructurados en español que apuntaban por error a `/contact/`, declaraban `pt-BR` y usaban el texto "abra sua LLC conosco".
- Se retiró `public/wp-content/uploads/2026/07/El-Escudo-Americano-Sotomayor-Consulting-International.pdf`: no estaba enlazado, no tenía fuente editable y seguía accesible con afirmaciones como "constituimos una LLC", "obtuvimos su EIN en tiempo récord" y aprobación de Stripe en 48 horas.
- `COPY_REGULATORIO_I18N.md` contiene el inventario Antes/Después y las labels camelCase propuestas en los tres idiomas. No se creó un catálogo runtime nuevo porque el proyecto localiza contenido mediante archivos TypeScript, JSON, Markdown y páginas Astro/HTML separados.
- El cierre de la auditoría también ajustó artículos educativos en ES/EN/PT: se sustituyeron "obtener el EIN" y plazos rígidos por "solicitar el EIN ante el IRS", reservando al IRS la emisión y el tiempo de procesamiento.

### 3.11 Bloque frontend de calendario Starwind (2026-09-22)

- Se creó `src/components/ui/blocks/calendario.astro` como calendario reutilizable de reserva de citas. Compone `Card`, `Button` y `Badge` de Starwind UI, ofrece navegación mensual, selección accesible de fecha y horario, zona horaria automática, resumen responsive y datos de demostración cuando no puede cargar disponibilidad.
- El bloque consulta por defecto `/api/slots` para el tipo de evento Calnode `test-SCI`. La nueva Cloudflare Pages Function `functions/api/slots.ts` valida `from`, `to` y `slug`, limita la consulta a 62 días y actúa como proxy hacia `https://calnode.sotomayorconsulting.com/v1/event-types/{slug}/slots`, con timeout de 10 segundos y sin caché. `CALNODE_API_KEY` permanece como secreto exclusivo de Cloudflare y nunca se entrega al navegador.
- Todavía no existe creación de reservas ni formulario de contacto en este bloque. Al confirmar solo emite el evento frontend `appointment:selected` con `date`, `time`, `startAt`, `timeZone` y `eventTypeSlug`; la integración posterior debe escuchar ese evento. Si falla la disponibilidad, el estado identifica de forma explícita que se está mostrando la vista de demostración.
- El rediseño toma únicamente la tarjeta de reserva de la referencia Vanguard (sin header, hero, formulario, testimonios ni footer). Usa `container-type: inline-size` en vez de depender del viewport: se apila en contenedores estrechos, pasa a información superior + calendario/horarios en dos columnas desde 736 px y adopta la composición 3/5/4 desde 1088 px. Así puede insertarse a ancho completo o dentro de columnas sin romper su layout.
- Verificación local: `pnpm astro check` terminó con 0 errores y `pnpm build` generó las 155 páginas. La respuesta real de Calnode queda pendiente de validar end-to-end con `CALNODE_API_KEY` en Cloudflare/Wrangler antes de conectar la creación de reservas.

---

### 3.9 CTA del hero dorado con brillo (2026-09-22)

En `gracias-por-tu-registro` y `reserva-pendiente` el botón principal del hero pasa de blanco a dorado, con el mismo recurso de brillo horizontal (`::after` con gradiente diagonal + `translateX` en loop) que `.path-primary` de `diagnostico-llc`/`-b`. Degradado `linear-gradient(135deg, #c0872e 0%, #d6a144 55%, #e4c078 100%)`, texto navy (`#0a1a2a`, no blanco: da ~6:1 de contraste contra ese dorado). El brillo cruza el 22% inicial de un ciclo de 3,4 s y descansa el resto; respeta `prefers-reduced-motion` (`display:none` en el `::after`). En `reserva-pendiente` el CSS va en `styles.css` (versión de caché `?v=20260921f`).

---

### 3.10 Landing `agendar-asesoria-llc` (2026-09-22, sin PR aún)

Página nueva, solo-calendario: nav + ticker + iframe de Zcal + footer, sin hero de venta ni FAQ. Pensada como destino del botón "Página siguiente" de formularios nativos (TikTok/Meta Lead Ads) y de anuncios ya calificados, cuando no hace falta repetir el argumento de venta.

- **Chrome superior**: `.top-chrome` es un único contenedor `sticky top:0` con el header (logo 40/34 px, igual que el resto del embudo — **si se reduce pierde peso frente al mensaje de al lado, ya pasó una vez**) y, debajo, un mensaje "kicker" dorado (no blanco: el blanco compite con el logo) "Elige la fecha y la hora de tu reunión". Bajo el header va un ticker: cinta de texto en loop CSS (dos copias idénticas, la 2ª `aria-hidden`, `translateX(-50%)` en 32 s) con la propuesta de valor en 6 frases separadas por flechas; se pausa al hover y se apaga con `prefers-reduced-motion` (oculta la copia duplicada para no dejar texto repetido y estático).
- **Sin recorte del encabezado de Zcal** (a diferencia de `gracias-por-tu-registro`/`reserva-pendiente`, ver 3.6/3.7): en vez de `overflow:hidden` + margen negativo, esta página hace un **scroll de la página completa, una sola vez al cargar**, para que la cuadrícula de fechas quede debajo del chrome fijo. No oculta nada de forma permanente (el usuario siempre puede volver arriba), así que es más seguro que el crop, a costa de ser aproximado: el alto real del encabezado de Zcal (avatar, equipo, título, duración — solo aparece en la vista inicial del calendario, ver 3.6) varía un poco entre cargas y no se puede medir desde fuera (iframe de otro dominio). Mitigaciones: `estimate` usa las mismas medidas que 3.6/3.7 (305/273/300 px según ancho), el scroll espera 2 s tras el `load` del iframe (1,2 s fue insuficiente: a veces se calculaba antes de que Zcal terminara de dibujar) y hay un límite (`Math.min(delta, frameBox.height - 420)`) para que nunca aterrice pasado el calendario, en blanco. **Si Zcal cambia su diseño hay que volver a medir**, igual que en 3.6/3.7.
- **Iframe sin crop**: el alto crece solo según el paso (`data-step`, mismo detector por `history.length` que 3.6/3.7): sin atributo 850 px, `times` 820 px, `form` 1080/1240 px (contenedor query ≥600 px). No hay rama especial de móvil/táctil porque, al no recortar, no hay nada que se pueda quedar tapado.
- **Tracking**: mismo GTM (`GTM-TNRQGDM`) y TikTok Pixel (`D5KFDEBC77U6BL6T7LDG`, con el mismo guard de producción que el resto), `page_name: "agendar_asesoria_llc_calendar"`. `noindex,nofollow`.
- **Pendiente de confirmar con el negocio**: el ticker incluye "Devolución del importe si no podemos prestar el servicio acordado" — es una promesa de reembolso, copy dado tal cual por el usuario; falta que alguien del equipo confirme que es exacta (ver 3.4 sobre revisiones de cumplimiento ya hechas en otras páginas).

---

### 3.12 Hero de `reserva-pendiente` con el mensaje de la pieza publicitaria (2026-09-25)

El usuario pasó una pieza publicitaria (imagen) con el mensaje que quiere en el hero de `reserva-pendiente` y pidió reemplazar el que había. Se mantiene la etiqueta "Agenda Pendiente", la foto de fondo y el CTA dorado con brillo (3.9); cambia el contenido:

- **Titular** en 3 líneas: "LLC **+** Banca **+** Cobros" / "todo lo que necesitas" / "**para operar en USA**" (dorado). Los "+" van en dorado (`.hero-plus`) sin cambiar el peso de las palabras; se quita el preheadline "Da el siguiente paso" (`.hero-kicker`, sin uso desde este cambio, la regla CSS se deja por si se reutiliza).
- **Se elimina el párrafo de propuesta de valor** ("Incorpora tu LLC, organiza tu estructura bancaria…", `.hero-sub`) y **se elimina el disclaimer regulatorio** ("SCI es una consultora privada e independiente…") que pedía expresamente el usuario. La regla `.hero-sub` se deja en el CSS sin uso, documentado, por si vuelve a hacer falta.
- **`.hero-indicators`** pasa de 3 palabras sueltas en fila (Estructura · Banca · Cumplimiento) a **4 beneficios en columna** con icono + frase, alineados a la izquierda dentro de un bloque centrado: Incorporación guiada (`assignment_turned_in`), Banca empresarial (`account_balance`), Medios de cobro internacionales (`credit_card`), Acompañamiento en español (`groups`). Los iconos son Material Symbols Outlined (ya cargados en la página); se sumaron `assignment_turned_in`, `credit_card` y `groups` a la lista `icon_names` del `<link>` de fuentes.
- **CTA**: texto "Construye tu negocio en Estados Unidos →" (antes "Agenda tu asesoría gratuita →"); sigue enlazando a `#calendario` con el mismo `data-track-event="cta_hero_calendar"` (solo cambió el `data-track-label`, descriptivo).
- Se conserva la línea de confianza bajo el CTA ("Asesoría personalizada · Por Zoom · En español").
- `styles.css` idéntico en `src/pages/reserva-pendiente/` y `public/reserva-pendiente/`; no se tocó `tailwind.css` (no se añadieron clases de Tailwind nuevas). Se subió el `?v=` de `styles.css` a `20260925a` (el contenido cambió; ver el problema de caché de 4 h documentado en la sección 5).

**Nota sobre el estado del repo (2026-09-25):** al empezar este cambio, el árbol de trabajo compartido en `G:\...\sci-website` tenía una cantidad grande de archivos en stage sin relación con esta tarea (componentes `.astro`, funciones de Cloudflare, migraciones de Supabase borradas), aparentemente de una operación de git a medias de otra sesión/persona sobre la misma carpeta de Google Drive. Este PR se preparó en un `git worktree` aislado (`git worktree add`) partiendo de `origin/main`, tocando solo los 3 archivos de `reserva-pendiente`, sin usar ni modificar ese árbol de trabajo. Queda pendiente que alguien revise esos cambios en stage del árbol compartido.

### 3.13 Timeline de consultoría con Starwind (2026-09-25)

- Se reemplazó `src/components/ui/timeline/timeline.astro` por una ruta de siete pasos compuesta con los componentes instalados `Card`, `Badge` y `Button` de Starwind UI y los iconos Tabler existentes. No se añadió ninguna dependencia.
- El componente ya no usa GSAP ni `ScrollTrigger`: en móvil presenta una línea vertical con tarjetas y en escritorio una cinta SVG serpenteante con tarjetas alternadas. La estructura usa un `<ol>`, conserva el aviso regulatorio y respeta `prefers-reduced-motion`.
- El tema azul/dorado está encapsulado mediante tokens semánticos dentro del bloque para que las piezas Starwind mantengan sus variantes sin depender del tema claro u oscuro de la página contenedora.
- El componente sigue siendo compartido por `/start`, `/en/start` y `/pr/start`; su contenido continúa en español, igual que antes de este rediseño. Si esas dos rutas localizadas se publican, queda pendiente suministrar copy en inglés y portugués o parametrizar el componente.
- Verificación local: `pnpm astro check` terminó con 0 errores y `pnpm build` generó las 156 páginas. Persisten únicamente los hints y warnings preexistentes del repositorio (colecciones ausentes, rutas duplicadas y dos SVG incompatibles con `astro-icon`).

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
- **`reserva-pendiente`: CSS en `public/` con caché de 4 h (2026-09-20, PR #79)**: Cloudflare sirve `/reserva-pendiente/tailwind.css` y `styles.css` con `Cache-Control: public, max-age=14400`, así que un visitante que ya tenía la hoja anterior veía el HTML nuevo con CSS viejo (el CTA del hero salía sin padding ni bordes redondeados: `px-8`, `py-3`, `rounded-lg`, `min-h-[46px]`, `shadow-button` no existían en la hoja anterior). Los `<link>` de `index.html` llevan ahora `?v=…` (valor vigente en el HTML: `20260920l`; el de `styles.css` es independiente, actualmente `20260925a`). **Cada vez que se cambie `public/reserva-pendiente/*.css` hay que subir ese valor** (y recompilar `tailwind.css` si se añaden clases de Tailwind).
- **`reserva-pendiente` (PR #75) — decisiones pendientes del usuario**: (a) el popup y el botón decían "Reserva una llamada gratuita" (venía de la referencia; corregido a "Reserva tu asesoría gratis" el 2026-09-25 porque no se hacen llamadas): la landing de producción `crea-tu-llc-en-usa/gracias-por-tu-registro` ya ofrece una "asesoría gratuita … por Zoom, sin compromiso", lo que respalda el texto, pero falta confirmación explícita del usuario; (b) las etiquetas de CTA no son uniformes (hero "Agenda tu asesoría gratuita", header "Elegir horario", fijo móvil "Elegir mi horario", popup "Reserva tu asesoría gratis"); (c) mezcla de tú/usted heredada de la referencia ("Comience" y "Si tiene preguntas…" frente a "Selecciona…"); (d) Zcal vuelve a pedir nombre, correo y WhatsApp aunque la página dice "Sin repetir formularios": se pueden prellenar con `name`, `email` y `smsPhone` en la URL (como hacen las landings de `leads-landing`), no implementado; (e) `<title>` y `og:description` conservan el copy anterior ("Elige tu horario…"); (f) la landing `gracias-por-tu-registro` ya publica "+5.000 empresas incorporadas · 10 años · Partner de Mercury & Relay" y Trustpilot 4,3/5, así que esas cifras son de la empresa y pueden usarse aquí si el usuario lo aprueba; "150 países", ONU, Techstars y domain (de la referencia de diseño) siguen sin respaldo en el repo.
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
