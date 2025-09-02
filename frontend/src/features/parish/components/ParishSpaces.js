import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Church, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Users, 
  Clock,
  Search,
  Settings,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ParishSpaces = ({ parishInfo, userRole, onRefresh }) => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  useEffect(() => {
    fetchParishSpaces();
  }, []);

  const fetchParishSpaces = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls for parish-specific spaces
      const mockSpaces = [
        {
          id: '1',
          name: 'Confesionario Principal',
          location: 'Nave Central - Lado Derecho',
          capacity: 1,
          isActive: true,
          hasAirConditioning: true,
          hasHandicapAccess: true,
          hasPrivacy: true,
          description: 'Confesionario tradicional con excelente acústica',
          schedule: 'Lunes a Domingo 9:00-20:00',
          utilizationRate: 85,
          maintenanceStatus: 'good',
          lastMaintenance: '2024-05-15',
          monthlyConfessions: 156,
          averageWaitTime: 8
        },
        {
          id: '2',
          name: 'Confesionario Lateral',
          location: 'Capilla del Santísimo',
          capacity: 1,
          isActive: true,
          hasAirConditioning: false,
          hasHandicapAccess: true,
          hasPrivacy: true,
          description: 'Ambiente más íntimo y recogido',
          schedule: 'Martes y Jueves 16:00-19:00',
          utilizationRate: 72,
          maintenanceStatus: 'fair',
          lastMaintenance: '2024-04-20',
          monthlyConfessions: 89,
          averageWaitTime: 12
        },
        {
          id: '3',
          name: 'Sala de Reconciliación',
          location: 'Casa Parroquial - Planta Baja',
          capacity: 2,
          isActive: true,
          hasAirConditioning: true,
          hasHandicapAccess: true,
          hasPrivacy: true,
          description: 'Espacio moderno para confesiones cara a cara',
          schedule: 'Sábados 10:00-12:00, 17:00-19:00',
          utilizationRate: 45,
          maintenanceStatus: 'excellent',
          lastMaintenance: '2024-06-01',
          monthlyConfessions: 67,
          averageWaitTime: 5
        },
        {
          id: '4',
          name: 'Confesionario Móvil',
          location: 'Variable - Eventos Especiales',
          capacity: 1,
          isActive: false,
          hasAirConditioning: false,
          hasHandicapAccess: false,
          hasPrivacy: true,
          description: 'Para retiros y eventos especiales',
          schedule: 'Bajo demanda',
          utilizationRate: 20,
          maintenanceStatus: 'needs_repair',
          lastMaintenance: '2024-02-10',
          monthlyConfessions: 23,
          averageWaitTime: 15
        }
      ];

      setSpaces(mockSpaces);
    } catch (error) {
      console.error('Error fetching parish spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSpace = (space) => {
    setSelectedSpace(space);
    setShowEditModal(true);
  };

  const handleDeleteSpace = async (spaceId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este espacio?')) {
      try {
        // API call to delete space
        setSpaces(spaces.filter(s => s.id !== spaceId));
      } catch (error) {
        console.error('Error deleting space:', error);
      }
    }
  };

  const handleToggleStatus = async (spaceId, currentStatus) => {
    try {
      // API call to toggle status
      setSpaces(spaces.map(s => 
        s.id === spaceId ? { ...s, isActive: !currentStatus } : s
      ));
    } catch (error) {
      console.error('Error toggling space status:', error);
    }
  };

  const getMaintenanceColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'needs_repair':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMaintenanceText = (status) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'fair': return 'Regular';
      case 'needs_repair': return 'Necesita Reparación';
      default: return status;
    }
  };

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando espacios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Confesionarios y Espacios
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona los espacios de confesión de {parishInfo?.name}
          </p>
        </div>
        
        {userRole === 'priest' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Añadir Espacio
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar espacios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSpaces.map((space, index) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Space Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-bold mb-1">{space.name}</h3>
                  <div className="flex items-center text-blue-100">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{space.location}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Church className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Space Content */}
            <div className="p-6">
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                {space.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{space.utilizationRate}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Utilización</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{space.monthlyConfessions}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Este Mes</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Horario:</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 pl-6">
                  {space.schedule}
                </p>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Características:</p>
                <div className="flex flex-wrap gap-2">
                  {space.hasAirConditioning && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Climatizado
                    </span>
                  )}
                  {space.hasHandicapAccess && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accesible
                    </span>
                  )}
                  {space.hasPrivacy && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Privacidad
                    </span>
                  )}
                </div>
              </div>

              {/* Maintenance Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMaintenanceColor(space.maintenanceStatus)}`}>
                  {getMaintenanceText(space.maintenanceStatus)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  space.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {space.isActive ? 'Activo' : 'Inactivo'}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditSpace(space)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(space.id, space.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      space.isActive
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900'
                    }`}
                    title={space.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {space.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteSpace(space.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="text-center py-12">
          <Church className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            No se encontraron espacios
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Ajusta los filtros de búsqueda o añade un nuevo espacio.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParishSpaces;