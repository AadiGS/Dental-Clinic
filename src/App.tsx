import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function RequireAuth({ children }) {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/admin/login" 
          element={
            token ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <RequireAuth>
              <AdminDashboard token={token} onLogout={handleLogout} />
            </RequireAuth>
          } 
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
