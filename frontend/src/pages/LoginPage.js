import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    const popup = window.open(
      'http://localhost:3001/auth/login',
      'Spotify Login',
      'width=500,height=600'
    );
    window.addEventListener('message', event => {
      if (event.origin !== 'http://localhost:3001') return;
      const { accessToken, refreshToken, expiresAt, spotifyId, displayName } = event.data;
      localStorage.setItem('spotifyAccessToken', accessToken);
      localStorage.setItem('spotifyRefreshToken', refreshToken);
      localStorage.setItem('spotifyExpiresAt', expiresAt);
      localStorage.setItem('spotifyUserId', spotifyId);
      localStorage.setItem('spotifyDisplayName', displayName);
      navigate('/');
    });
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">Connect Your Music</h1>
      <button className="btn spotify-btn" onClick={handleLogin}>
        Continue with Spotify
      </button>
      <button className="btn apple-btn" onClick={() => console.log('Apple Music login clicked')}>
        Continue with Apple Music
      </button>
      <button className="btn amazon-btn" onClick={() => console.log('Amazon Music login clicked')}>
        Continue with Amazon Music
      </button>
      <button className="btn back-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
}
