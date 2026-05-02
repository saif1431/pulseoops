from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.auth import RegisterRequest, LoginRequest, OAuthRequest, TokenResponse, UserResponse
from app.services.auth_service import register_user, login_user, oauth_login
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user, token = await register_user(data, db)
    plan = user.subscription.plan if user.subscription else "FREE"
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id, email=user.email,
            name=user.name, plan=plan,
            stripe_customer_id=user.stripe_customer_id
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    user, token = await login_user(data, db)
    plan = user.subscription.plan if user.subscription else "FREE"
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id, email=user.email,
            name=user.name, plan=plan,
            stripe_customer_id=user.stripe_customer_id
        )
    )


@router.post("/oauth", response_model=TokenResponse)
async def oauth(data: OAuthRequest, db: AsyncSession = Depends(get_db)):
    user, token = await oauth_login(data.provider, data.token, db)
    plan = user.subscription.plan if user.subscription else "FREE"
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id, email=user.email,
            name=user.name, plan=plan,
            stripe_customer_id=user.stripe_customer_id
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    plan = current_user.subscription.plan if current_user.subscription else "FREE"
    return UserResponse(
        id=current_user.id, email=current_user.email,
        name=current_user.name, plan=plan,
        stripe_customer_id=current_user.stripe_customer_id
    )
