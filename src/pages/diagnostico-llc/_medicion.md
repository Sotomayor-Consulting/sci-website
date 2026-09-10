# Diagnóstico LLC — medición y test (Fase 6)

Complementa a `src/pages/leads-landing/_campanas-llc.md`. El archivo empieza por `_` para que
Astro no lo publique como ruta.

---

## ¿Listas para producción? (revisión fase 1)

**Todavía NO.** El funnel de fase 1 (quiz → gate → resultado con **1 sola CTA**, sin caminos
alternos ni "más información" → agenda Zcal) está implementado y probado local en A y B. Faltan:

### Bloqueantes
1. **Sin commit.** `diagnostico-llc/index.html` modificado y `diagnostico-llc-b/` sin trackear.
   El CI (`.github/workflows/astro.yml`) despliega **solo lo que está en `main`** (push → `pnpm astro
   build` → GitHub Pages). Nada sale hasta commitear + push.
2. **`pnpm astro build` nunca se ha corrido con estas landings.** Astro copia `src/pages/**/*.html`
   tal cual (mismo mecanismo que `leads-landing/*`, ya en producción), pero hay que hacer un build
   local y verificar `dist/diagnostico-llc/index.html` y `dist/diagnostico-llc-b/index.html`.
   `astro check` NO revisa `.html` — un error de sintaxis en el JS inline no lo detecta el CI.
3. **GTM `GTM-TNRQGDM`** debe estar publicado con los triggers/tags del §2. Sin eso los
   `dataLayer.push` no hacen nada.
4. **n8n:** CORS + OPTIONS en `leads-directos-tiktok-landing`; mapear `goal=retiros_utilidades`
   (persona Sebastián, B) a Odoo; rama Meta + `META_PIXEL_ID` real en `pixel-api-conversiones`.
5. **Meta Pixel = `__META_PIXEL_ID__`** (placeholder) en `SCI_TRACKING_CONFIG`. Para lanzar solo
   en TikTok no bloquea (el código hace guard `if (window.fbq)`); para Meta, sí.

### Verificado — alineado con el repo
- **Deploy = GitHub Pages** (`astro.yml`, push a `main` → `pnpm astro build` → `dist/`). **`pnpm
  build` NO corre en el CI** → `process-html.mjs` (terser `minifyJS` sobre el IIFE de ~1200 líneas)
  **no se ejecuta**. Las landings salen tal cual se escriben. ⚠ Si alguien cambia el workflow a
  `pnpm build`, ese riesgo vuelve — probar el minificado antes.
- **`vercel.json` NO aplica** en GitHub Pages → su CSP estricta (`frame-src 'self'`,
  `connect-src 'self'`, `script-src` sin hosts externos) **no bloquea** GTM / TikTok / Meta / el
  iframe de Zcal / flagcdn / fonts / el POST a n8n. (Si algún día se mueve a Vercel/Cloudflare con
  esa CSP, TODO el tracking, el webhook y Zcal se rompen — habría que ampliar la CSP.)
- **Sin guard de dominio** en el diagnóstico (a diferencia de las landings directas, que gatean a
  `*.sotomayorconsulting.com`): píxeles y webhook disparan en cualquier host, solo `?qa=1&no_pixels=1`
  / `?no_webhook=1` los apagan. Funciona en GitHub Pages y en el dominio propio.
- **100% autocontenidas** — no importan componentes Astro, Tailwind, Preline ni GSAP del repo; no
  dependen de `node_modules`. Portabilidad intacta.
- **`--base`:** si el sitio corre en dominio propio (custom domain en Settings→Pages), base `/` y
  las URLs quedan `/diagnostico-llc/`. Confirmar que NO es project page (`<org>.github.io/sci-website/`),
  porque entonces la URL llevaría `/sci-website/` delante.
- **Sitemap:** `@astrojs/sitemap` incluirá `/diagnostico-llc(-b)/` y `/leads-landing/*`. Son
  `noindex,nofollow` (Google los descarta) pero conviene un `filter` en `astro.config.mjs` para
  excluirlos del `sitemap-index.xml`. No bloquea.

