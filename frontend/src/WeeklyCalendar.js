import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

const WeeklyCalendar = ({ bands = [], onBandClick, onCreateBand }) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

  const getBandColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600 border-green-600';
      case 'full':
        return 'bg-red-500 hover:bg-red-600 border-red-600';
      case 'cancelled':
        return 'bg-gray-400 hover:bg-gray-500 border-gray-500';
      default:
        return 'bg-purple-500 hover:bg-purple-600 border-purple-600';
    }
  };

  const getBandPosition = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    const topPercent = ((startHour - 7) / 12) * 100; // 7 AM = 0%, 7 PM = 100%
    const heightPercent = ((endHour - startHour) / 12) * 100;
    
    return {
      top: `${Math.max(0, Math.min(100, topPercent))}%`,
      height: `${Math.max(5, Math.min(100 - topPercent, heightPercent))}%`
    };
  };

  const getNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const getPrevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-white mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Calendario de Franjas
              </h2>
              <p className="text-purple-100">
                {format(currentWeek, 'dd \'de\' MMMM', { locale: es })} - {format(addDays(currentWeek, 6), 'dd \'de\' MMMM yyyy', { locale: es })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={getPrevWeek}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-sm font-medium"
            >
              Hoy
            </button>
            <button
              onClick={getNextWeek}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        <div className="grid grid-cols-8 gap-1">
          {/* Time Labels */}
          <div className="col-span-1">
            <div className="h-12"></div> {/* Header space */}
            {hours.map(hour => (
              <div
                key={hour}
                className="h-16 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>

          {/* Days */}
          {weekDays.map((day, dayIndex) => (
            <div key={day.toISOString()} className="col-span-1 relative">
              {/* Day Header */}
              <div className={`h-12 flex flex-col items-center justify-center border-b-2 ${
                isSameDay(day, new Date()) 
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}>
                <div className={`text-xs font-medium ${
                  isSameDay(day, new Date()) 
                    ? 'text-purple-700 dark:text-purple-300' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {format(day, 'EEE', { locale: es }).toUpperCase()}
                </div>
                <div className={`text-lg font-bold ${
                  isSameDay(day, new Date()) 
                    ? 'text-purple-700 dark:text-purple-300' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>

              {/* Time Slots */}
              <div className="relative h-[52rem]"> {/* 13 hours * 4rem = 52rem */}
                {/* Hour Lines */}
                {hours.map(hour => (
                  <div
                    key={hour}
                    className="absolute w-full border-b border-gray-100 dark:border-gray-700"
                    style={{ top: `${((hour - 7) / 12) * 100}%` }}
                  />
                ))}

                {/* Create Band Button (on hover or click) */}
                <button
                  onClick={() => onCreateBand && onCreateBand(day)}
                  className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-center group"
                >
                  <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                    + Crear Franja
                  </div>
                </button>

                {/* Bands for this day */}
                {bands
                  .filter(band => isSameDay(new Date(band.startTime), day))
                  .map(band => {
                    const position = getBandPosition(band.startTime, band.endTime);
                    return (
                      <motion.div
                        key={band.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => onBandClick && onBandClick(band)}
                        className={`absolute left-1 right-1 rounded-lg border-l-4 cursor-pointer shadow-sm z-10 ${getBandColor(band.status)}`}
                        style={position}
                      >
                        <div className="p-2 text-white">
                          <div className="text-xs font-bold flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(new Date(band.startTime), 'HH:mm')} - {format(new Date(band.endTime), 'HH:mm')}
                          </div>
                          {band.location && (
                            <div className="text-xs opacity-90 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {band.location}
                            </div>
                          )}
                          <div className="text-xs opacity-90 flex items-center mt-1">
                            <Users className="w-3 h-3 mr-1" />
                            {band.currentBookings || 0}/{band.maxCapacity}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Llena</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Cancelada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;