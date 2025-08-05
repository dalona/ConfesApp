import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Users, ArrowLeft, CheckCircle, User, Mail } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const CoordinatorRegister = ({ token, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    acceptTerms: false,
  });
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(null);

  useEffect(() => {
    loadInviteData();
  }, [token]);

  const loadInviteData = async () => {
    try {
      const response = await axios.get(`${API}/invites/coordinator/token/${token}`);
      setInviteData(response.data);
      setLoading(false);

      // Check if user already exists by trying to get user info
      // We'll determine this based on the backend response during submission
    } catch (error) {
      console.error('Error loading invite data:', error);
      setGeneralError(getErrorMessage(error));
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    if (error?.response?.data?.message) {
      const message = error.response.data.message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      return message;
    }
    return error.message || 'Error inesperado';
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
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

      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número';
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
    
    if (name !== 'acceptTerms') {
      validateField(name, fieldValue);
    }
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First submission attempt - we don't know if user exists yet
    setSubmitting(true);
    setGeneralError('');

    try {
      const payload = {
        ...formData,
      };

      const response = await axios.post(`${API}/auth/register-coordinator/${token}`, payload);
      
      if (response.data.access_token) {
        // Success - redirect to coordinator dashboard
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        onSuccess({
          message: response.data.message,
          user: response.data.user,
          isNewUser: response.data.isNewUser,
          coordinator: response.data.coordinator,
        });
      }
    } catch (error) {
      console.error('Error en registro de coordinador:', error);
      
      // Check if it's an existing user scenario
      if (error.response?.status === 409 || error.response?.data?.message?.includes('ya existe')) {
        setIsExistingUser(true);
        // Clear password requirement for existing users
        setFormData(prev => ({ ...prev, password: '' }));
        const newErrors = { ...errors };
        delete newErrors.password;
        setErrors(newErrors);
        setGeneralError('Este usuario ya existe. Solo confirma para activar tu rol de coordinador.');
      } else {
        setGeneralError(getErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Invitación Inválida
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {generalError || 'Esta invitación no es válida o ha expirado.'}
          </p>
          <button 
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                Coordinador Parroquial
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {isExistingUser 
                  ? 'Confirma tu nuevo rol de coordinador'
                  : 'Completa tu registro como coordinador'
                }
              </p>
            </div>

            {/* Invite Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Invitado por: {inviteData.createdBy?.firstName} {inviteData.createdBy?.lastName}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Parroquia: {inviteData.parish?.name}
                </span>
              </div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                Email: {inviteData.email}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isExistingUser && (
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
                      placeholder="Apellido *"
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
                    {!errors.password && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        • Mínimo 8 caracteres<br/>
                        • Al menos 1 mayúscula, 1 minúscula y 1 número
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  required
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 mr-3"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-600 dark:text-gray-400">
                  {isExistingUser 
                    ? 'Acepto mi nuevo rol como coordinador parroquial'
                    : 'Acepto los términos y condiciones'
                  }
                </label>
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
                disabled={submitting || Object.keys(errors).length > 0 || !formData.acceptTerms}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : isExistingUser ? (
                  'Activar Rol de Coordinador'
                ) : (
                  'Completar Registro'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <button 
                onClick={onBack}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoordinatorRegister;