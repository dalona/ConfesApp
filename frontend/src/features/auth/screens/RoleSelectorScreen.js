import React from 'react';
import { motion } from 'framer-motion';
import { Cross, User, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/navigation';

const RoleSelectorScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Cross className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">ConfesApp</h1>
          </div>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Inicio
          </button>
        </motion.header>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-6">
                ¿Cómo deseas acceder?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Selecciona tu rol para continuar
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => navigate(ROUTES.FAITHFUL_ACTION)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">Fiel</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Reserva tu confesión y gestiona tus citas
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => navigate(ROUTES.PRIEST_ACTION)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Cross className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">Sacerdote</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Gestiona horarios y atiende confesiones
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectorScreen;