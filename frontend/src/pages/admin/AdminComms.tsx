import { useState } from 'react';
import { Spinner } from '../../components/ui';
import { C } from '../../styles/theme';

const SENT_HISTORY = [
  { id: 'c1', title: 'Nuevas funciones de IA disponibles', message: 'Hemos lanzado la generación de reels automáticos con avatares IA. Pruébalo ahora.', target: 'all', sent: '20/05/2026 14:30', recipients: 7 },
  { id: 'c2', title: 'Mantenimiento programado', message: 'El domingo 18/05 de 3:00 a 5:00 AM habrá mantenimiento. El servicio estará temporalmente no disponible.', target: 'all', sent: '15/05/2026 09:00', recipients: 7 },
];

export default function AdminComms() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState(SENT_HISTORY);

  const send = async () => {
    if (!title || !message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setHistory(p => [{ id: `c${Date.now()}`, title, message, target, sent: new Date().toLocaleString('es-AR'), recipients: 7 }, ...p]);
    setLoading(false); setSent(true);
    setTimeout(() => { setSent(false); setTitle(''); setMessage(''); }, 2000);
  };

  return (
    <div className="page fa">
      <div className="sec-head" style={{ marginBottom: 20 }}>
        <div>
          <div className="sec-title">Comunicaciones</div>
          <div className="sec-sub">Enviar anuncios y notificaciones a los usuarios</div>
        </div>
      </div>

      <div className="g2" style={{ gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 16 }}>Nuevo anuncio</div>
            {sent && <div className="ok-box" style={{ marginBottom: 14 }}>✅ Anuncio enviado correctamente</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div className="fg"><label className="flbl">Título</label><input className="finput" placeholder="ej. Nuevas funciones disponibles" value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div className="fg"><label className="flbl">Mensaje</label><textarea className="ftxt" style={{ minHeight: 100 }} placeholder="Escribí el contenido del anuncio..." value={message} onChange={e => setMessage(e.target.value)} /></div>
              <div className="fg">
                <label className="flbl">Destinatarios</label>
                <select className="fsel" value={target} onChange={e => setTarget(e.target.value)}>
                  <option value="all">Todos los usuarios</option>
                  <option value="starter">Plan Starter</option>
                  <option value="growth">Plan Growth</option>
                  <option value="scale">Plan Scale</option>
                  <option value="active">Solo activos</option>
                </select>
              </div>
              <button className="btn btn-p" onClick={send} disabled={loading || !title || !message} style={{ alignSelf: 'flex-start' }}>
                {loading ? <><Spinner color="#fff" /> Enviando...</> : '📢 Enviar anuncio'}
              </button>
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 9, fontSize: 12, color: C.accent, lineHeight: 1.5 }}>
            💡 Los anuncios se muestran como notificaciones dentro de la plataforma y se envían por email si el usuario tiene las notificaciones activadas.
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 14 }}>Historial de envíos</div>
          {history.map(h => (
            <div key={h.id} style={{ padding: '11px 0', borderBottom: `1px solid ${C.border}22` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{h.title}</div>
                <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'DM Mono',monospace" }}>{h.sent}</div>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 7, lineHeight: 1.4 }}>{h.message}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>
                Enviado a: <strong>{h.target === 'all' ? 'Todos' : `Plan ${h.target}`}</strong> · {h.recipients} destinatarios
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
