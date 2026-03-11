export type AssetRange = "1M" | "3M" | "6M" | "1Y" | "MAX";

export const ASSET_RANGES: AssetRange[] = ["1M", "3M", "6M", "1Y", "MAX"];

const UTC_TIME_ZONE = "UTC";
const MAX_RANGE_LIMIT = 5000;

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

  return MAX_RANGE_LIMIT;
}

function isIntradayTimeframe(timeframe: string): boolean {
  const normalizedTimeframe = timeframe.trim().toLowerCase();
  return normalizedTimeframe.endsWith("m") || normalizedTimeframe.endsWith("h");
}

export function formatChartDate(
  value: string,
  range: AssetRange,
  timeframe: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const intraday = isIntradayTimeframe(timeframe);

  if (range === "1M" || range === "3M") {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      ...(intraday ? { hour: "2-digit" as const } : {}),
      timeZone: UTC_TIME_ZONE,
    }).format(date);
  }

  if (intraday && (range === "6M" || range === "1Y")) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: UTC_TIME_ZONE,
    }).format(date);
  }

  if (range === "MAX") {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      timeZone: UTC_TIME_ZONE,
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: UTC_TIME_ZONE,
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
    timeZone: UTC_TIME_ZONE,
  }).format(date);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value);
}

export function getVolatilityWindow(timeframe: string): number {
  const normalizedTimeframe = timeframe.trim().toLowerCase();

  if (normalizedTimeframe.endsWith("d")) {
    return 30;
  }

  return 24;
}
