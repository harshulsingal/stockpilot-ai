# app/schemas/portfolio.py

from pydantic import BaseModel
from datetime import date


class PortfolioHoldingCreate(BaseModel):
    ticker: str
    quantity: float
    average_price: float
    purchase_date: date


class PortfolioHoldingUpdate(BaseModel):
    ticker: str
    quantity: float
    average_price: float
    purchase_date: date

class PortfolioHoldingResponse(BaseModel):
    id: int
    ticker: str
    company_name: str
    quantity: float
    average_price: float
    purchase_date: date

    class Config:
        from_attributes = True