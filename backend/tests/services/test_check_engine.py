import pytest
from unittest.mock import AsyncMock, patch, MagicMock

import httpx

from app.models.monitor import Monitor, MonitorStatus
from app.services.check_engine import get_consecutive_failures, run_check


class TestRunCheck:
    async def test_successful_check(self):
        monitor = Monitor(
            id="test-id",
            user_id="user-id",
            name="Test Monitor",
            url="https://httpbin.org/status/200",
            expected_status_code=200,
            interval_seconds=300,
            last_status=MonitorStatus.UP,
        )
        with patch("httpx.AsyncClient") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                return_value=mock_resp
            )
            result = await run_check(monitor)
        assert result["is_up"] is True
        assert result["status_code"] == 200
        assert result["response_ms"] is not None

    async def test_failed_check_wrong_status(self):
        monitor = Monitor(
            id="test-id",
            user_id="user-id",
            name="Test Monitor",
            url="https://httpbin.org/status/500",
            expected_status_code=200,
            interval_seconds=300,
            last_status=MonitorStatus.UP,
        )
        with patch("httpx.AsyncClient") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 500
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                return_value=mock_resp
            )
            result = await run_check(monitor)
        assert result["is_up"] is False
        assert result["status_code"] == 500

    async def test_timeout_check(self):
        monitor = Monitor(
            id="test-id",
            user_id="user-id",
            name="Test Monitor",
            url="https://timeout.example.com",
            expected_status_code=200,
            interval_seconds=300,
            last_status=MonitorStatus.UP,
        )
        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=httpx.TimeoutException("timeout")
            )
            result = await run_check(monitor)
        assert result["is_up"] is False
        assert "timeout" in result["error_message"].lower()

    async def test_connection_error(self):
        monitor = Monitor(
            id="test-id",
            user_id="user-id",
            name="Test Monitor",
            url="https://doesnotexist12345.com",
            expected_status_code=200,
            interval_seconds=300,
            last_status=MonitorStatus.UP,
        )
        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=httpx.ConnectError("connection refused")
            )
            result = await run_check(monitor)
        assert result["is_up"] is False
        assert result["error_message"] is not None


class TestConsecutiveFailures:
    async def test_zero_failures_when_all_up(self, client):
        from app.core.database import AsyncSessionLocal

        token_res = await client.post(
            "/api/auth/register",
            json={"name": "T", "email": "engine@test.com", "password": "password123"},
        )
        token = token_res.json()["access_token"]
        mon_res = await client.post(
            "/api/monitors/",
            json={
                "name": "Test",
                "url": "https://example.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        monitor_id = mon_res.json()["id"]

        async with AsyncSessionLocal() as db:
            from app.models.check_result import CheckResult
            from datetime import datetime

            db.add(
                CheckResult(
                    monitor_id=monitor_id,
                    checked_at=datetime.utcnow(),
                    is_up=True,
                    response_ms=100,
                    status_code=200,
                )
            )
            await db.commit()

            failures = await get_consecutive_failures(monitor_id, db)
        assert failures == 0

    async def test_consecutive_failures_counted(self, client):
        from app.core.database import AsyncSessionLocal

        token_res = await client.post(
            "/api/auth/register",
            json={"name": "T", "email": "engine2@test.com", "password": "password123"},
        )
        token = token_res.json()["access_token"]
        mon_res = await client.post(
            "/api/monitors/",
            json={
                "name": "Test",
                "url": "https://example.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        monitor_id = mon_res.json()["id"]

        async with AsyncSessionLocal() as db:
            from app.models.check_result import CheckResult
            from datetime import datetime

            for i in range(2):
                db.add(
                    CheckResult(
                        monitor_id=monitor_id,
                        checked_at=datetime.utcnow(),
                        is_up=False,
                        response_ms=None,
                        status_code=None,
                        error_message="Connection refused",
                    )
                )
            await db.commit()

            failures = await get_consecutive_failures(monitor_id, db)
        assert failures == 2


class TestIncidentLogic:
    async def test_incident_opens_after_2_failures(self, client):
        from datetime import datetime, timedelta
        from sqlalchemy import select
        from app.core.database import AsyncSessionLocal
        from app.models.check_result import CheckResult
        from app.models.incident import Incident, IncidentStatus
        from app.models.monitor import Monitor
        from app.services.check_engine import process_check

        reg = await client.post(
            "/api/auth/register",
            json={"name": "T", "email": "engine3@test.com", "password": "password123"},
        )
        token = reg.json()["access_token"]
        mon = await client.post(
            "/api/monitors/",
            json={"name": "Test", "url": "https://example.com", "interval_seconds": 300},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert mon.status_code == 201
        monitor_id = mon.json()["id"]

        async with AsyncSessionLocal() as db:
            monitor = await db.get(Monitor, monitor_id)
            db.add(
                CheckResult(
                    monitor_id=monitor_id,
                    checked_at=datetime.utcnow() - timedelta(seconds=60),
                    is_up=False,
                    response_ms=None,
                    status_code=None,
                    error_message="Connection refused",
                )
            )
            await db.commit()

            failure_result = {
                "monitor_id": monitor_id,
                "checked_at": datetime.utcnow(),
                "is_up": False,
                "response_ms": None,
                "status_code": None,
                "error_message": "timeout",
            }
            with patch(
                "app.services.check_engine.run_check",
                new=AsyncMock(return_value=failure_result),
            ):
                await process_check(monitor, db)

            result = await db.execute(
                select(Incident).where(Incident.monitor_id == monitor_id)
            )
            incidents = result.scalars().all()

        assert len(incidents) == 1
        assert incidents[0].status == IncidentStatus.INVESTIGATING
