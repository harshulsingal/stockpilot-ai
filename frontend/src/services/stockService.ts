import {
  getStockData,
  getStockHistory,
} from "../api/stockApi";

export const fetchStocks = async (
  ticker1: string,
  ticker2: string,
  period: string
) => {
  const stockData1 =
    await getStockData(ticker1);

  const historyData1 =
    await getStockHistory(
      ticker1,
      period
    );

  let stockData2 = null;
  let historyData2 = [];

  if (ticker2.trim() !== "") {
    stockData2 =
      await getStockData(ticker2);

    historyData2 =
      await getStockHistory(
        ticker2,
        period
      );
  }

  return {
    stockData1,
    stockData2,
    historyData1,
    historyData2,
  };
};

export const fetchPeriodData = async (
  ticker1: string,
  ticker2: string,
  period: string
) => {
  const historyData1 =
    await getStockHistory(
      ticker1,
      period
    );

  let historyData2 = [];

  if (ticker2.trim() !== "") {
    historyData2 =
      await getStockHistory(
        ticker2,
        period
      );
  }

  return {
    historyData1,
    historyData2,
  };
};