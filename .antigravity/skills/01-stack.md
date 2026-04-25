# Tech Stack — Never Deviate

## Frontend
- Framework: Next.js 14+ with App Router (NEVER Pages Router)
- Language: TypeScript with strict mode
- Styling: Tailwind CSS only (no inline styles, no CSS modules)
- Components: shadcn/ui (import from @/components/ui/)
- Auth: Auth.js v5
- HTTP client: lib/api-client.ts (never call fetch() directly)

## Backend
- Framework: FastAPI (Python 3.11+)
- Routes: async def ALWAYS — never sync def
- Validation: Pydantic v2 for all request/response schemas
- HTTP calls: httpx only (never requests library)
- Task scheduler: APScheduler AsyncIOScheduler

## Database
- ORM: SQLAlchemy 2.0 async (never legacy session.query())
- Driver: asyncpg (postgresql+asyncpg://...)
- Session: AsyncSession with AsyncSessionLocal
- Migrations: Alembic only — never edit existing migration files
- Primary keys: UUID strings (default=lambda: str(uuid.uuid4()))

## Payments
- Provider: Stripe Billing
- Webhooks: raw body, always verify signature
- Source of truth: Stripe — DB is just a cache

## Email
- Provider: Resend with React Email templates

## Hosting
- Frontend: Vercel
- Backend: Railway (always-on, never serverless)
- Database: Supabase or Neon (PostgreSQL)
