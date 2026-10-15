import assert from "node:assert/strict";
import test from "node:test";
import { CAMPAIGN_TEMPLATES, getCampaignTemplate } from "../src/features/email/campaignTemplates.ts";

test("campaign templates include the launch offer and unsubscribe-safe copy", () => {
  const launch = getCampaignTemplate("launch-offer");
  assert.equal(launch.id, "launch-offer");
  assert.match(launch.subject, /limited launch offers/i);
  assert.match(launch.message, /unsubscribe/i);
  assert.ok(CAMPAIGN_TEMPLATES.length >= 2);
});
