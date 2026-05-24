import { useState } from 'react';
import { Tag } from '../../components/ui';
import { C } from '../../styles/theme';

const CMPGS = [
  { id: 1, name: 'Zapatillas Nike Air - Reels', status: 'activa', budget: '$25/día', spent: '$312', ctr: '4.2%', cpc: '$0.38', leads: 82, roas: '4.1x' },
  { id: 2, name: 'Bolsos importados - Stories', status: 'activa', budget: '$15/día', spent: '$198', ctr: '3.8%', cpc: '$0.52', leads: 38, roas: '3.2x' },
  { id: 3, name: 'Ropa de invierno - Feed', status: 'pausada', budget: '$10/día', spent: '$87', ctr: '1.9%', cpc: '$1.10', leads: 9, roas: '1.2x' },
  { id: 4, name: 'Tecnología gaming - Carrusel', status: 'optimizando', budget: '$40/día', spent: '$520', ctr: '5.1%', cpc: '$0.29', leads: 179, roas: '5.8x' },
  { id: 5, name: 'Indumentaria deportiva', status: 'activa', budget: '$20/día', spent: '$241', ctr: '3.4%', cpc: '$0.61', leads: 55, roas: '2.9x' },
];

export default function Campaigns() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');

  const filtered = CMPGS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Todas' || (filter === 'Activas' && c.status === 'activa') || (filter === 'Pausadas' && c.status === 'pausada');
    return matchSearch && matchFilter;
  });

  return (
    <div className="content fade-in">
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input className="finput" placeholder="🔍 Buscar..." style={{ maxWidth: 250 }} value={search} onChange={e => setSearch(e.target.value)} />
        <select className="fsel" style={{ maxWidth: 130 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option>Todas</option>
          <option>Activas</option>
          <option>Pausadas</option>
        </select>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Estado</th><th>Presupuesto</th><th>Gastado</th>
                <th>CTR</th><th>CPC</th><th>Leads</th><th>ROAS</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500, fontSize: 12 }}>{c.name}</td>
                  <td><Tag t={c.status === 'activa' ? 'tg' : c.status === 'pausada' ? 'tr' : 'ta'}>{c.status}</Tag></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.budget}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.spent}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.ctr}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.cpc}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.accent }}>{c.leads}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.green }}>{c.roas}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-g" style={{ padding: '3px 8px', fontSize: 11 }}>Editar</button>
                      <button className="btn btn-g" style={{ padding: '3px 8px', fontSize: 11 }}>{c.status === 'activa' ? 'Pausar' : 'Activar'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
