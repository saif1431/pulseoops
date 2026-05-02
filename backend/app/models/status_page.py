from sqlalchemy import String, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class StatusPage(Base, TimestampMixin):
    __tablename__ = "status_pages"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    custom_domain: Mapped[str] = mapped_column(String, nullable=True, unique=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    logo_url: Mapped[str] = mapped_column(String, nullable=True)
    primary_color: Mapped[str] = mapped_column(String, default="#6366f1")

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="status_pages")  # noqa: F821
    subscribers: Mapped[list["Subscriber"]] = relationship(  # noqa: F821
        "Subscriber", back_populates="status_page", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<StatusPage slug={self.slug}>"
