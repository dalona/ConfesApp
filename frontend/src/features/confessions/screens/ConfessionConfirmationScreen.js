import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, User, Clock, ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConfessionConfirmationScreen = ({ confessionData, onBackToDashboard }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get confession data from navigation state or props
  const data = location.state?.confessionData || confessionData;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-yellow-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-yellow-100 dark:border-yellow-800"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              ¡Confesión Agendada!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tu cita ha sido confirmada exitosamente
            </p>
          </motion.div>

          {/* Confession Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
              Detalles de tu Cita
            </h2>
            
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {formatDate(data?.startTime || new Date())}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {formatTime(data?.startTime || new Date())} - {formatTime(data?.endTime || new Date())}
                  </p>
                </div>
              </div>

              {/* Priest */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sacerdote</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Padre {data?.priest?.firstName || 'Asignado'}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {data?.location || 'Confesionario Principal'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reminder Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8"
          >
            <p className="text-center text-yellow-800 dark:text-yellow-200">
              💡 Recuerda llegar 5 minutos antes de tu cita. Te recomendamos hacer un examen de conciencia previo.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onBackToDashboard || (() => navigate('/dashboard/faithful'))}
              className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              📄 Imprimir Comprobante
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Si necesitas cancelar tu cita, puedes hacerlo desde tu dashboard hasta 2 horas antes.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfessionConfirmationScreen;