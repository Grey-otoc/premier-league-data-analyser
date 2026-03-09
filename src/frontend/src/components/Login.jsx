import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',  // Changed from username_or_email
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login to:', `${API_URL}/api/auth/login`);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store token
      localStorage.setItem('access_token', data.access_token);
      
      // Create user object from username
      const userData = { username: formData.username };
      localStorage.setItem('user', JSON.stringify(userData));

      // Update context
      login(userData);

      console.log('Login successful');

      // Redirect to homepage
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      setServerError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }; */
    const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;

    setLoading(true);
    console.log("Button spinning... starting request.");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // 1. Save data
      localStorage.setItem('access_token', data.access_token);
      const userData = { username: formData.username };
      localStorage.setItem('user', JSON.stringify(userData));

      // 2. Update Context (CRITICAL: ensure login is a function)
      if (typeof login === 'function') {
        login(userData);
        console.log('Context updated');
      } else {
        console.error('AuthContext login function not found!');
      }

      // 3. Redirect
      console.log('Navigating to home...');
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Final catch error:', error);
      setServerError(error.message);
    } finally {
      // THIS STOPS THE SPINNER
      setLoading(false);
      console.log("Button stopped spinning.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">⚽</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Premier League Data Analyser account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {serverError && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {serverError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your username"
              disabled={loading}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;