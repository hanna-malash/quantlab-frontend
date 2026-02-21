import { requestJson } from "@/shared/api/client";

export type PricePoint = {
  date: string;
  close: number;
};

export type PricesResponse = {
  symbol: string;
  points: PricePoint[];
};

export async function getPrices(symbol: string): Promise<PricesResponse> {
  const encoded = encodeURIComponent(symbol);
  return await requestJson<PricesResponse>(
    "GET",
    `/api/prices?symbol=${encoded}`,
  );
}
