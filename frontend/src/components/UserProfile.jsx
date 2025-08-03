import React, { useState, useEffect } from 'react';
import api from '../utils/auth';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/user/profile');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/user/stats');
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

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>👤 User Profile</h2>
      
      {/* Profile Information */}
      {profile && (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: 8, 
          padding: 20, 
          marginBottom: 20,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Profile Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div>
              <strong>Name:</strong> {profile.name}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            <div>
              <strong>Member Since:</strong> {profile.member_since}
            </div>
            <div>
              <strong>User ID:</strong> {profile.user_id}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {profile && (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: 8, 
          padding: 20, 
          marginBottom: 20,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Activity Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ textAlign: 'center', padding: 15, backgroundColor: '#e3f2fd', borderRadius: 5 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2' }}>
                {profile.mood_entries}
              </div>
              <div style={{ color: '#666' }}>Mood Entries</div>
            </div>
            <div style={{ textAlign: 'center', padding: 15, backgroundColor: '#f3e5f5', borderRadius: 5 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#7b1fa2' }}>
                {profile.journal_entries}
              </div>
              <div style={{ color: '#666' }}>Journal Entries</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Statistics */}
      {stats && (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: 8, 
          padding: 20, 
          marginBottom: 20,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Mood Statistics</h3>
          
          {stats.mood_statistics && stats.mood_statistics.length > 0 ? (
            <div>
              {stats.mood_statistics.map((moodStat, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: index < stats.mood_statistics.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {moodStat.mood}
                  </span>
                  <span style={{ 
                    backgroundColor: '#4a6fa5', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: 12,
                    fontSize: 14
                  }}>
                    {moodStat.count} times
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No mood statistics available yet.</p>
          )}
        </div>
      )}

      {/* Recent Activity */}
      {stats && stats.recent_activity && (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: 8, 
          padding: 20,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Recent Activity</h3>
          
          {stats.recent_activity.length > 0 ? (
            <div>
              {stats.recent_activity.map((activity, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < stats.recent_activity.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <span>{new Date(activity.date).toLocaleDateString()}</span>
                  <span style={{ color: '#666' }}>{activity.entries} entries</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No recent activity to display.</p>
          )}
        </div>
      )}
    </div>
  );
}
