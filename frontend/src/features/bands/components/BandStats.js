import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, BarChart3 } from 'lucide-react';

const BandStats = ({ bands }) => {
  const stats = {
    available: bands.filter(b => b.status === 'available').length,
    full: bands.filter(b => b.status === 'full').length,
    total: bands.length,
    totalBookings: bands.reduce((acc, b) => acc + (b.currentBookings || 0), 0)
  };

  const statsData = [
    {
      label: 'Disponibles',
      value: stats.available,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Llenas',
      value: stats.full,
      icon: Clock,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Reservas',
      value: stats.totalBookings,
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Total',
      value: stats.total,
      icon: BarChart3,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BandStats;