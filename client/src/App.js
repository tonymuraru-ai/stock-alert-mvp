import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Citește token și user din localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleSignupSuccess = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // Dacă autentificat, arată Dashboard
  if (isAuthenticated && currentPage === 'dashboard') {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Dacă nu e autentificat, arată Login/Signup
  return (
    <div className="app">
      {currentPage === 'login' ? (
        <Login 
          onSwitchToSignup={() => setCurrentPage('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Signup 
          onSwitchToLogin={() => setCurrentPage('login')}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
}

export default App;