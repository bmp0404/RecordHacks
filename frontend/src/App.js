import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Jam from './components/Jam';

// Move HomePage outside of App function
const HomePage = ({ dynamicPages, newPageName, setNewPageName, createNewPage }) => (
  <div className="page" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '100px' }}>
    {/* Dynamic navigation buttons */}
    {dynamicPages.map((page) => (
      <Jam 
        key={page.id}
        destination={page.path} 
        label={page.title} 
        color={page.color} 
        size={page.size || 100} 
        x={page.x}
        y={page.y}
      />
    ))}

    {/* Form to create new pages */}
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', zIndex: 100 }}>
      <form onSubmit={createNewPage}>
        <input
          type="text"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value)}
          placeholder="Enter page name"
          style={{ padding: '10px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit"
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Create Page
        </button>
      </form>
    </div>
  </div>
);

// Dynamic page component - also moved outside App
const DynamicPage = ({ title }) => (
  <div className="page" style={{ position: 'relative', minHeight: '100vh' }}>
    <h1>{title}</h1>
  </div>
);

function App() {
  // State to store dynamically created pages
  const [dynamicPages, setDynamicPages] = useState([]);
  // State for the form input
  const [newPageName, setNewPageName] = useState('');

  // Random color generator
  const getRandomColor = () => {
    const colors = ['#4CAF50', '#2196F3', '#f44336', '#FF9800', '#9C27B0', '#795548', '#607D8B'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Constants for Jam component sizing and positioning
  const MIN_SIZE = 80;
  const MAX_SIZE = 150;
  const MIN_DISTANCE = 100; // Minimum distance between components

  // Function to create a new page
  const createNewPage = (e) => {
    e.preventDefault();
    if (newPageName.trim()) {
      const path = `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Generate a random size between MIN_SIZE and MAX_SIZE
      const size = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;
      
      // Fixed positioning bounds for X-axis (these seem to work well)
      const minX = -600;  // Left margin
      const maxX = 400;   // Right boundary
      
      // Generate initial X position
      let x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      
      // Improved Y position generation:
      // First, determine the valid vertical range
      const minY = 120; // Minimum Y to avoid header content
      
      // Find the maximum Y position of any existing component
      let maxExistingY = minY;
      if (dynamicPages.length > 0) {
        maxExistingY = Math.max(...dynamicPages.map(page => page.y + page.size));
      }
      
      // Set our max Y value with some padding for new components
      const maxY = maxExistingY + 200;
      
      // Generate initial Y position anywhere within the valid range
      let y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      
      // Make sure components maintain MIN_DISTANCE from each existing component
      let validPosition = false;
      let attempts = 0;
      const maxAttempts = 30;
      
      while (!validPosition && attempts < maxAttempts) {
        validPosition = true;
        
        // Check distance from each existing component
        for (const page of dynamicPages) {
          const distance = Math.sqrt(
            Math.pow(x - page.x, 2) + 
            Math.pow(y - page.y, 2)
          );
          
          if (distance < MIN_DISTANCE) {
            validPosition = false;
            
            // Try completely new random positions
            x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            
            break;
          }
        }
        
        attempts++;
      }
      
      // Rest of the function remains the same
      const newPage = {
        id: Date.now(),
        title: newPageName,
        path: path,
        color: getRandomColor(),
        size: size,
        x: x,
        y: y
      };
      
      setDynamicPages([...dynamicPages, newPage]);
      setNewPageName('');
      
      // Update the page's min height to accommodate components
      // Use pageHeight instead of redeclaring maxY
      const pageHeight = Math.max(
        ...dynamicPages.map(page => page.y + page.size), 
        y + size
      );
      document.body.style.minHeight = `${pageHeight + 200}px`;
    }
  };

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
        <header className="App-header" style={{ 
          minHeight: '100vh', 
          width: '100%', 
          background: 'linear-gradient(135deg, #1a237e 0%, #4a148c 100%)',
          paddingBottom: `${Math.max(100, dynamicPages.length * 120)}px` // Dynamic padding based on number of components
        }}>
          <h1>Bubblr</h1>
          <h2>Explore Music Together</h2>
          <Routes>
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
            {/* Dynamic routes */}
            {dynamicPages.map(page => (
              <Route
                key={page.id}
                path={page.path}
                element={<DynamicPage title={page.title} />}
              />
            ))}
          </Routes>
        </header>
      </div>
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
`;
document.head.appendChild(style);

export default App;