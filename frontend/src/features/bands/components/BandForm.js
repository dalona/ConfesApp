import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, MapPin, Users, Repeat, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const BandForm = ({ band, onSave, onCancel }) => {
  const isEdit = band?.id ? true : false;
  const isOpen = true; // Always open when component is rendered
  const [formData, setFormData] = useState({
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    location: 'Confesionario Principal',
    notes: '',
    maxCapacity: 5,
    isRecurrent: false,
    recurrenceType: 'weekly',
    recurrenceDays: [],
    recurrenceEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mié' },
    { value: 4, label: 'Jue' },
    { value: 5, label: 'Vie' },
    { value: 6, label: 'Sáb' },
    { value: 0, label: 'Dom' },
  ];

  const locationOptions = [
    'Confesionario Principal',
    'Confesionario Lateral',
    'Capilla del Santísimo',
    'Sacristía',
    'Salón Parroquial',
    'Patio de la Iglesia',
    'Otra ubicación'
  ];

  useEffect(() => {
    if (band) {
      setFormData({
        ...band,
        startTime: new Date(band.startTime),
        endTime: new Date(band.endTime),
        recurrenceEndDate: band.recurrenceEndDate ? new Date(band.recurrenceEndDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        recurrenceDays: band.recurrenceDays ? (typeof band.recurrenceDays === 'string' ? JSON.parse(band.recurrenceDays) : band.recurrenceDays) : [],
      });
    }
  }, [band]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la hora de inicio';
    }

    if (formData.startTime <= new Date()) {
      newErrors.startTime = 'La fecha debe ser en el futuro';
    }

    if (formData.maxCapacity < 1 || formData.maxCapacity > 50) {
      newErrors.maxCapacity = 'La capacidad debe estar entre 1 y 50';
    }

    if (formData.isRecurrent && formData.recurrenceDays.length === 0) {
      newErrors.recurrenceDays = 'Selecciona al menos un día para la recurrencia';
    }

    if (formData.isRecurrent && formData.recurrenceEndDate <= formData.startTime) {
      newErrors.recurrenceEndDate = 'La fecha de fin de recurrencia debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartTimeChange = (date) => {
    const endTime = new Date(date.getTime() + 60 * 60 * 1000); // Auto +1 hour
    setFormData(prev => ({
      ...prev,
      startTime: date,
      endTime: endTime
    }));
  };

  const handleRecurrenceDayToggle = (dayValue) => {
    setFormData(prev => ({
      ...prev,
      recurrenceDays: prev.recurrenceDays.includes(dayValue)
        ? prev.recurrenceDays.filter(d => d !== dayValue)
        : [...prev.recurrenceDays, dayValue]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        recurrenceEndDate: formData.recurrenceEndDate?.toISOString(),
      };

      console.log('Submitting band data:', submitData);
      await onSave(submitData);
      onCancel(); // Close the form after successful save
    } catch (error) {
      console.error('Error saving band:', error);
      
      let errorMessage = 'Error al guardar la franja';
      
      if (error.response) {
        const responseData = error.response.data;
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (Array.isArray(responseData?.message)) {
          errorMessage = responseData.message.join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
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
                {isEdit ? 'Editar Franja' : 'Nueva Franja de Confesión'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Configura los detalles de tu franja
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                Fecha y Hora de Inicio *
              </label>
              <DatePicker
                selected={formData.startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                minDate={new Date()}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                calendarClassName="purple-calendar"
              />
              {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
            </div>
            
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 mr-2 text-purple-600" />
                Fecha y Hora de Fin *
              </label>
              <DatePicker
                selected={formData.endTime}
                onChange={(date) => setFormData(prev => ({ ...prev, endTime: date }))}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                minDate={formData.startTime}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                calendarClassName="purple-calendar"
              />
              {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
            </div>
          </div>
          
          {/* Location and Capacity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                Ubicación *
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                {locationOptions.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
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
                value={formData.maxCapacity}
                onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Ej: 5"
              />
              {errors.maxCapacity && <p className="text-red-500 text-sm mt-1">{errors.maxCapacity}</p>}
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-purple-600" />
              Notas Especiales
            </label>
            <textarea
              placeholder="Información adicional para los fieles (opcional)..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
              rows="3"
            />
          </div>

          {/* Recurrence */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="recurrent"
                checked={formData.isRecurrent}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurrent: e.target.checked }))}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 mr-3"
              />
              <label htmlFor="recurrent" className="flex items-center text-sm font-semibold text-purple-700 dark:text-purple-300">
                <Repeat className="w-4 h-4 mr-2" />
                Franja Recurrente
              </label>
            </div>

            {formData.isRecurrent && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                    Tipo de Recurrencia
                  </label>
                  <select
                    value={formData.recurrenceType}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurrenceType: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                  </select>
                </div>

                {formData.recurrenceType === 'weekly' && (
                  <div>
                    <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                      Días de la Semana
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleRecurrenceDayToggle(day.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.recurrenceDays.includes(day.value)
                              ? 'bg-purple-600 text-white'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-purple-200 dark:border-purple-700'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {errors.recurrenceDays && <p className="text-red-500 text-sm mt-1">{errors.recurrenceDays}</p>}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                    Repetir Hasta
                  </label>
                  <DatePicker
                    selected={formData.recurrenceEndDate}
                    onChange={(date) => setFormData(prev => ({ ...prev, recurrenceEndDate: date }))}
                    dateFormat="dd/MM/yyyy"
                    locale={es}
                    minDate={formData.startTime}
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  {errors.recurrenceEndDate && <p className="text-red-500 text-sm mt-1">{errors.recurrenceEndDate}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-700 dark:text-red-300 text-sm">{errors.submit}</p>
            </div>
          )}
          
          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEdit ? 'Actualizar Franja' : 'Crear Franja'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-8 py-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>

      {/* Custom CSS for DatePicker */}
      <style jsx global>{`
        .purple-calendar .react-datepicker__header {
          background-color: rgb(147 51 234);
          border-color: rgb(147 51 234);
        }
        
        .purple-calendar .react-datepicker__current-month,
        .purple-calendar .react-datepicker-time__header,
        .purple-calendar .react-datepicker__day-name {
          color: white;
        }
        
        .purple-calendar .react-datepicker__day--selected,
        .purple-calendar .react-datepicker__day--keyboard-selected,
        .purple-calendar .react-datepicker__time-list-item--selected {
          background-color: rgb(147 51 234);
          color: white;
        }
        
        .purple-calendar .react-datepicker__day:hover,
        .purple-calendar .react-datepicker__time-list-item:hover {
          background-color: rgb(196 181 253);
        }
      `}</style>
    </motion.div>
  );
};

export default BandForm;