import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Plus, 
  History, 
  Package, 
  User, 
  Calendar, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell,
  Search,
  Menu,
  X,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Home,
  List,
  FileText
} from 'lucide-react';
import MedicationCard from './MedicationCard';
import AddMedicationForm from './AddMedicationForm';
import MedicationHistory from './MedicationHistory';
import RefillTracker from './RefillTracker';
import ProfileSelector from './ProfileSelector';
import NotificationBanner from './NotificationBanner';
import SearchAndFilter from './SearchAndFilter';
import MedicationList from './MedicationList';
import Settings from './Settings';
import DoctorReport from './DoctorReport';
import { Medication, MedicationDose, Profile, AppSettings, SearchFilters } from '../types/medication';

interface SaaSDashboardProps {
  medications: Medication[];
  doses: MedicationDose[];
  profiles: Profile[];
  currentProfile: Profile;
  settings: AppSettings;
  searchFilters: SearchFilters;
  analytics: any;
  notificationPermission?: NotificationPermission;
  onToggleDarkMode: () => void;
  onMarkTaken: (doseId: string, effectiveness?: number, sideEffects?: string[], notes?: string) => void;
  onSnoozeDose: (doseId: string, minutes: number) => void;
  onAddMedication: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
  onUpdateMedication: (id: string, updates: Partial<Medication>) => void;
  onDeleteMedication: (id: string) => void;
  onAddProfile: (profile: Omit<Profile, 'id' | 'createdAt'>) => void;
  onUpdateProfile: (id: string, updates: Partial<Profile>) => void;
  onDeleteProfile: (id: string) => void;
  onSetCurrentProfile: (profile: Profile) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onSetSearchFilters: (filters: SearchFilters) => void;
  onExportData: () => void;
  onImportData: (file: File) => Promise<void>;
}

type ActiveView = 'dashboard' | 'medications' | 'add-medication' | 'history' | 'refills' | 'profiles' | 'settings' | 'doctor-report';

