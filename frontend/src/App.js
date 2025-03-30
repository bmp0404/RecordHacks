import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Jam from './components/Jam';
import ChatBox from './components/Chatbox';
import axios from 'axios'; // Add this import for axios


// In the HomePage component - removed spotifyInput and setSpotifyInput
const HomePage = ({ dynamicPages, newPageName, setNewPageName, createNewPage }) => {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      paddingBottom: '100px',
      paddingTop: '0',  // Explicitly set top padding to 0
      margin: '0'       // Ensure no margin
    }}>
      {/* Login button in top left - with updated positioning */}
      <div className="auth-buttons" style={{ 
        position: 'absolute', 
        top: '0',
        left: '0',
        display: 'flex', 
        gap: '10px',
        zIndex: 100 
      }}>
        <button 
          className="login-button"
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            borderRadius: '0 0 8px 0',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
          }}
        >
          Login
        </button>
      </div>

      <h1>Bubblr</h1>
      <h2>Explore Music Together</h2>
      
      {/* Add this section to render Jam components */}
      {dynamicPages.map(page => (
        <Jam 
          key={page.id} 
          destination={page.path} 
          label={page.title} 
          color={page.color} 
          size={page.size || 100} 
          x={page.x}
          y={page.y}
          highlight={page.highlight}
          bubbleId={page.bubbleId}       // Pass the bubbleId here
      />
    ))}

      
      {/* Simplified form without Spotify input */}
      <div className="create-jam-form" style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 100 }}>
        <form onSubmit={createNewPage}>
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Enter jam name"
            style={{ marginBottom: '10px' }}
          />
          <button 
            className="create-jam-button"
            type="submit"
          >
            Create a Jam
          </button>
        </form>
      </div>
    </div>
  );
};

// Update DynamicPage to include a song name search instead of track ID input
const DynamicPage = ({ title, spotifyId, bubbleId, currentUserId }) => {
  const navigate = useNavigate();
  // Add state for the track ID and search input
  const [trackId, setTrackId] = useState(spotifyId || '1KdjbgMfPmQQANYVS2IfTJ');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleLeaveBubble = async () => {
    try {
      await axios.put(`http://localhost:3001/bubbles/${bubbleId}/leave`, { userId: currentUserId });
      console.log('Left bubble');
      navigate('/');
    } catch (error) {
      console.error('Error leaving bubble:', error.response?.data || error.message);
    }
  };

  // Search for a track by name and get the top result's ID
  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setSearchError('');
    
    try {
      // Send the search query to your backend, which will proxy to Spotify API
      const response = await axios.get(`http://localhost:3001/player/search?q=${encodeURIComponent(searchInput)}`);
      
      if (response.data && response.data.tracks && response.data.tracks.items.length > 0) {
        // Get the first (top) result's ID
        const newTrackId = response.data.tracks.items[0].id;
        console.log(`Found track: ${response.data.tracks.items[0].name} by ${response.data.tracks.items[0].artists[0].name}`);
        
        // Update the track ID state
        setTrackId(newTrackId);
        setSearchInput(''); // Clear input after successful search
      } else {
        setSearchError('No songs found matching that name. Try another search.');
      }
    } catch (error) {
      console.error('Error searching for track:', error);
      setSearchError('Unable to search for songs right now. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="dynamic-page" style={{ paddingTop: '120px' }}>
      <h1>{title}</h1>
      
      {/* Main content container - using row layout */}
      <div className="content-container" style={{
        display: 'flex',
        flexDirection: 'row',         // Changed to row to place elements side by side
        justifyContent: 'center',     // Center horizontally
        alignItems: 'flex-start',     // Align items to the top
        width: '90%',
        maxWidth: '1200px',
        margin: '20px auto',
        gap: '30px'
      }}>
        {/* Left column: Spotify embed + search form */}
        <div style={{ 
          width: '45%',
          minWidth: '300px',
          maxWidth: '500px',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Spotify Embed */}
          <div className="spotify-container" style={{ 
            width: '100%', 
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <iframe 
              style={{ borderRadius: '12px' }} 
              src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
          
          {/* Song name search form - directly under the embed */}
          <form 
            onSubmit={handleTrackSearch}
            style={{
              marginTop: '15px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a song by name"
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '0.9rem',
                width: '100%'
              }}
            />
            {searchError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '-5px' }}>
                {searchError}
              </div>
            )}
            <button
              type="submit"
              disabled={isSearching}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#1DB954', // Spotify green
                color: 'white',
                fontWeight: '600',
                cursor: isSearching ? 'wait' : 'pointer',
                opacity: isSearching ? 0.7 : 1,
              }}
            >
              {isSearching ? 'Searching...' : 'Find Song'}
            </button>
          </form>
        </div>
        
        {/* Right column: ChatBox */}
        <div style={{ 
          width: '45%', 
          minWidth: '300px', 
          maxWidth: '500px',
          height: '100%' 
        }}>
          <ChatBox 
            jamId={title.toLowerCase().replace(/\s+/g, '-')} 
            height="450px"  // Increased height to match Spotify + search form
          />
        </div>
      </div>

      <button
        className="back-button"
        onClick={handleLeaveBubble}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
};

