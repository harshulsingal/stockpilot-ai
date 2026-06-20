import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface HistoricalDataPoint {
  date: string;
  close: number;
}

interface StockChartProps {
  history1: HistoricalDataPoint[];
  history2: HistoricalDataPoint[];
  ticker1: string;
  ticker2: string;
}

export default function StockChart({
  history1,
  history2,
  ticker1,
  ticker2,
}: StockChartProps) {
  if (!history1.length) return null;

  const mergedData = history1.map(
    (item, index) => ({
      date: item.date,
      stock1: item.close,
      stock2:
        history2[index]?.close ?? null,
    })
  );

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        height: 500,
        background:
          "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
      }}
    >
     <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Stock Comparison
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <LineChart data={mergedData}>
          <CartesianGrid
            stroke="#334155"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="date"
            tick={{
              fill: "#CBD5E1",
            }}
          />

          <YAxis
            tick={{
              fill: "#CBD5E1",
            }}
          />

          <Tooltip
            contentStyle={{
              background: "#1E293B",
              border:
                "1px solid #C084FC",
              borderRadius: "12px",
              color: "#fff",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="stock1"
            name={ticker1}
            stroke="#C084FC"
            strokeWidth={3}
            dot={false}
          />

          {history2.length > 0 && (
            <Line
              type="monotone"
              dataKey="stock2"
              name={ticker2}
              stroke="#4ADE80"
              strokeWidth={3}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}