export default function SaaSDashboard({
  medications,
  doses,
  profiles,
  currentProfile,
  settings,
  searchFilters,
  analytics,
  notificationPermission,
  onToggleDarkMode,
  onMarkTaken,
  onSnoozeDose,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
  onSetCurrentProfile,
  onUpdateSettings,
  onSetSearchFilters,
  onExportData,
  onImportData
}: SaaSDashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const darkMode = settings.darkMode;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysDoses = doses.filter(dose => dose.date === today);
  const overdueDoses = todaysDoses.filter(dose => {
    if (dose.taken) return false;
    if (dose.snoozedUntil && new Date(dose.snoozedUntil) > currentTime) return false;
    
    const [hours, minutes] = dose.scheduledTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    return currentTime > scheduledTime;
  });

  const upcomingDoses = todaysDoses.filter(dose => {
    if (dose.taken) return false;
    if (dose.snoozedUntil && new Date(dose.snoozedUntil) > currentTime) return false;
    
    const [hours, minutes] = dose.scheduledTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    const timeDiff = scheduledTime.getTime() - currentTime.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60  * 1000;
  });

  const completedToday = todaysDoses.filter(dose => dose.taken).length;
  const totalToday = todaysDoses.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'medications', label: 'All Medications', icon: List },
    { id: 'add-medication', label: 'Add Medication', icon: Plus },
    { id: 'doctor-report', label: 'Doctor Report', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'refills', label: 'Refills', icon: Package },
    { id: 'profiles', label: 'Profiles', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'medications':
        return (
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <h2 className={`text-2xl sm:text-3xl font-light mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                All Medications
              </h2>
              <p className={`text-base sm:text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Manage your complete medication list ({medications.length} medications)
              </p>
            </div>

            <SearchAndFilter
              filters={searchFilters}
              onFiltersChange={onSetSearchFilters}
              medications={medications}
              darkMode={darkMode}
            />

            <MedicationList
              medications={medications}
              onUpdate={onUpdateMedication}
              onDelete={onDeleteMedication}
              darkMode={darkMode}
            />
          </div>
        );
      case 'add-medication':
        return (
          <AddMedicationForm
            onClose={() => setActiveView('dashboard')}
            onAdd={onAddMedication}
            profileId={currentProfile.id}
            darkMode={darkMode}
          />
        );
      case 'doctor-report':
        return (
          <DoctorReport
            medications={medications}
            doses={doses}
            currentProfile={currentProfile}
            analytics={analytics}
            onClose={() => setActiveView('dashboard')}
            darkMode={darkMode}
          />
        );
      case 'history':
        return (
          <MedicationHistory
            medications={medications}
            doses={doses}
            onClose={() => setActiveView('dashboard')}
            darkMode={darkMode}
          />
        );
      case 'refills':
        return (
          <RefillTracker
            medications={medications}
            onClose={() => setActiveView('dashboard')}
            onUpdateMedication={onUpdateMedication}
            darkMode={darkMode}
          />
        );
      case 'profiles':
        return (
          <ProfileSelector
            profiles={profiles}
            currentProfile={currentProfile}
            onSelectProfile={onSetCurrentProfile}
            onAddProfile={onAddProfile}
            onClose={() => setActiveView('dashboard')}
            darkMode={darkMode}
          />
        );
      case 'settings':
        return (
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <h2 className={`text-2xl sm:text-3xl font-light mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Settings
              </h2>
              <p className={`text-base sm:text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Customize your MedTracker experience
              </p>
            </div>

            <Settings
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onExportData={onExportData}
              onImportData={onImportData}
              darkMode={darkMode}
              notificationPermission={notificationPermission}
            />
          </div>
        );
      default:
        return (
          <div className="p-4 sm:p-6">
            {/* Notifications */}
            {(overdueDoses.length > 0 || upcomingDoses.length > 0) && (
              <div className="mb-4 sm:mb-6">
                <NotificationBanner
                  overdueDoses={overdueDoses}
                  upcomingDoses={upcomingDoses}
                  medications={medications}
                  darkMode={darkMode}
                />
              </div>
            )}

            {/* Welcome Message */}
            <div className="mb-6 sm:mb-8">
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 17 ? 'afternoon' : 'evening'}, {currentProfile.name}
              </h1>
              <p className={`text-base sm:text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {totalToday > 0 
                  ? `You have ${totalToday - completedToday} medication${totalToday - completedToday !== 1 ? 's' : ''} remaining today`
                  : 'No medications scheduled for today'
                }
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className={`p-3 sm:p-4 lg:p-6 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className={`text-xl sm:text-2xl lg:text-3xl font-light mb-1 sm:mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {completionRate}%
                    </p>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Today's Progress
                    </p>
                  </div>
                  <div className="hidden sm:block p-2 lg:p-3 rounded-lg bg-green-500/10">
                    <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className={`p-3 sm:p-4 lg:p-6 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className={`text-xl sm:text-2xl lg:text-3xl font-light mb-1 sm:mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {medications.filter(med => med.isActive).length}
                    </p>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Active Meds
                    </p>
                  </div>
                  <div className="hidden sm:block p-2 lg:p-3 rounded-lg bg-blue-500/10">
                    <Package className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className={`p-3 sm:p-4 lg:p-6 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className={`text-xl sm:text-2xl lg:text-3xl font-light mb-1 sm:mb-2 ${
                      overdueDoses.length > 0 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {overdueDoses.length}
                    </p>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Overdue
                    </p>
                  </div>
                  <div className="hidden sm:block p-2 lg:p-3 rounded-lg bg-red-500/10">
                    <AlertTriangle className="w-4 h-4 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className={`p-3 sm:p-4 lg:p-6 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className={`text-xl sm:text-2xl lg:text-3xl font-light mb-1 sm:mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {completedToday}
                    </p>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Completed
                    </p>
                  </div>
                  <div className="hidden sm:block p-2 lg:p-3 rounded-lg bg-green-500/10">
                    <CheckCircle className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Medications */}
            <div className="mb-4 sm:mb-6">
              <div className="mb-4 sm:mb-6">
                <h2 className={`text-2xl sm:text-3xl font-light mb-2 sm:mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Today's Medications
                </h2>
                <p className={`text-base sm:text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todaysDoses.length} medication{todaysDoses.length !== 1 ? 's' : ''} scheduled for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {todaysDoses.length === 0 ? (
                <div className={`text-center py-12 sm:py-16 lg:py-20 rounded-lg backdrop-blur-sm ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
                }`}>
                  <Package className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 ${
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-lg sm:text-xl font-light mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    No medications scheduled
                  </p>
                  <p className={`text-sm sm:text-base ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Enjoy your medication-free day! 🎉
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
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
                          onSnooze={onSnoozeDose}
                          darkMode={darkMode}
                        />
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50/30 to-white'
    }`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className={`flex flex-col h-full backdrop-blur-md ${
          darkMode ? 'bg-gray-900/90 border-white/10' : 'bg-white/90 border-gray-200/20'
        } border-r`}>
          {/* Logo */}
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h1 className={`text-lg sm:text-xl font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                MedTracker
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 space-y-1 sm:space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as ActiveView);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg'
                      : darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-3 sm:p-4 border-t border-white/10">
            <button
              onClick={() => setActiveView('profiles')}
              className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all ${
                darkMode 
                  ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100/60 text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm truncate">{currentProfile.name}</p>
                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentProfile.relationship || 'Primary User'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-0 w-full">
        {/* Top Navigation */}
        <header className={`sticky top-0 z-40 backdrop-blur-md ${
          darkMode ? 'bg-gray-900/80 border-white/10' : 'bg-white/80 border-gray-200/20'
        } border-b`}>
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100/10 flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <h2 className={`text-lg sm:text-xl lg:text-2xl font-light capitalize truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {activeView.replace('-', ' ')}
                </h2>
                {activeView === 'dashboard' && (
                  <div className={`hidden sm:flex items-center space-x-2 text-xs sm:text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Notifications */}
              {(overdueDoses.length > 0 || upcomingDoses.length > 0) && (
                <div className="relative">
                  <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    overdueDoses.length > 0 ? 'text-red-500' : 'text-blue-500'
                  }`} />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {overdueDoses.length + upcomingDoses.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className={`p-2 sm:p-3 rounded-lg backdrop-blur-sm transition-all ${
                  darkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                    : 'bg-white/60 hover:bg-white/80 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}