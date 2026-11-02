import React from 'react';
import { Home, Compass, Calendar, User, ShieldCheck } from 'lucide-react';

export default function MobileBottomNav({ currentView, onNavigate, currentUser }) {
  const getProfileDestination = () => {
    if (currentUser.role === 'admin') return 'admin-dashboard';
    if (currentUser.role === 'host') return 'host-dashboard';
    return 'customer-dashboard';
  };

  const isProfileActive = 
    currentView === 'customer-dashboard' || 
    currentView === 'host-dashboard' || 
    currentView === 'admin-dashboard';

  return (
    <div className="mobile-bottom-nav mobile-only">
      <button 
        className={`bottom-nav-item ${currentView === 'landing' ? 'active' : ''}`}
        onClick={() => onNavigate('landing')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button 
        className={`bottom-nav-item ${currentView === 'explore' ? 'active' : ''}`}
        onClick={() => onNavigate('explore')}
      >
        <Compass size={20} />
        <span>Explore</span>
      </button>

      <button 
        className={`bottom-nav-item ${currentView === 'customer-dashboard' ? 'active' : ''}`}
        onClick={() => onNavigate('customer-dashboard')}
      >
        <Calendar size={20} />
        <span>Bookings</span>
      </button>

      <button 
        className={`bottom-nav-item ${isProfileActive ? 'active' : ''}`}
        onClick={() => onNavigate(getProfileDestination())}
      >
        {currentUser.role === 'admin' ? (
          <ShieldCheck size={20} />
        ) : (
          <User size={20} />
        )}
        <span>
          {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'host' ? 'Host' : 'Profile'}
        </span>
      </button>
    </div>
  );
}
