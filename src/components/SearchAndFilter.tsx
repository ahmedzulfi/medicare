import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import { SearchFilters, Medication } from '../types/medication';

interface SearchAndFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  medications: Medication[];
  darkMode: boolean;
}

export default function SearchAndFilter({
  filters,
  onFiltersChange,
  medications,
  darkMode
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const uniqueValues = {
    medicationTypes: [...new Set(medications.map(med => med.medicationType))],
    frequencies: [...new Set(medications.map(med => med.frequency))],
    doctors: [...new Set(medications.map(med => med.doctorName))],
    pharmacies: [...new Set(medications.map(med => med.pharmacy))]
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleArrayFilterToggle = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    onFiltersChange({ ...filters, [key]: newArray });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      medicationType: [],
      frequency: [],
      doctor: [],
      pharmacy: [],
      status: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.query || 
    filters.medicationType.length > 0 || 
    filters.frequency.length > 0 || 
    filters.doctor.length > 0 || 
    filters.pharmacy.length > 0 || 
    filters.status !== 'all';

  return (
    <div className={`p-4 sm:p-6 rounded-lg backdrop-blur-sm mb-6 ${
      darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
    }`}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search medications, doctors, pharmacies..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border text-base backdrop-blur-sm ${
              darkMode 
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                : 'bg-white/60 border-gray-200/30 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-blue-500 text-white'
                : darkMode
                ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                : 'bg-gray-200/60 hover:bg-gray-300/60 text-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {[
                  filters.medicationType.length,
                  filters.frequency.length,
                  filters.doctor.length,
                  filters.pharmacy.length,
                  filters.status !== 'all' ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`p-3 rounded-lg transition-all ${
                darkMode
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                : 'bg-red-100/60 hover:bg-red-200/60 text-red-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Medication Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Medication Type
              </label>
              <div className="space-y-2">
                {uniqueValues.medicationTypes.map(type => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.medicationType.includes(type)}
                      onChange={() => handleArrayFilterToggle('medicationType', type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm capitalize ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Frequency
              </label>
              <div className="space-y-2">
                {uniqueValues.frequencies.map(frequency => (
                  <label key={frequency} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.frequency.includes(frequency)}
                      onChange={() => handleArrayFilterToggle('frequency', frequency)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm capitalize ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {frequency.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Medications</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Doctors and Pharmacies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Doctors
              </label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {uniqueValues.doctors.map(doctor => (
                  <label key={doctor} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.doctor.includes(doctor)}
                      onChange={() => handleArrayFilterToggle('doctor', doctor)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {doctor}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Pharmacies
              </label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {uniqueValues.pharmacies.map(pharmacy => (
                  <label key={pharmacy} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.pharmacy.includes(pharmacy)}
                      onChange={() => handleArrayFilterToggle('pharmacy', pharmacy)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {pharmacy}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="name">Name</option>
                <option value="time">Time</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="effectiveness">Effectiveness</option>
              </select>
            </div>

            <div className="flex-shrink-0">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Order
              </label>
              <button
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/30 text-gray-900 hover:bg-white/80'
                }`}
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}