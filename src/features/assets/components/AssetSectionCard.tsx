import type { CSSProperties, ReactNode } from "react";

type AssetSectionCardProps = {
  title: string;
  children: ReactNode;
};

const sectionStyle: CSSProperties = {
  marginTop: "24px",
  border: "1px solid #d4d4d8",
  borderRadius: "12px",
  padding: "16px",
};

const titleStyle: CSSProperties = {
  marginBottom: "12px",
  marginTop: "0",
};

export function AssetSectionCard(props: AssetSectionCardProps) {
  const { title, children } = props;

  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>{title}</h3>
      {children}
    </section>
  );
}
