import { useState } from "react";

import {
  Container,
  Typography,
  Box,
} from "@mui/material";

import SearchBar from "../components/SearchBar";
import StockCard from "../components/StockCard";
import StockChart from "../components/StockChart";
import PeriodSelector from "../components/PeriodSelector";

import {
  fetchStocks,
  fetchPeriodData,
} from "../services/stockService";

import {useAuth} from "../context/AuthContext";
interface HistoricalDataPoint {
  date: string;
  close: number;
}

export default function Home() {
   
  const [ticker1, setTicker1] = useState("AAPL");
  const [ticker2, setTicker2] = useState("MSFT");

  const [stock1, setStock1] = useState(null);
  const [stock2, setStock2] = useState(null);

  const [history1, setHistory1] = useState<
    HistoricalDataPoint[]
  >([]);

  const [history2, setHistory2] = useState<
    HistoricalDataPoint[]
  >([]);

  const [period, setPeriod] =
    useState("1y");
  
  const {user}=useAuth();

  const handleSearch = async () => {
    try {
      const {
        stockData1,
        stockData2,
        historyData1,
        historyData2,
      } = await fetchStocks(
        ticker1,
        ticker2,
        period
      );

      setStock1(stockData1);
      setStock2(stockData2);

      setHistory1(historyData1);
      setHistory2(historyData2);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePeriodChange = async (
    newPeriod: string
  ) => {
    try {
      setPeriod(newPeriod);

      const {
        historyData1,
        historyData2,
      } = await fetchPeriodData(
        ticker1,
        ticker2,
        newPeriod
      );

      setHistory1(historyData1);
      setHistory2(historyData2);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
            textAlign: "center",
            mb: 5,
        }}
        >
        {user && (
            <Typography
            variant="h5"
            sx={{ mb: 2 ,fontWeight: "bold"}}
            >
            Welcome back, {user.username}
            </Typography>
        )}


        <Typography
            variant="h6"
            color="text.secondary"
        >
            Compare stocks and visualize
            historical performance
        </Typography>
        </Box>

      {/* Search */}
        <SearchBar
          ticker1={ticker1}
          ticker2={ticker2}
          setTicker1={setTicker1}
          setTicker2={setTicker2}
          onSearch={handleSearch}
        />


      {/* Empty State */}
      {!stock1 && !stock2 && (
        <Typography
          align="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          Search two stocks to start
          comparing.
        </Typography>
      )}

      {/* Stock Cards */}
      {(stock1 || stock2) && (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <StockCard stock={stock1} />
          <StockCard stock={stock2} />
        </Box>
      )}

       {/* Chart Section */}
            {(history1.length > 0 ||
            history2.length > 0) && (
            <Box sx={{ mt: 5 }}>
                <PeriodSelector
                selectedPeriod={period}
                onPeriodChange={
                    handlePeriodChange
                }
                />
                <StockChart
                history1={history1}
                history2={history2}
                ticker1={ticker1}
                ticker2={ticker2}
                />
            </Box>
            )}
    </Container>
  );
}