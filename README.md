# Giglify Admin

Separate internal operations console for Giglify. This repository is intentionally nested inside the main workspace but has its own Git repository and deployment boundary.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The admin browser must only use the Supabase anon key. Privileged reads and mutations belong behind authenticated, audited Edge Functions.

## Initial feature areas

- Overview metrics
- Requester applications and task drafts
- Worker submissions and grading
- Payments and payouts
- Users, appeals, messages, and notifications
- Audit log

Backend function and migration work is tracked against `../docs/admin-build.md` in the parent workspace.
