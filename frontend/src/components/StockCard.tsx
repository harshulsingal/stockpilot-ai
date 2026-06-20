type Props = {
  stock: any;
};

export default function StockCard({ stock }: Props) {
  if (!stock) return null;

  const formatMarketCap = (marketCap: number) => {
    if (!marketCap) return "N/A";

    if (marketCap >= 1_000_000_000_000) {
      return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
    }

    if (marketCap >= 1_000_000_000) {
      return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
    }

    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "12px",
        padding: "16px",
        minWidth: "250px",
        margin: "10px",
      }}
    >
      <h2>
        {stock.name} ({stock.ticker})
      </h2>

      <p>
        <strong>Price:</strong> $
        {stock.current_price}
      </p>

      <p>
        <strong>Market Cap:</strong>{" "}
        {formatMarketCap(stock.market_cap)}
      </p>

      <p>
        <strong>Day High:</strong>{" "}
        {stock.day_high}
      </p>

      <p>
        <strong>Day Low:</strong>{" "}
        {stock.day_low}
      </p>
    </div>
  );
}