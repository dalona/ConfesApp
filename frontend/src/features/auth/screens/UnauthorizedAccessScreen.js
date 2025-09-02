import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const UnauthorizedAccessScreen = ({ attemptedRole, currentRole }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getRoleDisplayName = (role) => {
    const roleNames = {
      faithful: 'Fiel',
      priest: 'Sacerdote',
      coordinator: 'Coordinador',
      bishop: 'Obispo',
      admin: 'Administrador'
    };
    return roleNames[role] || role;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-yellow-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-red-100 dark:border-red-800 text-center"
        >
          {/* Warning Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Acceso No Autorizado
            </h1>
            <div className="space-y-3">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Estás intentando acceder a un panel que no corresponde a tu rol.
              </p>
              
              {currentRole && attemptedRole && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    <strong>Tu rol actual:</strong> {getRoleDisplayName(currentRole)}
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    <strong>Panel solicitado:</strong> {getRoleDisplayName(attemptedRole)}
                  </p>
                </div>
              )}
              
              <p className="text-gray-600 dark:text-gray-300">
                Por favor, inicia sesión con el rol correcto o regresa a tu panel correspondiente.
              </p>
            </div>
          </motion.div>

          {/* Role Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
              Información sobre Roles
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
              <div>
                <strong>Fiel:</strong> Gestión de citas y confesiones
              </div>
              <div>
                <strong>Sacerdote:</strong> Administración de franjas y horarios
              </div>
              <div>
                <strong>Coordinador:</strong> Gestión parroquial
              </div>
              <div>
                <strong>Obispo:</strong> Administración diocesana
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {currentRole && (
              <button
                onClick={() => navigate(`/dashboard/${currentRole}`)}
                className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Mi Dashboard
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Si crees que esto es un error o necesitas cambiar tu rol, contacta al administrador de tu parroquia.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnauthorizedAccessScreen;