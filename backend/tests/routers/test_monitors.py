import pytest
from httpx import AsyncClient


async def get_auth_token(client: AsyncClient) -> str:
    res = await client.post(
        "/api/auth/register",
        json={
            "name": "Test",
            "email": "monitor@test.com",
            "password": "password123",
        },
    )
    return res.json()["access_token"]


class TestMonitorCRUD:
    async def test_create_monitor_success(self, client: AsyncClient):
        token = await get_auth_token(client)
        res = await client.post(
            "/api/monitors/",
            json={
                "name": "My API",
                "url": "https://api.example.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 201
        assert res.json()["name"] == "My API"
        assert res.json()["last_status"] == "pending"

    async def test_create_monitor_invalid_url(self, client: AsyncClient):
        token = await get_auth_token(client)
        res = await client.post(
            "/api/monitors/",
            json={
                "name": "Bad",
                "url": "not-a-url",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 422

    async def test_create_monitor_invalid_interval(self, client: AsyncClient):
        token = await get_auth_token(client)
        res = await client.post(
            "/api/monitors/",
            json={
                "name": "Bad",
                "url": "https://example.com",
                "interval_seconds": 999,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 422

    async def test_list_monitors_empty(self, client: AsyncClient):
        token = await get_auth_token(client)
        res = await client.get("/api/monitors/", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        assert res.json() == []

    async def test_list_monitors_returns_own_only(self, client: AsyncClient):
        token = await get_auth_token(client)
        await client.post(
            "/api/monitors/",
            json={
                "name": "Mine",
                "url": "https://mine.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        res = await client.get("/api/monitors/", headers={"Authorization": f"Bearer {token}"})
        assert len(res.json()) == 1

    async def test_update_monitor(self, client: AsyncClient):
        token = await get_auth_token(client)
        create = await client.post(
            "/api/monitors/",
            json={
                "name": "Old",
                "url": "https://old.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        mid = create.json()["id"]
        res = await client.patch(
            f"/api/monitors/{mid}",
            json={"name": "New"},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 200
        assert res.json()["name"] == "New"

    async def test_delete_monitor(self, client: AsyncClient):
        token = await get_auth_token(client)
        create = await client.post(
            "/api/monitors/",
            json={
                "name": "Del",
                "url": "https://del.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        mid = create.json()["id"]
        res = await client.delete(
            f"/api/monitors/{mid}",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 204

    async def test_pause_monitor(self, client: AsyncClient):
        token = await get_auth_token(client)
        create = await client.post(
            "/api/monitors/",
            json={
                "name": "Pause",
                "url": "https://pause.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        mid = create.json()["id"]
        res = await client.patch(
            f"/api/monitors/{mid}/pause",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 200
        assert res.json()["is_active"] is False

    async def test_free_plan_monitor_limit(self, client: AsyncClient):
        token = await get_auth_token(client)
        for i in range(3):
            await client.post(
                "/api/monitors/",
                json={
                    "name": f"Mon {i}",
                    "url": f"https://mon{i}.com",
                    "interval_seconds": 300,
                },
                headers={"Authorization": f"Bearer {token}"},
            )
        res = await client.post(
            "/api/monitors/",
            json={
                "name": "4th",
                "url": "https://4th.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 403
        assert "limit" in res.json()["detail"].lower()

    async def test_cannot_access_other_users_monitor(self, client: AsyncClient):
        t1 = await get_auth_token(client)
        create = await client.post(
            "/api/monitors/",
            json={
                "name": "Private",
                "url": "https://private.com",
                "interval_seconds": 300,
            },
            headers={"Authorization": f"Bearer {t1}"},
        )
        mid = create.json()["id"]

        res2 = await client.post(
            "/api/auth/register",
            json={
                "name": "Other",
                "email": "other@test.com",
                "password": "password123",
            },
        )
        t2 = res2.json()["access_token"]

        res = await client.get(
            f"/api/monitors/{mid}",
            headers={"Authorization": f"Bearer {t2}"},
        )
        assert res.status_code == 404