### Checklist de salida (por landing, A y B)
- [ ] Commit + push a `main`.
- [ ] `pnpm astro build` local → revisar el `dist/` de ambas.
- [ ] GTM publicado con triggers/tags nativos (§2) + conversión `CompleteRegistration` y `Schedule`
      marcadas en TikTok Events Manager.
- [ ] n8n: CORS, `goal=retiros_utilidades`, rama Meta.
- [ ] `META_PIXEL_ID` real (si se lanza en Meta).
- [ ] QA en la URL de producción real con `?qa=1&no_pixels=1&no_webhook=1` + GTM Preview:
      recorrido completo A y B, cada evento nativo 1 vez con `event_id`.
- [ ] Evento Zcal `agendar-asesoria-llc/60min` prefila `name`/`email`/`smsPhone`/`a0` y el dominio
      de producción está permitido para embeber el iframe de Zcal.
- [ ] Consentimiento / fineprint validado por mercado.

La landing de diagnóstico es el **router de embudo** para tráfico frío de TikTok/Meta: quiz de
5 pasos → segmenta la etapa y la complejidad → reparte a 3 destinos (guía / plataforma
autoservicio `/start` / asesoría por Zoom). Comparte back-end, píxeles y evento de reunión con
las landings A/B.

> **Fase 8/9 — flujo vigente.** Pasos: hero → P1 → **nombre** → P2..P6 → **gate universal
> (apellido + correo)** → resultado con **1 CTA recomendada** + 2 enlaces de texto.
> - El evento de optimización de fase 1 (`Subscribe` etapa 1 · `CompleteRegistration` etapa 2-4,
>   value por etapa + 15 si `tech_interest ≠ ninguno`) se dispara **en el gate**
>   (`conversion_path = diagnostico_gate`), no por camino. Todo el que pasa el gate ya es un
>   lead con contacto.
> - Eventos nuevos: `quiz_name` · `path_chosen {path, recommended}` ·
>   `route_selected {destino, recommended_path, stage_id, complejidad, tech_interest}` ·
>   `guide_delivered` · `route_switch`.
> - Por camino: `InitiateCheckout` (platform, antes de `/start`) · `Schedule` (advisor, reserva Zcal) ·
>   `guide_delivered` (guide). `conversion_path` tras elegir = `diagnostico_<path>`.
> - **Fase 14/15:** la plataforma es **camino auxiliar** — nunca es la CTA recomendada, solo enlace
>   alterno. Al pulsarlo, `path_chosen {path:"platform", recommended:false}` y se muestra una
>   **pantalla puente** (`#confirm-wrap`, ganchos firstbase.io) con la CTA "Abrir mi empresa →".
>   El `InitiateCheckout` (value 40, o 90 si venía de ruta zcal) se dispara en **ese** clic
>   (`#cw-goplatform`), no en el enlace del informe — mide intención real, no curiosidad.
> - **Fase 16 (fricción):** WhatsApp del gate es **opcional** (se llena en ~parte del tráfico, no
>   el 100%). Resultado condensado: la CTA está arriba del fold, el detalle bajo `<hr>`. Nuevo
>   evento `route_switch {from:"advisor", to:"whatsapp_first"}` desde `#cal-wa` (bajo el calendario,
>   solo si hay `phone_e164`) → `contact_pref="whatsapp"` en el payload; el lead sigue tibio, n8n
>   debe encolarlo para contacto humano por WhatsApp, no como reunión agendada. Barra de progreso
>   con etiqueta "Pregunta N de 6".
> - P6 (`q6` / `tech_interest`) no cambia el ruteo; alimenta `cross_sell` en Odoo y el value del lead.
> - **Fase 10:** P3 = urgencia (`cobros`/`orden`/`impuestos`/`explorando`) → `lead_temp`
>   (frío/tibio/caliente) en el payload y en `route_selected`, para priorizar en n8n. `q3="explorando"`
>   + etapa ≤ 2 rutea a guía. El resultado es un informe (veredicto + track de 4 etapas + situación +
>   costo de esperar + "en la sesión sales con:"), no una lista de features.

