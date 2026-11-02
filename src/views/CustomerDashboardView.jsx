import React, { useState } from 'react';
import { 
  Calendar, 
  Heart, 
  Star, 
  User, 
  Settings, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  FileText, 
  AlertCircle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';
import PropertyCard from '../components/PropertyCard';

export default function CustomerDashboardView({ 
  currentUser, 
  bookings = [], 
  onCancelBooking, 
  spaces = [], 
  wishlist = new Set(), 
  onToggleWishlist, 
  onSelectSpace 
}) {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'wishlist', 'reviews', 'profile', 'settings'
  const [bookingFilter, setBookingFilter] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);
  
  // Cancel confirmation modal
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change in event plans');

  // Filter bookings for current user
  const userBookings = bookings.filter(b => b.userId === currentUser.id || b.userId === 'user-1');

  const upcomingBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = userBookings.filter(b => b.status === 'completed');
  const cancelledBookings = userBookings.filter(b => b.status === 'cancelled');

  const displayBookings = 
    bookingFilter === 'upcoming' ? upcomingBookings :
    bookingFilter === 'completed' ? completedBookings : cancelledBookings;

  const wishlistedSpaces = spaces.filter(s => wishlist.has(s.id));

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    onCancelBooking(cancelModalBooking.id);
    setCancelModalBooking(null);
  };

  return (
    <div className="dashboard-page-root">
      {/* Receipt Modal */}
      {selectedReceiptBooking && (
        <ReceiptModal 
          booking={selectedReceiptBooking} 
          onClose={() => setSelectedReceiptBooking(null)} 
        />
      )}

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <div className="modal-overlay" onClick={() => setCancelModalBooking(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ color: '#DC2626' }}>Cancel Reservation</h4>
              <button className="btn-icon" onClick={() => setCancelModalBooking(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your booking for <strong>{cancelModalBooking.spaceName}</strong> on {cancelModalBooking.formattedDate}?</p>
              
              <div className="refund-summary-box card" style={{ background: '#FFF0E8', border: '1px solid #fde2d5', padding: 16, margin: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Total Paid:</span>
                  <strong>₹{cancelModalBooking.totalAmount?.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#059669' }}>
                  <span>Cancellation Fee (24h Window):</span>
                  <strong>₹0 (Free Cancellation)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0cfc5', paddingTop: 6, fontWeight: 700 }}>
                  <span>Refund Amount:</span>
                  <span style={{ color: '#059669' }}>₹{cancelModalBooking.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for cancellation</label>
                <select 
                  className="form-control"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="Change in event plans">Change in event plans</option>
                  <option value="Guest count changed">Guest count changed</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Found alternative date">Found alternative date</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCancelModalBooking(null)}>Keep Booking</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#DC2626' }} onClick={handleConfirmCancel}>Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="dashboard-grid-layout">
          {/* Left Sidebar */}
          <aside className="dashboard-sidebar card">
            <div className="dashboard-user-brief">
              <img src={currentUser.avatar} alt={currentUser.name} className="sidebar-avatar" />
              <h4 className="sidebar-name">{currentUser.name}</h4>
              <span className="badge badge-rose">Verified Guest</span>
            </div>

            <nav className="dashboard-nav-menu">
              <button 
                className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar size={18} />
                <span>My Bookings</span>
                {upcomingBookings.length > 0 && (
                  <span className="nav-count-badge">{upcomingBookings.length}</span>
                )}
              </button>

              <button 
                className={`dashboard-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={18} />
                <span>Wishlist</span>
                {wishlistedSpaces.length > 0 && (
                  <span className="nav-count-badge">{wishlistedSpaces.length}</span>
                )}
              </button>

              <button 
                className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>Profile & ID</span>
              </button>

              <button 
                className={`dashboard-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </nav>
          </aside>

          {/* Right Content Area */}
          <main className="dashboard-content-main">
            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div>
                <div className="dashboard-main-header">
                  <div>
                    <h2 className="dashboard-title">My Bookings</h2>
                    <p className="dashboard-sub">View and manage your private event space reservations.</p>
                  </div>
                </div>

                {/* Sub-tabs: Upcoming, Completed, Cancelled */}
                <div className="booking-subtabs-row">
                  <button 
                    className={`subtab-btn ${bookingFilter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setBookingFilter('upcoming')}
                  >
                    Upcoming ({upcomingBookings.length})
                  </button>
                  <button 
                    className={`subtab-btn ${bookingFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setBookingFilter('completed')}
                  >
                    Completed ({completedBookings.length})
                  </button>
                  <button 
                    className={`subtab-btn ${bookingFilter === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setBookingFilter('cancelled')}
                  >
                    Cancelled ({cancelledBookings.length})
                  </button>
                </div>

                {/* Bookings List */}
                <div className="dashboard-bookings-list">
                  {displayBookings.length > 0 ? (
                    displayBookings.map(booking => (
                      <div key={booking.id} className="booking-item-card card">
                        <img 
                          src={booking.spaceImage || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop&q=80'} 
                          alt={booking.spaceName} 
                          className="booking-item-thumb"
                        />

                        <div className="booking-item-details">
                          <div className="booking-item-top">
                            <div>
                              <h4 className="booking-venue-name">{booking.spaceName}</h4>
                              <div className="booking-venue-location">
                                <MapPin size={13} color="#70152F" />
                                <span>{booking.location}</span>
                              </div>
                            </div>
                            <span className={`badge ${
                              booking.status === 'confirmed' ? 'badge-verified' : 
                              booking.status === 'completed' ? 'badge-burgundy' : 'badge-danger'
                            }`}>
                              {booking.status === 'confirmed' ? <CheckCircle size={12} /> : null}
                              {booking.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="booking-item-meta-grid">
                            <div className="meta-point">
                              <Calendar size={14} color="#70152F" />
                              <span>{booking.formattedDate || booking.date}</span>
                            </div>
                            <div className="meta-point">
                              <Clock size={14} color="#70152F" />
                              <span>{booking.slot}</span>
                            </div>
                            <div className="meta-point">
                              <Users size={14} color="#70152F" />
                              <span>{booking.guests} Guests ({booking.occasion})</span>
                            </div>
                            <div className="meta-point price">
                              <strong>₹{booking.totalAmount?.toLocaleString('en-IN')} Paid</strong>
                            </div>
                          </div>

                          <div className="booking-item-actions-row">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => setSelectedReceiptBooking(booking)}
                            >
                              <FileText size={14} /> View Details & QR Pass
                            </button>

                            {booking.status === 'confirmed' && (
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => setCancelModalBooking(booking)}
                              >
                                Modify / Cancel
                              </button>
                            )}

                            {booking.status === 'completed' && (
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => onSelectSpace(booking.spaceId)}
                              >
                                Book Again
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-card card">
                      <Calendar size={40} color="#70152F" style={{ margin: '0 auto 12px' }} />
                      <h4>No {bookingFilter} bookings found</h4>
                      <p className="text-muted">Explore verified villas and terraces for your next party!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="dashboard-main-header">
                  <div>
                    <h2 className="dashboard-title">My Wishlist</h2>
                    <p className="dashboard-sub">Saved spaces for future celebrations.</p>
                  </div>
                </div>

                {wishlistedSpaces.length > 0 ? (
                  <div className="properties-grid">
                    {wishlistedSpaces.map(space => (
                      <PropertyCard 
                        key={space.id} 
                        space={space} 
                        onSelectSpace={onSelectSpace}
                        isWishlisted={true}
                        onToggleWishlist={onToggleWishlist}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-card card">
                    <Heart size={40} color="#D94D83" style={{ margin: '0 auto 12px' }} />
                    <h4>Your wishlist is empty</h4>
                    <p className="text-muted">Tap the heart icon on any space card to save it for later.</p>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE & ID VERIFICATION TAB */}
            {activeTab === 'profile' && (
              <div>
                <div className="dashboard-main-header">
                  <div>
                    <h2 className="dashboard-title">Profile & Verification</h2>
                    <p className="dashboard-sub">Manage personal details and verified guest identity badge.</p>
                  </div>
                </div>

                <div className="profile-details-grid">
                  <div className="card p-6">
                    <h4 className="section-card-title">Personal Information</h4>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" defaultValue={currentUser.name} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" defaultValue={currentUser.email} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-control" defaultValue={currentUser.phone || '+91 98112 34567'} />
                    </div>
                    <button className="btn btn-primary">Save Profile Changes</button>
                  </div>

                  <div className="card p-6">
                    <h4 className="section-card-title">Trust & Identity Verification</h4>
                    <div className="id-verification-box">
                      <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck size={36} color="#059669" />
                        <div>
                          <strong>Government Photo ID Verified</strong>
                          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Aadhaar / Driving License verified via Digilocker.</p>
                        </div>
                      </div>
                      <div className="badge badge-verified">Verified Level 2</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="card p-6">
                <h3 className="section-card-title">Account Preferences & Notifications</h3>
                <div className="form-group mb-4">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Receive instant SMS alerts when host approves booking</span>
                  </label>
                </div>
                <div className="form-group mb-4">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Email booking confirmation pass and tax invoice</span>
                  </label>
                </div>
                <div className="form-group mb-4">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Special birthday discount & promotional reminders</span>
                  </label>
                </div>
                <button className="btn btn-primary">Update Preferences</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
