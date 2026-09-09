import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("admin frontend contains no service-role credential or secret key reference", () => {
  const root = resolve(import.meta.dirname, "..");
  const source = readFileSync(resolve(root, "src/lib/supabase.ts"), "utf8");
  assert.doesNotMatch(source, /service[_-]?role|SUPABASE_SERVICE_ROLE_KEY|VITE_RESEND_SECRET/i);
});

test("admin environment contract contains only public runtime variables", () => {
  const env = readFileSync(resolve(import.meta.dirname, "../src/lib/env.ts"), "utf8");
  assert.match(env, /VITE_SUPABASE_URL/);
  assert.match(env, /VITE_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(env, /SERVICE_ROLE|RESEND_API_KEY|SECRET_KEY/i);
});
