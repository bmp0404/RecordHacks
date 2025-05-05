import React from 'react';

export default function SpotifyEmbed({ trackUri }) {
  const id = trackUri?.split(':').pop() || '';
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${id}`}
      width="100%"
      height="352"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
