import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Church, 
  Eye,
  Search,
  Filter,
  TrendingUp,
  Activity
} from 'lucide-react';

const ConfessionBandsOverview = () => {
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterParish, setFilterParish] = useState('all');
  const [parishes, setParishes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockBands = [
        {
          id: '1',
          startTime: '2024-06-15T09:00:00Z',
          endTime: '2024-06-15T11:00:00Z',
          status: 'available',
          location: 'Confesionario Principal',
          maxCapacity: 5,
          currentBookings: 2,
          priest: {
            firstName: 'Juan',
            lastName: 'Pérez'
          },
          parish: {
            name: 'San Miguel Arcángel',
            city: 'Madrid'
          }
        },
        {
          id: '2',
          startTime: '2024-06-15T16:00:00Z',
          endTime: '2024-06-15T18:00:00Z',
          status: 'full',
          location: 'Confesionario Lateral',
          maxCapacity: 3,
          currentBookings: 3,
          priest: {
            firstName: 'Carlos',
            lastName: 'López'
          },
          parish: {
            name: 'Santa María',
            city: 'Madrid'
          }
        }
      ];

      const mockParishes = [
        { id: '1', name: 'San Miguel Arcángel' },
        { id: '2', name: 'Santa María' },
        { id: '3', name: 'San José' }
      ];

      setBands(mockBands);
      setParishes(mockParishes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      case 'full': return 'Completa';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      }),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const filteredBands = bands.filter(band => {
    const matchesSearch = band.priest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         band.priest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         band.parish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         band.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || band.status === filterStatus;
    const matchesParish = filterParish === 'all' || band.parish.name === filterParish;
    
    return matchesSearch && matchesStatus && matchesParish;
  });

  const stats = {
    total: bands.length,
    available: bands.filter(b => b.status === 'available').length,
    full: bands.filter(b => b.status === 'full').length,
    totalBookings: bands.reduce((sum, b) => sum + b.currentBookings, 0)
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando franjas de confesión...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Franjas de Confesión
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Supervisa las franjas de confesión en toda la diócesis
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Franjas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completas</p>
              <p className="text-2xl font-bold text-red-600">{stats.full}</p>
            </div>
            <Users className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reservas</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalBookings}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar franjas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="full">Completas</option>
            <option value="cancelled">Canceladas</option>
          </select>

          <select
            value={filterParish}
            onChange={(e) => setFilterParish(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          >
            <option value="all">Todas las parroquias</option>
            {parishes.map(parish => (
              <option key={parish.id} value={parish.name}>{parish.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bands List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {filteredBands.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBands.map((band, index) => {
              const startTime = formatDateTime(band.startTime);
              const endTime = formatDateTime(band.endTime);
              
              return (
                <motion.div
                  key={band.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Padre {band.priest.firstName} {band.priest.lastName}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Church className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {band.parish.name}
                          </span>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(band.status)}`}>
                          {getStatusText(band.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {startTime.date} - {startTime.time} a {endTime.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {band.location}
                        </div>
                        <div className="flex items-center">
                          <Activity className="w-4 h-4 mr-2" />
                          {band.currentBookings}/{band.maxCapacity} reservas
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              No se encontraron franjas
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Ajusta los filtros de búsqueda para ver más resultados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfessionBandsOverview;