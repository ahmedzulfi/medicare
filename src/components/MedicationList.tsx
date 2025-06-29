import React, { useState } from 'react';
import { Edit, Trash2, Clock, User, Package, Star, AlertCircle } from 'lucide-react';
import { Medication } from '../types/medication';
import EditMedicationForm from './EditMedicationForm';

interface MedicationListProps {
  medications: Medication[];
  onUpdate: (id: string, updates: Partial<Medication>) => void;
  onDelete: (id: string) => void;
  darkMode: boolean;
}

export default function MedicationList({
  medications,
  onUpdate,
  onDelete,
  darkMode
}: MedicationListProps) {
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const getMedicationIcon = (type: string) => {
    switch (type) {
      case 'liquid':
        return '💧';
      case 'injection':
        return '💉';
      case 'topical':
        return '🧴';
      default:
        return '💊';
    }
  };

  const getEffectivenessStars = (rating?: number) => {
    if (!rating) return null;
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (medications.length === 0) {
    return (
      <div className={`text-center py-20 rounded-lg backdrop-blur-sm ${
        darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
      }`}>
        <Package className={`w-16 h-16 mx-auto mb-6 ${
          darkMode ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <p className={`text-xl font-light mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          No medications found
        </p>
        <p className={`text-base ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {medications.map(medication => (
          <div
            key={medication.id}
            className={`p-6 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
              medication.isActive
                ? darkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-white/60 border-white/20 hover:bg-white/80'
                : darkMode
                ? 'bg-gray-800/50 border-gray-700/50'
                : 'bg-gray-100/50 border-gray-300/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Medication Icon */}
                <div className="text-3xl">
                  {getMedicationIcon(medication.medicationType)}
                </div>

                {/* Medication Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-xl font-semibold ${
                      medication.isActive
                        ? darkMode ? 'text-white' : 'text-gray-900'
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {medication.name}
                    </h3>
                    {!medication.isActive && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                      }`}>
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className={`text-lg mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {medication.dosage} • {medication.frequency.replace('-', ' ')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {medication.times.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <User className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {medication.doctorName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Package className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {medication.pharmacy}
                      </span>
                    </div>
                  </div>

                  {/* Effectiveness Rating */}
                  {medication.effectiveness && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className={`w-4 h-4 ${
                        darkMode ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Effectiveness: {getEffectivenessStars(medication.effectiveness)} ({medication.effectiveness}/5)
                      </span>
                    </div>
                  )}

                  {/* Side Effects */}
                  {medication.sideEffects && medication.sideEffects.length > 0 && (
                    <div className="flex items-start space-x-2 mb-3">
                      <AlertCircle className={`w-4 h-4 mt-0.5 ${
                        darkMode ? 'text-red-400' : 'text-red-500'
                      }`} />
                      <div>
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          Side Effects:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {medication.sideEffects.map((effect, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-xs rounded-full ${
                                darkMode 
                                  ? 'bg-red-500/20 text-red-300' 
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {medication.notes && (
                    <p className={`text-sm italic ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      "{medication.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setEditingMedication(medication)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100/60 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quantity and Refill Info */}
            <div className={`mt-4 pt-4 border-t flex justify-between items-center ${
              darkMode ? 'border-white/10' : 'border-gray-200/30'
            }`}>
              <div className="flex items-center space-x-6">
                <span className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Quantity: <strong>{medication.quantity}</strong>
                </span>
                {medication.refillDate && (
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Refill: <strong>{new Date(medication.refillDate).toLocaleDateString()}</strong>
                  </span>
                )}
              </div>
              
              {medication.prescriptionNumber && (
                <span className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Rx: {medication.prescriptionNumber}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMedication && (
        <EditMedicationForm
          medication={editingMedication}
          onClose={() => setEditingMedication(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          darkMode={darkMode}
        />
      )}
    </>
  );
}