export interface Stock {
    ticker: string;
    name: string;
    current_price: number;
    currency: string;
    market_cap: number;
    day_high: number;
    day_low: number;
}

export interface HistoricalDataPoint {
    date: string;
    close: number;
}