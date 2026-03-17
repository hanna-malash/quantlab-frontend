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
  formatPrice,
  formatTooltipDate,
} from "@/features/assets/lib/chart";
import { buildPerformanceChartData } from "@/features/compare/lib/performance";
import type { NormalizedPerformanceDto } from "@/shared/api/normalizedPerformance";

type NormalizedPerformanceChartProps = {
  performance: NormalizedPerformanceDto;
};

const LINE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#dc2626",
  "#0f766e",
];

export function NormalizedPerformanceChart(
  props: NormalizedPerformanceChartProps,
) {
  const { performance } = props;
  const chartData = buildPerformanceChartData(performance);

  return (
    <div style={{ width: "100%", height: 360, minHeight: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp_utc"
            tickFormatter={(value) =>
              formatChartDate(String(value), "1Y", performance.timeframe)
            }
            minTickGap={30}
            tickMargin={8}
          />
          <YAxis
            width={80}
            tickFormatter={(value) => formatPrice(Number(value))}
          />
          <Tooltip
            labelFormatter={(value) => formatTooltipDate(String(value))}
            itemSorter={(item) => -Number(item.value ?? 0)}
            formatter={(value, name) => [
              formatPrice(Number(value)),
              String(name),
            ]}
          />
          {performance.symbols.map((symbol, index) => (
            <Line
              key={symbol}
              type="monotone"
              dataKey={symbol}
              stroke={LINE_COLORS[index % LINE_COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
