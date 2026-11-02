import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, ShieldCheck, HelpCircle } from 'lucide-react';

export default function FAQModal({ onClose }) {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "What types of events are permitted on PartyPlace?",
      a: "PartyPlace is exclusively curated for intimate, permitted private gatherings such as birthday celebrations, farewell parties, small family functions, anniversaries, private dinners, acoustic get-togethers, and photoshoots. We strictly prohibit commercial ticketed raves, loud public events, or disruptive parties in residential areas."
    },
    {
      q: "What is the typical guest capacity limit?",
      a: "Most listed spaces cater to private groups of 15 to 30 guests. This ensures comfort, safety, zero neighborhood disturbance, and high host satisfaction."
    },
    {
      q: "What are the rules regarding outdoor music and noise restrictions?",
      a: "In compliance with municipal civic noise laws, all outdoor amplified music must conclude by 10:30 PM. Indoor ambient music at pleasant levels is permitted in enclosed air-conditioned spaces."
    },
    {
      q: "How does the refundable security deposit work?",
      a: "A standard refundable security deposit (typically ₹1,000–₹3,000 depending on the property) is held to ensure spaces are kept clean and undamaged. It is promptly returned within 2 hours of checkout following host inspection."
    },
    {
      q: "What is the cancellation and refund policy?",
      a: "Full refund is available for cancellations made up to 24 hours prior to the event start time. Cancellations within 24 hours are subject to a 50% host reservation hold to compensate for blocked calendar dates."
    },
    {
      q: "How are hosts and properties verified?",
      a: "Every venue undergoes a mandatory physical or video inspection by the PartyPlace quality team. We verify property ownership/lease rights, basic safety amenities (fire extinguishers, first aid, CCTV in exterior perimeters), parking, and air conditioning before activating the listing."
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content faq-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} color="#70152F" />
            <h3 style={{ fontSize: '1.25rem' }}>Frequently Asked Questions</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body faq-body">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button 
                className="faq-question-btn"
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              >
                <span>{faq.q}</span>
                {openIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openIdx === idx && (
                <div className="faq-answer-content">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
