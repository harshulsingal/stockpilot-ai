from dotenv import load_dotenv
import os

from app.services.news_service import (
    get_stock_news,
    build_news_context,
)

load_dotenv()

print("\n=== ENVIRONMENT ===\n")

print(
    "OPENAI_API_KEY Loaded:",
    os.getenv("OPENAI_API_KEY") is not None,
)

print(
    "NEWS_API_KEY Loaded:",
    os.getenv("NEWS_API_KEY") is not None,
)

print("\n=== FETCHING NEWS ===\n")

company_name = "NVIDIA"
ticker = "NVDA"

print(f"Company: {company_name}")
print(f"Ticker: {ticker}")

news = get_stock_news(
    company_name=company_name,
    ticker=ticker,
)

print(
    f"\nArticles Found: {len(news)}\n"
)

print(
    "\n=== NEWS ARTICLES ===\n"
)

for i, article in enumerate(
    news,
    start=1,
):
    print(f"Article {i}")
    print(
        f"Title: {article['title']}"
    )
    print(
        f"Source: {article['source']}"
    )
    print(
        f"Published: {article['published_at']}"
    )
    print(
        f"URL: {article['url']}"
    )
    print("-" * 50)

print(
    "\n=== GPT CONTEXT ===\n"
)

context = build_news_context(news)

print(context)

print(
    "\n=== CONTEXT LENGTH ===\n"
)

print(len(context))