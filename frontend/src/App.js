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

  // Function to create a new page
  const createNewPage = (e) => {
    e.preventDefault();
    if (newPageName.trim()) {
      const path = `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Calculate the y-position for the new Jam (vertically stacked)
      // Start at 100px and add 120px for each existing component
      const yPosition = 100 + dynamicPages.length * 120;
      
      const newPage = {
        id: Date.now(),
        title: newPageName,
        path: path,
        color: getRandomColor(),
        size: 100,
        x: 50, // Fixed x position for vertical stacking
        y: yPosition
      };
      
      setDynamicPages([...dynamicPages, newPage]);
      setNewPageName(''); // Clear the input
      
      // If we have many components, ensure the page expands
      document.body.style.minHeight = `${Math.max(1000, (dynamicPages.length + 1) * 150)}px`;
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