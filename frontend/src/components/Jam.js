import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Jam = ({ destination, label, color, size, x, y, highlight, bubbleId }) => {
  const navigate = useNavigate();

    // Read from localStorage when the component mounts
    const [spotifyUserId] = useState(() => {
      return localStorage.getItem('spotifyUserId') || '';
    });

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("Jam clicked, bubbleId:", bubbleId); // Debug: check if bubbleId is defined
    
    // Always navigate, regardless of userId
    const navigateToDestination = () => {
      console.log('Navigating to:', destination);
      navigate(destination);
    };

    // If we don't have both bubbleId and spotifyUserId, just navigate without joining
    if (!bubbleId || !spotifyUserId) {
      console.log("Either bubbleId or spotifyUserId is missing, navigating without joining bubble");
      navigateToDestination();
      return;
    }
    
    try {
      // PUT request to join the bubble
      const response = await axios.put(`http://localhost:3001/bubbles/${bubbleId}/join`, { userId: spotifyUserId });
      console.log('Joined bubble:', response.data);
      // Navigate to the destination route for this bubble
      navigateToDestination();
    } catch (error) {
      console.error('Error joining bubble:', error.response?.data || error.message);
      // Still navigate even if joining the bubble fails
      navigateToDestination();
    }
  };

  return (
    <div
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
        zIndex: highlight ? 10 : 1,
        animation: highlight ? 'pulseHighlight 2s' : 'none',
        cursor: 'pointer'
      }}
      onClick={handleClick}
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
    </div>
  );
};

export default Jam;