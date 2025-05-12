import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';
import './App.css';

const server_URL = process.env.server_URL || 'http://localhost:3001'

export default function App() {

  // 1) Start with no bubbles
  const [dynamicPages, setDynamicPages] = useState([]);
  const [newPageName, setNewPageName] = useState('');

    // 2) Fetch existing bubbles from MongoDB on mount
  useEffect(() => {
    const loadBubbles = async () => {
      try {
        const res = await axios.get(`${server_URL}/bubbles`);
        const pages = res.data.map(bubble => ({
          id: bubble._id,  // use the MongoDB _id as your React key
          title: bubble.genreName,
          path: `/${bubble.genreName.toLowerCase().replace(/\s+/g, '-')}`,
          color: bubble.color,
          x: bubble.xCoordinate,
          y: bubble.yCoordinate,
          size: 120,                // or any default/fixed size you prefer
          spotifyId: bubble.currentTrack || '',
          bubbleId: bubble._id,
          highlight: false,
        }));
        setDynamicPages(pages);
      } catch (err) {
        console.error('Error loading bubbles:', err);
      }
    };
    loadBubbles();
  }, []);

  // 5) Form submit → compute props & POST → update state
  const createNewPage = async e => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    // Example simple positioning logic
    const size = 120;  // or whatever you choose

    // get the viewport dimensions
    const containerWidth  = window.innerWidth - 100;
    const containerHeight = window.innerHeight - 500;
    
    // now generate x/y so the bubble never overflows
    const x = Math.random() * (containerWidth  - size);
    const y = Math.random() * (containerHeight - size);
    const color = '#'+Math.floor(Math.random()*16777215).toString(16);

    try {
      const res = await axios.post(`${server_URL}/bubbles`, {
        genreName: newPageName,
        xCoordinate: x,
        yCoordinate: y,
        color,
      });
      const newBubble = res.data;
      setDynamicPages(pages => [
        ...pages,
        {
          id: newBubble._id,
          title: newBubble.genreName,
          path: `/${newBubble.genreName.toLowerCase().replace(/\s+/g, '-')}`,
          color: newBubble.color,
          x: newBubble.xCoordinate,
          y: newBubble.yCoordinate,
          size: 120,
          spotifyId: newBubble.currentTrack || '',
          bubbleId: newBubble._id,
          highlight: true,
        }
      ]);
      setNewPageName('');
    } catch (err) {
      console.error('Error creating bubble in backend:', err);
    }
  };

  // 6) Render router & pass props
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
