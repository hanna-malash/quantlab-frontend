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
import type { PortfolioAnalyticsDto } from "@/shared/api/portfolio";

type PortfolioPerformanceChartProps = {
  portfolio: PortfolioAnalyticsDto;
};

export function PortfolioPerformanceChart(
  props: PortfolioPerformanceChartProps,
) {
  const { portfolio } = props;

  return (
    <div style={{ width: "100%", height: 360, minHeight: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={portfolio.series}
          margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp_utc"
            tickFormatter={(value) =>
              formatChartDate(String(value), "1Y", portfolio.timeframe)
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
            formatter={(value) => [formatPrice(Number(value)), "Portfolio"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
