# Giglify admin dashboard design guide

This guide is a reusable brief for designing new admin screens that feel native to Giglify. It describes what to place on a screen, how it should behave, and how to keep operations safe.

## 1. Product role

The admin dashboard is an operations console, not a second public marketing site. Every screen should help an authorized operator answer one of these questions:

- What needs attention now?
- What happened and who changed it?
- What is safe to approve, reject, publish, retry, or escalate?
- What evidence supports this decision?

Design for decision-making, not for displaying every database column.

## 2. Giglify visual language

Keep the same brand foundations as the main app:

- logo: reuse public/giglify.svg;
- body font: IBM Plex Sans;
- heading font: Space Grotesk;
- primary accent: warm amber, currently represented by --accent: #f5a623;
- light surfaces: --bg: #f8fafc and --bg-elevated: #ffffff;
- text: deep navy --text: #0f172a with muted slate for secondary information;
- icons: Lucide icons with consistent stroke weight and size;
- motion: restrained AOS entrance motion and short state transitions;
- dark mode: use the existing theme variables instead of introducing page-specific colors.

Do not introduce lime/green as a competing brand accent. Reserve red for danger/error and use amber for normal action/status emphasis.

## 3. Page anatomy

Use this structure for most queue pages:

~~~text
Sticky top bar
  page title + short context       admin identity + theme/sign-out actions

Page heading
  eyebrow → title → one-sentence explanation → refresh/action

Filters and scope
  search, status, dates, safe reset, result count

Primary work surface
  table/list/cards with clear status and one obvious next action

Detail surface
  right-side desktop drawer / full-width mobile drawer
  evidence, metadata, history, action dialog
~~~

The first viewport should show the page purpose and current work queue. Hide secondary details in a drawer, disclosure, or dedicated detail route.

## 4. Navigation model

Desktop uses a persistent collapsible sidebar grouped by purpose:

1. Overview
2. Work queues: Requesters, Task drafts, Submissions
3. Money: Payments & payouts
4. Support: Users & support
5. Governance: Audit log, Admin profile

The sticky top bar should remain full width and contain the current page title, theme control, admin identity, and sign-out. On small screens, use the existing bottom tab navigation for the four highest-frequency areas and a bottom More sheet for the remaining real destinations. Do not add a tab unless it has a working route and a clear owner.

## 5. Overview dashboard

The overview is a triage screen. A strong layout is:

- a short operational greeting and date range;
- four to six clickable metric cards;
- a warning strip for stale data or failed providers;
- one or two trend panels;
- “needs attention” queues ordered by urgency;
- a recent admin activity preview.

Metrics must be aggregated by server-side functions. Each card needs a label, value, time scope, last-updated time, loading state, empty state, and a link to the filtered queue behind it.

Avoid decorative charts that do not lead to an action.

## 6. Queue and table design

Every row should answer: what is this, what state is it in, and what can I do next?

Recommended row hierarchy:

~~~text
Primary identity/title
secondary identifiers and timestamp
status badge + risk/amount
one action or “Open details”
~~~

Always show human-readable values first, then stable IDs in smaller muted text. For tasks, show worker name, worker ID, task name, and task ID. For payments, show user, amount/currency, provider reference, status, and event age.

Use server pagination, stable sorting, filter chips, and an explicit refresh control. Do not render hundreds of rows at once. Preserve filters when opening and closing a drawer.

## 7. Detail drawers

The existing Giglify pattern is a right-side sliding drawer on desktop and a full-width sheet on mobile. Use it for review context, not for a second unrelated page.

Drawer sections should be ordered:

1. title, status, close;
2. primary decision summary;
3. evidence and identifiers;
4. timeline/audit history;
5. action area with required confirmation/reason;
6. related records.

Close with the X button, Escape, backdrop click, or navigation. Keep the selected record in state and show a stale/conflict message if it changed while open.

## 8. Actions and safety

Use a clear distinction between:

- primary: approve, publish, retry after validation;
- secondary: open, refresh, request information;
- danger: reject, disable, cancel.

Every mutation needs a confirmation surface when it affects money, publication, identity, grading, or account access. Rejections require a reason. The server—not the button label—must enforce legal state transitions and write the audit event.

After an action, show a top-right toast that slides in from the left and out to the right. Give temporary notifications an X button, timer line, and swipe dismissal. Persistent danger/error toasts remain until dismissed and use red styling.

## 9. Status language

Use consistent words across all pages:

- pending: waiting for review or provider response;
- under review: an operator is investigating;
- approved/verified: the required evidence passed;
- rejected/failed: a decision or operation did not pass;
- stale/conflict: the record changed and needs refresh;
- unavailable: the dependency cannot currently answer.

Do not use color alone. Pair every status color with text, an icon, or an accessible label.

## 10. Responsive behavior

Design desktop first for dense queue work, then define the mobile transformation:

- sidebar becomes the existing slide-in drawer;
- top bar stays sticky and compact;
- bottom navigation appears only on small screens;
- More opens a bottom sheet with only real routes;
- tables become stacked queue cards;
- drawers become full-width sheets;
- filters stack vertically;
- action buttons remain reachable without horizontal scrolling.

Test at approximately 320px, 390px, 768px, 1024px, and wide desktop. Check keyboard focus, Escape behavior, backdrop click, screen-reader labels, and touch targets.

## 11. Dark and light themes

Use semantic variables such as --bg, --bg-elevated, --text, --text-muted, --border, and --accent. A theme change should transition smoothly without causing layout movement. Check contrast for text, badges, disabled buttons, charts, drawers, alerts, and focus rings in both modes.

Do not hard-code a light-only white card or a dark-only text color in a feature component. If a special surface is needed, add a semantic token centrally.

## 12. Admin profile, audit, and AI

The admin profile is read-only: identity, role/capability, account metadata, and recent activity. Changes to admin privilege happen through a controlled backend process, not a profile form.

Audit details should show the acting admin name/email, admin ID, action, entity, time, request ID, reason, and before/after summary where safe. Never display secrets, full provider credentials, private document contents, or answer keys.

The admin AI assistant should look like the main-site assistant but be visibly operational and read-only. It may analyze data explicitly shared with it, state assumptions, identify risks, and suggest next checks. It must not claim to approve payments, edit records, access documents, or replace the audit trail.

## 13. Component recipe for new screens

Before implementing a page, write:

1. user role and permission;
2. primary question the page answers;
3. data contract and pagination/filter rules;
4. loading, empty, error, stale, and success states;
5. allowed mutations and required reasons;
6. audit event for each mutation;
7. desktop and mobile transformation;
8. accessibility labels and keyboard behavior;
9. success metric for the operator.

Then reuse the existing primitives: MetricCard, queue rows, filters, drawers, action dialogs, status pills, refresh buttons, toasts, theme variables, and AOS attributes.

## 14. Design review checklist

- Does the screen look like Giglify rather than a generic SaaS template?
- Is the main action obvious without being dangerous by accident?
- Are IDs available without overwhelming the human-readable label?
- Does every API call have loading, empty, error, stale, and retry behavior?
- Does the screen remain usable on mobile without a hamburger-only dead end?
- Are colors supported by text/icon meaning and dark-mode contrast?
- Are destructive decisions confirmed and audited?
- Can an operator trace the record back to its source and history?
- Does the design avoid adding a new pattern when an existing pattern works?
