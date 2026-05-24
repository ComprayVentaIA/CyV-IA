import { useState } from 'react';
import { Tag, Spinner } from '../../components/ui';
import { C } from '../../styles/theme';

type IntegId = 'meta' | 'whatsapp' | 'stripe' | 'instagram';

interface IntegState {
  saved: Record<IntegId, boolean>;
  loading: Record<IntegId, boolean>;
  success: Record<IntegId, string>;
  error: Record<IntegId, string>;
}

const INIT_FORMS = {
  meta: { accessToken: '', adAccountId: '', pixelId: '', pageId: '', businessId: '' },
  whatsapp: { phoneNumberId: '', accessToken: '', businessAccountId: '' },
  stripe: { secretKey: '', webhookSecret: '' },
  instagram: { accountId: '' },
};

export default function Integrations() {
  const [forms, setForms] = useState(INIT_FORMS);
  const [state, setState] = useState<IntegState>({
    saved: { meta: false, whatsapp: false, stripe: false, instagram: false },
    loading: { meta: false, whatsapp: false, stripe: false, instagram: false },
    success: { meta: '', whatsapp: '', stripe: '', instagram: '' },
    error: { meta: '', whatsapp: '', stripe: '', instagram: '' },
  });

  const setF = (id: IntegId, k: string, v: string) => {
    setForms(p => ({ ...p, [id]: { ...p[id], [k]: v } }));
    setState(p => ({ ...p, error: { ...p.error, [id]: '' }, success: { ...p.success, [id]: '' } }));
  };

  const connect = async (id: IntegId) => {
    const f = forms[id] as Record<string, string>;
    if (id === 'meta' && (!f.accessToken || !f.adAccountId)) {
      setState(p => ({ ...p, error: { ...p.error, [id]: 'Access Token y Ad Account ID son requeridos' } })); return;
    }
    if (id === 'whatsapp' && (!f.phoneNumberId || !f.accessToken)) {
      setState(p => ({ ...p, error: { ...p.error, [id]: 'Phone Number ID y Access Token son requeridos' } })); return;
    }
    if (id === 'stripe' && !f.secretKey) {
      setState(p => ({ ...p, error: { ...p.error, [id]: 'Secret Key es requerido' } })); return;
    }
    setState(p => ({ ...p, loading: { ...p.loading, [id]: true } }));
    await new Promise(r => setTimeout(r, 1600));
    setState(p => ({ ...p, loading: { ...p.loading, [id]: false }, saved: { ...p.saved, [id]: true }, success: { ...p.success, [id]: 'Integración conectada correctamente ✓' } }));
  };

  const disconnect = (id: IntegId) => {
    setState(p => ({ ...p, saved: { ...p.saved, [id]: false }, success: { ...p.success, [id]: '' } }));
    setForms(p => ({ ...p, [id]: Object.fromEntries(Object.keys(p[id]).map(k => [k, ''])) as typeof p[typeof id] }));
  };

  const IntegCard = ({ id, icon, title, required, hint, children }: { id: IntegId; icon: string; title: string; required?: boolean; hint?: string; children: React.ReactNode }) => (
    <div className="card fade-in" style={{ marginBottom: 14, border: state.saved[id] ? `1.5px solid ${C.green}44` : `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14 }}>{title}</span>
            {required && <Tag t="tr">Requerido</Tag>}
            {state.saved[id] && <Tag t="tg">✓ Conectado</Tag>}
          </div>
          {hint && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{hint}</div>}
        </div>
        {state.saved[id] && <button className="btn btn-d" style={{ fontSize: 12, padding: '5px 11px' }} onClick={() => disconnect(id)}>Desconectar</button>}
      </div>
      {state.error[id] && <div className="err-box">{state.error[id]}</div>}
      {state.success[id] && <div className="ok-box">{state.success[id]}</div>}
      {!state.saved[id] && (
        <>
          {children}
          <button className="btn btn-p" style={{ marginTop: 13, padding: '9px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => connect(id)} disabled={state.loading[id]}>
            {state.loading[id] ? <><Spinner color="#fff" /> Verificando...</> : `Conectar ${title}`}
          </button>
        </>
      )}
      {state.saved[id] && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {Object.entries(forms[id]).filter(([, v]) => v).map(([k]) => (
            <div key={k} style={{ background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 5, padding: '3px 9px', fontSize: 10, color: C.green, fontFamily: "'DM Mono',monospace" }}>{k} ✓</div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="content fade-in" style={{ maxWidth: 740 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 3 }}>Integraciones</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>Conectá tus cuentas para activar la automatización completa</div>
      </div>

      <IntegCard id="meta" icon="📘" title="Meta Ads" required hint="Requerido para crear y gestionar campañas en Facebook e Instagram">
        <div style={{ background: C.amberDim, border: `1px solid ${C.amber}33`, borderRadius: 8, padding: '9px 12px', marginBottom: 13, fontSize: 12, color: C.amber }}>
          ⚠️ Necesitás un Access Token de larga duración con permisos ads_management. <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Cómo obtenerlo →</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="fg"><label className="flbl">Access Token <span style={{ color: C.red }}>*</span></label><input className="finput" type="password" placeholder="EAAxxxxxxxxxxxxxxxxx..." value={forms.meta.accessToken} onChange={e => setF('meta', 'accessToken', e.target.value)} /></div>
          <div className="g2" style={{ gap: 11 }}>
            <div className="fg"><label className="flbl">Ad Account ID <span style={{ color: C.red }}>*</span></label><input className="finput" placeholder="act_123456789" value={forms.meta.adAccountId} onChange={e => setF('meta', 'adAccountId', e.target.value)} /></div>
            <div className="fg"><label className="flbl">Business Manager ID</label><input className="finput" placeholder="123456789" value={forms.meta.businessId} onChange={e => setF('meta', 'businessId', e.target.value)} /></div>
          </div>
          <div className="g2" style={{ gap: 11 }}>
            <div className="fg"><label className="flbl">Pixel ID</label><input className="finput" placeholder="123456789" value={forms.meta.pixelId} onChange={e => setF('meta', 'pixelId', e.target.value)} /></div>
            <div className="fg"><label className="flbl">Page ID (Facebook)</label><input className="finput" placeholder="123456789" value={forms.meta.pageId} onChange={e => setF('meta', 'pageId', e.target.value)} /></div>
          </div>
        </div>
      </IntegCard>

      <IntegCard id="whatsapp" icon="💬" title="WhatsApp Business API" required hint="Requerido para redirigir leads con tracking de conversaciones">
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 8, padding: '9px 12px', marginBottom: 13, fontSize: 12, color: C.accent }}>
          💡 Necesitás WhatsApp Business API (Meta). <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Ver guía →</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="fg"><label className="flbl">Phone Number ID <span style={{ color: C.red }}>*</span></label><input className="finput" placeholder="123456789" value={forms.whatsapp.phoneNumberId} onChange={e => setF('whatsapp', 'phoneNumberId', e.target.value)} /></div>
          <div className="fg"><label className="flbl">Business Account ID</label><input className="finput" placeholder="123456789" value={forms.whatsapp.businessAccountId} onChange={e => setF('whatsapp', 'businessAccountId', e.target.value)} /></div>
          <div className="fg"><label className="flbl">Access Token <span style={{ color: C.red }}>*</span></label><input className="finput" type="password" placeholder="EAAxxxxxxxxxxxxxxxxx..." value={forms.whatsapp.accessToken} onChange={e => setF('whatsapp', 'accessToken', e.target.value)} /></div>
        </div>
      </IntegCard>

      <IntegCard id="stripe" icon="💳" title="Stripe" hint="Para gestionar pagos propios si ofrecés tu plataforma a clientes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="fg"><label className="flbl">Secret Key <span style={{ color: C.red }}>*</span></label><input className="finput" type="password" placeholder="sk_live_xxxxxxxxxx..." value={forms.stripe.secretKey} onChange={e => setF('stripe', 'secretKey', e.target.value)} /></div>
          <div className="fg"><label className="flbl">Webhook Secret</label><input className="finput" type="password" placeholder="whsec_xxxxxxxxxx..." value={forms.stripe.webhookSecret} onChange={e => setF('stripe', 'webhookSecret', e.target.value)} /></div>
        </div>
      </IntegCard>

      <IntegCard id="instagram" icon="📸" title="Instagram Business" hint="Para anuncios en Instagram Stories y Reels">
        <div className="fg"><label className="flbl">Instagram Account ID</label><input className="finput" placeholder="17841xxxxxxxxx" value={forms.instagram.accountId} onChange={e => setF('instagram', 'accountId', e.target.value)} /></div>
        <div style={{ marginTop: 9, fontSize: 12, color: C.textMuted }}>Debe estar vinculado a la Page de Facebook configurada en Meta Ads.</div>
      </IntegCard>
    </div>
  );
}