---

## 0. Dos variantes del diagnóstico

| | **Diagnóstico A** — `/diagnostico-llc/` | **Diagnóstico B** — `/diagnostico-llc-b/` |
|---|---|---|
| Público | Lead SIN LLC / primera vez (frío) | Lead que YA TIENE una LLC con problemas (frío) |
| Par frío-directo | `leads-landing/abrir-llc-primera-vez/` | `leads-landing/corregir-llc-existente/` |
| P1 | ¿A qué se dedica tu negocio? (Servicios/Inversiones/Ecom/Otro) | ¿Qué te preocupa de tu LLC? (Cumplimiento/Estado/Banca/Revision) |
| Eje del quiz | **Madurez** → etapa 1-4 (Exploración…Optimización) | **Nivel de riesgo** → 1-4 (Al día…Riesgo alto) |
| `page_name` | `landing_diagnostico_llc` | `landing_diagnostico_llc_b` |
| `persona` / `landing_variant` | — | `llc_existente` / `b` |
| `goal` derivado | llc_nueva · inversion_patrimonio · banca_pagos · ordenar_llc | **cumplimiento · cambio_estado · banca_pagos · ordenar_llc** (taxonomía de Landing B) |
| Camino primario | `advisor` (agendar sesión) · `guide` en etapa 1 | `advisor` (agendar **revisión**, copy `advisor_correct`) · `guide` = **checklist de mantenimiento** solo si riesgo 1 + `q3="revision"` + facturación baja |
| Plataforma `/start` | Auxiliar (1 enlace alterno, pantalla puente Firstbase) | Casi nunca: solo alterno "abrir **otra** entidad" (holding/Corp) |
| `lead_temp` caliente | `q3` = impuestos / orden | `q3` = **multa** (5472/1120 atrasados) / **banca** |

**Motor compartido byte-a-byte** (tracking, gate, Zcal, pipeline de render, selector de país,
funciones de flujo). Solo divergen las constantes de contenido + `recommendedPathFor`/`altPathFor`/
`computeStage`/`chooseRoute`/`deriveGoal`/`deriveComplexity`/`leadTemp`. Un cambio de motor se
sincroniza con un diff entre los dos `index.html`.

### Webhook n8n (confirmado 2026-09)
- Flujo **`ZlOIIsMelQoHH8lk` = "Paso 1 - Tiktok Landing"**, activo. Webhook `POST /webhook/leads-directos-tiktok-landing`.
  Encadena: Odoo (`Call Lead en Odoo`) · TikTok Events API · Meta CAPI · Google Sheets · Baserow.
- **No devuelve CORS ni responde OPTIONS** (nodo Webhook con `options:{}`). El navegador no puede
  leer la respuesta → la landing usa retry + fallback `no-cors`, así que el lead SÍ llega server-side.
  Pendiente backend: añadir `respondToWebhook` con cabeceras CORS.
- n8n debe separar por `page_name` (`_b`) / `persona` / `landing_variant` para medir A vs B, y mapear
  el `goal` de B (`cumplimiento`/`cambio_estado`/`banca_pagos`) al mismo campo Odoo que Landing B directa.

### Zcal — migración de datos del gate (A y B)
`injectZcal(payload)` recibe el payload del gate y construye la URL con **`name` · `email` ·
`smsPhone` · `a0`** (idéntico a las landings A/B). Si el iframe no carga en 6 s (Zcal bloquea el
embed desde orígenes no permitidos, p. ej. `localhost`), `#cal-fallback` pasa a `--urgent` con el
enlace "abrir en pestaña nueva". En el dominio de producción el embed carga como en A/B.

---

## 1. Diccionario de eventos — proceso de marcado

> **Ruta cronológica paso a paso (guión de procesos) + checklist de verificación local:**
> `_eventos-tiktok.md`. Esta sección es la referencia; ese archivo es el recorrido.

