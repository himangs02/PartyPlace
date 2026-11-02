import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  PartyPopper,
  ArrowUpDown
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

export default function ExploreView({ 
  spaces = [], 
  onSelectSpace, 
  initialFilters = {}, 
  wishlist = new Set(), 
  onToggleWishlist 
}) {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'all');
  const [location, setLocation] = useState(initialFilters.location || 'all');
  const [minGuests, setMinGuests] = useState(initialFilters.minGuests || '0');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '20000');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('recommended');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = ['All', 'Villa', 'Terrace', 'Farmhouse', 'Studio', 'Private Hall', 'Private Garden'];
  const allAmenitiesList = [
    'Swimming Pool', 
    'Lawn / Garden', 
    'Sound System', 
    'Air Conditioning', 
    'Wi-Fi', 
    'Dedicated Parking', 
    'Catering Area', 
    'BBQ Grill', 
    'Terrace View', 
    'Fairy Lighting'
  ];

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setLocation('all');
    setMinGuests('0');
    setMaxPrice('20000');
    setVerifiedOnly(false);
    setSelectedAmenities([]);
    setSort('recommended');
  };

  // Filter & Sort Logic
  const filteredSpaces = useMemo(() => {
    return spaces.filter(space => {
      // Search text
      if (search) {
        const q = search.toLowerCase();
        const matchName = space.name.toLowerCase().includes(q);
        const matchArea = space.area.toLowerCase().includes(q);
        const matchCity = space.city.toLowerCase().includes(q);
        const matchDesc = space.description.toLowerCase().includes(q);
        if (!matchName && !matchArea && !matchCity && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== 'all' && selectedCategory !== 'All') {
        if (space.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Location
      if (location !== 'all') {
        if (!space.area.toLowerCase().includes(location.toLowerCase()) && !space.city.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }
      }

      // Capacity
      if (minGuests && Number(minGuests) > 0) {
        if (space.capacity < Number(minGuests)) return false;
      }

      // Price
      if (maxPrice && Number(maxPrice) > 0) {
        if (space.price > Number(maxPrice)) return false;
      }

      // Verified
      if (verifiedOnly && !space.verified) {
        return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a => space.amenities?.includes(a));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'capacity') return b.capacity - a.capacity;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [spaces, search, selectedCategory, location, minGuests, maxPrice, verifiedOnly, selectedAmenities, sort]);

  return (
    <div className="explore-page-root">
      {/* Top Header Bar */}
      <section className="explore-header-section">
        <div className="container">
          <div className="explore-title-row">
            <div>
              <h1 className="explore-title">Explore Event Spaces</h1>
              <p className="explore-subtitle">
                Find the perfect private space for your next intimate celebration
              </p>
            </div>
            <div className="explore-stats-pill">
              <PartyPopper size={16} color="#70152F" />
              <span><strong>{filteredSpaces.length} spaces</strong> available in Panipat & NCR</span>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="explore-filter-bar card">
            <div className="filter-bar-grid">
              {/* Search text */}
              <div className="filter-cell">
                <Search size={16} color="#70152F" />
                <input 
                  type="text" 
                  placeholder="Search space, area..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="filter-input-plain"
                />
              </div>

              {/* Location selector */}
              <div className="filter-cell">
                <MapPin size={16} color="#70152F" />
                <select 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="filter-select-plain"
                >
                  <option value="all">All Locations (Panipat)</option>
                  <option value="Sector 11">Sector 11</option>
                  <option value="Model Town">Model Town</option>
                  <option value="Samalkha Road">Samalkha Road</option>
                  <option value="GT Road">GT Road</option>
                  <option value="Sector 12">Sector 12</option>
                  <option value="Ansals Sushant City">Ansals Sushant City</option>
                </select>
              </div>

              {/* Guests */}
              <div className="filter-cell">
                <Users size={16} color="#70152F" />
                <select 
                  value={minGuests} 
                  onChange={(e) => setMinGuests(e.target.value)}
                  className="filter-select-plain"
                >
                  <option value="0">Any Guests (15–30)</option>
                  <option value="20">Min 20 Guests</option>
                  <option value="25">Min 25 Guests</option>
                  <option value="30">30 Guests Max</option>
                </select>
              </div>

              {/* Budget slider/preset */}
              <div className="filter-cell">
                <IndianRupee size={16} color="#70152F" />
                <select 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="filter-select-plain"
                >
                  <option value="4000">Under ₹4,000</option>
                  <option value="6000">Under ₹6,000</option>
                  <option value="10000">Under ₹10,000</option>
                  <option value="20000">Any Budget (Up to ₹20,000)</option>
                </select>
              </div>

              {/* Filter drawer toggle button */}
              <button 
                className={`btn btn-secondary filter-toggle-btn ${drawerOpen || selectedAmenities.length > 0 || verifiedOnly ? 'active' : ''}`}
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <SlidersHorizontal size={16} />
                <span>Filters {selectedAmenities.length > 0 ? `(${selectedAmenities.length})` : ''}</span>
              </button>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="category-chips-row">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className={`category-chip ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: Filter Drawer + Results Grid */}
      <section className="section-padding-bottom">
        <div className="container">
          {/* Controls subheader */}
          <div className="results-control-bar">
            <div className="results-count">
              <strong>{filteredSpaces.length}</strong> spaces found
              {selectedCategory !== 'all' && <span className="active-tag">in {selectedCategory}</span>}
            </div>

            <div className="sort-control-wrap">
              <label className="sort-label">
                <ArrowUpDown size={14} /> Sort by:
              </label>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="sort-select"
              >
                <option value="recommended">Recommended & Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="capacity">Guest Capacity</option>
              </select>
            </div>
          </div>

          {/* Expanded Filter Drawer */}
          {drawerOpen && (
            <div className="filter-drawer-box card">
              <div className="drawer-header">
                <h4>Refine Search Filters</h4>
                <button className="btn-icon" onClick={() => setDrawerOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="drawer-body-grid">
                {/* Max Price Slider */}
                <div className="drawer-col">
                  <label className="drawer-label">
                    Max Price: <strong>₹{Number(maxPrice).toLocaleString('en-IN')}</strong>
                  </label>
                  <input 
                    type="range" 
                    min="2000" 
                    max="20000" 
                    step="500" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="price-slider"
                  />
                  <div className="slider-range-labels">
                    <span>₹2,000</span>
                    <span>₹20,000</span>
                  </div>
                </div>

                {/* Verified Toggle */}
                <div className="drawer-col">
                  <label className="drawer-label">Verification Status</label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={verifiedOnly} 
                      onChange={(e) => setVerifiedOnly(e.target.checked)} 
                    />
                    <ShieldCheck size={16} color="#059669" />
                    <span>Show 100% Quality-Inspected Spaces Only</span>
                  </label>
                </div>

                {/* Amenities Checkboxes */}
                <div className="drawer-col full-width">
                  <label className="drawer-label">Must-Have Amenities</label>
                  <div className="amenities-checkbox-grid">
                    {allAmenitiesList.map((a, idx) => (
                      <label key={idx} className="checkbox-pill">
                        <input 
                          type="checkbox" 
                          checked={selectedAmenities.includes(a)}
                          onChange={() => toggleAmenity(a)}
                        />
                        <span>{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button className="btn btn-ghost" onClick={handleResetFilters}>
                  <RotateCcw size={15} /> Reset All Filters
                </button>
                <button className="btn btn-primary" onClick={() => setDrawerOpen(false)}>
                  Apply Filters ({filteredSpaces.length} Matches)
                </button>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          {filteredSpaces.length > 0 ? (
            <div className="properties-grid">
              {filteredSpaces.map(space => (
                <PropertyCard 
                  key={space.id} 
                  space={space} 
                  onSelectSpace={onSelectSpace}
                  isWishlisted={wishlist.has(space.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="empty-state-card card">
              <div className="empty-icon-wrap">
                <Search size={36} color="#70152F" />
              </div>
              <h3 className="empty-title">No spaces match your criteria</h3>
              <p className="empty-desc">
                Try widening your budget, adjusting guest capacity, or clearing selected amenities.
              </p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                <RotateCcw size={16} /> Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
