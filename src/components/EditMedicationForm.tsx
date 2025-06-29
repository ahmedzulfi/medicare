import React, { useState } from 'react';
import { X, Plus, Minus, Save, Trash2 } from 'lucide-react';
import { Medication } from '../types/medication';

interface EditMedicationFormProps {
  medication: Medication;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Medication>) => void;
  onDelete: (id: string) => void;
  darkMode: boolean;
}

export default function EditMedicationForm({
  medication,
  onClose,
  onUpdate,
  onDelete,
  darkMode
}: EditMedicationFormProps) {
  const [formData, setFormData] = useState({
    name: medication.name,
    dosage: medication.dosage,
    frequency: medication.frequency,
    times: [...medication.times],
    startDate: medication.startDate,
    refillDate: medication.refillDate,
    doctorName: medication.doctorName,
    quantity: medication.quantity,
    prescriptionNumber: medication.prescriptionNumber,
    pharmacy: medication.pharmacy,
    medicationType: medication.medicationType,
    color: medication.color,
    notes: medication.notes || '',
    sideEffects: medication.sideEffects || [],
    effectiveness: medication.effectiveness || 3,
    isActive: medication.isActive
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newSideEffect, setNewSideEffect] = useState('');

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = time;
    setFormData({ ...formData, times: newTimes });
  };

  const addTime = () => {
    setFormData({ ...formData, times: [...formData.times, '12:00'] });
  };

  const removeTime = (index: number) => {
    if (formData.times.length > 1) {
      const newTimes = formData.times.filter((_, i) => i !== index);
      setFormData({ ...formData, times: newTimes });
    }
  };

  const addSideEffect = () => {
    if (newSideEffect.trim() && !formData.sideEffects.includes(newSideEffect.trim())) {
      setFormData({ 
        ...formData, 
        sideEffects: [...formData.sideEffects, newSideEffect.trim()] 
      });
      setNewSideEffect('');
    }
  };

  const removeSideEffect = (index: number) => {
    const newSideEffects = formData.sideEffects.filter((_, i) => i !== index);
    setFormData({ ...formData, sideEffects: newSideEffects });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Medication name is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    if (!formData.pharmacy.trim()) newErrors.pharmacy = 'Pharmacy is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onUpdate(medication.id, formData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(medication.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg backdrop-blur-md ${
        darkMode ? 'bg-gray-900/90 border border-white/10' : 'bg-white/90 border border-gray-200/20'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b backdrop-blur-md ${
          darkMode ? 'border-white/10 bg-gray-900/90' : 'border-gray-200/20 bg-white/90'
        }`}>
          <h2 className={`text-2xl font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Edit Medication
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50/60 transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100/60 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Active Status Toggle */}
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Medication Status
            </label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Medication Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="e.g., Lisinopril"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Dosage *
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="e.g., 10mg"
              />
              {errors.dosage && <p className="text-red-500 text-sm mt-2">{errors.dosage}</p>}
            </div>
          </div>

          {/* Effectiveness Rating */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Effectiveness Rating (1-5)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, effectiveness: rating })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    formData.effectiveness >= rating
                      ? 'bg-yellow-400 border-yellow-400 text-white'
                      : darkMode
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className={`ml-2 text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formData.effectiveness}/5
              </span>
            </div>
          </div>

          {/* Side Effects */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Side Effects
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSideEffect}
                  onChange={(e) => setNewSideEffect(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSideEffect())}
                  placeholder="Add a side effect"
                  className={`flex-1 px-4 py-3 rounded-lg border text-base backdrop-blur-sm ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                      : 'bg-white/60 border-gray-200/30 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={addSideEffect}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {formData.sideEffects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sideEffects.map((effect, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        darkMode 
                          ? 'bg-red-500/20 text-red-300 border border-red-400/30' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {effect}
                      <button
                        type="button"
                        onClick={() => removeSideEffect(index)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className={`w-full px-4 py-4 rounded-lg border text-base backdrop-blur-sm ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                  : 'bg-white/60 border-gray-200/30 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Additional notes about this medication..."
            />
          </div>

          {/* Frequency and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Type
              </label>
              <select
                value={formData.medicationType}
                onChange={(e) => setFormData({ ...formData, medicationType: e.target.value as any })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="pill">Pill/Tablet</option>
                <option value="liquid">Liquid</option>
                <option value="injection">Injection</option>
                <option value="topical">Topical/Cream</option>
              </select>
            </div>
          </div>

          {/* Times */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Times to Take
            </label>
            <div className="space-y-4">
              {formData.times.map((time, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className={`flex-1 px-4 py-4 rounded-lg border text-lg backdrop-blur-sm min-h-[56px] ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : 'bg-white/60 border-gray-200/30 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {formData.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTime(index)}
                      className="p-4 text-red-500 hover:bg-red-50/60 rounded-lg transition-colors min-h-[56px] min-w-[56px]"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTime}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-blue-400 hover:bg-white/5' 
                    : 'text-blue-600 hover:bg-blue-50/60'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Time</span>
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Doctor Name *
              </label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="e.g., Dr. Smith"
              />
              {errors.doctorName && <p className="text-red-500 text-sm mt-2">{errors.doctorName}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-2">{errors.quantity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Pharmacy *
              </label>
              <input
                type="text"
                value={formData.pharmacy}
                onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="e.g., CVS Pharmacy"
              />
              {errors.pharmacy && <p className="text-red-500 text-sm mt-2">{errors.pharmacy}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Prescription Number
              </label>
              <input
                type="text"
                value={formData.prescriptionNumber}
                onChange={(e) => setFormData({ ...formData, prescriptionNumber: e.target.value })}
                className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Refill Date
            </label>
            <input
              type="date"
              value={formData.refillDate}
              onChange={(e) => setFormData({ ...formData, refillDate: e.target.value })}
              className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white/60 border-gray-200/30 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-4 rounded-lg font-medium transition-colors min-h-[56px] ${
                darkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm' 
                  : 'bg-gray-200/60 hover:bg-gray-300/60 text-gray-700 backdrop-blur-sm'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 min-h-[56px]"
            >
              <Save className="w-5 h-5" />
              <span>Update Medication</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className={`w-full max-w-md rounded-lg p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Delete Medication
            </h3>
            <p className={`mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Are you sure you want to delete "{medication.name}"? This action cannot be undone and will remove all associated dose history.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}