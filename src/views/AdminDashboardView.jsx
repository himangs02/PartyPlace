import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Home, 
  Calendar, 
  IndianRupee, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  Sliders, 
  Eye, 
  Star,
  Activity,
  Award
} from 'lucide-react';

export default function AdminDashboardView({ 
  spaces = [], 
  bookings = [], 
  settings = {}, 
  onUpdateSettings, 
  onApproveSpace, 
  onRejectSpace, 
  onToggleFeatureSpace,
  onSelectSpace 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'verification', 'bookings', 'commission', 'users'
  const [commissionRate, setCommissionRate] = useState(settings?.commissionRate || 10);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Stats calculation
  const totalUsers = 1248;
  const activeListings = spaces.filter(s => s.status === 'active').length + 368;
  const totalBookingsCount = bookings.length + 1982;
  const totalPlatformGross = 982500;
  const platformRevenueCut = Math.round((totalPlatformGross * (commissionRate / 100)));

  const pendingVerificationSpaces = spaces.filter(s => s.status === 'under_review' || !s.verified);

  const handleSaveCommission = (e) => {
    e.preventDefault();
    onUpdateSettings({ commissionRate: Number(commissionRate) });
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2500);
  };

  const recentActivities = [
    { text: "New listing submitted: The Lake House", time: "5 min ago", type: "listing" },
    { text: "Booking confirmed: Skyline Terrace (Akanksha)", time: "12 min ago", type: "booking" },
    { text: "Payout processed: ₹5,000 to Rohan Mehta", time: "30 min ago", type: "payout" },
    { text: "New user registered: Sahil Juneja (Guest)", time: "1 hour ago", type: "user" },
    { text: "Verification approved: Gulmohar Estate Villa", time: "2 hours ago", type: "verify" }
  ];

  return (
    <div className="dashboard-page-root">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-verified">Super Admin Mode</span>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Panipat Central Hub</span>
            </div>
            <h1 className="admin-title">Platform Overview</h1>
            <p className="admin-sub">Monitor ecosystem metrics, verify new venues, and adjust marketplace settings.</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="host-nav-tabs-bar">
          <button 
            className={`host-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Trends
          </button>
          <button 
            className={`host-nav-tab ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            Space Verification ({pendingVerificationSpaces.length} Pending)
          </button>
          <button 
            className={`host-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            System Bookings Audit ({bookings.length})
          </button>
          <button 
            className={`host-nav-tab ${activeTab === 'commission' ? 'active' : ''}`}
            onClick={() => setActiveTab('commission')}
          >
            Commission & Settings ({commissionRate}%)
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* 4 Stat Cards matching Screenshot */}
            <div className="stats-kpi-grid">
              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#FFF0E8', color: '#70152F' }}>
                  <Users size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">{totalUsers.toLocaleString()}</div>
                  <div className="kpi-label">Total Users</div>
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem', marginTop: 4 }}>
                    <TrendingUp size={11} /> +12% this month
                  </span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#FDF2F7', color: '#D94D83' }}>
                  <Home size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">{activeListings}</div>
                  <div className="kpi-label">Active Listings</div>
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem', marginTop: 4 }}>
                    <TrendingUp size={11} /> +8% new spaces
                  </span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#E6F7ED', color: '#047857' }}>
                  <Calendar size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">{totalBookingsCount.toLocaleString()}</div>
                  <div className="kpi-label">Total Bookings</div>
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem', marginTop: 4 }}>
                    <TrendingUp size={11} /> +14% completed
                  </span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ background: '#FFFBEB', color: '#B45309' }}>
                  <IndianRupee size={22} />
                </div>
                <div className="kpi-info">
                  <div className="kpi-val">₹{totalPlatformGross.toLocaleString('en-IN')}</div>
                  <div className="kpi-label">Gross Platform Volume</div>
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem', marginTop: 4 }}>
                    <TrendingUp size={11} /> +18% revenue
                  </span>
                </div>
              </div>
            </div>

            {/* Split Grid: Bookings Trend Chart + Recent Activities */}
            <div className="host-overview-grid">
              {/* SVG Curve Trend Chart matching Screenshot */}
              <div className="overview-chart-card card">
                <div className="card-header-between mb-4">
                  <div>
                    <h3 className="section-card-title">Bookings Trend</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Ecosystem growth trajectory (Apr – Sep)</p>
                  </div>
                  <span className="badge badge-rose">Monthly Active Bookings</span>
                </div>

                <div className="trend-chart-wrapper">
                  <svg viewBox="0 0 500 200" className="trend-svg-chart">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D94D83" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#D94D83" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="40" y1="30" x2="480" y2="30" stroke="#F0E3DC" strokeDasharray="3 3" />
                    <line x1="40" y1="80" x2="480" y2="80" stroke="#F0E3DC" strokeDasharray="3 3" />
                    <line x1="40" y1="130" x2="480" y2="130" stroke="#F0E3DC" strokeDasharray="3 3" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#F0E3DC" />

                    {/* Area under curve */}
                    <path 
                      d="M 50 160 Q 120 145 190 140 T 330 110 T 400 70 T 470 40 L 470 170 L 50 170 Z" 
                      fill="url(#chartGradient)" 
                    />

                    {/* Line curve */}
                    <path 
                      d="M 50 160 Q 120 145 190 140 T 330 110 T 400 70 T 470 40" 
                      fill="none" 
                      stroke="#D94D83" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />

                    {/* Points */}
                    <circle cx="50" cy="160" r="4.5" fill="#70152F" />
                    <circle cx="134" cy="148" r="4.5" fill="#70152F" />
                    <circle cx="218" cy="138" r="4.5" fill="#70152F" />
                    <circle cx="302" cy="112" r="4.5" fill="#70152F" />
                    <circle cx="386" cy="74" r="4.5" fill="#70152F" />
                    <circle cx="470" cy="40" r="5.5" fill="#D94D83" stroke="#FFF" strokeWidth="2" />

                    {/* Axis Labels */}
                    <text x="45" y="190" fill="#6E6870" fontSize="12" fontFamily="sans-serif">Apr</text>
                    <text x="130" y="190" fill="#6E6870" fontSize="12" fontFamily="sans-serif">May</text>
                    <text x="215" y="190" fill="#6E6870" fontSize="12" fontFamily="sans-serif">Jun</text>
                    <text x="300" y="190" fill="#6E6870" fontSize="12" fontFamily="sans-serif">Jul</text>
                    <text x="380" y="190" fill="#6E6870" fontSize="12" fontFamily="sans-serif">Aug</text>
                    <text x="460" y="190" fill="#6E6870" fontSize="12" fontFamily="sans-serif">Sep</text>
                  </svg>
                </div>
              </div>

              {/* Recent Activities feed matching Screenshot */}
              <div className="recent-activities-card card">
                <div className="card-header-between mb-4">
                  <h3 className="section-card-title">Recent Activities</h3>
                  <span className="badge badge-verified">
                    <Activity size={12} /> Live Feed
                  </span>
                </div>

                <div className="activities-feed-list">
                  {recentActivities.map((act, i) => (
                    <div key={i} className="activity-feed-item">
                      <div className="activity-bullet" />
                      <div className="activity-details">
                        <div className="activity-text">{act.text}</div>
                        <div className="activity-time">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPACE VERIFICATION QUEUE */}
        {activeTab === 'verification' && (
          <div className="card p-6">
            <div className="card-header-between mb-4">
              <div>
                <h3 className="section-card-title">Venue Listings Verification Queue</h3>
                <p className="text-muted">Review property photos, permits, and quality compliance before making public.</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Host</th>
                    <th>Category & Capacity</th>
                    <th>Rate</th>
                    <th>Current Status</th>
                    <th>Featured</th>
                    <th>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {spaces.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={s.images?.[0]} alt={s.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                          <div>
                            <strong>{s.name}</strong>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{s.area}, {s.city}</div>
                          </div>
                        </div>
                      </td>
                      <td>{s.hostName}</td>
                      <td>{s.category} • {s.capacity} Guests</td>
                      <td>₹{s.price?.toLocaleString('en-IN')} / 4h</td>
                      <td>
                        <span className={`badge ${s.verified ? 'badge-verified' : 'badge-pending'}`}>
                          {s.verified ? 'Verified' : 'Under Review'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`btn btn-sm ${s.isFeatured ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => onToggleFeatureSpace(s.id, !s.isFeatured)}
                          title="Toggle featured showcase on landing page"
                        >
                          <Star size={12} fill={s.isFeatured ? '#FFF' : 'none'} />
                          {s.isFeatured ? 'Featured' : 'Make Featured'}
                        </button>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {!s.verified ? (
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => onApproveSpace(s.id)}
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                          ) : (
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => onRejectSpace(s.id)}
                            >
                              Revoke
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => onSelectSpace(s.id)}
                          >
                            <Eye size={14} /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS AUDIT */}
        {activeTab === 'bookings' && (
          <div className="card p-6">
            <h3 className="section-card-title mb-4">Complete System Bookings & Commission Audit</h3>
            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Space</th>
                    <th>Customer</th>
                    <th>Host</th>
                    <th>Schedule</th>
                    <th>Total Paid</th>
                    <th>PartyPlace Cut (10%)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className="mono-text">{b.id}</td>
                      <td><strong>{b.spaceName}</strong></td>
                      <td>{b.userName}</td>
                      <td>{b.hostName}</td>
                      <td>{b.formattedDate || b.date}</td>
                      <td><strong>₹{b.totalAmount?.toLocaleString('en-IN')}</strong></td>
                      <td><strong style={{ color: '#70152F' }}>₹{(b.platformFee || Math.round(b.basePrice * 0.1)).toLocaleString('en-IN')}</strong></td>
                      <td>
                        <span className={`badge ${b.status === 'confirmed' ? 'badge-verified' : 'badge-burgundy'}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COMMISSION & SETTINGS */}
        {activeTab === 'commission' && (
          <div className="commission-settings-tab">
            <div className="card p-6 mb-6">
              <h3 className="section-card-title">Dynamic Platform Commission Configuration</h3>
              <p className="text-muted" style={{ marginBottom: 20 }}>
                Adjust the platform percentage fee charged on completed bookings. Changes apply dynamically across the checkout calculator and host payout forecasts.
              </p>

              <form onSubmit={handleSaveCommission} className="max-w-md">
                <div className="form-group mb-4">
                  <label className="form-label">Platform Commission Rate (%)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="5" 
                      max="25" 
                      step="1"
                      className="form-control"
                      style={{ maxWidth: 160 }}
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                    />
                    <span style={{ fontWeight: 600 }}>% of booking amount</span>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>
                    Standard default: 10%. (Example: On a ₹5,000 booking, PartyPlace retains ₹{5000 * (commissionRate / 100)}, host receives ₹{5000 - (5000 * (commissionRate / 100))}).
                  </span>
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Commission Rate
                </button>

                {saveSettingsSuccess && (
                  <span className="badge badge-verified ml-3">
                    <CheckCircle size={14} /> Commission rate updated to {commissionRate}%!
                  </span>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
