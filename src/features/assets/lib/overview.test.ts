import { describe, expect, it } from "vitest";

import {
  formatNullablePercent,
  formatNullablePrice,
  formatSummaryWindowLabel,
  sortAssetsOverview,
} from "@/features/assets/lib/overview";

describe("sortAssetsOverview", () => {
  it("sorts overview cards by symbol", () => {
    const result = sortAssetsOverview([
      {
        symbol: "SPY",
        name: "SPY",
        asset_class: "unknown",
        currency: "unknown",
        available_timeframes: ["1d"],
        summary_timeframe: "1d",
        summary_window: 30,
        last_timestamp_utc: null,
        last_close: null,
        return_30: null,
        volatility_30: null,
        max_drawdown: null,
      },
      {
        symbol: "AAPL",
        name: "AAPL",
        asset_class: "unknown",
        currency: "unknown",
        available_timeframes: ["1d"],
        summary_timeframe: "1d",
        summary_window: 30,
        last_timestamp_utc: null,
        last_close: null,
        return_30: null,
        volatility_30: null,
        max_drawdown: null,
      },
    ]);

    expect(result.map((asset) => asset.symbol)).toEqual(["AAPL", "SPY"]);
  });
});

describe("overview metric formatting", () => {
  it("formats nullable price values", () => {
    expect(formatNullablePrice(612.4)).toBe("612.40");
    expect(formatNullablePrice(null)).toBe("N/A");
  });

  it("formats nullable percent values", () => {
    expect(formatNullablePercent(-0.084)).toBe("-8.40%");
    expect(formatNullablePercent(null)).toBe("N/A");
  });

  it("formats a summary window label", () => {
    expect(formatSummaryWindowLabel(30, "1d")).toBe("30 periods on 1d");
  });
});
