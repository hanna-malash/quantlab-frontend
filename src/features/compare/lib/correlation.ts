import type { AssetDto } from "@/shared/api/assets";

export function getCommonTimeframes(
  assets: AssetDto[],
  selectedSymbols: string[],
): string[] {
  if (selectedSymbols.length === 0) {
    return [];
  }

  const selectedAssets = selectedSymbols
    .map((symbol) => assets.find((asset) => asset.symbol === symbol))
    .filter((asset): asset is AssetDto => asset !== undefined);

  if (selectedAssets.length !== selectedSymbols.length) {
    return [];
  }

  const [first, ...rest] = selectedAssets;
  return first.timeframes.filter((timeframe) =>
    rest.every((asset) => asset.timeframes.includes(timeframe)),
  );
}

export function getInitialSelectedSymbols(assets: AssetDto[]): string[] {
  for (let i = 0; i < assets.length; i += 1) {
    for (let j = i + 1; j < assets.length; j += 1) {
      const left = assets[i];
      const right = assets[j];
      const hasCommonTimeframe = left.timeframes.some((timeframe) =>
        right.timeframes.includes(timeframe),
      );
      if (hasCommonTimeframe) {
        return [left.symbol, right.symbol];
      }
    }
  }

  return assets.slice(0, 2).map((asset) => asset.symbol);
}

export function formatCorrelationValue(value: number): string {
  return value.toFixed(2);
}
