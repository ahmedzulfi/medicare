import React, { useState } from 'react';
import { X, Download, Printer as Print, User, Calendar, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Pill, Star, FileText, Share2, Mail } from 'lucide-react';
import { Medication, MedicationDose, Profile, Analytics } from '../types/medication';

interface DoctorReportProps {
  medications: Medication[];
  doses: MedicationDose[];
  currentProfile: Profile;
  analytics: Analytics;
  onClose: () => void;
  darkMode: boolean;
}

export default function DoctorReport({
  medications,
  doses,
  currentProfile,
  analytics,
  onClose,
  darkMode
}: DoctorReportProps) {
  const [reportPeriod, setReportPeriod] = useState<'30' | '60' | '90'>('30');
  const [includePersonalInfo, setIncludePersonalInfo] = useState(true);
  const [includeSideEffects, setIncludeSideEffects] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);

  const generateReportData = () => {
    const days = parseInt(reportPeriod);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const periodDoses = doses.filter(dose => {
      const doseDate = new Date(dose.date);
      return doseDate >= startDate && doseDate <= endDate;
    });

    const periodMedications = medications.filter(med => 
      periodDoses.some(dose => dose.medicationId === med.id)
    );

    // Calculate period-specific analytics
    const totalDoses = periodDoses.length;
    const takenDoses = periodDoses.filter(dose => dose.taken).length;
    const complianceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

    // Medication-specific compliance
    const medicationCompliance = periodMedications.map(med => {
      const medDoses = periodDoses.filter(dose => dose.medicationId === med.id);
      const medTaken = medDoses.filter(dose => dose.taken).length;
      const medCompliance = medDoses.length > 0 ? Math.round((medTaken / medDoses.length) * 100) : 0;
      
      return {
        medication: med,
        totalDoses: medDoses.length,
        takenDoses: medTaken,
        compliance: medCompliance,
        averageEffectiveness: medDoses
          .filter(dose => dose.taken && dose.effectiveness)
          .reduce((sum, dose) => sum + (dose.effectiveness || 0), 0) / 
          Math.max(medDoses.filter(dose => dose.taken && dose.effectiveness).length, 1),
        sideEffects: [...new Set(medDoses.flatMap(dose => dose.sideEffects || []))]
      };
    });

    // Side effects summary
    const allSideEffects = periodDoses.flatMap(dose => dose.sideEffects || []);
    const sideEffectFrequency = allSideEffects.reduce((acc, effect) => {
      acc[effect] = (acc[effect] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Notes summary
    const notesWithDates = periodDoses
      .filter(dose => dose.notes && dose.taken)
      .map(dose => ({
        date: dose.date,
        time: dose.takenTime,
        medication: medications.find(med => med.id === dose.medicationId)?.name || 'Unknown',
        note: dose.notes
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      period: { days, startDate, endDate },
      overview: { totalDoses, takenDoses, complianceRate },
      medicationCompliance,
      sideEffectFrequency,
      notesWithDates
    };
  };

  const reportData = generateReportData();

  const exportToPDF = () => {
    const printContent = document.getElementById('doctor-report-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Medical Report - ${currentProfile.name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
                .section { margin-bottom: 30px; }
                .medication-item { border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
                .compliance-good { color: #059669; }
                .compliance-warning { color: #d97706; }
                .compliance-poor { color: #dc2626; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
                th { background-color: #f9fafb; }
                .side-effect { background-color: #fef2f2; padding: 5px 10px; border-radius: 4px; margin: 2px; display: inline-block; }
                .note-item { background-color: #f0f9ff; padding: 10px; margin: 5px 0; border-radius: 4px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const shareReport = async () => {
    const reportText = `Medical Adherence Report for ${currentProfile.name}
Report Period: ${reportData.period.startDate.toLocaleDateString()} - ${reportData.period.endDate.toLocaleDateString()}
Overall Compliance: ${reportData.overview.complianceRate}%
Total Doses: ${reportData.overview.takenDoses}/${reportData.overview.totalDoses}

Generated by MedTracker on ${new Date().toLocaleDateString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Medical Report - ${currentProfile.name}`,
          text: reportText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(reportText);
      alert('Report summary copied to clipboard!');
    }
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBadge = (rate: number) => {
    if (rate >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (rate >= 70) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Attention', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Doctor Report
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive medication adherence report for medical consultation
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={shareReport}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              title="Share Report"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={exportToPDF}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              title="Print Report"
            >
              <Print className="w-5 h-5" />
            </button>
            
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
        </div>

        {/* Report Configuration */}
        <div className={`p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Report Period
              </label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value as '30' | '60' | '90')}
                className={`px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="30">Last 30 Days</option>
                <option value="60">Last 60 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includePersonalInfo}
                  onChange={(e) => setIncludePersonalInfo(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Personal Info
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeSideEffects}
                  onChange={(e) => setIncludeSideEffects(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Side Effects
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Patient Notes
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div id="doctor-report-content" className="p-6">
          {/* Report Header */}
          <div className="header mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Medication Adherence Report
                </h1>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {reportData.period.startDate.toLocaleDateString()} - {reportData.period.endDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            {includePersonalInfo && (
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Patient Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {currentProfile.name}</p>
                    {currentProfile.dateOfBirth && (
                      <p><strong>Date of Birth:</strong> {new Date(currentProfile.dateOfBirth).toLocaleDateString()}</p>
                    )}
                    {currentProfile.emergencyContact && (
                      <p><strong>Emergency Contact:</strong> {currentProfile.emergencyContact}</p>
                    )}
                    {currentProfile.preferredPharmacy && (
                      <p><strong>Preferred Pharmacy:</strong> {currentProfile.preferredPharmacy}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Medical Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    {currentProfile.allergies && currentProfile.allergies.length > 0 && (
                      <p><strong>Allergies:</strong> {currentProfile.allergies.join(', ')}</p>
                    )}
                    {currentProfile.medicalConditions && currentProfile.medicalConditions.length > 0 && (
                      <p><strong>Conditions:</strong> {currentProfile.medicalConditions.join(', ')}</p>
                    )}
                    <p><strong>Report Generated:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Executive Summary */}
          <div className="section mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Executive Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className={`p-4 rounded-lg text-center ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${getComplianceColor(reportData.overview.complianceRate)}`}>
                  {reportData.overview.complianceRate}%
                </div>
                <div className="text-sm font-medium">Overall Compliance</div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                  getComplianceBadge(reportData.overview.complianceRate).color
                }`}>
                  {getComplianceBadge(reportData.overview.complianceRate).text}
                </div>
              </div>

              <div className={`p-4 rounded-lg text-center ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {reportData.overview.takenDoses}
                </div>
                <div className="text-sm font-medium">Doses Completed</div>
                <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  of {reportData.overview.totalDoses} scheduled
                </div>
              </div>

              <div className={`p-4 rounded-lg text-center ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.streakDays}
                </div>
                <div className="text-sm font-medium">Current Streak</div>
                <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  consecutive days
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-blue-500/10 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Clinical Summary
              </h3>
              <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                Patient demonstrates {reportData.overview.complianceRate >= 90 ? 'excellent' : reportData.overview.complianceRate >= 70 ? 'good' : 'poor'} medication adherence 
                over the {reportPeriod}-day period with {reportData.overview.complianceRate}% compliance rate. 
                {analytics.streakDays >= 7 && ` Current adherence streak of ${analytics.streakDays} days indicates consistent medication-taking behavior.`}
                {reportData.overview.complianceRate < 70 && ' Recommend discussing barriers to adherence and potential interventions.'}
              </p>
            </div>
          </div>

          {/* Medication-Specific Analysis */}
          <div className="section mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Medication-Specific Analysis
            </h2>
            
            <div className="space-y-4">
              {reportData.medicationCompliance.map((medData, index) => (
                <div key={index} className={`medication-item p-4 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {medData.medication.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {medData.medication.dosage} • {medData.medication.frequency} • Dr. {medData.medication.doctorName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getComplianceColor(medData.compliance)}`}>
                        {medData.compliance}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {medData.takenDoses}/{medData.totalDoses} doses
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Adherence Details
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>Scheduled: {medData.totalDoses} doses</li>
                        <li>Completed: {medData.takenDoses} doses</li>
                        <li>Missed: {medData.totalDoses - medData.takenDoses} doses</li>
                        {medData.averageEffectiveness > 0 && (
                          <li>Avg Effectiveness: {medData.averageEffectiveness.toFixed(1)}/5</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Prescription Info
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>Type: {medData.medication.medicationType}</li>
                        <li>Pharmacy: {medData.medication.pharmacy}</li>
                        {medData.medication.prescriptionNumber && (
                          <li>Rx: {medData.medication.prescriptionNumber}</li>
                        )}
                        <li>Times: {medData.medication.times.join(', ')}</li>
                      </ul>
                    </div>

                    {includeSideEffects && medData.sideEffects.length > 0 && (
                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Reported Side Effects
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {medData.sideEffects.map((effect, idx) => (
                            <span
                              key={idx}
                              className="side-effect px-2 py-1 text-xs rounded bg-red-100 text-red-700"
                            >
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {medData.medication.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className={`font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Prescription Notes
                      </h4>
                      <p className="text-sm italic">{medData.medication.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Side Effects Summary */}
          {includeSideEffects && Object.keys(reportData.sideEffectFrequency).length > 0 && (
            <div className="section mb-8">
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Side Effects Summary
              </h2>
              
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-red-500/10 border border-red-400/30' : 'bg-red-50 border border-red-200'
              }`}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Side Effect</th>
                      <th className="text-left py-2">Frequency</th>
                      <th className="text-left py-2">Percentage of Doses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.sideEffectFrequency)
                      .sort(([,a], [,b]) => b - a)
                      .map(([effect, count]) => (
                        <tr key={effect}>
                          <td className="py-2">{effect}</td>
                          <td className="py-2">{count} times</td>
                          <td className="py-2">
                            {Math.round((count / reportData.overview.takenDoses) * 100)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Patient Notes */}
          {includeNotes && reportData.notesWithDates.length > 0 && (
            <div className="section mb-8">
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Patient Notes & Observations
              </h2>
              
              <div className="space-y-3">
                {reportData.notesWithDates.slice(0, 10).map((note, index) => (
                  <div key={index} className={`note-item p-3 rounded-lg ${
                    darkMode ? 'bg-blue-500/10 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                          "{note.note}"
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                          {note.medication}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                          {new Date(note.date).toLocaleDateString()} {note.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reportData.notesWithDates.length > 10 && (
                  <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ... and {reportData.notesWithDates.length - 10} more notes
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="section">
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Clinical Recommendations
            </h2>
            
            <div className="space-y-3">
              {reportData.overview.complianceRate >= 90 && (
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-green-500/10 border border-green-400/30' : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                        Excellent Adherence
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                        Patient demonstrates excellent medication adherence. Continue current regimen and monitoring schedule.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {reportData.overview.complianceRate < 70 && (
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-red-500/10 border border-red-400/30' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                        Adherence Intervention Needed
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                        Consider discussing barriers to adherence, simplifying regimen, or implementing additional support measures.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {Object.keys(reportData.sideEffectFrequency).length > 0 && (
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-yellow-500/10 border border-yellow-400/30' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                        Side Effects Monitoring
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                        Patient has reported {Object.keys(reportData.sideEffectFrequency).length} different side effects. 
                        Review medication tolerability and consider adjustments if needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-blue-500/10 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      Continued Monitoring
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                      Patient is actively tracking medication adherence using digital tools. 
                      Recommend continuing current monitoring approach for next visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Footer */}
          <div className={`mt-8 pt-6 border-t text-center text-sm ${
            darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
          }`}>
            <p>This report was generated by MedTracker on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            <p className="mt-1">Data collected from patient self-reporting via digital medication tracking application</p>
          </div>
        </div>
      </div>
    </div>
  );
}