interface Props {
  checked: boolean;
  onChange: () => void;
}

export function Toggle({ checked, onChange }: Props) {
  return <button className={`tog${checked ? ' on' : ''}`} onClick={onChange} type="button" />;
}
