import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle, 
  Lock, 
  QrCode,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutView({ 
  bookingDetails, 
  onBack, 
  onConfirmBooking, 
  currentUser 
}) {
  const { space, date, slot, guests, basePath, totalPrice } = bookingDetails || {};

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiOption, setUpiOption] = useState('gpay'); // 'gpay', 'phonepe', 'paytm', 'qr'
  const [upiId, setUpiId] = useState('akanksha@okhdfcbank');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [cardName, setCardName] = useState(currentUser?.name || 'Akanksha Verma');
  
  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Guest & Occasion details
  const [guestName, setGuestName] = useState(currentUser?.name || 'Akanksha Verma');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '+91 98112 34567');
  const [occasion, setOccasion] = useState('25th Birthday Celebration');
  const [specialRequests, setSpecialRequests] = useState('Need ice bucket and sound console ready.');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  if (!space) return null;

  const basePrice = bookingDetails.basePrice || space.price || 5000;
  const platformFee = bookingDetails.platformFee || Math.round((basePrice * 10) / 100);
  const totalAmount = bookingDetails.totalAmount || (basePrice + platformFee);

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if canvas not supported
      }

      const bookingRecord = {
        spaceId: space.id,
        userId: currentUser?.id || 'user-1',
        userName: guestName,
        userPhone: guestPhone,
        date: date || '2026-09-26',
        formattedDate: date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Sat, 26 Sep 2026',
        slot: slot || '6:00 PM - 10:00 PM (4 hours)',
        guests: Number(guests) || 25,
        occasion,
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiOption.toUpperCase()})` : paymentMethod === 'card' ? 'Credit Card' : `Net Banking (${selectedBank})`,
        basePrice,
        platformFee,
        totalAmount
      };

      onConfirmBooking(bookingRecord).then(created => {
        setConfirmedBookingData(created || bookingRecord);
      });
    }, 1800);
  };

  return (
    <div className="checkout-page-root">
      <div className="container">
        {/* Back Link */}
        <button className="checkout-back-link" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Space Details
        </button>

        {isSuccess ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="booking-success-view card">
            <div className="success-icon-wrap">
              <CheckCircle size={64} color="#059669" />
            </div>
            <span className="badge badge-verified">Payment Successful</span>
            <h2 className="success-title">Your Celebration is Booked! 🎉</h2>
            <p className="success-subtitle">
              We've emailed your confirmed booking pass to <strong>{currentUser?.email || 'akanksha@example.com'}</strong>.
            </p>

            <div className="confirmed-summary-box">
              <div className="confirmed-row">
                <span>Booking ID:</span>
                <strong className="mono-text">{confirmedBookingData?.id || 'PP-BK-2026-001'}</strong>
              </div>
              <div className="confirmed-row">
                <span>Venue:</span>
                <strong>{space.name}</strong>
              </div>
              <div className="confirmed-row">
                <span>Location:</span>
                <span>{space.area}, {space.city}</span>
              </div>
              <div className="confirmed-row">
                <span>Schedule:</span>
                <span>{confirmedBookingData?.formattedDate || date} • {slot}</span>
              </div>
              <div className="confirmed-row">
                <span>Total Amount Paid:</span>
                <strong style={{ color: '#70152F' }}>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="success-actions-row">
              <button 
                className="btn btn-primary"
                onClick={() => onBack('customer-dashboard')}
              >
                Go to My Bookings
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => onBack('explore')}
              >
                Browse More Spaces
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <div>
            <div className="checkout-heading-row">
              <h1 className="checkout-title">Confirm Your Booking</h1>
              <p className="checkout-subtitle">Review your celebration details and complete secure payment.</p>
            </div>

            <div className="checkout-layout-grid">
              {/* Left Column: Venue Details & Guest Information */}
              <div className="checkout-info-col">
                {/* Space Summary Card */}
                <div className="checkout-venue-card card">
                  <img 
                    src={space.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80'} 
                    alt={space.name} 
                    className="checkout-venue-thumb"
                  />
                  <div className="checkout-venue-details">
                    <span className="badge badge-burgundy">{space.category}</span>
                    <h3 className="checkout-venue-name">{space.name}</h3>
                    <div className="checkout-venue-loc">
                      <MapPin size={14} color="#70152F" />
                      <span>{space.area}, {space.city}</span>
                    </div>

                    <div className="checkout-slots-meta">
                      <div className="meta-item">
                        <Calendar size={14} color="#70152F" />
                        <span>{date || 'Sat, 26 Sep 2026'}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} color="#70152F" />
                        <span>{slot || '6:00 PM - 10:00 PM'}</span>
                      </div>
                      <div className="meta-item">
                        <Users size={14} color="#70152F" />
                        <span>{guests || 25} Guests</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Guest & Event Info Form */}
                <div className="checkout-form-card card">
                  <h4 className="section-card-title">Event & Primary Booker Details</h4>
                  
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Occasion / Celebration Type</label>
                    <select 
                      className="form-control"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                    >
                      <option value="25th Birthday Celebration">Birthday Celebration</option>
                      <option value="College Farewell Party">College Farewell Party</option>
                      <option value="Small Family Get-together">Small Family Get-together</option>
                      <option value="Anniversary Dinner">Anniversary Celebration</option>
                      <option value="Private Photoshoot">Private Photoshoot</option>
                      <option value="Cocktail Gathering">Small Cocktail Gathering</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Requests / Notes for Host (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Early access for decorator, ice cubes arrangement"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>
                </div>

                {/* Cancellation Policy Box */}
                <div className="cancellation-policy-card card">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <h5 style={{ fontSize: '0.95rem', marginBottom: 4 }}>Standard Cancellation Policy</h5>
                      <p style={{ fontSize: '0.85rem', margin: 0 }}>
                        Free cancellation up to 24 hours before the event start time. 100% refund processed to original payment method.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Gateway Simulation & Price Details */}
              <div className="checkout-payment-col">
                {/* Price Details Box */}
                <div className="price-details-card card">
                  <h4 className="section-card-title">Price Breakdown</h4>
                  
                  <div className="price-summary-table">
                    <div className="price-row">
                      <span>Base Rental ({space.durationHours || 4} Hours):</span>
                      <span>₹{basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row">
                      <span>Platform Service Fee (10%):</span>
                      <span>₹{platformFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-divider" />
                    <div className="price-row total">
                      <span>Total Payable:</span>
                      <span className="price-total-val">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="security-deposit-badge">
                    <span>* Refundable security deposit (₹{space.securityDeposit || 2000}) collected at venue upon check-in</span>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="payment-methods-card card">
                  <h4 className="section-card-title">
                    <Lock size={16} color="#70152F" /> Pay Using
                  </h4>

                  {/* Payment Tabs */}
                  <div className="payment-options-tabs">
                    <button 
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <Smartphone size={16} /> UPI (Instant)
                    </button>
                    <button 
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={16} /> Card
                    </button>
                    <button 
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <Building size={16} /> Net Banking
                    </button>
                  </div>

                  {/* UPI Form */}
                  {paymentMethod === 'upi' && (
                    <div className="upi-payment-panel">
                      <div className="upi-apps-row">
                        <button 
                          type="button" 
                          className={`upi-app-chip ${upiOption === 'gpay' ? 'active' : ''}`}
                          onClick={() => setUpiOption('gpay')}
                        >
                          Google Pay
                        </button>
                        <button 
                          type="button" 
                          className={`upi-app-chip ${upiOption === 'phonepe' ? 'active' : ''}`}
                          onClick={() => setUpiOption('phonepe')}
                        >
                          PhonePe
                        </button>
                        <button 
                          type="button" 
                          className={`upi-app-chip ${upiOption === 'paytm' ? 'active' : ''}`}
                          onClick={() => setUpiOption('paytm')}
                        >
                          Paytm
                        </button>
                        <button 
                          type="button" 
                          className={`upi-app-chip ${upiOption === 'qr' ? 'active' : ''}`}
                          onClick={() => setUpiOption('qr')}
                        >
                          Scan QR
                        </button>
                      </div>

                      {upiOption === 'qr' ? (
                        <div className="qr-scan-box text-center">
                          <QrCode size={110} color="#70152F" style={{ margin: '0 auto 8px' }} />
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Scan using any UPI App to pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        <div className="form-group" style={{ marginTop: 12 }}>
                          <label className="form-label">Virtual Payment Address (UPI ID)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="card-payment-panel">
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                        />
                      </div>
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Expiry (MM/YY)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input 
                            type="password" 
                            maxLength="4" 
                            className="form-control" 
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Netbanking Form */}
                  {paymentMethod === 'netbanking' && (
                    <div className="netbanking-panel">
                      <div className="form-group">
                        <label className="form-label">Select Bank</label>
                        <select 
                          className="form-control"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button 
                    type="button" 
                    className="btn btn-lg btn-primary w-full pay-now-btn"
                    onClick={handlePayNow}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span>Processing Secure Payment...</span>
                    ) : (
                      <span>Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                    )}
                  </button>

                  <div className="payment-security-footer">
                    <Lock size={13} color="#6b636c" />
                    <span>256-Bit Bank Grade SSL Encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
