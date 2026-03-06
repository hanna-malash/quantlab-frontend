import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAssets, type AssetDto } from "@/shared/api/assets";

type UiState = "idle" | "loading" | "success" | "error";

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
        setAssets(data);
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
        <ul style={{ display: "grid", gap: "12px", paddingLeft: "20px" }}>
          {assets.map((asset) => (
            <li key={asset.symbol}>
              <Link to={`/assets/${asset.symbol}`}>{asset.symbol}</Link>
              {" � "}
              {asset.name}
              {" � "}
              {asset.timeframes.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
