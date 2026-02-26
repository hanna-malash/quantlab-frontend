import { requestJson } from "@/shared/api/client";

export type PricePoint = {
  timestamp_utc: string;
  close: number;
};

export type PricesResponse = {
  symbol: string;
  points: PricePoint[];
};

export async function getPrices(args: {
  symbol: string;
  timeframe: string;
  limit: number;
}): Promise<PricesResponse> {
  const normalizedSymbol = args.symbol.trim().toUpperCase();
  const encodedSymbol = encodeURIComponent(normalizedSymbol);
  const encodedTimeframe = encodeURIComponent(args.timeframe.trim());

  return await requestJson<PricesResponse>(
    "GET",
    `/api/v1/assets/${encodedSymbol}/prices?timeframe=${encodedTimeframe}&limit=${args.limit}`,
  );
}
