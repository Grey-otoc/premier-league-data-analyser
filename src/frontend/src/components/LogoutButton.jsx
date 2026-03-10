import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LogoutButton.css';

// VITE version - use import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const LogoutButton = ({ variant = 'button' }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data.message);
          }
        } catch (apiError) {
          console.error('Logout API error:', apiError);
        }
      }

      clearUserData();

    } catch (error) {
      console.error('Logout error:', error);
      clearUserData();
    } finally {
      setLoading(false);
    }
  };

  const clearUserData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    logout();
    navigate('/login');
  };

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    handleLogout();
  };

  if (variant === 'dropdown') {
    return (
      <>
        <button
          className="logout-dropdown-item"
          onClick={() => setShowConfirm(true)}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-small"></span>
              Logging out...
            </>
          ) : (
            <>
              <span className="logout-icon">🚪</span>
              Logout
            </>
          )}
        </button>

        {showConfirm && (
          <div className="logout-modal-overlay" onClick={() => setShowConfirm(false)}>
            <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to log out?</p>
              <div className="logout-modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm-logout"
                  onClick={handleConfirmLogout}
                  disabled={loading}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        className="logout-button"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-small"></span>
            Logging out...
          </>
        ) : (
          <>
            <span className="logout-icon">🚪</span>
            Logout
          </>
        )}
      </button>

      {showConfirm && (
        <div className="logout-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-logout"
                onClick={handleConfirmLogout}
                disabled={loading}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;