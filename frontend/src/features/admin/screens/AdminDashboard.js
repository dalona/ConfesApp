import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Church, 
  BarChart3, 
  Settings,
  Crown,
  Database,
  Globe,
  Activity,
  TrendingUp,
  AlertTriangle,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

// Import components
import SystemOverview from '../components/SystemOverview';
import DiocesesManagement from '../components/DiocesesManagement';
import UsersManagement from '../components/UsersManagement';
import SystemConfiguration from '../components/SystemConfiguration';
import ExecutiveReports from '../components/ExecutiveReports';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalDioceses: 0,
    totalParishes: 0,
    totalConfessions: 0,
    activeUsers: 0,
    systemHealth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    setLoading(true);
    try {
      // This would be replaced with actual API calls
      // const stats = await adminService.getSystemStats();
      
      // Mock data for now - replace with actual API calls
      setSystemStats({
        totalUsers: 1247,
        totalDioceses: 23,
        totalParishes: 187,
        totalConfessions: 15634,
        activeUsers: 892,
        systemHealth: 97.8
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Vista Global',
      icon: Globe,
      component: SystemOverview,
      description: 'Estadísticas generales del sistema'
    },
    {
      id: 'dioceses',
      label: 'Diócesis',
      icon: Church,
      component: DiocesesManagement,
      description: 'Gestión de diócesis y obispos'
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      component: UsersManagement,
      description: 'Administración global de usuarios'
    },
    {
      id: 'configuration',
      label: 'Configuración',
      icon: Settings,
      component: SystemConfiguration,
      description: 'Configuración del sistema'
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: FileText,
      component: ExecutiveReports,
      description: 'Reportes ejecutivos y analytics'
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-amber-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg text-yellow-100">Cargando Panel de Administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-amber-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mr-6 shadow-2xl border-4 border-yellow-400">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-yellow-100 mb-2">
                Panel de Administrador
              </h1>
              <p className="text-yellow-200 text-lg">
                Autoridad Suprema del Sistema • {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-300 text-sm font-semibold">
                  Sistema Operativo • {systemStats.systemHealth}% Health
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center text-yellow-100 mb-2">
                <Activity className="w-5 h-5 mr-2 text-yellow-400" />
                <span className="font-semibold">Estado del Sistema</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-yellow-200">Usuarios Activos:</span>
                  <p className="font-bold text-yellow-100">{systemStats.activeUsers}</p>
                </div>
                <div>
                  <span className="text-yellow-200">Confesiones Hoy:</span>
                  <p className="font-bold text-yellow-100">247</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-200">Total Usuarios</p>
                <p className="text-3xl font-bold text-yellow-100">{systemStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Diócesis</p>
                <p className="text-3xl font-bold text-blue-100">{systemStats.totalDioceses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Parroquias</p>
                <p className="text-3xl font-bold text-green-100">{systemStats.totalParishes}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                <Church className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Confesiones</p>
                <p className="text-3xl font-bold text-purple-100">{systemStats.totalConfessions.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-rose-600/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">Usuarios Activos</p>
                <p className="text-3xl font-bold text-red-100">{systemStats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-red-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-teal-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-200">Salud Sistema</p>
                <p className="text-3xl font-bold text-teal-100">{systemStats.systemHealth}%</p>
              </div>
              <div className="w-12 h-12 bg-teal-500/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-300" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl p-2 mb-8 border border-yellow-500/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg transform scale-105'
                      : 'text-yellow-200 hover:text-yellow-100 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/30'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-sm font-bold">{tab.label}</span>
                    <span className={`text-xs mt-1 ${
                      activeTab === tab.id ? 'text-black/70' : 'text-yellow-300'
                    }`}>
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Active Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-500/30 overflow-hidden"
        >
          {ActiveComponent && (
            <ActiveComponent 
              systemStats={systemStats} 
              onRefresh={fetchSystemStats}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;