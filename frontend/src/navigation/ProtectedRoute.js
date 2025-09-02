import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Verificando acceso..." />;
  }

  if (!user) {
    // Redirect to login with return path
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (requiredRole && user.role !== requiredRole) {
    // User doesn't have required role, redirect to their dashboard or show unauthorized
    return <Navigate to="/unauthorized" state={{ attemptedRole: requiredRole, currentRole: user.role }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User's role is not in allowed roles list
    return <Navigate to="/unauthorized" state={{ attemptedRole: allowedRoles[0], currentRole: user.role }} replace />;
  }

  return children;
};

export default ProtectedRoute;