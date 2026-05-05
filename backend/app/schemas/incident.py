from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.incident import IncidentStatus


class IncidentUpdateCreate(BaseModel):
    message: str
    status: IncidentStatus


class IncidentUpdateOut(BaseModel):
    id: str
    incident_id: str
    message: str
    status: IncidentStatus
    posted_at: datetime

    model_config = {"from_attributes": True}


class IncidentOut(BaseModel):
    id: str
    monitor_id: str
    user_id: str
    status: IncidentStatus
    started_at: datetime
    resolved_at: Optional[datetime] = None
    title: str
    updates: list[IncidentUpdateOut] = []

    model_config = {"from_attributes": True}


class IncidentResolve(BaseModel):
    message: Optional[str] = None
