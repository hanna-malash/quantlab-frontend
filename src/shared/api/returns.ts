import { requestJson } from "@/shared/api/client";

export type ReturnType = "log" | "simple";

export type SeriesPoint = {
  timestamp_utc: string;
  value: number;
};

export type SeriesResponse = {
  symbol: string;
  points: SeriesPoint[];
};

export async function getReturns(args: {
  symbol: string;
  timeframe: string;
  limit: number;
  type?: ReturnType;
  signal?: AbortSignal;
}): Promise<SeriesResponse> {
  const normalizedSymbol = args.symbol.trim().toUpperCase();
  const encodedSymbol = encodeURIComponent(normalizedSymbol);
  const encodedTimeframe = encodeURIComponent(args.timeframe.trim());
  const encodedType = encodeURIComponent(args.type ?? "log");

  return await requestJson<SeriesResponse>(
    "GET",
    `/api/v1/assets/${encodedSymbol}/returns?timeframe=${encodedTimeframe}&type=${encodedType}&limit=${args.limit}`,
    { signal: args.signal },
  );
}
