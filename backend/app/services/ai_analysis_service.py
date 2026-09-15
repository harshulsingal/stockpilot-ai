from openai import OpenAI

from app.core.config import settings
import json

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)


def analyze_stock(
    market_data: dict,
    news_context: str,
):
    """
    Generate AI stock analysis.
    """

    prompt = f"""
You are a professional equity research analyst.

Company Fundamentals:
{market_data}

Recent News:
{news_context}

Your tasks:

1. Identify the most relevant news.
2. Ignore unrelated articles.
3. Analyze the stock.

Return ONLY valid JSON.

Required JSON format:

{{
    "summary": "...",

    "bullish_factors": [
        "...",
        "..."
    ],

    "bearish_factors": [
        "...",
        "..."
    ],

    "opportunities": [
        "...",
        "..."
    ],

    "risks": [
        "...",
        "..."
    ],

    "recommendation": "Buy | Hold | Sell",

    "confidence_score": 1-10
}}
"""

    try:

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt,
        )

        return json.loads(response.output_text)

    except Exception as e:

        print(
            f"AI Analysis Error: {e}"
        )

        return None