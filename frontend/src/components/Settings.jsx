import React from 'react';
import { useTheme } from '../contexts/ThemeContext.js';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/auth';

const Settings = ({ user, onLogout }) => {
  const { classes, toggleTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleExportData = async () => {
    try {
      const response = await api.get('/user/export');
      const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `unwindmind-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${classes.bgPrimary}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 ${classes.textSecondary} hover:${classes.textPrimary} transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <h1 className={`text-3xl font-bold mb-8 ${classes.textPrimary}`}>Settings</h1>

        <div className="space-y-6">
          <div className={`${classes.bgSecondary} rounded-lg p-6 ${classes.borderPrimary} border`}>
            <h2 className={`text-xl font-semibold mb-4 ${classes.textPrimary}`}>Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${classes.textPrimary}`}>Dark Mode</p>
                <p className={`text-sm ${classes.textSecondary}`}>Toggle theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div className={`${classes.bgSecondary} rounded-lg p-6 ${classes.borderPrimary} border`}>
            <h2 className={`text-xl font-semibold mb-4 ${classes.textPrimary}`}>Privacy & Data</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${classes.textPrimary}`}>Export Data</p>
                  <p className={`text-sm ${classes.textSecondary}`}>Download your data (GDPR)</p>
                </div>
                <button
                  onClick={handleExportData}
                  className={`px-4 py-2 text-sm ${classes.bgPrimary} ${classes.textPrimary} border rounded`}
                >
                  Export
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${classes.textPrimary}`}>Privacy Policy</p>
                </div>
                <Link
                  to="/privacy-policy"
                  className={`px-4 py-2 text-sm ${classes.bgPrimary} ${classes.textPrimary} border rounded`}
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;