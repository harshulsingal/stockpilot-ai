# app/models/stock.py

from pydantic import BaseModel

class StockResponse(BaseModel):
    ticker: str
    name: str | None = None
    current_price: float | None = None
    currency: str | None = None
    market_cap: int | None = None
    day_high: float | None = None
    day_low: float | None = None

class HistoricalDataPoint(BaseModel):
    date:str
    close:float