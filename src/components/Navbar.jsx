import React, { useState } from 'react';
import { 
  PartyPopper, 
  Search, 
  PlusCircle, 
  Bell, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  CheckCircle, 
  Home, 
  Compass, 
  Calendar, 
  LogOut, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  onNavigate, 
  currentUser, 
  onSwitchUser, 
  notifications = [], 
  onMarkNotificationsRead,
  unreadCount = 0,
  onOpenAuth
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (view, param) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setNotifOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="navbar-root">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => handleNav('landing')}>
          <div className="logo-icon-wrap">
            <PartyPopper size={20} />
          </div>
          <span className="brand-name">
            Party<span className="brand-accent">Place</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="nav-links desktop-only">
          <button 
            className={`nav-link ${currentView === 'explore' ? 'active' : ''}`}
            onClick={() => handleNav('explore')}
          >
            Explore Spaces
          </button>
          <button 
            className={`nav-link ${currentView === 'list-space' ? 'active' : ''}`}
            onClick={() => handleNav('list-space')}
          >
            List Your Space
          </button>
          <button 
            className="nav-link"
            onClick={() => {
              if (currentView !== 'landing') {
                handleNav('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            How It Works
          </button>
          <button 
            className="nav-link"
            onClick={() => {
              if (currentView !== 'landing') {
                handleNav('landing');
                setTimeout(() => {
                  document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Why Us
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="nav-actions">
          {/* Quick Persona/Role Switcher Pill */}
          <div className="role-switcher-pill desktop-only" title="Switch persona to test Customer, Host, or Super Admin view">
            <span className="role-tag">Role:</span>
            <select 
              value={currentUser.role}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="role-select"
            >
              <option value="customer">👤 Customer (Akanksha)</option>
              <option value="host">🏡 Host (Rohan)</option>
              <option value="admin">⚡ Super Admin</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <div className="notif-wrapper">
            <button 
              className="btn-icon notif-btn" 
              onClick={() => {
                setNotifOpen(!notifOpen);
                if (!notifOpen && unreadCount > 0) {
                  onMarkNotificationsRead();
                }
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {/* Notifications Menu */}
            {notifOpen && (
              <div className="notif-menu-dropdown card">
                <div className="notif-header">
                  <h4>Notifications</h4>
                  {notifications.length > 0 && (
                    <button className="mark-read-btn" onClick={onMarkNotificationsRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                        <div className="notif-dot" />
                        <div className="notif-body">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-desc">{n.message}</div>
                          <div className="notif-time">{n.timestamp}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Dashboard Dropdown */}
          <div className="user-profile-wrapper">
            <button 
              className="user-pill-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="user-avatar"
              />
              <span className="user-name desktop-only">{currentUser.name.split(' ')[0]}</span>
              <ChevronDown size={14} className="desktop-only" />
            </button>

            {userDropdownOpen && (
              <div className="user-dropdown-menu card">
                <div className="dropdown-user-header">
                  <div className="dropdown-user-name">{currentUser.name}</div>
                  <div className="dropdown-user-role">{currentUser.role.toUpperCase()}</div>
                </div>
                <div className="dropdown-divider" />
                
                {currentUser.role === 'customer' && (
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleNav('customer-dashboard')}
                  >
                    <Calendar size={16} /> My Bookings
                  </button>
                )}

                {currentUser.role === 'host' && (
                  <>
                    <button 
                      className="dropdown-item" 
                      onClick={() => handleNav('host-dashboard')}
                    >
                      <Home size={16} /> Host Dashboard
                    </button>
                    <button 
                      className="dropdown-item" 
                      onClick={() => handleNav('list-space')}
                    >
                      <PlusCircle size={16} /> List New Space
                    </button>
                  </>
                )}

                {currentUser.role === 'admin' && (
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleNav('admin-dashboard')}
                  >
                    <ShieldCheck size={16} /> Super Admin Panel
                  </button>
                )}

                <div className="dropdown-divider" />
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenAuth();
                  }}
                >
                  <User size={16} /> Switch Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="btn-icon mobile-menu-toggle mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer card">
          <div className="mobile-role-selector">
            <span className="mobile-role-label">Switch Mode:</span>
            <div className="role-buttons-grid">
              <button 
                className={`role-chip ${currentUser.role === 'customer' ? 'active' : ''}`}
                onClick={() => { onSwitchUser('customer'); setMobileMenuOpen(false); }}
              >
                Customer
              </button>
              <button 
                className={`role-chip ${currentUser.role === 'host' ? 'active' : ''}`}
                onClick={() => { onSwitchUser('host'); setMobileMenuOpen(false); }}
              >
                Host
              </button>
              <button 
                className={`role-chip ${currentUser.role === 'admin' ? 'active' : ''}`}
                onClick={() => { onSwitchUser('admin'); setMobileMenuOpen(false); }}
              >
                Admin
              </button>
            </div>
          </div>

          <nav className="mobile-nav-list">
            <button className="mobile-nav-item" onClick={() => handleNav('landing')}>
              <Home size={18} /> Home
            </button>
            <button className="mobile-nav-item" onClick={() => handleNav('explore')}>
              <Compass size={18} /> Explore Spaces
            </button>
            <button className="mobile-nav-item" onClick={() => handleNav('list-space')}>
              <PlusCircle size={18} /> List Your Space
            </button>
            {currentUser.role === 'customer' && (
              <button className="mobile-nav-item" onClick={() => handleNav('customer-dashboard')}>
                <Calendar size={18} /> My Bookings
              </button>
            )}
            {currentUser.role === 'host' && (
              <button className="mobile-nav-item" onClick={() => handleNav('host-dashboard')}>
                <Home size={18} /> Host Dashboard
              </button>
            )}
            {currentUser.role === 'admin' && (
              <button className="mobile-nav-item" onClick={() => handleNav('admin-dashboard')}>
                <ShieldCheck size={18} /> Admin Panel
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
