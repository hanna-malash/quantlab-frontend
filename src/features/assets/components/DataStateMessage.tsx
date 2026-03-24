type DataStateMessageProps = {
  title: string;
  detail?: string;
};

export function DataStateMessage(props: DataStateMessageProps) {
  const { title, detail } = props;

  return (
    <div>
      <div>{title}</div>
      {detail && <div>{detail}</div>}
    </div>
  );
}
