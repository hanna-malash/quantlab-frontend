import { afterEach, describe, expect, it, vi } from "vitest";

import { getDrawdown } from "@/shared/api/drawdown";

describe("getDrawdown", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests the drawdown series for the selected asset and timeframe", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        symbol: "BTCUSDT",
        points: [
          {
            timestamp_utc: "2026-03-01T00:00:00+00:00",
            value: -0.12,
            peak_close: 65000,
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getDrawdown({
      symbol: "btcusdt",
      timeframe: "1d",
      limit: 365,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/assets/BTCUSDT/drawdown?timeframe=1d&limit=365",
      expect.objectContaining({
        method: "GET",
      }),
    );
    expect(result.symbol).toBe("BTCUSDT");
    expect(result.points[0]?.peak_close).toBe(65000);
  });
});
