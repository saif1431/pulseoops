from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User
from app.models.subscription import Subscription, PlanTier

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        if not user_id:
            raise ValueError("No user id in token")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def require_pro(user: User = Depends(get_current_user)) -> User:
    if not user.subscription or user.subscription.plan not in [PlanTier.PRO, PlanTier.BUSINESS]:
        raise HTTPException(status_code=403, detail="Pro plan required")
    return user


async def require_business(user: User = Depends(get_current_user)) -> User:
    if not user.subscription or user.subscription.plan != PlanTier.BUSINESS:
        raise HTTPException(status_code=403, detail="Business plan required")
    return user
