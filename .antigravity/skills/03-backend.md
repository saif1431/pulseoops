# Backend Rules — FastAPI

## Folder structure
backend/
├── app/
│   ├── main.py               → FastAPI app + router registration + CORS
│   ├── core/
│   │   ├── config.py         → settings via pydantic BaseSettings
│   │   ├── database.py       → async engine + AsyncSessionLocal
│   │   └── security.py       → JWT decode, password hashing
│   ├── models/               → SQLAlchemy ORM models (one file per model)
│   ├── schemas/              → Pydantic v2 schemas (one file per feature)
│   ├── routers/              → FastAPI routers (monitors, billing, users, webhooks)
│   └── services/             → business logic (check_engine, stripe_service, email_service)
└── alembic/
    └── versions/             → never edit these files manually

## Route rules
- All routes: async def — NEVER def
- Always use Depends() for: db session, current user, plan gating
- Always return Pydantic schema — never return raw dict
- Use HTTPException with correct codes: 400 bad request, 401 unauth, 403 forbidden, 404 not found
- Never expose internal error details to client
- Log with logger — NEVER use print()

## Dependency pattern
async def get_current_user(token=Depends(oauth2_scheme), db=Depends(get_db)):
    payload = decode_jwt(token)
    return await db.get(User, payload["sub"])

async def require_pro(user=Depends(get_current_user)):
    if user.subscription.plan not in ["PRO","BUSINESS"]:
        raise HTTPException(403, "Pro plan required")
    return user

## SQLAlchemy 2.0 async pattern
# Query
result = await db.execute(select(Monitor).where(Monitor.workspace_id == id))
monitors = result.scalars().all()

# Create
db.add(Monitor(**data))
await db.commit()

# Update
await db.execute(update(Monitor).where(Monitor.id == id).values(**data))
await db.commit()

## Naming
- Routers: snake_case → monitor_router.py, billing_router.py
- Models: PascalCase → Monitor, CheckResult, Workspace
- Schemas: PascalCase + suffix → MonitorCreate, MonitorResponse, MonitorUpdate
- DB tables: snake_case plural → monitors, check_results, workspaces
- URL paths: kebab-case → /api/monitors, /api/billing/checkout
