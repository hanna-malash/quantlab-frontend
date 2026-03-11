import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatChartDate,
  formatPercent,
  formatPrice,
  formatTooltipDate,
  type AssetRange,
} from "@/features/assets/lib/chart";
import type { DrawdownPoint } from "@/shared/api/drawdown";

type AssetDrawdownChartProps = {
  points: DrawdownPoint[];
  selectedRange: AssetRange;
  timeframe: string;
};

export function AssetDrawdownChart(props: AssetDrawdownChartProps) {
  const { points, selectedRange, timeframe } = props;

  return (
    <div style={{ width: "100%", height: 320, minHeight: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
        >
          <defs>
            <linearGradient id="drawdownFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0.04} />
            </linearGradient>
          </defs>
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
            formatter={(value, name, item) => {
              const point = item.payload as DrawdownPoint;

              if (name === "peak_close") {
                return [formatPrice(point.peak_close), "Peak close"];
              }

              return [formatPercent(Number(value)), "Drawdown"];
            }}
          />
          <ReferenceLine y={0} stroke="#71717a" strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#dc2626"
            fill="url(#drawdownFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
