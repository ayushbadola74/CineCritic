import React from 'react';

const Loader = ({ count = 5 }) => {
  return (
    <div className="carousel-row">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-card"></div>
      ))}
    </div>
  );
};

export default Loader;
