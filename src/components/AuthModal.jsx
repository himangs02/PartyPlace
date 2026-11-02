import React, { useState } from 'react';
import { X, PartyPopper, User, ShieldCheck, Home } from 'lucide-react';

export default function AuthModal({ onClose, onSelectUser, currentUser }) {
  const [tab, setTab] = useState('quick'); // 'quick' or 'custom'
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSelectUser({
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joined: 'Today',
      verified: true
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="brand-logo-small">
            <PartyPopper size={18} color="#D94D83" />
            <span style={{ fontWeight: 700, color: '#70152F' }}>PartyPlace Account</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body auth-body">
          <div className="auth-tabs-row">
            <button 
              className={`auth-tab-btn ${tab === 'quick' ? 'active' : ''}`}
              onClick={() => setTab('quick')}
            >
              Demo Personas
            </button>
            <button 
              className={`auth-tab-btn ${tab === 'custom' ? 'active' : ''}`}
              onClick={() => setTab('custom')}
            >
              Sign Up / Custom User
            </button>
          </div>

          {tab === 'quick' ? (
            <div className="quick-personas-list">
              <p className="auth-instructions">
                Select a pre-configured persona to test each specific platform role:
              </p>

              {/* Customer */}
              <div 
                className={`persona-card ${currentUser.role === 'customer' ? 'selected' : ''}`}
                onClick={() => {
                  onSelectUser({
                    id: 'user-1',
                    name: 'Akanksha Verma',
                    email: 'akanksha@example.com',
                    role: 'customer',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                    phone: '+91 98112 34567',
                    verified: true
                  });
                  onClose();
                }}
              >
                <div className="persona-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" alt="Akanksha" />
                </div>
                <div className="persona-info">
                  <div className="persona-name">Akanksha Verma <span className="badge badge-rose">Customer</span></div>
                  <div className="persona-desc">Explores spaces, books private venues, manages active reservations & reviews.</div>
                </div>
              </div>

              {/* Host */}
              <div 
                className={`persona-card ${currentUser.role === 'host' ? 'selected' : ''}`}
                onClick={() => {
                  onSelectUser({
                    id: 'user-2',
                    name: 'Rohan Mehta',
                    email: 'rohan@partyplace.in',
                    role: 'host',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    phone: '+91 98223 45678',
                    isSuperhost: true,
                    verified: true
                  });
                  onClose();
                }}
              >
                <div className="persona-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Rohan" />
                </div>
                <div className="persona-info">
                  <div className="persona-name">Rohan Mehta <span className="badge badge-burgundy">Superhost</span></div>
                  <div className="persona-desc">Owns The Palm Villa & Skyline Terrace. Manages listings, booking requests & payouts.</div>
                </div>
              </div>

              {/* Admin */}
              <div 
                className={`persona-card ${currentUser.role === 'admin' ? 'selected' : ''}`}
                onClick={() => {
                  onSelectUser({
                    id: 'user-3',
                    name: 'Admin',
                    email: 'admin@partyplace.com',
                    role: 'admin',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    verified: true
                  });
                  onClose();
                }}
              >
                <div className="persona-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="Admin" />
                </div>
                <div className="persona-info">
                  <div className="persona-name">Super Admin <span className="badge badge-verified">Platform Master</span></div>
                  <div className="persona-desc">Approves new space listings, oversees bookings, audits revenue & configures 10% commission.</div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="custom-login-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="vikram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Account Type</label>
                <div className="role-radio-group">
                  <label className={`role-radio-card ${role === 'customer' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="customer" 
                      checked={role === 'customer'} 
                      onChange={() => setRole('customer')} 
                    />
                    <User size={18} />
                    <span>Customer (Event Seeker)</span>
                  </label>

                  <label className={`role-radio-card ${role === 'host' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="host" 
                      checked={role === 'host'} 
                      onChange={() => setRole('host')} 
                    />
                    <Home size={18} />
                    <span>Property Host (List Spaces)</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Continue as {name || 'User'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
