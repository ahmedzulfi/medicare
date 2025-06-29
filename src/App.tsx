import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import SaaSDashboard from './components/SaaSDashboard';
import { useMedications } from './hooks/useMedications';

type ActiveView = 'landing' | 'dashboard';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');

  const {
    medications,
    allMedications,
    doses,
    profiles,
    currentProfile,
    settings,
    searchFilters,
    analytics,
    notificationPermission,
    addMedication,
    updateMedication,
    deleteMedication,
    markDoseTaken,
    snoozeDose,
    addProfile,
    updateProfile,
    deleteProfile,
    setCurrentProfile,
    updateSettings,
    setSearchFilters,
    exportData,
    importData
  } = useMedications();

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  if (activeView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setActiveView('dashboard')}
        darkMode={settings.darkMode}
      />
    );
  }

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <SaaSDashboard
        medications={medications}
        doses={doses}
        profiles={profiles}
        currentProfile={currentProfile}
        settings={settings}
        searchFilters={searchFilters}
        analytics={analytics}
        notificationPermission={notificationPermission}
        onToggleDarkMode={toggleDarkMode}
        onMarkTaken={markDoseTaken}
        onSnoozeDose={snoozeDose}
        onAddMedication={addMedication}
        onUpdateMedication={updateMedication}
        onDeleteMedication={deleteMedication}
        onAddProfile={addProfile}
        onUpdateProfile={updateProfile}
        onDeleteProfile={deleteProfile}
        onSetCurrentProfile={setCurrentProfile}
        onUpdateSettings={updateSettings}
        onSetSearchFilters={setSearchFilters}
        onExportData={exportData}
        onImportData={importData}
      />
    </div>
  );
}

export default App;