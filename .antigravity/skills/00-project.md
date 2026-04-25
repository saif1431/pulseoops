# Project Overview

## Product name
PulseOps — Uptime monitoring SaaS for teams

## What it does
Teams add their websites, APIs, and services.
The platform checks them every 1–5 minutes.
When something goes down, the team gets alerted instantly.
Each workspace gets a public status page for their customers.

## Plans
- FREE:     3 monitors, 5min interval, 7-day history, email alerts only
- PRO:      $29/mo, 20 monitors, 1min interval, 90-day history, Slack + webhooks, custom domain
- BUSINESS: $79/mo, unlimited monitors, 30s interval, 1yr history, all features

## Monorepo structure
project-root/
├── frontend/        → Next.js 14+ App Router
├── backend/         → FastAPI Python
├── .antigravity/
│   └── skills/      → these files (loaded every session)
└── AGENT_CONTEXT.md → full context reference

## Golden rules
- Always read all skill files before starting any task
- Never deviate from the stack defined in 01-stack.md
- When unsure, ask — do not guess and implement
