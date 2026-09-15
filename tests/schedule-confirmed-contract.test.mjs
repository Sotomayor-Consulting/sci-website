import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/pages/schedule-confirmed/index.html", import.meta.url), "utf8");
const webhook = await readFile(new URL("../functions/api/zcal-webhook.ts", import.meta.url), "utf8");
const validation = await readFile(new URL("../functions/api/schedule-validation.ts", import.meta.url), "utf8");
const action = await readFile(new URL("../functions/api/zcal-booking-action.ts", import.meta.url), "utf8");

assert.match(page, /endpoint:\s*"\/api\/schedule-validation"/, "la landing usa la Function same-origin");
assert.match(page, /readParam\("a\[2\]"\)/, "a[2] es el contexto principal");
assert.match(page, /method:\s*"POST"/, "la validación no expone PII por GET");
assert.match(page, /id="sci-reschedule"/, "la landing ofrece reprogramación");
assert.match(page, /id="sci-cancel-booking"/, "la landing ofrece cancelación");
assert.match(page, /\/api\/zcal-booking-action\?token=/, "los enlaces se canjean con token");
assert.match(webhook, /x-zcal-webhook-signature/, "el webhook exige firma Zcal");
assert.match(webhook, /ZCAL_LINK_ENCRYPTION_KEY/, "los enlaces se cifran antes de persistir");
assert.match(validation, /SCHEDULE_MODE/, "la escritura Odoo está protegida por modo");
assert.match(validation, /SCHEDULE_CANARY_BOOKING_IDS/, "el canario requiere IDs explícitos");
assert.match(action, /ZCAL_ALLOWED_HOSTS/, "la redirección limita hosts permitidos");

console.log("schedule-confirmed Cloudflare contract: 11 assertions passed");