**Dos funciones, una regla:** en el código, `track()` empuja SOLO a `dataLayer` (GTM decide);
`trackAdsEvent()` empuja a `dataLayer` + TikTok Pixel + Meta Pixel + CAPI n8n con el mismo
`event_id`. `trackAdsEvent()` tiene una **lista blanca** — solo dispara
`ViewContent · Contact · CompleteRegistration · Schedule · Subscribe · InitiateCheckout`;
cualquier otro nombre queda bloqueado. Ningún evento del quiz puede llegar a Ads "por accidente".

| Evento | Fn | Estándar | Meta map | Dispara (EXACTO, 1 vez por sesión) | `value` | Rol en Ads |
|---|---|---|---|---|---|---|
| `ViewContent` | `trackAdsEvent` | TikTok+Meta | `ViewContent` | al cargar la landing (una vez, `ViewContentTracked`) | — | audiencias, calidad de tráfico |
| `quiz_start` | `track` | — (custom) | — | clic en el botón del hero (`quizStartTracked`) | — | micro-conv / fricción. **NO va a Ads** salvo que GTM lo mapee a `ClickButton` (fallback de optimización) |
| `quiz_step_complete` | `track` | — | — | cada "Continuar" válido de P1..P6 (`step`, `question`, `answer`) | — | embudo interno. GA4/BigQuery, **nunca Ads** |
| `quiz_name` | `track` | — | — | al capturar el nombre (paso 2) | — | interno |
| `quiz_complete` | `track` | — | — | al entrar al paso 8 / gate visible (`quizCompleteTracked`) | — | terminó el quiz, aún sin datos |
| `lead_form_start` | `track` | — | — | primer foco en un campo del gate (`leadFormStartTracked`) | — | fricción del form |
| `Subscribe` | `trackAdsEvent` | TikTok+Meta | `Subscribe` | submit del gate **válido**, riesgo/etapa **1** | 0 | lead soft. **NO optimizar** (sesga a validadores) |
| `CompleteRegistration` | `trackAdsEvent` | TikTok | `Lead` | submit del gate **válido**, riesgo/etapa **2–4**. `conversion_path = diagnostico_gate` | 40 / 70 / 120 (+15 si `tech_interest ≠ ninguno`) | **optimización fase 1** |
| `route_selected` | `track` | — | — | al pintarse el resultado (`destino`, `recommended_path`, `stage_id`, `complejidad`, `lead_temp`) | — | qué recomendamos por segmento |
| `path_chosen` | `track` | — | — | clic en la CTA o la alternativa del resultado (`path`, `recommended` bool) | — | preferencia real vs recomendación |
| `route_switch` | `track` | — | — | `guide→advisor` (nudge) · `advisor→whatsapp_first` | — | rescate / preferencia |
| `InitiateCheckout` | `trackAdsEvent` | TikTok+Meta | `InitiateCheckout` | clic en `#cw-goplatform` de la pantalla puente de plataforma, antes de ir a `/start` | 40 (`selfserve_start`) · 90 (`selfserve_assisted`, venía de ruta zcal) | señal de intención hacia `/start` |
| `Contact` | `trackAdsEvent` | TikTok+Meta | `Contact` | **(pendiente — ver §Gaps)** al confirmarse "te escribimos por WhatsApp" (whatsapp_first) | — | lead que pidió contacto humano |
| `Schedule` | `trackAdsEvent` | Meta sí / TikTok custom | `Schedule` | reserva confirmada en Zcal — `postMessage` en cliente **+** webhook Zcal→n8n server-side (dedup por `event_id`) | — | **optimización fase 2 · = el CTA del video ("agenda tu reunión")** |
| `CompletePayment` | **solo n8n** | TikTok+Meta | `Purchase` | offline: lead "Ganado" en Odoo → n8n → Events API/CAPI (mismo `lead_id`) | valor real del contrato | **optimización de escala (fase 3)** |

### `value` graduado por nivel (etapa A / riesgo B)

