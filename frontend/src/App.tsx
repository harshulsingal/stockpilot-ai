import { useState } from "react";

import SearchBar from "./components/SearchBar";
import StockCard from "./components/StockCard";
import StockChart from "./components/StockChart";

import {
  getStockData as getStock,
  getStockHistory as getHistory,
} from "./api/stockApi";

interface HistoricalDataPoint {
  date: string;
  close: number;
}

function App() {
  const [ticker, setTicker] = useState("AAPL");

  const [stock, setStock] = useState(null);

  const [history, setHistory] = useState<
    HistoricalDataPoint[]
  >([]);

  const [period, setPeriod] =
    useState("1y");

  const handleSearch = async () => {
    try {
      const stockData = await getStock(ticker);

      const historyData = await getHistory(
        ticker,
        period
      );

      setStock(stockData);

      setHistory(historyData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePeriodChange = async (
    newPeriod: string
  ) => {
    try {
      setPeriod(newPeriod);

      const historyData = await getHistory(
        ticker,
        newPeriod
      );

      setHistory(historyData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>StockPilot AI</h1>

      <SearchBar
        ticker={ticker}
        setTicker={setTicker}
        onSearch={handleSearch}
      />

      <StockCard stock={stock} />

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() =>
            handlePeriodChange("1mo")
          }
        >
          1M
        </button>

        <button
          onClick={() =>
            handlePeriodChange("3mo")
          }
        >
          3M
        </button>

        <button
          onClick={() =>
            handlePeriodChange("6mo")
          }
        >
          6M
        </button>

        <button
          onClick={() =>
            handlePeriodChange("1y")
          }
        >
          1Y
        </button>

        <button
          onClick={() =>
            handlePeriodChange("5y")
          }
        >
          5Y
        </button>
      </div>

      <StockChart data={history} />
    </div>
  );
}

export default App;