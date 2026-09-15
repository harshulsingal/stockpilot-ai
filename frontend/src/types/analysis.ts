export interface Analysis {
  investment_score: number;

  summary: string;

  bullish_factors: string[];

  bearish_factors: string[];

  opportunities: string[];

  risks: string[];

  recommendation:
    | "Buy"
    | "Hold"
    | "Sell";

  confidence_score: number;
}

export interface AnalysisResponse {
  ticker: string;

  market_data: Record<
    string,
    unknown
  >;

  news_articles: Record<
    string,
    unknown
  >[];

  analysis: Analysis;
}