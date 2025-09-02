import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

// Public Routes
import LandingScreen from '../features/auth/screens/LandingScreen';
import RoleSelectorScreen from '../features/auth/screens/RoleSelectorScreen';
import FaithfulActionScreen from '../features/auth/screens/FaithfulActionScreen';
import PriestActionScreen from '../features/auth/screens/PriestActionScreen';
import PriestRegistrationTypeScreen from '../features/auth/screens/PriestRegistrationTypeScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import CoordinatorRegisterScreen from '../features/auth/screens/CoordinatorRegisterScreen';

// Protected Routes
import FaithfulDashboard from '../features/confessions/screens/FaithfulDashboard';
import PriestDashboard from '../features/bands/screens/PriestDashboard';
import BishopDashboard from '../features/bishop/screens/BishopDashboard';

// New Screens
import ConfessionConfirmationScreen from '../features/confessions/screens/ConfessionConfirmationScreen';
import ConfessionRequestDetailScreen from '../features/confessions/screens/ConfessionRequestDetailScreen';
import ConfessionHistoryScreen from '../features/confessions/screens/ConfessionHistoryScreen';
import UnauthorizedAccessScreen from '../features/auth/screens/UnauthorizedAccessScreen';

// Utils
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingScreen />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/select-role" 
          element={
            <PublicRoute>
              <RoleSelectorScreen />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/faithful/action" 
          element={
            <PublicRoute>
              <FaithfulActionScreen />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/priest/action" 
          element={
            <PublicRoute>
              <PriestActionScreen />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/priest/registration-type" 
          element={
            <PublicRoute>
              <PriestRegistrationTypeScreen />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/login/:role" 
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/coordinator/register/:token" 
          element={
            <PublicRoute>
              <CoordinatorRegisterScreen />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard/faithful" 
          element={
            <ProtectedRoute requiredRole="faithful">
              <FaithfulDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/priest" 
          element={
            <ProtectedRoute requiredRole="priest">
              <PriestDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirect based on user role */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

// Component to redirect to appropriate dashboard based on user role
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  switch (user.role) {
    case 'faithful':
      return <Navigate to="/dashboard/faithful" replace />;
    case 'priest':
      return <Navigate to="/dashboard/priest" replace />;
    case 'coordinator':
      return <Navigate to="/dashboard/coordinator" replace />;
    case 'bishop':
      return <Navigate to="/dashboard/bishop" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default AppRouter;