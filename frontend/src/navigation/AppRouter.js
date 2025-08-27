import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

// Screens
import LandingScreen from '../features/auth/screens/LandingScreen';
import RoleSelectorScreen from '../features/auth/screens/RoleSelectorScreen';
import FaithfulActionScreen from '../features/auth/screens/FaithfulActionScreen';
import PriestActionScreen from '../features/auth/screens/PriestActionScreen';
import PriestRegistrationTypeScreen from '../features/auth/screens/PriestRegistrationTypeScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import CoordinatorRegisterScreen from '../features/auth/screens/CoordinatorRegisterScreen';

// Dashboards
import FaithfulDashboard from '../features/confessions/screens/FaithfulDashboard';
import PriestDashboard from '../features/bands/screens/PriestDashboard';

// Utils
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AppRouter = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [priestRegistrationType, setPriestRegistrationType] = useState(null);

  // Navigation handlers
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'faithful') {
      setCurrentView('faithful-action-select');
    } else if (role === 'priest') {
      setCurrentView('priest-action-select');
    }
  };

  const handleFaithfulActionSelect = (action) => {
    setIsLogin(action === 'login');
    setCurrentView('login');
  };

  const handlePriestActionSelect = (action) => {
    if (action === 'login') {
      setIsLogin(true);
      setCurrentView('login');
    } else {
      setIsLogin(false);
      setCurrentView('priest-registration-type');
    }
  };

  const handlePriestRegistrationType = (type) => {
    setPriestRegistrationType(type);
    setIsLogin(false);
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // User authenticated - show appropriate dashboard
  if (user) {
    if (user.role === 'faithful') {
      return <FaithfulDashboard />;
    } else if (user.role === 'priest') {
      return <PriestDashboard />;
    }
    // Add other role dashboards as needed
  }

  // Public routes
  return (
    <AnimatePresence mode="wait">
      {currentView === 'landing' && (
        <LandingScreen key="landing" onRoleSelect={handleRoleSelect} />
      )}
      {currentView === 'role-select' && (
        <RoleSelectorScreen 
          key="role-select" 
          onRoleSelect={handleRoleSelect}
          onBack={() => setCurrentView('landing')}
        />
      )}
      {currentView === 'faithful-action-select' && (
        <FaithfulActionScreen 
          key="faithful-action-select"
          onActionSelect={handleFaithfulActionSelect}
          onBack={() => setCurrentView('role-select')}
        />
      )}
      {currentView === 'priest-action-select' && (
        <PriestActionScreen 
          key="priest-action-select"
          onActionSelect={handlePriestActionSelect}
          onBack={() => setCurrentView('role-select')}
        />
      )}
      {currentView === 'priest-registration-type' && (
        <PriestRegistrationTypeScreen 
          key="priest-registration-type"
          onTypeSelect={handlePriestRegistrationType}
          onBack={() => setCurrentView('priest-action-select')}
        />
      )}
      {currentView === 'login' && (
        <LoginScreen 
          key="login"
          role={selectedRole}
          isLogin={isLogin}
          priestRegistrationType={priestRegistrationType}
          onBack={() => {
            if (selectedRole === 'priest') {
              if (isLogin) {
                setCurrentView('priest-action-select');
              } else {
                setCurrentView('priest-registration-type');
              }
            } else if (selectedRole === 'faithful') {
              setCurrentView('faithful-action-select');
            } else {
              setCurrentView('role-select');
            }
          }}
          onSuccess={handleLoginSuccess}
          onSwitchMode={(mode) => {
            if (selectedRole === 'priest') {
              setCurrentView('priest-action-select');
            } else if (selectedRole === 'faithful') {
              setCurrentView('faithful-action-select');
            }
          }}
        />
      )}
      {currentView === 'coordinator-register' && (
        <CoordinatorRegisterScreen 
          key="coordinator-register"
          onBack={() => setCurrentView('landing')}
          onSuccess={handleLoginSuccess}
        />
      )}
    </AnimatePresence>
  );
};

export default AppRouter;