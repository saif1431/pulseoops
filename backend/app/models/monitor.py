import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class MonitorType(str, enum.Enum):
    HTTP = "http"
    HTTPS = "https"


class MonitorStatus(str, enum.Enum):
    UP = "up"
    DOWN = "down"
    DEGRADED = "degraded"
    PENDING = "pending"


class Monitor(Base):
    __tablename__ = "monitors"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    type: Mapped[MonitorType] = mapped_column(SAEnum(MonitorType), default=MonitorType.HTTPS)
    interval_seconds: Mapped[int] = mapped_column(Integer, default=300)
    expected_status_code: Mapped[int] = mapped_column(Integer, default=200)
    last_status: Mapped[MonitorStatus] = mapped_column(SAEnum(MonitorStatus), default=MonitorStatus.PENDING)
    last_response_ms: Mapped[int | None] = mapped_column(Integer)
    last_checked_at: Mapped[datetime | None] = mapped_column(DateTime)
    next_check_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    show_on_status_page: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="monitors")
    check_results: Mapped[list["CheckResult"]] = relationship("CheckResult", back_populates="monitor", lazy="dynamic")
    incidents: Mapped[list["Incident"]] = relationship("Incident", back_populates="monitor")
