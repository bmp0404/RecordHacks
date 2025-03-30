import React from 'react';
import { useNavigate } from 'react-router-dom';

// Renamed from Bubble to Jam
const Jam = ({ destination, label, color, size = 100, x, y }) => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate(destination)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.18}px`,
        backgroundColor: color || '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        margin: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0',
        position: x !== undefined && y !== undefined ? 'absolute' : 'static',
        left: x !== undefined ? `${x}px` : 'auto',
        top: y !== undefined ? `${y}px` : 'auto'
      }}
      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
    >
      {label}
    </button>
  );
};

export default Jam;