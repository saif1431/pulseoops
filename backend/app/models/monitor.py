import enum
from sqlalchemy import String, Integer, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class MonitorType(str, enum.Enum):
    HTTP = "http"
    TCP = "tcp"
    PING = "ping"


class MonitorStatus(str, enum.Enum):
    UP = "up"
    DOWN = "down"
    PAUSED = "paused"
    PENDING = "pending"


class Monitor(Base, TimestampMixin):
    __tablename__ = "monitors"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    monitor_type: Mapped[MonitorType] = mapped_column(SAEnum(MonitorType), default=MonitorType.HTTP)
    interval_seconds: Mapped[int] = mapped_column(Integer, default=60)
    timeout_seconds: Mapped[int] = mapped_column(Integer, default=10)
    status: Mapped[MonitorStatus] = mapped_column(SAEnum(MonitorStatus), default=MonitorStatus.PENDING)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Optional HTTP check fields
    expected_status_code: Mapped[int] = mapped_column(Integer, nullable=True)
    keyword: Mapped[str] = mapped_column(String, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="monitors")  # noqa: F821
    check_results: Mapped[list["CheckResult"]] = relationship(  # noqa: F821
        "CheckResult", back_populates="monitor", cascade="all, delete-orphan"
    )
    incidents: Mapped[list["Incident"]] = relationship(  # noqa: F821
        "Incident", back_populates="monitor", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Monitor id={self.id} name={self.name} status={self.status}>"
