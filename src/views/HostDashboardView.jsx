import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  IndianRupee, 
  Star, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Eye, 
  Edit, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  Building, 
  ShieldCheck, 
  TrendingUp,
  MessageSquare,
  Send
} from 'lucide-react';

export default function HostDashboardView({ 
  currentUser, 
  spaces = [], 
  bookings = [], 
  onUpdateBookingStatus, 
  onToggleSpaceStatus, 
  onDeleteSpace, 
  onNavigate, 
  onSelectSpace 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'listings', 'bookings', 'earnings', 'reviews'
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [replyText, setReplyText] = useState({});

  // Host spaces (Rohan Mehta owns space-1, space-2, space-5, etc.)
  const hostSpaces = spaces.filter(s => s.hostId === currentUser.id || s.hostId === 'user-2');
  
  // Host bookings
  const hostBookings = bookings.filter(b => b.hostId === currentUser.id || b.hostId === 'user-2' || hostSpaces.some(s => s.id === b.spaceId));

  const totalEarnings = hostBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.hostEarning || (b.basePrice - (b.platformFee || 0))), 0);

  const activeSpacesCount = hostSpaces.filter(s => s.status === 'active').length;

  const handlePayoutRequest = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3000);
  };

  const monthlyChartData = [
    { month: 'Apr', amount: 12000, height: '40%' },
    { month: 'May', amount: 18500, height: '55%' },
    { month: 'Jun', amount: 24000, height: '70%' },
    { month: 'Jul', amount: 21000, height: '62%' },
    { month: 'Aug', amount: 28000, height: '80%' },
    { month: 'Sep', amount: 36500, height: '95%' }
  ];

  return (
    <div className="dashboard-page-root">
      <div className="container">
        {/* Top Header */}
        <div className="host-header-row">
          <div>
            <h1 className="host-greeting">Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
            <p className="host-sub">Here's what's happening across your private venues today.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('list-space')}
          >
            <PlusCircle size={18} /> List New Space
          </button>
        </div>

        {/* Host Tabs Navigation */}
        <div className="host-nav-tabs-bar">
          <button 
            className={`host-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Dashboard Overview
          </button>
          <button 
            className={`host-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings ({hostSpaces.length})
          </button>
          <button 
            className={`host-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Booking Requests ({hostBookings.length})
          </button>
          <button 
            className={`host-nav-tab ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings & Payouts
          </button>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* 4 Stat KPI Cards matching Screenshot */}
            <div className="stats-kpi-grid">
              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#FFF0E8', color: '#70152F' }}>
                  <Home size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">{activeSpacesCount}</div>
                  <div className="kpi-label">Active Listings</div>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#FDF2F7', color: '#D94D83' }}>
                  <Calendar size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">{hostBookings.length || 12}</div>
                  <div className="kpi-label">Total Bookings</div>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#E6F7ED', color: '#047857' }}>
                  <IndianRupee size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">₹{totalEarnings ? totalEarnings.toLocaleString('en-IN') : '36,500'}</div>
                  <div className="kpi-label">Total Host Earnings</div>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#B45309' }}>
                  <Star size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">4.8</div>
                  <div className="kpi-label">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Split Grid: Booking Overview Bar Chart + Recent Bookings */}
            <div className="host-overview-grid">
              {/* Interactive Bar Chart */}
              <div className="overview-chart-card card">
                <div className="card-header-between">
                  <div>
                    <h3 className="section-card-title">Booking Overview</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Monthly earnings (after 10% platform fee)</p>
                  </div>
                  <span className="badge badge-verified">
                    <TrendingUp size={12} /> +28% vs last quarter
                  </span>
                </div>

                <div className="bar-chart-container">
                  <div className="bar-chart-y-axis">
                    <span>₹40k</span>
                    <span>₹30k</span>
                    <span>₹20k</span>
                    <span>₹10k</span>
                    <span>₹0</span>
                  </div>
                  <div className="bar-chart-columns">
                    {monthlyChartData.map((d, i) => (
                      <div key={i} className="chart-column-item">
                        <div className="bar-track">
                          <div 
                            className="bar-fill" 
                            style={{ height: d.height }}
                            title={`${d.month}: ₹${d.amount.toLocaleString('en-IN')}`}
                          >
                            <span className="bar-tooltip">₹{d.amount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <span className="bar-month-label">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Bookings List matching Screenshot */}
              <div className="recent-bookings-card card">
                <div className="card-header-between">
                  <h3 className="section-card-title">Recent Bookings</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('bookings')}>
                    View All
                  </button>
                </div>

                <div className="recent-bookings-list">
                  {hostBookings.slice(0, 4).map(booking => (
                    <div key={booking.id} className="recent-booking-item">
                      <div className="recent-booking-left">
                        <div className="recent-venue-name">{booking.spaceName}</div>
                        <div className="recent-booking-meta">
                          <span>{booking.formattedDate || booking.date}</span>
                          <span>•</span>
                          <span>{booking.slot}</span>
                        </div>
                      </div>

                      <div className="recent-booking-right">
                        <div className="recent-booking-payout">
                          ₹{(booking.hostEarning || booking.basePrice).toLocaleString('en-IN')}
                        </div>
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'badge-verified' : 
                          booking.status === 'pending' ? 'badge-pending' : 'badge-burgundy'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>

                        {booking.status === 'pending' && (
                          <div className="host-quick-actions">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                              title="Approve booking"
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                              title="Decline"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="host-listings-tab">
            <div className="card-header-between mb-4">
              <div>
                <h3 className="section-card-title">Your Property Listings</h3>
                <p className="text-muted">Manage availability, edit details, or pause listings temporarily.</p>
              </div>
              <button className="btn btn-primary" onClick={() => onNavigate('list-space')}>
                <PlusCircle size={16} /> Add New Space
              </button>
            </div>

            <div className="host-listings-grid">
              {hostSpaces.map(space => (
                <div key={space.id} className="host-space-manage-card card">
                  <div className="manage-card-img-wrap">
                    <img src={space.images?.[0]} alt={space.name} className="manage-card-img" />
                    <span className={`badge ${space.status === 'active' ? 'badge-verified' : 'badge-pending'}`}>
                      {space.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="manage-card-body">
                    <h4 className="manage-title">{space.name}</h4>
                    <p className="manage-loc">{space.area}, {space.city} • Up to {space.capacity} Guests</p>
                    
                    <div className="manage-price-row">
                      <span className="price-tag">
                        <strong>₹{space.price.toLocaleString('en-IN')}</strong> / {space.durationHours || 4} hrs
                      </span>
                      <span className="rating-pill">
                        <Star size={13} fill="#F59E0B" color="#F59E0B" /> {space.rating} ({space.reviewCount || 0})
                      </span>
                    </div>

                    <div className="manage-actions-row">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onSelectSpace(space.id)}
                      >
                        <Eye size={14} /> View Page
                      </button>

                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onToggleSpaceStatus(space.id, space.status === 'active' ? 'paused' : 'active')}
                      >
                        {space.status === 'active' ? (
                          <><PauseCircle size={14} /> Pause</>
                        ) : (
                          <><PlayCircle size={14} /> Activate</>
                        )}
                      </button>

                      <button 
                        className="btn btn-sm btn-ghost" 
                        style={{ color: '#DC2626' }}
                        onClick={() => onDeleteSpace(space.id)}
                        title="Delete space"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="host-bookings-tab card p-6">
            <h3 className="section-card-title mb-4">Complete Reservations Log</h3>
            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Space</th>
                    <th>Guest</th>
                    <th>Event Date & Slot</th>
                    <th>Attendees</th>
                    <th>Host Payout</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hostBookings.map(b => (
                    <tr key={b.id}>
                      <td className="mono-text">{b.id}</td>
                      <td><strong>{b.spaceName}</strong></td>
                      <td>
                        {b.userName}
                        <br />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{b.userPhone}</span>
                      </td>
                      <td>
                        {b.formattedDate || b.date}
                        <br />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{b.slot}</span>
                      </td>
                      <td>{b.guests} ({b.occasion})</td>
                      <td>
                        <strong style={{ color: '#047857' }}>
                          ₹{(b.hostEarning || b.basePrice).toLocaleString('en-IN')}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${
                          b.status === 'confirmed' ? 'badge-verified' : 
                          b.status === 'completed' ? 'badge-burgundy' : 
                          b.status === 'pending' ? 'badge-pending' : 'badge-danger'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {b.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                            >
                              Accept
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                            >
                              Decline
                            </button>
                          </div>
                        ) : b.status === 'confirmed' ? (
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EARNINGS & PAYOUTS */}
        {activeTab === 'earnings' && (
          <div className="host-earnings-tab">
            <div className="earnings-hero-card card p-6 mb-6">
              <div className="earnings-hero-row">
                <div>
                  <span className="text-muted">Available for Withdrawal</span>
                  <h2 className="earnings-big-number">₹{totalEarnings ? totalEarnings.toLocaleString('en-IN') : '36,500'}</h2>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Calculated after PartyPlace 10% technology platform commission.
                  </p>
                </div>

                <div className="payout-action-box">
                  <div className="linked-bank-card card">
                    <Building size={20} color="#70152F" />
                    <div>
                      <strong>HDFC Bank ••••4812</strong>
                      <span className="bank-branch">Branch: Model Town, Panipat</span>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handlePayoutRequest}
                  >
                    Withdraw to Bank Account
                  </button>

                  {payoutSuccess && (
                    <div className="badge badge-verified mt-2">
                      <CheckCircle size={14} /> Payout initiated! Funds will arrive in 2 hours.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Commission Transparency Card */}
            <div className="commission-transparency-card card p-6">
              <h4 className="section-card-title">PartyPlace 10% Transparent Commission Structure</h4>
              <p className="text-muted" style={{ marginBottom: 16 }}>
                PartyPlace charges a flat 10% fee on completed bookings. You keep 90% of your listed price without hidden deductions.
              </p>
              
              <div className="commission-example-box card p-4" style={{ background: '#FFFAF7' }}>
                <div className="flex justify-between mb-2">
                  <span>Guest Booking Amount:</span>
                  <strong>₹5,000</strong>
                </div>
                <div className="flex justify-between mb-2" style={{ color: '#70152F' }}>
                  <span>PartyPlace Platform Commission (10%):</span>
                  <span>- ₹500</span>
                </div>
                <div className="flex justify-between border-t pt-2" style={{ borderColor: '#F0E3DC', fontWeight: 700, color: '#047857' }}>
                  <span>Host Payout to Your Bank:</span>
                  <span>₹4,500</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
