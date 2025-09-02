import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Users,
  Church,
  Activity,
  Globe,
  Filter,
  RefreshCw,
  Eye,
  Mail,
  Share2,
  PieChart,
  LineChart
} from 'lucide-react';

const ExecutiveReports = ({ systemStats, onRefresh }) => {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    fetchReportsData();
  }, [selectedPeriod]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockAnalytics = {
        overview: {
          totalConfessions: 15634,
          growthRate: 12.3,
          activeUsers: 1267,
          userGrowth: 8.7,
          avgDailyConfessions: 521,
          peakHour: '18:00',
          mostActiveDiocese: 'Archidiócesis de Madrid',
          completionRate: 94.2
        },
        geographic: [
          { region: 'Madrid', confessions: 4250, growth: 15.2 },
          { region: 'Barcelona', confessions: 3100, growth: 8.9 },
          { region: 'Sevilla', confessions: 2890, growth: 11.4 },
          { region: 'Valencia', confessions: 2650, growth: 6.7 },
          { region: 'Bilbao', confessions: 1820, growth: 9.1 }
        ],
        temporal: [
          { hour: '06:00', confessions: 45 },
          { hour: '07:00', confessions: 78 },
          { hour: '08:00', confessions: 134 },
          { hour: '09:00', confessions: 189 },
          { hour: '10:00', confessions: 245 },
          { hour: '11:00', confessions: 298 },
          { hour: '12:00', confessions: 321 },
          { hour: '13:00', confessions: 287 },
          { hour: '14:00', confessions: 234 },
          { hour: '15:00', confessions: 198 },
          { hour: '16:00', confessions: 256 },
          { hour: '17:00', confessions: 378 },
          { hour: '18:00', confessions: 456 },
          { hour: '19:00', confessions: 398 },
          { hour: '20:00', confessions: 321 },
          { hour: '21:00', confessions: 234 }
        ],
        demographics: {
          byAge: [
            { range: '18-25', percentage: 12.4, confessions: 1937 },
            { range: '26-35', percentage: 18.7, confessions: 2923 },
            { range: '36-45', percentage: 24.1, percentage: 3768 },
            { range: '46-55', percentage: 19.8, confessions: 3095 },
            { range: '56-65', percentage: 15.6, confessions: 2439 },
            { range: '65+', percentage: 9.4, confessions: 1469 }
          ],
          byGender: [
            { gender: 'Femenino', percentage: 58.3, confessions: 9115 },
            { gender: 'Masculino', percentage: 41.7, confessions: 6519 }
          ]
        }
      };

      const mockReports = [
        {
          id: '1',
          name: 'Reporte Mensual de Confesiones',
          description: 'Análisis completo de actividad mensual',
          type: 'monthly',
          generatedAt: '2024-06-15T10:00:00Z',
          size: '2.4 MB',
          format: 'PDF',
          category: 'operational'
        },
        {
          id: '2',
          name: 'Análisis de Crecimiento Trimestral',
          description: 'Tendencias y proyecciones de crecimiento',
          type: 'quarterly',
          generatedAt: '2024-06-01T15:30:00Z',
          size: '4.1 MB',
          format: 'PDF',
          category: 'strategic'
        },
        {
          id: '3',
          name: 'Reporte de Usuarios Activos',
          description: 'Análisis de engagement y retención',
          type: 'weekly',
          generatedAt: '2024-06-14T09:00:00Z',
          size: '1.8 MB',
          format: 'Excel',
          category: 'operational'
        },
        {
          id: '4',
          name: 'Estadísticas por Diócesis',
          description: 'Comparativa de rendimiento por región',
          type: 'monthly',
          generatedAt: '2024-06-10T14:20:00Z',
          size: '3.2 MB',
          format: 'PDF',
          category: 'strategic'
        }
      ];

      setAnalytics(mockAnalytics);
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportId) => {
    // Mock download - replace with actual download logic
    alert(`Descargando reporte ${reportId}...`);
  };

  const handleGenerateReport = (reportType) => {
    // Mock generation - replace with actual generation logic
    alert(`Generando nuevo reporte ${reportType}...`);
  };

  const handleEmailReport = (reportId) => {
    // Mock email - replace with actual email logic
    alert(`Enviando reporte ${reportId} por email...`);
  };

  const reportTypes = [
    {
      id: 'overview',
      label: 'Resumen Ejecutivo',
      icon: BarChart3,
      description: 'Métricas clave del sistema'
    },
    {
      id: 'geographic',
      label: 'Análisis Geográfico',
      icon: Globe,
      description: 'Distribución por regiones'
    },
    {
      id: 'temporal',
      label: 'Tendencias Temporales',
      icon: LineChart,
      description: 'Patrones de uso por hora'
    },
    {
      id: 'demographics',
      label: 'Demografía',
      icon: PieChart,
      description: 'Análisis de usuarios'
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-200">Cargando reportes...</p>
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
            Reportes Ejecutivos
          </h2>
          <p className="text-yellow-200">
            Analytics y reportes del sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-black/30 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          
          <button
            onClick={fetchReportsData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          
          <button
            onClick={() => handleGenerateReport('custom')}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Report Type Navigation */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {reportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  selectedReport === type.id
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg'
                    : 'text-yellow-200 hover:text-yellow-100 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/30'
                }`}
              >
                <div className="flex flex-col items-center">
                  <IconComponent className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">{type.label}</span>
                  <span className={`text-xs mt-1 ${
                    selectedReport === type.id ? 'text-black/70' : 'text-yellow-300'
                  }`}>
                    {type.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Analytics Panel */}
        <div className="lg:col-span-2">
          {selectedReport === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-yellow-100 mb-6">Resumen Ejecutivo</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Confesiones</p>
                        <p className="text-2xl font-bold text-white">{analytics.overview?.totalConfessions?.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">+{analytics.overview?.growthRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Usuarios Activos</p>
                        <p className="text-2xl font-bold text-white">{analytics.overview?.activeUsers?.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">+{analytics.overview?.userGrowth}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Promedio Diario</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview?.avgDailyConfessions}</p>
                    <p className="text-sm text-gray-300">confesiones por día</p>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Hora Pico</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview?.peakHour}</p>
                    <p className="text-sm text-gray-300">mayor actividad</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedReport === 'geographic' && (
            <motion.div
              key="geographic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-yellow-100 mb-6">Análisis Geográfico</h3>
              
              <div className="space-y-4">
                {analytics.geographic?.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{region.region}</h4>
                      <p className="text-sm text-gray-400">{region.confessions.toLocaleString()} confesiones</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(region.confessions / 4250) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">+{region.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedReport !== 'overview' && selectedReport !== 'geographic' && (
            <motion.div
              key={selectedReport}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-yellow-200 mb-2">
                  {reportTypes.find(t => t.id === selectedReport)?.label}
                </p>
                <p className="text-gray-400">
                  Este análisis estará disponible próximamente.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Reports List Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-yellow-100 mb-4">Reportes Disponibles</h3>
            
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{report.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      report.category === 'strategic' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {report.format}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{report.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(report.generatedAt).toLocaleDateString('es-ES')}</span>
                    <span>{report.size}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => handleDownloadReport(report.id)}
                      className="flex items-center px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs hover:bg-yellow-500/30 transition-colors"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </button>
                    <button
                      onClick={() => handleEmailReport(report.id)}
                      className="flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30 transition-colors"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveReports;