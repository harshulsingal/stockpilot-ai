# app/services/stock_service.py

import yfinance as yf

def get_stock_data(ticker: str):
    stock = yf.Ticker(ticker)
    info = stock.info

    return {
        "ticker": ticker.upper(),
        "name": info.get("longName"),
        "current_price": info.get("currentPrice"),
        "currency": info.get("currency"),
        "market_cap": info.get("marketCap"),
        "day_high": info.get("dayHigh"),
        "day_low": info.get("dayLow")
    }

def get_stock_history(ticker:str, period:str):
    stock = yf.Ticker(ticker)
    history = stock.history(period=period)

    result= []
    for index, row in history.iterrows():
        result.append({
            "date": index.strftime("%Y-%m-%d"),
            "close": round(float(row["Close"]), 2)
        })
    return result