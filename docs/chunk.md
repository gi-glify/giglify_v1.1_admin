# Giglify Admin Build Chunks

This document divides the admin build into independently reviewable chunks. The admin frontend lives in this repository. Supabase migrations and Edge Functions remain in the parent workspace’s `supabase/` directory and must be coordinated with the frontend chunks.

The current starter shell is already present in `src/App.tsx` and `src/styles.css`. It is visual scaffolding only; it does not authenticate, read admin data, or perform privileged actions.

## Build rules

- The browser may contain only the Supabase URL and anon key. Never add `SUPABASE_SERVICE_ROLE_KEY` to this repository or any `VITE_*` variable.
- Every privileged read, document access, mutation, and aggregate query must verify the JWT and `profiles.is_admin` server-side.
- Every mutation must validate the target record, enforce the legal state transition, and append an audit event.
- Private requester documents remain in the private `requester-kyc` bucket and are exposed only through short-lived signed URLs.
- A draft is not published until the server-side publish transaction creates or updates the canonical task and question records successfully.
- A payout is not `paid` because an admin clicked a button; provider confirmation and reconciliation are authoritative.
- Each chunk ends with tests, a production build, and a focused review before the next dependent chunk starts.
- The admin UI must preserve the main Giglify design system: reuse the `/giglify.svg` logo, `lucide-react` icons, `IBM Plex Sans` body font, `Space Grotesk` heading font, existing navy/amber theme tokens, and AOS motion settings (`duration: 600`, `once: true`, `easing: "ease-out"`, `offset: 40`).

## Dependency map

```text
Chunk 0  Baseline and contracts
   ├── Chunk 1  Auth gate and layout
   └── Chunk 2  Audit foundation and admin API boundary
          ├── Chunk 3  Overview metrics
          ├── Chunk 4  Requester queue and KYC review
          ├── Chunk 5  Task drafts and publishing
          ├── Chunk 6  Submissions and grading
          ├── Chunk 7  Payments and payouts
          └── Chunk 8  Users, appeals, messages, notifications
                 └── Chunk 9  Audit explorer and account timelines
Chunk 3–9 ─── Chunk 10  Charts, filters, and cross-queue polish
All chunks ── Chunk 11  Security, E2E, deployment, and handover
```

Chunks 3–9 can be implemented in parallel after Chunks 1–2, but each one must use the shared types, API client, permission map, and audit contract established earlier.

## Chunk 0 — Baseline, contracts, and repository hygiene

**Goal:** Make the separate admin repository reproducible and define the API shapes before feature work.

**Frontend files:**

- Modify `package.json` to add the selected test runner, Zod (or equivalent), charting library, and Playwright only when their first consumer is ready.
- Create `src/lib/env.ts` for validated public environment variables.
- Create `src/lib/supabase.ts` for the browser Supabase client.
- Create `src/types/admin.ts` for shared queue, action, audit, and metric types.
- Create `tests/fixtures/` for safe typed sample responses; do not place real user or payment data in fixtures.

**Parent Supabase files:**

- Record the deployed project URL and deployed Edge Function names in the admin README or deployment notes.
- Compare the production schema against `docs/admin-build.md` before writing frontend queries.

**Acceptance criteria:**

- `npm install`, `npm run build`, and the test command work from the admin repository root.
- Missing or malformed `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` produces a clear startup error.
- No service-role key appears in source, build output, or environment examples.
- Shared response types describe loading, success, empty, stale, and error states.

## Chunk 1 — Authentication gate and application shell

**Goal:** Implement `/login`, `/overview`, and `/forbidden` with an admin capability check.

**Frontend files:**

- Create `src/app/router.tsx` with protected and public routes.
- Create `src/app/AuthProvider.tsx` to subscribe to Supabase auth state and expose the session.
- Create `src/app/RequireAdmin.tsx` to load only the caller’s `profiles.is_admin` capability and route non-admin users to `/forbidden`.
- Split the current shell into `src/components/layout/AdminLayout.tsx`, `src/components/layout/Sidebar.tsx`, and `src/components/layout/Topbar.tsx`.
- Create `src/features/auth/LoginPage.tsx` and `src/features/auth/ForbiddenPage.tsx`.
- Move feature navigation metadata into `src/app/navigation.ts`.

**Security tests:**

- Signed-out users can see only `/login`.
- Authenticated non-admin users never load queue data and land on `/forbidden`.
- Admin users can reach `/overview` after the capability check succeeds.
- Signing out clears the session and returns to `/login`.

**Acceptance criteria:** The UI gate works, but it is treated only as navigation. Backend functions still enforce authorization independently.

## Chunk 2 — Audited admin API boundary

**Goal:** Establish the server-side contract used by every privileged feature.

**Parent Supabase files:**

- Add a migration for an append-only admin audit table or extend the existing audit model with `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_json`, `after_json`, `reason`, `request_id`, and `created_at`.
- Add indexes for actor, entity, action, and created time.
- Add a server-side audit helper that captures request IDs and never allows browser writes to the audit table.
- Confirm `requireAdmin` returns consistent 401/403 responses.

**Frontend files:**

- Create `src/lib/adminApi.ts` for typed Edge Function invocation.
- Create `src/lib/errors.ts` for normalized unauthorized, forbidden, validation, conflict, stale-data, and network errors.
- Create `src/lib/capabilities.ts` with the temporary `is_admin` capability map.

**Acceptance criteria:** A test Edge Function call from a non-admin returns 403; a missing token returns 401; a successful mutation creates an audit record containing before and after state.

## Chunk 3 — Overview metrics

**Goal:** Build the operational dashboard using bounded aggregate responses rather than raw-table downloads.

**Parent Supabase files:**

- Add admin-only, read-only functions or RPCs named `admin_overview_metrics`, `admin_task_funnel`, `admin_payment_metrics`, and `admin_requester_funnel`.
- Validate `date_from` and `date_to`, cap the maximum range, and return already-aggregated rows.
- Include new users, active users, task funnel counts, requester queues, verification deposits, payouts, appeals, contact messages, grading failures, and reward totals.

**Frontend files:**

- Create `src/features/overview/overviewApi.ts`.
- Create `src/features/overview/OverviewPage.tsx`.
- Create `src/features/overview/DateRangePicker.tsx` and `MetricCard.tsx`.
- Add queue-link state so each metric opens the corresponding filtered feature.

**Acceptance criteria:** Date changes reload only aggregate endpoints; cards have loading, empty, error, and stale-data states; a non-admin cannot invoke the metrics functions.

## Chunk 4 — Requester applications and KYC review

**Goal:** Review requester applications safely, including private identity documents.

**Parent Supabase files:**

- Add an admin-only function to list/search applications with pagination and safe identity fields.
- Add an admin-only function that validates the application and returns a short-lived signed URL for a specific KYC document.
- Extend `admin-requester-action` to support approve, reject-with-required-reason, request-more-information, and stale-status checks.
- Capture full audit before/after state.

**Frontend files:**

- Create `src/features/requesters/requesterApi.ts`.
- Create `RequesterQueuePage.tsx`, `RequesterFilters.tsx`, `RequesterDetailDrawer.tsx`, and `KycDocumentPreview.tsx`.
- Add explicit reason validation for rejection and information requests.

**Acceptance criteria:** The browser never receives a bucket URL or private object listing; signed URLs expire; actions are idempotent and show success/failure/retry states; stale records require refresh before mutation.

## Chunk 5 — Task drafts, publishing, and catalog controls

**Goal:** Turn an approved requester draft into a canonical worker-facing task through one audited server-side operation.

**Parent Supabase files:**

- Add a `publish-requester-task` function that validates the draft, questions, category, difficulty, reward, and requester eligibility.
- Create/update `tasks`, `task_questions`, and `task_question_prompts` transactionally or through an equivalent server-side workflow.
- Add functions for reject-with-feedback, return-for-edits, archive, and unpublish.
- Ensure private answer keys never enter worker-facing prompt rows.

**Frontend files:**

- Create `src/features/tasks/taskDraftApi.ts`.
- Create `TaskDraftQueuePage.tsx`, `TaskDraftDetail.tsx`, `TaskPreview.tsx`, and `TaskActionDialog.tsx`.

**Acceptance criteria:** Approval cannot display “published” unless canonical task creation succeeds; preview matches the worker-facing prompt shape; publishing and unpublishing are audited; duplicate submissions do not create duplicate task records.

## Chunk 6 — Worker submissions and grading operations

**Goal:** Give authorized staff a searchable review queue without exposing private answer keys to workers.

**Parent Supabase files:**

- Add admin-only list/detail functions for `task_submissions` and `grading_jobs` with filters for status, task, user, date, grading status, and confidence.
- Add audited retry, manual-review, approve, and reject workflows with legal state transitions.
- Keep worker answers and private answer keys in separate response fields and restrict answer-key access to the reviewer capability.

**Frontend files:**

- Create `src/features/submissions/submissionApi.ts`.
- Create `SubmissionQueuePage.tsx`, `SubmissionDetail.tsx`, `GradingFeedback.tsx`, and `ReviewActionDialog.tsx`.

**Acceptance criteria:** Failed jobs can be retried once through the server workflow; manual review preserves the grading trail; unauthorized staff cannot request private answer keys; actions handle duplicate/stale submissions safely.

## Chunk 7 — Verification deposits, payouts, providers, and reconciliation

