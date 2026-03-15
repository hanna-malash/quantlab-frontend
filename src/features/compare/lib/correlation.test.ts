import { describe, expect, it } from "vitest";

import {
  formatCorrelationValue,
  getCommonTimeframes,
  getInitialSelectedSymbols,
} from "@/features/compare/lib/correlation";

describe("getCommonTimeframes", () => {
  it("returns the intersection of selected asset timeframes", () => {
    const result = getCommonTimeframes(
      [
        {
          symbol: "SPY",
          name: "SPY",
          asset_class: "unknown",
          currency: "unknown",
          timeframes: ["1d", "1h"],
        },
        {
          symbol: "QQQ",
          name: "QQQ",
          asset_class: "unknown",
          currency: "unknown",
          timeframes: ["1d"],
        },
      ],
      ["SPY", "QQQ"],
    );

    expect(result).toEqual(["1d"]);
  });
});

describe("getInitialSelectedSymbols", () => {
  it("prefers the first pair that shares a timeframe", () => {
    const result = getInitialSelectedSymbols([
      {
        symbol: "BTCUSDT",
        name: "BTCUSDT",
        asset_class: "unknown",
        currency: "unknown",
        timeframes: ["1h"],
      },
      {
        symbol: "SPY",
        name: "SPY",
        asset_class: "unknown",
        currency: "unknown",
        timeframes: ["1d"],
      },
      {
        symbol: "QQQ",
        name: "QQQ",
        asset_class: "unknown",
        currency: "unknown",
        timeframes: ["1d"],
      },
    ]);

    expect(result).toEqual(["SPY", "QQQ"]);
  });
});

describe("formatCorrelationValue", () => {
  it("formats matrix values for display", () => {
    expect(formatCorrelationValue(0.963677)).toBe("0.96");
  });
});
