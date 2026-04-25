# Frontend Rules — Next.js App Router

## Folder structure
frontend/
├── app/
│   ├── (marketing)/          → landing, pricing — no auth
│   ├── (auth)/               → login, register
│   ├── (dashboard)/          → protected, subscription-gated
│   │   ├── layout.tsx        → subscription gate lives HERE only
│   │   ├── dashboard/
│   │   └── settings/billing/
│   └── api/
│       └── webhooks/stripe/route.ts
├── lib/
│   ├── plans.ts              → SINGLE SOURCE OF TRUTH for plan limits
│   ├── api-client.ts         → all fetch calls to FastAPI
│   ├── stripe.ts             → Stripe server singleton
│   └── auth.ts               → Auth.js config
└── components/
    ├── ui/                   → shadcn/ui components
    ├── monitors/
    └── billing/

## Component rules
- Default: React Server Component (RSC)
- Add "use client" ONLY for: useState, useEffect, onClick, browser APIs
- Never fetch data in client components — fetch in RSC, pass as props
- Use next/image (never <img>), next/link (never <a>)
- Use loading.tsx for loading states — not manual useState loading

## Plans config — always read from here
// lib/plans.ts
export const PLANS = {
  FREE:     { monitors: 3,  intervalSeconds: 300, historyDays: 7,  customDomain: false },
  PRO:      { monitors: 20, intervalSeconds: 60,  historyDays: 90, customDomain: true  },
  BUSINESS: { monitors: -1, intervalSeconds: 30,  historyDays: 365, customDomain: true },
}
// -1 = unlimited

## Subscription gate pattern
// app/(dashboard)/layout.tsx
const sub = await db.subscription.findUnique({ where: { userId } })
const isActive = sub?.status === 'active' || sub?.status === 'trialing'
if (!isActive) redirect('/pricing?reason=subscription_required')

## Naming
- Components: PascalCase → MonitorCard.tsx
- Utilities: camelCase → getSubscription.ts
- Route folders: kebab-case → settings/billing/
