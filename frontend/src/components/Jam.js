import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Jam({
  destination,   // where to navigate on successful join
  label,         // bubble text
  color,         // bubble background color
  size,          // bubble diameter
  x, y,          // bubble coordinates
  highlight,     // whether to apply highlight styles
  bubbleId       // ID used by backend for join
}) {
  const navigate = useNavigate();

  // grab spotifyUserId once on mount (or empty string if not set)
  const [spotifyUserId] = useState(
    () => localStorage.getItem('spotifyUserId') || ''
  );

  // state to control whether the login‐prompt overlay is showing
  const [loginPrompt, setLoginPrompt] = useState(false);

  // handle clicks on the bubble
  const handleClick = async (e) => {
    e.preventDefault();

    // 1) If no Spotify ID, show overlay and bail
    if (!spotifyUserId) {
      setLoginPrompt(true);
      return;
    }

    // 2) If somehow bubbleId is missing, log an error and bail
    if (!bubbleId) {
      console.error('No bubbleId provided');
      return;
    }

    // 3) Otherwise, attempt to join via backend
    try {
      await axios.put(
        `http://localhost:3001/bubbles/${bubbleId}/join`,
        { userId: spotifyUserId }
      );
      // 4) On success, navigate to the bubble’s page
      navigate(destination);
    } catch (error) {
      console.error(
        'Error joining bubble:',
        error.response?.data || error.message
      );
      // still navigate even if join fails
      navigate(destination);
    }
  };

  return (
    <>
      {/* —————— Bubble Circle —————— */}
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
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          zIndex: highlight ? 10 : 1,
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

      {/* —————— Login Prompt Overlay —————— */}
      {loginPrompt && (
        <div className="login-prompt-overlay">
          <div className="login-prompt">
            {/* Instruction */}
            <p>Please log in with Spotify to join a Jam.</p>

            {/* Go to login page */}
            <button
              className="spotify-btn"
              onClick={() => {
                setLoginPrompt(false);
                navigate('/login');
              }}
            >
              Log in
            </button>

            {/* Simply close the prompt */}
            <button
              className="dismiss-btn"
              onClick={() => setLoginPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
