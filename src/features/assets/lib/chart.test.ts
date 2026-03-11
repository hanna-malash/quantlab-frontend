import { describe, expect, it } from "vitest";

import {
  formatChartDate,
  formatTooltipDate,
  getLimitByRange,
  getVolatilityWindow,
} from "@/features/assets/lib/chart";

describe("chart range limits", () => {
  it("uses the backend-supported max point limit for MAX", () => {
    expect(getLimitByRange("MAX")).toBe(5000);
  });
});

describe("chart date formatting", () => {
  it("formats MAX range ticks as UTC years", () => {
    expect(formatChartDate("2024-10-01T00:00:00+00:00", "MAX", "1d")).toBe(
      "2024",
    );
  });

  it("formats tooltip dates in UTC to avoid local timezone drift", () => {
    expect(formatTooltipDate("2024-10-01T00:00:00+00:00")).toBe("01 Oct 2024");
  });

  it("uses day-level labels for intraday 1Y ranges", () => {
    expect(formatChartDate("2024-10-01T00:00:00+00:00", "1Y", "1h")).toBe(
      "01 Oct",
    );
  });
});

describe("volatility window selection", () => {
  it("uses a 30-period window for daily timeframes", () => {
    expect(getVolatilityWindow("1d")).toBe(30);
  });

  it("uses a 24-period window for intraday timeframes", () => {
    expect(getVolatilityWindow("1h")).toBe(24);
  });
});
