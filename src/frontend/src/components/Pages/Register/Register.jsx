import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',  // Changed from full_name
    last_name: '',   // Added
    phone_number: '' // Added
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Create the base data object
      const registerData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      };

      // 2. ONLY add phone_number if it has a value
      // This prevents sending "" or null which causes the 422 error
      if (formData.phone_number && formData.phone_number.trim() !== '') {
        registerData.phone_number = formData.phone_number.trim();
      }

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (!response.ok) {
        // If it's still a 422, let's see the exact field in the UI
        if (response.status === 422) {
          console.error("Validation Error Details:", data.detail);
          throw new Error("Registration data format is incorrect. Check console for details.");
        }
        throw new Error(data.detail || 'Registration failed');
      }

      alert('Registration successful! Please login.');
      navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">⚽</div>
          <h2>Create Account</h2>
          <p>Join Premier League Data Analyser</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {serverError && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {serverError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Choose a username"
              disabled={loading}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="your@email.com"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? 'error' : ''}
              placeholder="John"
              disabled={loading}
            />
            {errors.first_name && (
              <span className="error-message">{errors.first_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? 'error' : ''}
              placeholder="Doe"
              disabled={loading}
            />
            {errors.last_name && (
              <span className="error-message">{errors.last_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+1234567890"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Create a strong password"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            <small className="field-hint">
              Min 8 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Re-enter your password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="register-spinner"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <a 
              href="/login" 
              onClick={(e) => { 
                e.preventDefault(); 
                navigate('/login'); 
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;