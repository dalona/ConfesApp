import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

// Icons
import { Cross, Calendar, Users, Moon, Sun, User, LogOut, Mail, FileText, ArrowLeft, Grid, List, Plus, Edit, Trash2, BarChart3 } from 'lucide-react';

// Images
import homepageImage from './assets/images/homepage-confession.png';
import logoImage from './assets/images/logo.png';

// Role Icons
import bishopIcon from './assets/images/roles/bishop.png';
import priestIcon from './assets/images/roles/priest.png';
import coordinatorIcon from './assets/images/roles/coordinator.png';
import faithfulIcon from './assets/images/roles/faithful.png';

// Import components
import WeeklyCalendar from './features/calendar/components/WeeklyCalendar';
import BandForm from './features/bands/components/BandForm';

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
            <img src={logoImage} alt="ConfesApp Logo" className="w-8 h-8" />
            <span className="text-2xl text-purple-900 dark:text-purple-300 heading-primary">ConfesApp</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">Inicio</a>
            <a href="#que-es-la-confesion" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">¿Qué es la confesión?</a>
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
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = [
    {
      src: homepageImage,
      alt: "Confesión - Vuelve a la gracia",
      title: "Vuelve a la gracia"
    }
    // Estructura preparada para más imágenes
  ];

  const testimonials = [
    {
      name: "Padre Juan Carlos",
      role: "Parroquia San Miguel",
      text: "ConfesApp ha revolucionado mi ministerio. Más fieles han vuelto al sacramento de la reconciliación.",
      rating: 5,
      image: "🙏"
    },
    {
      name: "María González",
      role: "Fiel de la comunidad",
      text: "Encontrar tiempo para la confesión nunca había sido tan sencillo. Me ayuda a prepararme espiritualmente.",
      rating: 5,
      image: "✨"
    },
    {
      name: "Padre Luis Martín",
      role: "Catedral del Carmen",
      text: "La organización de horarios y la preparación de los fieles ha mejorado notablemente.",
      rating: 5,
      image: "⛪"
    }
  ];

  const stats = [
    { number: "20+", label: "Parroquias activas", icon: "⛪" },
    { number: "500+", label: "Confesiones agendadas", icon: "🙏" },
    { number: "3", label: "Idiomas disponibles", icon: "🌍" },
    { number: "98%", label: "Satisfacción usuario", icon: "⭐" }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Elige tu parroquia",
      description: "Busca y selecciona la parroquia más cercana a ti",
      icon: "⛪"
    },
    {
      step: 2,
      title: "Selecciona horario",
      description: "Elige el sacerdote y el horario que mejor te convenga",
      icon: "🗓️"
    },
    {
      step: 3,
      title: "Prepárate espiritualmente",
      description: "Recibe guías y recordatorios para una buena confesión",
      icon: "🙏"
    }
  ];

  const roles = [
    {
      title: "Obispo",
      description: "Supervisa todas las parroquias de su diócesis",
      details: "Visualiza estadísticas globales y acompaña pastoralmente a sacerdotes y coordinadores.",
      icon: <img src={bishopIcon} alt="Obispo" className="w-16 h-16 object-cover rounded-full bg-white p-2 shadow-inner" />,
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Sacerdote",
      description: "Gestiona su agenda de confesiones",
      details: "Sirve al ministerio de la reconciliación como un reflejo del amor redentor de Dios",
      icon: <img src={priestIcon} alt="Sacerdote" className="w-16 h-16 object-cover rounded-full bg-white p-2 shadow-inner" />,
      color: "from-purple-600 to-indigo-600",
      highlight: true
    },
    {
      title: "Coordinador Parroquial",
      description: "Apoya la organización pastoral",
      details: "Administra horarios, espacios y notificaciones para facilitar la gestión práctica.",
      icon: <img src={coordinatorIcon} alt="Coordinador" className="w-16 h-16 object-cover rounded-full bg-white p-2 shadow-inner" />,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Fiel",
      description: "Encuentra y agenda su confesión",
      details: "Accede fácilmente a parroquias, sacerdotes y recibe guías de preparación espiritual.",
      icon: <img src={faithfulIcon} alt="Fiel" className="w-16 h-16 object-cover rounded-full bg-white p-2 shadow-inner" />,
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navbar />
      
      {/* Internationalización Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 pb-4"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/20 dark:to-blue-400/20 rounded-2xl p-4 text-center border border-purple-200 dark:border-purple-700">
            <p className="text-purple-800 dark:text-purple-200 text-body">
              🌍 Disponible en español e inglés <span className="text-purple-600 dark:text-purple-400 font-medium">(pronto más idiomas)</span>
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced Hero Section */}
      <section className="pt-12 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-purple-900 dark:text-purple-100 mb-6 heading-primary">
              {heroImages[currentHeroImage].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-body">
              Encuentra, agenda y prepárate para tu confesión de manera sencilla y reverente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRoleSelect('role-select')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 text-ui-semibold"
              >
                Agendar confesión
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 px-12 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-ui-semibold"
              >
                Ver cómo funciona
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Hero Image with Carousel Structure */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="rounded-3xl overflow-hidden shadow-3xl relative">
              <img 
                src={heroImages[currentHeroImage].src}
                alt={heroImages[currentHeroImage].alt}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                  <p className="text-sm text-ui-medium">Sacramento de la Reconciliación</p>
                </div>
              </div>
            </div>
            {/* Carousel indicators (preparado para múltiples imágenes) */}
            {heroImages.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroImage(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentHeroImage 
                        ? 'bg-purple-600 w-8' 
                        : 'bg-purple-300 hover:bg-purple-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Saints Section - What is Confession */}
      <section id="que-es-la-confesion" className="py-16 px-4 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:via-purple-900/50 dark:to-blue-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
              ¿Qué es la Confesión?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-body max-w-3xl mx-auto">
              Descubre la sabiduría de los Santos sobre el Sacramento de la Reconciliación
            </p>
          </motion.div>

          {/* Saints Cards Slider */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "San Juan Pablo II",
                  quote: "La confesión es un encuentro con la misericordia de Dios que siempre nos espera con los brazos abiertos.",
                  icon: "👤",
                  color: "from-amber-500 to-yellow-600"
                },
                {
                  name: "Santa Teresa de Ávila",
                  quote: "El alma que se confiesa con humildad encuentra en el sacramento un bálsamo que la renueva por completo.",
                  icon: "🌹",
                  color: "from-rose-500 to-pink-600"
                },
                {
                  name: "San Agustín",
                  quote: "Dios nos llama a la confesión no para condenarnos, sino para sanarnos y devolvernos la paz.",
                  icon: "📖",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  name: "San Pío de Pietrelcina (Padre Pío)",
                  quote: "La confesión es el canal por el que la gracia de Dios fluye para lavar nuestras almas.",
                  icon: "✋",
                  color: "from-purple-500 to-violet-600"
                },
                {
                  name: "Santa Faustina Kowalska",
                  quote: "En la confesión, el alma se sumerge en la infinita misericordia de Dios y sale renovada como un nuevo ser.",
                  icon: "💧",
                  color: "from-cyan-500 to-blue-600"
                }
              ].map((saint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all group"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${saint.color} flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform`}>
                    {saint.icon}
                  </div>
                  <h3 className="text-xl text-purple-900 dark:text-purple-100 mb-4 heading-secondary text-center font-bold">
                    {saint.name}
                  </h3>
                  <blockquote className="text-gray-700 dark:text-gray-300 text-body text-center italic leading-relaxed">
                    "{saint.quote}"
                  </blockquote>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
              Impacto y Confianza
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-body max-w-2xl mx-auto">
              Miles de fieles y cientos de sacerdotes ya confían en ConfesApp
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-100 mb-2 heading-primary">
                  {stat.number}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm text-body">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
              ¿Por qué elegir ConfesApp?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-body max-w-3xl mx-auto">
              Tecnología al servicio de la fe, diseñada con reverencia y simplicidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-purple-900 dark:text-purple-100 mb-4 heading-secondary">Agenda fácil</h3>
              <p className="text-gray-600 dark:text-gray-300 text-body">
                Reserva tu tiempo de confesión de manera simple y rápida
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Cross className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-purple-900 dark:text-purple-100 mb-4 heading-secondary">Ambiente reverente</h3>
              <p className="text-gray-600 dark:text-gray-300 text-body">
                Diseñado con respeto y devoción por este sacramento
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-purple-900 dark:text-purple-100 mb-4 heading-secondary">Para todos</h3>
              <p className="text-gray-600 dark:text-gray-300 text-body">
                Un solo cuerpo en el amor de Cristo. Un solo corazón, una sola Iglesia.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/5 to-blue-900/5 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-body max-w-2xl mx-auto">
              Solo 3 pasos simples para agendar tu confesión
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                    {step.icon}
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold absolute -top-4 left-1/2 transform -translate-x-1/2">
                    {step.step}
                  </div>
                  <h3 className="text-xl text-purple-900 dark:text-purple-100 mb-4 heading-secondary">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-body">
                    {step.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-purple-300 dark:bg-purple-600"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
              Para toda la comunidad católica
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-body max-w-3xl mx-auto">
              ConfesApp sirve a cada miembro de la comunidad parroquial
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all group ${
                  role.highlight 
                    ? 'bg-gradient-to-br from-purple-600/10 to-blue-600/10 dark:from-purple-400/20 dark:to-blue-400/20 border-2 border-purple-200 dark:border-purple-600' 
                    : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
                }`}
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {role.icon}
                </div>
                <h3 className="text-xl text-purple-900 dark:text-purple-100 mb-3 heading-secondary text-center">
                  {role.title}
                </h3>
                <p className="text-purple-700 dark:text-purple-300 mb-3 text-body text-center font-medium">
                  {role.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm text-body text-center">
                  {role.details.includes('amor redentor de Dios') ? (
                    <>
                      {role.details.split('como un reflejo del amor redentor de Dios')[0]}
                      <span className="text-amber-600 dark:text-amber-400 font-medium italic">
                        como un reflejo del amor redentor de Dios
                      </span>
                      {role.details.split('como un reflejo del amor redentor de Dios')[1]}
                    </>
                  ) : (
                    role.details
                  )}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
              Testimonios
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-body max-w-2xl mx-auto">
              Experiencias reales de nuestra comunidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-2xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="text-lg text-purple-900 dark:text-purple-100 heading-secondary">
                      {testimonial.name}
                    </h4>
                    <p className="text-purple-600 dark:text-purple-400 text-sm text-body">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-body italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-purple-900 dark:bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img src={logoImage} alt="ConfesApp Logo" className="w-10 h-10 mr-3" />
                <span className="text-2xl heading-primary">ConfesApp</span>
              </div>
              <p className="text-purple-100 text-body mb-6 max-w-md">
                Tecnología al servicio de la fe. Facilitamos el encuentro con la gracia divina a través del sacramento de la reconciliación.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg heading-secondary mb-4">Enlaces</h4>
              <ul className="space-y-2 text-body">
                <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#" className="text-purple-100 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg heading-secondary mb-4">Contacto</h4>
              <ul className="space-y-2 text-body">
                <li className="text-purple-100">contacto@confesapp.com</li>
                <li className="text-purple-100">Soporte técnico</li>
                <li className="text-purple-100">Guía pastoral</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-800 pt-8 text-center">
            <p className="text-purple-100 text-body italic text-lg mb-4">
              "ConfesApp – Volviendo a la gracia"
            </p>
            <p className="text-purple-200 text-sm">
              © 2025 ConfesApp. Hecho con ❤️ para la comunidad católica.
            </p>
          </div>
        </div>
      </footer>
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
        <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
          ¿Cómo deseas usar ConfesApp?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-body">
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
              <h3 className="text-xl text-purple-900 dark:text-purple-100 mb-2 heading-secondary">
                {role.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-body">
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

// Coordinator Invite Form Component
const CoordinatorInviteForm = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onInvite(formData);
      onClose();
      setFormData({ email: '', firstName: '', lastName: '', message: '' });
    } catch (error) {
      console.error('Error inviting coordinator:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                Invitar Coordinador
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Invita a un nuevo coordinador parroquial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Cross className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="coordinador@parroquia.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Juan"
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Apellido *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              Mensaje Personal (opcional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
              rows="3"
              placeholder="Hola Juan, me gustaría invitarte a ser coordinador de nuestra parroquia..."
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Se enviará una invitación por email con un enlace para completar el registro
              </span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando Invitación...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar Invitación
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-8 py-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Coordinators Management Component
const CoordinatorsManagement = ({ coordinators, onInvite, onRemove }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-white mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Coordinadores Parroquiales
              </h2>
              <p className="text-purple-100">
                Gestiona tu equipo de coordinadores
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInvite}
            className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Invitar Coordinador
          </motion.button>
        </div>
      </div>
      
      <div className="p-8">
        {coordinators.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No tienes coordinadores asignados
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Invita coordinadores para ayudarte con la gestión parroquial
            </p>
            <button
              onClick={onInvite}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              + Invitar Primer Coordinador
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {coordinators.map((coordinator, index) => (
              <motion.div
                key={coordinator.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all hover:border-purple-300 dark:hover:border-purple-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {coordinator.user?.firstName} {coordinator.user?.lastName}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {coordinator.user?.email}
                      <span className="mx-2">•</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      Desde {new Date(coordinator.assignedAt || coordinator.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Activo
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onRemove(coordinator.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remover coordinador"
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
  );
};

const PriestDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'list', 'coordinators'
  const [bands, setBands] = useState([]);
  const [confessions, setConfessions] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBandForm, setShowBandForm] = useState(false);
  const [showCoordinatorForm, setShowCoordinatorForm] = useState(false);
  const [selectedBand, setSelectedBand] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bandsResponse, confessionsResponse, coordinatorsResponse] = await Promise.all([
        axios.get(`${API}/confession-bands/my-bands`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('Error fetching bands:', error);
          if (error.response?.status === 401) {
            console.log('Authentication error, token may be invalid');
          }
          throw error;
        }),
        axios.get(`${API}/confessions`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('Error fetching confessions:', error);
          return { data: [] };
        }),
        axios.get(`${API}/parish-staff`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('Error fetching coordinators:', error);
          return { data: [] };
        })
      ]);

      console.log('Bands fetched:', bandsResponse.data);
      console.log('Confessions fetched:', confessionsResponse.data);
      console.log('Coordinators fetched:', coordinatorsResponse.data);

      setBands(Array.isArray(bandsResponse.data) ? bandsResponse.data : []);
      setConfessions(Array.isArray(confessionsResponse.data) ? confessionsResponse.data : []);
      setCoordinators(Array.isArray(coordinatorsResponse.data) ? coordinatorsResponse.data.filter(c => c.role === 'parish_coordinator') : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Set empty data to prevent render errors
      setBands([]);
      setConfessions([]);
      setCoordinators([]);
      
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
      alert('Franja eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting band:', error);
      alert(error.response?.data?.message || 'Error al eliminar la franja');
    }
  };

  const handleInviteCoordinator = async (coordinatorData) => {
    try {
      await axios.post(`${API}/invites/coordinator`, coordinatorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchData(); // Refresh data
      setShowCoordinatorForm(false);
      alert('Invitación enviada exitosamente');
    } catch (error) {
      console.error('Error inviting coordinator:', error);
      alert(error.response?.data?.message || 'Error al enviar la invitación');
    }
  };

  const handleRemoveCoordinator = async (coordinatorId) => {
    if (!window.confirm('¿Estás seguro de que quieres remover este coordinador? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await axios.delete(`${API}/parish-staff/${coordinatorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
      alert('Coordinador removido exitosamente');
    } catch (error) {
      console.error('Error removing coordinator:', error);
      alert(error.response?.data?.message || 'Error al remover el coordinador');
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
              <button
                onClick={() => setActiveTab('coordinators')}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'coordinators'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Coordinadores
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
            {activeTab === 'coordinators' && (
              <CoordinatorsManagement 
                coordinators={coordinators}
                onInvite={() => setShowCoordinatorForm(true)}
                onRemove={handleRemoveCoordinator}
              />
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
                    name="startTime"
                    type="datetime-local"
                    required
                    defaultValue={selectedBand?.startTime ? new Date(selectedBand.startTime).toISOString().slice(0, 16) : ''}
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Fecha y Hora de Fin *
                  </label>
                  <input
                    name="endTime"
                    type="datetime-local"
                    required
                    defaultValue={selectedBand?.endTime ? new Date(selectedBand.endTime).toISOString().slice(0, 16) : ''}
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
                  <select 
                    name="location"
                    defaultValue={selectedBand?.location || 'Confesionario Principal'}
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
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
                    name="maxCapacity"
                    type="number"
                    min="1"
                    max="50"
                    required
                    defaultValue={selectedBand?.maxCapacity || 5}
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
                  name="notes"
                  placeholder="Información adicional para los fieles (opcional)..."
                  defaultValue={selectedBand?.notes || ''}
                  className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  rows="3"
                />
              </div>

              {/* Recurrence Section */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <input
                    name="recurrent"
                    type="checkbox"
                    id="recurrent"
                    defaultChecked={selectedBand?.isRecurrent || false}
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
                    <select 
                      name="recurrenceType"
                      defaultValue={selectedBand?.recurrenceType || 'weekly'}
                      className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                      Días de la Semana (para recurrencia semanal)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                        <button
                          key={day}
                          type="button"
                          data-day={index + 1}
                          onClick={(e) => {
                            e.target.classList.toggle('bg-purple-600');
                            e.target.classList.toggle('text-white');
                            e.target.classList.toggle('bg-white');
                            e.target.classList.toggle('text-gray-700');
                          }}
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
                      name="recurrenceEndDate"
                      type="date"
                      defaultValue={selectedBand?.recurrenceEndDate ? new Date(selectedBand.recurrenceEndDate).toISOString().split('T')[0] : ''}
                      className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault();
                    
                    // Collect form data properly
                    const form = e.target.closest('form');
                    const formData = new FormData(form);
                    
                    // Get selected days for recurrence
                    const selectedDays = Array.from(form.querySelectorAll('button[data-day]'))
                      .filter(btn => btn.classList.contains('bg-purple-600'))
                      .map(btn => parseInt(btn.dataset.day));
                    
                    // Prepare band data
                    const startTime = formData.get('startTime');
                    const endTime = formData.get('endTime');
                    
                    if (!startTime || !endTime) {
                      alert('Por favor, completa las fechas y horas requeridas');
                      return;
                    }
                    
                    // VALIDACIONES DE FECHA
                    const startDateTime = new Date(startTime);
                    const endDateTime = new Date(endTime);
                    const now = new Date();
                    
                    if (startDateTime <= now) {
                      alert('La fecha y hora de inicio debe ser en el futuro');
                      return;
                    }
                    
                    if (endDateTime <= startDateTime) {
                      alert('La fecha y hora de fin debe ser posterior al inicio');
                      return;
                    }
                    
                    // Validar que la diferencia no sea mayor a 8 horas
                    const diffHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
                    if (diffHours > 8) {
                      alert('Una franja no puede durar más de 8 horas');
                      return;
                    }
                    
                    if (diffHours < 0.5) {
                      alert('Una franja debe durar al menos 30 minutos');
                      return;
                    }
                    
                    const maxCapacity = parseInt(formData.get('maxCapacity') || '5');
                    if (maxCapacity < 1 || maxCapacity > 50) {
                      alert('La capacidad debe estar entre 1 y 50 personas');
                      return;
                    }
                    
                    const bandData = {
                      startTime: new Date(startTime).toISOString(),
                      endTime: new Date(endTime).toISOString(),
                      location: formData.get('location') || 'Confesionario Principal',
                      maxCapacity: parseInt(formData.get('maxCapacity') || '5'),
                      notes: formData.get('notes') || '',
                      isRecurrent: formData.get('recurrent') === 'on',
                      recurrenceType: formData.get('recurrenceType') || 'weekly',
                      recurrenceDays: formData.get('recurrent') === 'on' ? selectedDays : [],
                      recurrenceEndDate: formData.get('recurrenceEndDate') ? new Date(formData.get('recurrenceEndDate')).toISOString() : null
                    };

                    console.log('Submitting band data:', bandData);

                    try {
                      await handleSaveBand(bandData);
                      alert(isEditMode ? 'Franja actualizada exitosamente' : 'Franja creada exitosamente');
                    } catch (error) {
                      console.error('Error saving band:', error);
                      alert(error.message || 'Error al guardar la franja');
                    }
                  }}
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

      {/* Coordinator Invite Form Modal */}
      {showCoordinatorForm && (
        <CoordinatorInviteForm 
          isOpen={showCoordinatorForm}
          onClose={() => setShowCoordinatorForm(false)}
          onInvite={handleInviteCoordinator}
        />
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
      // Fetch both legacy confession slots and new confession bands
      const [slotsResponse, bandsResponse, confessionsResponse] = await Promise.all([
        axios.get(`${API}/confession-slots/available`).catch(error => {
          console.error('Error fetching slots:', error);
          return { data: [] };
        }),
        axios.get(`${API}/confession-bands`).catch(error => {
          console.error('Error fetching bands:', error);
          return { data: [] };
        }),
        axios.get(`${API}/confessions`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          console.error('Error fetching confessions:', error);
          return { data: [] };
        })
      ]);

      // Combine slots and bands for available appointments
      const slots = Array.isArray(slotsResponse.data) ? slotsResponse.data : [];
      const bands = Array.isArray(bandsResponse.data) ? bandsResponse.data : [];
      
      // Filter available bands (not full or cancelled)
      const availableBands = bands.filter(band => 
        band.status === 'available' && 
        new Date(band.startTime) > new Date()
      );
      
      // Combine all available appointments
      const allAvailable = [...slots, ...availableBands];
      
      setCitasDisponibles(allAvailable);
      setMisConfesiones(Array.isArray(confessionsResponse.data) ? confessionsResponse.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays to prevent null/undefined errors
      setCitasDisponibles([]);
      setMisConfesiones([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get datetime info from either system
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
      // Fallback for confession without slot or band info
      const scheduledTime = confession.scheduledTime ? new Date(confession.scheduledTime) : new Date();
      return {
        startTime: scheduledTime,
        endTime: new Date(scheduledTime.getTime() + 60*60*1000),
        location: 'No especificado',
        priest: 'Sacerdote'
      };
    }
  };

  // Helper function to safely format citation info
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

  const bookConfession = async (citaId) => {
    let requestData = {};
    
    try {
      // Find the appointment in our available list
      const cita = citasDisponibles.find(c => c.id === citaId);
      
      if (cita) {
        // Determine if this is a slot or band based on available properties
        if (cita.maxCapacity !== undefined) {
          // This is likely a confession band (has maxCapacity)
          requestData = { confessionBandId: citaId };
        } else {
          // This is likely a confession slot (legacy)
          requestData = { confessionSlotId: citaId };
        }
      } else {
        // Fallback: try as confession slot first
        requestData = { confessionSlotId: citaId };
      }

      console.log('Booking confession:', requestData);

      await axios.post(`${API}/confessions`, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchData(); // Refresh data
      alert('¡Cita reservada exitosamente!');
    } catch (error) {
      console.error('Error booking confession:', error);
      
      // If it failed as a slot, try as a band (fallback)  
      if (error.response?.status === 400) {
        const originalData = { confessionSlotId: citaId };
        if (JSON.stringify(requestData) === JSON.stringify(originalData)) {
          try {
            console.log('Retrying as confession band...');
            await axios.post(`${API}/confessions`, 
              { confessionBandId: citaId }, 
              { headers: { Authorization: `Bearer ${token}` }}
            );
            
            fetchData(); // Refresh data
            alert('¡Cita reservada exitosamente!');
          } catch (secondError) {
            console.error('Error booking as band:', secondError);
            alert(secondError.response?.data?.message || 'Error al reservar la cita');
          }
        } else {
          alert(error.response?.data?.message || 'Error al reservar la cita');
        }
      } else {
        alert(error.response?.data?.message || 'Error al reservar la cita');
      }
    }
  };

  const cancelConfession = async (confessionId) => {
    console.log('cancelConfession called with ID:', confessionId);
    console.log('misConfesiones:', misConfesiones);
    
    // Temporarily skip confirmation dialog due to browser security restrictions
    // if (!window.confirm('¿Estás seguro de que quieres cancelar esta cita? Esta acción no se puede deshacer.')) {
    //   return;
    // }

    try {
      // Find the confession to determine which system it belongs to
      const confession = misConfesiones.find(c => c.id === confessionId);
      console.log('Found confession:', confession);
      
      let cancelEndpoint;
      if (confession?.confessionBandId) {
        // This confession was booked through confession bands system
        cancelEndpoint = `${API}/confession-bands/bookings/${confessionId}/cancel`;
        console.log('Using confession bands endpoint:', cancelEndpoint);
      } else {
        // This confession was booked through legacy confession slots system
        cancelEndpoint = `${API}/confessions/${confessionId}/cancel`;
        console.log('Using legacy confessions endpoint:', cancelEndpoint);
      }

      console.log('Making request to:', cancelEndpoint);
      const response = await axios.patch(cancelEndpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cancel response:', response);
      
      fetchData(); // Refresh data
      alert('Cita cancelada exitosamente');
    } catch (error) {
      console.error('Error canceling confession:', error);
      alert(error.response?.data?.message || 'Error al cancelar la cita');
    }
  };

  const canCancelConfession = (confession) => {
    if (confession.status !== 'booked') return false;
    
    // Get the confession time from the appropriate source
    let confessionTime;
    if (confession.confessionBand) {
      confessionTime = new Date(confession.confessionBand.startTime);
    } else if (confession.confessionSlot) {
      confessionTime = new Date(confession.confessionSlot.startTime);
    } else {
      confessionTime = new Date(confession.scheduledTime);
    }
    
    // Check if confession is at least 2 hours in the future
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
                  {citasDisponibles.filter(cita => cita && (cita.startTime || cita.scheduledTime)).map((cita, index) => {
                    const citaInfo = getCitaInfo(cita);
                    return (
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
                              {new Date(citaInfo.startTime).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(citaInfo.startTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} - 
                              {new Date(citaInfo.endTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                              <span className="mx-2">•</span>
                              <Cross className="w-3 h-3 mr-1" />
                              {citaInfo.location}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => bookConfession(cita.id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          Reservar
                        </motion.button>
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
                  {misConfesiones.filter(confesion => confesion && (confesion.confessionSlot || confesion.confessionBand || confesion.scheduledTime)).map((confesion, index) => {
                    const confessionInfo = getConfessionInfo(confesion);
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
                              {new Date(confessionInfo.startTime).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(confessionInfo.startTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} - 
                              {new Date(confessionInfo.endTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                              <span className="mx-2">•</span>
                              <Cross className="w-3 h-3 mr-1" />
                              {confessionInfo.location}
                              <span className="mx-2">•</span>
                              <User className="w-3 h-3 mr-1" />
                              {confessionInfo.priest}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            confesion.status === 'booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            confesion.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            confesion.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {confesion.status === 'booked' ? 'Reservada' :
                             confesion.status === 'completed' ? 'Completada' :
                             confesion.status === 'cancelled' ? 'Cancelada' :
                             confesion.status}
                          </span>
                          
                          {/* Action buttons for booked confessions */}
                          {confesion.status === 'booked' && (
                            <div className="flex space-x-2">
                              {canCancelConfession(confesion) && (
                                <button
                                  onClick={() => cancelConfession(confesion.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Cancelar cita"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
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
        <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
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
        <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
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
        <h2 className="text-4xl md:text-5xl text-purple-900 dark:text-purple-100 mb-4 heading-primary">
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