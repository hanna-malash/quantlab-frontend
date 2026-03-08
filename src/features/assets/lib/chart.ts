export type AssetRange = "1M" | "3M" | "6M" | "1Y" | "MAX";

export const ASSET_RANGES: AssetRange[] = ["1M", "3M", "6M", "1Y", "MAX"];

export function getLimitByRange(range: AssetRange): number {
  if (range === "1M") {
    return 30;
  }

  if (range === "3M") {
    return 90;
  }

  if (range === "6M") {
    return 180;
  }

  if (range === "1Y") {
    return 365;
  }

  return 1000;
}

export function formatChartDate(value: string, range: AssetRange): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  if (range === "1M" || range === "3M") {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

export function formatTooltipDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
