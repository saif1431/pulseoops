from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.check_result import CheckResult
from app.models.user import User
from app.schemas.monitor import MonitorCreate, MonitorResponse, MonitorUpdate
from app.services.monitor_service import (
    create_monitor,
    delete_monitor,
    get_monitor_by_id,
    get_monitors,
    get_uptime_percentage,
    pause_monitor,
    update_monitor,
)

router = APIRouter()


@router.post("/", response_model=MonitorResponse, status_code=201)
async def create(
    data: MonitorCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await create_monitor(data, user, db)


@router.get("/", response_model=list[MonitorResponse])
async def list_monitors(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    monitors = await get_monitors(user, db)
    return monitors


@router.get("/{monitor_id}/stats")
async def get_stats(
    monitor_id: str,
    days: int = 30,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await get_monitor_by_id(monitor_id, user, db)
    uptime = await get_uptime_percentage(monitor_id, days, db)
    recent = await db.execute(
        select(CheckResult)
        .where(CheckResult.monitor_id == monitor_id)
        .order_by(CheckResult.checked_at.desc())
        .limit(50)
    )
    return {
        "uptime_percentage": uptime,
        "recent_checks": [
            {
                "checked_at": r.checked_at,
                "is_up": r.is_up,
                "response_ms": r.response_ms,
                "status_code": r.status_code,
            }
            for r in recent.scalars().all()
        ],
    }


@router.get("/{monitor_id}", response_model=MonitorResponse)
async def get_one(
    monitor_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_monitor_by_id(monitor_id, user, db)


@router.patch("/{monitor_id}", response_model=MonitorResponse)
async def update(
    monitor_id: str,
    data: MonitorUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_monitor(monitor_id, data, user, db)


@router.delete("/{monitor_id}", status_code=204)
async def delete(
    monitor_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await delete_monitor(monitor_id, user, db)


@router.patch("/{monitor_id}/pause", response_model=MonitorResponse)
async def pause(
    monitor_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await pause_monitor(monitor_id, user, db)