**Goal:** Replace the current broad payment review surface with separate, provider-aware queues.

**Parent Supabase files:**

- Add paginated admin read functions for deposits, payout requests, provider events, and payment audit records.
- Change payout workflows so `mark_paid` is possible only after verified provider confirmation/reconciliation.
- Add explicit approve/reject/note actions with state-transition validation.
- Preserve provider payloads server-side and redact secrets in admin responses and logs.

**Frontend files:**

- Create `src/features/payments/paymentApi.ts`.
- Create `PaymentQueuePage.tsx`, `PayoutQueuePage.tsx`, `ProviderEventDetail.tsx`, and `PaymentActionDialog.tsx`.

**Acceptance criteria:** The UI cannot mark an unconfirmed payout paid; provider events and database status can be reconciled; every action has an audit record and visible retry/error state; sensitive provider credentials never render.

## Chunk 8 — Users, appeals, messages, and notifications

**Goal:** Add controlled operational tools without unrestricted row editing.

**Parent Supabase files:**

- Add paginated admin functions for searchable user summaries and recent activity.
- Add explicit appeal-review actions with required outcomes and notes.
- Add contact-message assignment/status functions and admin-only reads.
- Add notification-composer functions for one user or an approved audience segment with validation, preview, and audit logging.

**Frontend files:**

- Create feature folders under `src/features/users`, `src/features/appeals`, `src/features/messages`, and `src/features/notifications`.
- Add explicit action dialogs instead of editable database forms.

**Acceptance criteria:** User identity and balances are paginated and minimized; support actions are auditable; notification sends require a validated target and preview; no unrestricted profile update form exists.

## Chunk 9 — Audit explorer and account timelines

**Goal:** Make the audit trail useful for investigations while keeping it append-only.

**Frontend files:**

- Create `src/features/audit/auditApi.ts`.
- Create `AuditLogPage.tsx`, `AuditFilters.tsx`, and `AccountTimeline.tsx`.
- Add links from users, requester records, submissions, tasks, and payments to filtered audit history.

**Acceptance criteria:** Admins can filter by actor, action, entity, date, and request ID; before/after JSON is rendered safely; audit entries cannot be edited or deleted from the UI; corrections appear as new events.

## Chunk 10 — Charts, filtering, and operational polish

**Goal:** Make all queues usable at operational volume.

**Frontend files:**

- Add bounded pagination, search, status filters, date filters, and URL-persisted filter state to every queue.
- Add charts for signup/activity, task funnel, approval rates, review times, rewards, payouts, requester funnel, and grading throughput.
- Add reusable `LoadingState`, `EmptyState`, `ErrorState`, `StaleDataBanner`, `ConfirmDialog`, and `Pagination` components.

**Acceptance criteria:** Queue links from overview preserve filters; large datasets do not load into the browser at once; charts render aggregate responses only; every action reports pending, success, failure, and stale-data states.

## Chunk 11 — Security, end-to-end verification, and deployment

**Goal:** Prove the definition of done before production access is granted.

**Tests:**

- Unit-test permission maps, response schemas, date-range validation, state transitions, and error normalization.
- Add Playwright smoke tests for login, non-admin rejection, admin overview, requester review, task publishing, payment review, and sign-out.
- Run negative tests confirming that a non-admin cannot read admin queues or invoke mutations.
- Run a build inspection to confirm no service-role key or private document URL is bundled.

**Deployment:**

- Configure the separate admin deployment and `admin.giglify.co.ke` domain.
- Add only the admin origin and `http://localhost:3001/auth/callback` to Supabase Auth redirects.
- Enable HTTPS, error monitoring with payload redaction, MFA, and alerts for payout, role, and task-publication actions.
- Deploy backend migrations/functions to staging first, run the E2E suite, then promote to production.

**Definition-of-done check:**

- Non-admin users cannot load admin data or invoke admin actions.
- Every mutation is server-validated and audited.
- Private documents use expiring signed URLs.
- Payment status is provider-authoritative.
- Charts use bounded aggregates.
- Actions expose success, failure, retry, and stale-data states.
- The admin app has its own repository, deployment, environment, and redirect URLs.

## Suggested commit sequence

Keep commits small enough to review independently:

1. `chore: establish admin contracts and test harness`
2. `feat: add admin auth gate and shell`
3. `feat: add audited admin API boundary`
4. `feat: add overview metrics`
5. `feat: add requester review queue`
6. `feat: add task publishing workflow`
7. `feat: add submission and grading operations`
8. `feat: add payment reconciliation queues`
9. `feat: add user support and notification tools`
10. `feat: add audit explorer and timelines`
11. `feat: add charts and queue polish`
12. `test: verify admin security and deployment readiness`
