import type { AssetDto } from "@/shared/api/assets";
import type { PortfolioAllocationInputDto } from "@/shared/api/portfolio";

export function buildEqualWeightMap(symbols: string[]): Record<string, string> {
  if (symbols.length === 0) {
    return {};
  }

  const evenWeight = 100 / symbols.length;
  let runningTotal = 0;

  return Object.fromEntries(
    symbols.map((symbol, index) => {
      const weight =
        index === symbols.length - 1 ? 100 - runningTotal : evenWeight;
      runningTotal += index === symbols.length - 1 ? 0 : weight;
      return [symbol, weight.toFixed(2)];
    }),
  );
}

export function getPortfolioAllocations(
  selectedSymbols: string[],
  weightBySymbol: Record<string, string>,
): PortfolioAllocationInputDto[] {
  return selectedSymbols
    .map((symbol) => ({
      symbol,
      weight: Number(weightBySymbol[symbol] ?? ""),
    }))
    .filter(
      (allocation) =>
        Number.isFinite(allocation.weight) && allocation.weight > 0,
    );
}

export function getPortfolioWeightTotal(
  selectedSymbols: string[],
  weightBySymbol: Record<string, string>,
): number {
  return getPortfolioAllocations(selectedSymbols, weightBySymbol).reduce(
    (total, allocation) => total + allocation.weight,
    0,
  );
}

export function getInitialPortfolioSymbols(assets: AssetDto[]): string[] {
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