// Updated LoginPage with multiple music service login options
const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Open a popup window for login
    const popup = window.open(
      'http://localhost:3001/auth/login',
      'Spotify Login',
      'width=500,height=600'
    );
  
    // Listen for messages from the popup
    window.addEventListener('message', (event) => {
      // Verify the origin of the message for security
      if (event.origin !== 'http://localhost:3001') return;
  
      // event.data should contain your tokens or user info
      const { access_token, refresh_token, expiresAt, spotifyId, displayName } = event.data;
      console.log('Received tokens:', event.data);
  
      // Now you can update your frontend state (e.g., store tokens, update user context, etc.)
      // For example:
      // setAuthData({ access_token, refresh_token, expiresAt, spotifyId, displayName });
      
      // Optionally navigate to the dashboard
      navigate('/');
    });
  };
  
  
  
  return (
    <div className="page auth-page">
      <h1>Connect Your Music</h1>
      <div className="auth-form" style={{ width: '400px', maxWidth: '90%' }}>
        <div className="spotify-login-container">
          <p>Connect your favorite music service to create and share jams with the world.</p>
          
          {/* Spotify Button */}
          <button 
            className="spotify-auth-button"
            onClick={(handleLoginClick)}
            style={{
              background: '#1DB954', // Spotify green
              padding: '12px 24px',
              borderRadius: '25px',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              marginTop: '20px'
            }}
          >
            <span>Continue with Spotify</span>
          </button>
          
          {/* Apple Music Button */}
          <button 
            className="apple-auth-button"
            onClick={() => {
              console.log('Apple Music login clicked');
            }}
            style={{
              background: '#FA243C', // Apple Music red
              padding: '12px 24px',
              borderRadius: '25px',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              marginTop: '20px'
            }}
          >
            <span>Continue with Apple Music</span>
          </button>
          
          {/* Amazon Music Button */}
          <button 
            className="amazon-auth-button"
            onClick={() => {
              console.log('Amazon Music login clicked');
            }}
            style={{
              background: '#00A8E1', // Amazon Music blue
              padding: '12px 24px',
              borderRadius: '25px',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              marginTop: '20px'
            }}
          >
            <span>Continue with Amazon Music</span>
          </button>
        </div>
      </div>
      <button
        className="back-button"
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px'
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
};

// App content component that can use routing hooks - removed spotifyInput and setSpotifyInput
const AppContent = ({ dynamicPages, newPageName, setNewPageName, createNewPage }) => {
  const location = useLocation();
  
  // Reset the body height and background when navigating
  React.useEffect(() => {
    // Set body background to match app background to avoid black bar
    document.body.style.background = 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
      document.body.style.height = '100vh';
      document.body.style.minHeight = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore expandable size for homepage
      const maxHeight = dynamicPages.length > 0 
        ? Math.max(...dynamicPages.map(page => page.y + page.size)) + 200
        : '100vh';
      document.body.style.minHeight = `${maxHeight}px`;
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
    }
  }, [location.pathname, dynamicPages]);
  
  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      overflowX: 'hidden',
      // Constrain height on dynamic pages
      ...(location.pathname !== '/' && !location.pathname.includes('login') ? { height: '100vh', overflow: 'hidden' } : {})
    }}>
      <header className="App-header" style={{ 
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        width: '100%', 
        // Change this line to use the same blue gradient
        background: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)',
        // Rest of the styles stay the same
        paddingBottom: location.pathname === '/' ? 
          `${Math.max(100, dynamicPages.length * 120)}px` : '0',
        ...(location.pathname !== '/' && !location.pathname.includes('login') ? { height: '100vh', maxHeight: '100vh' } : {})
      }}>
        <Routes>
          {/* Main routes */}
          <Route 
            path="/" 
            element={
              <HomePage 
                dynamicPages={dynamicPages} 
                newPageName={newPageName} 
                setNewPageName={setNewPageName}
                createNewPage={createNewPage}
              />
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Generate routes for each dynamic page */}
          {dynamicPages.map(page => (
            <Route
              key={page.id}
              path={page.path}
              element={
                <DynamicPage 
                  title={page.title} 
                  spotifyId={page.spotifyId} 
                  bubbleId={page.bubbleId} // Add the bubbleId
                  currentUserId="user123" // Replace with actual user ID from your auth system
                />
              }
            />
          ))}
        </Routes>
      </header>
    </div>
  );
};

