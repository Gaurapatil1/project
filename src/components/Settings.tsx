import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Database, Key, Palette, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAppContext } from '../context/AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiClient } from '../services/api';

export function Settings() {
  const { state, dispatch } = useAppContext();
  const [apiKey, setApiKey] = useLocalStorage('apiKey', '');
  const [apiBaseUrl, setApiBaseUrl] = useLocalStorage('apiBaseUrl', state.settings.apiBaseUrl);

  const handleToggleMockMode = () => {
    const newUseMock = !state.settings.useMockData;
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { useMockData: newUseMock } 
    });
    apiClient.setMockMode(newUseMock);
  };

  const handleApiBaseUrlChange = (url: string) => {
    setApiBaseUrl(url);
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { apiBaseUrl: url } 
    });
    apiClient.setBaseURL(url);
  };

  const handleResetSession = () => {
    dispatch({ type: 'RESET_SESSION' });
  };

  const handleToggleTheme = () => {
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { theme: newTheme } 
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <SettingsIcon className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your application preferences</p>
        </div>
      </motion.div>

      {/* Data Source Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Data Source</h2>
          </div>

          <div className="space-y-6">
            {/* Mock Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Use Mock Data
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Enable to use sample data for testing and demos
                </p>
              </div>
              <button
                onClick={handleToggleMockMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  state.settings.useMockData ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.settings.useMockData ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* API Base URL */}
            {!state.settings.useMockData && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  API Base URL
                </label>
                <input
                  type="url"
                  value={apiBaseUrl}
                  onChange={(e) => handleApiBaseUrlChange(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Base URL for your backend API
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Stored locally and used for API authentication when available
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                Dark Mode
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Toggle between light and dark themes
              </p>
            </div>
            <button
              onClick={handleToggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                state.settings.theme === 'dark' ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Session Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <RefreshCw className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Session Management</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Current Session
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Job Description: {state.currentJob ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                <p>Resumes: {state.uploadedResumes.length} uploaded</p>
                <p>Results: {state.evaluationResults.length} evaluated</p>
              </div>
            </div>

            <Button
              onClick={handleResetSession}
              variant="destructive"
              size="sm"
            >
              Reset Session
            </Button>
            <p className="text-sm text-gray-500">
              Clear all uploaded files and results. This action cannot be undone.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Environment Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-mono">{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className="font-mono">{import.meta.env.MODE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mock Mode:</span>
              <span className="font-mono">{state.settings.useMockData ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}