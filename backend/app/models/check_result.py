from datetime import datetime
from sqlalchemy import String, Integer, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import generate_uuid


class CheckResult(Base):
    __tablename__ = "check_results"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    monitor_id: Mapped[str] = mapped_column(String, ForeignKey("monitors.id"), nullable=False, index=True)
    checked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    is_up: Mapped[bool] = mapped_column(Boolean, nullable=False)
    response_time_ms: Mapped[float] = mapped_column(Float, nullable=True)
    status_code: Mapped[int] = mapped_column(Integer, nullable=True)
    error_message: Mapped[str] = mapped_column(String, nullable=True)

    # Relationships
    monitor: Mapped["Monitor"] = relationship("Monitor", back_populates="check_results")  # noqa: F821

    def __repr__(self) -> str:
        return f"<CheckResult monitor_id={self.monitor_id} is_up={self.is_up}>"
