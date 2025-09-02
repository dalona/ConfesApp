import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cross, User, LogOut, Moon, Sun, Calendar, Trash2, History, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../store/ThemeProvider';
import { confessionsService } from '../services/confessionsService';
import { bandsService } from '../../bands/services/bandsService';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const FaithfulDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [citasDisponibles, setCitasDisponibles] = useState([]);
  const [misConfesiones, setMisConfesiones] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch available slots and bands
      const [confessionSlots, availableBands, myConfessions] = await Promise.all([
        confessionsService.getConfessionSlots().catch(() => []),
        bandsService.getAvailableBands().catch(() => []),
        confessionsService.getMyConfessions().catch(() => [])
      ]);

      // Combine slots and bands
      const allAvailable = [
        ...confessionSlots.map(slot => ({ ...slot, type: 'slot' })),
        ...availableBands.map(band => ({ ...band, type: 'band' }))
      ];

      setCitasDisponibles(allAvailable);
      setMisConfesiones(myConfessions.filter(c => c && (c.confessionSlot || c.confessionBand || c.scheduledTime)));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfessionInfo = (confession) => {
    if (confession.confessionSlot) {
      return {
        startTime: new Date(confession.confessionSlot.startTime),
        endTime: new Date(confession.confessionSlot.endTime),
        location: confession.confessionSlot.location,
        priest: confession.confessionSlot.priest?.firstName || 'Sacerdote'
      };
    } else if (confession.confessionBand) {
      return {
        startTime: new Date(confession.confessionBand.startTime),
        endTime: new Date(confession.confessionBand.endTime),
        location: confession.confessionBand.location,
        priest: confession.confessionBand.priest?.firstName || 'Sacerdote'
      };
    } else {
      const scheduledTime = confession.scheduledTime ? new Date(confession.scheduledTime) : new Date();
      return {
        startTime: scheduledTime,
        endTime: new Date(scheduledTime.getTime() + 60*60*1000),
        location: 'No especificado',
        priest: 'Sacerdote'
      };
    }
  };

  const getCitaInfo = (cita) => {
    if (!cita) {
      return {
        startTime: new Date(),
        endTime: new Date(),
        location: 'No especificado'
      };
    }
    
    return {
      startTime: cita.startTime ? new Date(cita.startTime) : new Date(),
      endTime: cita.endTime ? new Date(cita.endTime) : new Date(),
      location: cita.location || 'No especificado'
    };
  };

  const canCancelConfession = (confession) => {
    if (confession.status !== 'booked') return false;
    
    let confessionTime;
    if (confession.confessionBand) {
      confessionTime = new Date(confession.confessionBand.startTime);
    } else if (confession.confessionSlot) {
      confessionTime = new Date(confession.confessionSlot.startTime);
    } else {
      confessionTime = new Date(confession.scheduledTime);
    }
    
    const now = new Date();
    const timeDiff = confessionTime.getTime() - now.getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    return timeDiff > twoHoursInMs;
  };

  const cancelConfession = async (confessionId) => {
    try {
      const confession = misConfesiones.find(c => c.id === confessionId);
      
      if (confession?.confessionBandId) {
        await bandsService.cancelBooking(confessionId);
      } else {
        await confessionsService.cancelConfession(confessionId);
      }
      
      fetchData();
      alert('Cita cancelada exitosamente');
    } catch (error) {
      console.error('Error canceling confession:', error);
      alert(error.response?.data?.message || 'Error al cancelar la cita');
    }
  };

  const bookConfession = async (citaId) => {
    try {
      const cita = citasDisponibles.find(c => c.id === citaId);
      
      if (cita) {
        if (cita.maxCapacity !== undefined) {
          // This is a confession band
          await bandsService.bookBand({ bandId: citaId });
        } else {
          // This is a confession slot (legacy)
          await confessionsService.createConfession({ confessionSlotId: citaId });
        }
      }
      
      fetchData();
      alert('Reserva realizada exitosamente');
    } catch (error) {
      console.error('Error booking confession:', error);
      alert(error.response?.data?.message || 'Error al realizar la reserva');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Cross className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">ConfesApp</h1>
              <p className="text-gray-600 dark:text-gray-300">Bienvenido, {user?.firstName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </button>
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-white mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Citas Disponibles</h2>
                  <p className="text-purple-100">Reserva tu confesión</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {citasDisponibles.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No hay citas disponibles en este momento
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {citasDisponibles.slice(0, 5).map((cita, index) => {
                    const citaInfo = getCitaInfo(cita);
                    return (
                      <motion.div
                        key={cita.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-4">
                              <Cross className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-purple-900 dark:text-purple-100 text-lg">
                                {citaInfo.startTime.toLocaleDateString('es-ES', { 
                                  weekday: 'long', 
                                  day: 'numeric', 
                                  month: 'long' 
                                })}
                              </div>
                              <div className="text-gray-600 dark:text-gray-300">
                                🕐 {citaInfo.startTime.toLocaleTimeString('es-ES', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {citaInfo.endTime.toLocaleTimeString('es-ES', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} • ⛪ {citaInfo.location} • 👤 {cita.priest?.firstName || 'Sacerdote'}
                              </div>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => bookConfession(cita.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                          >
                            Reservar
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* My Confessions */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-white mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Mis Confesiones</h2>
                  <p className="text-purple-100">Historial de citas reservadas</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {misConfesiones.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No tienes confesiones reservadas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {misConfesiones.filter(confesion => confesion && (confesion.confessionSlot || confesion.confessionBand || confesion.scheduledTime)).map((confesion, index) => {
                    const confessionInfo = getConfessionInfo(confesion);
                    return (
                      <motion.div
                        key={confesion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                              confesion.status === 'booked' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                              confesion.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                              confesion.status === 'cancelled' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              'bg-gradient-to-r from-gray-500 to-gray-600'
                            }`}>
                              <Cross className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-purple-900 dark:text-purple-100 text-lg">
                                {confessionInfo.startTime.toLocaleDateString('es-ES', { 
                                  weekday: 'long', 
                                  day: 'numeric', 
                                  month: 'long' 
                                })}
                              </div>
                              <div className="text-gray-600 dark:text-gray-300">
                                🕐 {confessionInfo.startTime.toLocaleTimeString('es-ES', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {confessionInfo.endTime.toLocaleTimeString('es-ES', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} • ⛪ {confessionInfo.location} • 👤 {confessionInfo.priest}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              confesion.status === 'booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              confesion.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              confesion.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {confesion.status === 'booked' ? 'Reservada' :
                               confesion.status === 'completed' ? 'Completada' :
                               confesion.status === 'cancelled' ? 'Cancelada' : confesion.status}
                            </span>
                            
                            {confesion.status === 'booked' && canCancelConfession(confesion) && (
                              <button
                                onClick={() => cancelConfession(confesion.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Cancelar cita"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaithfulDashboard;