import React from 'react';

export default function TrackSearchForm({ onSearch, error, busy }) {
  const [searchInput, setSearchInput] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row',  // 🔁 Horizontal instead of vertical
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        flexWrap: 'wrap', // Makes it responsive on smaller screens
      }}
    >
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for a song"
        style={{
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid #ccc',
          backgroundColor: '#ffffff',
          fontSize: '15px',
          width: '50%', // width of search bar
          maxWidth: '300px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      />

      <button
        type="submit"
        disabled={busy}
        style={{
          padding: '12px 20px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: '#1DB954', // Spotify green
          color: 'white',
          fontWeight: '600',
          fontSize: '15px',
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.7 : 1,
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {busy ? 'Searching...' : 'Find Song'}
      </button>

      {error && (
        <div style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '8px', width: '100%', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </form>
  );
}
