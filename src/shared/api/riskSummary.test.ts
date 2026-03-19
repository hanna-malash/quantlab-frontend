import { afterEach, describe, expect, it, vi } from "vitest";

import { getRiskSummary } from "@/shared/api/riskSummary";

describe("getRiskSummary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests the risk summary endpoint with explicit query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        symbol: "SPY",
        timeframe: "1d",
        limit: 365,
        return_type: "log",
        risk_free_rate: 0,
        downside_target: 0,
        observations: 364,
        mean_return: 0.001,
        volatility: 0.012,
        downside_volatility: 0.008,
        sharpe_ratio: 0.083,
        sortino_ratio: 0.125,
        max_drawdown: -0.14,
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getRiskSummary({
      symbol: "spy",
      timeframe: "1d",
      limit: 365,
      type: "log",
      riskFreeRate: 0,
      downsideTarget: 0,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/assets/SPY/risk-summary?timeframe=1d&limit=365&type=log&risk_free_rate=0&downside_target=0",
      expect.objectContaining({
        method: "GET",
      }),
    );
    expect(result.sharpe_ratio).toBe(0.083);
  });
});
