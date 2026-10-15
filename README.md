# Giglify Admin

The Giglify admin console is a separate React/Vite application for authenticated operational staff. It uses the shared Supabase project but has its own repository history and deployment.

## Included workflows

- Overview metrics and operational trends.
- Requester application review.
- Task-draft approval and publishing.
- Submission and grading review.
- Daraja payment deposits and payout reconciliation.
- User support, appeals, contact messages, and notifications.
- Append-only audit history.

Every route is protected by Supabase authentication and the administrator capability check. Privileged changes are performed through server-side Supabase Edge Functions.

## Configuration

Create the deployment environment with:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ADMIN_APP_URL (optional)
```

Do not add service-role keys, Daraja credentials, callback secrets, or other provider secrets to this app. They belong in Supabase Edge Function secrets.

## Release checklist

1. Confirm the frontend environment points to the production Supabase project.
2. Confirm the administrator account is present and has the required admin capability.
3. Deploy the frontend with SPA fallback for `/overview`, `/requesters`, `/tasks`, `/submissions`, `/payments`, `/users`, `/audit`, and `/profile`.
4. Confirm payment, requester, task, submission, support, and audit pages load against the production functions.
5. Confirm the admin deployment is served over HTTPS and is not publicly linked as a customer route.

The admin console must never receive provider secrets. It displays operational results returned by authorized functions and does not settle payments in the browser.
