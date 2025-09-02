import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Church, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Crown,
  UserCheck,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

// Import components
import ParishOverview from '../components/ParishOverview';
import ParishPriests from '../components/ParishPriests';
import ParishSpaces from '../components/ParishSpaces';
import ParishCalendar from '../components/ParishCalendar';
import ParishSettings from '../components/ParishSettings';

const ParishDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [parishStats, setParishStats] = useState({
    totalPriests: 0,
    totalSpaces: 0,
    totalConfessions: 0,
    activeBands: 0,
    utilizationRate: 0
  });
  const [parishInfo, setParishInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParishData();
  }, []);

  const fetchParishData = async () => {
    setLoading(true);
    try {
      // This would be replaced with actual API calls
      // const parishData = await parishService.getParishDetails();
      // const stats = await parishService.getParishStats();
      
      // Mock data for now - replace with actual API calls
      setParishInfo({
        id: user?.currentParishId || '1',
        name: 'San Miguel Arcángel',
        address: 'Calle Mayor 123, Madrid',
        phone: '+34 91 123 4567',
        email: 'sanmiguel@diocesis.es',
        established: '1850-01-01'
      });

      setParishStats({
        totalPriests: 3,
        totalSpaces: 4,
        totalConfessions: 84,
        activeBands: 12,
        utilizationRate: 78
      });
    } catch (error) {
      console.error('Error fetching parish data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine user's role display
  const getRoleDisplay = () => {
    if (user?.role === 'priest') {
      return {
        title: 'Panel Parroquial',
        subtitle: `Bienvenido, Padre ${user?.firstName}`,
        icon: Crown,
        color: 'purple'
      };
    } else {
      return {
        title: 'Panel de Coordinación',
        subtitle: `Bienvenido, ${user?.firstName}`,
        icon: UserCheck,
        color: 'blue'
      };
    }
  };

  const roleDisplay = getRoleDisplay();

  const tabs = [
    {
      id: 'overview',
      label: 'Resumen',
      icon: BarChart3,
      component: ParishOverview
    },
    {
      id: 'priests',
      label: 'Sacerdotes',
      icon: Users,
      component: ParishPriests
    },
    {
      id: 'spaces',
      label: 'Confesionarios',
      icon: Church,
      component: ParishSpaces
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: Calendar,
      component: ParishCalendar
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      component: ParishSettings
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-yellow-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Cargando información parroquial...</p>
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
            <div className={`w-12 h-12 bg-gradient-to-r from-${roleDisplay.color}-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg`}>
              <roleDisplay.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {roleDisplay.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {roleDisplay.subtitle}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
              <Church className="w-4 h-4 mr-2" />
              <span className="font-semibold">{parishInfo?.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{parishInfo?.address}</span>
            </div>
          </div>
        </motion.div>

        {/* Parish Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sacerdotes</p>
                <p className="text-3xl font-bold text-purple-600">{parishStats.totalPriests}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Confesionarios</p>
                <p className="text-3xl font-bold text-blue-600">{parishStats.totalSpaces}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Church className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Confesiones (Mes)</p>
                <p className="text-3xl font-bold text-green-600">{parishStats.totalConfessions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-yellow-100 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Franjas Activas</p>
                <p className="text-3xl font-bold text-yellow-600">{parishStats.activeBands}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Utilización</p>
                <p className="text-3xl font-bold text-indigo-600">{parishStats.utilizationRate}%</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 mb-8"
        >
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r from-${roleDisplay.color}-600 to-indigo-600 text-white shadow-lg`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {tab.label}
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
        >
          {ActiveComponent && (
            <ActiveComponent 
              parishInfo={parishInfo} 
              parishStats={parishStats}
              userRole={user?.role}
              onRefresh={fetchParishData}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ParishDashboard;