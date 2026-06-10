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
import Rooms from './pages/Rooms';
import Users from './pages/Users';
import Feedbacks from './pages/Feedbacks';
import Subscriptions from './pages/Subscriptions';
import MySubscription from './pages/MySubscription';
import MyTraining from './pages/MyTraining';
import MemberFeedback from './pages/MemberFeedback';
import TrainerStudents from './pages/TrainerStudents';
import TrainerSchedule from './pages/TrainerSchedule';

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
      <Route path="/rooms" element={
        <ProtectedRoute roles={['owner', 'staff']}>
          <Layout><Rooms /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute roles={['owner']}>
          <Layout><Users /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/feedbacks" element={
        <ProtectedRoute roles={['owner', 'staff']}>
          <Layout><Feedbacks /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/subscriptions" element={
        <ProtectedRoute roles={['owner', 'staff']}>
          <Layout><Subscriptions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trainer-students" element={
        <ProtectedRoute roles={['pt']}>
          <Layout><TrainerStudents /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trainer-schedule" element={
        <ProtectedRoute roles={['pt']}>
          <Layout><TrainerSchedule /></Layout>
        </ProtectedRoute>
      } />

      {/* Member routes */}
      <Route path="/profile" element={
        <ProtectedRoute roles={['member']}>
          <Layout><MemberProfile /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-subscription" element={
        <ProtectedRoute roles={['member']}>
          <Layout><MySubscription /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-training" element={
        <ProtectedRoute roles={['member']}>
          <Layout><MyTraining /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/feedback" element={
        <ProtectedRoute roles={['member']}>
          <Layout><MemberFeedback /></Layout>
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
