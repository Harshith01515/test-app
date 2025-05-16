// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Utility to show a toast
  const displayToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(t => ({ ...t, show: false }));
    }, 3000);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Toast {...toast} />

        <Routes>
          <Route
            path="/login"
            element={<LoginPage displayToast={displayToast} />}
          />
          <Route
            path="/register"
            element={<RegisterPage displayToast={displayToast} />}
          />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}
