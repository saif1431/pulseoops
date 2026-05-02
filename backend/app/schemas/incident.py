from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.incident import IncidentStatus


class IncidentUpdateCreate(BaseModel):
    message: str


class IncidentUpdateOut(BaseModel):
    id: str
    incident_id: str
    message: str
    posted_at: datetime

    model_config = {"from_attributes": True}


class IncidentOut(BaseModel):
    id: str
    monitor_id: str
    status: IncidentStatus
    started_at: datetime
    resolved_at: Optional[datetime] = None
    title: Optional[str] = None
    description: Optional[str] = None
    updates: list[IncidentUpdateOut] = []

    model_config = {"from_attributes": True}


class IncidentResolve(BaseModel):
    message: Optional[str] = None
