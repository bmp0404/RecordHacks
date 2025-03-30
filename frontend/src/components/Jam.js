import React from 'react';
import { Link } from 'react-router-dom';

const Jam = ({ destination, label, color, size, x, y, highlight }) => {
  return (
    <Link 
      to={destination}
      className={`jam-component ${highlight ? 'jam-highlight' : ''}`}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: `${Math.min(size / 8, 20)}px`,
        textAlign: 'center',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        transition: 'transform 0.3s, box-shadow 0.3s, filter 0.5s',
        zIndex: highlight ? 10 : 1, // Higher z-index when highlighted
        animation: highlight ? 'pulseHighlight 2s' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
      }}
    >
      {label}
    </Link>
  );
};

export default Jam;