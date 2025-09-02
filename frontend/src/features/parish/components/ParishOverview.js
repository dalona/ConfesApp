import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Church, 
  Calendar, 
  Activity,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const ParishOverview = ({ parishInfo, parishStats, userRole }) => {
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [priestsActivity, setPriestsActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      // Mock data - replace with actual API calls
      setMonthlyTrends([
        { month: 'Enero', confessions: 65, target: 70 },
        { month: 'Febrero', confessions: 72, target: 70 },
        { month: 'Marzo', confessions: 88, target: 80 },
        { month: 'Abril', confessions: 75, target: 85 },
        { month: 'Mayo', confessions: 92, target: 85 },
        { month: 'Junio', confessions: 84, target: 90 }
      ]);

      setPriestsActivity([
        { name: 'Padre Juan Pérez', confessions: 28, utilization: 85, trend: 'up' },
        { name: 'Padre Carlos López', confessions: 31, utilization: 92, trend: 'up' },
        { name: 'Padre Miguel Torres', confessions: 25, utilization: 76, trend: 'down' }
      ]);

      setUpcomingEvents([
        { date: '2024-06-20', event: 'Confesiones Especiales - Corpus Christi', type: 'special' },
        { date: '2024-06-25', event: 'Retiro Espiritual', type: 'retreat' },
        { date: '2024-07-01', event: 'Cambio de Horarios Verano', type: 'schedule' }
      ]);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    }
  };

  const getGrowthRate = () => {
    if (monthlyTrends.length >= 2) {
      const current = monthlyTrends[monthlyTrends.length - 1].confessions;
      const previous = monthlyTrends[monthlyTrends.length - 2].confessions;
      return ((current - previous) / previous * 100).toFixed(1);
    }
    return 0;
  };

  const growthRate = getGrowthRate();

  return (
    <div className="space-y-6">
      {/* Parish Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Church className="w-6 h-6 mr-2 text-blue-600" />
          Información de la Parroquia
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{parishInfo?.address}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{parishInfo?.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{parishInfo?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fundada</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {parishInfo?.established ? new Date(parishInfo.established).getFullYear() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Tendencia Mensual
            </h3>
            <div className={`flex items-center ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-semibold">{growthRate}%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {monthlyTrends.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${(item.confessions / item.target) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 w-8">
                    {item.confessions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Priests Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Actividad de Sacerdotes
          </h3>
          
          <div className="space-y-4">
            {priestsActivity.map((priest, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{priest.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{priest.confessions} confesiones</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${priest.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{priest.utilization}%</span>
                  {priest.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-green-600" />
          Próximos Eventos
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  event.type === 'special' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  event.type === 'retreat' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {event.type === 'special' ? 'Especial' : 
                   event.type === 'retreat' ? 'Retiro' : 'Horario'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {event.event}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ParishOverview;