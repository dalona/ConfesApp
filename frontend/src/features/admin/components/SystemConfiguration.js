import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Database, 
  Mail, 
  Shield, 
  Globe,
  Clock,
  Bell,
  Key,
  AlertTriangle,
  CheckCircle,
  Server,
  FileText,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

const SystemConfiguration = ({ systemStats, onRefresh }) => {
  const [config, setConfig] = useState({
    // General Settings
    systemName: 'ConfesApp',
    systemVersion: '1.0.0',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultLanguage: 'es',
    
    // Database Settings
    databaseHost: 'localhost',
    databasePort: 27017,
    maxConnections: 100,
    backupFrequency: 'daily',
    retentionDays: 365,
    
    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailFromName: 'ConfesApp',
    emailFromAddress: 'noreply@confesapp.com',
    
    // Security Settings
    sessionTimeout: 24,
    passwordMinLength: 8,
    requireTwoFactor: false,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    
    // Notification Settings
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enablePushNotifications: true,
    reminderHours: [24, 2],
    
    // Advanced Settings
    logLevel: 'info',
    cacheTimeout: 3600,
    apiRateLimit: 1000,
    fileUploadMaxSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf']
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  const fetchSystemConfig = async () => {
    setLoading(true);
    try {
      // Mock loading config - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error fetching system config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      // API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Configuración guardada exitosamente');
      onRefresh?.();
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `confesapp-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result);
          setConfig({ ...config, ...importedConfig });
          alert('Configuración importada exitosamente');
        } catch (error) {
          alert('Error al importar la configuración: Archivo inválido');
        }
      };
      reader.readAsText(file);
    }
  };

  const sections = [
    {
      id: 'general',
      label: 'General',
      icon: Settings,
      description: 'Configuración básica del sistema'
    },
    {
      id: 'database',
      label: 'Base de Datos',
      icon: Database,
      description: 'Configuración de la base de datos'
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Configuración de correo electrónico'
    },
    {
      id: 'security',
      label: 'Seguridad',
      icon: Shield,
      description: 'Configuración de seguridad'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: Bell,
      description: 'Configuración de notificaciones'
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-200">Cargando configuración...</p>
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
            Configuración del Sistema
          </h2>
          <p className="text-yellow-200">
            Configura parámetros globales del sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="file"
            accept=".json"
            onChange={handleImportConfig}
            className="hidden"
            id="config-import"
          />
          <label
            htmlFor="config-import"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </label>
          
          <button
            onClick={handleExportConfig}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          
          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Configuration Tabs */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        {/* Tab Navigation */}
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === section.id
                      ? 'border-yellow-500 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <IconComponent className="w-4 h-4 mr-2" />
                    {section.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* General Settings */}
          {activeSection === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Nombre del Sistema
                  </label>
                  <input
                    type="text"
                    value={config.systemName}
                    onChange={(e) => setConfig({...config, systemName: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Versión
                  </label>
                  <input
                    type="text"
                    value={config.systemVersion}
                    readOnly
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Idioma por Defecto
                  </label>
                  <select
                    value={config.defaultLanguage}
                    onChange={(e) => setConfig({...config, defaultLanguage: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Modo Mantenimiento</h4>
                    <p className="text-sm text-gray-400">Deshabilita el acceso temporal al sistema</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.maintenanceMode}
                      onChange={(e) => setConfig({...config, maintenanceMode: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Permitir Registros</h4>
                    <p className="text-sm text-gray-400">Permite que nuevos usuarios se registren</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.allowRegistrations}
                      onChange={(e) => setConfig({...config, allowRegistrations: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Database Settings */}
          {activeSection === 'database' && (
            <motion.div
              key="database"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-blue-400 mr-2" />
                  <p className="text-blue-200">
                    Estos cambios requieren reinicio del sistema para tomar efecto.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Host de Base de Datos
                  </label>
                  <input
                    type="text"
                    value={config.databaseHost}
                    onChange={(e) => setConfig({...config, databaseHost: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Puerto
                  </label>
                  <input
                    type="number"
                    value={config.databasePort}
                    onChange={(e) => setConfig({...config, databasePort: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Máximas Conexiones
                  </label>
                  <input
                    type="number"
                    value={config.maxConnections}
                    onChange={(e) => setConfig({...config, maxConnections: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Frecuencia de Backup
                  </label>
                  <select
                    value={config.backupFrequency}
                    onChange={(e) => setConfig({...config, backupFrequency: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="hourly">Cada hora</option>
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other sections would continue here with similar structure... */}
          {activeSection !== 'general' && activeSection !== 'database' && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-yellow-200 mb-2">
                Configuración de {sections.find(s => s.id === activeSection)?.label}
              </p>
              <p className="text-gray-400">
                Esta sección estará disponible próximamente.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;