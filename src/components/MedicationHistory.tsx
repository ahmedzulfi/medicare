import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, X } from 'lucide-react';
import { Medication, MedicationDose } from '../types/medication';

interface MedicationHistoryProps {
  medications: Medication[];
  doses: MedicationDose[];
  onClose: () => void;
  darkMode: boolean;
}

export default function MedicationHistory({
  medications,
  doses,
  onClose,
  darkMode
}: MedicationHistoryProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDayDoses = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return doses.filter(dose => dose.date === dateStr);
  };

  const getComplianceRate = () => {
    const totalDoses = doses.length;
    const takenDoses = doses.filter(dose => dose.taken).length;
    return totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
  };

  const getDayStatus = (dayDoses: MedicationDose[]) => {
    if (dayDoses.length === 0) return 'none';
    const allTaken = dayDoses.every(dose => dose.taken);
    const someTaken = dayDoses.some(dose => dose.taken);
    if (allTaken) return 'complete';
    if (someTaken) return 'partial';
    return 'missed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return darkMode ? 'bg-green-600' : 'bg-green-500';
      case 'partial':
        return darkMode ? 'bg-yellow-600' : 'bg-yellow-500';
      case 'missed':
        return darkMode ? 'bg-red-600' : 'bg-red-500';
      default:
        return darkMode ? 'bg-gray-700' : 'bg-gray-200';
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Medication History
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <div className="flex items-center space-x-3">
                <TrendingUp className={`w-8 h-8 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <p className={`text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getComplianceRate()}%
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Compliance Rate
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-700' : 'bg-green-50'
            }`}>
              <div className="flex items-center space-x-3">
                <Calendar className={`w-8 h-8 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <div>
                  <p className={`text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {doses.filter(dose => dose.taken).length}
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Doses Taken
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-700' : 'bg-red-50'
            }`}>
              <div className="flex items-center space-x-3">
                <Calendar className={`w-8 h-8 ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`} />
                <div>
                  <p className={`text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {doses.filter(dose => !dose.taken).length}
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Missed Doses
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className={`border rounded-2xl ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {/* Calendar Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={previousMonth}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              <button
                onClick={nextMonth}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    className={`text-center text-sm font-medium py-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {emptyDays.map(day => (
                  <div key={`empty-${day}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {days.map(day => {
                  const dayDoses = getDayDoses(day);
                  const status = getDayStatus(dayDoses);
                  const isToday = 
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium relative ${
                        isToday
                          ? darkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } transition-colors cursor-pointer`}
                    >
                      <span className="relative z-10">{day}</span>
                      {dayDoses.length > 0 && (
                        <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                          getStatusColor(status)
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor('complete')}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                All taken
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor('partial')}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Partially taken
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor('missed')}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Missed doses
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}