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
  Building
} from 'lucide-react';

const PriestsManagement = () => {
  const [priests, setPriests] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPriest, setSelectedPriest] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockPriests = [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'padre.juan@diocesis.es',
          phone: '+34 600 123 456',
          isActive: true,
          canConfess: true,
          currentParish: 'San Miguel Arcángel',
          ordinationDate: '2010-05-15',
          address: 'Calle Mayor 123',
          city: 'Madrid'
        },
        {
          id: '2',
          firstName: 'Carlos',
          lastName: 'López',
          email: 'padre.carlos@diocesis.es',
          phone: '+34 600 789 012',
          isActive: true,
          canConfess: true,
          currentParish: 'Santa María',
          ordinationDate: '2008-06-20',
          address: 'Plaza Central 45',
          city: 'Madrid'
        }
      ];

      const mockParishes = [
        { id: '1', name: 'San Miguel Arcángel' },
        { id: '2', name: 'Santa María' },
        { id: '3', name: 'San José' }
      ];

      setPriests(mockPriests);
      setParishes(mockParishes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPriest = (priest) => {
    setSelectedPriest(priest);
    setShowEditModal(true);
  };

  const handleDeletePriest = async (priestId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este sacerdote?')) {
      try {
        // API call to delete priest
        setPriests(priests.filter(p => p.id !== priestId));
      } catch (error) {
        console.error('Error deleting priest:', error);
      }
    }
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
            Gestión de Sacerdotes
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Administra los sacerdotes de tu diócesis
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Añadir Sacerdote
        </button>
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

      {/* Priests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Sacerdote
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Parroquia Actual
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPriests.map((priest, index) => (
                <motion.tr
                  key={priest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          Padre {priest.firstName} {priest.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ordenación: {new Date(priest.ordinationDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        {priest.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 mr-2" />
                        {priest.phone}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {priest.currentParish || 'Sin asignar'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      priest.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {priest.isActive ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activo
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4 mr-1" />
                          Inactivo
                        </>
                      )}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
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
                      
                      <button
                        onClick={() => handleDeletePriest(priest.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
};

export default PriestsManagement;