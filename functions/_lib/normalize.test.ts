// node --test functions/_lib/normalize.test.ts   (Node >= 22.6, sin flags en Node 24)
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeLead } from "./normalize.ts";

const base = {
  lead_id: "l_abc",
  session_id: "s_xyz",
  landing_variant: "b",
  persona: "llc_existente",
  page_name: "landing_diagnostico_llc_b",
  first_name: "Ana",
  last_name: "Pérez",
  email: "  ANA@Example.com ",
  consent: true,
  route: "advisor_correct",
  main_goal: "cumplimiento",
  diag_stage_id: "3",
  diag_industria: "Cumplimiento",
};

test("email en minúsculas y trim", () => {
  const { lead } = normalizeLead(base);
  assert.equal(lead.email, "ana@example.com");
});

test("landing_variant válido pasa; inválido cae a 'a' con warning", () => {
  assert.equal(normalizeLead({ ...base, landing_variant: "b" }).lead.landing_variant, "b");
  const bad = normalizeLead({ ...base, landing_variant: "x" });
  assert.equal(bad.lead.landing_variant, "a");
  assert.ok(bad.warnings.some((w) => w.includes("landing_variant")));
});

test("goal -> goal_label (taxonomía B)", () => {
  assert.equal(normalizeLead(base).lead.goal_label, "Poner al día el cumplimiento (5472 / 1120 / BOI)");
  assert.equal(normalizeLead({ ...base, main_goal: "retiros_utilidades" }).lead.goal_label, "Retirar utilidades sin problema fiscal");
  assert.equal(normalizeLead({ ...base, main_goal: "algo_raro" }).lead.goal_label, "algo raro");
});

test("teléfono US: +1 se conserva E.164", () => {
  const { lead } = normalizeLead({ ...base, phone_e164: "+13055551234", country_iso: "US" });
  assert.equal(lead.phone_e164, "+13055551234");
  assert.equal(lead.country_iso, "US");
});

test("teléfono MX: móvil de 10 dígitos -> +521XXXXXXXXXX", () => {
  const { lead } = normalizeLead({ ...base, phone_e164: "+525512345678", country_iso: "MX" });
  assert.equal(lead.phone_e164, "+5215512345678");
});

test("teléfono MX: ya viene con 521 -> intacto", () => {
  const { lead } = normalizeLead({ ...base, phone_e164: "+5215512345678", country_iso: "MX" });
  assert.equal(lead.phone_e164, "+5215512345678");
});

test("teléfono AR: formato local con 15 -> +549 sin el 15", () => {
  const { lead } = normalizeLead({ ...base, phone_raw: "011 15 2345 6789", country_iso: "AR" });
  assert.equal(lead.phone_e164, "+5491123456789");
});

test("teléfono AR: +54 9 con 15 intermedio se limpia", () => {
  const { lead } = normalizeLead({ ...base, phone_raw: "+54 9 11 15 2345 6789", country_iso: "AR" });
  assert.equal(lead.phone_e164, "+5491123456789");
});

test("país inferido del prefijo cuando falta country_iso", () => {
  const { lead } = normalizeLead({ ...base, phone_e164: "+593987654321", country_iso: "" });
  assert.equal(lead.country_iso, "EC");
});

test("phone_e164 inválido deja warning", () => {
  const { warnings } = normalizeLead({ ...base, phone_raw: "123", country_iso: "" });
  assert.ok(warnings.some((w) => w.includes("E.164")));
});

test("source: ttclid -> TikTok, fbclid -> Meta", () => {
  assert.equal(normalizeLead({ ...base, ttclid: "TT123" }).lead.source, "TikTok");
  assert.equal(normalizeLead({ ...base, fbclid: "FB123", ttclid: "" }).lead.source, "Meta");
  assert.equal(normalizeLead({ ...base, source: "tiktok_landing_diagnostico" }).lead.source, "TikTok");
  assert.equal(normalizeLead({ ...base, source: "organico" }).lead.source, "");
});

test("intension: ruta advisor -> frase de 'analizar mi caso'", () => {
  const { odooInput } = normalizeLead({ ...base, route: "advisor_correct" });
  assert.match(odooInput.intension, /analizar mi caso/);
});

test("intension: ruta guide -> frase de 'entender un poco'", () => {
  const { odooInput } = normalizeLead({ ...base, route: "guide" });
  assert.match(odooInput.intension, /entender un poco/);
});

test("odooInput.ab_variant refleja la landing", () => {
  assert.equal(normalizeLead(base).odooInput.ab_variant, "b");
  assert.equal(normalizeLead({ ...base, landing_variant: "a" }).odooInput.ab_variant, "a");
});

test("diag_stage_id numérico o null", () => {
  assert.equal(normalizeLead(base).lead.diag_stage_id, 3);
  assert.equal(normalizeLead({ ...base, diag_stage_id: "" }).lead.diag_stage_id, null);
});

test("diag jsonb junta los campos del quiz", () => {
  const { lead } = normalizeLead({ ...base, diag_industria: "Banca", tech_interest: "pagos" });
  assert.equal(lead.diag.industria, "Banca");
  assert.equal(lead.diag.tech_interest, "pagos");
});

test("test:true se propaga", () => {
  assert.equal(normalizeLead({ ...base, test: true }).lead.test, true);
  assert.equal(normalizeLead({ ...base, test: "true" }).lead.test, true);
  assert.equal(normalizeLead(base).lead.test, false);
});
