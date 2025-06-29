import React, { useState } from 'react';
import { Package, Phone, MapPin, AlertTriangle, X, Calendar, Clock, CheckCircle, Send, User } from 'lucide-react';
import { Medication } from '../types/medication';

interface RefillTrackerProps {
  medications: Medication[];
  onClose: () => void;
  onUpdateMedication: (id: string, updates: Partial<Medication>) => void;
  darkMode: boolean;
}

interface RefillRequest {
  medicationId: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  estimatedReadyDate?: string;
  notes?: string;
}

export default function RefillTracker({
  medications,
  onClose,
  onUpdateMedication,
  darkMode
}: RefillTrackerProps) {
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [showRefillForm, setShowRefillForm] = useState<string | null>(null);
  const [refillNotes, setRefillNotes] = useState('');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [showBulkRefill, setShowBulkRefill] = useState(false);

  const today = new Date();
  
  const getLowMedications = () => {
    return medications.filter(med => {
      const dailyUsage = med.times.length;
      const daysRemaining = med.quantity / dailyUsage;
      return daysRemaining <= 7 && med.isActive;
    });
  };

  const getRefillSoon = () => {
    return medications.filter(med => {
      if (!med.refillDate || !med.isActive) return false;
      const refillDate = new Date(med.refillDate);
      const daysUntilRefill = Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilRefill <= 7 && daysUntilRefill >= 0;
    });
  };

  const getRefillableMedications = () => {
    return medications.filter(med => {
      const dailyUsage = med.times.length;
      const daysRemaining = med.quantity / dailyUsage;
      return daysRemaining <= 14 && med.isActive; // Can refill when 14 days or less remaining
    });
  };

  const lowMedications = getLowMedications();
  const refillSoon = getRefillSoon();
  const refillableMedications = getRefillableMedications();

  const getDaysRemaining = (medication: Medication) => {
    const dailyUsage = medication.times.length;
    return Math.floor(medication.quantity / dailyUsage);
  };

  const getDaysUntilRefill = (medication: Medication) => {
    if (!medication.refillDate) return null;
    const refillDate = new Date(medication.refillDate);
    return Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const requestRefill = (medicationId: string, notes?: string) => {
    const newRequest: RefillRequest = {
      medicationId,
      requestDate: new Date().toISOString(),
      status: 'pending',
      estimatedReadyDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      notes
    };

    setRefillRequests(prev => [...prev, newRequest]);
    setShowRefillForm(null);
    setRefillNotes('');

    // Show confirmation
    alert('Refill request submitted successfully! You will be notified when it\'s ready for pickup.');
  };

  const requestBulkRefill = () => {
    const requests = selectedMedications.map(medicationId => ({
      medicationId,
      requestDate: new Date().toISOString(),
      status: 'pending' as const,
      estimatedReadyDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: refillNotes
    }));

    setRefillRequests(prev => [...prev, ...requests]);
    setSelectedMedications([]);
    setShowBulkRefill(false);
    setRefillNotes('');

    alert(`${requests.length} refill requests submitted successfully!`);
  };

  const updateRefillDate = (medicationId: string, newDate: string) => {
    onUpdateMedication(medicationId, { refillDate: newDate });
  };

  const markRefillCompleted = (requestId: string, medicationId: string) => {
    setRefillRequests(prev => 
      prev.map(req => 
        req.medicationId === medicationId 
          ? { ...req, status: 'completed' }
          : req
      )
    );

    // Update medication quantity (assuming standard refill amount)
    const medication = medications.find(med => med.id === medicationId);
    if (medication) {
      const standardRefillQuantity = medication.frequency === 'daily' ? 90 : 
                                   medication.frequency === 'weekly' ? 12 : 30;
      onUpdateMedication(medicationId, { 
        quantity: standardRefillQuantity,
        refillDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90 days from now
      });
    }
  };

  const getRefillStatus = (medicationId: string) => {
    return refillRequests.find(req => req.medicationId === medicationId && req.status !== 'completed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'processing':
        return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'ready':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'completed':
        return darkMode ? 'text-gray-400' : 'text-gray-500';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Refill Management
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Request refills, track status, and manage medication inventory
            </p>
          </div>
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

        <div className="p-6 space-y-8">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowBulkRefill(true)}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Bulk Refill Request</span>
            </button>
            
            <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <Package className="w-5 h-5" />
              <span>{refillRequests.filter(req => req.status !== 'completed').length} Active Requests</span>
            </div>
          </div>

          {/* Active Refill Requests */}
          {refillRequests.filter(req => req.status !== 'completed').length > 0 && (
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Active Refill Requests
              </h3>
              
              <div className="grid gap-4">
                {refillRequests
                  .filter(req => req.status !== 'completed')
                  .map((request, index) => {
                    const medication = medications.find(med => med.id === request.medicationId);
                    if (!medication) return null;

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className={`text-lg font-semibold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {medication.name}
                              </h4>
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                                request.status === 'ready' 
                                  ? darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                                  : request.status === 'processing'
                                  ? darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                                  : darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {getStatusIcon(request.status)}
                                <span className="capitalize">{request.status}</span>
                              </div>
                            </div>
                            
                            <p className={`text-sm mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {medication.dosage} • {medication.pharmacy}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  Requested:
                                </span>
                                <span className={`ml-2 ${
                                  darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {new Date(request.requestDate).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {request.estimatedReadyDate && (
                                <div>
                                  <span className={`font-medium ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    Est. Ready:
                                  </span>
                                  <span className={`ml-2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {new Date(request.estimatedReadyDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {request.notes && (
                              <p className={`text-sm mt-2 italic ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                "{request.notes}"
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            {request.status === 'ready' && (
                              <button
                                onClick={() => markRefillCompleted(request.medicationId, medication.id)}
                                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                              >
                                Mark Picked Up
                              </button>
                            )}
                            
                            <button
                              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                darkMode
                                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              <Phone className="w-4 h-4 inline mr-1" />
                              Call Pharmacy
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Low Quantity Alert */}
          {lowMedications.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Low Quantity - Immediate Refill Needed ({lowMedications.length})
                </h3>
              </div>
              
              <div className="grid gap-4">
                {lowMedications.map(medication => {
                  const refillStatus = getRefillStatus(medication.id);
                  
                  return (
                    <div
                      key={medication.id}
                      className={`p-6 rounded-2xl border-l-4 border-red-500 ${
                        darkMode ? 'bg-red-900/20' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-xl font-semibold mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {medication.name}
                          </h4>
                          <p className={`text-lg mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {medication.dosage}
                          </p>
                          <p className={`text-red-600 font-medium text-lg`}>
                            Only {getDaysRemaining(medication)} days remaining
                          </p>
                          <p className={`text-sm mt-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Current quantity: {medication.quantity}
                          </p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {refillStatus ? (
                            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                              refillStatus.status === 'ready' 
                                ? darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                                : darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {getStatusIcon(refillStatus.status)}
                              <span className="text-sm capitalize">{refillStatus.status}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowRefillForm(medication.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              Request Refill
                            </button>
                          )}
                          
                          <div className={`text-right ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <Package className="w-4 h-4" />
                              <span className="text-sm">{medication.pharmacy}</span>
                            </div>
                            {medication.prescriptionNumber && (
                              <p className="text-sm">
                                Rx: {medication.prescriptionNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Refills */}
          {refillSoon.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-orange-500" />
                <h3 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Refills Due Soon ({refillSoon.length})
                </h3>
              </div>
              
              <div className="grid gap-4">
                {refillSoon.map(medication => {
                  const daysUntilRefill = getDaysUntilRefill(medication);
                  const refillStatus = getRefillStatus(medication.id);
                  
                  return (
                    <div
                      key={medication.id}
                      className={`p-6 rounded-2xl border-l-4 border-orange-500 ${
                        darkMode ? 'bg-orange-900/20' : 'bg-orange-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-xl font-semibold mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {medication.name}
                          </h4>
                          <p className={`text-lg mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {medication.dosage}
                          </p>
                          <p className={`text-orange-600 font-medium text-lg`}>
                            Refill due in {daysUntilRefill} day{daysUntilRefill !== 1 ? 's' : ''}
                          </p>
                          <p className={`text-sm mt-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Due: {new Date(medication.refillDate).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {refillStatus ? (
                            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                              refillStatus.status === 'ready' 
                                ? darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                                : darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {getStatusIcon(refillStatus.status)}
                              <span className="text-sm capitalize">{refillStatus.status}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowRefillForm(medication.id)}
                              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                            >
                              Request Refill
                            </button>
                          )}
                          
                          <div className={`text-right ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <Package className="w-4 h-4" />
                              <span className="text-sm">{medication.pharmacy}</span>
                            </div>
                            {medication.prescriptionNumber && (
                              <p className="text-sm">
                                Rx: {medication.prescriptionNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Medications */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              All Medications ({medications.filter(med => med.isActive).length})
            </h3>
            
            <div className="grid gap-4">
              {medications.filter(med => med.isActive).map(medication => {
                const daysRemaining = getDaysRemaining(medication);
                const daysUntilRefill = getDaysUntilRefill(medication);
                const isLow = daysRemaining <= 7;
                const refillDue = daysUntilRefill && daysUntilRefill <= 7;
                const refillStatus = getRefillStatus(medication.id);
                
                return (
                  <div
                    key={medication.id}
                    className={`p-6 rounded-2xl border ${
                      darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: medication.color + '20', color: medication.color }}
                          >
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`text-lg font-semibold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {medication.name}
                            </h4>
                            <p className={`text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {medication.dosage}
                            </p>
                          </div>
                          
                          {refillStatus && (
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                              refillStatus.status === 'ready' 
                                ? darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                                : darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {getStatusIcon(refillStatus.status)}
                              <span className="capitalize">{refillStatus.status}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className={`text-sm font-medium mb-1 ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Quantity Remaining
                            </p>
                            <p className={`text-lg font-semibold ${
                              isLow ? 'text-red-600' : darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {medication.quantity} ({daysRemaining} days)
                            </p>
                          </div>
                          
                          <div>
                            <p className={`text-sm font-medium mb-1 ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Next Refill
                            </p>
                            <p className={`text-lg font-semibold ${
                              refillDue ? 'text-orange-600' : darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {medication.refillDate 
                                ? new Date(medication.refillDate).toLocaleDateString()
                                : 'Not set'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        {!refillStatus && daysRemaining <= 14 && (
                          <button
                            onClick={() => setShowRefillForm(medication.id)}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                              isLow 
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : refillDue
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            Request Refill
                          </button>
                        )}
                        
                        <div className={`text-right text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <Package className="w-4 h-4" />
                            <span>{medication.pharmacy}</span>
                          </div>
                          {medication.prescriptionNumber && (
                            <p>Rx: {medication.prescriptionNumber}</p>
                          )}
                          <p>Dr. {medication.doctorName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {lowMedications.length === 0 && refillSoon.length === 0 && (
            <div className={`text-center py-12 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">All medications are well stocked!</p>
              <p className="text-sm mt-2">No refills needed in the next 7 days.</p>
            </div>
          )}
        </div>
      </div>

      {/* Refill Request Form */}
      {showRefillForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className={`w-full max-w-md rounded-lg p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {(() => {
              const medication = medications.find(med => med.id === showRefillForm);
              if (!medication) return null;

              return (
                <>
                  <h3 className={`text-xl font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Request Refill
                  </h3>
                  
                  <div className="mb-4">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {medication.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {medication.dosage} • {medication.pharmacy}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Rx: {medication.prescriptionNumber}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Notes (optional)
                    </label>
                    <textarea
                      value={refillNotes}
                      onChange={(e) => setRefillNotes(e.target.value)}
                      rows={3}
                      placeholder="Any special instructions or notes..."
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowRefillForm(null);
                        setRefillNotes('');
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => requestRefill(medication.id, refillNotes)}
                      className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Submit Request
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Bulk Refill Form */}
      {showBulkRefill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Bulk Refill Request
            </h3>
            
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select medications to request refills for multiple prescriptions at once.
            </p>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {refillableMedications.map(medication => (
                <label
                  key={medication.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedMedications.includes(medication.id)
                      ? darkMode ? 'border-blue-500 bg-blue-500/20' : 'border-blue-500 bg-blue-50'
                      : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMedications.includes(medication.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMedications(prev => [...prev, medication.id]);
                      } else {
                        setSelectedMedications(prev => prev.filter(id => id !== medication.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {medication.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {medication.dosage} • {getDaysRemaining(medication)} days remaining
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Notes for all selected medications (optional)
              </label>
              <textarea
                value={refillNotes}
                onChange={(e) => setRefillNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions or notes..."
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowBulkRefill(false);
                  setSelectedMedications([]);
                  setRefillNotes('');
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={requestBulkRefill}
                disabled={selectedMedications.length === 0}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Request {selectedMedications.length} Refills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}