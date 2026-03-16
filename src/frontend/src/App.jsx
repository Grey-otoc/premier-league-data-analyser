import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthProvider';
import AppRoutes from "./components/AppRoutes";
import './App.css';


// Components
import SearchBar from './components/SearchBar';
import Banners from './components/Banners';
import AdBanner from './components/AdBanner';
import Register from './components/Register';
import LogoutButton from './components/LogoutButton';
import {Login} from './components/Pages/Login/';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">⚽ Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">⚽ Loading...</div>;
  return !user ? children : <Navigate to="/" replace />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="firefox-container">
      {user && (
        <div className="top-nav" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f0f0f0' }}>
          <p>Welcome, <strong>{user.username}</strong>!</p>
          <LogoutButton />
        </div>
      )}

      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/" element={
          <ProtectedRoute>
            <SearchBar />
            <Banners />
            <AdBanner />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    /*<BrowserRouter>
       <AuthProvider>
         <AppContent />
       </AuthProvider>
     </BrowserRouter>*/
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
