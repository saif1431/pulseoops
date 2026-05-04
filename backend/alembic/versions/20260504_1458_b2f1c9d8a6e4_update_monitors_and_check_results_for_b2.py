"""update monitors and check_results for b2

Revision ID: b2f1c9d8a6e4
Revises: 9e1fdb7767c5
Create Date: 2026-05-04 14:58:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b2f1c9d8a6e4"
down_revision: Union[str, Sequence[str], None] = "9e1fdb7767c5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TYPE monitortype ADD VALUE IF NOT EXISTS 'HTTPS'")
        op.execute("ALTER TYPE monitorstatus ADD VALUE IF NOT EXISTS 'DEGRADED'")

    with op.batch_alter_table("monitors") as batch_op:
        batch_op.alter_column("name", existing_type=sa.String(), type_=sa.String(length=255), existing_nullable=False)
        batch_op.alter_column("url", existing_type=sa.String(), type_=sa.String(length=2048), existing_nullable=False)
        batch_op.alter_column("interval_seconds", existing_type=sa.Integer(), server_default="300", existing_nullable=False)
        batch_op.alter_column("expected_status_code", existing_type=sa.Integer(), nullable=False, server_default="200")

        batch_op.add_column(
            sa.Column("type", sa.Enum("HTTP", "HTTPS", name="monitortype"), nullable=False, server_default="HTTPS")
        )
        batch_op.add_column(
            sa.Column(
                "last_status",
                sa.Enum("UP", "DOWN", "DEGRADED", "PENDING", name="monitorstatus"),
                nullable=False,
                server_default="PENDING",
            )
        )
        batch_op.add_column(sa.Column("last_response_ms", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("last_checked_at", sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column("next_check_at", sa.DateTime(), nullable=False, server_default=sa.func.now()))
        batch_op.add_column(sa.Column("show_on_status_page", sa.Boolean(), nullable=False, server_default=sa.true()))

        batch_op.drop_column("monitor_type")
        batch_op.drop_column("timeout_seconds")
        batch_op.drop_column("status")
        batch_op.drop_column("keyword")
        batch_op.create_index("ix_monitors_user_id", ["user_id"], unique=False)

    with op.batch_alter_table("check_results") as batch_op:
        batch_op.add_column(sa.Column("response_ms", sa.Integer(), nullable=True))
        batch_op.alter_column(
            "error_message",
            existing_type=sa.String(),
            type_=sa.String(length=500),
            existing_nullable=True,
        )
        batch_op.create_index("ix_check_results_checked_at", ["checked_at"], unique=False)
        batch_op.create_index("ix_check_results_monitor_checked", ["monitor_id", "checked_at"], unique=False)
        batch_op.drop_column("response_time_ms")


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("check_results") as batch_op:
        batch_op.add_column(sa.Column("response_time_ms", sa.Float(), nullable=True))
        batch_op.drop_index("ix_check_results_monitor_checked")
        batch_op.drop_index("ix_check_results_checked_at")
        batch_op.alter_column(
            "error_message",
            existing_type=sa.String(length=500),
            type_=sa.String(),
            existing_nullable=True,
        )
        batch_op.drop_column("response_ms")

    with op.batch_alter_table("monitors") as batch_op:
        batch_op.add_column(sa.Column("keyword", sa.String(), nullable=True))
        batch_op.add_column(
            sa.Column(
                "status",
                sa.Enum("UP", "DOWN", "PAUSED", "PENDING", name="monitorstatus"),
                nullable=False,
                server_default="PENDING",
            )
        )
        batch_op.add_column(sa.Column("timeout_seconds", sa.Integer(), nullable=False, server_default="10"))
        batch_op.add_column(
            sa.Column(
                "monitor_type",
                sa.Enum("HTTP", "TCP", "PING", name="monitortype"),
                nullable=False,
                server_default="HTTP",
            )
        )
        batch_op.drop_index("ix_monitors_user_id")
        batch_op.drop_column("show_on_status_page")
        batch_op.drop_column("next_check_at")
        batch_op.drop_column("last_checked_at")
        batch_op.drop_column("last_response_ms")
        batch_op.drop_column("last_status")
        batch_op.drop_column("type")
        batch_op.alter_column("expected_status_code", existing_type=sa.Integer(), nullable=True, server_default=None)
        batch_op.alter_column("interval_seconds", existing_type=sa.Integer(), server_default=None, existing_nullable=False)
        batch_op.alter_column("url", existing_type=sa.String(length=2048), type_=sa.String(), existing_nullable=False)
        batch_op.alter_column("name", existing_type=sa.String(length=255), type_=sa.String(), existing_nullable=False)
