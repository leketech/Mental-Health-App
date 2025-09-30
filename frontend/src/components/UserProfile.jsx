import React, { useState, useEffect } from 'react';
import api from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function UserProfile() {
  const { classes } = useTheme();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setProfile(res.data);
      setEditForm({
        name: res.data.name || '',
        email: res.data.email || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/user/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        name: profile.name || '',
        email: profile.email || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const response = await api.put('/user/profile', editForm);
      setProfile(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    }
    setSaveLoading(false);
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'from-yellow-400 to-orange-400',
      sad: 'from-blue-400 to-blue-600',
      anxious: 'from-red-400 to-pink-500',
      calm: 'from-green-400 to-emerald-500',
      angry: 'from-red-500 to-red-700',
      excited: 'from-purple-400 to-pink-500',
      tired: 'from-gray-400 to-gray-600',
      neutral: 'from-gray-300 to-gray-500'
    };
    return colors[mood] || 'from-gray-300 to-gray-500';
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😟',
      calm: '🧘‍♀️',
      angry: '😠',
      excited: '🎉',
      tired: '😴',
      neutral: '😐'
    };
    return emojis[mood] || '😐';
  };

  if (loading) {
    return (
      <div className={`max-w-6xl mx-auto p-6 ${classes.transition}`}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className={`text-lg ${classes.textSecondary}`}>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-6xl mx-auto p-6 ${classes.transition}`}>
        <div className={`${classes.card} p-8 text-center`}>
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold ${classes.textPrimary} mb-2`}>Oops! Something went wrong</h2>
          <p className={`${classes.textSecondary} mb-6`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg font-semibold ${classes.button} ${classes.transition} hover:shadow-lg transform hover:scale-105`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${classes.transition}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-3xl mb-4">
          👤
        </div>
        <h1 className={`text-3xl font-bold ${classes.textPrimary}`}>Your Profile</h1>
        <p className={`text-lg ${classes.textSecondary}`}>
          Track your mental health journey and view your progress.
        </p>
      </div>

      {/* Profile Information */}
      {profile && (
        <div className={`${classes.card} p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${classes.textPrimary}`}>Profile Information</h2>
            <div className="flex items-center gap-2">
              {isEditing && (
                <button 
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className={`px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 ${classes.transition} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saveLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              )}
              <button 
                onClick={handleEditToggle}
                className={`px-4 py-2 rounded-lg font-medium ${classes.textSecondary} ${classes.hover} ${classes.transition}`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${classes.bgSecondary} border border-[var(--border-primary)]`}>
                <label className={`block text-sm font-medium ${classes.textMuted} mb-1`}>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className={`w-full text-lg font-medium ${classes.textPrimary} bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded p-2`}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className={`text-lg font-medium ${classes.textPrimary}`}>{profile.name}</p>
                )}
              </div>
              <div className={`p-4 rounded-lg ${classes.bgSecondary} border border-[var(--border-primary)]`}>
                <label className={`block text-sm font-medium ${classes.textMuted} mb-1`}>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className={`w-full text-lg font-medium ${classes.textPrimary} bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded p-2`}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <p className={`text-lg font-medium ${classes.textPrimary}`}>{profile.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${classes.bgSecondary} border border-[var(--border-primary)]`}>
                <label className={`block text-sm font-medium ${classes.textMuted} mb-1`}>Member Since</label>
                <p className={`text-lg font-medium ${classes.textPrimary}`}>{profile.member_since}</p>
              </div>
              <div className={`p-4 rounded-lg ${classes.bgSecondary} border border-[var(--border-primary)]`}>
                <label className={`block text-sm font-medium ${classes.textMuted} mb-1`}>User ID</label>
                <p className={`text-lg font-medium ${classes.textPrimary} font-mono text-sm`}>{profile.user_id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Overview */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${classes.card} p-8 text-center transform hover:scale-105 ${classes.transition}`}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl mx-auto mb-4">
              🌤️
            </div>
            <div className={`text-3xl font-bold ${classes.textPrimary} mb-2`}>
              {profile.mood_entries || 0}
            </div>
            <p className={`${classes.textSecondary} font-medium`}>Mood Entries</p>
            <p className={`text-sm ${classes.textMuted} mt-1`}>Track your daily emotions</p>
          </div>
          
          <div className={`${classes.card} p-8 text-center transform hover:scale-105 ${classes.transition}`}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl mx-auto mb-4">
              📝
            </div>
            <div className={`text-3xl font-bold ${classes.textPrimary} mb-2`}>
              {profile.journal_entries || 0}
            </div>
            <p className={`${classes.textSecondary} font-medium`}>Journal Entries</p>
            <p className={`text-sm ${classes.textMuted} mt-1`}>Express your thoughts</p>
          </div>
        </div>
      )}

      {/* Mood Statistics */}
      {stats && stats.mood_statistics && stats.mood_statistics.length > 0 && (
        <div className={`${classes.card} p-8`}>
          <h2 className={`text-2xl font-bold ${classes.textPrimary} mb-6`}>Mood Distribution</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.mood_statistics.map((moodStat, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${classes.bgSecondary} border border-[var(--border-primary)] ${classes.hover} ${classes.transition}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getMoodColor(moodStat.mood)} flex items-center justify-center text-lg`}>
                    {getMoodEmoji(moodStat.mood)}
                  </div>
                  <span className={`text-2xl font-bold ${classes.textPrimary}`}>
                    {moodStat.count}
                  </span>
                </div>
                <p className={`font-medium capitalize ${classes.textPrimary}`}>
                  {moodStat.mood}
                </p>
                <p className={`text-sm ${classes.textMuted}`}>
                  {moodStat.count === 1 ? 'time' : 'times'} recorded
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats && stats.recent_activity && stats.recent_activity.length > 0 && (
        <div className={`${classes.card} p-8`}>
          <h2 className={`text-2xl font-bold ${classes.textPrimary} mb-6`}>Recent Activity</h2>
          
          <div className="space-y-4">
            {stats.recent_activity.map((activity, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${classes.bgSecondary} border border-[var(--border-primary)] flex items-center justify-between ${classes.hover} ${classes.transition}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center text-white text-sm">
                    {new Date(activity.date).getDate()}
                  </div>
                  <div>
                    <p className={`font-medium ${classes.textPrimary}`}>
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className={`text-sm ${classes.textMuted}`}>
                      {activity.entries} {activity.entries === 1 ? 'entry' : 'entries'} recorded
                    </p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${classes.textSecondary}`}>
                  •
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Statistics */}
      {(!stats || (!stats.mood_statistics?.length && !stats.recent_activity?.length)) && (
        <div className={`${classes.card} p-12 text-center`}>
          <div className="text-6xl mb-4">📈</div>
          <h3 className={`text-xl font-semibold ${classes.textPrimary} mb-2`}>No statistics yet</h3>
          <p className={`${classes.textSecondary} mb-6`}>
            Start tracking your moods and creating journal entries to see your progress!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-6 py-3 rounded-lg font-semibold ${classes.button} ${classes.transition} hover:shadow-lg transform hover:scale-105`}>
              Track Your Mood
            </button>
            <button className={`px-6 py-3 rounded-lg font-semibold border-2 border-[var(--accent-primary)] ${classes.accentPrimary} ${classes.hover} ${classes.transition}`}>
              Write in Journal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
