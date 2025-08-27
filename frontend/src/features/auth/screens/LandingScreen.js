import React from 'react';
import { motion } from 'framer-motion';
import { Cross, Calendar, Users } from 'lucide-react';

const LandingScreen = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Cross className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">ConfesApp</h1>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-6xl font-bold text-purple-900 dark:text-purple-100 mb-6">
                Vuelve a la gracia
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Encuentra, agenda y prepárate para tu confesión de manera sencilla y reverente
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <button
                onClick={() => onRoleSelect('role-select')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Agendar confesión
              </button>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-16 relative"
            >
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-3xl p-8 mx-auto max-w-2xl">
                <div className="aspect-video bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 rounded-2xl flex items-center justify-center">
                  <Cross className="w-24 h-24 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">Agenda fácil</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Reserva tu cita de confesión de manera simple y rápida
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cross className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">Ambiente reverente</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Experiencia diseñada con respeto y solemnidad
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">Para todos</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Accesible para fieles, sacerdotes y coordinadores
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingScreen;