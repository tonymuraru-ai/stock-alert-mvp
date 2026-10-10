import React, { useState } from 'react';
import '../styles/Sidebar.css';

function Sidebar({ user, onLogout, onPageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (pageId) => {
    onPageChange(pageId);
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'account', label: '👤 Gestionează Contul' },
    { id: 'stock', label: '📦 Stocuri' },
    { id: 'reports', label: '📊 Rapoarte' },
    { id: 'locations', label: '📍 Locații' },
    { id: 'settings', label: '⚙️ Setări' },
    { id: 'notifications', label: '🔔 Notificări' },
    { id: 'integrations', label: '📱 Integrări' },
    { id: 'help', label: '📖 Ajutor' },
  ];

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <p className="profile-name">{user?.fullName || 'Utilizator'}</p>
            <p className="profile-email">{user?.email || 'email@example.com'}</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="menu-item"
              onClick={() => handleMenuClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;