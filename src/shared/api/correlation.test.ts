import { afterEach, describe, expect, it, vi } from "vitest";

import { getCorrelation } from "@/shared/api/correlation";

describe("getCorrelation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests the correlation endpoint with repeated symbols params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        symbols: ["SPY", "QQQ"],
        timeframe: "1d",
        limit: 365,
        observations: 364,
        rows: [
          { symbol: "SPY", values: [1, 0.96] },
          { symbol: "QQQ", values: [0.96, 1] },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getCorrelation({
      symbols: ["spy", "qqq"],
      timeframe: "1d",
      limit: 365,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/analytics/correlation?symbols=SPY&symbols=QQQ&timeframe=1d&limit=365",
      expect.objectContaining({
        method: "GET",
      }),
    );
    expect(result.observations).toBe(364);
  });
});
