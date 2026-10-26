import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { isUnderDevelopment } from "../src/lib/underDevelopment.ts";

test("admin under-development mode defaults on unless the value is exactly false", () => {
  assert.equal(isUnderDevelopment(undefined), true);
  assert.equal(isUnderDevelopment("true"), true);
  assert.equal(isUnderDevelopment("FALSE"), true);
  assert.equal(isUnderDevelopment("false"), false);
});

test("admin router uses under-development mode as the default for every route", async () => {
  const source = await readFile(new URL("../src/app/router.tsx", import.meta.url), "utf8");
  assert.match(source, /UNDER_DEVELOPMENT_MODE/);
  assert.match(source, /UnderDevelopmentPage/);
  assert.match(source, /if \(UNDER_DEVELOPMENT_MODE\)/);
  assert.doesNotMatch(source, /session && isAdmin === true && UNDER_DEVELOPMENT_MODE/);
});
