import { useEffect, useMemo, useState } from "react";

import { NormalizedPerformanceChart } from "@/features/compare/components/NormalizedPerformanceChart";
import {
  formatCorrelationValue,
  getCommonTimeframes,
  getInitialSelectedSymbols,
} from "@/features/compare/lib/correlation";
import { getAssets, type AssetDto } from "@/shared/api/assets";
import {
  getCorrelation,
  type CorrelationMatrixDto,
} from "@/shared/api/correlation";
import {
  getNormalizedPerformance,
  type NormalizedPerformanceDto,
} from "@/shared/api/normalizedPerformance";

type UiState = "idle" | "loading" | "success" | "error";

const DEFAULT_LIMIT = 365;

const sectionStyle = {
  border: "1px solid #d4d4d8",
  borderRadius: "12px",
  padding: "16px",
  marginTop: "24px",
};

export default function ComparePage() {
  const [assetsState, setAssetsState] = useState<UiState>("idle");
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [assetsError, setAssetsError] = useState<string>("");

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<string>("");

  const [matrixState, setMatrixState] = useState<UiState>("idle");
  const [matrix, setMatrix] = useState<CorrelationMatrixDto | null>(null);
  const [matrixError, setMatrixError] = useState<string>("");
  const [performanceState, setPerformanceState] = useState<UiState>("idle");
  const [performance, setPerformance] =
    useState<NormalizedPerformanceDto | null>(null);
  const [performanceError, setPerformanceError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets(): Promise<void> {
      setAssetsState("loading");
      setAssetsError("");

      try {
        const data = await getAssets(controller.signal);
        setAssets(data);

        const initialSymbols = getInitialSelectedSymbols(data);
        setSelectedSymbols(initialSymbols);
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
  const canLoadMatrix =
    selectedSymbols.length >= 2 && effectiveTimeframe !== "";

  useEffect(() => {
    if (!canLoadMatrix) {
      return;
    }

    const controller = new AbortController();

    async function loadCorrelation(): Promise<void> {
      setMatrixState("loading");
      setMatrixError("");

      try {
        const result = await getCorrelation({
          symbols: selectedSymbols,
          timeframe: effectiveTimeframe,
          limit: DEFAULT_LIMIT,
          signal: controller.signal,
        });
        setMatrix(result);
        setMatrixState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setMatrixError(message);
        setMatrixState("error");
      }
    }

    loadCorrelation();

    return () => {
      controller.abort();
    };
  }, [canLoadMatrix, effectiveTimeframe, selectedSymbols]);

  useEffect(() => {
    if (!canLoadMatrix) {
      return;
    }

    const controller = new AbortController();

    async function loadPerformance(): Promise<void> {
      setPerformanceState("loading");
      setPerformanceError("");

      try {
        const result = await getNormalizedPerformance({
          symbols: selectedSymbols,
          timeframe: effectiveTimeframe,
          limit: DEFAULT_LIMIT,
          baseValue: 100,
          signal: controller.signal,
        });
        setPerformance(result);
        setPerformanceState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setPerformanceError(message);
        setPerformanceState("error");
      }
    }

    loadPerformance();

    return () => {
      controller.abort();
    };
  }, [canLoadMatrix, effectiveTimeframe, selectedSymbols]);

  return (
    <div>
      <h2>Compare</h2>
      <p style={{ marginTop: "0", marginBottom: "16px", opacity: 0.8 }}>
        Compare multiple assets and inspect their correlation matrix on a shared
        timeframe.
      </p>

      {assetsState === "loading" && <div>Loading assets...</div>}

      {assetsState === "error" && (
        <div>
          <div>Failed to load assets for compare.</div>
          <div>{assetsError}</div>
        </div>
      )}

      {assetsState === "success" && assets.length > 0 && (
        <>
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
                        setSelectedSymbols((current) => {
                          if (checked) {
                            return current.filter(
                              (symbol) => symbol !== asset.symbol,
                            );
                          }

                          return [...current, asset.symbol];
                        });
                      }}
                      style={{ marginRight: "6px" }}
                    />
                    {asset.symbol}
                  </label>
                );
              })}
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
        </>
      )}

      {assetsState === "success" && assets.length === 0 && (
        <div>No assets found.</div>
      )}

      {assetsState === "success" && selectedSymbols.length < 2 && (
        <div>Select at least two assets to compute correlation.</div>
      )}

      {assetsState === "success" &&
        selectedSymbols.length >= 2 &&
        commonTimeframes.length === 0 && (
          <div>No shared timeframe is available for the selected assets.</div>
        )}

      {canLoadMatrix && matrixState === "loading" && (
        <div>Loading correlation matrix...</div>
      )}

      {canLoadMatrix && matrixState === "error" && (
        <div>
          <div>Failed to load correlation.</div>
          <div>{matrixError}</div>
        </div>
      )}

      {canLoadMatrix && matrixState === "success" && matrix && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: "0", marginBottom: "8px" }}>Correlation</h3>
          <p style={{ marginTop: "0", marginBottom: "12px", opacity: 0.78 }}>
            Shows how strongly the selected assets move together on the shared
            timeframe.
          </p>
          <div style={{ marginBottom: "10px", opacity: 0.8 }}>
            Observations: {matrix.observations}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: "420px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #d4d4d8",
                    }}
                  >
                    Symbol
                  </th>
                  {matrix.symbols.map((symbol) => (
                    <th
                      key={symbol}
                      style={{
                        textAlign: "right",
                        padding: "10px",
                        borderBottom: "1px solid #d4d4d8",
                      }}
                    >
                      {symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((row) => (
                  <tr key={row.symbol}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e4e4e7",
                        fontWeight: 600,
                      }}
                    >
                      {row.symbol}
                    </td>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.symbol}-${matrix.symbols[index]}`}
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #e4e4e7",
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatCorrelationValue(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={sectionStyle}>
        <h3 style={{ marginTop: "0", marginBottom: "8px" }}>
          Normalized performance
        </h3>
        <p style={{ marginTop: "0", marginBottom: "12px", opacity: 0.78 }}>
          Rebases every selected asset to the same starting value so relative
          performance is easier to compare over time.
        </p>

        {canLoadMatrix && performanceState === "loading" && (
          <div>Loading normalized performance...</div>
        )}

        {canLoadMatrix && performanceState === "error" && (
          <div>
            <div>Failed to load normalized performance.</div>
            <div>{performanceError}</div>
          </div>
        )}

        {canLoadMatrix &&
          performanceState === "success" &&
          performance &&
          performance.series.length > 0 && (
            <>
              <div style={{ marginBottom: "10px", opacity: 0.8 }}>
                Base value: {performance.base_value}
              </div>
              <NormalizedPerformanceChart performance={performance} />
            </>
          )}
      </div>
    </div>
  );
}
