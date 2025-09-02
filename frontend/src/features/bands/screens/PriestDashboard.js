import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cross, LogOut, Moon, Sun, Calendar, List, Plus, Trash2, History, FileText, Menu, Church } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../store/ThemeProvider';
import { useBands } from '../hooks/useBands';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import BandStats from '../components/BandStats';
import BandsList from '../components/BandsList';
import WeeklyCalendar from '../../calendar/components/WeeklyCalendar';
import BandForm from '../components/BandForm';

const PriestDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { bands, loading, createBand, updateBand, deleteBand, refreshBands } = useBands();
  
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedBand, setSelectedBand] = useState(null);
  const [showBandForm, setShowBandForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bandToDelete, setBandToDelete] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleCreateBand = (date) => {
    setSelectedBand({
      startTime: date || new Date(),
      endTime: new Date((date || new Date()).getTime() + 60 * 60 * 1000), // +1 hour
      location: 'Confesionario Principal',
      notes: '',
      maxCapacity: 5,
      isRecurrent: false,
      recurrenceType: 'weekly',
      recurrenceDays: [],
      recurrenceEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
    });
    setShowBandForm(true);
  };

  const handleEditBand = (band) => {
    setSelectedBand({
      ...band,
      startTime: new Date(band.startTime),
      endTime: new Date(band.endTime),
      recurrenceEndDate: band.recurrenceEndDate ? new Date(band.recurrenceEndDate) : null,
      recurrenceDays: band.recurrenceDays ? JSON.parse(band.recurrenceDays) : []
    });
    setShowBandForm(true);
  };

  const handleSaveBand = async (bandData) => {
    try {
      if (selectedBand?.id) {
        await updateBand(selectedBand.id, bandData);
        alert('Franja actualizada exitosamente');
      } else {
        await createBand(bandData);
        alert('Franja creada exitosamente');
      }
      setShowBandForm(false);
      setSelectedBand(null);
      refreshBands();
    } catch (error) {
      console.error('Error saving band:', error);
      alert(error.response?.data?.message || 'Error al guardar la franja');
    }
  };

  const handleDeleteBand = async (bandId) => {
    setBandToDelete(bandId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBand = async () => {
    if (bandToDelete) {
      try {
        await deleteBand(bandToDelete);
        alert('Franja eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting band:', error);
        alert(error.response?.data?.message || 'Error al eliminar la franja');
      }
    }
    setShowDeleteConfirm(false);
    setBandToDelete(null);
  };

  const tabs = [
    { key: 'calendar', label: 'Vista Calendario', icon: Calendar },
    { key: 'list', label: 'Vista Lista', icon: List }
  ];

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
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Panel Sacerdotal</h1>
              <p className="text-gray-600 dark:text-gray-300">Bienvenido, Padre {user?.firstName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                title="Menú de navegación"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">Navegación Rápida</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/dashboard/parish');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center border-b border-gray-100 dark:border-gray-700"
                    >
                      <Church className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Panel Parroquial</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Gestión completa</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/confession/history');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <History className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Historial de Confesiones</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        alert('Próximamente: Lista de solicitudes pendientes');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <FileText className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Solicitudes Pendientes</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
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

        {/* Stats */}
        <BandStats bands={bands} />

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900 overflow-hidden">
          {/* Header with Tabs */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Franjas de Confesión</h2>
                <div className="flex space-x-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center px-4 py-2 rounded-xl transition-all ${
                        activeTab === tab.key
                          ? 'bg-white/20 text-white'
                          : 'text-purple-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => handleCreateBand()}
                className="flex items-center px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Franja
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'calendar' && (
              <WeeklyCalendar
                bands={bands}
                onDateClick={handleCreateBand}
                onBandClick={handleEditBand}
              />
            )}
            
            {activeTab === 'list' && (
              <BandsList
                bands={bands}
                onEdit={handleEditBand}
                onDelete={handleDeleteBand}
              />
            )}
          </div>
        </div>

        {/* Band Form Modal */}
        {showBandForm && (
          <BandForm
            band={selectedBand}
            onSave={handleSaveBand}
            onCancel={() => {
              setShowBandForm(false);
              setSelectedBand(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Eliminar Franja
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  ¿Estás seguro de que quieres eliminar esta franja? Esta acción no se puede deshacer.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setBandToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDeleteBand}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriestDashboard;