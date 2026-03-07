import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import { getAssets, type AssetDto } from "@/shared/api/assets";

type UiState = "idle" | "loading" | "success" | "error";

const linkStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "underline",
  fontWeight: 600,
};

const cardStyle: CSSProperties = {
  border: "1px solid #d4d4d8",
  borderRadius: "10px",
  padding: "12px 14px",
};

export default function AssetsPage() {
  const [state, setState] = useState<UiState>("idle");
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [errorText, setErrorText] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets(): Promise<void> {
      setState("loading");
      setErrorText("");

      try {
        const data = await getAssets(controller.signal);
        const sorted = [...data].sort((a, b) =>
          a.symbol.localeCompare(b.symbol),
        );
        setAssets(sorted);
        setState("success");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorText(message);
        setState("error");
      }
    }

    loadAssets();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h2>Assets</h2>

      {state === "loading" && <div>Loading assets...</div>}

      {state === "error" && (
        <div>
          <div>Failed to load assets.</div>
          <div>{errorText}</div>
        </div>
      )}

      {state === "success" && assets.length === 0 && (
        <div>No assets found.</div>
      )}

      {state === "success" && assets.length > 0 && (
        <div style={{ display: "grid", gap: "12px" }}>
          {assets.map((asset) => (
            <div key={asset.symbol} style={cardStyle}>
              <div style={{ marginBottom: "6px" }}>
                <Link to={`/assets/${asset.symbol}`} style={linkStyle}>
                  {asset.symbol}
                </Link>
              </div>

              {asset.name !== asset.symbol && (
                <div style={{ fontSize: "14px", opacity: 0.8 }}>
                  Name: {asset.name}
                </div>
              )}

              <div style={{ fontSize: "14px", opacity: 0.8 }}>
                Timeframes: {asset.timeframes.join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
