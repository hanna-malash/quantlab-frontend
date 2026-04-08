import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { PortfolioPerformanceChart } from "@/features/portfolio/components/PortfolioPerformanceChart";
import { PortfolioSummary } from "@/features/portfolio/components/PortfolioSummary";
import {
  buildEqualWeightMap,
  getInitialPortfolioSymbols,
  getPortfolioAllocations,
  getPortfolioWeightTotal,
} from "@/features/portfolio/lib/portfolio";
import { getCommonTimeframes } from "@/features/compare/lib/correlation";
import { getAssets, type AssetDto } from "@/shared/api/assets";
import {
  getPortfolioAnalytics,
  type PortfolioAnalyticsDto,
} from "@/shared/api/portfolio";

type UiState = "idle" | "loading" | "success" | "error";

const DEFAULT_LIMIT = 365;

const sectionStyle = {
  border: "1px solid #d4d4d8",
  borderRadius: "12px",
  padding: "16px",
  marginTop: "24px",
};

export default function PortfolioPage() {
  const [assetsState, setAssetsState] = useState<UiState>("idle");
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [assetsError, setAssetsError] = useState<string>("");

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [weightBySymbol, setWeightBySymbol] = useState<Record<string, string>>(
    {},
  );
  const [timeframe, setTimeframe] = useState<string>("");

  const [portfolioState, setPortfolioState] = useState<UiState>("idle");
  const [portfolio, setPortfolio] = useState<PortfolioAnalyticsDto | null>(
    null,
  );
  const [portfolioError, setPortfolioError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets(): Promise<void> {
      setAssetsState("loading");
      setAssetsError("");

      try {
        const data = await getAssets(controller.signal);
        setAssets(data);

        const initialSymbols = getInitialPortfolioSymbols(data);
        setSelectedSymbols(initialSymbols);
        setWeightBySymbol(buildEqualWeightMap(initialSymbols));
        const commonTimeframes = getCommonTimeframes(data, initialSymbols);
        setTimeframe(commonTimeframes[0] ?? "");

        setAssetsState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setAssetsError(message);
        setAssetsState("error");
      }
    }

    loadAssets();

    return () => {
      controller.abort();
    };
  }, []);

  const commonTimeframes = useMemo(() => {
    return getCommonTimeframes(assets, selectedSymbols);
  }, [assets, selectedSymbols]);

  const effectiveTimeframe =
    timeframe !== "" && commonTimeframes.includes(timeframe)
      ? timeframe
      : (commonTimeframes[0] ?? "");
  const allocations = useMemo(() => {
    return getPortfolioAllocations(selectedSymbols, weightBySymbol);
  }, [selectedSymbols, weightBySymbol]);
  const totalWeight = useMemo(() => {
    return getPortfolioWeightTotal(selectedSymbols, weightBySymbol);
  }, [selectedSymbols, weightBySymbol]);
  const canAnalyze =
    selectedSymbols.length >= 2 &&
    effectiveTimeframe !== "" &&
    allocations.length >= 2;

  async function handleAnalyze(): Promise<void> {
    if (!canAnalyze) {
      return;
    }

    setPortfolioState("loading");
    setPortfolioError("");

    try {
      const result = await getPortfolioAnalytics({
        allocations,
        timeframe: effectiveTimeframe,
        limit: DEFAULT_LIMIT,
        baseValue: 100,
        returnType: "log",
      });
      setPortfolio(result);
      setPortfolioState("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setPortfolioError(message);
      setPortfolioState("error");
    }
  }

  return (
    <div>
      <h2>Portfolio</h2>
      <p style={{ marginTop: "0", marginBottom: "16px", opacity: 0.8 }}>
        Build a weighted portfolio from the tracked assets and inspect its
        performance and core risk metrics.
      </p>

      {assetsState === "loading" && <div>Loading assets...</div>}

      {assetsState === "error" && (
        <div>
          <div>Failed to load assets for portfolio analysis.</div>
          <div>{assetsError}</div>
        </div>
      )}

      {assetsState === "success" && assets.length > 0 && (
        <div style={sectionStyle}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ marginBottom: "8px", fontWeight: 600 }}>
              Select assets
            </div>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px" }}
            >
              {assets.map((asset) => {
                const checked = selectedSymbols.includes(asset.symbol);

                return (
                  <label key={asset.symbol} style={{ fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const nextSymbols = checked
                          ? selectedSymbols.filter(
                              (symbol) => symbol !== asset.symbol,
                            )
                          : [...selectedSymbols, asset.symbol];

                        setSelectedSymbols(nextSymbols);
                        setWeightBySymbol(buildEqualWeightMap(nextSymbols));
                      }}
                      style={{ marginRight: "6px" }}
                    />
                    {asset.symbol}
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ marginBottom: "8px", fontWeight: 600 }}>Weights</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
              }}
            >
              {selectedSymbols.map((symbol) => (
                <label key={symbol} style={{ fontSize: "14px" }}>
                  <div style={{ marginBottom: "6px" }}>{symbol}</div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={weightBySymbol[symbol] ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setWeightBySymbol((current) => ({
                        ...current,
                        [symbol]: value,
                      }));
                    }}
                    style={{ width: "100%", padding: "8px 10px" }}
                  />
                </label>
              ))}
            </div>
            <div style={{ marginTop: "10px", opacity: 0.78, fontSize: "13px" }}>
              Current weight total: {totalWeight.toFixed(2)}. Backend normalizes
              positive weights automatically.
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "8px", fontWeight: 600 }}>
              Shared timeframe
            </div>
            <select
              value={timeframe}
              onChange={(event) => setTimeframe(event.target.value)}
              disabled={commonTimeframes.length === 0}
              style={{ padding: "6px 8px", minWidth: "140px" }}
            >
              {commonTimeframes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={() => void handleAnalyze()} disabled={!canAnalyze}>
            Analyze portfolio
          </Button>
        </div>
      )}

      {assetsState === "success" && assets.length === 0 && (
        <div>No assets found.</div>
      )}

      {assetsState === "success" && selectedSymbols.length < 2 && (
        <div>Select at least two assets to analyze a portfolio.</div>
      )}

      {assetsState === "success" &&
        selectedSymbols.length >= 2 &&
        commonTimeframes.length === 0 && (
          <div>
            <div>No shared timeframe is available for the selected assets.</div>
            <div style={{ marginTop: "6px", opacity: 0.8 }}>
              Try removing assets that do not overlap with the rest of the
              portfolio set.
            </div>
          </div>
        )}

      {portfolioState === "loading" && (
        <div>Loading portfolio analytics...</div>
      )}

      {portfolioState === "error" && (
        <div>
          <div>Failed to load portfolio analytics.</div>
          <div>{portfolioError}</div>
        </div>
      )}

      {portfolioState === "success" && portfolio && (
        <>
          <div style={sectionStyle}>
            <h3 style={{ marginTop: "0", marginBottom: "8px" }}>
              Portfolio summary
            </h3>
            <PortfolioSummary portfolio={portfolio} />
          </div>

          <div style={sectionStyle}>
            <h3 style={{ marginTop: "0", marginBottom: "8px" }}>
              Portfolio performance
            </h3>
            <p style={{ marginTop: "0", marginBottom: "12px", opacity: 0.78 }}>
              Weighted portfolio series rebased to a common starting value for
              easier comparison over time.
            </p>
            <PortfolioPerformanceChart portfolio={portfolio} />
          </div>
        </>
      )}
    </div>
  );
}
