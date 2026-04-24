import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', icon: '🏠' },
  '/profile': { title: 'My Profile', icon: '👤' },
  '/tickets': { title: 'Tickets', icon: '🎫' },
  '/tickets/new': { title: 'Request Help', icon: '➕' },
  '/resources': { title: 'Resources', icon: '📚' },
  '/resources/upload': { title: 'Upload Resource', icon: '⬆️' },
  '/admin/users': { title: 'Manage Users', icon: '👥' },
  '/admin/resources': { title: 'Approve Resources', icon: '✅' },
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const current = pageTitles[location.pathname] || { title: 'SkillNest', icon: '🌟' };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">

        {/* ── Top Navbar ── */}
        <header className="top-navbar">
          <div className="top-navbar-left">
            <span className="top-navbar-page-icon">{current.icon}</span>
            <span className="top-navbar-page-title">{current.title}</span>
          </div>

          <div className="top-navbar-center">
            <div className="top-navbar-quicklinks">
              <button className="topnav-link" onClick={() => navigate('/')}>🌐 Home</button>
              <button className="topnav-link" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
              <button className="topnav-link" onClick={() => navigate('/resources')}>📚 Resources</button>
              <button className="topnav-link" onClick={() => navigate('/tickets')}>🎫 Tickets</button>
              {(user?.role === 'admin') && (
                <button className="topnav-link" onClick={() => navigate('/admin/users')}>👥 Users</button>
              )}
            </div>
          </div>

          <div className="top-navbar-right">
            {/* Avatar dropdown */}
            <div className="topnav-avatar-wrap" onClick={() => setDropdownOpen(o => !o)}>
              <div className="topnav-avatar">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="topnav-user-info">
                <span className="topnav-user-name">{user?.name?.split(' ')[0]}</span>
                <span className="topnav-user-role">{user?.role}</span>
              </div>
              <span className="topnav-chevron">{dropdownOpen ? '▲' : '▼'}</span>
            </div>

            {dropdownOpen && (
              <div className="topnav-dropdown">
                <div className="topnav-dropdown-header">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>
                <button className="topnav-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                  👤 My Profile
                </button>
                <button className="topnav-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}>
                  🏠 Dashboard
                </button>
                <button className="topnav-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/'); }}>
                  🌐 Home Page
                </button>
                <div className="topnav-dropdown-divider" />
                <button className="topnav-dropdown-item topnav-dropdown-logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
