import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
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
import type { SeriesPoint } from "@/shared/api/returns";

type AssetReturnsChartProps = {
  points: SeriesPoint[];
  selectedRange: AssetRange;
};

export function AssetReturnsChart(props: AssetReturnsChartProps) {
  const { points, selectedRange } = props;

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
              formatChartDate(String(value), selectedRange)
            }
            minTickGap={30}
          />
          <YAxis
            width={80}
            tickFormatter={(value) => formatPercent(Number(value))}
          />
          <Tooltip
            labelFormatter={(value) => formatTooltipDate(String(value))}
            formatter={(value) => [formatPercent(Number(value)), "Log return"]}
          />
          <ReferenceLine y={0} stroke="#71717a" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0f766e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
