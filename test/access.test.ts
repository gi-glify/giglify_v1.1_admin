import assert from "node:assert/strict";
import test from "node:test";
import { resolveAccessState, type AccessInput } from "../src/app/access.ts";

const access = (input: Partial<AccessInput> = {}) => resolveAccessState({
  session: null,
  isAdmin: null,
  error: null,
  ...input,
});

test("routes signed-out users to login", () => {
  assert.equal(access().route, "login");
});

test("keeps an authenticated session in a loading state while admin capability loads", () => {
  assert.equal(access({ session: { user: { id: "user-1" } } }).route, "checking-admin");
});

test("routes authenticated non-admin users to forbidden", () => {
  assert.equal(access({ session: { user: { id: "user-1" } }, isAdmin: false }).route, "forbidden");
});

test("routes authenticated admins to overview", () => {
  assert.equal(access({ session: { user: { id: "admin-1" } }, isAdmin: true }).route, "overview");
});

test("surfaces capability errors without treating the user as an admin", () => {
  const result = access({ session: { user: { id: "user-1" } }, error: "Capability check failed" });
  assert.equal(result.route, "error");
  assert.equal(result.message, "Capability check failed");
});
