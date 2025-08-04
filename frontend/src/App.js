import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

// Icons
import { Cross, Calendar, Users, Moon, Sun, User, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('confes_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('confes_user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('confes_user', JSON.stringify(userData));
    localStorage.setItem('confes_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('confes_user');
    localStorage.removeItem('confes_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Components
const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Cross className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900 dark:text-purple-300">ConfesApp</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">Inicio</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">¿Qué es la confesión?</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">Parroquias</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.firstName} {user.lastName}
                </span>
                <button 
                  onClick={logout}
                  className="p-2 rounded-full bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const LandingPage = ({ onRoleSelect }) => {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-purple-900 dark:text-purple-100 mb-6 font-serif">
              Vuelve a la gracia
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Encuentra, agenda y prepárate para tu confesión de manera sencilla y reverente
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRoleSelect('role-select')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              Agendar confesión
            </motion.button>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="rounded-3xl overflow-hidden shadow-3xl">
              <img 
                src="https://images.unsplash.com/photo-1524054886461-8938b72b6a74?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxjYXRob2xpYyUyMGNodXJjaHxlbnwwfHx8cHVycGxlfDE3NTQzMzIxNjV8MA&ixlib=rb-4.1.0&q=85"
                alt="Catedral católica"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl"
            >
              <Calendar className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">Agenda fácil</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reserva tu tiempo de confesión de manera simple y rápida
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl"
            >
              <Cross className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">Ambiente reverente</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Diseñado con respeto y devoción por este sacramento
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl"
            >
              <Users className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">Para todos</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fieles, sacerdotes y coordinadores parroquiales
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const RoleSelector = ({ onRoleSelect, onBack }) => {
  const { darkMode } = useTheme();

  const roles = [
    {
      id: 'faithful',
      title: 'Fiel',
      description: 'Reservar tiempo para confesión',
      icon: User,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'priest',
      title: 'Sacerdote',
      description: 'Gestionar horarios de confesión',
      icon: Cross,
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'parish_staff',
      title: 'Coordinador Parroquial',
      description: 'Administrar parroquia',
      icon: Users,
      gradient: 'from-indigo-600 to-blue-600'
    },
    {
      id: 'bishop',
      title: 'Obispo',
      description: 'Gestionar diócesis',
      icon: Cross,
      gradient: 'from-purple-800 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-purple-900 dark:text-purple-100 mb-4 font-serif">
          ¿Cómo deseas usar ConfesApp?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Selecciona tu rol para comenzar
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRoleSelect(role.id)}
              className="cursor-pointer p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center mx-auto mb-4`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                {role.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {role.description}
              </p>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={onBack}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
        >
          ← Volver al inicio
        </button>
      </motion.div>
    </div>
  );
};

const LoginForm = ({ role, onBack, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? 
        { email: formData.email, password: formData.password } :
        { ...formData, role };

      const response = await axios.post(`${API}${endpoint}`, payload);
      
      if (response.data.access_token) {
        login(response.data.user, response.data.access_token);
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {role === 'priest' ? <Cross className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'} - {role === 'priest' ? 'Sacerdote' : 'Fiel'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Nombre"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Apellidos"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}
            
            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
            </button>
          </form>

          <div className="text-center mt-6">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          <div className="text-center mt-4">
            <button 
              onClick={onBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              ← Cambiar rol
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  
  if (user.role === 'priest') {
    return <PriestDashboard />;
  } else if (user.role === 'bishop') {
    return <BishopDashboard />;
  } else if (user.role === 'parish_staff') {
    return <ParishStaffDashboard />;
  } else {
    return <FaithfulDashboard />;
  }
};

const BishopDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dioceseInfo, setDioceseInfo] = useState(null);
  const [parishes, setParishes] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchDioceseData();
  }, []);

  const fetchDioceseData = async () => {
    try {
      const [dioceseResponse, parishesResponse] = await Promise.all([
        axios.get(`${API}/dioceses/my-diocese/info`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/parishes`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setDioceseInfo(dioceseResponse.data);
      setParishes(parishesResponse.data);

      // Fetch pending requests for the diocese
      if (dioceseResponse.data.id) {
        const requestsResponse = await axios.get(`${API}/priest-requests/diocese/${dioceseResponse.data.id}/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingRequests(requestsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching diocese data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReview = async (requestId, status, responseMessage = '') => {
    try {
      await axios.patch(`${API}/priest-requests/${requestId}/review`, {
        status,
        responseMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDioceseData(); // Refresh data
    } catch (error) {
      console.error('Error reviewing request:', error);
      alert(error.response?.data?.message || 'Error al revisar la solicitud');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-purple-600">Cargando información diocesana...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Diocese Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-800 to-purple-600 rounded-full flex items-center justify-center">
                <Cross className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                  Dashboard del Obispo
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {dioceseInfo?.name || 'Diócesis'}
                </p>
              </div>
            </div>
            
            {/* Diocese Hero Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-6 relative">
              <img 
                src="https://images.unsplash.com/photo-1549875328-abc4f7307c2b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXRoZWRyYWx8ZW58MHx8fHB1cnBsZXwxNzU0MzM0MDE0fDA&ixlib=rb-4.1.0&q=85"
                alt="Catedral diocesana"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-blue-900/70"></div>
            </div>
          </div>

          {/* Diocese Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Parroquias</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {parishes.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Solicitudes Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingRequests.length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sacerdotes Activos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {parishes.reduce((count, parish) => count + (parish.parishStaff?.length || 0), 0)}
                  </p>
                </div>
                <Cross className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Fieles</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ~{parishes.length * 500}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8">
            {[
              { id: 'overview', label: 'Resumen' },
              { id: 'parishes', label: 'Parroquias' },
              { id: 'requests', label: 'Solicitudes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                    Dashboard del Obispo - Información de la Diócesis
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      💡 <strong>Próximamente:</strong> Funciones completas de gestión diocesana, 
                      estadísticas detalladas, informes parroquiales y más.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ParishStaffDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-purple-600">Cargando información parroquial...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                  Dashboard del Coordinador
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Coordinador Parroquial
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
              Dashboard del Coordinador Parroquial
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Gestiona la administración de tu parroquia, coordina con sacerdotes y supervisa las actividades.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                💡 <strong>Próximamente:</strong> Funciones completas de gestión parroquial, 
                coordinación de personal, gestión de eventos y más.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  const [activeTab, setActiveTab] = useState('slots');
  const [confessionSlots, setConfessionSlots] = useState([]);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsResponse, confessionsResponse] = await Promise.all([
        axios.get(`${API}/confession-slots`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/confessions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setConfessionSlots(slotsResponse.data);
      setConfessions(confessionsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const CreateSlotForm = () => {
    const [slotData, setSlotData] = useState({
      startTime: '',
      endTime: '',
      location: '',
      notes: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API}/confession-slots`, slotData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowCreateSlot(false);
        fetchData();
      } catch (error) {
        console.error('Error creating slot:', error);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6">
            Crear Nuevo Slot de Confesión
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Inicio
              </label>
              <input
                type="datetime-local"
                required
                value={slotData.startTime}
                onChange={(e) => setSlotData({...slotData, startTime: e.target.value})}
                className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fin
              </label>
              <input
                type="datetime-local"
                required
                value={slotData.endTime}
                onChange={(e) => setSlotData({...slotData, endTime: e.target.value})}
                className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                placeholder="Ej: Confesionario Principal"
                value={slotData.location}
                onChange={(e) => setSlotData({...slotData, location: e.target.value})}
                className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notas
              </label>
              <textarea
                placeholder="Información adicional..."
                value={slotData.notes}
                onChange={(e) => setSlotData({...slotData, notes: e.target.value})}
                className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows="3"
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Crear Slot
              </button>
              <button
                type="button"
                onClick={() => setShowCreateSlot(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-purple-600">Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              Dashboard del Sacerdote
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona tus horarios de confesión
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8">
            {[
              { id: 'slots', label: 'Mis Horarios' },
              { id: 'confessions', label: 'Confesiones' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'slots' && (
              <motion.div
                key="slots"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    Horarios de Confesión
                  </h2>
                  <button
                    onClick={() => setShowCreateSlot(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    + Crear Nuevo Slot
                  </button>
                </div>

                <div className="grid gap-4">
                  {confessionSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                            {new Date(slot.startTime).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            {new Date(slot.startTime).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} - {new Date(slot.endTime).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {slot.location && (
                            <p className="text-gray-600 dark:text-gray-400 mb-1">
                              📍 {slot.location}
                            </p>
                          )}
                          {slot.notes && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {slot.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            slot.status === 'available' ? 'bg-green-100 text-green-800' :
                            slot.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {slot.status === 'available' ? 'Disponible' :
                             slot.status === 'booked' ? 'Reservado' :
                             'Completado'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {confessionSlots.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No has creado ningún horario aún
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'confessions' && (
              <motion.div
                key="confessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6">
                  Confesiones Programadas
                </h2>

                <div className="grid gap-4">
                  {confessions.map((confession) => (
                    <motion.div
                      key={confession.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                            {confession.faithful?.firstName} {confession.faithful?.lastName}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            📅 {new Date(confession.scheduledTime).toLocaleString('es-ES')}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            📍 {confession.confessionSlot?.location || 'Sin ubicación especificada'}
                          </p>
                          {confession.notes && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              📝 {confession.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            confession.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                            confession.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {confession.status === 'booked' ? 'Reservado' :
                             confession.status === 'completed' ? 'Completado' :
                             'Cancelado'}
                          </span>
                          
                          {confession.status === 'booked' && (
                            <button
                              onClick={async () => {
                                try {
                                  await axios.patch(`${API}/confessions/${confession.id}/complete`, {}, {
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  fetchData();
                                } catch (error) {
                                  console.error('Error completing confession:', error);
                                }
                              }}
                              className="block mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              Marcar Completado
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {confessions.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No hay confesiones programadas
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showCreateSlot && <CreateSlotForm />}
    </div>
  );
};

const FaithfulDashboard = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [myConfessions, setMyConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('book');
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsResponse, confessionsResponse] = await Promise.all([
        axios.get(`${API}/confession-slots/available`),
        axios.get(`${API}/confessions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAvailableSlots(slotsResponse.data);
      setMyConfessions(confessionsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookConfession = async (slotId) => {
    try {
      await axios.post(`${API}/confessions`, {
        confessionSlotId: slotId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error booking confession:', error);
      alert(error.response?.data?.message || 'Error al reservar la confesión');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-purple-600">Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              Mi Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Reserva y gestiona tus confesiones
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8">
            {[
              { id: 'book', label: 'Reservar Confesión' },
              { id: 'my-confessions', label: 'Mis Confesiones' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'book' && (
              <motion.div
                key="book"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6">
                  Horarios Disponibles para Confesión
                </h2>

                <div className="grid gap-4">
                  {availableSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                            {new Date(slot.startTime).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            🕐 {new Date(slot.startTime).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} - {new Date(slot.endTime).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            👨‍💼 {slot.priest?.firstName} {slot.priest?.lastName}
                          </p>
                          {slot.location && (
                            <p className="text-gray-600 dark:text-gray-400 mb-1">
                              📍 {slot.location}
                            </p>
                          )}
                          {slot.notes && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              📝 {slot.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => bookConfession(slot.id)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {availableSlots.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No hay horarios disponibles en este momento
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'my-confessions' && (
              <motion.div
                key="my-confessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6">
                  Mis Confesiones
                </h2>

                <div className="grid gap-4">
                  {myConfessions.map((confession) => (
                    <motion.div
                      key={confession.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                            Confesión con {confession.confessionSlot?.priest?.firstName} {confession.confessionSlot?.priest?.lastName}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            📅 {new Date(confession.scheduledTime).toLocaleString('es-ES')}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            📍 {confession.confessionSlot?.location || 'Sin ubicación especificada'}
                          </p>
                          {confession.notes && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              📝 {confession.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            confession.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                            confession.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {confession.status === 'booked' ? 'Reservado' :
                             confession.status === 'completed' ? 'Completado' :
                             'Cancelado'}
                          </span>
                          
                          {confession.status === 'booked' && (
                            <button
                              onClick={async () => {
                                try {
                                  await axios.patch(`${API}/confessions/${confession.id}/cancel`, {}, {
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  fetchData();
                                } catch (error) {
                                  console.error('Error cancelling confession:', error);
                                }
                              }}
                              className="block mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {myConfessions.length === 0 && (
                    <div className="text-center py-12">
                      <Cross className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No tienes confesiones programadas
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);
  const { user, loading } = useAuth();

  const handleRoleSelect = (role) => {
    if (role === 'role-select') {
      setCurrentView('role-select');
    } else {
      setSelectedRole(role);
      setCurrentView('login');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-purple-600">Cargando...</div>
    </div>;
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <AnimatePresence mode="wait">
      {currentView === 'landing' && (
        <LandingPage key="landing" onRoleSelect={handleRoleSelect} />
      )}
      {currentView === 'role-select' && (
        <RoleSelector 
          key="role-select" 
          onRoleSelect={handleRoleSelect}
          onBack={() => setCurrentView('landing')}
        />
      )}
      {currentView === 'login' && (
        <LoginForm 
          key="login"
          role={selectedRole}
          onBack={() => setCurrentView('role-select')}
          onSuccess={handleLoginSuccess}
        />
      )}
    </AnimatePresence>
  );
}

// App with Providers
function AppWithProviders() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWithProviders;