import { afterEach, describe, expect, it, vi } from "vitest";

import { getNormalizedPerformance } from "@/shared/api/normalizedPerformance";

describe("getNormalizedPerformance", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests normalized performance series with a base value", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        symbols: ["SPY", "QQQ"],
        timeframe: "1d",
        limit: 365,
        observations: 3,
        base_value: 100,
        series: [
          {
            symbol: "SPY",
            points: [
              { timestamp_utc: "2024-01-01T00:00:00+00:00", value: 100 },
            ],
          },
          {
            symbol: "QQQ",
            points: [
              { timestamp_utc: "2024-01-01T00:00:00+00:00", value: 100 },
            ],
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getNormalizedPerformance({
      symbols: ["spy", "qqq"],
      timeframe: "1d",
      limit: 365,
      baseValue: 100,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/analytics/normalized-performance?symbols=SPY&symbols=QQQ&timeframe=1d&limit=365&base_value=100",
      expect.objectContaining({
        method: "GET",
      }),
    );
    expect(result.base_value).toBe(100);
  });
});
