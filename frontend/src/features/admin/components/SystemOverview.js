import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Church, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Server,
  Wifi,
  HardDrive
} from 'lucide-react';

const SystemOverview = ({ systemStats, onRefresh }) => {
  const [systemHealth, setSystemHealth] = useState({
    database: { status: 'healthy', responseTime: 45, uptime: '99.8%' },
    api: { status: 'healthy', responseTime: 120, uptime: '99.9%' },
    frontend: { status: 'healthy', responseTime: 80, uptime: '100%' },
    storage: { status: 'warning', usage: 78, available: '450GB' }
  });

  const [globalTrends, setGlobalTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      // Mock data - replace with actual API calls
      setGlobalTrends([
        { period: 'Enero', confessions: 12450, users: 1180, growth: 8.5 },
        { period: 'Febrero', confessions: 13200, users: 1201, growth: 6.0 },
        { period: 'Marzo', confessions: 14100, users: 1220, growth: 6.8 },
        { period: 'Abril', confessions: 13800, users: 1235, growth: -2.1 },
        { period: 'Mayo', confessions: 15200, users: 1247, growth: 10.1 },
        { period: 'Junio', confessions: 15634, users: 1267, growth: 2.9 }
      ]);

      setRecentActivity([
        {
          id: 1,
          type: 'diocese_created',
          message: 'Nueva diócesis registrada: Archidiócesis de Barcelona',
          timestamp: '2024-06-15T10:30:00Z',
          severity: 'info'
        },
        {
          id: 2,
          type: 'user_milestone',
          message: 'Alcanzado hito de 1,250 usuarios registrados',
          timestamp: '2024-06-15T09:15:00Z',
          severity: 'success'
        },
        {
          id: 3,
          type: 'system_alert',
          message: 'Uso de almacenamiento alcanzó 75%',
          timestamp: '2024-06-15T08:45:00Z',
          severity: 'warning'
        },
        {
          id: 4,
          type: 'confession_peak',
          message: 'Record diario: 847 confesiones programadas',
          timestamp: '2024-06-14T20:00:00Z',
          severity: 'success'
        }
      ]);
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'text-green-300 bg-green-500/10';
      case 'warning':
        return 'text-yellow-300 bg-yellow-500/10';
      case 'error':
        return 'text-red-300 bg-red-500/10';
      default:
        return 'text-blue-300 bg-blue-500/10';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* System Health Grid */}
      <div>
        <h2 className="text-2xl font-bold text-yellow-100 mb-6 flex items-center">
          <Server className="w-6 h-6 mr-3 text-yellow-400" />
          Estado del Sistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Database Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${getStatusColor(systemHealth.database.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Database className="w-6 h-6 mr-2" />
                <span className="font-semibold text-white">Base de Datos</span>
              </div>
              {systemHealth.database.status === 'healthy' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Tiempo de respuesta:</span>
                <span className="text-white font-medium">{systemHealth.database.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Uptime:</span>
                <span className="text-white font-medium">{systemHealth.database.uptime}</span>
              </div>
            </div>
          </motion.div>

          {/* API Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-xl border ${getStatusColor(systemHealth.api.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Wifi className="w-6 h-6 mr-2" />
                <span className="font-semibold text-white">API Backend</span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Tiempo de respuesta:</span>
                <span className="text-white font-medium">{systemHealth.api.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Uptime:</span>
                <span className="text-white font-medium">{systemHealth.api.uptime}</span>
              </div>
            </div>
          </motion.div>

          {/* Frontend Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-xl border ${getStatusColor(systemHealth.frontend.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                <span className="font-semibold text-white">Frontend</span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Tiempo de carga:</span>
                <span className="text-white font-medium">{systemHealth.frontend.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Uptime:</span>
                <span className="text-white font-medium">{systemHealth.frontend.uptime}</span>
              </div>
            </div>
          </motion.div>

          {/* Storage Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-xl border ${getStatusColor(systemHealth.storage.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <HardDrive className="w-6 h-6 mr-2" />
                <span className="font-semibold text-white">Almacenamiento</span>
              </div>
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Uso:</span>
                <span className="text-white font-medium">{systemHealth.storage.usage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Disponible:</span>
                <span className="text-white font-medium">{systemHealth.storage.available}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global Trends */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Performance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-yellow-100 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
            Tendencias Globales
          </h3>
          
          <div className="space-y-4">
            {globalTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex-1">
                  <span className="text-white font-medium">{trend.period}</span>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-300">
                      <Activity className="w-4 h-4 mr-1" />
                      {trend.confessions.toLocaleString()} confesiones
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Users className="w-4 h-4 mr-1" />
                      {trend.users.toLocaleString()} usuarios
                    </div>
                  </div>
                </div>
                <div className={`flex items-center ${trend.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trend.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="font-semibold">{Math.abs(trend.growth)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-yellow-100 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" />
            Actividad Reciente
          </h3>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(activity.severity)}`}>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{activity.message}</p>
                  <span className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemOverview;