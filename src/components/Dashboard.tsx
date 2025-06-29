import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, History, Package, Moon, Sun, Activity, TrendingUp } from 'lucide-react';
import MedicationCard from './MedicationCard';
import NotificationBanner from './NotificationBanner';
import { Medication, MedicationDose, Profile } from '../types/medication';

interface DashboardProps {
  medications: Medication[];
  doses: MedicationDose[];
  currentProfile: Profile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onMarkTaken: (doseId: string) => void;
  onShowAddForm: () => void;
  onShowHistory: () => void;
  onShowRefills: () => void;
  onShowProfiles: () => void;
}

export default function Dashboard({
  medications,
  doses,
  currentProfile,
  darkMode,
  onToggleDarkMode,
  onMarkTaken,
  onShowAddForm,
  onShowHistory,
  onShowRefills,
  onShowProfiles
}: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysDoses = doses.filter(dose => dose.date === today);
  const overdueDoses = todaysDoses.filter(dose => {
    if (dose.taken) return false;
    const [hours, minutes] = dose.scheduledTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    return currentTime > scheduledTime;
  });

  const upcomingDoses = todaysDoses.filter(dose => {
    if (dose.taken) return false;
    const [hours, minutes] = dose.scheduledTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    const timeDiff = scheduledTime.getTime() - currentTime.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // Next 30 minutes
  });

  const completedToday = todaysDoses.filter(dose => dose.taken).length;
  const totalToday = todaysDoses.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50/30 to-white'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 backdrop-blur-md ${
        darkMode ? 'bg-gray-900/80 border-white/10' : 'bg-white/80 border-gray-200/20'
      } border-b`}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-500/10 backdrop-blur-sm">
                <Activity className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className={`text-2xl font-light ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  MedTracker
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {currentProfile.name}'s medications
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onToggleDarkMode}
                className={`p-3 rounded-lg backdrop-blur-sm transition-all ${
                  darkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                    : 'bg-white/60 hover:bg-white/80 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={onShowProfiles}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg backdrop-blur-sm transition-all ${
                  darkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-white/60 hover:bg-white/80 text-gray-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{currentProfile.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {(overdueDoses.length > 0 || upcomingDoses.length > 0) && (
        <NotificationBanner
          overdueDoses={overdueDoses}
          upcomingDoses={upcomingDoses}
          medications={medications}
          darkMode={darkMode}
        />
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className={`p-6 rounded-lg backdrop-blur-sm ${
            darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
          }`}>
            <div className="text-center">
              <p className={`text-3xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {completionRate}%
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Today's Progress
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-lg backdrop-blur-sm ${
            darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
          }`}>
            <div className="text-center">
              <p className={`text-3xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {medications.length}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Active Meds
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-lg backdrop-blur-sm ${
            darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
          }`}>
            <div className="text-center">
              <p className={`text-3xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {totalToday - completedToday}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Remaining
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-lg backdrop-blur-sm ${
            darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
          }`}>
            <div className="text-center">
              <p className={`text-3xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Current Time
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <button
            onClick={onShowAddForm}
            className="p-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 min-h-[88px] flex flex-col items-center justify-center space-y-2"
          >
            <Plus className="w-6 h-6" />
            <span className="text-base font-medium">Add Medication</span>
          </button>

          <button
            onClick={onShowHistory}
            className={`p-6 rounded-lg backdrop-blur-sm transition-all duration-200 min-h-[88px] flex flex-col items-center justify-center space-y-2 ${
              darkMode 
                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                : 'bg-white/60 hover:bg-white/80 text-gray-700 border border-white/20'
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-base font-medium">History</span>
          </button>

          <button
            onClick={onShowRefills}
            className={`p-6 rounded-lg backdrop-blur-sm transition-all duration-200 min-h-[88px] flex flex-col items-center justify-center space-y-2 ${
              darkMode 
                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                : 'bg-white/60 hover:bg-white/80 text-gray-700 border border-white/20'
            }`}
          >
            <Package className="w-6 h-6" />
            <span className="text-base font-medium">Refills</span>
          </button>

          <button
            className={`p-6 rounded-lg backdrop-blur-sm transition-all duration-200 min-h-[88px] flex flex-col items-center justify-center space-y-2 ${
              darkMode 
                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                : 'bg-white/60 hover:bg-white/80 text-gray-700 border border-white/20'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-base font-medium">Schedule</span>
          </button>
        </div>

        {/* Today's Medications */}
        <div className="mb-8">
          <div className="mb-8">
            <h2 className={`text-3xl font-light mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Today's Medications
            </h2>
            <p className={`text-lg ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todaysDoses.length} medication{todaysDoses.length !== 1 ? 's' : ''} scheduled for today
            </p>
          </div>

          {todaysDoses.length === 0 ? (
            <div className={`text-center py-20 rounded-lg backdrop-blur-sm ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
            }`}>
              <Package className={`w-16 h-16 mx-auto mb-6 ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No medications scheduled
              </p>
              <p className={`text-base ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Enjoy your medication-free day
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {todaysDoses
                .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                .map(dose => {
                  const medication = medications.find(med => med.id === dose.medicationId);
                  if (!medication) return null;
                  
                  return (
                    <MedicationCard
                      key={dose.id}
                      medication={medication}
                      dose={dose}
                      isOverdue={overdueDoses.some(od => od.id === dose.id)}
                      isUpcoming={upcomingDoses.some(ud => ud.id === dose.id)}
                      onMarkTaken={onMarkTaken}
                      darkMode={darkMode}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}