"""add incidents and incident_updates

Revision ID: 3d5c9821be0c
Revises: b2f1c9d8a6e4
Create Date: 2026-05-04 11:13:08.307700+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d5c9821be0c'
down_revision: Union[str, Sequence[str], None] = 'b2f1c9d8a6e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TYPE incidentstatus ADD VALUE IF NOT EXISTS 'INVESTIGATING'")
        op.execute("ALTER TYPE incidentstatus ADD VALUE IF NOT EXISTS 'IDENTIFIED'")
        op.execute("ALTER TYPE incidentstatus ADD VALUE IF NOT EXISTS 'MONITORING'")

    incident_columns = {col["name"] for col in inspector.get_columns("incidents")}
    incident_indexes = {idx["name"] for idx in inspector.get_indexes("incidents")}
    incident_update_columns = {
        col["name"] for col in inspector.get_columns("incident_updates")
    }
    incident_foreign_keys = {fk["name"] for fk in inspector.get_foreign_keys("incidents")}

    with op.batch_alter_table("incidents") as batch_op:
        if "user_id" not in incident_columns:
            batch_op.add_column(sa.Column("user_id", sa.String(), nullable=False))
        if "title" in incident_columns:
            batch_op.alter_column("title", existing_type=sa.VARCHAR(), nullable=False)
        if "status" in incident_columns:
            batch_op.alter_column(
                "status",
                existing_type=sa.VARCHAR(length=12),
                type_=sa.Enum(
                    "INVESTIGATING",
                    "IDENTIFIED",
                    "MONITORING",
                    "RESOLVED",
                    name="incidentstatus",
                ),
                existing_nullable=False,
            )
        if "ix_incidents_user_id" not in incident_indexes:
            batch_op.create_index("ix_incidents_user_id", ["user_id"], unique=False)
        if "fk_incidents_user_id_users" not in incident_foreign_keys:
            batch_op.create_foreign_key(
                "fk_incidents_user_id_users", "users", ["user_id"], ["id"]
            )
        if "created_at" in incident_columns:
            batch_op.drop_column("created_at")
        if "updated_at" in incident_columns:
            batch_op.drop_column("updated_at")
        if "description" in incident_columns:
            batch_op.drop_column("description")

    with op.batch_alter_table("incident_updates") as batch_op:
        if "status" not in incident_update_columns:
            batch_op.add_column(
                sa.Column(
                    "status",
                    sa.Enum(
                        "INVESTIGATING",
                        "IDENTIFIED",
                        "MONITORING",
                        "RESOLVED",
                        name="incidentstatus",
                    ),
                    nullable=False,
                    server_default="INVESTIGATING",
                )
            )


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("incident_updates") as batch_op:
        batch_op.drop_column("status")

    with op.batch_alter_table("incidents") as batch_op:
        batch_op.add_column(sa.Column("description", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("updated_at", sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column("created_at", sa.DateTime(), nullable=False))
        batch_op.drop_constraint("fk_incidents_user_id_users", type_="foreignkey")
        batch_op.drop_index("ix_incidents_user_id")
        batch_op.alter_column(
            "status",
            existing_type=sa.Enum(
                "INVESTIGATING",
                "IDENTIFIED",
                "MONITORING",
                "RESOLVED",
                name="incidentstatus",
            ),
            type_=sa.VARCHAR(length=12),
            existing_nullable=False,
        )
        batch_op.alter_column("title", existing_type=sa.VARCHAR(), nullable=True)
        batch_op.drop_column("user_id")
