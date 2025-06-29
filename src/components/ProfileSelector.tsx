import React, { useState } from 'react';
import { User, Plus, X, Save } from 'lucide-react';
import { Profile } from '../types/medication';

interface ProfileSelectorProps {
  profiles: Profile[];
  currentProfile: Profile;
  onSelectProfile: (profile: Profile) => void;
  onAddProfile: (profile: Omit<Profile, 'id'>) => void;
  onClose: () => void;
  darkMode: boolean;
}

export default function ProfileSelector({
  profiles,
  currentProfile,
  onSelectProfile,
  onAddProfile,
  onClose,
  darkMode
}: ProfileSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    relationship: ''
  });

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfile.name.trim()) {
      onAddProfile(newProfile);
      setNewProfile({ name: '', relationship: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-md rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Select Profile
          </h2>
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

        <div className="p-6">
          {!showAddForm ? (
            <>
              {/* Profile List */}
              <div className="space-y-3 mb-6">
                {profiles.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      onSelectProfile(profile);
                      onClose();
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      profile.id === currentProfile.id
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        profile.id === currentProfile.id
                          ? 'bg-white/20'
                          : darkMode
                          ? 'bg-gray-600'
                          : 'bg-gray-200'
                      }`}>
                        <User className={`w-5 h-5 ${
                          profile.id === currentProfile.id
                            ? 'text-white'
                            : darkMode
                            ? 'text-gray-300'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{profile.name}</p>
                        {profile.relationship && (
                          <p className={`text-sm ${
                            profile.id === currentProfile.id
                              ? 'text-white/80'
                              : darkMode
                              ? 'text-gray-400'
                              : 'text-gray-600'
                          }`}>
                            {profile.relationship}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Add Profile Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className={`w-full p-4 rounded-xl border-2 border-dashed transition-colors ${
                  darkMode
                    ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add New Profile</span>
                </div>
              </button>
            </>
          ) : (
            /* Add Profile Form */
            <form onSubmit={handleAddProfile} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Name *
                </label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter name"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Relationship
                </label>
                <input
                  type="text"
                  value={newProfile.relationship}
                  onChange={(e) => setNewProfile({ ...newProfile, relationship: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Self, Mother, Father"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewProfile({ name: '', relationship: '' });
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}