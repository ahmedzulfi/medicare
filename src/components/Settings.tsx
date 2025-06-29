import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Download, 
  Upload, 
  Trash2,
  Eye,
  Volume2,
  VolumeX,
  Globe,
  Clock,
  Shield,
  Database,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AppSettings } from '../types/medication';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportData: () => void;
  onImportData: (file: File) => Promise<void>;
  darkMode: boolean;
  notificationPermission?: NotificationPermission;
}

export default function Settings({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  darkMode,
  notificationPermission = 'default'
}: SettingsProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const handleImport = async () => {
    if (!importFile) return;
    
    setImporting(true);
    try {
      await onImportData(importFile);
      setImportFile(null);
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data: ' + (error as Error).message);
    } finally {
      setImporting(false);
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdateSettings({ 
          notifications: { 
            ...settings.notifications, 
            browserNotifications: true 
          }
        });
      }
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('MedTracker Test Notification', {
        body: 'Notifications are working correctly!',
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    }
  };

  const getNotificationStatusIcon = () => {
    switch (notificationPermission) {
      case 'granted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationStatusText = () => {
    switch (notificationPermission) {
      case 'granted':
        return 'Enabled';
      case 'denied':
        return 'Blocked';
      default:
        return 'Not requested';
    }
  };

  return (
    <div className="space-y-8">
      {/* Appearance */}
      <div className={`p-6 rounded-lg backdrop-blur-sm ${
        darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <Eye className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Appearance
          </h3>
        </div>

        <div className="space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dark Mode
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  High Contrast
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Improve visibility with higher contrast
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="w-5 h-5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Font Size
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Adjust text size for better readability
                </p>
              </div>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: e.target.value as any })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white/60 border-gray-200/30 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={`p-6 rounded-lg backdrop-blur-sm ${
        darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <Bell className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Notifications & Reminders
          </h3>
        </div>

        <div className="space-y-6">
          {/* Notification Permission Status */}
          <div className={`p-4 rounded-lg ${
            notificationPermission === 'granted' 
              ? darkMode ? 'bg-green-500/20 border border-green-400/30' : 'bg-green-100 border border-green-200'
              : notificationPermission === 'denied'
              ? darkMode ? 'bg-red-500/20 border border-red-400/30' : 'bg-red-100 border border-red-200'
              : darkMode ? 'bg-yellow-500/20 border border-yellow-400/30' : 'bg-yellow-100 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getNotificationStatusIcon()}
                <div>
                  <p className={`font-medium ${
                    notificationPermission === 'granted' 
                      ? darkMode ? 'text-green-300' : 'text-green-700'
                      : notificationPermission === 'denied'
                      ? darkMode ? 'text-red-300' : 'text-red-700'
                      : darkMode ? 'text-yellow-300' : 'text-yellow-700'
                  }`}>
                    Browser Notifications: {getNotificationStatusText()}
                  </p>
                  <p className={`text-sm ${
                    notificationPermission === 'granted' 
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : notificationPermission === 'denied'
                      ? darkMode ? 'text-red-400' : 'text-red-600'
                      : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {notificationPermission === 'granted' 
                      ? 'You will receive medication reminders'
                      : notificationPermission === 'denied'
                      ? 'Notifications are blocked. Enable in browser settings.'
                      : 'Click to enable medication reminders'
                    }
                  </p>
                </div>
              </div>
              
              {notificationPermission !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Enable
                </button>
              )}
              
              {notificationPermission === 'granted' && (
                <button
                  onClick={sendTestNotification}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    testNotificationSent
                      ? 'bg-green-500 text-white'
                      : darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {testNotificationSent ? 'Sent!' : 'Test'}
                </button>
              )}
            </div>
          </div>

          {/* Browser Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Push Notifications
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Receive notifications even when app is closed
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ 
                notifications: { 
                  ...settings.notifications, 
                  browserNotifications: !settings.notifications.browserNotifications 
                }
              })}
              disabled={notificationPermission !== 'granted'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.browserNotifications && notificationPermission === 'granted' 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300'
              } ${notificationPermission !== 'granted' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.browserNotifications && notificationPermission === 'granted' 
                    ? 'translate-x-6' 
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.notifications.soundAlerts ? 
                <Volume2 className="w-5 h-5" /> : 
                <VolumeX className="w-5 h-5" />
              }
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sound Alerts
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Play sound when notifications appear
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ 
                notifications: { 
                  ...settings.notifications, 
                  soundAlerts: !settings.notifications.soundAlerts 
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.soundAlerts ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.soundAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reminder Times */}
          <div>
            <p className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Reminder Times (minutes before scheduled dose)
            </p>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 30, 60, 120].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => {
                    const current = settings.notifications.reminderMinutes;
                    const updated = current.includes(minutes)
                      ? current.filter(m => m !== minutes)
                      : [...current, minutes].sort((a, b) => a - b);
                    
                    onUpdateSettings({
                      notifications: {
                        ...settings.notifications,
                        reminderMinutes: updated
                      }
                    });
                  }}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.notifications.reminderMinutes.includes(minutes)
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {minutes}m
                </button>
              ))}
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Select multiple reminder times. You'll be notified at each selected interval before your medication is due.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className={`p-6 rounded-lg backdrop-blur-sm ${
        darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/20'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <Database className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Data Management
          </h3>
        </div>

        <div className="space-y-6">
          {/* Auto Backup */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Auto Backup
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automatically backup your data locally
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoBackup: !settings.autoBackup })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoBackup ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Export Data */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Export Data
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Download your data as a backup file
                </p>
              </div>
            </div>
            <button
              onClick={onExportData}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Export
            </button>
          </div>

          {/* Import Data */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Import Data
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Restore data from a backup file
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  darkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Choose File
              </label>
              {importFile && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              )}
            </div>
          </div>

          {/* Data Retention */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Data Retention
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  How long to keep historical data
                </p>
              </div>
            </div>
            <select
              value={settings.dataRetentionDays}
              onChange={(e) => onUpdateSettings({ dataRetentionDays: parseInt(e.target.value) })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white/60 border-gray-200/30 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={-1}>Forever</option>
            </select>
          </div>

          {/* Clear All Data */}
          <div className="flex items-center justify-between pt-4 border-t border-red-500/20">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <p className={`font-medium text-red-500`}>
                  Clear All Data
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Permanently delete all your data
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>

      {/* Clear Data Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 text-red-500`}>
              Clear All Data
            </h3>
            <p className={`mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Are you sure you want to delete all your data? This action cannot be undone and will remove all medications, doses, profiles, and settings.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}