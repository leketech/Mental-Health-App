import React, { useState, useEffect } from 'react';
import api from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function MoodTracker() {
  const { classes } = useTheme();
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMoodCard, setSelectedMoodCard] = useState('');

  const moodOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-400' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-400 to-blue-600' },
    { value: 'anxious', emoji: '😟', label: 'Anxious', color: 'from-red-400 to-pink-500' },
    { value: 'calm', emoji: '🧘‍♀️', label: 'Calm', color: 'from-green-400 to-emerald-500' },
    { value: 'angry', emoji: '😠', label: 'Angry', color: 'from-red-500 to-red-700' },
    { value: 'excited', emoji: '🎉', label: 'Excited', color: 'from-purple-400 to-pink-500' },
    { value: 'tired', emoji: '😴', label: 'Tired', color: 'from-gray-400 to-gray-600' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'from-gray-300 to-gray-500' }
  ];

  const fetchMoods = async () => {
    try {
      const res = await api.get('/api/moods');
      setMoods(res.data || []);
    } catch (err) {
      console.error('Failed to fetch moods');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) return;

    setLoading(true);
    try {
      await api.post('/api/moods', { mood, note });
      setMood('');
      setNote('');
      setSelectedMoodCard('');
      fetchMoods();
      // Success notification could be added here instead of alert
    } catch (err) {
      console.error('Failed to record mood:', err);
      // Error notification could be added here instead of alert
    }
    setLoading(false);
  };

  const handleMoodSelect = (moodValue) => {
    setMood(moodValue);
    setSelectedMoodCard(moodValue);
  };

  const getMoodEmoji = (moodValue) => {
    const moodOption = moodOptions.find(option => option.value === moodValue);
    return moodOption ? moodOption.emoji : '😐';
  };

  const getMoodColor = (moodValue) => {
    const moodOption = moodOptions.find(option => option.value === moodValue);
    return moodOption ? moodOption.color : 'from-gray-300 to-gray-500';
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${classes.transition}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl mb-4">
          🌤️
        </div>
        <h1 className={`text-3xl font-bold ${classes.textPrimary}`}>Mood Tracker</h1>
        <p className={`text-lg ${classes.textSecondary} max-w-2xl mx-auto`}>
          Track your daily emotions and identify patterns to better understand your mental wellbeing.
        </p>
      </div>

      {/* Mood Selection */}
      <div className={`${classes.card} p-8`}>
        <h2 className={`text-xl font-semibold ${classes.textPrimary} mb-6`}>How are you feeling today?</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleMoodSelect(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  selectedMoodCard === option.value
                    ? `border-blue-500 shadow-lg bg-gradient-to-r ${option.color} text-white`
                    : `${classes.borderPrimary} ${classes.hover} border-2`
                }`}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className={`font-medium ${
                  selectedMoodCard === option.value ? 'text-white' : classes.textPrimary
                }`}>
                  {option.label}
                </div>
              </button>
            ))}
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${classes.textSecondary}`}>
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling? What's on your mind?"
              rows={3}
              className={`w-full px-4 py-3 rounded-lg resize-none ${classes.input} ${classes.transition}`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!mood || loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold ${classes.transition} ${
              mood && !loading
                ? `${classes.button} hover:shadow-lg transform hover:scale-[1.02]`
                : `bg-gray-300 text-gray-500 cursor-not-allowed`
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Recording...</span>
              </div>
            ) : (
              'Record Mood'
            )}
          </button>
        </form>
      </div>

      {/* Mood History */}
      <div className={`${classes.card} p-8`}>
        <h2 className={`text-xl font-semibold ${classes.textPrimary} mb-6`}>Your Mood History</h2>
        
        {moods.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className={`text-lg ${classes.textMuted}`}>No moods recorded yet.</p>
            <p className={`${classes.textSecondary} mt-2`}>Start tracking your moods to see patterns over time!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {moods.slice(0, 10).map((m, index) => (
              <div
                key={m.id}
                className={`p-4 rounded-lg border ${classes.borderPrimary} ${classes.hover} ${classes.transition} hover:shadow-md`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getMoodColor(m.mood)} flex items-center justify-center text-xl`}>
                      {getMoodEmoji(m.mood)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-medium capitalize ${classes.textPrimary}`}>
                        {m.mood}
                      </h3>
                      <time className={`text-sm ${classes.textMuted}`}>
                        {new Date(m.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                    {m.note && (
                      <p className={`mt-2 ${classes.textSecondary} leading-relaxed`}>
                        {m.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {moods.length > 10 && (
              <div className="text-center pt-4">
                <button className={`px-4 py-2 text-sm font-medium ${classes.accentPrimary} ${classes.hover} rounded-lg ${classes.transition}`}>
                  View All ({moods.length} total)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}