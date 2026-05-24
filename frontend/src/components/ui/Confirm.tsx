interface Props {
  message: string;
  detail?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function Confirm({ message, detail, onConfirm, onCancel, danger }: Props) {
  return (
    <div className="overlay">
      <div className="modal modal-sm scale-in">
        <div className="modal-head">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Confirmar acción</div>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 500 }}>{message}</div>
          {detail && <div style={{ fontSize: 13, color: '#666688', lineHeight: 1.5 }}>{detail}</div>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-g" onClick={onCancel}>Cancelar</button>
          <button className={`btn ${danger ? 'btn-red' : 'btn-p'}`} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
