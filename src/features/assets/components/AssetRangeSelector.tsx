import { ASSET_RANGES, type AssetRange } from "@/features/assets/lib/chart";

type AssetRangeSelectorProps = {
  value: AssetRange;
  onChange: (range: AssetRange) => void;
};

export function AssetRangeSelector(props: AssetRangeSelectorProps) {
  const { value, onChange } = props;

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ marginBottom: "8px", fontWeight: 600 }}>Range</div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {ASSET_RANGES.map((range) => {
          const isActive = range === value;

          return (
            <button
              key={range}
              type="button"
              onClick={() => {
                onChange(range);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid",
                cursor: "pointer",
                fontWeight: isActive ? 700 : 500,
                opacity: isActive ? 1 : 0.8,
              }}
            >
              {range === "MAX" ? "MAX (5K)" : range}
            </button>
          );
        })}
      </div>
    </div>
  );
}
