type Props = {
  stock: any;
};

export default function StockCard({ stock }: Props) {
  if (!stock) return null;

  return (
    <div>
      <h2>{stock.name}</h2>

      <p>Price: ${stock.current_price}</p>
      <p>Market Cap: {stock.market_cap}</p>
      <p>High: {stock.day_high}</p>
      <p>Low: {stock.day_low}</p>
    </div>
  );
}