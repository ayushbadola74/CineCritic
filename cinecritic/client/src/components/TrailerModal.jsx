import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, trailerUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose} title="Close Trailer">
          <X size={20} />
        </button>
        <div className="video-aspect-wrapper">
          <iframe
            src={trailerUrl ? `${trailerUrl}?autoplay=1` : ''}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
