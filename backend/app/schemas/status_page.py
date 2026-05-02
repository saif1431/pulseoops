from pydantic import BaseModel
from typing import Optional


class StatusPageCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    is_public: bool = True
    logo_url: Optional[str] = None
    primary_color: str = "#6366f1"


class StatusPageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    custom_domain: Optional[str] = None


class StatusPageOut(BaseModel):
    id: str
    user_id: str
    name: str
    slug: str
    description: Optional[str] = None
    custom_domain: Optional[str] = None
    is_public: bool
    logo_url: Optional[str] = None
    primary_color: str

    model_config = {"from_attributes": True}


class SubscriberCreate(BaseModel):
    email: str


class SubscriberOut(BaseModel):
    id: str
    email: str
    is_verified: bool

    model_config = {"from_attributes": True}
