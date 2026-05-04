from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.check_result import CheckResult
from app.models.monitor import Monitor
from app.models.subscription import PlanTier
from app.models.user import User
from app.schemas.monitor import MonitorCreate, MonitorUpdate

PLAN_MONITOR_LIMITS = {
    PlanTier.FREE: 3,
    PlanTier.PRO: 20,
    PlanTier.BUSINESS: -1,
}

PLAN_INTERVAL_LIMITS = {
    PlanTier.FREE: 300,
    PlanTier.PRO: 60,
    PlanTier.BUSINESS: 30,
}


async def get_plan(user: User) -> PlanTier:
    if user.subscription:
        return user.subscription.plan
    return PlanTier.FREE


async def check_monitor_limit(user: User, db: AsyncSession) -> None:
    plan = await get_plan(user)
    limit = PLAN_MONITOR_LIMITS[plan]
    if limit == -1:
        return
    result = await db.execute(
        select(func.count()).where(Monitor.user_id == user.id, Monitor.is_active.is_(True))
    )
    count = result.scalar() or 0
    if count >= limit:
        raise HTTPException(
            status_code=403,
            detail=f"Monitor limit reached for {plan} plan. Upgrade to add more.",
        )


async def create_monitor(data: MonitorCreate, user: User, db: AsyncSession) -> Monitor:
    await check_monitor_limit(user, db)
    plan = await get_plan(user)
    min_interval = PLAN_INTERVAL_LIMITS[plan]
    if data.interval_seconds < min_interval:
        raise HTTPException(
            status_code=403, detail=f"Minimum interval for your plan is {min_interval}s"
        )
    monitor = Monitor(user_id=user.id, **data.model_dump())
    db.add(monitor)
    await db.commit()
    await db.refresh(monitor)
    return monitor


async def get_monitors(user: User, db: AsyncSession) -> list[Monitor]:
    result = await db.execute(
        select(Monitor).where(Monitor.user_id == user.id).order_by(Monitor.created_at.desc())
    )
    return result.scalars().all()


async def get_monitor_by_id(monitor_id: str, user: User, db: AsyncSession) -> Monitor:
    result = await db.execute(select(Monitor).where(Monitor.id == monitor_id, Monitor.user_id == user.id))
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")
    return monitor


async def update_monitor(monitor_id: str, data: MonitorUpdate, user: User, db: AsyncSession) -> Monitor:
    monitor = await get_monitor_by_id(monitor_id, user, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(monitor, field, value)
    await db.commit()
    await db.refresh(monitor)
    return monitor


async def delete_monitor(monitor_id: str, user: User, db: AsyncSession) -> None:
    monitor = await get_monitor_by_id(monitor_id, user, db)
    await db.delete(monitor)
    await db.commit()


async def pause_monitor(monitor_id: str, user: User, db: AsyncSession) -> Monitor:
    monitor = await get_monitor_by_id(monitor_id, user, db)
    monitor.is_active = not monitor.is_active
    await db.commit()
    await db.refresh(monitor)
    return monitor


async def get_uptime_percentage(monitor_id: str, days: int, db: AsyncSession) -> float:
    since = datetime.utcnow() - timedelta(days=days)
    result = await db.execute(
        select(func.count()).where(CheckResult.monitor_id == monitor_id, CheckResult.checked_at >= since)
    )
    total = result.scalar() or 0
    if total == 0:
        return 100.0
    up_result = await db.execute(
        select(func.count()).where(
            CheckResult.monitor_id == monitor_id,
            CheckResult.checked_at >= since,
            CheckResult.is_up.is_(True),
        )
    )
    up_count = up_result.scalar() or 0
    return round((up_count / total) * 100, 2)
