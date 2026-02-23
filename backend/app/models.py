from datetime import datetime, date
from sqlalchemy import (
    String, DateTime, Boolean, ForeignKey,
    Date, Float, Integer, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stores: Mapped[list["Store"]] = relationship(back_populates="owner")


class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(120))

    owner: Mapped["User"] = relationship(back_populates="stores")
    sales: Mapped[list["SaleRecord"]] = relationship(back_populates="store", cascade="all,delete-orphan")


class SaleRecord(Base):
    __tablename__ = "sales_records"
    __table_args__ = (UniqueConstraint("store_id", "day", name="uq_sales_store_day"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), index=True)

    day: Mapped[date] = mapped_column(Date, index=True)
    revenue: Mapped[float] = mapped_column(Float)
    transactions: Mapped[int | None] = mapped_column(Integer, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    store: Mapped["Store"] = relationship(back_populates="sales")