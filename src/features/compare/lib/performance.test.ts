import { describe, expect, it } from "vitest";

import { buildPerformanceChartData } from "@/features/compare/lib/performance";

describe("buildPerformanceChartData", () => {
  it("converts normalized series into chart rows", () => {
    const result = buildPerformanceChartData({
      symbols: ["SPY", "QQQ"],
      timeframe: "1d",
      limit: 365,
      observations: 2,
      base_value: 100,
      series: [
        {
          symbol: "SPY",
          points: [
            { timestamp_utc: "2024-01-01T00:00:00+00:00", value: 100 },
            { timestamp_utc: "2024-01-02T00:00:00+00:00", value: 110 },
          ],
        },
        {
          symbol: "QQQ",
          points: [
            { timestamp_utc: "2024-01-01T00:00:00+00:00", value: 100 },
            { timestamp_utc: "2024-01-02T00:00:00+00:00", value: 105 },
          ],
        },
      ],
    });

    expect(result).toEqual([
      {
        timestamp_utc: "2024-01-01T00:00:00+00:00",
        SPY: 100,
        QQQ: 100,
      },
      {
        timestamp_utc: "2024-01-02T00:00:00+00:00",
        SPY: 110,
        QQQ: 105,
      },
    ]);
  });
});
