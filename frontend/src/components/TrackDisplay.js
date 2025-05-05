import React, { useState } from 'react';

export default function TrackDisplay({ name, artist, albumArt }) {
    return (
      <div className="track-info-card" style={{ ...styles.container }}>
        <img src={albumArt || null} alt="Album" style={styles.image} />
        <h2 style={styles.name}>{name || 'No Track Selected'}</h2>
        <p style={styles.artist}>{artist}</p>
      </div>
    );
  }
  
  const styles = {
    container: {
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      margin: '0 auto'
    },
    image: {
      width: '100%',
      borderRadius: '10px',
      marginBottom: '15px'
    },
    name: {
      fontSize: '1.25rem',
      color: '#222',
      margin: '0 0 8px 0'
    },
    artist: {
      fontSize: '1rem',
      color: '#666',
      margin: 0
    }
  };