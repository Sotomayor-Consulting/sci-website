import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("Zcal security hardening contract", () => {
  const webhook = read("functions/api/zcal-webhook.ts");
  assert.ok(webhook.indexOf("verifyZcalSignature") < webhook.indexOf("hasSupabase(env)"));
  assert.match(read("functions/_lib/zcal.ts"), /base64/);
  assert.match(read("functions/api/zcal-booking-action.ts"), /sbPatchReturning/);
  assert.match(read("supabase/migrations/20260916_zcal_action_tokens.sql"), /consumed_at/);
  assert.match(read("functions/api/schedule-validation.ts"), /booking_identity_mismatch/);
  assert.match(read("functions/_lib/odoo.ts"), /name: booking\.full_name/);
  assert.match(read("functions/_lib/zcal.ts"), /tema principal/);
});
