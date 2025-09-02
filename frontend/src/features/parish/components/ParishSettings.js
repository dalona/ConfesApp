import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Clock, 
  Bell, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  Shield,
  AlertCircle
} from 'lucide-react';

const ParishSettings = ({ parishInfo, userRole, onRefresh }) => {
  const [settings, setSettings] = useState({
    // General Settings
    parishName: '',
    parishAddress: '',
    parishPhone: '',
    parishEmail: '',
    parishWebsite: '',
    
    // Schedule Settings
    defaultSchedule: {
      monday: { enabled: true, start: '09:00', end: '18:00' },
      tuesday: { enabled: true, start: '09:00', end: '18:00' },
      wednesday: { enabled: true, start: '09:00', end: '18:00' },
      thursday: { enabled: true, start: '09:00', end: '18:00' },
      friday: { enabled: true, start: '09:00', end: '18:00' },
      saturday: { enabled: true, start: '10:00', end: '12:00' },
      sunday: { enabled: true, start: '16:00', end: '18:00' }
    },
    
    // Booking Settings
    maxAdvanceDays: 30,
    minCancelHours: 2,
    defaultSlotDuration: 30,
    maxSlotsPerPriest: 10,
    allowWalkIns: true,
    requireConfirmation: true,
    
    // Notification Settings
    emailNotifications: {
      newBooking: true,
      cancellation: true,
      reminder24h: true,
      reminder2h: true,
      priestAssignment: true
    },
    
    smsNotifications: {
      enabled: false,
      reminder24h: false,
      reminder2h: false
    },
    
    // Messages
    welcomeMessage: '',
    cancellationMessage: '',
    confirmationMessage: '',
    
    // Advanced Settings
    multiLanguage: {
      enabled: false,
      languages: ['es', 'en']
    },
    
    anonymousConfessions: true,
    recordKeeping: {
      enabled: true,
      retentionDays: 365
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchParishSettings();
  }, []);

  const fetchParishSettings = async () => {
    setLoading(true);
    try {
      // Initialize with parish info
      setSettings(prev => ({
        ...prev,
        parishName: parishInfo?.name || '',
        parishAddress: parishInfo?.address || '',
        parishPhone: parishInfo?.phone || '',
        parishEmail: parishInfo?.email || '',
        parishWebsite: parishInfo?.website || '',
        welcomeMessage: `Bienvenido a las confesiones de ${parishInfo?.name}. Nos alegra poder acompañarte en este sacramento.`,
        confirmationMessage: 'Tu cita de confesión ha sido confirmada. Te esperamos con alegría.',
        cancellationMessage: 'Tu cita ha sido cancelada. Puedes reagendar cuando desees.'
      }));
    } catch (error) {
      console.error('Error fetching parish settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      alert('Configuración guardada exitosamente');
      onRefresh?.();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateSchedule = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      defaultSchedule: {
        ...prev.defaultSchedule,
        [day]: {
          ...prev.defaultSchedule[day],
          [field]: value
        }
      }
    }));
  };

  const updateNotificationSetting = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'schedule', label: 'Horarios', icon: Clock },
    { id: 'booking', label: 'Reservas', icon: Calendar },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'messages', label: 'Mensajes', icon: Mail },
    { id: 'advanced', label: 'Avanzado', icon: Shield }
  ];

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes', 
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Configuración Parroquial
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Personaliza la configuración de {parishInfo?.name}
          </p>
        </div>
        
        <button
          onClick={handleSaveSettings}
          disabled={saving || userRole !== 'priest'}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Parroquia
                  </label>
                  <input
                    type="text"
                    value={settings.parishName}
                    onChange={(e) => setSettings({...settings, parishName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={userRole !== 'priest'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={settings.parishPhone}
                    onChange={(e) => setSettings({...settings, parishPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={userRole !== 'priest'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.parishEmail}
                    onChange={(e) => setSettings({...settings, parishEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={userRole !== 'priest'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={settings.parishWebsite}
                    onChange={(e) => setSettings({...settings, parishWebsite: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={userRole !== 'priest'}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dirección Completa
                </label>
                <textarea
                  value={settings.parishAddress}
                  onChange={(e) => setSettings({...settings, parishAddress: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={userRole !== 'priest'}
                />
              </div>
            </motion.div>
          )}

          {/* Schedule Settings */}
          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <p className="text-blue-800 dark:text-blue-200">
                    Define los horarios por defecto para las confesiones en cada día de la semana.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(settings.defaultSchedule).map(([day, schedule]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-24">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {dayNames[day]}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) => updateSchedule(day, 'enabled', e.target.checked)}
                        className="h-4 w-4 text-purple-600 rounded"
                        disabled={userRole !== 'priest'}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Habilitado</span>
                    </div>
                    
                    {schedule.enabled && (
                      <>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">De:</span>
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => updateSchedule(day, 'start', e.target.value)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            disabled={userRole !== 'priest'}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">A:</span>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => updateSchedule(day, 'end', e.target.value)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            disabled={userRole !== 'priest'}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Other tabs would continue here... */}
          {activeTab !== 'general' && activeTab !== 'schedule' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                Configuración de {tabs.find(t => t.id === activeTab)?.label}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Esta sección estará disponible próximamente.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParishSettings;