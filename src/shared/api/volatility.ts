import { requestJson } from "@/shared/api/client";

import type { SeriesPoint, SeriesResponse } from "@/shared/api/returns";

export type VolatilityPoint = SeriesPoint;

export type VolatilityResponse = SeriesResponse;

export async function getVolatility(args: {
  symbol: string;
  timeframe: string;
  window?: number;
  limit: number;
  signal?: AbortSignal;
}): Promise<VolatilityResponse> {
  const normalizedSymbol = args.symbol.trim().toUpperCase();
  const encodedSymbol = encodeURIComponent(normalizedSymbol);
  const encodedTimeframe = encodeURIComponent(args.timeframe.trim());
  const window = args.window ?? 24;

  return await requestJson<VolatilityResponse>(
    "GET",
    `/api/v1/assets/${encodedSymbol}/volatility?timeframe=${encodedTimeframe}&window=${window}&limit=${args.limit}`,
    { signal: args.signal },
  );
}
