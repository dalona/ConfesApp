import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  Crown,
  Church,
  Heart,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';

const UsersManagement = ({ systemStats, onRefresh }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockUsers = [
        {
          id: '1',
          firstName: 'Carlos',
          lastName: 'Osoro Sierra',
          email: 'cardenal.osoro@archimadrid.es',
          phone: '+34 91 454 64 01',
          role: 'bishop',
          isActive: true,
          lastLogin: '2024-06-15T08:30:00Z',
          createdAt: '2024-01-15T10:00:00Z',
          diocese: 'Archidiócesis de Madrid',
          parish: null,
          confessionsCount: 0
        },
        {
          id: '2',
          firstName: 'Juan',
          lastName: 'Pérez González',
          email: 'padre.juan@sanmiguel.es',
          phone: '+34 600 123 456',
          role: 'priest',
          isActive: true,
          lastLogin: '2024-06-15T09:15:00Z',
          createdAt: '2024-02-10T14:30:00Z',
          diocese: 'Archidiócesis de Madrid',
          parish: 'San Miguel Arcángel',
          confessionsCount: 145
        },
        {
          id: '3',
          firstName: 'María',
          lastName: 'García López',
          email: 'maria.garcia@gmail.com',
          phone: '+34 600 987 654',
          role: 'faithful',
          isActive: true,
          lastLogin: '2024-06-15T07:45:00Z',
          createdAt: '2024-03-05T16:20:00Z',
          diocese: 'Archidiócesis de Madrid',
          parish: 'San Miguel Arcángel',
          confessionsCount: 12
        },
        {
          id: '4',
          firstName: 'Ana',
          lastName: 'Martínez Ruiz',
          email: 'ana.martinez@sanmiguel.es',
          phone: '+34 600 555 777',
          role: 'parish_staff',
          isActive: true,
          lastLogin: '2024-06-14T18:30:00Z',
          createdAt: '2024-01-20T11:45:00Z',
          diocese: 'Archidiócesis de Madrid',
          parish: 'San Miguel Arcángel',
          confessionsCount: 0
        },
        {
          id: '5',
          firstName: 'Sistema',
          lastName: 'Administrador',
          email: 'admin@confesapp.com',
          phone: '+34 900 000 000',
          role: 'admin',
          isActive: true,
          lastLogin: '2024-06-15T10:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          diocese: null,
          parish: null,
          confessionsCount: 0
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        // API call to delete user
        setUsers(users.filter(u => u.id !== userId));
        onRefresh?.();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // API call to toggle status
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isActive: !currentStatus } : u
      ));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-red-400" />;
      case 'bishop':
        return <Crown className="w-5 h-5 text-purple-400" />;
      case 'priest':
        return <Church className="w-5 h-5 text-blue-400" />;
      case 'parish_staff':
        return <Settings className="w-5 h-5 text-green-400" />;
      case 'faithful':
        return <Heart className="w-5 h-5 text-pink-400" />;
      default:
        return <Users className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'bishop': return 'Obispo';
      case 'priest': return 'Sacerdote';
      case 'parish_staff': return 'Personal Parroquial';
      case 'faithful': return 'Fiel';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'bishop':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'priest':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'parish_staff':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'faithful':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatLastLogin = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-200">Cargando usuarios...</p>
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
            Gestión Global de Usuarios
          </h2>
          <p className="text-yellow-200">
            Administra todos los usuarios del sistema
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Usuario
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
                placeholder="Buscar usuarios por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="bishop">Obispos</option>
            <option value="priest">Sacerdotes</option>
            <option value="parish_staff">Personal Parroquial</option>
            <option value="faithful">Fieles</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/30 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-100">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-100">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-100">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-100">
                  Ubicación
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-100">
                  Actividad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-100">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-100">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-full flex items-center justify-center mr-3">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-400">
                          Desde {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      {user.diocese && (
                        <div className="flex items-center text-gray-300">
                          <Crown className="w-3 h-3 mr-2" />
                          {user.diocese}
                        </div>
                      )}
                      {user.parish && (
                        <div className="flex items-center text-gray-300">
                          <Church className="w-3 h-3 mr-2" />
                          {user.parish}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Activity className="w-3 h-3 mr-2" />
                        {formatLastLogin(user.lastLogin)}
                      </div>
                      {user.confessionsCount > 0 && (
                        <div className="text-yellow-300">
                          {user.confessionsCount} confesiones
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      user.isActive
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user.isActive ? (
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
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                            : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                        }`}
                        title={user.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-yellow-200 mb-2">
              No se encontraron usuarios
            </p>
            <p className="text-gray-400">
              Ajusta los filtros de búsqueda o añade un nuevo usuario.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;