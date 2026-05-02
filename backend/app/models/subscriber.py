from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Subscriber(Base, TimestampMixin):
    __tablename__ = "subscribers"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    status_page_id: Mapped[str] = mapped_column(String, ForeignKey("status_pages.id"), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_token: Mapped[str] = mapped_column(String, nullable=True)

    # Relationships
    status_page: Mapped["StatusPage"] = relationship("StatusPage", back_populates="subscribers")  # noqa: F821

    def __repr__(self) -> str:
        return f"<Subscriber email={self.email} status_page_id={self.status_page_id}>"
