import React from 'react';
import { Star, Heart, Users, MapPin, ShieldCheck } from 'lucide-react';

export default function PropertyCard({ 
  space, 
  onSelectSpace, 
  isWishlisted = false, 
  onToggleWishlist 
}) {
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(space.id);
    }
  };

  return (
    <div 
      className="property-card card" 
      onClick={() => onSelectSpace(space.id)}
    >
      <div className="property-image-wrap">
        <img 
          src={space.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80'} 
          alt={space.name}
          className="property-cover-img"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="property-badges-overlay">
          {space.verified && (
            <span className="badge badge-verified">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
          <span className="badge badge-burgundy">
            {space.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button 
          className={`property-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? '#D94D83' : 'none'} color={isWishlisted ? '#D94D83' : '#FFFFFF'} />
        </button>
      </div>

      <div className="property-info-body">
        {/* Rating and Reviews */}
        <div className="property-rating-row">
          <div className="property-rating">
            <Star size={14} className="star-icon" fill="#F59E0B" color="#F59E0B" />
            <span className="rating-num">{space.rating}</span>
            <span className="reviews-count">({space.reviewCount})</span>
          </div>
          <div className="property-capacity">
            <Users size={13} />
            <span>Up to {space.capacity}</span>
          </div>
        </div>

        {/* Name */}
        <h4 className="property-title">{space.name}</h4>

        {/* Location */}
        <div className="property-location">
          <MapPin size={13} />
          <span>{space.area}, {space.city}</span>
        </div>

        {/* Price and Duration */}
        <div className="property-price-row">
          <div className="price-tag">
            <span className="price-currency">₹</span>
            <span className="price-amount">{space.price?.toLocaleString('en-IN')}</span>
            <span className="price-duration">/ {space.durationHours || 4} hrs</span>
          </div>
          <button className="btn btn-sm btn-secondary">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
