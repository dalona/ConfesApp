import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

// Icons
import { Cross, Calendar, Users, Moon, Sun, User, LogOut, Mail, FileText, ArrowLeft, Grid, List, Plus, Edit, Trash2, BarChart3 } from 'lucide-react';

// Import components
import WeeklyCalendar from './WeeklyCalendar';
import BandForm from './BandForm';

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

  // Function to verify user role and redirect appropriately
  const verifyUserAccess = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role === requiredRole;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('confes_user');
    localStorage.removeItem('confes_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, verifyUserAccess }}>
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
                src="https://images.unsplash.com/photo-1709319575307-14a677cab867?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxjYXRob2xpYyUyMGNvbmZlc3Npb258ZW58MHx8fHwxNzU0NDIxMzM1fDA&ixlib=rb-4.1.0&q=85"
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
                Fieles y sacerdotes unidos en fe
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const RoleSelector = ({ onRoleSelect, onBack }) => {
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

        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
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

const LoginForm = ({ role, isLogin: isLoginMode, priestRegistrationType, onBack, onSuccess, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    invitationToken: '',
    dioceseId: '',
    bio: '',
    specialties: '',
    languages: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(isLoginMode || false);
  const [generalError, setGeneralError] = useState('');
  const { login } = useAuth();

  // Validación en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'El correo electrónico es requerido';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Ingresa un correo electrónico válido';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número';
        } else {
          delete newErrors.password;
        }
        break;

      case 'firstName':
        if (!value) {
          newErrors.firstName = 'El nombre es requerido';
        } else if (value.length < 2) {
          newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!value) {
          newErrors.lastName = 'El apellido es requerido';
        } else if (value.length < 2) {
          newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'phone':
        if (value && !/^[\d\+\-\(\)\s]+$/.test(value)) {
          newErrors.phone = 'Ingresa un número de teléfono válido';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'invitationToken':
        if (!value) {
          newErrors.invitationToken = 'El token de invitación es requerido';
        } else if (value.length < 10) {
          newErrors.invitationToken = 'El token de invitación no es válido';
        } else {
          delete newErrors.invitationToken;
        }
        break;

      case 'dioceseId':
        if (!value) {
          newErrors.dioceseId = 'Debes seleccionar una diócesis';
        } else {
          delete newErrors.dioceseId;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    setGeneralError(''); // Limpiar error general al cambiar campos
  };

  const getErrorMessage = (error) => {
    if (typeof error === 'string') {
      return error;
    }

    // Manejo de errores específicos del backend
    if (error?.response?.data?.message) {
      const message = error.response.data.message;
      
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      
      // Traducir mensajes comunes del backend
      switch (message) {
        case 'User already exists':
          return 'Ya existe una cuenta con este correo electrónico';
        case 'Invalid credentials':
          return 'Credenciales inválidas. Verifica tu correo y contraseña';
        case 'User not found':
          return 'No existe una cuenta con este correo electrónico';
        case 'Unauthorized':
          return 'Credenciales incorrectas';
        default:
          return message;
      }
    }

    // Errores de red
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
      return 'Error de conexión. Verifica tu conexión a internet';
    }

    return 'Error inesperado. Por favor, intenta nuevamente';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    let fieldsToValidate = isLogin ? ['email', 'password'] : ['email', 'password', 'firstName', 'lastName'];
    
    // Agregar validaciones específicas para sacerdotes
    if (!isLogin && role === 'priest') {
      if (priestRegistrationType === 'invitation') {
        fieldsToValidate.push('invitationToken');
      } else if (priestRegistrationType === 'direct') {
        fieldsToValidate.push('dioceseId');
      }
    }
    
    fieldsToValidate.forEach(field => validateField(field, formData[field]));
    
    // Verificar si hay errores
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      setGeneralError('Por favor, corrige los errores antes de continuar');
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      let endpoint = '/auth/login';
      let payload = { email: formData.email, password: formData.password };

      if (!isLogin) {
        if (role === 'priest' && priestRegistrationType === 'invitation') {
          // Registro desde invitación
          endpoint = `/auth/register-from-invite/${formData.invitationToken}`;
          payload = {
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            bio: formData.bio,
            specialties: formData.specialties,
            languages: formData.languages
          };
        } else if (role === 'priest' && priestRegistrationType === 'direct') {
          // Solicitud directa de sacerdote
          endpoint = '/auth/register-priest';
          payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            dioceseId: formData.dioceseId,
            bio: formData.bio,
            specialties: formData.specialties,
            languages: formData.languages
          };
        } else {
          // Registro normal (fieles) - solo enviar campos necesarios
          endpoint = '/auth/register';
          payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            role
          };
        }
      }

      console.log('Enviando solicitud a:', `${API}${endpoint}`);
      console.log('Payload:', payload);

      const response = await axios.post(`${API}${endpoint}`, payload);
      
      if (response.data.access_token) {
        login(response.data.user, response.data.access_token);
        onSuccess();
      } else if (response.data.success && role === 'priest' && priestRegistrationType === 'direct') {
        // Solicitud directa exitosa pero sin token (pendiente aprobación)
        setGeneralError('');
        alert('¡Solicitud enviada exitosamente! Tu solicitud está pendiente de aprobación por el obispo de la diócesis. Te notificaremos cuando sea revisada.');
      } else {
        setGeneralError('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setGeneralError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getRoleImage = () => {
    switch(role) {
      case 'priest':
        return 'https://customer-assets.emergentagent.com/job_confesapp/artifacts/blj5h74p_Smiling%20Priest%20in%20Green%20Vestments.png';
      default:
        return null;
    }
  };

  const getRoleTitle = () => {
    switch(role) {
      case 'priest': 
        if (priestRegistrationType === 'invitation') {
          return 'Sacerdote - Con Invitación';
        } else if (priestRegistrationType === 'direct') {
          return 'Sacerdote - Solicitud Directa';
        }
        return 'Sacerdote';
      default: return 'Fiel';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Role Image */}
        {getRoleImage() && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={getRoleImage()}
                alt={getRoleTitle()}
                className="w-full h-96 object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {role === 'priest' ? <Cross className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'} - {getRoleTitle()}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                {isLogin ? 'Ingresa tus credenciales' : 
                  (role === 'priest' && priestRegistrationType === 'invitation') ? 
                    'Ingresa el token de invitación y crea tu cuenta' :
                  (role === 'priest' && priestRegistrationType === 'direct') ?
                    'Solicita unirte a una diócesis' :
                    'Crea tu cuenta nueva'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Nombre *"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-purple-200 dark:border-purple-700'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Apellidos *"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-purple-200 dark:border-purple-700'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Teléfono (opcional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500' : 'border-purple-200 dark:border-purple-700'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Campos específicos para sacerdotes */}
                  {role === 'priest' && (
                    <>
                      {priestRegistrationType === 'invitation' && (
                        <div>
                          <input
                            type="text"
                            name="invitationToken"
                            placeholder="Token de invitación *"
                            required
                            value={formData.invitationToken}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                              errors.invitationToken ? 'border-red-500' : 'border-purple-200 dark:border-purple-700'
                            }`}
                          />
                          {errors.invitationToken && (
                            <p className="text-red-500 text-sm mt-1">{errors.invitationToken}</p>
                          )}
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Ingresa el token que recibiste en tu invitación
                          </div>
                        </div>
                      )}

                      {priestRegistrationType === 'direct' && (
                        <div>
                          <select
                            name="dioceseId"
                            required
                            value={formData.dioceseId}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                              errors.dioceseId ? 'border-red-500' : 'border-purple-200 dark:border-purple-700'
                            }`}
                          >
                            <option value="">Selecciona una diócesis *</option>
                            <option value="b074ec8b-8aa0-496d-b8c7-1443ed1d54cb">Diócesis de Madrid</option>
                          </select>
                          {errors.dioceseId && (
                            <p className="text-red-500 text-sm mt-1">{errors.dioceseId}</p>
                          )}
                        </div>
                      )}

                      {/* Campos adicionales para sacerdotes */}
                      <div>
                        <textarea
                          name="bio"
                          placeholder="Biografía (opcional)"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Cuéntanos un poco sobre tu experiencia pastoral
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          name="specialties"
                          placeholder="Especialidades (opcional)"
                          value={formData.specialties}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Ej: Confesión, Matrimonios, Catequesis
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          name="languages"
                          placeholder="Idiomas (opcional)"
                          value={formData.languages}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Ej: Español, Inglés, Francés
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico *"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-purple-200 dark:border-purple-700'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña *"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-purple-200 dark:border-purple-700'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                {!isLogin && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    • Mínimo 6 caracteres<br/>
                    • Al menos 1 mayúscula, 1 minúscula y 1 número
                  </div>
                )}
              </div>

              {generalError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex">
                    <div className="text-red-400">⚠️</div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{generalError}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  isLogin ? 'Iniciar Sesión' : 'Registrarse'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setGeneralError('');
                  // Reset form data when switching modes
                  setFormData({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    invitationToken: '',
                    dioceseId: '',
                    bio: '',
                    specialties: '',
                    languages: ''
                  });
                }}
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
                ← {role === 'priest' ? 'Cambiar opción' : 'Cambiar rol'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Dashboard components would go here...

const PriestDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'list', 'stats'
  const [bands, setBands] = useState([]);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBandForm, setShowBandForm] = useState(false);
  const [selectedBand, setSelectedBand] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bandsResponse, confessionsResponse] = await Promise.all([
        axios.get(`${API}/confession-bands/my-bands`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('Error fetching bands:', error);
          if (error.response?.status === 401) {
            // Token expired or invalid
            console.log('Authentication error, token may be invalid');
          }
          throw error;
        }),
        axios.get(`${API}/confessions`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('Error fetching confessions:', error);
          // Don't fail completely if confessions fail, just return empty array
          return { data: [] };
        })
      ]);

      console.log('Bands fetched:', bandsResponse.data);
      console.log('Confessions fetched:', confessionsResponse.data);

      setBands(Array.isArray(bandsResponse.data) ? bandsResponse.data : []);
      setConfessions(Array.isArray(confessionsResponse.data) ? confessionsResponse.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Set empty data to prevent render errors
      setBands([]);
      setConfessions([]);
      
      // Show user-friendly error
      if (error.response?.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        alert('Error al cargar los datos. Por favor, recarga la página.');
      }
    } finally {
      setLoading(false);
    }
  };

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
    setIsEditMode(false);
    setShowBandForm(true);
  };

  const handleEditBand = (band) => {
    setSelectedBand(band);
    setIsEditMode(true);
    setShowBandForm(true);
  };

  const handleBandClick = (band) => {
    // For now, just edit the band when clicked
    handleEditBand(band);
  };

  const handleSaveBand = async (bandData) => {
    try {
      if (isEditMode && selectedBand?.id) {
        const response = await axios.patch(`${API}/confession-bands/my-bands/${selectedBand.id}`, bandData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Band updated:', response.data);
      } else {
        const response = await axios.post(`${API}/confession-bands`, bandData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Band created:', response.data);
      }
      
      fetchData(); // Refresh data
      setShowBandForm(false);
      setSelectedBand(null);
    } catch (error) {
      console.error('Error saving band:', error);
      
      // Handle different error types
      let errorMessage = 'Error al guardar la franja';
      
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // Request made but no response received
        console.error('Error request:', error.request);
        errorMessage = 'No se pudo conectar con el servidor';
      } else {
        // Error in setting up the request
        console.error('Error message:', error.message);
        errorMessage = error.message;
      }
      
      // Create a proper error object to throw
      const errorToThrow = new Error(errorMessage);
      errorToThrow.response = error.response;
      throw errorToThrow;
    }
  };

  const handleDeleteBand = async (bandId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta franja? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await axios.delete(`${API}/confession-bands/my-bands/${bandId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting band:', error);
      alert(error.response?.data?.message || 'Error al eliminar la franja');
    }
  };

  const handleChangeStatus = async (bandId, status) => {
    try {
      await axios.patch(`${API}/confession-bands/my-bands/${bandId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error changing status:', error);
      alert(error.response?.data?.message || 'Error al cambiar el estado');
    }
  };

  const getBandStats = () => {
    const stats = {
      total: bands.length,
      available: bands.filter(b => b.status === 'available').length,
      full: bands.filter(b => b.status === 'full').length,
      cancelled: bands.filter(b => b.status === 'cancelled').length,
      totalBookings: bands.reduce((sum, b) => sum + (b.currentBookings || 0), 0),
    };
    return stats;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'full': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'full': return 'Llena';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-xl text-purple-600 dark:text-purple-400 font-medium">
            Cargando franjas de confesión...
          </div>
        </div>
      </div>
    );
  }

  const stats = getBandStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                  Franjas de Confesión
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Bienvenido, {user?.firstName}. Gestiona tus horarios de confesión
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCreateBand(null)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Franja
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.available}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                  <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Llenas</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.full}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reservas</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalBookings}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-purple-100 dark:border-purple-900 mb-6"
          >
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Grid className="w-5 h-5 mr-2" />
                Vista Calendario
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'list'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <List className="w-5 h-5 mr-2" />
                Vista Lista
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {activeTab === 'calendar' && (
              <WeeklyCalendar 
                bands={bands}
                onBandClick={handleBandClick}
                onCreateBand={handleCreateBand}
              />
            )}

            {activeTab === 'list' && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <List className="w-8 h-8 text-white mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Lista de Franjas
                        </h2>
                        <p className="text-purple-100">
                          Gestiona todas tus franjas de confesión
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  {bands.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        No tienes franjas programadas
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500 mb-6">
                        Crea tu primera franja de confesión para comenzar
                      </p>
                      <button
                        onClick={() => handleCreateBand(null)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
                      >
                        + Nueva Franja
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bands
                        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                        .map((band, index) => (
                          <motion.div
                            key={band.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all hover:border-purple-300 dark:hover:border-purple-600"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                  {formatDateTime(band.startTime)} - {new Date(band.endTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                                  <Cross className="w-3 h-3 mr-1" />
                                  {band.location}
                                  <span className="mx-2">•</span>
                                  <Users className="w-3 h-3 mr-1" />
                                  {band.currentBookings || 0}/{band.maxCapacity}
                                  {band.notes && (
                                    <>
                                      <span className="mx-2">•</span>
                                      {band.notes.substring(0, 50)}...
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(band.status)}`}>
                                {getStatusText(band.status)}
                              </span>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditBand(band)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="Editar franja"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBand(band.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Eliminar franja"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Band Form Modal */}
      {showBandForm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setShowBandForm(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {isEditMode ? 'Editar Franja' : 'Nueva Franja de Confesión'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Configura los detalles de tu franja
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBandForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <Cross className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Fecha y Hora de Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Fecha y Hora de Fin *
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Location and Capacity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Cross className="w-4 h-4 mr-2 text-purple-600" />
                    Ubicación *
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
                    <option value="Confesionario Principal">Confesionario Principal</option>
                    <option value="Confesionario Lateral">Confesionario Lateral</option>
                    <option value="Capilla del Santísimo">Capilla del Santísimo</option>
                    <option value="Sacristía">Sacristía</option>
                    <option value="Salón Parroquial">Salón Parroquial</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    Capacidad Máxima *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    defaultValue="5"
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Ej: 5"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-purple-600" />
                  Notas Especiales
                </label>
                <textarea
                  placeholder="Información adicional para los fieles (opcional)..."
                  className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  rows="3"
                />
              </div>

              {/* Recurrence Section */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="recurrent"
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 mr-3"
                  />
                  <label htmlFor="recurrent" className="flex items-center text-sm font-semibold text-purple-700 dark:text-purple-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    Franja Recurrente
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                      Tipo de Recurrencia
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                      Días de la Semana (para recurrencia semanal)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-600 hover:text-white"
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                      Repetir Hasta
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => alert('¡Funcionalidad en desarrollo! El formulario funciona correctamente.')}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isEditMode ? 'Actualizar Franja' : 'Crear Franja'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBandForm(false)}
                  className="px-8 py-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const FaithfulDashboard = () => {
  const [citasDisponibles, setCitasDisponibles] = useState([]);
  const [misConfesiones, setMisConfesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('book');
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [citasResponse, confessionsResponse] = await Promise.all([
        axios.get(`${API}/confession-slots/available`),
        axios.get(`${API}/confessions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCitasDisponibles(citasResponse.data);
      setMisConfesiones(confessionsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookConfession = async (citaId) => {
    try {
      await axios.post(`${API}/confessions`, {
        confessionSlotId: citaId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error booking confession:', error);
      alert(error.response?.data?.message || 'Error al reservar la cita');
    }
  };

  const cancelConfession = async (confessionId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta cita? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await axios.patch(`${API}/confessions/${confessionId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
      alert('Cita cancelada exitosamente');
    } catch (error) {
      console.error('Error canceling confession:', error);
      alert(error.response?.data?.message || 'Error al cancelar la cita');
    }
  };

  const canCancelConfession = (confession) => {
    if (confession.status !== 'booked') return false;
    
    // Check if confession is at least 2 hours in the future
    const confessionTime = new Date(confession.scheduledTime || confession.confessionSlot?.startTime);
    const now = new Date();
    const timeDiff = confessionTime.getTime() - now.getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    return timeDiff > twoHoursInMs;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-xl text-purple-600 dark:text-purple-400 font-medium">
            Cargando citas...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              Mis Citas de Confesión
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Reserva y gestiona tus citas espirituales
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Citas Disponibles</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {citasDisponibles.length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mis Reservas</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {misConfesiones.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-white mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Citas Disponibles
                  </h2>
                  <p className="text-green-100">
                    Selecciona una cita para reservar
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {citasDisponibles.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No hay citas disponibles
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Los sacerdotes aún no han publicado citas disponibles
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {citasDisponibles.map((cita, index) => (
                    <motion.div
                      key={cita.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all hover:border-green-300 dark:hover:border-green-600"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                          <Cross className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {new Date(cita.startTime).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(cita.startTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} - 
                            {new Date(cita.endTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                            <span className="mx-2">•</span>
                            <Cross className="w-3 h-3 mr-1" />
                            {cita.location}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => bookConfession(cita.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        Reservar Cita
                      </button>
                    </motion.div>
                  ))}
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
                  <h2 className="text-2xl font-bold text-white">
                    Mis Confesiones
                  </h2>
                  <p className="text-purple-100">
                    Historial de citas reservadas
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {misConfesiones.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No tienes citas reservadas
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Reserva tu primera cita de confesión arriba
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {misConfesiones.map((confesion, index) => {
                    const cita = confesion.confessionSlot;
                    return (
                      <motion.div
                        key={confesion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                            <Cross className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {new Date(cita.startTime).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(cita.startTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} - 
                              {new Date(cita.endTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                              <span className="mx-2">•</span>
                              <Cross className="w-3 h-3 mr-1" />
                              {cita.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            confesion.status === 'booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            confesion.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {confesion.status === 'booked' ? 'Reservada' :
                             confesion.status === 'completed' ? 'Completada' :
                             confesion.status}
                          </span>
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

// Helper function to get role display names
const getRoleDisplayName = (role) => {
  switch(role) {
    case 'priest': return 'Sacerdote';
    case 'faithful': return 'Fiel';
    case 'parish_coordinator': return 'Coordinador Parroquial';
    case 'bishop': return 'Obispo';
    default: return role || 'Desconocido';
  }
};

const UnauthorizedAccess = ({ userRole, onGoToDashboard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-red-900 dark:to-purple-900 flex items-center justify-center px-4">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
          <Cross className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-red-700 dark:text-red-300 mb-4">
          Acceso No Autorizado
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          No tienes permisos para acceder a esta sección. Tu rol actual es: <span className="font-semibold text-purple-600">{getRoleDisplayName(userRole)}</span>
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoToDashboard}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Ir a Mi Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};

// Enhanced Dashboard component with role-based routing
const Dashboard = () => {
  const { user, verifyUserAccess } = useAuth();
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  
  useEffect(() => {
    if (user && user.role) {
      // Automatically redirect to correct dashboard based on role
      switch(user.role) {
        case 'priest':
          setCurrentDashboard('priest');
          break;
        case 'faithful':
          setCurrentDashboard('faithful');
          break;
        case 'parish_coordinator':
          setCurrentDashboard('coordinator');
          break;
        default:
          setCurrentDashboard('priest'); // fallback
      }
    }
  }, [user]);

  const handleDashboardNavigation = (targetDashboard) => {
    const roleMapping = {
      'priest': 'priest',
      'faithful': 'faithful', 
      'coordinator': 'parish_coordinator'
    };
    
    const requiredRole = roleMapping[targetDashboard];
    if (verifyUserAccess(requiredRole)) {
      setCurrentDashboard(targetDashboard);
      setShowUnauthorized(false);
    } else {
      setShowUnauthorized(true);
    }
  };

  const handleGoToDashboard = () => {
    setShowUnauthorized(false);
    // Redirect to correct dashboard based on user role
    if (user.role === 'priest') {
      setCurrentDashboard('priest');
    } else if (user.role === 'faithful') {
      setCurrentDashboard('faithful');
    } else if (user.role === 'parish_coordinator') {
      setCurrentDashboard('coordinator');
    }
  };

  if (showUnauthorized) {
    return <UnauthorizedAccess userRole={user?.role} onGoToDashboard={handleGoToDashboard} />;
  }

  // Render appropriate dashboard based on current selection and user role
  if (currentDashboard === 'priest' && verifyUserAccess('priest')) {
    return <PriestDashboard />;
  } else if (currentDashboard === 'faithful' && verifyUserAccess('faithful')) {
    return <FaithfulDashboard />;
  } else if (currentDashboard === 'coordinator' && verifyUserAccess('parish_coordinator')) {
    return <div>Coordinator Dashboard (Coming Soon)</div>;
  } else {
    // Fallback: show unauthorized if somehow we get here
    return <UnauthorizedAccess userRole={user?.role} onGoToDashboard={handleGoToDashboard} />;
  }
};

const FaithfulActionSelector = ({ onBack, onActionSelect }) => {
  const actions = [
    {
      id: 'login',
      title: 'Iniciar sesión',
      description: 'Ya tengo una cuenta como fiel',
      icon: User,
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      id: 'register',
      title: 'Registrarse',
      description: 'Quiero crear una nueva cuenta',
      icon: Cross,
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-purple-900 dark:text-purple-100 mb-4 font-serif">
          Acceso para Fieles
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          ¿Qué deseas hacer?
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onActionSelect(action.id)}
              className="cursor-pointer p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto mb-6`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {action.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a selección de rol
        </motion.button>
      </motion.div>
    </div>
  );
};

const PriestActionSelector = ({ onBack, onActionSelect }) => {
  const actions = [
    {
      id: 'login',
      title: 'Iniciar sesión',
      description: 'Ya tengo una cuenta de sacerdote',
      icon: User,
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'register',
      title: 'Registrarse',
      description: 'Quiero crear una nueva cuenta',
      icon: Cross,
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-purple-900 dark:text-purple-100 mb-4 font-serif">
          Acceso para Sacerdotes
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          ¿Qué deseas hacer?
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onActionSelect(action.id)}
              className="cursor-pointer p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto mb-6`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {action.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </motion.button>
      </motion.div>
    </div>
  );
};

const PriestRegistrationTypeSelector = ({ onBack, onTypeSelect }) => {
  const registrationTypes = [
    {
      id: 'invitation',
      title: 'Con invitación',
      description: 'He recibido una invitación de mi obispo',
      icon: Mail,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'direct',
      title: 'Solicitud directa',
      description: 'Quiero solicitar unirme a una diócesis',
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-purple-900 dark:text-purple-100 mb-4 font-serif">
          Registro de Sacerdote
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          ¿Cómo deseas registrarte en ConfesApp?
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
          {registrationTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTypeSelect(type.id)}
              className="cursor-pointer p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center mx-auto mb-6`}>
                <type.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">
                {type.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {type.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </motion.button>
      </motion.div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);
  const [priestRegistrationType, setPriestRegistrationType] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const { user, loading } = useAuth();

  const handleRoleSelect = (role) => {
    if (role === 'role-select') {
      setCurrentView('role-select');
    } else if (role === 'priest') {
      setSelectedRole(role);
      setCurrentView('priest-action-select');
    } else if (role === 'faithful') {
      setSelectedRole(role);
      setCurrentView('faithful-action-select'); // New faithful selector
    } else {
      setSelectedRole(role);
      setIsLogin(false);
      setCurrentView('login');
    }
  };

  const handleFaithfulActionSelect = (action) => {
    if (action === 'login') {
      setIsLogin(true);
      setCurrentView('login');
    } else if (action === 'register') {
      setIsLogin(false);
      setCurrentView('login');
    }
  };

  const handlePriestActionSelect = (action) => {
    if (action === 'login') {
      setIsLogin(true);
      setCurrentView('login');
    } else if (action === 'register') {
      setIsLogin(false);
      setCurrentView('priest-registration-type');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handlePriestRegistrationType = (type) => {
    setPriestRegistrationType(type);
    setIsLogin(false); // Siempre es registro cuando viene de aquí
    setCurrentView('login');
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
      {currentView === 'faithful-action-select' && (
        <FaithfulActionSelector 
          key="faithful-action-select"
          onActionSelect={handleFaithfulActionSelect}
          onBack={() => setCurrentView('role-select')}
        />
      )}
      {currentView === 'priest-action-select' && (
        <PriestActionSelector 
          key="priest-action-select"
          onActionSelect={handlePriestActionSelect}
          onBack={() => setCurrentView('role-select')}
        />
      )}
      {currentView === 'priest-registration-type' && (
        <PriestRegistrationTypeSelector 
          key="priest-registration-type"
          onTypeSelect={handlePriestRegistrationType}
          onBack={() => setCurrentView('priest-action-select')}
        />
      )}
      {currentView === 'login' && (
        <LoginForm 
          key="login"
          role={selectedRole}
          isLogin={isLogin}
          priestRegistrationType={priestRegistrationType}
          onBack={() => {
            if (selectedRole === 'priest') {
              if (isLogin) {
                setCurrentView('priest-action-select');
              } else {
                setCurrentView('priest-registration-type');
              }
            } else if (selectedRole === 'faithful') {
              setCurrentView('faithful-action-select');
            } else {
              setCurrentView('role-select');
            }
          }}
          onSuccess={handleLoginSuccess}
          onSwitchMode={(mode) => {
            if (selectedRole === 'priest') {
              setCurrentView('priest-action-select');
            } else if (selectedRole === 'faithful') {
              setCurrentView('faithful-action-select');
            }
          }}
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