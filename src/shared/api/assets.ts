import { requestJson } from "@/shared/api/client";

export type AssetDto = {
  symbol: string;
  name: string;
  asset_class: string;
  currency: string;
  timeframes: string[];
};

type AssetsResponse = {
  assets: AssetDto[];
};

export async function getAssets(signal?: AbortSignal): Promise<AssetDto[]> {
  const res = await requestJson<AssetsResponse>("GET", "/api/v1/assets", {
    signal,
  });
  return res.assets || [];
}
