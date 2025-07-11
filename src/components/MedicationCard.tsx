import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, AlertTriangle, Pill, Droplets, Syringe, Palette, SunSnow as Snooze, Star, MessageSquare } from 'lucide-react';
import { Medication, MedicationDose } from '../types/medication';

interface MedicationCardProps {
  medication: Medication;
  dose: MedicationDose;
  isOverdue: boolean;
  isUpcoming: boolean;
  onMarkTaken: (doseId: string, effectiveness?: number, sideEffects?: string[], notes?: string) => void;
  onSnooze?: (doseId: string, minutes: number) => void;
  darkMode: boolean;
}

export default function MedicationCard({
  medication,
  dose,
  isOverdue,
  isUpcoming,
  onMarkTaken,
  onSnooze,
  darkMode
}: MedicationCardProps) {
  const [showTakenModal, setShowTakenModal] = useState(false);
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [effectiveness, setEffectiveness] = useState(3);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [newSideEffect, setNewSideEffect] = useState('');

  const getMedicationIcon = () => {
    switch (medication.medicationType) {
      case 'liquid':
        return <Droplets className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />;
      case 'injection':
        return <Syringe className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />;
      case 'topical':
        return <Palette className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />;
      default:
        return <Pill className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />;
    }
  };

  const getCardStyle = () => {
    const baseStyle = `backdrop-blur-sm border transition-all duration-200 ${
      darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
    }`;
    
    if (dose.taken) {
      return `${baseStyle} ${darkMode ? 'border-green-400/30' : 'border-green-300/50'}`;
    }
    
    if (isOverdue) {
      return `${baseStyle} ${darkMode ? 'border-red-400/30' : 'border-red-300/50'}`;
    }
    
    if (isUpcoming) {
      return `${baseStyle} ${darkMode ? 'border-blue-400/30' : 'border-blue-300/50'}`;
    }

    return baseStyle;
  };

  const getIconColor = () => {
    if (dose.taken) return 'text-green-600';
    if (isOverdue) return 'text-red-600';
    if (isUpcoming) return 'text-blue-600';
    return 'text-blue-500';
  };

  const getButtonStyle = () => {
    if (dose.taken) {
      return 'bg-green-500 text-white cursor-not-allowed';
    }
    
    if (isOverdue) {
      return 'bg-red-500 hover:bg-red-600 text-white';
    }
    
    return 'bg-blue-500 hover:bg-blue-600 text-white';
  };

  const handleMarkTaken = () => {
    if (dose.taken) return;
    setShowTakenModal(true);
  };

  const confirmMarkTaken = () => {
    onMarkTaken(dose.id, effectiveness, sideEffects, notes);
    setShowTakenModal(false);
    setEffectiveness(3);
    setSideEffects([]);
    setNotes('');
    setNewSideEffect('');
  };

  const handleSnooze = (minutes: number) => {
    if (onSnooze) {
      onSnooze(dose.id, minutes);
    }
    setShowSnoozeOptions(false);
  };

  const addSideEffect = () => {
    if (newSideEffect.trim() && !sideEffects.includes(newSideEffect.trim())) {
      setSideEffects([...sideEffects, newSideEffect.trim()]);
      setNewSideEffect('');
    }
  };

  const removeSideEffect = (index: number) => {
    setSideEffects(sideEffects.filter((_, i) => i !== index));
  };

  const isSnoozed = dose.snoozedUntil && new Date(dose.snoozedUntil) > new Date();

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
        className={`rounded-lg p-4 sm:p-6 lg:p-8 ${getCardStyle()}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 min-w-0 flex-1">
            {/* Medication Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-2 sm:p-3 lg:p-4 rounded-lg bg-blue-500/10 backdrop-blur-sm flex-shrink-0"
            >
              <div className={getIconColor()}>
                {getMedicationIcon()}
              </div>
            </motion.div>

            {/* Medication Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-1 sm:space-y-2 min-w-0 flex-1"
            >
              <h3 className={`text-lg sm:text-xl lg:text-2xl font-light truncate ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {medication.name}
              </h3>
              <p className={`text-sm sm:text-base lg:text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {medication.dosage}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mt-2 sm:mt-3">
                <div className="flex items-center space-x-2">
                  <Clock className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-base sm:text-lg lg:text-xl font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {dose.scheduledTime}
                  </span>
                  <AnimatePresence>
                    {isSnoozed && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        Snoozed
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {medication.doctorName && (
                  <span className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Dr. {medication.doctorName}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Status and Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex flex-col items-end space-y-2 sm:space-y-3 lg:space-y-4 flex-shrink-0"
          >
            {/* Status Indicator */}
            <AnimatePresence>
              {isOverdue && !isSnoozed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1 sm:space-x-2 text-red-500"
                >
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Overdue</span>
                </motion.div>
              )}
              
              {isUpcoming && !isOverdue && !isSnoozed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1 sm:space-x-2 text-blue-500"
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Due Soon</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {!dose.taken && onSnooze && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
                    className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                        : 'bg-gray-200/60 hover:bg-gray-300/60 text-gray-700'
                    }`}
                  >
                    <Snooze className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showSnoozeOptions && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 top-full mt-2 p-2 rounded-lg shadow-lg z-10 ${
                          darkMode ? 'bg-gray-800 border border-white/10' : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div className="space-y-1">
                          {[5, 15, 30, 60].map(minutes => (
                            <motion.button
                              key={minutes}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSnooze(minutes)}
                              className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                darkMode 
                                  ? 'hover:bg-white/10 text-white' 
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {minutes}m
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <motion.button
                whileHover={{ scale: dose.taken ? 1 : 1.05 }}
                whileTap={{ scale: dose.taken ? 1 : 0.95 }}
                onClick={handleMarkTaken}
                disabled={dose.taken}
                className={`p-3 sm:p-4 rounded-lg transition-all duration-200 min-w-[48px] min-h-[48px] sm:min-w-[56px] sm:min-h-[56px] lg:min-w-[60px] lg:min-h-[60px] flex items-center justify-center ${getButtonStyle()}`}
              >
                <AnimatePresence mode="wait">
                  {dose.taken ? (
                    <motion.div
                      key="taken"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="untaken"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 border-2 border-white rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {dose.taken && dose.takenTime && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-green-500/10 border border-green-400/20' : 'bg-green-100/60 border border-green-200/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-green-400' : 'text-green-700'
                  }`}>
                    ✓ Completed at {dose.takenTime}
                  </p>
                  {dose.effectiveness && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className={`text-xs ${
                        darkMode ? 'text-green-400' : 'text-green-700'
                      }`}>
                        Effectiveness: {dose.effectiveness}/5
                      </span>
                    </div>
                  )}
                  {dose.notes && (
                    <p className={`text-xs mt-1 italic ${
                      darkMode ? 'text-green-400' : 'text-green-700'
                    }`}>
                      "{dose.notes}"
                    </p>
                  )}
                </div>
                {dose.sideEffects && dose.sideEffects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dose.sideEffects.map((effect, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`px-2 py-1 text-xs rounded-full ${
                          darkMode 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {effect}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mark Taken Modal */}
      <AnimatePresence>
        {showTakenModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`w-full max-w-md rounded-lg p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Mark as Taken
              </h3>

              {/* Effectiveness Rating */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  How effective was this dose? (1-5)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEffectiveness(rating)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        effectiveness >= rating
                          ? 'bg-yellow-400 border-yellow-400 text-white'
                          : darkMode
                          ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                          : 'border-gray-300 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      ★
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Side Effects */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Any side effects?
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSideEffect}
                    onChange={(e) => setNewSideEffect(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSideEffect()}
                    placeholder="Add side effect"
                    className={`flex-1 px-3 py-2 rounded border text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addSideEffect}
                    className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
                  >
                    Add
                  </motion.button>
                </div>
                <AnimatePresence>
                  {sideEffects.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-1"
                    >
                      {sideEffects.map((effect, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            darkMode 
                              ? 'bg-red-500/20 text-red-300' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {effect}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => removeSideEffect(index)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </motion.button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="How are you feeling?"
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTakenModal(false)}
                  className={`flex-1 px-4 py-2 rounded font-medium ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmMarkTaken}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium"
                >
                  Mark Taken
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}