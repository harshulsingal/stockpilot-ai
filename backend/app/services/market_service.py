import yfinance as yf


def get_stock_data(ticker: str):
    """
    Fetch key stock metrics from Yahoo Finance
    """

    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        return {
            "ticker": ticker.upper(),
            "company_name": info.get("longName"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),

            "current_price": info.get("currentPrice"),

            "market_cap": info.get("marketCap"),

            "trailing_pe": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),

            "beta": info.get("beta"),

            "revenue_growth": info.get("revenueGrowth"),
            "earnings_growth": info.get("earningsGrowth"),

            "fifty_two_week_high": info.get("fiftyTwoWeekHigh"),
            "fifty_two_week_low": info.get("fiftyTwoWeekLow"),

            "dividend_yield": info.get("dividendYield"),
        }

    except Exception as e:
        print(f"Error fetching stock data for {ticker}: {e}")
        return None