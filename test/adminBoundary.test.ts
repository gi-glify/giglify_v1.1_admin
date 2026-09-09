import assert from "node:assert/strict";
import test from "node:test";
import { hasCapability, type AdminCapability } from "../src/lib/capabilities.ts";
import { classifyStatus, normalizeAdminError, type AdminErrorKind } from "../src/lib/errors.ts";

test("maps boundary HTTP statuses to stable admin error kinds", () => {
  const cases: Array<[number, AdminErrorKind]> = [
    [400, "validation"],
    [401, "unauthorized"],
    [403, "forbidden"],
    [409, "conflict"],
    [422, "stale-data"],
    [500, "network"],
  ];
  for (const [status, expected] of cases) assert.equal(classifyStatus(status), expected);
});

test("exposes capabilities only to an authenticated admin", () => {
  const capability: AdminCapability = "viewPayments";
  assert.equal(hasCapability(true, capability), true);
  assert.equal(hasCapability(false, capability), false);
  assert.equal(hasCapability(null, capability), false);
});

test("uses the Edge Function response status when the SDK omits status", () => {
  const error = normalizeAdminError({ context: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) });
  assert.equal(error.kind, "forbidden");
  assert.equal(error.status, 403);
});
