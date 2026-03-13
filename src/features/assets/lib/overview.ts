import { formatPercent, formatPrice } from "@/features/assets/lib/chart";
import type { AssetOverviewDto } from "@/shared/api/assetsOverview";

export function sortAssetsOverview(
  assets: AssetOverviewDto[],
): AssetOverviewDto[] {
  return [...assets].sort((left, right) =>
    left.symbol.localeCompare(right.symbol),
  );
}

export function formatNullablePrice(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return formatPrice(value);
}

export function formatNullablePercent(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return formatPercent(value);
}

export function formatSummaryWindowLabel(
  summaryWindow: number,
  timeframe: string,
): string {
  return `${summaryWindow} periods on ${timeframe}`;
}
