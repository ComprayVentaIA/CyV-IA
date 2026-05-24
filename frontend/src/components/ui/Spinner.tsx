interface Props { size?: number; color?: string }

export function Spinner({ size = 16, color }: Props) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size, ...(color ? { borderTopColor: color } : {}) }}
    />
  );
}
