import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import CheckoutPage from '../pages/CheckoutPage';
import SuccessPage from '../pages/SuccessPage';

import DashShell from '../pages/dashboard/DashShell';
import DashOverview from '../pages/dashboard/DashOverview';
import Campaigns from '../pages/dashboard/Campaigns';
import NewCampaign from '../pages/dashboard/NewCampaign';
import Creatives from '../pages/dashboard/Creatives';
import Reports from '../pages/dashboard/Reports';
import Integrations from '../pages/dashboard/Integrations';
import Billing from '../pages/dashboard/Billing';

import AdminShell from '../pages/admin/AdminShell';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminRoles from '../pages/admin/AdminRoles';
import AdminBilling from '../pages/admin/AdminBilling';
import AdminFlags from '../pages/admin/AdminFlags';
import AdminAITraining from '../pages/admin/AdminAITraining';
import AdminAudit from '../pages/admin/AdminAudit';
import AdminComms from '../pages/admin/AdminComms';
import AdminSystem from '../pages/admin/AdminSystem';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'support') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/success', element: <SuccessPage /> },

  {
    path: '/dashboard',
    element: <RequireAuth><DashShell /></RequireAuth>,
    children: [
      { index: true, element: <DashOverview /> },
      { path: 'campaigns', element: <Campaigns /> },
      { path: 'new-campaign', element: <NewCampaign /> },
      { path: 'creatives', element: <Creatives /> },
      { path: 'reports', element: <Reports /> },
      { path: 'integrations', element: <Integrations /> },
      { path: 'billing', element: <Billing /> },
    ],
  },

  {
    path: '/admin',
    element: <RequireAdmin><AdminShell /></RequireAdmin>,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'roles', element: <AdminRoles /> },
      { path: 'billing', element: <AdminBilling /> },
      { path: 'flags', element: <AdminFlags /> },
      { path: 'ai-training', element: <AdminAITraining /> },
      { path: 'audit', element: <AdminAudit /> },
      { path: 'comms', element: <AdminComms /> },
      { path: 'system', element: <AdminSystem /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