| Nivel | A: etapa | B: riesgo | Evento del gate | `value` |
|---|---|---|---|---|
| 1 | Exploración | Al día | `Subscribe` | 0 |
| 2 | Estructuración | Ajustes | `CompleteRegistration` | 40 (+15 tech) |
| 3 | Formalización | Correcciones | `CompleteRegistration` | 70 (+15 tech) |
| 4 | Optimización | Riesgo alto | `CompleteRegistration` | 120 (+15 tech) |

### Reglas de proceso (para no marcar nada mal)

1. **El evento del gate es UNIVERSAL y se dispara EN EL GATE**, antes de elegir camino
   (`conversion_path = diagnostico_gate`). No depende de advisor/guide/platform. Elegir camino
   después re-envía el lead al webhook (`pushLeadUpdate` con `chosen_path`) pero **no** dispara
   otro evento de píxel.
2. **Un disparo por evento nativo por sesión** — cada uno con su guardia booleana. `ViewContent`
   una vez por carga.
3. **`event_id` se genera UNA vez** (`buildEventId(name, {lead_id})`) y se pasa igual al pixel del
   navegador y al POST del CAPI. TikTok y Meta deduplican por `event_id`. Nunca regenerarlo.
4. **`CompletePayment` solo server-side** (n8n, cuando Odoo marca "Ganado"). Nunca desde el navegador.
5. **`Schedule` = doble señal.** Cliente (`postMessage`, best-effort, puede fallar cross-origin) +
   webhook de Zcal → n8n (fiable). El conteo "de verdad" es el server-side; el cliente da velocidad.
   Dedup por `event_id` (mismo `lead_id`).
6. **`conversion_path` distingue el sub-camino dentro del mismo evento**, no crea eventos nuevos:
   `diagnostico_gate` · `diagnostico_advisor` · `diagnostico_guide` · `diagnostico_platform` ·
   `selfserve_start` · `selfserve_assisted` · `schedule_confirmed` · `whatsapp_first`.
7. **A vs B se separan por dimensión, no por evento.** Mismo nombre de evento; distinto
   `page_name` (`landing_diagnostico_llc` / `_b`) + `landing_variant` + `persona`. Las conversiones
   de Ads y GA4 se cortan por esas dimensiones.
8. **El payload lleva `route` (recomendación) y `chosen_path` (elección).** n8n rutea por
   `chosen_path`; el gap `route` ≠ `chosen_path` es una métrica de calidad de segmentación.
9. **QA obligatorio con `?qa=1&no_pixels=1&no_webhook=1`** + GTM Preview abierto ANTES de tráfico:
   recorrer las 3 rutas + los 2 `route_switch` + gate sin teléfono, y verificar que cada evento
   nativo dispara **una** vez y con `event_id`.

### Gaps a cerrar antes de escalar

- **`Contact` no se dispara hoy.** El camino `whatsapp_first` (Fase 16) solo hace `track("route_switch")`.
  Falta `trackAdsEvent("Contact", …)` en `switchToWhatsappFirst()` para que ese lead cuente en Ads.
- **`quiz_start` no llega a TikTok.** Si se quiere como evento de optimización de arranque
  (fallback si `CompleteRegistration` < 50/sem), GTM debe añadir un tag TikTok `ClickButton` sobre
  el trigger `quiz_start`.
- **`goal = retiros_utilidades`** (Diagnóstico B, persona Sebastián) — n8n debe mapearlo a Odoo
  junto a `cumplimiento` / `cambio_estado` / `banca_pagos`.
- **CORS del webhook** `leads-directos-tiktok-landing` (flujo `ZlOIIsMelQoHH8lk`) sigue pendiente.

---

## 2. GTM — tags y triggers (contenedor `GTM-TNRQGDM`)

El código ya empuja todo a `dataLayer`. GTM **no calcula nada**: solo reenvía. Proceso por evento:

**Para cada evento NATIVO** (`ViewContent`, `Subscribe`, `CompleteRegistration`, `Schedule`,
`InitiateCheckout`, `Contact`):

