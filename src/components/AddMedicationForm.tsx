import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Save, Calculator, Calendar } from 'lucide-react';
import { Medication } from '../types/medication';

interface AddMedicationFormProps {
  onClose: () => void;
  onAdd: (medication: Omit<Medication, 'id'>) => void;
  profileId: string;
  darkMode: boolean;
}

type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'every-x-days' | 'every-x-hours' | 'as-needed' | 'custom';

interface CustomFrequency {
  type: 'days' | 'weeks' | 'months';
  interval: number;
  specificDays?: string[]; // For weekly patterns like "Mon, Wed, Fri"
}

export default function AddMedicationForm({
  onClose,
  onAdd,
  profileId,
  darkMode
}: AddMedicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily' as FrequencyType,
    customFrequency: {
      type: 'days' as 'days' | 'weeks' | 'months',
      interval: 1,
      specificDays: [] as string[]
    } as CustomFrequency,
    timesPerDay: 1, // New field for doses per day
    times: ['09:00'],
    startDate: new Date().toISOString().split('T')[0],
    refillDate: '',
    doctorName: '',
    quantity: 30,
    prescriptionNumber: '',
    pharmacy: '',
    medicationType: 'pill' as 'pill' | 'liquid' | 'injection' | 'topical',
    color: '#3B82F6',
    autoCalculateRefill: true,
    refillDaysSupply: 30
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [calculatedRefillDate, setCalculatedRefillDate] = useState('');
  const [dailyUsage, setDailyUsage] = useState(1);

  const weekDays = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  // Update times array when timesPerDay changes
  useEffect(() => {
    const currentTimesCount = formData.times.length;
    const targetTimesCount = formData.timesPerDay;

    if (currentTimesCount !== targetTimesCount) {
      let newTimes = [...formData.times];

      if (targetTimesCount > currentTimesCount) {
        // Add more times with smart defaults
        const defaultTimes = ['08:00', '12:00', '18:00', '22:00', '06:00', '14:00', '20:00', '10:00'];
        for (let i = currentTimesCount; i < targetTimesCount; i++) {
          newTimes.push(defaultTimes[i] || '12:00');
        }
      } else {
        // Remove excess times
        newTimes = newTimes.slice(0, targetTimesCount);
      }

      setFormData(prev => ({ ...prev, times: newTimes }));
    }
  }, [formData.timesPerDay]);

  // Calculate daily usage based on frequency and times
  useEffect(() => {
    let usage = 0;
    
    switch (formData.frequency) {
      case 'daily':
        usage = formData.timesPerDay;
        break;
      case 'weekly':
        usage = formData.timesPerDay / 7;
        break;
      case 'monthly':
        usage = formData.timesPerDay / 30;
        break;
      case 'every-x-days':
        usage = formData.timesPerDay / formData.customFrequency.interval;
        break;
      case 'every-x-hours':
        usage = 24 / formData.customFrequency.interval;
        break;
      case 'custom':
        if (formData.customFrequency.type === 'days') {
          usage = formData.timesPerDay / formData.customFrequency.interval;
        } else if (formData.customFrequency.type === 'weeks') {
          if (formData.customFrequency.specificDays && formData.customFrequency.specificDays.length > 0) {
            usage = (formData.customFrequency.specificDays.length * formData.timesPerDay) / 7;
          } else {
            usage = formData.timesPerDay / (formData.customFrequency.interval * 7);
          }
        } else if (formData.customFrequency.type === 'months') {
          usage = formData.timesPerDay / (formData.customFrequency.interval * 30);
        }
        break;
      case 'as-needed':
        usage = 0.5; // Estimate for as-needed medications
        break;
      default:
        usage = formData.timesPerDay;
    }
    
    setDailyUsage(Math.max(usage, 0.1)); // Minimum 0.1 to avoid division by zero
  }, [formData.frequency, formData.timesPerDay, formData.customFrequency]);

  // Auto-calculate refill date
  useEffect(() => {
    if (formData.autoCalculateRefill && formData.quantity > 0 && dailyUsage > 0) {
      const daysSupply = Math.floor(formData.quantity / dailyUsage);
      const refillDate = new Date();
      refillDate.setDate(refillDate.getDate() + daysSupply - 7); // Refill 7 days before running out
      
      const calculatedDate = refillDate.toISOString().split('T')[0];
      setCalculatedRefillDate(calculatedDate);
      
      if (formData.autoCalculateRefill) {
        setFormData(prev => ({ ...prev, refillDate: calculatedDate }));
      }
    }
  }, [formData.quantity, dailyUsage, formData.autoCalculateRefill]);

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = time;
    setFormData({ ...formData, times: newTimes });
  };

  const handleTimesPerDayChange = (count: number) => {
    setFormData({ ...formData, timesPerDay: Math.max(1, Math.min(8, count)) });
  };

  const handleCustomFrequencyChange = (field: keyof CustomFrequency, value: any) => {
    setFormData({
      ...formData,
      customFrequency: {
        ...formData.customFrequency,
        [field]: value
      }
    });
  };

  const handleSpecificDayToggle = (day: string) => {
    const currentDays = formData.customFrequency.specificDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    handleCustomFrequencyChange('specificDays', newDays);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Medication name is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    if (!formData.pharmacy.trim()) newErrors.pharmacy = 'Pharmacy is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (formData.timesPerDay <= 0) newErrors.timesPerDay = 'Times per day must be at least 1';
    
    if (formData.frequency === 'every-x-days' && formData.customFrequency.interval <= 0) {
      newErrors.customFrequency = 'Interval must be greater than 0';
    }
    
    if (formData.frequency === 'every-x-hours' && (formData.customFrequency.interval <= 0 || formData.customFrequency.interval > 24)) {
      newErrors.customFrequency = 'Hours must be between 1 and 24';
    }
    
    if (formData.frequency === 'custom' && formData.customFrequency.interval <= 0) {
      newErrors.customFrequency = 'Interval must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Convert frequency to the expected format
    let finalFrequency: 'daily' | 'weekly' | 'as-needed' = 'daily';
    
    switch (formData.frequency) {
      case 'daily':
      case 'every-x-hours':
        finalFrequency = 'daily';
        break;
      case 'weekly':
      case 'monthly':
      case 'every-x-days':
      case 'custom':
        finalFrequency = 'weekly';
        break;
      case 'as-needed':
        finalFrequency = 'as-needed';
        break;
    }

    onAdd({
      ...formData,
      frequency: finalFrequency,
      profileId
    });
    
    onClose();
  };

  const getFrequencyDescription = () => {
    const timesText = formData.timesPerDay === 1 ? 'once' : 
                     formData.timesPerDay === 2 ? 'twice' : 
                     formData.timesPerDay === 3 ? 'three times' : 
                     `${formData.timesPerDay} times`;

    switch (formData.frequency) {
      case 'daily':
        return `Take ${timesText} daily`;
      case 'weekly':
        return `Take ${timesText} weekly`;
      case 'monthly':
        return `Take ${timesText} monthly`;
      case 'every-x-days':
        return `Take ${timesText} every ${formData.customFrequency.interval} day${formData.customFrequency.interval > 1 ? 's' : ''}`;
      case 'every-x-hours':
        return `Take every ${formData.customFrequency.interval} hour${formData.customFrequency.interval > 1 ? 's' : ''} (${24 / formData.customFrequency.interval} times daily)`;
      case 'custom':
        if (formData.customFrequency.specificDays && formData.customFrequency.specificDays.length > 0) {
          return `Take ${timesText} on ${formData.customFrequency.specificDays.length} specific days per week`;
        }
        return `Take ${timesText} every ${formData.customFrequency.interval} ${formData.customFrequency.type}`;
      case 'as-needed':
        return 'Take as needed (PRN)';
      default:
        return '';
    }
  };

  const getDaysSupply = () => {
    if (dailyUsage > 0) {
      return Math.floor(formData.quantity / dailyUsage);
    }
    return 0;
  };

  const getCommonDosingOptions = () => {
    return [
      { value: 1, label: 'Once daily', description: 'Take 1 time per day' },
      { value: 2, label: 'Twice daily (BID)', description: 'Take 2 times per day' },
      { value: 3, label: 'Three times daily (TID)', description: 'Take 3 times per day' },
      { value: 4, label: 'Four times daily (QID)', description: 'Take 4 times per day' },
      { value: 6, label: 'Every 4 hours', description: 'Take 6 times per day' },
      { value: 8, label: 'Every 3 hours', description: 'Take 8 times per day' }
    ];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg backdrop-blur-md ${
        darkMode ? 'bg-gray-900/90 border border-white/10' : 'bg-white/90 border border-gray-200/20'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b backdrop-blur-md ${
          darkMode ? 'border-white/10 bg-gray-900/90' : 'border-gray-200/20 bg-white/90'
        }`}>
          <h2 className={`text-2xl font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Add New Medication
          </h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
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
                placeholder="e.g., 10mg, 1 tablet, 5ml"
              />
              {errors.dosage && <p className="text-red-500 text-sm mt-2">{errors.dosage}</p>}
            </div>
          </div>

          {/* Dosing Frequency */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              How many times per day? *
            </label>
            
            {/* Common Dosing Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {getCommonDosingOptions().map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTimesPerDayChange(option.value)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.timesPerDay === option.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : darkMode
                      ? 'border-white/10 hover:border-white/20 bg-white/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white/60'
                  }`}
                >
                  <div className={`font-medium ${
                    formData.timesPerDay === option.value
                      ? 'text-blue-600'
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-sm ${
                    formData.timesPerDay === option.value
                      ? 'text-blue-500'
                      : darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Times Per Day */}
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Custom:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleTimesPerDayChange(formData.timesPerDay - 1)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.timesPerDay}
                  onChange={(e) => handleTimesPerDayChange(parseInt(e.target.value) || 1)}
                  className={`w-16 px-3 py-2 rounded-lg border text-center ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white/60 border-gray-200/30 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <button
                  type="button"
                  onClick={() => handleTimesPerDayChange(formData.timesPerDay + 1)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                times per day
              </span>
            </div>
            {errors.timesPerDay && <p className="text-red-500 text-sm mt-2">{errors.timesPerDay}</p>}
          </div>

          {/* Frequency Pattern */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Frequency Pattern *
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as FrequencyType })}
              className={`w-full px-4 py-4 rounded-lg border text-lg backdrop-blur-sm ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white/60 border-gray-200/30 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="every-x-days">Every X Days</option>
              <option value="every-x-hours">Every X Hours</option>
              <option value="custom">Custom Schedule</option>
              <option value="as-needed">As Needed (PRN)</option>
            </select>

            {/* Custom Frequency Options */}
            {(formData.frequency === 'every-x-days' || formData.frequency === 'every-x-hours' || formData.frequency === 'custom') && (
              <div className="mt-4 space-y-4">
                {formData.frequency === 'every-x-days' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Every how many days?
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formData.customFrequency.interval}
                      onChange={(e) => handleCustomFrequencyChange('interval', parseInt(e.target.value) || 1)}
                      className={`w-32 px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-white/5 border-white/10 text-white' 
                          : 'bg-white/60 border-gray-200/30 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      days
                    </span>
                  </div>
                )}

                {formData.frequency === 'every-x-hours' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Every how many hours?
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={formData.customFrequency.interval}
                      onChange={(e) => handleCustomFrequencyChange('interval', parseInt(e.target.value) || 1)}
                      className={`w-32 px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-white/5 border-white/10 text-white' 
                          : 'bg-white/60 border-gray-200/30 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      hours
                    </span>
                  </div>
                )}

                {formData.frequency === 'custom' && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Custom Schedule Type
                      </label>
                      <select
                        value={formData.customFrequency.type}
                        onChange={(e) => handleCustomFrequencyChange('type', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-white/5 border-white/10 text-white' 
                            : 'bg-white/60 border-gray-200/30 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="days">Every X Days</option>
                        <option value="weeks">Specific Days of Week</option>
                        <option value="months">Every X Months</option>
                      </select>
                    </div>

                    {formData.customFrequency.type === 'weeks' ? (
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Select Days of Week
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {weekDays.map(day => (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => handleSpecificDayToggle(day.value)}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                formData.customFrequency.specificDays?.includes(day.value)
                                  ? 'bg-blue-500 text-white'
                                  : darkMode
                                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Every how many {formData.customFrequency.type}?
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.customFrequency.interval}
                          onChange={(e) => handleCustomFrequencyChange('interval', parseInt(e.target.value) || 1)}
                          className={`w-32 px-3 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-white/5 border-white/10 text-white' 
                              : 'bg-white/60 border-gray-200/30 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                        <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formData.customFrequency.type}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {errors.customFrequency && (
                  <p className="text-red-500 text-sm">{errors.customFrequency}</p>
                )}
              </div>
            )}

            {/* Frequency Summary */}
            <div className={`mt-3 p-3 rounded-lg ${
              darkMode ? 'bg-blue-500/10 border border-blue-400/20' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                <strong>Schedule:</strong> {getFrequencyDescription()}
              </p>
            </div>
          </div>

          {/* Times */}
          {formData.frequency !== 'every-x-hours' && (
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Specific Times ({formData.timesPerDay} time{formData.timesPerDay > 1 ? 's' : ''} per day)
              </label>
              <div className="space-y-4">
                {formData.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className={`text-sm font-medium w-16 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Dose {index + 1}:
                    </span>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medication Type and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Refill Calculation */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50/80 border border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <Calculator className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Refill Calculation
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-white/5' : 'bg-white/60'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Daily Usage
                </p>
                <p className={`text-2xl font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dailyUsage.toFixed(1)}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  doses per day
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-white/5' : 'bg-white/60'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Days Supply
                </p>
                <p className={`text-2xl font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getDaysSupply()}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  days
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-white/5' : 'bg-white/60'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Refill In
                </p>
                <p className={`text-2xl font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.max(getDaysSupply() - 7, 0)}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  days
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="autoCalculateRefill"
                checked={formData.autoCalculateRefill}
                onChange={(e) => setFormData({ ...formData, autoCalculateRefill: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="autoCalculateRefill" className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Automatically calculate refill date (7 days before running out)
              </label>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Refill Date
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="date"
                  value={formData.refillDate}
                  onChange={(e) => setFormData({ ...formData, refillDate: e.target.value, autoCalculateRefill: false })}
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white/60 border-gray-200/30 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                {calculatedRefillDate && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, refillDate: calculatedRefillDate, autoCalculateRefill: true })}
                    className={`px-3 py-3 rounded-lg text-sm transition-colors ${
                      darkMode 
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300' 
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    Use Calculated
                  </button>
                )}
              </div>
              {calculatedRefillDate && (
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Suggested refill date: {new Date(calculatedRefillDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Doctor and Pharmacy Information */}
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
              <span>Add Medication</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}