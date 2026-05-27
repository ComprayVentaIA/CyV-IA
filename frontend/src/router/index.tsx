import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui';

// ── Eager (tiny, needed before auth) ─────────────────────────────────────────
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';

// ── Lazy loaded (split by route) ──────────────────────────────────────────────
const CheckoutPage    = lazy(() => import('../pages/CheckoutPage'));
const SuccessPage     = lazy(() => import('../pages/SuccessPage'));

const DashShell       = lazy(() => import('../pages/dashboard/DashShell'));
const DashOverview    = lazy(() => import('../pages/dashboard/DashOverview'));
const Campaigns       = lazy(() => import('../pages/dashboard/Campaigns'));
const NewCampaign     = lazy(() => import('../pages/dashboard/NewCampaign'));
const Creatives       = lazy(() => import('../pages/dashboard/Creatives'));
const Reports         = lazy(() => import('../pages/dashboard/Reports'));
const Integrations    = lazy(() => import('../pages/dashboard/Integrations'));
const Billing         = lazy(() => import('../pages/dashboard/Billing'));
const ConversiaIA     = lazy(() => import('../pages/dashboard/ConversiaIA'));
const Profile         = lazy(() => import('../pages/dashboard/Profile'));

const AdminShell      = lazy(() => import('../pages/admin/AdminShell'));
const AdminOverview   = lazy(() => import('../pages/admin/AdminOverview'));
const AdminUsers      = lazy(() => import('../pages/admin/AdminUsers'));
const AdminRoles      = lazy(() => import('../pages/admin/AdminRoles'));
const AdminBilling    = lazy(() => import('../pages/admin/AdminBilling'));
const AdminFlags      = lazy(() => import('../pages/admin/AdminFlags'));
const AdminAITraining = lazy(() => import('../pages/admin/AdminAITraining'));
const AdminAudit      = lazy(() => import('../pages/admin/AdminAudit'));
const AdminComms      = lazy(() => import('../pages/admin/AdminComms'));
const AdminSystem     = lazy(() => import('../pages/admin/AdminSystem'));

// ── Suspense wrapper ──────────────────────────────────────────────────────────
function Fallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#07070f' }}>
      <Spinner size={28} />
    </div>
  );
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}

// ── Guards ────────────────────────────────────────────────────────────────────
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Fallback />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Fallback />;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'support') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// ── Router ────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/checkout', element: <S><CheckoutPage /></S> },
  { path: '/success', element: <S><SuccessPage /></S> },

  {
    path: '/dashboard',
    element: <RequireAuth><S><DashShell /></S></RequireAuth>,
    children: [
      { index: true,                    element: <S><DashOverview /></S> },
      { path: 'campaigns',              element: <S><Campaigns /></S> },
      { path: 'new-campaign',           element: <S><NewCampaign /></S> },
      { path: 'creatives',              element: <S><Creatives /></S> },
      { path: 'conversia-ia',           element: <S><ConversiaIA /></S> },
      { path: 'reports',                element: <S><Reports /></S> },
      { path: 'integrations',           element: <S><Integrations /></S> },
      { path: 'billing',                element: <S><Billing /></S> },
      { path: 'profile',               element: <S><Profile /></S> },
    ],
  },

  {
    path: '/admin',
    element: <RequireAdmin><S><AdminShell /></S></RequireAdmin>,
    children: [
      { index: true,           element: <S><AdminOverview /></S> },
      { path: 'users',         element: <S><AdminUsers /></S> },
      { path: 'roles',         element: <S><AdminRoles /></S> },
      { path: 'billing',       element: <S><AdminBilling /></S> },
      { path: 'flags',         element: <S><AdminFlags /></S> },
      { path: 'ai-training',   element: <S><AdminAITraining /></S> },
      { path: 'audit',         element: <S><AdminAudit /></S> },
      { path: 'comms',         element: <S><AdminComms /></S> },
      { path: 'system',        element: <S><AdminSystem /></S> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
