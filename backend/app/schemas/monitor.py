from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime
from app.models.monitor import MonitorType, MonitorStatus


class MonitorCreate(BaseModel):
    name: str
    url: str
    monitor_type: MonitorType = MonitorType.HTTP
    interval_seconds: int = 60
    timeout_seconds: int = 10
    expected_status_code: Optional[int] = None
    keyword: Optional[str] = None


class MonitorUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    interval_seconds: Optional[int] = None
    timeout_seconds: Optional[int] = None
    expected_status_code: Optional[int] = None
    keyword: Optional[str] = None
    is_active: Optional[bool] = None


class MonitorOut(BaseModel):
    id: str
    user_id: str
    name: str
    url: str
    monitor_type: MonitorType
    interval_seconds: int
    timeout_seconds: int
    status: MonitorStatus
    is_active: bool
    expected_status_code: Optional[int] = None
    keyword: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CheckResultOut(BaseModel):
    id: str
    monitor_id: str
    checked_at: datetime
    is_up: bool
    response_time_ms: Optional[float] = None
    status_code: Optional[int] = None
    error_message: Optional[str] = None

    model_config = {"from_attributes": True}
