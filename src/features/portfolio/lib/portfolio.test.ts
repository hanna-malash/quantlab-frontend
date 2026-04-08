import { describe, expect, it } from "vitest";

import {
  buildEqualWeightMap,
  getInitialPortfolioSymbols,
  getPortfolioAllocations,
  getPortfolioWeightTotal,
} from "@/features/portfolio/lib/portfolio";

describe("buildEqualWeightMap", () => {
  it("splits selected symbols into roughly equal percentage weights", () => {
    expect(buildEqualWeightMap(["SPY", "QQQ"])).toEqual({
      SPY: "50.00",
      QQQ: "50.00",
    });
  });
});

describe("getPortfolioAllocations", () => {
  it("converts draft weight inputs into positive allocations only", () => {
    expect(
      getPortfolioAllocations(["SPY", "QQQ", "BTCUSDT"], {
        SPY: "60",
        QQQ: "40",
        BTCUSDT: "0",
      }),
    ).toEqual([
      { symbol: "SPY", weight: 60 },
      { symbol: "QQQ", weight: 40 },
    ]);
  });
});

describe("getPortfolioWeightTotal", () => {
  it("sums selected positive draft weights", () => {
    expect(
      getPortfolioWeightTotal(["SPY", "QQQ"], {
        SPY: "55.5",
        QQQ: "44.5",
      }),
    ).toBe(100);
  });
});

describe("getInitialPortfolioSymbols", () => {
  it("prefers the first pair that shares a timeframe", () => {
    const result = getInitialPortfolioSymbols([
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
