from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import generate_uuid


class IncidentUpdate(Base):
    __tablename__ = "incident_updates"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    incident_id: Mapped[str] = mapped_column(String, ForeignKey("incidents.id"), nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    posted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    incident: Mapped["Incident"] = relationship("Incident", back_populates="updates")  # noqa: F821

    def __repr__(self) -> str:
        return f"<IncidentUpdate incident_id={self.incident_id}>"
