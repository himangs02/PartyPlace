import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  VolumeX, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  Image as ImageIcon,
  Check,
  Send
} from 'lucide-react';
import LightboxModal from '../components/LightboxModal';

export default function SpaceDetailsView({ 
  space, 
  onBack, 
  onStartBooking, 
  currentUser, 
  isWishlisted, 
  onToggleWishlist,
  onAddReview
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-09-26');
  const [selectedSlot, setSelectedSlot] = useState(space.availableSlots?.[2] || space.availableSlots?.[0] || '6:00 PM - 10:00 PM (4 hours)');
  const [guestsCount, setGuestsCount] = useState(25);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hostQueryOpen, setHostQueryOpen] = useState(false);
  const [hostQueryText, setHostQueryText] = useState('');
  const [hostQuerySent, setHostQuerySent] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!space) return null;

  const commissionRate = 10;
  const basePrice = space.price || 5000;
  const platformFee = Math.round((basePrice * commissionRate) / 100);
  const totalAmount = basePrice + platformFee;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleHostQuerySubmit = (e) => {
    e.preventDefault();
    if (!hostQueryText.trim()) return;
    setHostQuerySent(true);
    setTimeout(() => {
      setHostQuerySent(false);
      setHostQueryOpen(false);
      setHostQueryText('');
    }, 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    onAddReview({
      spaceId: space.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: reviewRating,
      comment: reviewComment,
      scores: { cleanliness: 5, accuracy: 5, communication: 5, value: 5 }
    });
    setReviewModalOpen(false);
    setReviewComment('');
  };

  const images = space.images || [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="space-details-page-root">
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal 
          images={images} 
          onClose={() => setLightboxOpen(false)} 
        />
      )}

      {/* Host Query Modal */}
      {hostQueryOpen && (
        <div className="modal-overlay" onClick={() => setHostQueryOpen(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Message Host ({space.hostName})</h4>
              <button className="btn-icon" onClick={() => setHostQueryOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {hostQuerySent ? (
                <div className="text-center p-6">
                  <CheckCircle size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h4>Message Delivered!</h4>
                  <p className="text-muted">Host {space.hostName} will reply within 30 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleHostQuerySubmit}>
                  <p className="text-muted" style={{ marginBottom: 12 }}>
                    Ask about parking, catering arrangements, decoration setups, or custom timings.
                  </p>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Hi Rohan, I want to host a small birthday gathering for 22 guests..."
                    value={hostQueryText}
                    onChange={(e) => setHostQueryText(e.target.value)}
                    required
                  />
                  <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setHostQueryOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary"><Send size={15} /> Send Query</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Write a Review for {space.name}</h4>
              <button className="btn-icon" onClick={() => setReviewModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Overall Rating</label>
                  <div className="stars-input-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewRating(star)}
                        className="star-btn"
                      >
                        <Star 
                          size={28} 
                          fill={star <= reviewRating ? '#F59E0B' : 'none'} 
                          color="#F59E0B" 
                        />
                      </button>
                    ))}
                    <span className="rating-text-label">{reviewRating} out of 5</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Experience & Feedback</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Tell other event seekers about the cleanliness, sound setup, host coordination, and overall celebration vibe..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setReviewModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Post Review</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="details-breadcrumbs">
          <button className="breadcrumb-btn" onClick={onBack}>Explore</button>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">{space.name}</span>
        </div>

        {/* Title & Actions Row */}
        <div className="details-title-row">
          <div>
            <h1 className="details-heading">{space.name}</h1>
            <div className="details-meta-row">
              <div className="details-rating">
                <Star size={15} fill="#F59E0B" color="#F59E0B" />
                <strong>{space.rating}</strong>
                <span>({space.reviewCount || 112} reviews)</span>
              </div>
              <span className="meta-bullet">•</span>
              <div className="details-location">
                <MapPin size={15} color="#70152F" />
                <span>{space.area}, {space.city}</span>
              </div>
              <span className="meta-bullet">•</span>
              <span className="badge badge-verified">
                <ShieldCheck size={13} /> Verified Space
              </span>
            </div>
          </div>

          <div className="details-actions-group">
            <button 
              className={`btn btn-secondary ${isWishlisted ? 'wishlisted' : ''}`}
              onClick={() => onToggleWishlist(space.id)}
            >
              <Heart size={16} fill={isWishlisted ? '#D94D83' : 'none'} color={isWishlisted ? '#D94D83' : 'currentColor'} />
              <span>{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
            <button className="btn btn-secondary" onClick={handleShare}>
              {copiedLink ? <Check size={16} color="#059669" /> : <Share2 size={16} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Photo Gallery Grid (1 large + 3 right stacked) */}
        <div className="photo-gallery-grid">
          <div className="gallery-main" onClick={() => setLightboxOpen(true)}>
            <img src={images[0]} alt={space.name} className="gallery-img main" />
          </div>

          <div className="gallery-side-grid">
            <div className="gallery-side-item" onClick={() => setLightboxOpen(true)}>
              <img src={images[1] || images[0]} alt="Space view 2" className="gallery-img" />
            </div>
            <div className="gallery-side-item" onClick={() => setLightboxOpen(true)}>
              <img src={images[2] || images[0]} alt="Space view 3" className="gallery-img" />
            </div>
            <div className="gallery-side-item gallery-overlay-item" onClick={() => setLightboxOpen(true)}>
              <img src={images[3] || images[1] || images[0]} alt="Space view 4" className="gallery-img" />
              <div className="gallery-more-overlay">
                <ImageIcon size={22} />
                <span>+12 Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout (2 Columns: Info on Left, Sticky Booking Card on Right) */}
        <div className="details-content-grid">
          {/* Left Column: Information */}
          <div className="details-info-col">
            {/* Quick Specs Chips */}
            <div className="specs-chips-row">
              <span className="spec-chip"><Users size={16} color="#70152F" /> Up to {space.capacity} Guests</span>
              <span className="spec-chip"><Sparkles size={16} color="#70152F" /> {space.category}</span>
              <span className="spec-chip"><CheckCircle size={16} color="#70152F" /> Parking Included</span>
              <span className="spec-chip"><CheckCircle size={16} color="#70152F" /> Wi-Fi</span>
              <span className="spec-chip"><CheckCircle size={16} color="#70152F" /> Air Conditioning</span>
            </div>

            <div className="content-divider" />

            {/* About this Space */}
            <div className="info-block">
              <h3 className="block-title">About this space</h3>
              <p className="block-paragraph">{space.description}</p>
              
              <div className="permitted-events-box card">
                <h4 className="permitted-title">Permitted Private Celebrations</h4>
                <div className="permitted-tags">
                  {(space.permittedEvents || ["Birthday Parties", "Farewells", "Family Dinners", "Get-togethers", "Photoshoots"]).map((ev, i) => (
                    <span key={i} className="badge badge-rose">{ev}</span>
                  ))}
                </div>
                <div className="policy-disclaimer">
                  <AlertCircle size={14} color="#D97706" />
                  <span>Strictly private, non-commercial celebrations only. Public ticketed events and unauthorized raves are prohibited.</span>
                </div>
              </div>
            </div>

            <div className="content-divider" />

            {/* Amenities Grid */}
            <div className="info-block">
              <h3 className="block-title">Amenities & Facilities</h3>
              <div className="amenities-grid-view">
                {space.amenities?.map((amenity, idx) => (
                  <div key={idx} className="amenity-item">
                    <CheckCircle size={18} color="#059669" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-divider" />

            {/* House Rules & Noise Restrictions */}
            <div className="info-block">
              <h3 className="block-title">House Rules & Safety Compliance</h3>
              <div className="rules-list">
                {space.rules?.map((rule, idx) => (
                  <div key={idx} className="rule-item">
                    <span className="rule-bullet">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Highlighted Noise Restriction Box */}
              <div className="noise-restriction-card card">
                <div className="noise-icon-wrap">
                  <VolumeX size={24} color="#70152F" />
                </div>
                <div className="noise-content">
                  <h5>Noise Restriction & Curfew</h5>
                  <p>{space.noiseRestriction || "Outdoor amplified music must conclude by 10:30 PM in accordance with municipal guidelines. Indoor ambient music permitted anytime."}</p>
                </div>
              </div>
            </div>

            <div className="content-divider" />

            {/* Host Profile Card */}
            <div className="info-block">
              <h3 className="block-title">Meet Your Host</h3>
              <div className="host-profile-card card">
                <img 
                  src={space.hostAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                  alt={space.hostName} 
                  className="host-profile-avatar"
                />
                <div className="host-profile-info">
                  <div className="host-name-row">
                    <h4>{space.hostName}</h4>
                    {space.isSuperhost && (
                      <span className="badge badge-burgundy">Superhost</span>
                    )}
                  </div>
                  <p className="host-desc">
                    Host since 2025 • Response rate: 100% • Responds within 1 hour
                  </p>
                  <button className="btn btn-sm btn-secondary" onClick={() => setHostQueryOpen(true)}>
                    <MessageSquare size={14} /> Contact Host
                  </button>
                </div>
              </div>
            </div>

            <div className="content-divider" />

            {/* Customer Reviews Section */}
            <div className="info-block">
              <div className="reviews-header-row">
                <div>
                  <h3 className="block-title">
                    <Star size={20} fill="#F59E0B" color="#F59E0B" style={{ display: 'inline', verticalAlign: 'middle' }} /> {space.rating} ({space.reviewCount || 112} Reviews)
                  </h3>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setReviewModalOpen(true)}
                >
                  Write a Review
                </button>
              </div>

              {/* Review breakdown bars */}
              <div className="reviews-scores-grid card">
                <div className="score-row">
                  <span>Cleanliness</span>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '100%' }} /></div>
                  <strong>5.0</strong>
                </div>
                <div className="score-row">
                  <span>Accuracy</span>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '98%' }} /></div>
                  <strong>4.9</strong>
                </div>
                <div className="score-row">
                  <span>Communication</span>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '100%' }} /></div>
                  <strong>5.0</strong>
                </div>
                <div className="score-row">
                  <span>Value for Money</span>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '96%' }} /></div>
                  <strong>4.8</strong>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list">
                {space.reviews && space.reviews.length > 0 ? (
                  space.reviews.map((rev, idx) => (
                    <div key={idx} className="review-item card">
                      <div className="review-user-row">
                        <img src={rev.userAvatar} alt={rev.userName} className="review-user-avatar" />
                        <div>
                          <h5 className="review-user-name">{rev.userName}</h5>
                          <span className="review-date">{rev.date}</span>
                        </div>
                        <div className="review-stars-pill">
                          <Star size={13} fill="#F59E0B" color="#F59E0B" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="review-comment">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No reviews yet for this space. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="details-booking-col">
            <div className="sticky-booking-widget card">
              {/* Price Row */}
              <div className="booking-price-header">
                <div className="price-tag large">
                  <span className="currency">₹</span>
                  <span className="amount">{basePrice.toLocaleString('en-IN')}</span>
                  <span className="duration">/ {space.durationHours || 4} hours</span>
                </div>
                <div className="booking-rating-pill">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                  <strong>{space.rating}</strong>
                </div>
              </div>

              {/* Form Fields */}
              <div className="booking-fields-card">
                {/* Date Picker */}
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={14} color="#70152F" /> Select Date
                  </label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Time Slot */}
                <div className="form-group">
                  <label className="form-label">
                    <Clock size={14} color="#70152F" /> Select Time Slot
                  </label>
                  <select 
                    className="form-control"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  >
                    {space.availableSlots?.map((slot, i) => (
                      <option key={i} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                {/* Number of Guests */}
                <div className="form-group">
                  <label className="form-label">
                    <Users size={14} color="#70152F" /> Number of Guests
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max={space.capacity} 
                    className="form-control"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                  />
                  <span className="capacity-limit-hint">
                    Max capacity: {space.capacity} guests
                  </span>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="booking-calculation-table">
                <div className="calc-row">
                  <span>Base Price ({space.durationHours || 4} Hours):</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="calc-row">
                  <span>Platform Fee (10%):</span>
                  <span>₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="calc-divider" />
                <div className="calc-row total">
                  <span>Total Payable:</span>
                  <span className="total-amount">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Book Now CTA */}
              <button 
                className="btn btn-lg btn-primary w-full book-now-btn"
                onClick={() => onStartBooking({
                  space,
                  date: selectedDate,
                  slot: selectedSlot,
                  guests: guestsCount,
                  basePrice,
                  platformFee,
                  totalAmount
                })}
              >
                Book Now
              </button>

              {/* Free Cancellation Guarantee Note */}
              <div className="cancellation-guarantee-note">
                <ShieldCheck size={16} color="#059669" />
                <span>Free cancellation up to 24 hours before event</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
