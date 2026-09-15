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


ticker = "NVDA"

market_data = get_stock_data(
    ticker
)

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

print("\n=== ANALYSIS ===\n")

print(analysis)