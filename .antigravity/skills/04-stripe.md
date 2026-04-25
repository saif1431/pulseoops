# Stripe Integration Rules — READ CAREFULLY

## Core rule
Stripe is ALWAYS the source of truth for subscription state.
The DB subscription table is a CACHE of Stripe — nothing else.
ONLY the webhook handler is allowed to write subscription status and plan.

## Webhook handler — non-negotiable rules
1. Read raw bytes FIRST: payload = await request.body()
2. NO middleware must parse the body before this route
3. Verify signature: stripe.Webhook.construct_event(payload, sig, WEBHOOK_SECRET)
4. Return 200 immediately after verification
5. Use UPSERT not INSERT — Stripe retries events on failed delivery
6. Handle ALL 5 events (see below) — ignore others silently

## The 5 webhook events to always handle
| Event | Action |
|---|---|
| checkout.session.completed | Create subscription in DB, status=active |
| invoice.paid | Update currentPeriodEnd, status=active |
| invoice.payment_failed | Set status=past_due, send recovery email |
| customer.subscription.updated | Sync plan, priceId, cancelAtPeriodEnd |
| customer.subscription.deleted | Set status=canceled, downgrade plan to FREE |

## Checkout session
- Always pass metadata={"user_id": user.id} so webhook can identify user
- Always pass customer=user.stripe_customer_id
- mode="subscription" always for recurring plans

## Customer Portal
- Create session server-side, return URL to frontend
- Frontend redirects to portal URL
- Portal handles: cancel, upgrade, downgrade, update card — you don't build these

## What to NEVER do
- NEVER update plan or status from a frontend request
- NEVER create subscription directly via API — always use Checkout
- NEVER store card data — Stripe handles PCI compliance
- NEVER parse webhook body before signature verification
