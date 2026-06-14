import axios from "axios";

const API_BASE = "http://localhost:8000/api/stocks";

export const getStockData = async (ticker: string) => {
  const response = await axios.get(
    `${API_BASE}/${ticker}`
  );

  return response.data;
};

export const getStockHistory = async (
  ticker: string,
  period: string
) => {
  const response = await axios.get(
    `${API_BASE}/${ticker}/history?period=${period}`
  );

  return response.data;
};