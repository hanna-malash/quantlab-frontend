import type { NormalizedPerformanceDto } from "@/shared/api/normalizedPerformance";

export function buildPerformanceChartData(
  performance: NormalizedPerformanceDto,
): Array<Record<string, number | string>> {
  if (performance.series.length === 0) {
    return [];
  }

  return performance.series[0].points.map((point, index) => {
    const row: Record<string, number | string> = {
      timestamp_utc: point.timestamp_utc,
    };

    for (const series of performance.series) {
      row[series.symbol] = series.points[index]?.value ?? NaN;
    }

    return row;
  });
}
