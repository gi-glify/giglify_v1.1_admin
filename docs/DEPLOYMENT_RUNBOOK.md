# Giglify Admin Deployment Runbook

Use the main repository’s [deployment runbook](../../docs/DEPLOYMENT_RUNBOOK.md) for the complete coordinated release. This file contains the admin-repository steps only.

## Build and verify

```bash
npm ci
npm test
npm run build
```

## Hosting variables

Set only public values:

```text
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=PUBLIC_ANON_KEY
VITE_ADMIN_APP_URL=https://admin.giglify.co.ke
```

Never add service-role, provider, payment, Resend, Gemini, or other server secrets to this repository or a `VITE_*` variable.

Publish `dist/` with SPA fallback to `index.html` and HTTPS enabled.

## Backend dependency

The parent repository must deploy the matching Supabase migration and Edge Functions before the admin frontend is promoted. Confirm `profiles.is_admin = true` for each named admin and verify non-admin requests receive `403` from every admin function.

## Admin smoke test

- Sign in and sign out.
- Confirm a non-admin cannot access admin routes or functions.
- Load overview, users, support, requester, task, submission, payment, audit, and profile tabs.
- Preview private KYC documents through signed URLs only.
- Perform one audited mutation and confirm its actor label.
- Verify toast dismissal, responsive drawer behavior, bottom navigation, theme transition, PWA install, and refresh states.

## Rollback

Roll back the hosting project to the previous frontend build. Do not delete audit logs, payment events, transactions, or user records. Backend rollback requires a reviewed migration or function change in the parent repository.
