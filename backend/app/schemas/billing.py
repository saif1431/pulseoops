from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.subscription import PlanTier, SubscriptionStatus


class SubscriptionOut(BaseModel):
    id: str
    user_id: str
    plan: PlanTier
    status: SubscriptionStatus
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    current_period_end: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CheckoutSessionRequest(BaseModel):
    price_id: str


class CheckoutSessionResponse(BaseModel):
    url: str


class CustomerPortalResponse(BaseModel):
    url: str
