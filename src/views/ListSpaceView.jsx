import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Image as ImageIcon, 
  MapPin, 
  Users, 
  IndianRupee, 
  Sparkles,
  Home,
  Check
} from 'lucide-react';

export default function ListSpaceView({ onBack, onCompleteListing, currentUser }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [spaceName, setSpaceName] = useState('');
  const [category, setCategory] = useState('Villa');
  const [capacity, setCapacity] = useState(25);
  const [price, setPrice] = useState(5000);
  const [durationHours, setDurationHours] = useState(4);

  // Step 2: Location
  const [city, setCity] = useState('Panipat');
  const [area, setArea] = useState('Sector 11');
  const [fullAddress, setFullAddress] = useState('Villa #88, Near HUDA Park, Sector 11, Panipat');
  const [landmark, setLandmark] = useState('Opposite City Club');

  // Step 3: Details & Rules
  const [tagline, setTagline] = useState('Charming private celebration venue with garden and modern amenities');
  const [description, setDescription] = useState('Spacious private event venue tailored for intimate celebrations, birthdays, family dinners, and get-togethers.');
  const [noiseCurfew, setNoiseCurfew] = useState('10:30 PM');
  const [securityDeposit, setSecurityDeposit] = useState(2000);
  const [permittedEvents, setPermittedEvents] = useState(['Birthday Parties', 'Farewell Parties', 'Family Dinners']);

  // Step 4: Amenities & Photos
  const [amenities, setAmenities] = useState(['Air Conditioning', 'Wi-Fi', 'Sound System', 'Lawn / Garden', 'Dedicated Parking']);
  const [photoUrl1, setPhotoUrl1] = useState('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80');
  const [photoUrl2, setPhotoUrl2] = useState('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80');
  const [photoUrl3, setPhotoUrl3] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const availableAmenities = [
    'Swimming Pool', 'Lawn / Garden', 'Air Conditioning', 'Sound System', 
    'Wi-Fi', 'Dedicated Parking', 'Catering Area', 'BBQ Grill', 'Terrace View', 'Fairy Lighting'
  ];

  const availableEventTypes = [
    'Birthday Parties', 'Farewell Parties', 'Family Dinners', 'Get-togethers', 'Small Engagements', 'Photoshoots'
  ];

  const toggleAmenity = (a) => {
    if (amenities.includes(a)) {
      setAmenities(amenities.filter(item => item !== a));
    } else {
      setAmenities([...amenities, a]);
    }
  };

  const toggleEventType = (ev) => {
    if (permittedEvents.includes(ev)) {
      setPermittedEvents(permittedEvents.filter(item => item !== ev));
    } else {
      setPermittedEvents([...permittedEvents, ev]);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newSpacePayload = {
      name: spaceName || 'The Grand Terrace Villa',
      tagline,
      category,
      hostId: currentUser?.id || 'user-2',
      hostName: currentUser?.name || 'Rohan Mehta',
      hostAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isSuperhost: true,
      city,
      area,
      fullAddress,
      capacity: Number(capacity) || 25,
      price: Number(price) || 5000,
      durationHours: Number(durationHours) || 4,
      description,
      amenities,
      rules: [
        `Maximum ${capacity} guests permitted strictly.`,
        `Outdoor music allowed till ${noiseCurfew} strictly.`,
        'Valid photo ID required upon arrival.',
        'No unauthorized raves or commercial events.'
      ],
      noiseRestriction: `Outdoor amplified music allowed till ${noiseCurfew}. Indoor ambient music permitted anytime.`,
      securityDeposit: Number(securityDeposit) || 2000,
      permittedEvents,
      availableSlots: [
        '11:00 AM - 3:00 PM',
        '4:00 PM - 8:00 PM',
        '6:00 PM - 10:00 PM'
      ],
      images: [photoUrl1, photoUrl2, photoUrl3].filter(Boolean)
    };

    setTimeout(() => {
      onCompleteListing(newSpacePayload);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 1200);
  };

  return (
    <div className="list-space-page-root">
      <div className="container">
        {/* Top Breadcrumb */}
        <button className="checkout-back-link" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {submittedSuccess ? (
          <div className="listing-success-card card text-center p-8">
            <div className="success-icon-wrap" style={{ margin: '0 auto 16px' }}>
              <CheckCircle size={64} color="#059669" />
            </div>
            <span className="badge badge-verified">Listing Submitted</span>
            <h2 className="success-title">Your Space is Under Verification! 🎉</h2>
            <p className="success-subtitle" style={{ maxWidth: 540, margin: '12px auto 24px' }}>
              Our Panipat quality inspection team will verify your property details and contact you within 24 hours. You can view and manage your listing in your Host Dashboard right away.
            </p>
            <button className="btn btn-primary" onClick={onBack}>
              Go to Host Dashboard
            </button>
          </div>
        ) : (
          <div className="wizard-layout-grid">
            {/* Left Promotional Banner matching screenshot */}
            <div className="wizard-promo-banner card">
              <div className="promo-banner-content">
                <span className="badge badge-rose">Host With PartyPlace</span>
                <h3 className="promo-banner-title">Why list on PartyPlace?</h3>
                
                <div className="promo-perks-list">
                  <div className="promo-perk-item">
                    <Check size={18} color="#D94D83" />
                    <span>Reach genuine event seekers for small celebrations</span>
                  </div>
                  <div className="promo-perk-item">
                    <Check size={18} color="#D94D83" />
                    <span>Earn guaranteed income from your unused space</span>
                  </div>
                  <div className="promo-perk-item">
                    <Check size={18} color="#D94D83" />
                    <span>Secure & verified bookings with ID checks</span>
                  </div>
                  <div className="promo-perk-item">
                    <Check size={18} color="#D94D83" />
                    <span>You set the house rules, guest limits & schedule</span>
                  </div>
                </div>

                <div className="promo-stat-box card">
                  <div className="promo-stat-num">₹45,000+</div>
                  <div className="promo-stat-desc">Average monthly host earnings in Panipat</div>
                </div>
              </div>
            </div>

            {/* Right Wizard Form Box */}
            <div className="wizard-form-box card">
              {/* 5-Step Progress Indicator matching screenshot */}
              <div className="wizard-stepper">
                {[
                  { num: 1, name: 'Basic Info' },
                  { num: 2, name: 'Location' },
                  { num: 3, name: 'Details' },
                  { num: 4, name: 'Photos' },
                  { num: 5, name: 'Review' }
                ].map(step => (
                  <div 
                    key={step.num} 
                    className={`step-indicator ${currentStep === step.num ? 'active' : currentStep > step.num ? 'completed' : ''}`}
                  >
                    <div className="step-circle">
                      {currentStep > step.num ? <Check size={12} /> : step.num}
                    </div>
                    <span className="step-text">{step.name}</span>
                  </div>
                ))}
              </div>

              {/* STEP 1: BASIC INFORMATION */}
              {currentStep === 1 && (
                <div className="wizard-step-body">
                  <h3 className="step-heading">Basic Information</h3>
                  <p className="step-caption">Start with your space title, category, and standard 4-hour rental rate.</p>

                  <div className="form-group">
                    <label className="form-label">Space Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. The Palm Villa"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Space Type *</label>
                    <select 
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Villa">Villa (Independent Private Estate)</option>
                      <option value="Terrace">Terrace (Rooftop Open Air)</option>
                      <option value="Farmhouse">Farmhouse (Rural Gated Property)</option>
                      <option value="Private Hall">Private Hall (Mini Banquet / Indoor)</option>
                      <option value="Studio">Studio (Boutique Event Lounge)</option>
                      <option value="Private Garden">Private Garden (Walled Lawn)</option>
                    </select>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Maximum Guest Capacity *</label>
                      <input 
                        type="number" 
                        min="10" 
                        max="40" 
                        className="form-control"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>Recommended for PartyPlace: 15–30 guests</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Base Price (₹ per 4 hours) *</label>
                      <input 
                        type="number" 
                        step="500" 
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>You earn ₹{(price * 0.9).toLocaleString('en-IN')} after 10% platform fee</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {currentStep === 2 && (
                <div className="wizard-step-body">
                  <h3 className="step-heading">Property Location</h3>
                  <p className="step-caption">Exact address is shared only with confirmed guests.</p>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Area / Locality *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Sector 11 or Model Town"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Street Address *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nearby Landmark</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Near Club Road / Opp. City Park"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS & RULES */}
              {currentStep === 3 && (
                <div className="wizard-step-body">
                  <h3 className="step-heading">Details, Rules & Curfew</h3>
                  <p className="step-caption">Help event seekers understand your space's ambiance and clear guidelines.</p>

                  <div className="form-group">
                    <label className="form-label">Tagline (Short Summary)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Space Description</label>
                    <textarea 
                      rows="3"
                      className="form-control" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Outdoor Music Curfew Time *</label>
                      <select 
                        className="form-control"
                        value={noiseCurfew}
                        onChange={(e) => setNoiseCurfew(e.target.value)}
                      >
                        <option value="10:00 PM">10:00 PM</option>
                        <option value="10:30 PM">10:30 PM (Recommended by Civic Law)</option>
                        <option value="11:00 PM">11:00 PM</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Refundable Security Deposit (₹)</label>
                      <input 
                        type="number"
                        className="form-control" 
                        value={securityDeposit}
                        onChange={(e) => setSecurityDeposit(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Permitted Celebrations</label>
                    <div className="checkbox-pills-wrap">
                      {availableEventTypes.map((ev, i) => (
                        <label key={i} className="checkbox-pill">
                          <input 
                            type="checkbox" 
                            checked={permittedEvents.includes(ev)}
                            onChange={() => toggleEventType(ev)}
                          />
                          <span>{ev}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: AMENITIES & PHOTOS */}
              {currentStep === 4 && (
                <div className="wizard-step-body">
                  <h3 className="step-heading">Amenities & High-Res Photography</h3>
                  <p className="step-caption">High quality images generate 4x more confirmed bookings.</p>

                  <div className="form-group">
                    <label className="form-label">Select All Available Amenities</label>
                    <div className="checkbox-pills-wrap">
                      {availableAmenities.map((a, i) => (
                        <label key={i} className="checkbox-pill">
                          <input 
                            type="checkbox" 
                            checked={amenities.includes(a)}
                            onChange={() => toggleAmenity(a)}
                          />
                          <span>{a}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Cover Photo URL *</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={photoUrl1}
                      onChange={(e) => setPhotoUrl1(e.target.value)}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Gallery Photo 2 URL</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        value={photoUrl2}
                        onChange={(e) => setPhotoUrl2(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gallery Photo 3 URL</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        value={photoUrl3}
                        onChange={(e) => setPhotoUrl3(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Photo Preview Strip */}
                  <div className="photo-preview-strip">
                    <img src={photoUrl1} alt="Cover Preview" className="preview-thumb" />
                    {photoUrl2 && <img src={photoUrl2} alt="Gallery 2" className="preview-thumb" />}
                    {photoUrl3 && <img src={photoUrl3} alt="Gallery 3" className="preview-thumb" />}
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUBMIT */}
              {currentStep === 5 && (
                <div className="wizard-step-body">
                  <h3 className="step-heading">Review & Confirm Listing</h3>
                  <p className="step-caption">Double check your listing details before submitting for quality verification.</p>

                  <div className="listing-review-preview card p-4 mb-4">
                    <div className="flex gap-4">
                      <img src={photoUrl1} alt="Preview" style={{ width: 120, height: 90, borderRadius: 10, objectFit: 'cover' }} />
                      <div>
                        <span className="badge badge-burgundy">{category}</span>
                        <h4 style={{ margin: '4px 0' }}>{spaceName || 'The Grand Villa'}</h4>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          <MapPin size={12} style={{ display: 'inline' }} /> {area}, {city} • Up to {capacity} Guests
                        </div>
                        <div className="mt-2" style={{ fontWeight: 700, color: '#70152F' }}>
                          ₹{Number(price).toLocaleString('en-IN')} / 4 hours
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-4 mb-4" style={{ background: '#FFF0E8', border: '1px solid #F9EFE9' }}>
                    <div className="flex items-start gap-2">
                      <ShieldCheck size={18} color="#70152F" style={{ marginTop: 2, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.85rem', margin: 0 }}>
                        By submitting, you agree to comply with PartyPlace Host Standards, municipal noise regulations ({noiseCurfew} music cutoff), and our 10% platform commission policy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Action Buttons */}
              <div className="wizard-footer-buttons">
                {currentStep > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={handlePrev}>
                    <ArrowLeft size={16} /> Back
                  </button>
                )}

                {currentStep < 5 ? (
                  <button type="button" className="btn btn-primary ml-auto" onClick={handleNext}>
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-primary ml-auto"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Space...' : 'Submit Listing for Verification'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
