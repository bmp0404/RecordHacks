import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getValidAccessToken } from '../helpers/spotifyAuth';
import SpotifyEmbed    from '../components/SpotifyEmbed';
import TrackSearchForm from '../components/TrackSearchForm';
import ChatBox         from '../components/Chatbox';
import TrackDisplay from '../components/TrackDisplay';

export default function DynamicPage({ title, bubbleId }) {
  const navigate = useNavigate();
  const [spotifyUserId] = useState(() => localStorage.getItem('spotifyUserId') || '');
  const [accessToken]   = useState(() => localStorage.getItem('spotifyAccessToken') || '');
  const [currentTrackInfo, setCurrentTrackInfo] = useState({ uri:'', name:'', artist:'', albumArt:'' });
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Auto-play on mount if a track exists
  useEffect(() => {
    async function autoPlay() {
      const token = await getValidAccessToken();
      if (!token || !bubbleId) return;
      try {
        const { data: bubble } = await axios.get(`http://localhost:3001/bubbles/${bubbleId}`);
        if (bubble.currentTrack) {
          setCurrentTrackInfo({
            uri: bubble.currentTrack,
            name: bubble.currentTrackName,
            artist: bubble.currentTrackArtist,
            albumArt: bubble.currentTrackPhoto
          });
          await axios.get('http://localhost:3001/player/play', {
            params: { accessToken: token, trackId: bubble.currentTrack }
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    autoPlay();
  }, [bubbleId, accessToken]);

  const handleLeaveBubble = async () => {
    console.log("handleLeaveBubble triggered");
    console.log("bubbleId:", bubbleId, "spotifyUserId:", spotifyUserId);
    if (!bubbleId || !spotifyUserId) return navigate('/');
    try {
      await axios.put(`http://localhost:3001/bubbles/${bubbleId}/leave`, { userId: spotifyUserId });
    } catch (err) {
      console.error(err);
    } finally {
      navigate('/');
    }
  };

  const handleTrackSearch = async query => {
    if (!query) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error('No token');
      const { data } = await axios.get('http://localhost:3001/player/search', {
        params: { q: query, accessToken: token }
      });
      const topTrack = data.tracks && data.tracks[0];
      if (!topTrack) {
        setSearchError('No songs found');
      } else {
        if (bubbleId) {
          await axios.put(`http://localhost:3001/bubbles/${bubbleId}/song`, {
            trackId: topTrack.uri,
            name: topTrack.name,
            artist: topTrack.artist,
            albumArt: topTrack.albumArt
          });
        }
        setCurrentTrackInfo({
          uri: topTrack.uri,
          name: topTrack.name,
          artist: topTrack.artist,
          albumArt: topTrack.albumArt
        });
        await axios.get('http://localhost:3001/player/play', {
          params: { accessToken: token, trackId: topTrack.uri }
        });
      }
    } catch (err) {
      console.error(err);
      setSearchError('Error searching or playing track');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="dynamic-page" style={{ 
      padding: '50px 20px 40px', // top, horizontal, bottom
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #2196F3, #0D47A1)',
      minHeight: '100vh',
      boxSizing: 'border-box',
    }}>
      {/* Title */}
      <h1 style={{ // to change styling, go to App.css, and change the .dynamic-page h1 class
        fontSize: '2.5rem',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '1rem',
        fontFamily: '"Segoe UI", sans-serif'
    }}>
        {title || 'Untitled Jam'}
      </h1>
  
      {/* Main Content Layout */}
      <div className="content-container" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap',
      }}>
        {/* Left column: Embed + Search */}
        <div className="left-col" style={{ flex: 1, minWidth: '300px', maxWidth: '500px' }}>
        <TrackDisplay name={currentTrackInfo.name}artist={currentTrackInfo.artist}albumArt={currentTrackInfo.albumArt}
/>
          <TrackSearchForm onSearch={handleTrackSearch} error={searchError} busy={isSearching} />
        </div>
  
        {/* Right column: Chat */}
        <div className="right-col" style={{ flex: 1, minWidth: '300px', maxWidth: '500px' }}>
          <ChatBox jamId={title.toLowerCase().replace(/\s+/g, '-')} height="450px" />
        </div>
      </div>
  
      {/* Back Button */}
      <button
        onClick={handleLeaveBubble}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '20px',
          background: '#1DB954',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 999,
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
}
