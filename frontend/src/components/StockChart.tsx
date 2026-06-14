import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface HistoricalDataPoint {
  date: string;
  close: number;
}

interface StockChartProps {
  data: HistoricalDataPoint[];
}

export default function StockChart({
  data,
}: StockChartProps) {
  if (!data.length) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "450px",
        marginTop: "30px",
      }}
    >
      <h2>Price History</h2>
      

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="close"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}