import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, monitors
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.check_engine import dispatch_due_checks

app = FastAPI(
    title="Uptime Monitor API",
    version="1.0.0",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(monitors.router, prefix="/api/monitors", tags=["Monitors"])

scheduler = AsyncIOScheduler()


@app.on_event("startup")
async def start_scheduler():
    if os.getenv("PYTEST_CURRENT_TEST"):
        return
    scheduler.add_job(dispatch_due_checks, "interval", seconds=30, id="check_dispatcher")
    scheduler.start()


@app.on_event("shutdown")
async def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)


@app.get("/api/health")
async def health():
    return {"status": "ok", "environment": settings.environment}
