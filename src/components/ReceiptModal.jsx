import React from 'react';
import { X, Printer, CheckCircle, MapPin, Calendar, Clock, Users, ShieldCheck, Download } from 'lucide-react';

export default function ReceiptModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content receipt-modal-card card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="receipt-brand">
            <span className="receipt-title">PartyPlace Official Booking Pass</span>
            <span className="badge badge-verified">
              <ShieldCheck size={12} /> Confirmed & Paid
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body receipt-body">
          {/* Top Banner */}
          <div className="receipt-header-banner">
            <div className="booking-ref-box">
              <span className="ref-label">Booking Reference:</span>
              <span className="ref-code">{booking.id}</span>
            </div>
            <div className="booking-date-stamp">
              Booked on: {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Venue & Event Info */}
          <div className="receipt-details-grid">
            <div className="receipt-block">
              <h5 className="block-title">Venue Details</h5>
              <div className="receipt-venue-name">{booking.spaceName}</div>
              <div className="receipt-venue-addr">
                <MapPin size={14} /> {booking.location}
              </div>
              <div className="receipt-host-info">
                Host: <strong>{booking.hostName}</strong>
              </div>
            </div>

            <div className="receipt-block">
              <h5 className="block-title">Celebration Schedule</h5>
              <div className="receipt-schedule-item">
                <Calendar size={14} /> {booking.formattedDate}
              </div>
              <div className="receipt-schedule-item">
                <Clock size={14} /> {booking.slot}
              </div>
              <div className="receipt-schedule-item">
                <Users size={14} /> {booking.guests} Permitted Attendees
              </div>
              <div className="receipt-schedule-item">
                Occasion: <em>{booking.occasion}</em>
              </div>
            </div>
          </div>

          {/* QR Code Pass for Entry */}
          <div className="receipt-qr-section">
            <div className="qr-box">
              {/* Clean vector QR code representation */}
              <svg width="100" height="100" viewBox="0 0 100 100" className="qr-svg">
                <rect width="100" height="100" fill="#FFF0E8" rx="8" />
                <rect x="10" y="10" width="25" height="25" fill="#70152F" />
                <rect x="15" y="15" width="15" height="15" fill="#FFF0E8" />
                <rect x="18" y="18" width="9" height="9" fill="#70152F" />
                <rect x="65" y="10" width="25" height="25" fill="#70152F" />
                <rect x="70" y="15" width="15" height="15" fill="#FFF0E8" />
                <rect x="73" y="18" width="9" height="9" fill="#70152F" />
                <rect x="10" y="65" width="25" height="25" fill="#70152F" />
                <rect x="15" y="70" width="15" height="15" fill="#FFF0E8" />
                <rect x="18" y="73" width="9" height="9" fill="#70152F" />
                <rect x="42" y="20" width="8" height="8" fill="#D94D83" />
                <rect x="52" y="32" width="8" height="8" fill="#70152F" />
                <rect x="42" y="44" width="16" height="8" fill="#70152F" />
                <rect x="65" y="55" width="8" height="12" fill="#D94D83" />
                <rect x="45" y="68" width="14" height="14" fill="#70152F" />
                <rect x="70" y="75" width="15" height="8" fill="#70152F" />
              </svg>
            </div>
            <div className="qr-instructions">
              <div className="qr-title">Verified Gate Pass</div>
              <p className="qr-desc">Show this QR pass or reference code upon arrival at the venue for expedited check-in.</p>
            </div>
          </div>

          {/* Payment & Invoice Breakdown */}
          <div className="receipt-invoice-table">
            <h5 className="block-title">Invoice & Payment Summary</h5>
            <div className="invoice-row">
              <span>Space Rental Base Fee ({booking.slot?.split('(')[1]?.replace(')', '') || '4 hours'}):</span>
              <span>₹{booking.basePrice?.toLocaleString('en-IN')}</span>
            </div>
            <div className="invoice-row">
              <span>Platform Service Fee (10%):</span>
              <span>₹{booking.platformFee?.toLocaleString('en-IN')}</span>
            </div>
            <div className="invoice-row highlight">
              <span>Total Paid ({booking.paymentMethod}):</span>
              <span className="total-val">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="invoice-row text-muted-subtle">
              <span>Transaction ID:</span>
              <span className="mono-text">{booking.transactionId || 'TXN-9821430948'}</span>
            </div>
            <div className="invoice-row text-muted-subtle">
              <span>Refundable Security Deposit (Payable at venue):</span>
              <span>₹{booking.securityDeposit?.toLocaleString('en-IN') || '2,000'}</span>
            </div>
          </div>

          <div className="receipt-policy-note">
            <CheckCircle size={14} color="#059669" />
            <span>Compliant with PartyPlace noise regulations (10:30 PM outdoor curfew). Valid government ID required.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