function App() {
  // State to store dynamically created pages
  const [dynamicPages, setDynamicPages] = useState([]);
  // State for the form input
  const [newPageName, setNewPageName] = useState('');
  
  // Random color generator
  const getRandomColor = () => {
    const colors = [
      '#FF1E56',  // Vibrant pink/red
      '#00DDFF',  // Bright cyan
      '#FF9F1C',  // Vivid orange
      '#7B4CFF',  // Electric purple
      '#23F0C7',  // Bright teal
      '#FF6B6B',  // Coral pink
      '#32CD32',  // Lime green
      '#FF3864',  // Hot pink
      '#41EAD4',  // Turquoise
      '#FFDE22',  // Bright yellow
      '#B537F2',  // Violet
      '#3D9AF1',  // Bright blue
      '#00F5A0'   // Neon green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Constants for Jam component sizing and positioning
  const MIN_SIZE = 80;
  const MAX_SIZE = 200;
  const MIN_DISTANCE = 100; // Minimum distance between components

  const createNewPage = (e) => {
    e.preventDefault();
    if (newPageName.trim()) {
      const path = `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
      const spotifyId = '2WmJ5wp5wKBlIJE6FDAIBJ';
      const size = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;
      const minX = 0;
      const maxX = 1000;
      let x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const minY = 120;
      let maxExistingY = dynamicPages.length > 0 
        ? Math.max(...dynamicPages.map(page => page.y + page.size))
        : minY;
      const maxY = maxExistingY + 200;
      let y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      
      let validPosition = false;
      let attempts = 0;
      const maxAttempts = 30;
      while (!validPosition && attempts < maxAttempts) {
        validPosition = true;
        for (const page of dynamicPages) {
          const distance = Math.sqrt(Math.pow(x - page.x, 2) + Math.pow(y - page.y, 2));
          if (distance < MIN_DISTANCE) {
            validPosition = false;
            x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            break;
          }
        }
        attempts++;
      }
      
      const newPageId = Date.now();
      const newPage = {
        id: newPageId,
        title: newPageName,
        path: path,
        color: getRandomColor(),
        size: size,
        x: x,
        y: y,
        spotifyId: spotifyId,
        // bubbleId will be added after the backend call succeeds
        highlight: true
      };
      
      // Send a POST request to create the bubble in the backend.
      axios.post('http://localhost:3001/bubbles', { genreName: newPageName })
        .then(response => {
          const newBubbleId = response.data._id;
          console.log("New bubble ID:", newBubbleId);
          // Add the bubbleId to the newPage object
          const newPageWithId = { ...newPage, bubbleId: newBubbleId };
          // Update state to include the new page with bubbleId
          setDynamicPages([...dynamicPages, newPageWithId]);
          setNewPageName('');
          
          const pageHeight = Math.max(...dynamicPages.map(page => page.y + page.size), y + size);
          document.body.style.minHeight = `${pageHeight + 200}px`;
          setTimeout(() => {
            window.scrollTo({
              top: y - 100,
              behavior: 'smooth'
            });
            setTimeout(() => {
              setDynamicPages(prev => prev.map(page => 
                page.id === newPageId ? { ...page, highlight: false } : page
              ));
            }, 2000);
          }, 100);
        })
        .catch(error => {
          console.error('Error creating bubble in backend:', error);
        });
    }
  };
  

  return (
    <Router>
      <AppContent 
        dynamicPages={dynamicPages}
        newPageName={newPageName}
        setNewPageName={setNewPageName}
        createNewPage={createNewPage}
      />
    </Router>
  );
}

// Add this to ensure the app's background expands properly
const style = document.createElement('style');
style.textContent = `
  body, html {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    height: auto;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    height: auto;
  }
  
  .App, .App-header {
    min-height: 100vh;
    height: auto;
  }

  .create-jam-form input {
    background: rgba(255,255,255,0.3);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 12px 15px;
    font-size: 1rem;
    width: 250px;
    transition: all 0.3s;
  }
  
  .create-jam-form input::placeholder {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .spotify-container {
    margin: 30px auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }

  @keyframes pulseHighlight {
    0% { filter: brightness(1); }
    25% { filter: brightness(1.5); }
    50% { filter: brightness(1); }
    75% { filter: brightness(1.5); }
    100% { filter: brightness(1); }
  }
  
  .jam-highlight {
    box-shadow: 0 0 30px rgba(255,255,255,0.8), 0 8px 16px rgba(0,0,0,0.3) !important;
  }
`;
document.head.appendChild(style);

export default App;