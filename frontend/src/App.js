import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

<<<<<<< HEAD
// Pages
=======
>>>>>>> 69621fc57461dc2cc24c467ff1e38c5ccd91d56a
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import TicketsPage from './pages/TicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import ResourcesPage from './pages/ResourcesPage';
import UploadResourcePage from './pages/UploadResourcePage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminResourcesPage from './pages/AdminResourcesPage';

<<<<<<< HEAD

// Protected Route Component
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="spinner" />
        <p>Loading user session...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


// Routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />

      <Route 
        path="/profile" 
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
      />

      <Route 
        path="/tickets" 
        element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} 
      />

      <Route 
        path="/tickets/new" 
        element={
          <ProtectedRoute roles={['student']}>
            <NewTicketPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/tickets/:id" 
        element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} 
      />

      <Route 
        path="/resources" 
        element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} 
      />

      <Route 
        path="/resources/upload" 
        element={
          <ProtectedRoute roles={['tutor', 'admin']}>
            <UploadResourcePage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/resources" 
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminResourcesPage />
          </ProtectedRoute>
        } 
      />

      {/* Fallback Route */}
      <Route 
        path="*" 
        element={
          <Navigate to={user ? "/dashboard" : "/"} replace />
        } 
      />
=======
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />
      <Route path="/tickets/new" element={<ProtectedRoute roles={['student']}><NewTicketPage /></ProtectedRoute>} />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      <Route path="/resources/upload" element={<ProtectedRoute roles={['tutor', 'admin']}><UploadResourcePage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/resources" element={<ProtectedRoute roles={['admin']}><AdminResourcesPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
>>>>>>> 69621fc57461dc2cc24c467ff1e38c5ccd91d56a
    </Routes>
  );
}

<<<<<<< HEAD

// Main App
=======
>>>>>>> 69621fc57461dc2cc24c467ff1e38c5ccd91d56a
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 69621fc57461dc2cc24c467ff1e38c5ccd91d56a
