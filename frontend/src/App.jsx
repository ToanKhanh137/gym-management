import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';
import Packages from './pages/Packages';
import CheckIn from './pages/CheckIn';
import Equipment from './pages/Equipment';
import Reports from './pages/Reports';
import MemberProfile from './pages/MemberProfile';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } });

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'member') return <Navigate to="/profile" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Staff/Owner/PT routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={['owner', 'staff', 'pt']}>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/members" element={
        <ProtectedRoute roles={['owner', 'staff', 'pt']}>
          <Layout><Members /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/members/:id" element={
        <ProtectedRoute roles={['owner', 'staff', 'pt']}>
          <Layout><MemberDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/packages" element={
        <ProtectedRoute>
          <Layout><Packages /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/checkin" element={
        <ProtectedRoute roles={['owner', 'staff', 'pt']}>
          <Layout><CheckIn /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/equipment" element={
        <ProtectedRoute roles={['owner', 'staff']}>
          <Layout><Equipment /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute roles={['owner']}>
          <Layout><Reports /></Layout>
        </ProtectedRoute>
      } />

      {/* Member routes */}
      <Route path="/profile" element={
        <ProtectedRoute roles={['member']}>
          <Layout><MemberProfile /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
