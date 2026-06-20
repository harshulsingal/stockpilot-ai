from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    username = Column(
        String,
        unique=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )
    portfolio_holdings = relationship(
        "PortfolioHolding",
        back_populates="user",
        cascade="all, delete-orphan",
    )
