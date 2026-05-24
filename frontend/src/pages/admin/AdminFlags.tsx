import { useState } from 'react';
import { Tag, Toggle } from '../../components/ui';
import { C } from '../../styles/theme';

const INIT_FLAGS = [
  { id: 'f1', name: 'ai_creative_generation', desc: 'Generación de creativos con IA', enabled: true, scope: null },
  { id: 'f2', name: 'ai_optimization', desc: 'Optimización automática de campañas', enabled: true, scope: 'growth' },
  { id: 'f3', name: 'ai_advanced', desc: 'IA avanzada completa (análisis profundo)', enabled: true, scope: 'scale' },
  { id: 'f4', name: 'auto_daily_reports', desc: 'Informes diarios automáticos a las 20:00', enabled: true, scope: null },
  { id: 'f5', name: 'meta_ads_publish', desc: 'Publicación directa en Meta Ads API', enabled: true, scope: null },
  { id: 'f6', name: 'multi_meta_accounts', desc: 'Múltiples cuentas Meta Ads', enabled: true, scope: 'growth' },
  { id: 'f7', name: 'api_access', desc: 'Acceso a la API REST de la plataforma', enabled: false, scope: 'scale' },
  { id: 'f8', name: 'white_label', desc: 'White label / marca propia', enabled: false, scope: 'scale' },
  { id: 'f9', name: 'bulk_campaign_creation', desc: 'Creación masiva de campañas', enabled: true, scope: 'growth' },
  { id: 'f10', name: 'maintenance_mode', desc: '🚨 Modo mantenimiento (bloquea acceso clientes)', enabled: false, scope: null },
];

export default function AdminFlags() {
  const [flags, setFlags] = useState(INIT_FLAGS);

  const toggle = (id: string) => setFlags(p => p.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));

  return (
    <div className="page fa">
      <div className="sec-head">
        <div>
          <div className="sec-title">Feature Flags</div>
          <div className="sec-sub">Activar/desactivar funciones del sistema sin redeploy</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag t="tg">{flags.filter(f => f.enabled).length} activos</Tag>
          <Tag t="tr">{flags.filter(f => !f.enabled).length} inactivos</Tag>
        </div>
      </div>

      {flags.find(f => f.name === 'maintenance_mode')?.enabled && (
        <div className="alert alert-red" style={{ marginBottom: 16 }}>
          🚨 <strong>Modo mantenimiento ACTIVO.</strong> Los clientes no pueden acceder a la plataforma.
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>Flag</th><th>Descripción</th><th>Scope</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {flags.map(f => (
              <tr key={f.id} style={{ opacity: f.enabled ? 1 : 0.6 }}>
                <td>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: f.name === 'maintenance_mode' ? C.red : C.accent }}>{f.name}</div>
                </td>
                <td style={{ fontSize: 13 }}>{f.desc}</td>
                <td>{f.scope ? <Tag t="tp">{f.scope}+</Tag> : <Tag t="tk">todos</Tag>}</td>
                <td>
                  <Toggle checked={f.enabled} onChange={() => toggle(f.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
