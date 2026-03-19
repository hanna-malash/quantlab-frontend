import { requestJson } from "@/shared/api/client";

export type RiskSummaryDto = {
  symbol: string;
  timeframe: string;
  limit: number;
  return_type: "log" | "simple";
  risk_free_rate: number;
  downside_target: number;
  observations: number;
  mean_return: number | null;
  volatility: number | null;
  downside_volatility: number | null;
  sharpe_ratio: number | null;
  sortino_ratio: number | null;
  max_drawdown: number | null;
};

export async function getRiskSummary(args: {
  symbol: string;
  timeframe: string;
  limit: number;
  type?: "log" | "simple";
  riskFreeRate?: number;
  downsideTarget?: number;
  signal?: AbortSignal;
}): Promise<RiskSummaryDto> {
  const normalizedSymbol = args.symbol.trim().toUpperCase();
  const encodedSymbol = encodeURIComponent(normalizedSymbol);

  const params = new URLSearchParams();
  params.set("timeframe", args.timeframe.trim());
  params.set("limit", String(args.limit));
  params.set("type", args.type ?? "log");
  params.set("risk_free_rate", String(args.riskFreeRate ?? 0));
  params.set("downside_target", String(args.downsideTarget ?? 0));

  return await requestJson<RiskSummaryDto>(
    "GET",
    `/api/v1/assets/${encodedSymbol}/risk-summary?${params.toString()}`,
    { signal: args.signal },
  );
}