1. **Trigger** — Custom Event = nombre exacto del `event`. Añadir condición `page_name`
   `matches RegEx` `landing_diagnostico_llc(_b)?` si se quiere una sola etiqueta para A+B, o dos
   triggers separados para cortar A vs B.
2. **Tag TikTok Pixel** — Track Event. Mapear del dataLayer: `event_id`→`event_id` (dedup ON),
   `value`, `currency` (`USD`), `content_name`, `conversion_path`. Nombre de evento = el mismo
   (para `Schedule` en TikTok: evento **custom** `Schedule`, no estándar).
3. **Tag Meta Pixel** — usar `meta_event_name` del dataLayer (`Lead` para `CompleteRegistration`,
   igual para el resto) · `eventID` = `event_id` (dedup con el CAPI).
4. **Marcar en Ads:**
   - TikTok Events Manager → dejar disponibles para optimización: `CompleteRegistration` (fase 1),
     `Schedule` (fase 2), `CompletePayment` (fase 3). `ClickButton` solo si se activa el fallback.
   - Meta Events Manager → `Lead`, `Schedule`, `Purchase`.

**Eventos CUSTOM** (`quiz_start`, `quiz_step_complete`, `quiz_name`, `quiz_complete`,
`lead_form_start`, `route_selected`, `path_chosen`, `route_switch`, `guide_delivered`) →
**solo GA4 / BigQuery**. NUNCA un tag de TikTok/Meta sobre estos triggers (salvo el
`ClickButton` opcional sobre `quiz_start`).

**CAPI server-side** — el navegador y n8n mandan cada evento nativo con el MISMO `event_id`.
GTM no toca el CAPI; lo dispara `sendTikTokConversionsApiEvent()` desde la landing y el webhook
`pixel-api-conversiones` en n8n. Confirmar que ese webhook tiene rama Meta y `META_PIXEL_ID` real.

**Antes de publicar el contenedor:** recorrer el diagnóstico en GTM Preview con
`?qa=1&no_pixels=1` y ver que cada evento nativo aparece **una** vez, con `event_id`, `value` y
`page_name` correctos; que ningún `quiz_*` dispara un tag de Ads.

---

## 3. Estrategia de optimización (event laddering)

TikTok necesita ~50 conversiones/semana por ad group para salir de aprendizaje.

| Fase | Semana | Evento de optimización (TikTok, principal) | Por qué |
|---|---|---|---|
| 0 · fallback | solo si <50 CR/sem | `ClickButton` (= `quiz_start`, **requiere tag GTM nuevo**) | evita que el ad group no salga nunca de aprendizaje |
| 1 · arranque | 1–3 | **`CompleteRegistration`** | evento más profundo que alcanza ~50/sem con presupuesto de arranque. El gate = "regístrate" del guión |
| 2 · media | 3–6 | **`Schedule`** (cuando ≥50/sem) · o VBO sobre `CompleteRegistration` con `value` por nivel | `Schedule` **es el CTA del video** ("agenda tu reunión"). Es la conversión de negocio real |
| 3 · escala | 6+ | `CompletePayment` offline (lead Ganado en Odoo) | alinea la pauta con clientes que cierran / de mayor valor |

- **Nunca** empezar optimizando `Schedule` en frío: volumen bajo → el ad group no aprende.
- `InitiateCheckout` **no** es evento de optimización del diagnóstico (la plataforma es camino
  auxiliar). Solo se mira como métrica y sirve para campañas que van directas a `/start`.
- Un solo pixel (`D5KFDEBC77U6BL6T7LDG`) para las 5 landings; se separan por `content_name` /
  `conversion_path` / `page_name`, **no** por pixel.
- VBO (value-based optimization) sobre `CompleteRegistration`: activar cuando el evento sea estable;
  favorece niveles 3–4 (leads más maduros / más riesgo) por el `value` graduado.

---

## 4. Plan de test de campañas

