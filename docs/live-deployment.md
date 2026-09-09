# Giglify Admin Live Deployment

This is the final handover for deploying the separate admin repository. No live deployment has been performed by Codex.

## Repositories

- Main application and Supabase migrations/functions: parent `giglify_v1` repository.
- Admin frontend: `giglify-admin` repository nested locally but ignored by the parent repository.
- The admin repository must be pushed to its own GitHub repository and deployed independently.

## Before deployment

1. Commit and push the parent migration/function changes.
2. Commit and push the admin frontend changes.
3. Confirm the Supabase project URL and project reference.
4. Confirm an admin user has `profiles.is_admin = true`.
5. Configure Supabase Auth redirect URLs for the production admin origin and `http://localhost:3001/auth/callback`.
6. Ensure the private `requester-kyc` bucket remains private.

## Supabase staging first

From the main repository, link the intended Supabase project and deploy migrations/functions to staging:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy admin-overview-metrics
supabase functions deploy admin-task-funnel
supabase functions deploy admin-payment-metrics
supabase functions deploy admin-requester-funnel
supabase functions deploy admin-requester-queue
supabase functions deploy admin-requester-document
supabase functions deploy admin-requester-action
supabase functions deploy publish-requester-task
supabase functions deploy admin-submission-queue
supabase functions deploy admin-payment-queue
supabase functions deploy admin-payment-action
supabase functions deploy admin-support-queue
supabase functions deploy admin-audit-explorer
```

Run the admin tests/build and manually verify sign-in, non-admin rejection, requester KYC links, task publishing, submission retry, payout reconciliation, support actions, and audit filtering before production promotion.

## Admin hosting environment

Set only these public frontend variables in the admin hosting provider:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_ADMIN_APP_URL=https://admin.giglify.co.ke
```

Never add `SUPABASE_SERVICE_ROLE_KEY`, provider secrets, payment credentials, or email-service secrets to the admin repository or any `VITE_*` variable.

Build command:

```bash
npm ci
npm run build
```

Publish the generated `dist/` directory with SPA fallback/rewrite to `index.html`.

## Production checks

- HTTPS is enabled for `admin.giglify.co.ke`.
- Supabase Auth allows only the required production and local callback URLs.
- Non-admin users receive 403 from every admin Edge Function.
- KYC URLs are short-lived signed URLs and the storage bucket is not public.
- Payouts cannot be marked paid without a processed provider event.
- Audit records are append-only and cannot be edited from the UI.
- Error monitoring redacts tokens, provider payload secrets, private documents, and answer keys.
- MFA is enabled for all admin accounts.
- Alerts exist for role changes, payout actions, task publication, and repeated grading failures.

## Rollback

If the admin frontend is unhealthy, roll back the hosting provider to the previous frontend build. Backend migrations/functions should be rolled back only with a reviewed SQL/function change; do not delete audit records or payment/provider events.

## Final smoke test

```bash
npm test
npm run build
```

Then sign in as an admin and verify one read-only queue, one audited mutation, one signed KYC preview, one provider-confirmed payout path, and one audit-log entry.
