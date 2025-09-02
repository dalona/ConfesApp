import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Filter, Search, ChevronDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { confessionsService } from '../services/confessionsService';

const ConfessionHistoryScreen = ({ onBack }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    setLoading(true);
    try {
      const data = await confessionsService.getMyConfessions();
      setConfessions(data);
    } catch (error) {
      console.error('Error fetching confessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'booked': return 'Reservada';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked': return '📅';
      case 'confirmed': return '✅';
      case 'completed': return '🙏';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const filteredConfessions = confessions.filter(confession => {
    const matchesFilter = filter === 'all' || confession.status === filter;
    const matchesSearch = !searchTerm || 
      confession.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      confession.priest?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const upcomingConfessions = filteredConfessions.filter(c => 
    new Date(c.scheduledTime || c.confessionSlot?.startTime || c.confessionBand?.startTime) > new Date() &&
    c.status !== 'cancelled' && c.status !== 'completed'
  );

  const pastConfessions = filteredConfessions.filter(c => 
    new Date(c.scheduledTime || c.confessionSlot?.startTime || c.confessionBand?.startTime) <= new Date() ||
    c.status === 'cancelled' || c.status === 'completed'
  );

  const formatDateTime = (confession) => {
    let date;
    if (confession.confessionSlot) {
      date = new Date(confession.confessionSlot.startTime);
    } else if (confession.confessionBand) {
      date = new Date(confession.confessionBand.startTime);
    } else {
      date = new Date(confession.scheduledTime);
    }
    
    return {
      date: date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getPriestName = (confession) => {
    return confession.confessionSlot?.priest?.firstName || 
           confession.confessionBand?.priest?.firstName || 
           'Padre Asignado';
  };

  const getLocation = (confession) => {
    return confession.confessionSlot?.location || 
           confession.confessionBand?.location || 
           confession.location || 
           'Confesionario Principal';
  };

  const ConfessionCard = ({ confession, index }) => {
    const { date, time } = formatDateTime(confession);
    const isUpcoming = upcomingConfessions.includes(confession);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 ${
          isUpcoming ? 'border-l-blue-500' : 'border-l-gray-300'
        } hover:shadow-xl transition-all`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header with Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getStatusIcon(confession.status)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Confesión {isUpcoming ? 'Programada' : 'Pasada'}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(confession.status)}`}>
                    {getStatusText(confession.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Date & Time */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{time}</p>
                </div>
              </div>

              {/* Priest & Location */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sacerdote</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{getPriestName(confession)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{getLocation(confession)}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {confession.notes && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Notas:</strong> {confession.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-yellow-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-yellow-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <button
              onClick={onBack || (() => navigate(-1))}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Historial de Confesiones
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Revisa tus citas pasadas y próximas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ubicación o sacerdote..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtrar
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-2">
                    {[
                      { value: 'all', label: 'Todas' },
                      { value: 'booked', label: 'Reservadas' },
                      { value: 'confirmed', label: 'Confirmadas' },
                      { value: 'completed', label: 'Completadas' },
                      { value: 'cancelled', label: 'Canceladas' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilter(option.value);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          filter === option.value ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{upcomingConfessions.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Próximas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{confessions.filter(c => c.status === 'completed').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{confessions.filter(c => c.status === 'confirmed').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Confirmadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{confessions.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Confessions */}
        {upcomingConfessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              📅 Próximas Citas ({upcomingConfessions.length})
            </h2>
            <div className="space-y-4">
              {upcomingConfessions.map((confession, index) => (
                <ConfessionCard key={confession.id} confession={confession} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Past Confessions */}
        {pastConfessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              📚 Historial Pasado ({pastConfessions.length})
            </h2>
            <div className="space-y-4">
              {pastConfessions.map((confession, index) => (
                <ConfessionCard key={confession.id} confession={confession} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredConfessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No se encontraron confesiones
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {filter === 'all' ? 'Aún no tienes confesiones registradas.' : `No hay confesiones con el filtro "${getStatusText(filter)}".`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConfessionHistoryScreen;