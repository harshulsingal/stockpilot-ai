# app/api/stock_routes.py

from fastapi import APIRouter, HTTPException, Query
from app.services.stock_services import get_stock_data, get_stock_history
from app.models.stock import (StockResponse, HistoricalDataPoint)

router = APIRouter()

@router.get("/{ticker}",response_model=StockResponse)
def get_stock(ticker: str):
    try:
        return get_stock_data(ticker)
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

@router.get("/{ticker}/history", response_model=list[HistoricalDataPoint]) 
def stock_history(
    ticker:str,
    period:str=Query(default="1y",description= "1mo, 3mo, 6mo, 1y, 5y")
):
    allowed_periods = [
        "1mo",
        "3mo",
        "6mo",
        "1y",
        "5y",
    ]

    if period not in allowed_periods:
        raise HTTPException(
            status_code=400,
            detail=f"Period must be one of {allowed_periods}",
        )

    try:
        return get_stock_history(
            ticker=ticker,
            period=period,
        )

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )