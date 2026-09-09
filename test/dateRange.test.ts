import assert from "node:assert/strict";
import test from "node:test";
import { getDefaultDateRange, validateDateRange } from "../src/features/overview/dateRange.ts";

test("creates a seven-day default range ending tomorrow", () => {
  assert.deepEqual(getDefaultDateRange(new Date("2026-09-09T12:00:00Z")), {
    from: "2026-09-03",
    to: "2026-09-10",
  });
});

test("accepts a bounded half-open date range", () => {
  assert.equal(validateDateRange({ from: "2026-09-01", to: "2026-10-01" }), null);
});

test("rejects reversed, invalid, and overlong ranges", () => {
  assert.equal(validateDateRange({ from: "2026-09-10", to: "2026-09-01" }), "Choose an end date after the start date.");
  assert.equal(validateDateRange({ from: "not-a-date", to: "2026-09-10" }), "Enter valid start and end dates.");
  assert.equal(validateDateRange({ from: "2026-01-01", to: "2026-02-02" }), "Choose a date range of 31 days or less.");
});
