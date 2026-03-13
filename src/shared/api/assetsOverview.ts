import { requestJson } from "@/shared/api/client";

export type AssetOverviewDto = {
  symbol: string;
  name: string;
  asset_class: string;
  currency: string;
  available_timeframes: string[];
  summary_timeframe: string;
  summary_window: number;
  last_timestamp_utc: string | null;
  last_close: number | null;
  return_30: number | null;
  volatility_30: number | null;
  max_drawdown: number | null;
};

type AssetsOverviewResponse = {
  assets: AssetOverviewDto[];
};

export async function getAssetsOverview(
  signal?: AbortSignal,
): Promise<AssetOverviewDto[]> {
  const res = await requestJson<AssetsOverviewResponse>(
    "GET",
    "/api/v1/assets/overview",
    { signal },
  );
  return res.assets || [];
}
