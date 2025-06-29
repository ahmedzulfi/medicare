import React from 'react';
import { AlertTriangle, Clock, Bell } from 'lucide-react';
import { Medication, MedicationDose } from '../types/medication';

interface NotificationBannerProps {
  overdueDoses: MedicationDose[];
  upcomingDoses: MedicationDose[];
  medications: Medication[];
  darkMode: boolean;
}

export default function NotificationBanner({
  overdueDoses,
  upcomingDoses,
  medications,
  darkMode
}: NotificationBannerProps) {
  const getMedicationName = (medicationId: string) => {
    const medication = medications.find(med => med.id === medicationId);
    return medication?.name || 'Unknown';
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {overdueDoses.length > 0 && (
        <div className={`p-4 sm:p-6 rounded-lg backdrop-blur-sm border-l-4 border-red-500 ${
          darkMode 
            ? 'bg-red-500/10 border border-red-400/20 text-red-300' 
            : 'bg-red-50/80 border border-red-200/30 text-red-700'
        }`}>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="p-1.5 sm:p-2 rounded-lg bg-red-500 flex-shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">
                {overdueDoses.length} Overdue Medication{overdueDoses.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {overdueDoses.map(dose => (
                  <p key={dose.id} className="text-sm sm:text-base">
                    <strong>{getMedicationName(dose.medicationId)}</strong> - Due at {dose.scheduledTime}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {upcomingDoses.length > 0 && (
        <div className={`p-4 sm:p-6 rounded-lg backdrop-blur-sm border-l-4 border-blue-500 ${
          darkMode 
            ? 'bg-blue-500/10 border border-blue-400/20 text-blue-300' 
            : 'bg-blue-50/80 border border-blue-200/30 text-blue-700'
        }`}>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500 flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">
                Upcoming Medications
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {upcomingDoses.map(dose => (
                  <p key={dose.id} className="text-sm sm:text-base">
                    <strong>{getMedicationName(dose.medicationId)}</strong> - Due at {dose.scheduledTime}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}