from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
import httpx
import secrets
from app.models.user import User
from app.models.subscription import Subscription, PlanTier, SubscriptionStatus
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest

async def register_user(data: RegisterRequest, db: AsyncSession) -> tuple[User, str]:
    # Check email exists
    result = await db.execute(select(User).where(User.email == data.email.lower()))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user = User(
        email=data.email.lower(),
        name=data.name,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    await db.flush()  # Get user.id without committing

    # Create FREE subscription automatically
    subscription = Subscription(
        user_id=user.id,
        plan=PlanTier.FREE,
        status=SubscriptionStatus.ACTIVE,
    )
    db.add(subscription)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email})
    return user, token


async def _get_or_create_oauth_user(db: AsyncSession, email: str, name: str) -> User:
    result = await db.execute(select(User).where(User.email == email.lower()))
    user = result.scalar_one_or_none()

    if user:
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account deactivated")
        return user

    user = User(
        email=email.lower(),
        name=name or "Unknown",
        hashed_password=hash_password(secrets.token_urlsafe(32)),
        is_verified=True,
    )
    db.add(user)
    await db.flush()

    subscription = Subscription(
        user_id=user.id,
        plan=PlanTier.FREE,
        status=SubscriptionStatus.ACTIVE,
    )
    db.add(subscription)
    await db.commit()
    await db.refresh(user)
    return user


async def _verify_google_token(token: str) -> tuple[str, str]:
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": token},
        )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    payload = response.json()
    email = payload.get("email")
    name = payload.get("name") or payload.get("given_name") or ""
    if not email:
        raise HTTPException(status_code=401, detail="Google account email not found")
    return email, name


async def _verify_github_token(token: str) -> tuple[str, str]:
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        user_response = await client.get("https://api.github.com/user", headers=headers)
        if user_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid GitHub token")
        user_payload = user_response.json()

        email = user_payload.get("email")
        name = user_payload.get("name") or user_payload.get("login") or ""

        if not email:
            emails_response = await client.get(
                "https://api.github.com/user/emails", headers=headers
            )
            if emails_response.status_code == 200:
                emails = emails_response.json()
                primary = next(
                    (item for item in emails if item.get("primary") and item.get("verified")),
                    None,
                )
                email = primary.get("email") if primary else None

    if not email:
        raise HTTPException(status_code=401, detail="GitHub account email not found")
    return email, name


async def oauth_login(provider: str, token: str, db: AsyncSession) -> tuple[User, str]:
    if provider == "google":
        email, name = await _verify_google_token(token)
    elif provider == "github":
        email, name = await _verify_github_token(token)
    else:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")

    user = await _get_or_create_oauth_user(db, email=email, name=name)
    access_token = create_access_token({"sub": user.id, "email": user.email})
    return user, access_token

async def login_user(data: LoginRequest, db: AsyncSession) -> tuple[User, str]:
    result = await db.execute(select(User).where(User.email == data.email.lower()))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")

    token = create_access_token({"sub": user.id, "email": user.email})
    return user, token