Tres campañas de **prospecting** en paralelo, mismo público y presupuesto de prueba, distinto destino:

| Campaña | Destino | Hook del creativo |
|---|---|---|
| A | `/diagnostico-llc/` | duda / etapa ("¿necesitas una LLC o estás quemando dinero?") |
| B | `/leads-landing/abrir-llc-primera-vez/` (o `corregir-llc-existente`) | dolor directo ("abre tu LLC sin errores") |
| C | `app.sotomayorconsulting.com/start` | "empieza hoy tu LLC en minutos" |

**Métrica de decisión:** coste por reunión agendada · coste por registro iniciado en la app ·
show rate de las reuniones. NO el CPL crudo.

Duración mínima: hasta que cada campaña acumule ≥50 eventos de optimización/semana durante 2
semanas estables.

El parámetro del creativo (`?utm_content=` / `?hook=`) debe coincidir con el guión del video.

### Los 6 guiones aprobados (Docmost, sep-2026) → landing y hook

| # | Persona / guión | ¿Tiene LLC? | Landing | `?hook=` | H1 message-match |
|---|---|---|---|---|---|
| 1 | **Diego** — planificar antes de incorporar | No | **Diagnóstico A** `/diagnostico-llc/` | `diego` (`planificar`) | "¿La LLC que vas a incorporar funcionaría para tu modelo?" |
| 2 | **Valeria** — cobros internacionales | No / recién | **Diagnóstico A** | `cobros` (`dolares`) | "Tu negocio ya vende afuera. ¿Tu estructura está lista para cobrar global?" |
| 3 | **Carlos** — mantenimiento / cumplimiento | **Sí** | **Diagnóstico B** `/diagnostico-llc-b/` | `atrasadas` (`mantenimiento`, `cumplimiento`, `boi`) | "¿Declaraciones atrasadas en tu LLC? Mira qué tan grave es." · P1 → Cumplimiento |
| 4 | **Sebastián** — sacar dinero de la LLC para uso personal | **Sí** | **Diagnóstico B** | `utilidades` (`retiros`, `ganancias`, `dividendos`, `sueldo`) | "Tienes una LLC, ¿pero no sabes cómo usar sus ganancias para ti?" · P1 → **Retiros** |
| 5 | **Corporativo internacional** — holdings / trusts / multi-jurisdicción | Sí (opera) | **Diagnóstico A** (o asesoría directa) | `corporativo` (`holding`, `expansion`) | "Una empresa internacional necesita mucho más que ser incorporada." |
| 6 | **Alejandro y Marina** — inversión inmobiliaria | No | **Diagnóstico A** | `inmobiliaria` (`realestate`, `bienes`) | "¿Vas a invertir en bienes raíces? La forma de comprar importa." · P1 → Inversiones |

### CTA de los guiones vs. el diagnóstico

Todos los guiones cierran igual: **"Regístrate y agenda tu reunión gratuita."** El diagnóstico
lo cumple **en dos tiempos**: el gate ES el "regístrate" (captura apellido + WhatsApp + correo) y
el resultado rutea a "agenda" (camino advisor) para casi todas las personas. El único desajuste
es el **verbo**: el anuncio dice "agenda una reunión", la landing intercala 6 preguntas antes del
calendario. Se resuelve con el encuadre del hero, no cambiando el video:

- El hero debe decir explícitamente que la reunión llega al final: badge o línea
  *"Al terminar, agendas tu reunión — tu asesor la recibe con tu caso ya sobre la mesa."*
- El cuerpo de **todos** los guiones ya predica "analiza tu caso antes de actuar"
  (Diego "define cómo estructurarla antes"; Carlos "revisamos tu situación actual";
  Sebastián "antes de transferir dinero necesitas entender cómo") — el quiz **es** ese análisis,
  así que va con el mensaje del guión aunque no con el verbo del CTA.
