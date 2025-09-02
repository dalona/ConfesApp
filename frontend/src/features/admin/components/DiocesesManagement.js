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
  Crown,
  Building,
  Calendar,
  BarChart3
} from 'lucide-react';

const DiocesesManagement = ({ systemStats, onRefresh }) => {
  const [dioceses, setDioceses] = useState([]);
  const [bishops, setBishops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDiocese, setSelectedDiocese] = useState(null);

  useEffect(() => {
    fetchDiocesesData();
  }, []);

  const fetchDiocesesData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockDioceses = [
        {
          id: '1',
          name: 'Archidiócesis de Madrid',
          region: 'Comunidad de Madrid',
          country: 'España',
          established: '1885-03-07',
          bishopId: '1',
          bishop: {
            firstName: 'Carlos',
            lastName: 'Osoro Sierra',
            title: 'Cardenal Arzobispo'
          },
          address: 'Calle de la Pasa, 3, 28005 Madrid',
          phone: '+34 91 454 64 00',
          email: 'secretaria@archimadrid.es',
          website: 'https://www.archimadrid.es',
          parishesCount: 287,
          priestsCount: 425,
          faithfulCount: 1847293,
          isActive: true
        },
        {
          id: '2',
          name: 'Archidiócesis de Barcelona',
          region: 'Cataluña',
          country: 'España',
          established: '1969-05-25',
          bishopId: '2',
          bishop: {
            firstName: 'Juan José',
            lastName: 'Omella Omella',
            title: 'Cardenal Arzobispo'
          },
          address: 'Bisbe Laguarda, 6, 08001 Barcelona',
          phone: '+34 93 270 10 00',
          email: 'info@arqbcn.cat',
          website: 'https://www.arqbcn.cat',
          parishesCount: 203,
          priestsCount: 387,
          faithfulCount: 1234567,
          isActive: true
        },
        {
          id: '3',
          name: 'Diócesis de Sevilla',
          region: 'Andalucía',
          country: 'España',
          established: '1248-01-01',
          bishopId: '3',
          bishop: {
            firstName: 'José Ángel',
            lastName: 'Saiz Meneses',
            title: 'Arzobispo'
          },
          address: 'Plaza Virgen de los Reyes, s/n, 41004 Sevilla',
          phone: '+34 954 21 44 80',
          email: 'arzobispado@archisevilla.org',
          website: 'https://www.archisevilla.org',
          parishesCount: 156,
          priestsCount: 298,
          faithfulCount: 876543,
          isActive: true
        }
      ];

      setDioceses(mockDioceses);
    } catch (error) {
      console.error('Error fetching dioceses data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDiocese = (diocese) => {
    setSelectedDiocese(diocese);
    setShowEditModal(true);
  };

  const handleDeleteDiocese = async (dioceseId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta diócesis? Esta acción no se puede deshacer.')) {
      try {
        // API call to delete diocese
        setDioceses(dioceses.filter(d => d.id !== dioceseId));
        onRefresh?.();
      } catch (error) {
        console.error('Error deleting diocese:', error);
      }
    }
  };

  const handleToggleStatus = async (dioceseId, currentStatus) => {
    try {
      // API call to toggle status
      setDioceses(dioceses.map(d => 
        d.id === dioceseId ? { ...d, isActive: !currentStatus } : d
      ));
    } catch (error) {
      console.error('Error toggling diocese status:', error);
    }
  };

  const filteredDioceses = dioceses.filter(diocese => {
    const matchesSearch = diocese.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diocese.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diocese.bishop.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diocese.bishop.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = filterRegion === 'all' || diocese.region === filterRegion;
    
    return matchesSearch && matchesRegion;
  });

  const regions = [...new Set(dioceses.map(d => d.region))];

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-200">Cargando diócesis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-yellow-100 mb-2">
            Gestión de Diócesis
          </h2>
          <p className="text-yellow-200">
            Administra las diócesis y sus obispos en todo el sistema
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Diócesis
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar diócesis, región o obispo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>
          </div>
          
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          >
            <option value="all">Todas las regiones</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dioceses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDioceses.map((diocese, index) => (
          <motion.div
            key={diocese.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-white/20 hover:border-yellow-500/30"
          >
            {/* Diocese Header */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-600/20 p-6 border-b border-white/10">
              <div className="flex items-center justify-between text-white">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{diocese.name}</h3>
                  <div className="flex items-center text-yellow-200 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{diocese.region}, {diocese.country}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center">
                  <Church className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
            </div>

            {/* Diocese Content */}
            <div className="p-6">
              {/* Bishop Info */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="font-semibold text-yellow-100">{diocese.bishop.title}</span>
                </div>
                <p className="text-white font-medium pl-6">
                  {diocese.bishop.firstName} {diocese.bishop.lastName}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Church className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-lg font-bold text-white">{diocese.parishesCount}</p>
                  <p className="text-xs text-gray-400">Parroquias</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-lg font-bold text-white">{diocese.priestsCount}</p>
                  <p className="text-xs text-gray-400">Sacerdotes</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-lg font-bold text-white">{(diocese.faithfulCount / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-400">Fieles</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-300">
                  <Phone className="w-3 h-3 mr-2" />
                  {diocese.phone}
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-3 h-3 mr-2" />
                  {diocese.email}
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-3 h-3 mr-2" />
                  Fundada: {new Date(diocese.established).getFullYear()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  diocese.isActive
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {diocese.isActive ? 'Activa' : 'Inactiva'}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(diocese.website, '_blank')}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Ver sitio web"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEditDiocese(diocese)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteDiocese(diocese.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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

      {filteredDioceses.length === 0 && (
        <div className="text-center py-12">
          <Church className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-yellow-200 mb-2">
            No se encontraron diócesis
          </p>
          <p className="text-gray-400">
            Ajusta los filtros de búsqueda o añade una nueva diócesis.
          </p>
        </div>
      )}
    </div>
  );
};

export default DiocesesManagement;