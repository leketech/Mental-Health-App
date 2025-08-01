import React, { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const send = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/chat', { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReply(res.data.reply);
    } catch (err) {
      setReply("Sorry, AI service failed.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 AI Mental Health Assistant</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How are you feeling today?"
        rows="4"
        style={{ width: '100%', padding: 8 }}
      />
      <button onClick={send} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
      {reply && <div style={{ marginTop: 20 }}><strong>AI:</strong> {reply}</div>}
    </div>
  );
}