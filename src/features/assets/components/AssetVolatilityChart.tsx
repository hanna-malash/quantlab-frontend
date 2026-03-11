import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatChartDate,
  formatPercent,
  formatTooltipDate,
  type AssetRange,
} from "@/features/assets/lib/chart";
import type { VolatilityPoint } from "@/shared/api/volatility";

type AssetVolatilityChartProps = {
  points: VolatilityPoint[];
  selectedRange: AssetRange;
  timeframe: string;
};

export function AssetVolatilityChart(props: AssetVolatilityChartProps) {
  const { points, selectedRange, timeframe } = props;

  return (
    <div style={{ width: "100%", height: 320, minHeight: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={points}
          margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp_utc"
            tickFormatter={(value) =>
              formatChartDate(String(value), selectedRange, timeframe)
            }
            minTickGap={30}
            tickMargin={8}
          />
          <YAxis
            width={80}
            tickFormatter={(value) => formatPercent(Number(value))}
          />
          <Tooltip
            labelFormatter={(value) => formatTooltipDate(String(value))}
            formatter={(value) => [formatPercent(Number(value)), "Volatility"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#b45309"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
