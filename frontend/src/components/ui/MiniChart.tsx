interface Props { data: number[]; color?: string }

export function MiniChart({ data, color = '#7c5cfc' }: Props) {
  const max = Math.max(...data);
  return (
    <div className="mini-bars">
      {data.map((v, i) => (
        <div
          key={i}
          className="mini-bar"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? color : `${color}40`,
          }}
        />
      ))}
    </div>
  );
}
