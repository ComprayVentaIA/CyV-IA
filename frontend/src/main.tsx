import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'

// When Vercel deploys a new build the old chunk URLs no longer exist.
// If the browser has a cached HTML that references old hashes, the dynamic
// import fails. Detect that and reload once to get the fresh HTML.
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  const msg = String((e.reason as Error)?.message ?? e.reason ?? '');
  if (
    msg.includes('dynamically imported module') ||
    msg.includes('módulo importado dinámicamente') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Failed to fetch')
  ) {
    e.preventDefault();
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
