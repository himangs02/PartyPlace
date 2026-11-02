import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  PartyPopper, 
  ArrowRight, 
  Star, 
  Music, 
  Smile, 
  Clock, 
  Home, 
  Award 
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

export default function LandingView({ 
  spaces = [], 
  onSelectSpace, 
  onNavigate, 
  wishlist = new Set(), 
  onToggleWishlist 
}) {
  const [searchLocation, setSearchLocation] = useState('Panipat');
  const [searchDate, setSearchDate] = useState('2026-09-26');
  const [searchGuests, setSearchGuests] = useState('25');
  const [searchBudget, setSearchBudget] = useState('10000');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('explore', {
      location: searchLocation,
      date: searchDate,
      minGuests: searchGuests,
      maxPrice: searchBudget
    });
  };

  const categories = [
    {
      name: 'Villas',
      category: 'Villa',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
      count: '18 Spaces'
    },
    {
      name: 'Farmhouses',
      category: 'Farmhouse',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80',
      count: '12 Spaces'
    },
    {
      name: 'Terraces',
      category: 'Terrace',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      count: '24 Spaces'
    },
    {
      name: 'Private Halls',
      category: 'Private Hall',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
      count: '15 Spaces'
    },
    {
      name: 'Studios',
      category: 'Studio',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      count: '10 Spaces'
    },
    {
      name: 'Private Gardens',
      category: 'Private Garden',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
      count: '8 Spaces'
    }
  ];

  const featuredSpaces = spaces.slice(0, 4);

  const testimonials = [
    {
      quote: "PartyPlace made my 25th birthday unforgettable. We booked The Palm Villa — pristine pool, amazing music setup, and zero interference. Safe, verified, and completely private!",
      name: "Akanksha Verma",
      role: "Guest • Birthday Celebration",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      quote: "Listing my terrace on PartyPlace has been fantastic. Guests are verified, capacity is capped at 25 people, and music ends strictly at 10:30 PM. I earn ₹45,000 extra per month without hassle.",
      name: "Rohan Mehta",
      role: "Property Host • Skyline Terrace",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      quote: "We hosted an intimate college farewell at The Studio Space. Sound system and lighting were stellar. Best platform for small gatherings in Panipat!",
      name: "Harsh Goel",
      role: "Guest • College Farewell",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      rating: 5
    }
  ];

  return (
    <div className="landing-page-root">
      {/* LUXURY HERO BANNER SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-banner-card">
            <div className="hero-banner-media">
              <img 
                src="/hero-bg.jpg" 
                alt="PartyPlace luxury private celebration venue" 
                className="hero-banner-img" 
              />
              <div className="hero-banner-overlay" />
            </div>

            <div className="hero-banner-content">
              <div className="hero-pill-badge">
                <PartyPopper size={14} className="hero-badge-icon" />
                <span>Private Event Spaces for 15–30 Guests</span>
              </div>
              <h1 className="hero-title">
                Your Party. <br />
                Your Place. <br />
                <span className="hero-highlight">Your Choice.</span>
              </h1>
              <p className="hero-subtitle">
                Discover and book verified private spaces for birthdays, get-togethers, farewells, family functions, and intimate celebrations.
              </p>

              {/* Functional Search Component */}
              <div className="hero-search-card">
                <form onSubmit={handleSearchSubmit} className="search-form-grid">
                  {/* Location */}
                  <div className="search-field">
                    <label className="search-label">
                      <MapPin size={15} color="#70152F" /> Location
                    </label>
                    <input 
                      type="text" 
                      value={searchLocation} 
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Enter city or area"
                      className="search-input"
                    />
                  </div>

                  <div className="search-divider" />

                  {/* Date */}
                  <div className="search-field">
                    <label className="search-label">
                      <Calendar size={15} color="#70152F" /> Date
                    </label>
                    <input 
                      type="date" 
                      value={searchDate} 
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="search-divider" />

                  {/* Guests */}
                  <div className="search-field">
                    <label className="search-label">
                      <Users size={15} color="#70152F" /> Guests
                    </label>
                    <select 
                      value={searchGuests} 
                      onChange={(e) => setSearchGuests(e.target.value)}
                      className="search-input"
                    >
                      <option value="15">15 Guests</option>
                      <option value="20">20 Guests</option>
                      <option value="25">25 Guests</option>
                      <option value="30">30 Guests (Max)</option>
                    </select>
                  </div>

                  <div className="search-divider" />

                  {/* Budget */}
                  <div className="search-field">
                    <label className="search-label">
                      <IndianRupee size={15} color="#70152F" /> Budget
                    </label>
                    <select 
                      value={searchBudget} 
                      onChange={(e) => setSearchBudget(e.target.value)}
                      className="search-input"
                    >
                      <option value="5000">Up to ₹5,000</option>
                      <option value="10000">Up to ₹10,000</option>
                      <option value="20000">Up to ₹20,000</option>
                      <option value="50000">Any Budget</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button type="submit" className="btn btn-primary search-submit-btn">
                    <Search size={18} />
                    <span>Search Spaces</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* 4 Trust Highlights Bar */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <div className="trust-icon-wrap">
                <ShieldCheck size={22} color="#70152F" />
              </div>
              <div className="trust-text">
                <strong>Verified Spaces</strong>
                <span>Trusted & quality-checked</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-wrap">
                <CheckCircle2 size={22} color="#70152F" />
              </div>
              <div className="trust-text">
                <strong>Safe & Compliant</strong>
                <span>Clear rules & host approval</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-wrap">
                <Clock size={22} color="#70152F" />
              </div>
              <div className="trust-text">
                <strong>Flexible & Affordable</strong>
                <span>Perfect for small gatherings</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-wrap">
                <Home size={22} color="#70152F" />
              </div>
              <div className="trust-text">
                <strong>Wide Variety</strong>
                <span>Houses, villas, terraces & more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="section-padding bg-warm">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Curated Collections</span>
              <h2 className="section-title">Explore by Space Category</h2>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('explore')}
            >
              View All Spaces <ArrowRight size={16} />
            </button>
          </div>

          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="category-card"
                onClick={() => onNavigate('explore', { category: cat.category })}
              >
                <div className="category-img-wrap">
                  <img src={cat.image} alt={cat.name} className="category-img" />
                  <div className="category-overlay" />
                </div>
                <div className="category-content">
                  <h3 className="category-name">{cat.name}</h3>
                  <span className="category-count">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SPACES */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Top Rated Venues</span>
              <h2 className="section-title">Featured Private Spaces in Panipat</h2>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('explore')}
            >
              Explore All Spaces <ArrowRight size={16} />
            </button>
          </div>

          <div className="properties-grid">
            {featuredSpaces.map(space => (
              <PropertyCard 
                key={space.id} 
                space={space} 
                onSelectSpace={onSelectSpace}
                isWishlisted={wishlist.has(space.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-padding bg-cream">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Simple & Transparent</span>
            <h2 className="section-title">How PartyPlace Works</h2>
            <p className="section-subtitle">
              Booking your private celebration space takes less than 2 minutes.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="step-card card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap">
                <Search size={28} color="#70152F" />
              </div>
              <h3 className="step-title">Discover Your Perfect Space</h3>
              <p className="step-desc">
                Browse verified villas, terraces, and farmhouses filtered by guest capacity, budget, permitted celebrations, and amenities.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap">
                <Calendar size={28} color="#D94D83" />
              </div>
              <h3 className="step-title">Book Your Preferred Date</h3>
              <p className="step-desc">
                Choose your convenient 4-hour or evening slot. Pay securely with UPI or card with instant host confirmation and clear house rules.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap">
                <PartyPopper size={28} color="#059669" />
              </div>
              <h3 className="step-title">Celebrate Your Special Moments</h3>
              <p className="step-desc">
                Arrive with your digital QR entry pass. Enjoy total privacy with loved ones in a quality-checked, safe venue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTYPLACE */}
      <section id="why-us" className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Peace of Mind Guarantee</span>
            <h2 className="section-title">Why Choose PartyPlace?</h2>
            <p className="section-subtitle">
              We provide verified technology infrastructure for safe, legal, and memorable private celebrations.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon"><ShieldCheck size={24} color="#70152F" /></div>
              <h4>100% Verified Spaces</h4>
              <p>Every listed venue is personally inspected for safety, cleanliness, and authentic representation.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><Award size={24} color="#70152F" /></div>
              <h4>Safe & Compliant</h4>
              <p>Clear noise curfews (10:30 PM outdoor cutoff), ID checks, and host approval maintain harmony and safety.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><Users size={24} color="#70152F" /></div>
              <h4>Targeted for 15–30 Guests</h4>
              <p>Tailored specifically for intimate gatherings, avoiding the overhead of massive commercial banquet halls.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><Music size={24} color="#70152F" /></div>
              <h4>Party-Ready Amenities</h4>
              <p>Sound systems, mood lighting, poolside seating, catering setups, and power backup ready upon arrival.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><IndianRupee size={24} color="#70152F" /></div>
              <h4>Transparent Pricing</h4>
              <p>No hidden charges. Clear 10% platform fee, simple hourly packages, and refundable security deposit.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><Smile size={24} color="#70152F" /></div>
              <h4>Dedicated Support</h4>
              <p>Direct assistance via chat and phone from booking confirmation until the event concludes smoothly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BECOME A HOST CTA BANNER */}
      <section className="container section-padding-bottom">
        <div className="host-cta-banner card">
          <div className="host-cta-content">
            <span className="badge badge-rose">Host Opportunity</span>
            <h2 className="host-cta-title">
              Have a beautiful space? <br />Turn unused time into income.
            </h2>
            <p className="host-cta-desc">
              List your villa, terrace, farmhouse, or studio on PartyPlace. Reach verified event seekers, set your own rules, and earn guaranteed income with only a 10% platform commission.
            </p>
            <div className="host-cta-bullets">
              <span>✓ You set the house rules & guest limits</span>
              <span>✓ Guaranteed host payouts within 24 hours</span>
              <span>✓ Free professional listing setup</span>
            </div>
            <button 
              className="btn btn-lg btn-cream"
              onClick={() => onNavigate('list-space')}
            >
              List Your Space Today <ArrowRight size={18} />
            </button>
          </div>
          <div className="host-cta-image-col">
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80" 
              alt="List your space on PartyPlace" 
              className="host-cta-img"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-warm">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Real Stories</span>
            <h2 className="section-title">Loved by Hosts & Event Seekers</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card card">
                <div className="stars-row">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="author-avatar" />
                  <div>
                    <h5 className="author-name">{t.name}</h5>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
