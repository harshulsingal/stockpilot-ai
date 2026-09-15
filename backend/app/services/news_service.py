from urllib.parse import quote_plus

import feedparser
import yfinance as yf
from urllib.parse import quote_plus


def get_google_news(
    company_name: str,
):
    """
    Primary news source.
    """

    try:

        query = quote_plus(
            f"{company_name} stock"
        )

        rss_url = (
            "https://news.google.com/rss/search"
            f"?q={query}"
        )

        feed = feedparser.parse(
            rss_url
        )

        articles = []

        for entry in feed.entries:

            articles.append(
                {
                    "title": entry.get(
                        "title",
                        "",
                    ),
                    "description": "",
                    "source": "Google News",
                    "published_at": entry.get(
                        "published",
                        "",
                    ),
                    "url": entry.get(
                        "link",
                        "",
                    ),
                }
            )

        return articles

    except Exception as e:

        print(
            f"Google News Error: {e}"
        )

        return []


def get_yahoo_news(
    ticker: str,
):
    """
    Backup news source.
    """

    try:

        stock = yf.Ticker(ticker)

        raw_news = stock.news

        articles = []

        for item in raw_news:

            content = item.get(
                "content",
                {}
            )

            title = content.get(
                "title",
                ""
            )

            if not title:
                continue

            articles.append(
                {
                    "title": title,
                    "description": content.get(
                        "summary",
                        ""
                    ),
                    "source": content.get(
                        "provider",
                        {},
                    ).get(
                        "displayName",
                        "Yahoo Finance",
                    ),
                    "published_at": content.get(
                        "pubDate",
                        "",
                    ),
                    "url": content.get(
                        "canonicalUrl",
                        {},
                    ).get(
                        "url",
                        "",
                    ),
                }
            )

        return articles

    except Exception as e:

        print(
            f"Yahoo News Error: {e}"
        )

        return []


def get_stock_news(
    company_name: str,
    ticker: str,
    limit: int = 20,
):
    """
    Google News first.
    Yahoo Finance second.

    Deduplicates articles.
    """

    google_news = get_google_news(
        company_name
    )

    yahoo_news = get_yahoo_news(
        ticker
    )

    all_articles = (
        google_news + yahoo_news
    )

    seen_titles = set()

    unique_articles = []

    for article in all_articles:

        title = (
            article.get(
                "title",
                "",
            )
            .strip()
        )

        if not title:
            continue

        normalized_title = (
            title.lower()
        )

        if (
            normalized_title
            in seen_titles
        ):
            continue

        seen_titles.add(
            normalized_title
        )

        unique_articles.append(
            article
        )

    return unique_articles[
        :limit
    ]


def build_news_context(
    news_articles,
):
    """
    Converts articles into GPT context.
    """

    if not news_articles:

        return (
            "No recent news available."
        )

    context = []

    for article in news_articles:

        context.append(
            f"""
Title: {article['title']}
Source: {article['source']}
Published: {article['published_at']}
Summary: {article['description']}
"""
        )

    return "\n".join(context)