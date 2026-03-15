import { requestJson } from "@/shared/api/client";

export type CorrelationRowDto = {
  symbol: string;
  values: number[];
};

export type CorrelationMatrixDto = {
  symbols: string[];
  timeframe: string;
  limit: number;
  observations: number;
  rows: CorrelationRowDto[];
};

export async function getCorrelation(args: {
  symbols: string[];
  timeframe: string;
  limit: number;
  signal?: AbortSignal;
}): Promise<CorrelationMatrixDto> {
  const params = new URLSearchParams();
  for (const symbol of args.symbols) {
    const normalized = symbol.trim().toUpperCase();
    if (normalized !== "") {
      params.append("symbols", normalized);
    }
  }
  params.set("timeframe", args.timeframe.trim());
  params.set("limit", String(args.limit));

  return await requestJson<CorrelationMatrixDto>(
    "GET",
    `/api/v1/analytics/correlation?${params.toString()}`,
    { signal: args.signal },
  );
}
