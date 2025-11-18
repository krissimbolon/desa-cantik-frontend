// src/components/shared/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token } = useAuth();

  // Not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const userRole = user?.role?.role_name;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'bps_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'village_officer') {
      return <Navigate to="/desa-dashboard/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
