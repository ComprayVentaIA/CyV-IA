import type { TagVariant } from '../../types';

interface Props {
  children: React.ReactNode;
  t?: TagVariant;
  dot?: boolean;
}

export function Tag({ children, t = 'tp', dot }: Props) {
  return (
    <span className={`tag ${t}`}>
      {dot && <span className="pulse-dot" style={{ background: 'currentColor' }} />}
      {children}
    </span>
  );
}
