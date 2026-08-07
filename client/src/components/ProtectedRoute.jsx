import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4D2308] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#8A9992] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#8A9992] font-mono">Authenticating Session & Role Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = (role || user?.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    const hasPermission = normalizedAllowed.includes(userRole) ||
      (normalizedAllowed.includes('COMMANDER') && userRole === 'OPERATOR') ||
      (normalizedAllowed.includes('VICTIM') && userRole === 'CITIZEN');

    if (!hasPermission) {
      // Redirect unauthorized roles to their default dashboard
      if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
      if (userRole === 'COMMANDER' || userRole === 'OPERATOR') return <Navigate to="/commander/dashboard" replace />;
      return <Navigate to="/victim/dashboard" replace />;
    }
  }

  return children;
}
