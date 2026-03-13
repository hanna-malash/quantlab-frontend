import { afterEach, describe, expect, it, vi } from "vitest";

import { getAssetsOverview } from "@/shared/api/assetsOverview";

describe("getAssetsOverview", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests the backend overview endpoint and returns typed assets", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        assets: [
          {
            symbol: "SPY",
            name: "SPY",
            asset_class: "unknown",
            currency: "unknown",
            available_timeframes: ["1d"],
            summary_timeframe: "1d",
            summary_window: 30,
            last_timestamp_utc: "2026-03-01T00:00:00+00:00",
            last_close: 612.4,
            return_30: 0.052,
            volatility_30: 0.013,
            max_drawdown: -0.084,
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getAssetsOverview();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/assets/overview",
      expect.objectContaining({
        method: "GET",
      }),
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.symbol).toBe("SPY");
    expect(result[0]?.summary_timeframe).toBe("1d");
  });
});
