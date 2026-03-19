import { formatPercent } from "@/features/assets/lib/chart";

export function formatNullablePercentMetric(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return formatPercent(value);
}

export function formatNullableRatioMetric(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value);
}

export function formatRiskWindowLabel(
  observations: number,
  timeframe: string,
): string {
  return `${observations} return observations on ${timeframe}`;
}
