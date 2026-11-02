import React from 'react';
import { Sparkles, ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer({ onNavigate, onOpenFAQ }) {
  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Top Grid */}
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="nav-brand" onClick={() => onNavigate('landing')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-wrap">
                <Sparkles size={20} color="#FFFFFF" />
              </div>
              <span className="brand-name" style={{ color: '#FFFFFF' }}>
                Party<span style={{ color: '#D94D83' }}>Place</span>
              </span>
            </div>
            <p className="footer-tagline">
              Your Party. Your Place. Your Choice.
            </p>
            <p className="footer-desc">
              India's premier technology marketplace for discovering and booking verified private event venues for birthdays, farewells, family celebrations, and small gatherings.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheck size={16} color="#10B981" />
              <span>100% Quality-Inspected Spaces & Clear Noise Policies</span>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('explore', { category: 'Villa' })}>Luxury Villas</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'Terrace' })}>Rooftop Terraces</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'Farmhouse' })}>Private Farmhouses</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'Studio' })}>Event Studios</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'Private Garden' })}>Private Gardens</button></li>
            </ul>
          </div>

          {/* Property Owners */}
          <div className="footer-col">
            <h4 className="footer-col-title">For Hosts</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('list-space')}>List Your Space</button></li>
              <li><button onClick={onOpenFAQ}>Host Guidelines & Rules</button></li>
              <li><button onClick={onOpenFAQ}>Pricing & 10% Commission</button></li>
              <li><button onClick={onOpenFAQ}>Host Safety & Deposits</button></li>
              <li><button onClick={() => onNavigate('host-dashboard')}>Host Portal</button></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Trust & Support</h4>
            <ul className="footer-links">
              <li><button onClick={onOpenFAQ}>Frequently Asked Questions</button></li>
              <li><button onClick={onOpenFAQ}>Cancellation & Refunds</button></li>
              <li><button onClick={onOpenFAQ}>Noise Curfew Regulations</button></li>
              <li><button onClick={onOpenFAQ}>Terms of Service</button></li>
              <li><button onClick={onOpenFAQ}>Privacy Policy</button></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 PartyPlace Marketplace Technologies Pvt. Ltd. Made with <Heart size={14} fill="#D94D83" color="#D94D83" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> for unforgettable celebrations.
          </div>
          <div className="footer-contact-pills">
            <span className="contact-pill"><Mail size={13} /> support@partyplace.in</span>
            <span className="contact-pill"><Phone size={13} /> +91 98765 43210</span>
            <span className="contact-pill"><MapPin size={13} /> Panipat & Delhi-NCR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