- **Lane split recomendado:** personas 1, 2, 6 (exploratorias) → Diagnóstico A. Personas 3, 4
  (dolor puntual con LLC) → Diagnóstico B. Persona 5 (corporativo) → A o asesoría directa. Medir
  coste por reunión agendada por lane; si B-directo (`corregir-llc-existente`) convierte mejor
  para 3/4, mover ahí y dejar el diagnóstico como carril de "no sé qué me pasa".

### Persona 4 (Sebastián) en Diagnóstico B — implementado

- P1 nueva opción **"Sacar dinero de mi LLC para uso personal sin problemas fiscales"** (`filter="Retiros"`).
- `step1Insights.Retiros`: retiros vs distribuciones vs sueldo, cada uno declara/documenta distinto.
- `computeStage` fuerza **riesgo ≥ 3** con `filter="Retiros"` (necesita asesor, no checklist).
- `deriveComplexity` → alta. `chooseRoute` → `zcal`. `deriveGoal` → **`retiros_utilidades`** (goal
  nuevo; n8n debe mapearlo a Odoo junto a `cumplimiento`/`cambio_estado`/`banca_pagos`).
- Informe: `line` + `outcomes` específicos de retiro de utilidades (cómo retirar según estructura,
  qué documentar, si conviene cambiar de figura fiscal).
- Hook `utilidades`/`retiros`/`ganancias`/`dividendos`/`sueldo` → H1 del guión de Sebastián + P1 → Retiros.

---

## 5. KPIs del diagnóstico

- **Start rate** = `quiz_start` / `ViewContent`
- **Completion rate** = `quiz_complete` / `quiz_start`
- **Captura** = (`CompleteRegistration` + `Subscribe`) / `quiz_complete`
- **Reparto** = `route_selected` por `destino` (guide / selfserve / zcal) y por `complejidad`
- **Switch rate** = `route_switch` / `route_selected` de ese destino (¿el segmento rechaza la ruta que le damos?)
- **Agenda rate** = `Schedule` / (`route_selected` destino zcal)
- **Registro-app rate** = `InitiateCheckout` / (`route_selected` destino selfserve)
- **Coste por**: lead capturado · reunión agendada · registro-app iniciado

Cortes útiles: por `utm_campaign`, por `diag_stage_id`, por `diag_industria`, por `diag_complejidad`.

---

## 6. Checklist de QA antes de tráfico

- [ ] n8n: webhook `leads-directos-tiktok-landing` devuelve `Access-Control-Allow-Origin` y responde `OPTIONS`.
- [ ] n8n: mapea `goal`, `route`, `diag_complejidad` y los campos `diag_*` a Odoo (`crm.lead`).
- [ ] n8n: rama Meta en `webhook/pixel-api-conversiones` + `META_PIXEL_ID` real en `SCI_TRACKING_CONFIG`.
- [ ] `/start` lee `lead_id`, `diag`, `stage`, `suggested_state`, `email`, `advisor_review`, `priority`, `utm_*`, `ttclid` y une el registro con el lead del diagnóstico por `lead_id`.
- [ ] `/start` prefila el correo cuando llega `?email=` (no lo vuelve a pedir).
- [ ] GTM `GTM-TNRQGDM` publicado con triggers y tags de todos los eventos nativos.
- [ ] TikTok Ads: `CompleteRegistration` e `InitiateCheckout` visibles como eventos de optimización.
- [ ] Evento Zcal "Sesión Estratégica" (`agendar-asesoria-llc/60min`) prefila `name` / `email` / `smsPhone` / `a0`.
- [ ] Recorrido QA con `?qa=1&no_pixels=1&no_webhook=1`: las 3 rutas + los "route_switch" (guide→advisor, advisor→whatsapp_first) + gate sin teléfono + back-nav.
- [ ] n8n: `contact_pref="whatsapp"` / `route_switch to:"whatsapp_first"` → cola de contacto humano por WhatsApp (lead tibio), no "reunión agendada".
- [ ] Decisión de indexación (hoy `noindex,nofollow` — recomendado para LP de campaña).
- [ ] Consentimiento: confirmar con legal si el fineprint + enlace a políticas basta por mercado.
