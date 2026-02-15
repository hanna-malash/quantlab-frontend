import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { date: "01", close: 100 },
  { date: "02", close: 105 },
  { date: "03", close: 102 },
  { date: "04", close: 110 },
  { date: "05", close: 108 },
];

export default function PricesPage() {
  return (
    <div>
      <h2>Prices</h2>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
