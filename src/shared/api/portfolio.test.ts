import { afterEach, describe, expect, it, vi } from "vitest";

import { getPortfolioAnalytics } from "@/shared/api/portfolio";

describe("getPortfolioAnalytics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts portfolio allocations and returns typed analytics", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        timeframe: "1d",
        limit: 365,
        observations: 3,
        base_value: 100,
        return_type: "log",
        allocations: [
          { symbol: "SPY", weight: 0.6 },
          { symbol: "QQQ", weight: 0.4 },
        ],
        series: [{ timestamp_utc: "2024-01-01T00:00:00+00:00", value: 100 }],
        summary: {
          total_return: 0.11,
          volatility: 0.07,
          max_drawdown: -0.15,
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getPortfolioAnalytics({
      allocations: [
        { symbol: "spy", weight: 60 },
        { symbol: "qqq", weight: 40 },
      ],
      timeframe: "1d",
      limit: 365,
      baseValue: 100,
      returnType: "log",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/portfolio/analytics",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          allocations: [
            { symbol: "SPY", weight: 60 },
            { symbol: "QQQ", weight: 40 },
          ],
          timeframe: "1d",
          limit: 365,
          base_value: 100,
          return_type: "log",
        }),
      }),
    );
    expect(result.summary.total_return).toBe(0.11);
  });
});
