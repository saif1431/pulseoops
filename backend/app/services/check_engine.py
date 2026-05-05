import asyncio
import time
from datetime import datetime, timedelta
from typing import Any

import httpx
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.database import engine
from app.models.check_result import CheckResult
from app.models.incident import Incident, IncidentStatus, IncidentUpdate
from app.models.monitor import Monitor, MonitorStatus

AsyncCheckSession = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

CONSECUTIVE_FAILURES_TO_OPEN = 2


async def run_check(monitor: Monitor) -> dict[str, Any]:
    start = time.monotonic()
    result_data: dict[str, Any] = {
        "monitor_id": monitor.id,
        "checked_at": datetime.utcnow(),
        "is_up": False,
        "response_ms": None,
        "status_code": None,
        "error_message": None,
    }
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(monitor.url)
        elapsed = int((time.monotonic() - start) * 1000)
        is_up = resp.status_code == monitor.expected_status_code
        result_data.update(
            {"is_up": is_up, "response_ms": elapsed, "status_code": resp.status_code}
        )
    except httpx.TimeoutException as exc:
        result_data["error_message"] = str(exc) or "timeout"
    except httpx.ConnectError as exc:
        result_data["error_message"] = str(exc) or "connection refused"
    except Exception as exc:
        result_data["error_message"] = str(exc)[:200]
    return result_data


async def get_consecutive_failures(monitor_id: str, db: AsyncSession) -> int:
    result = await db.execute(
        select(CheckResult)
        .where(CheckResult.monitor_id == monitor_id)
        .order_by(CheckResult.checked_at.desc())
        .limit(CONSECUTIVE_FAILURES_TO_OPEN)
    )
    results = result.scalars().all()
    if len(results) < CONSECUTIVE_FAILURES_TO_OPEN:
        return 0
    return sum(1 for r in results if not r.is_up)


async def process_check(monitor: Monitor, db: AsyncSession) -> None:
    result_data = await run_check(monitor)
    is_up = result_data["is_up"]
    was_up = monitor.last_status in [MonitorStatus.UP, MonitorStatus.PENDING]

    check = CheckResult(**result_data)
    db.add(check)
    await db.flush()

    new_status = MonitorStatus.UP if is_up else MonitorStatus.DOWN
    await db.execute(
        update(Monitor)
        .where(Monitor.id == monitor.id)
        .values(
            last_status=new_status,
            last_response_ms=result_data["response_ms"],
            last_checked_at=datetime.utcnow(),
            next_check_at=datetime.utcnow() + timedelta(seconds=monitor.interval_seconds),
        )
    )

    if not is_up:
        consecutive = await get_consecutive_failures(monitor.id, db)
        if consecutive >= CONSECUTIVE_FAILURES_TO_OPEN:
            open_result = await db.execute(
                select(Incident).where(
                    Incident.monitor_id == monitor.id, Incident.resolved_at == None  # noqa: E711
                )
            )
            if open_result.scalars().first() is None:
                incident = Incident(
                    monitor_id=monitor.id,
                    user_id=monitor.user_id,
                    title=f"{monitor.name} is down",
                    status=IncidentStatus.INVESTIGATING,
                )
                db.add(incident)
                await db.flush()
                db.add(
                    IncidentUpdate(
                        incident_id=incident.id,
                        message=(
                            "Monitor went down. Error: "
                            f"{result_data.get('error_message', 'Non-200 response')}"
                        ),
                        status=IncidentStatus.INVESTIGATING,
                    )
                )
    elif is_up and not was_up:
        open_result = await db.execute(
            select(Incident).where(
                Incident.monitor_id == monitor.id, Incident.resolved_at == None  # noqa: E711
            )
        )
        for incident in open_result.scalars().all():
            incident.resolved_at = datetime.utcnow()
            incident.status = IncidentStatus.RESOLVED
            db.add(
                IncidentUpdate(
                    incident_id=incident.id,
                    message="Monitor recovered and is back online.",
                    status=IncidentStatus.RESOLVED,
                )
            )

    await db.commit()


async def dispatch_due_checks() -> None:
    async with AsyncCheckSession() as db:
        result = await db.execute(
            select(Monitor).where(
                Monitor.is_active == True,  # noqa: E712
                Monitor.next_check_at <= datetime.utcnow(),
            )
        )
        monitors = result.scalars().all()
        tasks = [process_check(monitor, db) for monitor in monitors]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
