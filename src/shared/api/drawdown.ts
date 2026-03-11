import { requestJson } from "@/shared/api/client";

export type DrawdownPoint = {
  timestamp_utc: string;
  value: number;
  peak_close: number;
};

export type DrawdownResponse = {
  symbol: string;
  points: DrawdownPoint[];
};

export async function getDrawdown(args: {
  symbol: string;
  timeframe: string;
  limit: number;
  signal?: AbortSignal;
}): Promise<DrawdownResponse> {
  const normalizedSymbol = args.symbol.trim().toUpperCase();
  const encodedSymbol = encodeURIComponent(normalizedSymbol);
  const encodedTimeframe = encodeURIComponent(args.timeframe.trim());

  return await requestJson<DrawdownResponse>(
    "GET",
    `/api/v1/assets/${encodedSymbol}/drawdown?timeframe=${encodedTimeframe}&limit=${args.limit}`,
    { signal: args.signal },
  );
}
