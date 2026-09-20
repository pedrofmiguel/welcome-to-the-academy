/**
 * Connectivity check. Confirms the env vars are present, the characters
 * table exists, and the service_role key can write and read it.
 *
 *   node --env-file=.env.local scripts/check-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(msg) {
  console.error("✗ " + msg);
  process.exit(1);
}

if (!url) fail("SUPABASE_URL is not set.");
if (!key) fail("SUPABASE_SERVICE_ROLE_KEY is not set.");
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)) {
  fail(`SUPABASE_URL looks malformed: ${url}`);
}
console.log("✓ env vars present");
console.log("  url:", url);

const db = createClient(url, key, { auth: { persistSession: false } });

const { error: readErr } = await db.from("characters").select("id").limit(1);
if (readErr) {
  if (/does not exist|schema cache/i.test(readErr.message)) {
    fail(
      "The characters table does not exist yet.\n" +
      "  Open Supabase → SQL Editor, paste supabase/schema.sql, and Run."
    );
  }
  fail(`Read failed: ${readErr.message}`);
}
console.log("✓ characters table reachable");

const probe = {
  id: "healthcheck-" + Date.now().toString(36),
  name: "Health Check",
  class_id: "wiz",
  class_name: "Wizard",
  subclass_id: "divination",
  subclass_name: "School of Divination",
  combo_short: "DIVINATION WIZARD",
  source: "PH",
  motif: "mind",
  motif_name: "Deep-Minded",
  alternates: ["Lore Bard"],
  scores: "Wizard 21",
  created_at: new Date().toISOString(),
};

const { error: writeErr } = await db.from("characters").insert(probe);
if (writeErr) fail(`Write failed: ${writeErr.message}`);
console.log("✓ write succeeded");

const { data, error: backErr } = await db
  .from("characters")
  .select("*")
  .eq("id", probe.id)
  .single();
if (backErr) fail(`Read-back failed: ${backErr.message}`);
if (data.combo_short !== probe.combo_short) fail("Read-back did not match what was written.");
console.log("✓ read-back matches");

await db.from("characters").delete().eq("id", probe.id);
console.log("✓ cleanup done");

const { count } = await db.from("characters").select("*", { count: "exact", head: true });
console.log(`\nAll good. The roster currently holds ${count ?? 0} character(s).`);
