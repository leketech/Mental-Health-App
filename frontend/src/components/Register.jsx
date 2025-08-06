import React, { useState } from 'react';
import api from '../utils/auth'; // assuming this is your configured axios instance
import { useNavigate } from 'react-router-dom'; // if using routing

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // for redirect after register

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
      // ✅ Define userData before making request
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      // ✅ Use the imported `api` (configured with baseURL, etc.)
      const res = await api.post('/api/register', userData);

      // ✅ Use the response — log, alert, or redirect
      console.log('Registration successful:', res.data.message || 'Account created');

      // ✅ Option 1: Show success and switch to login
      if (onRegister) {
        onRegister();
      }

      // ✅ Option 2: Redirect to login (recommended if using React Router)
      // navigate('/login');

      // ✅ Optional: Show a toast or success message instead of alert
      alert('Registration successful! Please log in.');
      
    } catch (err) {
      // Handle error response
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