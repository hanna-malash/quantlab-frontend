import type { AssetDto } from "@/shared/api/assets";

type AssetMetaProps = {
  asset: AssetDto;
  timeframe: string;
};

export function AssetMeta(props: AssetMetaProps) {
  const { asset, timeframe } = props;

  return (
    <div style={{ marginBottom: "16px", opacity: 0.8 }}>
      <div>Class: {asset.asset_class}</div>
      <div>Currency: {asset.currency}</div>
      <div>Timeframe: {timeframe}</div>
    </div>
  );
}
