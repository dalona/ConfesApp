import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  Mail,
  Search,
  Filter,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Award
} from 'lucide-react';

const ParishPriests = ({ parishInfo, userRole, onRefresh }) => {
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPriest, setSelectedPriest] = useState(null);

  useEffect(() => {
    fetchParishPriests();
  }, []);

  const fetchParishPriests = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls for parish-specific priests
      const mockPriests = [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'padre.juan@sanmiguel.es',
          phone: '+34 600 123 456',
          isActive: true,
          canConfess: true,
          role: 'pastor', // pastor, associate, visiting
          ordinationDate: '2010-05-15',
          specialties: ['Español', 'Inglés'],
          schedule: 'Lunes a Viernes 16:00-19:00',
          confessionsThisMonth: 28,
          averageRating: 4.8
        },
        {
          id: '2',
          firstName: 'Carlos',
          lastName: 'López',
          email: 'padre.carlos@sanmiguel.es',
          phone: '+34 600 789 012',
          isActive: true,
          canConfess: true,
          role: 'associate',
          ordinationDate: '2008-06-20',
          specialties: ['Español', 'Francés'],
          schedule: 'Martes y Jueves 17:00-20:00',
          confessionsThisMonth: 31,
          averageRating: 4.9
        },
        {
          id: '3',
          firstName: 'Miguel',
          lastName: 'Torres',
          email: 'padre.miguel@sanmiguel.es',
          phone: '+34 600 345 678',
          isActive: false,
          canConfess: false,
          role: 'visiting',
          ordinationDate: '2015-03-10',
          specialties: ['Español'],
          schedule: 'Fines de semana 10:00-12:00',
          confessionsThisMonth: 12,
          averageRating: 4.6
        }
      ];

      setPriests(mockPriests);
    } catch (error) {
      console.error('Error fetching parish priests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPriest = (priest) => {
    setSelectedPriest(priest);
    setShowEditModal(true);
  };

  const handleAssignSchedule = (priestId) => {
    // Navigate to calendar with pre-selected priest
    console.log('Assign schedule to priest:', priestId);
  };

  const handleToggleStatus = async (priestId, currentStatus) => {
    try {
      // API call to toggle status
      setPriests(priests.map(p => 
        p.id === priestId ? { ...p, isActive: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error toggling priest status:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'pastor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'associate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'visiting':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'pastor': return 'Párroco';
      case 'associate': return 'Asociado';
      case 'visiting': return 'Visitante';
      default: return role;
    }
  };

  const filteredPriests = priests.filter(priest => {
    const matchesSearch = priest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         priest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         priest.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && priest.isActive) ||
                         (filterStatus === 'inactive' && !priest.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando sacerdotes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Sacerdotes de la Parroquia
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona el equipo sacerdotal de {parishInfo?.name}
          </p>
        </div>
        
        {userRole === 'priest' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Añadir Sacerdote
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar sacerdotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Priests Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPriests.map((priest, index) => (
          <motion.div
            key={priest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Priest Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-bold mb-1">
                    Padre {priest.firstName} {priest.lastName}
                  </h3>
                  <div className="flex items-center text-purple-100">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(priest.role)} text-purple-800`}>
                      {getRoleText(priest.role)}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Priest Content */}
            <div className="p-6">
              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {priest.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {priest.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {priest.schedule}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{priest.confessionsThisMonth}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Este Mes</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{priest.averageRating}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {priest.specialties.map((specialty, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  priest.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {priest.isActive ? 'Activo' : 'Inactivo'}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAssignSchedule(priest.id)}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                    title="Asignar Horario"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEditPriest(priest)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(priest.id, priest.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      priest.isActive
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900'
                    }`}
                    title={priest.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {priest.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPriests.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            No se encontraron sacerdotes
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Ajusta los filtros de búsqueda o añade un nuevo sacerdote.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParishPriests;