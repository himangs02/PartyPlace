import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import FAQModal from './components/FAQModal';
import AuthModal from './components/AuthModal';

import LandingView from './views/LandingView';
import ExploreView from './views/ExploreView';
import SpaceDetailsView from './views/SpaceDetailsView';
import CheckoutView from './views/CheckoutView';
import CustomerDashboardView from './views/CustomerDashboardView';
import HostDashboardView from './views/HostDashboardView';
import ListSpaceView from './views/ListSpaceView';
import AdminDashboardView from './views/AdminDashboardView';

import { api } from './services/api';
import './App.css';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('landing');
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [exploreFilters, setExploreFilters] = useState({});
  const [activeBookingDetails, setActiveBookingDetails] = useState(null);

  // Modals
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Current User / Persona
  const [currentUser, setCurrentUser] = useState(() => {
    return {
      id: 'user-1',
      name: 'Akanksha Verma',
      email: 'akanksha@example.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98112 34567',
      verified: true
    };
  });

  // App Data
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({ commissionRate: 10 });
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('partyplace_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['space-1', 'space-2']);
    } catch {
      return new Set(['space-1', 'space-2']);
    }
  });

  // Load Initial Data
  const refreshData = async () => {
    try {
      const [loadedSpaces, loadedBookings, loadedNotifs, loadedSettings] = await Promise.all([
        api.getSpaces(),
        api.getBookings(),
        api.getNotifications(currentUser.id),
        api.getSettings()
      ]);
      if (loadedSpaces) setSpaces(loadedSpaces);
      if (loadedBookings) setBookings(loadedBookings);
      if (loadedNotifs) setNotifications(loadedNotifs);
      if (loadedSettings) setSettings(loadedSettings);
    } catch (err) {
      console.warn('Data fetch error, continuing with fallback:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Wishlist persistence
  const handleToggleWishlist = (spaceId) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(spaceId)) {
        next.delete(spaceId);
      } else {
        next.add(spaceId);
      }
      try {
        localStorage.setItem('partyplace_wishlist', JSON.stringify([...next]));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Switch Persona / Role
  const handleSwitchUser = (role) => {
    if (role === 'host') {
      setCurrentUser({
        id: 'user-2',
        name: 'Rohan Mehta',
        email: 'rohan@partyplace.in',
        role: 'host',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98223 45678',
        isSuperhost: true,
        verified: true
      });
      setCurrentView('host-dashboard');
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'user-3',
        name: 'Admin',
        email: 'admin@partyplace.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        verified: true
      });
      setCurrentView('admin-dashboard');
    } else {
      setCurrentUser({
        id: 'user-1',
        name: 'Akanksha Verma',
        email: 'akanksha@example.com',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98112 34567',
        verified: true
      });
      setCurrentView('landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation Helper
  const handleNavigate = (view, params = {}) => {
    if (params) {
      setExploreFilters(params);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Space Details Selection
  const handleSelectSpace = (spaceId) => {
    setSelectedSpaceId(spaceId);
    setCurrentView('space-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Booking -> Checkout
  const handleStartBooking = (bookingPayload) => {
    setActiveBookingDetails(bookingPayload);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm Booking
  const handleConfirmBooking = async (bookingData) => {
    const created = await api.createBooking(bookingData);
    await refreshData();
    return created;
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    await api.updateBookingStatus(bookingId, 'cancelled');
    await refreshData();
  };

  // Update Booking Status (Host accept / complete)
  const handleUpdateBookingStatus = async (bookingId, status) => {
    await api.updateBookingStatus(bookingId, status);
    await refreshData();
  };

  // Space Management (Host / Admin)
  const handleApproveSpace = async (spaceId) => {
    await api.updateSpace(spaceId, { verified: true, status: 'active' });
    await refreshData();
  };

  const handleRejectSpace = async (spaceId) => {
    await api.updateSpace(spaceId, { verified: false, status: 'paused' });
    await refreshData();
  };

  const handleToggleFeatureSpace = async (spaceId, isFeatured) => {
    await api.updateSpace(spaceId, { isFeatured });
    await refreshData();
  };

  const handleToggleSpaceStatus = async (spaceId, status) => {
    await api.updateSpace(spaceId, { status });
    await refreshData();
  };

  const handleDeleteSpace = async (spaceId) => {
    if (window.confirm('Are you sure you want to delete this space listing?')) {
      await api.deleteSpace(spaceId);
      await refreshData();
    }
  };

  // Complete List Space Wizard
  const handleCompleteListing = async (newSpaceData) => {
    await api.createSpace(newSpaceData);
    await refreshData();
  };

  // Add Review
  const handleAddReview = async (reviewData) => {
    await api.createReview(reviewData);
    await refreshData();
  };

  // Update Platform Settings
  const handleUpdateSettings = async (newSettings) => {
    await api.updateSettings(newSettings);
    await refreshData();
  };

  // Mark all notifications read
  const handleMarkNotificationsRead = async () => {
    await api.markNotificationsRead(currentUser.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const currentSpace = spaces.find(s => s.id === selectedSpaceId) || spaces[0];

  return (
    <div className="partyplace-app">
      {/* Top Navbar */}
      <Navbar 
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="main-content-wrapper">
        {currentView === 'landing' && (
          <LandingView 
            spaces={spaces}
            onSelectSpace={handleSelectSpace}
            onNavigate={handleNavigate}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView 
            spaces={spaces}
            onSelectSpace={handleSelectSpace}
            initialFilters={exploreFilters}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentView === 'space-detail' && currentSpace && (
          <SpaceDetailsView 
            space={currentSpace}
            onBack={() => handleNavigate('explore')}
            onStartBooking={handleStartBooking}
            currentUser={currentUser}
            isWishlisted={wishlist.has(currentSpace.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddReview={handleAddReview}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView 
            bookingDetails={activeBookingDetails}
            onBack={(dest) => handleNavigate(dest || 'space-detail')}
            onConfirmBooking={handleConfirmBooking}
            currentUser={currentUser}
          />
        )}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboardView 
            currentUser={currentUser}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            spaces={spaces}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectSpace={handleSelectSpace}
          />
        )}

        {currentView === 'host-dashboard' && (
          <HostDashboardView 
            currentUser={currentUser}
            spaces={spaces}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onToggleSpaceStatus={handleToggleSpaceStatus}
            onDeleteSpace={handleDeleteSpace}
            onNavigate={handleNavigate}
            onSelectSpace={handleSelectSpace}
          />
        )}

        {currentView === 'list-space' && (
          <ListSpaceView 
            currentUser={currentUser}
            onBack={() => handleNavigate(currentUser.role === 'host' ? 'host-dashboard' : 'landing')}
            onCompleteListing={handleCompleteListing}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView 
            spaces={spaces}
            bookings={bookings}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onApproveSpace={handleApproveSpace}
            onRejectSpace={handleRejectSpace}
            onToggleFeatureSpace={handleToggleFeatureSpace}
            onSelectSpace={handleSelectSpace}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenFAQ={() => setFaqModalOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar (matching screenshot) */}
      <MobileBottomNav 
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />

      {/* Global Modals */}
      {faqModalOpen && (
        <FAQModal onClose={() => setFaqModalOpen(false)} />
      )}

      {authModalOpen && (
        <AuthModal 
          currentUser={currentUser}
          onClose={() => setAuthModalOpen(false)}
          onSelectUser={(u) => {
            setCurrentUser(u);
            if (u.role === 'host') setCurrentView('host-dashboard');
            else if (u.role === 'admin') setCurrentView('admin-dashboard');
            else setCurrentView('customer-dashboard');
          }}
        />
      )}
    </div>
  );
}
