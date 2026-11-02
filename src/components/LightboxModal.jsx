import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ images = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const next = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <div className="modal-overlay lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="lightbox-main-view">
          <button className="lightbox-nav-btn prev" onClick={prev}>
            <ChevronLeft size={32} />
          </button>
          
          <img 
            src={images[currentIndex]} 
            alt={`Space photo ${currentIndex + 1}`} 
            className="lightbox-active-img"
          />

          <button className="lightbox-nav-btn next" onClick={next}>
            <ChevronRight size={32} />
          </button>
        </div>

        <div className="lightbox-footer">
          <div className="lightbox-counter">
            Photo {currentIndex + 1} of {images.length}
          </div>
          <div className="lightbox-thumbnails">
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="thumb" 
                className={`lightbox-thumb ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
