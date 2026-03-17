import { requestJson } from "@/shared/api/client";

export type NormalizedPerformancePointDto = {
  timestamp_utc: string;
  value: number;
};

export type NormalizedPerformanceSeriesDto = {
  symbol: string;
  points: NormalizedPerformancePointDto[];
};

export type NormalizedPerformanceDto = {
  symbols: string[];
  timeframe: string;
  limit: number;
  observations: number;
  base_value: number;
  series: NormalizedPerformanceSeriesDto[];
};

export async function getNormalizedPerformance(args: {
  symbols: string[];
  timeframe: string;
  limit: number;
  baseValue?: number;
  signal?: AbortSignal;
}): Promise<NormalizedPerformanceDto> {
  const params = new URLSearchParams();
  for (const symbol of args.symbols) {
    const normalized = symbol.trim().toUpperCase();
    if (normalized !== "") {
      params.append("symbols", normalized);
    }
  }
  params.set("timeframe", args.timeframe.trim());
  params.set("limit", String(args.limit));
  params.set("base_value", String(args.baseValue ?? 100));

  return await requestJson<NormalizedPerformanceDto>(
    "GET",
    `/api/v1/analytics/normalized-performance?${params.toString()}`,
    { signal: args.signal },
  );
}
