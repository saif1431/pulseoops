import pytest
from httpx import AsyncClient

class TestRegister:
    async def test_register_success(self, client: AsyncClient):
        res = await client.post("/api/auth/register", json={
            "name": "Test User", "email": "test@example.com", "password": "password123"
        })
        assert res.status_code == 201
        data = res.json()
        assert "access_token" in data
        assert data["user"]["email"] == "test@example.com"
        assert data["user"]["plan"] == "FREE"

    async def test_register_duplicate_email(self, client: AsyncClient):
        payload = {"name": "User", "email": "dup@example.com", "password": "password123"}
        await client.post("/api/auth/register", json=payload)
        res = await client.post("/api/auth/register", json=payload)
        assert res.status_code == 400
        assert "already registered" in res.json()["detail"]

    async def test_register_weak_password(self, client: AsyncClient):
        res = await client.post("/api/auth/register", json={
            "name": "User", "email": "weak@example.com", "password": "short"
        })
        assert res.status_code == 422

    async def test_register_no_number_in_password(self, client: AsyncClient):
        res = await client.post("/api/auth/register", json={
            "name": "User", "email": "nonumber@example.com", "password": "passwordonly"
        })
        assert res.status_code == 422

    async def test_register_invalid_email(self, client: AsyncClient):
        res = await client.post("/api/auth/register", json={
            "name": "User", "email": "not-an-email", "password": "password123"
        })
        assert res.status_code == 422

class TestLogin:
    async def test_login_success(self, client: AsyncClient):
        await client.post("/api/auth/register", json={
            "name": "User", "email": "login@example.com", "password": "password123"
        })
        res = await client.post("/api/auth/login", json={
            "email": "login@example.com", "password": "password123"
        })
        assert res.status_code == 200
        assert "access_token" in res.json()

    async def test_login_wrong_password(self, client: AsyncClient):
        await client.post("/api/auth/register", json={
            "name": "User", "email": "wp@example.com", "password": "password123"
        })
        res = await client.post("/api/auth/login", json={
            "email": "wp@example.com", "password": "wrongpassword1"
        })
        assert res.status_code == 401

    async def test_login_nonexistent_email(self, client: AsyncClient):
        res = await client.post("/api/auth/login", json={
            "email": "noone@example.com", "password": "password123"
        })
        assert res.status_code == 401

class TestMe:
    async def test_get_me_authenticated(self, client: AsyncClient):
        reg = await client.post("/api/auth/register", json={
            "name": "Me User", "email": "me@example.com", "password": "password123"
        })
        token = reg.json()["access_token"]
        res = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        assert res.json()["email"] == "me@example.com"

    async def test_get_me_no_token(self, client: AsyncClient):
        res = await client.get("/api/auth/me")
        assert res.status_code == 401

    async def test_get_me_invalid_token(self, client: AsyncClient):
        res = await client.get("/api/auth/me", headers={"Authorization": "Bearer invalidtoken"})
        assert res.status_code == 401
