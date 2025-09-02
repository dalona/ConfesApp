import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Users, 
  Clock, 
  MapPin,
  Edit,
  Trash2,
  Filter,
  Eye
} from 'lucide-react';

const ParishCalendar = ({ parishInfo, userRole, onRefresh }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, month
  const [assignments, setAssignments] = useState([]);
  const [priests, setPriests] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filterPriest, setFilterPriest] = useState('all');
  const [filterSpace, setFilterSpace] = useState('all');

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate, viewMode]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockPriests = [
        { id: '1', firstName: 'Juan', lastName: 'Pérez' },
        { id: '2', firstName: 'Carlos', lastName: 'López' },
        { id: '3', firstName: 'Miguel', lastName: 'Torres' }
      ];

      const mockSpaces = [
        { id: '1', name: 'Confesionario Principal' },
        { id: '2', name: 'Confesionario Lateral' },
        { id: '3', name: 'Sala de Reconciliación' }
      ];

      const mockAssignments = [
        {
          id: '1',
          priestId: '1',
          spaceId: '1',
          startTime: '2024-06-17T09:00:00',
          endTime: '2024-06-17T11:00:00',
          status: 'confirmed',
          maxCapacity: 5,
          currentBookings: 3,
          notes: 'Horario regular de lunes'
        },
        {
          id: '2',
          priestId: '2',
          spaceId: '2',
          startTime: '2024-06-17T16:00:00',
          endTime: '2024-06-17T18:00:00',
          status: 'confirmed',
          maxCapacity: 3,
          currentBookings: 1,
          notes: 'Confesiones vespertinas'
        },
        {
          id: '3',
          priestId: '1',
          spaceId: '3',
          startTime: '2024-06-18T17:00:00',
          endTime: '2024-06-18T19:00:00',
          status: 'pending',
          maxCapacity: 2,
          currentBookings: 0,
          notes: 'Nuevo horario de prueba'
        },
        {
          id: '4',
          priestId: '3',
          spaceId: '1',
          startTime: '2024-06-19T10:00:00',
          endTime: '2024-06-19T12:00:00',
          status: 'confirmed',
          maxCapacity: 5,
          currentBookings: 4,
          notes: 'Confesiones de miércoles'
        }
      ];

      setPriests(mockPriests);
      setSpaces(mockSpaces);
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAssignmentsForDay = (date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return assignments.filter(assignment => {
      const assignmentDate = new Date(assignment.startTime);
      const matchesDate = assignmentDate >= dayStart && assignmentDate <= dayEnd;
      const matchesPriest = filterPriest === 'all' || assignment.priestId === filterPriest;
      const matchesSpace = filterSpace === 'all' || assignment.spaceId === filterSpace;
      return matchesDate && matchesPriest && matchesSpace;
    });
  };

  const getPriestName = (priestId) => {
    const priest = priests.find(p => p.id === priestId);
    return priest ? `${priest.firstName} ${priest.lastName}` : 'Desconocido';
  };

  const getSpaceName = (spaceId) => {
    const space = spaces.find(s => s.id === spaceId);
    return space ? space.name : 'Desconocido';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200';
    }
  };

  const handleCreateAssignment = (date, hour = 9) => {
    // Open assignment creation modal
    console.log('Create assignment for:', date, 'at', hour);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta asignación?')) {
      try {
        setAssignments(assignments.filter(a => a.id !== assignmentId));
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando calendario...</p>
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Calendario Parroquial
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona las asignaciones de confesiones
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'week' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'month' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Mes
            </button>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 min-w-[200px] text-center">
              {viewMode === 'week' 
                ? `${weekDays[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
              }
            </h3>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
          </div>
          
          <select
            value={filterPriest}
            onChange={(e) => setFilterPriest(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">Todos los sacerdotes</option>
            {priests.map(priest => (
              <option key={priest.id} value={priest.id}>
                Padre {priest.firstName} {priest.lastName}
              </option>
            ))}
          </select>
          
          <select
            value={filterSpace}
            onChange={(e) => setFilterSpace(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">Todos los espacios</option>
            {spaces.map(space => (
              <option key={space.id} value={space.id}>
                {space.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
            <div key={index} className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 min-h-[600px]">
          {weekDays.map((day, dayIndex) => {
            const dayAssignments = getAssignmentsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={dayIndex} 
                className={`border-r border-gray-200 dark:border-gray-600 last:border-r-0 p-2 ${
                  isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                {/* Day Number */}
                <div className={`text-center mb-2 ${
                  isToday 
                    ? 'text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {day.getDate()}
                </div>

                {/* Add Assignment Button */}
                {userRole === 'priest' && (
                  <button
                    onClick={() => handleCreateAssignment(day)}
                    className="w-full mb-2 p-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Agregar asignación"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                )}

                {/* Assignments */}
                <div className="space-y-1">
                  {dayAssignments.map((assignment, index) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-all ${getStatusColor(assignment.status)}`}
                      onClick={() => handleEditAssignment(assignment)}
                    >
                      <div className="font-semibold truncate">
                        {new Date(assignment.startTime).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="truncate opacity-75">
                        {getPriestName(assignment.priestId)}
                      </div>
                      <div className="truncate opacity-75">
                        {getSpaceName(assignment.spaceId)}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {assignment.currentBookings}/{assignment.maxCapacity}
                        </span>
                        {userRole === 'priest' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAssignment(assignment);
                              }}
                              className="p-1 hover:bg-white/50 rounded"
                              title="Editar"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAssignment(assignment.id);
                              }}
                              className="p-1 hover:bg-white/50 rounded"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParishCalendar;