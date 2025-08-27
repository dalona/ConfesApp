import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Edit, Trash2, Calendar } from 'lucide-react';

const BandsList = ({ bands, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'full':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'full': return 'Llena';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  if (bands.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No hay franjas creadas aún
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Crea tu primera franja usando el calendario o el botón "Nueva Franja"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bands.map((band, index) => (
        <motion.div
          key={band.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">
                    {new Date(band.startTime).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(band.status)}`}>
                  {getStatusText(band.status)}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>
                    {new Date(band.startTime).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {new Date(band.endTime).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                  <span>{band.location || 'No especificado'}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-purple-500" />
                  <span>{band.currentBookings || 0}/{band.maxCapacity || 1} reservas</span>
                </div>
              </div>

              {band.notes && (
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  💭 {band.notes}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(band)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar franja"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(band.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Eliminar franja"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BandsList;