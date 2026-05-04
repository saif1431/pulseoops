from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from app.models.monitor import MonitorStatus

ALLOWED_INTERVALS = [30, 60, 120, 300, 600, 1800, 3600]


class MonitorCreate(BaseModel):
    name: str
    url: str
    interval_seconds: int = 300
    expected_status_code: int = 200
    show_on_status_page: bool = True

    @field_validator("interval_seconds")
    @classmethod
    def valid_interval(cls, v: int) -> int:
        if v not in ALLOWED_INTERVALS:
            raise ValueError(f"Interval must be one of {ALLOWED_INTERVALS}")
        return v

    @field_validator("url")
    @classmethod
    def valid_url(cls, v: str) -> str:
        if not v.startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")
        return v


class MonitorUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    interval_seconds: Optional[int] = None
    expected_status_code: Optional[int] = None
    show_on_status_page: Optional[bool] = None


class MonitorResponse(BaseModel):
    id: str
    name: str
    url: str
    interval_seconds: int
    expected_status_code: int
    last_status: MonitorStatus
    last_response_ms: Optional[int]
    last_checked_at: Optional[datetime]
    is_active: bool
    show_on_status_page: bool
    created_at: datetime
    uptime_percentage: Optional[float] = None

    model_config = {"from_attributes": True}
