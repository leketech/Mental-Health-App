import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const token = localStorage.getItem('token');

  const fetchMoods = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/moods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMoods(res.data);
    } catch (err) {
      console.error('Failed to fetch moods');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('POST /moods not yet implemented in Go backend');
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🌤️ Mood Tracker</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <select value={mood} onChange={(e) => setMood(e.target.value)} required style={{ padding: 8 }}>
          <option value="">Select Mood</option>
          <option value="happy">Happy 😊</option>
          <option value="sad">Sad 😢</option>
          <option value="anxious">Anxious 😟</option>
          <option value="calm">Calm 🧘‍♀️</option>
        </select>
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ margin: '10px 0', padding: 8, width: '100%' }}
        />
        <button type="submit">Record Mood</button>
      </form>

      <h3>Your Moods</h3>
      {moods.length === 0 ? (
        <p>No moods recorded yet.</p>
      ) : (
        <ul>
          {moods.map(m => (
            <li key={m.id}>
              <strong>{m.mood}</strong>: {m.note} ({new Date(m.created_at).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}