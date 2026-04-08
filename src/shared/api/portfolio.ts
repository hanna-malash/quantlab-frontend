import { requestJson } from "@/shared/api/client";

export type PortfolioAllocationInputDto = {
  symbol: string;
  weight: number;
};

export type PortfolioAllocationDto = {
  symbol: string;
  weight: number;
};

export type PortfolioPointDto = {
  timestamp_utc: string;
  value: number;
};

export type PortfolioSummaryDto = {
  total_return: number | null;
  volatility: number | null;
  max_drawdown: number | null;
};

export type PortfolioAnalyticsDto = {
  timeframe: string;
  limit: number;
  observations: number;
  base_value: number;
  return_type: "log" | "simple";
  allocations: PortfolioAllocationDto[];
  series: PortfolioPointDto[];
  summary: PortfolioSummaryDto;
};

export async function getPortfolioAnalytics(args: {
  allocations: PortfolioAllocationInputDto[];
  timeframe: string;
  limit: number;
  baseValue?: number;
  returnType?: "log" | "simple";
  signal?: AbortSignal;
}): Promise<PortfolioAnalyticsDto> {
  return await requestJson<PortfolioAnalyticsDto>(
    "POST",
    "/api/v1/portfolio/analytics",
    {
      body: {
        allocations: args.allocations.map((allocation) => ({
          symbol: allocation.symbol.trim().toUpperCase(),
          weight: allocation.weight,
        })),
        timeframe: args.timeframe.trim(),
        limit: args.limit,
        base_value: args.baseValue ?? 100,
        return_type: args.returnType ?? "log",
      },
      signal: args.signal,
    },
  );
}
