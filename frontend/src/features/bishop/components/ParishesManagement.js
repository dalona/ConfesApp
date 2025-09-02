import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Church, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  Mail,
  Search,
  Filter,
  Users,
  Calendar,
  Globe
} from 'lucide-react';

const ParishesManagement = () => {
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParish, setSelectedParish] = useState(null);

  useEffect(() => {
    fetchParishes();
  }, []);

  const fetchParishes = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockParishes = [
        {
          id: '1',
          name: 'San Miguel Arcángel',
          address: 'Calle Mayor 123',
          city: 'Madrid',
          phone: '+34 91 123 4567',
          email: 'sanmiguel@diocesis.es',
          website: 'www.sanmiguel.es',
          isActive: true,
          priestsCount: 3,
          activeBands: 5,
          foundedDate: '1850-01-01',
          description: 'Parroquia histórica en el centro de Madrid'
        },
        {
          id: '2',
          name: 'Santa María',
          address: 'Plaza Central 45',
          city: 'Madrid',
          phone: '+34 91 765 4321',
          email: 'santamaria@diocesis.es',
          website: 'www.santamaria.es',
          isActive: true,
          priestsCount: 2,
          activeBands: 3,
          foundedDate: '1920-05-15',
          description: 'Parroquia moderna con enfoque en la juventud'
        }
      ];

      setParishes(mockParishes);
    } catch (error) {
      console.error('Error fetching parishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditParish = (parish) => {
    setSelectedParish(parish);
    setShowEditModal(true);
  };

  const handleDeleteParish = async (parishId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta parroquia?')) {
      try {
        // API call to delete parish
        setParishes(parishes.filter(p => p.id !== parishId));
      } catch (error) {
        console.error('Error deleting parish:', error);
      }
    }
  };

  const filteredParishes = parishes.filter(parish =>
    parish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parish.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando parroquias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Gestión de Parroquias
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Administra las parroquias de tu diócesis
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Añadir Parroquia
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar parroquias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Parishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParishes.map((parish, index) => (
          <motion.div
            key={parish.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Parish Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-bold mb-1">{parish.name}</h3>
                  <div className="flex items-center text-blue-100">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{parish.city}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Church className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Parish Content */}
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{parish.priestsCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sacerdotes</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{parish.activeBands}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Franjas Activas</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {parish.address}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {parish.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {parish.email}
                </div>
                {parish.website && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                    {parish.website}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {parish.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  parish.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {parish.isActive ? 'Activa' : 'Inactiva'}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditParish(parish)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteParish(parish.id)}
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

      {filteredParishes.length === 0 && (
        <div className="text-center py-12">
          <Church className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            No se encontraron parroquias
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Ajusta los filtros de búsqueda o añade una nueva parroquia.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParishesManagement;