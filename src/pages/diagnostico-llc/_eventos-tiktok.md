# Guión de procesos — eventos TikTok (landings de diagnóstico A y B)

> Ruta cronológica de los eventos que dispara un lead al recorrer el embudo, cómo se trazan y
> cómo se verifican. Aplica igual a `/diagnostico-llc/` (A) y `/diagnostico-llc-b/` (B) — el
> motor es el mismo; las diferencias (A vs B) están al final (§7).
>
> Complementa a `_medicion.md` (§1–3 = referencia de eventos y GTM) y a
> `../leads-landing/_campanas-llc.md`.

---

## 0. Preparación (una sola vez, antes de tráfico)

| # | Acción | Dónde | Estado |
|---|---|---|---|
| 0.1 | Pixel base cargado: `ttq.load("D5KFDEBC77U6BL6T7LDG"); ttq.page()` | `<head>` del landing | ✅ hecho |
| 0.2 | `events.js` desde `analytics.tiktok.com` — sin CSP que lo bloquee | GitHub Pages no pone CSP | ✅ |
| 0.3 | **Un solo emisor por evento.** El landing llama `ttq.track()` **directo** (`trackAdsEvent`). → **GTM NO lleva tags de TikTok**; en GTM solo Meta + GA4. | decisión de arquitectura | ⬜ confirmar en el contenedor GTM |
| 0.4 | Crear/confirmar los eventos en TikTok Events Manager y marcar los de optimización (`CompleteRegistration`, `Schedule`, `CompletePayment`) | Events Manager | ⬜ |
| 0.5 | **Test Event Code** para pruebas locales/staging (aísla los eventos de prueba del dashboard) | Events Manager → Test Events | ⬜ |
| 0.6 | **Advanced Matching (browser): NO está.** El código nunca llama `ttq.identify(...)`. En el submit del gate hay `email` + `phone_e164` → añadir `ttq.identify({ email, phone_number })` **antes** del `ttq.track` de `CompleteRegistration`/`Subscribe`. El CAPI (n8n) sí hashea server-side. | `initLeadForm()` del landing | ⬜ pendiente |
| 0.7 | CAPI: webhook n8n `pixel-api-conversiones` recibe el mismo `event_id` que el pixel. Falta CORS + rama Meta. | n8n | ⬜ pendiente |
| 0.8 | `META_PIXEL_ID` real (hoy `__META_PIXEL_ID__`). Sin él, `fbq` no existe → 0 eventos Meta. TikTok funciona igual. | `SCI_TRACKING_CONFIG` | ⬜ |

**Dos funciones en el código:**
- `track(name, extra)` → **solo `dataLayer`** (GA4/BigQuery). Nunca toca el pixel.
- `trackAdsEvent(name, payload)` → `dataLayer` + **`ttq.track`** (pixel navegador) + **CAPI n8n**.
  Tiene lista blanca: solo dispara `ViewContent · ClickButton* · Subscribe · CompleteRegistration ·
  InitiateCheckout · Contact · Schedule`. Cualquier otro nombre queda bloqueado.
  (\*`ClickButton` hoy no se emite — ver Paso 2.)

**Parámetros que el pixel acepta** (`ADS_ALLOWED_KEYS`): `content_name, description, currency,
value, quantity, lead_id, session_id, main_goal, conversion_path, utm_*, ttclid, fbclid, ttp,
page_url, crm_event_name, crm_event_id, event_stage`. **No** viaja PII (email/phone) en el `track`.

---

## 1. La ruta — evento por evento (orden cronológico)

### Paso 1 · Carga de la página
- **Disparo:** DOM listo (`init()`), una vez por carga.
- **Evento TikTok:** `ViewContent` — **estándar**.
- **Función:** `trackAdsEvent` → pixel + CAPI + dataLayer.
- **`event_id`:** `buildEventId("ViewContent", {})`.
- **Params:** `content_name` (del `SCI_TRACKING_CONFIG.service_content`), `page_url`, `page_name`
  (`landing_diagnostico_llc` / `_b`), `ttp`/`ttclid` si vienen en la URL.
- **Guardia:** `ViewContentTracked` (1 vez).
- **Rol de optimización:** ninguno. Audiencias, calidad de tráfico, retargeting base.
- **Verificar:** TikTok Pixel Helper muestra **1** `ViewContent` al cargar, con `content_name`.

### Paso 2 · Clic en el botón del hero ("Empezar el diagnóstico" / "Revisar mi LLC")
- **Disparo:** clic en `#btnStart`.
- **Evento hoy:** `quiz_start` → **solo `dataLayer`** (`track`). **NO llega a TikTok.**
- **Si se quiere como evento de arranque** (`ClickButton`, fallback de optimización cuando
  `CompleteRegistration` < 50/sem): añadir en el código `trackAdsEvent`-style un `ttq.track("ClickButton", …)`
  sobre el mismo disparo. Mientras no se haga, TikTok no ve este paso.
- **Guardia:** `quizStartTracked`.
- **Verificar:** Google Tag Assistant muestra `quiz_start` en el dataLayer. Pixel Helper: nada (correcto, salvo que se active `ClickButton`).

### Pasos 3–8 · Quiz interno (P1..P6 + captura de nombre)
- **Eventos:** `quiz_step_complete` (cada "Continuar" válido; params `step`, `question`, `answer`) ·
  `quiz_name` (al guardar el nombre) · `quiz_complete` (al entrar al paso 8 / gate visible).
- **Función:** `track` → **solo `dataLayer` / GA4**. **NUNCA a TikTok.**
- **Por qué:** optimizar hacia "gente que da taps" degrada la campaña.
- **Guardia:** `quizCompleteTracked` para `quiz_complete`.
- **Verificar:** Tag Assistant los ve en el dataLayer; Pixel Helper **no debe mostrar nada** en estos pasos.

### Paso 9 · Primer foco en un campo del gate
- **Evento:** `lead_form_start` → solo `dataLayer`. No TikTok.
- **Uso:** medir fricción del formulario (foco vs envío).
- **Guardia:** `leadFormStartTracked`.

### Paso 10 · Envío del gate VÁLIDO — apellido + correo (+ WhatsApp opcional)  ← EVENTO CLAVE
- **Disparo:** `submit` del `#lead-form` que **pasa validación**, después de `sendLeadToWebhook(payload)`.
- **Evento TikTok (según nivel):**
  | Nivel (etapa A / riesgo B) | Evento | `value` |
  |---|---|---|
  | 1 (Exploración / Al día) | **`Subscribe`** (estándar) | `0` |
  | 2 (Estructuración / Ajustes) | **`CompleteRegistration`** (estándar) | `40` (+15 si `tech_interest ≠ ninguno`) |
  | 3 (Formalización / Correcciones) | **`CompleteRegistration`** | `70` (+15 tech) |
  | 4 (Optimización / Riesgo alto) | **`CompleteRegistration`** | `120` (+15 tech) |
- **Función:** `trackAdsEvent` → pixel + CAPI + dataLayer.
- **`event_id`:** `crmEventId = buildEventId("CompleteRegistration", { lead_id })` — **el mismo** en
  el pixel del navegador y en el POST del CAPI. TikTok deduplica por él.
- **Params:** `conversion_path: "diagnostico_gate"`, `event_stage: "etapa_"+N`, `lead_id`,
  `session_id`, `main_goal` (`goal` derivado del quiz), `content_name`, `currency: "USD"`,
  `value` (tabla), `utm_*` / `ttclid` / `ttp`.
- **Advanced Matching:** aquí es donde debería llamarse `ttq.identify({ email, phone_number })`
  **antes** del `track` (ver 0.6). Hoy no se hace.
- **Guardia:** el `submit` deshabilita `#lead-submit` (`submitBtn.disabled = true`) y solo corre una vez.
- **Rol de optimización:** **`CompleteRegistration` = evento de optimización de la fase 1.**
  `Subscribe` (nivel 1) es lead soft — **NO** se usa para optimizar (sesga hacia "validadores").
- **Verificar:**
  1. Pixel Helper → **1** `CompleteRegistration` (o `Subscribe`) con `value` y `event_id`.
  2. Events Manager → Test Events lo recibe con el mismo `event_id`.
  3. n8n → la ejecución de `pixel-api-conversiones` llega con **el mismo `event_id`** (dedup OK).
  4. No hay un segundo disparo si el usuario reintenta el submit.

### Paso 11 · Se pinta el resultado (informe)
- **Evento:** `route_selected` (params `destino`, `recommended_path`, `stage_id`, `complejidad`,
  `tech_interest`, `lead_temp`) → **solo `dataLayer`**. No TikTok.
- **Uso:** medir qué recomendamos por segmento.

### Paso 12 · Clic en la CTA del informe (fija o flotante)
- **Evento:** `path_chosen` (params `path`, `recommended` bool, `stage_id`) desde `markPath()` →
  **solo `dataLayer`**. No TikTok.
- **Efecto:** el `conversion_path` del lead pasa a `diagnostico_advisor` / `diagnostico_guide`;
  se re-envía el lead al webhook (`pushLeadUpdate`) — esto **no** dispara evento de pixel.

### Paso 13a · Camino ASESOR → reserva confirmada en Zcal  ← EVENTO DE NEGOCIO
- **Disparo:** doble señal —
  - **cliente:** `postMessage` de Zcal (`booking_completed` / `schedule_confirmed` / `event_created`) →
    `trackAdsEvent("Schedule", …)`.
  - **servidor (fiable):** webhook de Zcal → n8n → CAPI con el **mismo** `event_id`.
- **Evento TikTok:** `Schedule` — **estándar en Meta; en TikTok se envía como *custom* `Schedule`.**
  (Si se quiere un estándar de TikTok, mapear en GTM a `SubmitForm` o `PlaceAnOrder`.)
- **`event_id`:** `buildEventId("Schedule", { lead_id })`.
- **Params:** `conversion_path: "schedule_confirmed"`, `lead_id`, `main_goal`, `content_name`.
- **Dedup:** pixel (cliente) vs CAPI (servidor) por `event_id`.
- **Rol de optimización:** **`Schedule` = evento de optimización de la fase 2.** Es el CTA de los
  videos ("regístrate y **agenda tu reunión**") — la conversión de negocio real.
- **Verificar:** reservar una cita de prueba en Zcal → Pixel Helper muestra `Schedule`; n8n recibe
  el CAPI; en Events Manager aparece bajo el evento `Schedule` (custom).

### Paso 13b · Camino GUÍA (nivel 1) → confirmación
- **Evento:** `guide_delivered` (param `stage_id`) → **solo `dataLayer`**. No TikTok — el lead ya
  quedó contabilizado con `Subscribe` en el Paso 10.
- Si el lead pulsa "agendar una llamada" desde la pantalla de guía → `route_switch` (dataLayer) →
  entra al flujo de asesor → eventualmente **`Schedule`** (Paso 13a).

### Paso 14 · Camino PLATAFORMA  — (FASE 2, hoy DESACTIVADO)
- **Estado:** `PHASE1_SINGLE_PATH = true` → el informe no ofrece la plataforma; **este evento no dispara en fase 1.**
- **Cuando se active (fase 2):** clic en `#cw-goplatform` de la pantalla puente →
  `trackAdsEvent("InitiateCheckout", …)`.
  - `event_id`: `buildEventId("InitiateCheckout", { lead_id })`.
  - `value`: `40` (`conversion_path: "selfserve_start"`) · `90` (`selfserve_assisted`, venía de ruta asesor).
  - `content_name: "App /start"`.
- **Rol:** métrica de intención hacia `/start`. **No** es evento de optimización del diagnóstico.

### Paso 15 · Lead "Ganado" en Odoo  — OFFLINE / SOLO SERVIDOR
- **Disparo:** n8n, cuando el lead pasa a estado "Ganado" en Odoo. **Nunca desde el navegador.**
- **Evento TikTok:** `CompletePayment` — **estándar** (Meta: `Purchase`).
- **`event_id`:** generado por n8n, con el mismo `lead_id` para unir toda la cadena.
- **`value`:** valor real del contrato.
- **Rol de optimización:** **fase 3 / escala.**

---

## 2. Resumen — solo lo que llega a TikTok

| Evento | Tipo | Paso | Cuándo | `value` | Optimización |
|---|---|---|---|---|---|
| `ViewContent` | estándar | 1 | carga de la página | — | audiencias |
| `ClickButton` | estándar | 2 | clic en el hero | — | **fase 0** (fallback, requiere añadirlo) |
| `Subscribe` | estándar | 10 | submit del gate, nivel 1 | 0 | ninguna (lead soft) |
| `CompleteRegistration` | estándar | 10 | submit del gate, nivel 2–4 | 40/70/120 (+15 tech) | **fase 1** |
| `InitiateCheckout` | estándar | 14 | clic a `/start` (fase 2) | 40 / 90 | métrica |
| `Schedule` | custom en TikTok | 13a | reserva Zcal confirmada | — | **fase 2** |
| `CompletePayment` | estándar | 15 | lead Ganado en Odoo (n8n) | valor real | **fase 3** |

Todo lo demás (`quiz_start`, `quiz_step_complete`, `quiz_name`, `quiz_complete`,
`lead_form_start`, `route_selected`, `path_chosen`, `route_switch`, `guide_delivered`) → **solo
`dataLayer` / GA4**. Ni un tag de TikTok sobre esos.

---

## 3. Escalera de optimización (campaña TikTok)

| Fase | Semana | Evento de optimización | Nota |
|---|---|---|---|
| 0 · fallback | solo si <50 CR/sem | `ClickButton` | requiere añadir el `ttq.track("ClickButton")` (Paso 2) |
| 1 · arranque | 1–3 | **`CompleteRegistration`** | el "regístrate" del guión (submit del gate) |
| 2 · media | 3–6 | **`Schedule`** (cuando ≥50/sem) | el "agenda tu reunión" del guión — conversión de negocio |
| 3 · escala | 6+ | `CompletePayment` offline | alinea con clientes que cierran |

- Nunca arrancar optimizando `Schedule` en frío (volumen bajo → no aprende).
- VBO sobre `CompleteRegistration` con el `value` graduado: activar cuando el evento sea estable;
  favorece niveles 3–4.

---

## 4. Reglas de integridad (para no marcar nada mal)

1. **Un disparo por evento nativo por sesión** — cada uno con su guardia booleana. `ViewContent` 1 vez por carga.
2. **`event_id` se genera UNA vez** y se pasa igual al pixel del navegador y al CAPI. TikTok deduplica por él.
3. **El evento del gate es universal y dispara EN EL GATE**, antes de elegir camino
   (`conversion_path = diagnostico_gate`). Elegir camino re-envía el lead pero **no** dispara pixel.
4. **Nada del quiz interno a TikTok.** Si un `quiz_*` acaba en un tag de Ads, la campaña se envenena.
5. **`CompletePayment` solo server-side** (n8n). Nunca navegador.
6. **`Schedule` = doble señal** (cliente rápido + servidor fiable), dedup por `event_id`.
7. **Un solo emisor por evento:** el landing dispara `ttq.track` directo → **GTM no lleva tags de
   TikTok** (evita el doble envío pixel↔GTM aunque se deduplique).
8. **A vs B se separan por dimensión, no por evento:** mismo nombre, distinto `page_name` /
   `persona` / `landing_variant`.

---

## 5. Checklist de verificación en local (Chrome real + `python -m http.server 8777`)

Abrir `http://localhost:8777/diagnostico-llc/?qa=1&no_webhook=1` en **Chrome** con **TikTok Pixel
Helper** + **Google Tag Assistant** conectados.

