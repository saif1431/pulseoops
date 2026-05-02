# Frontend Remaining Work

This document tracks what should still be added or improved on the frontend side for PulseOps.

## 1. Content Pages: Replace Placeholders

These routes now exist but currently use placeholder content and should be replaced with production content:

- /docs
- /blog
- /changelog
- /about
- /careers
- /contact
- /terms
- /privacy
- /status

## 2. Documentation Experience

Recommended next steps for `/docs`:

- Add docs layout with sidebar navigation
- Add pages: Quickstart, Auth, Monitors API, Incidents API, Status Pages API, Billing
- Add searchable docs index
- Add code block copy button + syntax highlighting

## 3. Blog Experience

Recommended next steps for `/blog`:

- Add post listing with metadata (date, category, read-time)
- Add dynamic route `/blog/[slug]`
- Add markdown/MDX rendering pipeline
- Add pagination and tags

## 4. Contact and Marketing Conversion

Recommended next steps for `/contact` and global CTA flow:

- Add contact form with validation and submit endpoint
- Add success/failure UI states
- Add newsletter subscription entry point
- Add trust section (logos, testimonials, case studies)

## 5. Legal and Compliance

Before production launch:

- Replace placeholder legal text with finalized legal copy
- Add cookie policy route (optional but recommended)
- Add consent banner and preference center (if required by target region)

## 6. Auth UX Gaps

Recommended frontend additions:

- Wire forgot-password page to backend reset flow
- Add reset-password route and token handling
- Add email verification pending screen
- Add account lockout / too-many-attempts messaging

## 7. Dashboard UX Improvements

Recommended enhancements:

- Add onboarding checklist for first-time workspace setup
- Add richer empty states with direct actions
- Add optimistic UI for monitor/incident mutations
- Add success/error toasts for all async actions consistently

## 8. Status Page UX

Recommended enhancements for public status pages:

- Add status slug discovery/entry on `/status`
- Improve subscription lifecycle (unsubscribe and confirmation states)
- Add branded custom-domain UI hints where plan permits

## 9. Technical Cleanup

Recommended engineering tasks:

- Migrate `middleware.ts` to `proxy.ts` (Next.js 16 deprecation warning)
- Add automated route/link integrity test in CI
- Add Playwright smoke tests for critical flows
- Add Lighthouse checks for marketing pages

## 10. Testing Coverage To Add

Frontend test suite should include:

- Auth flows (login/register/reset)
- Pricing to checkout initiation
- Billing portal launch
- Route accessibility and nav link integrity
- Responsive checks for marketing, auth, and dashboard pages

---

## Current Validation Snapshot

- Production build: passing
- Lint: passing
- Broken route links discovered in nav/footer/auth: fixed
- Missing linked routes: scaffolded
