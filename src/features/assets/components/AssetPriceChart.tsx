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
  type AssetRange,
} from "@/features/assets/lib/chart";
import type { PricePoint } from "@/shared/api/prices";

type AssetPriceChartProps = {
  points: PricePoint[];
  selectedRange: AssetRange;
};

export function AssetPriceChart(props: AssetPriceChartProps) {
  const { points, selectedRange } = props;

  return (
    <div style={{ width: "100%", height: 420, minHeight: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp_utc"
            tickFormatter={(value) =>
              formatChartDate(String(value), selectedRange)
            }
            minTickGap={30}
          />
          <YAxis tickFormatter={(value) => formatPrice(Number(value))} />
          <Tooltip
            labelFormatter={(value) => formatTooltipDate(String(value))}
            formatter={(value) => [formatPrice(Number(value)), "Close"]}
          />
          <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
