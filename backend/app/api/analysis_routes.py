from fastapi import APIRouter

from app.services.market_service import (
    get_stock_data,
)

from app.services.news_service import (
    get_stock_news,
    build_news_context,
)

from app.services.ai_analysis_service import (
    analyze_stock,
)

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.get("/{ticker}")
def analyze_ticker(
    ticker: str,
):
    market_data = get_stock_data(
        ticker
    )

    if not market_data:
        return {
            "error": "Ticker not found"
        }

    news = get_stock_news(
        company_name=market_data[
            "company_name"
        ],
        ticker=ticker,
    )

    news_context = build_news_context(
        news
    )

    analysis = analyze_stock(
        market_data,
        news_context,
    )

    return {
        "ticker": ticker,
        "market_data": market_data,
        "news_articles": news,
        "analysis": analysis,
    }