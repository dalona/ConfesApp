import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Clock, MapPin, Phone, Mail, Check, X, ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfessionRequestDetailScreen = ({ requestData, onAccept, onReject, onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleAccept = async () => {
    setLoading(true);
    try {
      if (onAccept) {
        await onAccept(requestData.id);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Por favor proporciona una razón para el rechazo');
      return;
    }
    
    setLoading(true);
    try {
      if (onReject) {
        await onReject(requestData.id, rejectReason);
      }
      setShowRejectForm(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-yellow-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <button
              onClick={onBack || (() => navigate(-1))}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Solicitud de Confesión
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Revisa y responde a la solicitud
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(requestData?.status || 'pending')}`}>
            {getStatusText(requestData?.status || 'pending')}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Faithful Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Información del Fiel
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Nombre Completo</label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {requestData?.faithful?.firstName} {requestData?.faithful?.lastName}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="text-gray-800 dark:text-gray-100">
                      {requestData?.faithful?.email || 'No proporcionado'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Teléfono</label>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="text-gray-800 dark:text-gray-100">
                      {requestData?.faithful?.phone || 'No proporcionado'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Miembro desde</label>
                  <p className="text-gray-800 dark:text-gray-100">
                    {requestData?.faithful?.createdAt ? 
                      new Date(requestData.faithful.createdAt).toLocaleDateString('es-ES') : 
                      'No disponible'
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Confession Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-green-600" />
                Detalles de la Cita
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Fecha y Hora Solicitada</label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {formatDateTime(requestData?.scheduledTime || new Date())}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Ubicación</label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {requestData?.location || 'Confesionario Principal'}
                    </p>
                  </div>
                </div>

                {requestData?.notes && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-4 mt-1">
                      <MessageCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-500 dark:text-gray-400">Notas Adicionales</label>
                      <p className="text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-1">
                        {requestData.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reject Form */}
            {showRejectForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
                  Motivo del Rechazo
                </h3>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explica brevemente por qué no puedes atender esta solicitud..."
                  className="w-full px-4 py-3 border border-red-300 dark:border-red-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                  rows="3"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={loading || !rejectReason.trim()}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Rechazando...' : 'Confirmar Rechazo'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
                Acciones Disponibles
              </h3>

              {requestData?.status === 'pending' && (
                <div className="space-y-4">
                  <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {loading ? 'Confirmando...' : 'Aceptar Solicitud'}
                  </button>

                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-red-300 text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Rechazar Solicitud
                  </button>
                </div>
              )}

              {requestData?.status !== 'pending' && (
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold ${getStatusColor(requestData?.status)}`}>
                    {requestData?.status === 'confirmed' ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                    {getStatusText(requestData?.status)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Esta solicitud ya ha sido procesada.
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Información Rápida</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Las citas confirmadas aparecerán en tu calendario</p>
                  <p>• El fiel recibirá una notificación automática</p>
                  <p>• Puedes modificar horarios desde tu dashboard</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionRequestDetailScreen;