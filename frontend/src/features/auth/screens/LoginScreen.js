import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cross, ArrowLeft, User, Mail, Lock, Phone, FileText, Building } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/authService';

const LoginScreen = ({ 
  role, 
  isLogin, 
  priestRegistrationType, 
  onBack, 
  onSuccess, 
  onSwitchMode 
}) => {
  const { login } = useAuth();
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email inválido';
      case 'password':
        return value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres';
      case 'firstName':
      case 'lastName':
        return value.trim().length >= 2 ? '' : 'Debe tener al menos 2 caracteres';
      case 'phone':
        return /^[+]?[\d\s-()]+$/.test(value) && value.length >= 8 ? '' : 'Teléfono inválido';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validate on blur
    setTimeout(() => {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setErrors({});

    try {
      let response;
      
      if (isLogin) {
        // Login
        response = await authService.login(formData.email, formData.password);
      } else {
        // Registration
        if (role === 'faithful') {
          // Faithful registration - only send required fields
          const faithfulData = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            role: 'faithful'
          };
          response = await authService.register(faithfulData);
        } else if (role === 'priest') {
          if (priestRegistrationType === 'invitation') {
            // Register from invitation
            response = await authService.registerFromInvite(formData.invitationToken, {
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone
            });
          } else {
            // Direct priest application
            response = await authService.registerPriest({
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
              bio: formData.bio,
              specialties: formData.specialties,
              languages: formData.languages
            });
          }
        }
      }

      if (response.access_token && response.user) {
        login(response.user, response.access_token);
        onSuccess();
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (Array.isArray(message)) {
          // Handle validation errors
          message.forEach(err => {
            if (err.includes('email')) {
              setErrors(prev => ({ ...prev, email: err }));
            } else if (err.includes('password')) {
              setErrors(prev => ({ ...prev, password: err }));
            } else {
              setGeneralError(err);
            }
          });
        } else {
          setGeneralError(message);
        }
      } else {
        setGeneralError('Error de conexión. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    const fields = [];

    // Email (always required)
    fields.push(
      <div key="email">
        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Mail className="w-4 h-4 mr-2 text-blue-600" />
          Email *
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-300' : 'border-purple-200 dark:border-purple-700'} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
          placeholder="tu@email.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
    );

    // Password (always required)
    fields.push(
      <div key="password">
        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <Lock className="w-4 h-4 mr-2 text-blue-600" />
          Contraseña *
        </label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 ${errors.password ? 'border-red-300' : 'border-purple-200 dark:border-purple-700'} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
          placeholder={isLogin ? 'Tu contraseña' : 'Crea una contraseña'}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
    );

    if (!isLogin) {
      // Registration fields
      fields.push(
        <div key="names" className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Nombre *
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 ${errors.firstName ? 'border-red-300' : 'border-purple-200 dark:border-purple-700'} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
              placeholder="Juan"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Apellido *
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 ${errors.lastName ? 'border-red-300' : 'border-purple-200 dark:border-purple-700'} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
              placeholder="Pérez"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>
      );

      fields.push(
        <div key="phone">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4 mr-2 text-blue-600" />
            Teléfono *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-300' : 'border-purple-200 dark:border-purple-700'} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
            placeholder="+34 600 123 456"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      );

      // Priest-specific fields
      if (role === 'priest') {
        if (priestRegistrationType === 'invitation') {
          fields.push(
            <div key="invitation">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                Código de Invitación *
              </label>
              <input
                type="text"
                name="invitationToken"
                required
                value={formData.invitationToken}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Código recibido del obispo"
              />
            </div>
          );
        } else {
          // Application fields
          fields.push(
            <div key="bio">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Información Ministerial
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                rows="3"
                placeholder="Breve descripción de tu ministerio..."
              />
            </div>
          );
        }
      }
    }

    return fields;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Cross className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">ConfesApp</h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Atrás
          </button>
        </motion.header>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {role === 'priest' ? <Cross className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {role === 'priest' ? 'Acceso para Sacerdotes' : 'Acceso para Fieles'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}

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
                  onSwitchMode(!isLogin);
                }}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;