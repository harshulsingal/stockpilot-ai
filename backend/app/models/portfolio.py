from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy import UniqueConstraint
from datetime import datetime

from app.core.database import Base


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "ticker",
            name="unique_user_ticker"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    ticker = Column(
        String,
        nullable=False,
    )

    company_name = Column(
        String,
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
    )

    average_price = Column(
        Float,
        nullable=False,
    )

    purchase_date = Column(
        Date,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    user = relationship(
        "User",
        back_populates="portfolio_holdings",
    )