- [ ] Carga → Pixel Helper: **1** `ViewContent` con `content_name`.
- [ ] Clic hero → Pixel Helper: **nada** (a menos que se haya añadido `ClickButton`). Tag Assistant: `quiz_start` en dataLayer.
- [ ] P1..P6 + nombre → Pixel Helper: **nada**. Tag Assistant: `quiz_step_complete` × 6, `quiz_name`, `quiz_complete`.
- [ ] Foco en el gate → Tag Assistant: `lead_form_start`. Pixel Helper: nada.
- [ ] Submit del gate (nivel 2–4) → Pixel Helper: **1** `CompleteRegistration`, con `value` y `event_id`.
      (nivel 1 → **1** `Subscribe` con `value: 0`.)
- [ ] Reintentar el submit → **no** hay segundo evento.
- [ ] Informe → Tag Assistant: `route_selected`. Pixel Helper: nada.
- [ ] Clic en la CTA → Tag Assistant: `path_chosen`. Pixel Helper: nada.
- [ ] Reserva en Zcal (si el iframe embebe desde localhost; si no, simular con
      `trackAdsEvent("Schedule",{conversion_path:"schedule_confirmed"})` en consola) →
      Pixel Helper: **1** `Schedule`.
- [ ] Quitar `no_webhook=1` y repetir el submit → en n8n, la ejecución de `pixel-api-conversiones`
      llega con **el mismo `event_id`** que mostró Pixel Helper (dedup OK).
- [ ] Ningún evento duplicado en toda la sesión.

**Ojo en local:**
- El pixel ID es real → usar **Test Event Code** para no ensuciar el dashboard.
- Meta: `fbq` no existe hasta poner `META_PIXEL_ID` → 0 eventos Meta (normal).
- Zcal puede mostrar "Not Found" si su allowlist de embed no incluye `localhost` → usar el enlace
  "abrir en pestaña nueva" o simular `Schedule` por consola.
- El CAPI puede fallar por CORS (n8n sin cabeceras) — el POST puede llegar igual; confirmarlo en n8n.

---

## 6. Setup en GTM (contenedor `GTM-TNRQGDM`) — resumen

Con la decisión 0.3 (el landing dispara `ttq` directo), **GTM NO crea tags de TikTok.** GTM solo:

- **Meta Pixel** — tag por cada evento nativo, `meta_event_name` del dataLayer
  (`CompleteRegistration` → `Lead`; el resto igual), `eventID = event_id` (dedup con el CAPI).
- **GA4** — todos los eventos (nativos + `quiz_*` + `route_*`) como eventos GA4 para el embudo interno.
- Trigger = Custom Event con el nombre exacto; opcional condición `page_name` para separar A/B.

Si en algún momento se decide que **GTM** maneje TikTok (en vez del landing): quitar el `ttq.track`
directo de `trackAdsEvent` y crear en GTM un tag TikTok por evento nativo con
`event_id` / `value` / `currency` / `content_name` / `conversion_path`, dedup por `event_id`.
**Nunca las dos vías a la vez.**

---

## 7. Diferencias A vs B

Mismos eventos, mismos disparos, misma escalera. Solo cambia:

| | A `/diagnostico-llc/` | B `/diagnostico-llc-b/` |
|---|---|---|
| `page_name` | `landing_diagnostico_llc` | `landing_diagnostico_llc_b` |
| Campos extra en el payload | — | `persona: "llc_existente"`, `landing_variant: "b"` |
| `value` del gate | por **etapa** (madurez) | por **nivel de riesgo** — mismo mapa `0 / 40 / 70 / 120` |
| `goal` (`main_goal`) | `llc_nueva` · `inversion_patrimonio` · `banca_pagos` · `ordenar_llc` | `cumplimiento` · `cambio_estado` · `banca_pagos` · `ordenar_llc` · **`retiros_utilidades`** |
| `event_stage` | `etapa_1..4` | `etapa_1..4` (se reutiliza el campo; representa el riesgo) |

En Events Manager: **cortar las conversiones por `page_name`**, no crear eventos nuevos por variante.
