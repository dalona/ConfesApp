import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Calendar, Shield, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import the screens we want to test
import ConfessionConfirmationScreen from '../features/confessions/screens/ConfessionConfirmationScreen';
import ConfessionRequestDetailScreen from '../features/confessions/screens/ConfessionRequestDetailScreen';
import UnauthorizedAccessScreen from '../features/auth/screens/UnauthorizedAccessScreen';
import ConfessionHistoryScreen from '../features/confessions/screens/ConfessionHistoryScreen';

const DemoScreen = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState(null);

  // Mock data for testing
  const mockConfessionData = {
    id: 'demo-confession-1',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
    location: 'Confesionario Principal',
    priest: {
      firstName: 'Juan Carlos',
      lastName: 'González'
    },
    notes: 'Confesión de demostración para testing'
  };

  const mockRequestData = {
    id: 'demo-request-1',
    status: 'pending',
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    location: 'Capilla San José',
    notes: 'Solicitud urgente para confesión de preparación matrimonial',
    faithful: {
      firstName: 'María',
      lastName: 'Rodríguez',
      email: 'maria.rodriguez@ejemplo.com',
      phone: '+34 600 123 456',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    }
  };

  const demoScreens = [
    {
      id: 'confirmation',
      title: 'Confirmación de Cita',
      description: 'Pantalla que ve el fiel después de agendar exitosamente',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      component: (
        <ConfessionConfirmationScreen 
          confessionData={mockConfessionData}
          onBackToDashboard={() => setActiveDemo(null)}
        />
      )
    },
    {
      id: 'request-detail',
      title: 'Detalle de Solicitud',
      description: 'Vista del sacerdote para revisar solicitudes de confesión',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
      component: (
        <ConfessionRequestDetailScreen 
          requestData={mockRequestData}
          onAccept={async (id) => {
            alert(`Solicitud ${id} aceptada`);
            setActiveDemo(null);
          }}
          onReject={async (id, reason) => {
            alert(`Solicitud ${id} rechazada: ${reason}`);
            setActiveDemo(null);
          }}
          onBack={() => setActiveDemo(null)}
        />
      )
    },
    {
      id: 'unauthorized',
      title: 'Error de Acceso',
      description: 'Pantalla cuando un usuario intenta acceder a un rol incorrecto',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      component: (
        <UnauthorizedAccessScreen 
          attemptedRole="priest"
          currentRole="faithful"
        />
      )
    },
    {
      id: 'history',
      title: 'Historial de Confesiones',
      description: 'Vista completa del historial para fieles y sacerdotes',
      icon: Calendar,
      color: 'from-purple-500 to-violet-500',
      component: (
        <ConfessionHistoryScreen 
          onBack={() => setActiveDemo(null)}
        />
      )
    }
  ];

  if (activeDemo) {
    const screen = demoScreens.find(s => s.id === activeDemo);
    return screen?.component;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                🧪 Demo de Pantallas ConfesApp
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Prueba las nuevas pantallas implementadas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demo Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {demoScreens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => setActiveDemo(screen.id)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${screen.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <screen.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {screen.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {screen.description}
                </p>

                {/* Action Button */}
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Demo
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            📋 Instrucciones de Testing
          </h3>
          <div className="space-y-2 text-blue-700 dark:text-blue-300">
            <p>• <strong>Confirmación de Cita:</strong> Simula el flujo después de agendar</p>
            <p>• <strong>Detalle de Solicitud:</strong> Vista del sacerdote con botones funcionales</p>
            <p>• <strong>Error de Acceso:</strong> Pantalla de error por rol incorrecto</p>
            <p>• <strong>Historial:</strong> Vista completa con datos del usuario actual</p>
          </div>
        </motion.div>

        {/* Integration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
            🔗 Próxima Integración
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            Estas pantallas serán integradas en el routing real de la aplicación con navegación directa desde los dashboards correspondientes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoScreen;