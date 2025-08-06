import React, { useState } from 'react';
import api from '../utils/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const res = await api.post('/api/register', userData);
      console.log('Registration successful:', res.data.message);

      // ✅ Use navigate to go to login after success
      navigate('/login');

      // ✅ Optional: call onRegister if it's used for UI switching
      if (onRegister) {
        onRegister();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red', marginBottom: 15 }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ margin: '10px 0', padding: 8, width: '100%' }}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ margin: '10px 0', padding: 8, width: '100%' }}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ margin: '10px 0', padding: 8, width: '100%' }}
        />
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ margin: '10px 0', padding: 8, width: '100%' }}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: 10, 
            width: '100%', 
            backgroundColor: '#4a6fa5', 
            color: 'white', 
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}