const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');

// Hardcoded Spotify track URI
const TRACK_URI = 'spotify:track:3n3Ppam7vgaVa1iaRUc9Lp'; // Mr. Brightside by The Killers

// Function to refresh access token
async function refreshAccessToken(user) {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: user.refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        user.accessToken = response.data.access_token;
        user.expiresAt = new Date(Date.now() + response.data.expires_in * 1000);
        await user.save();
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error.response?.data || error.message);
        throw new Error('Failed to refresh access token');
    }
}

async function getClientCredentialsToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting client credentials token:', error.response?.data || error.message);
        throw new Error('Failed to get Spotify access token');
    }
}


/**
 * GET /play
 * Plays a given track on the user's active Spotify device.
 *
 * Query params:
 *   - accessToken (string): The user's current valid Spotify access token
 *   - trackId     (string): The Spotify track ID you want to play
 */
router.get('/play', async (req, res) => {
    try {
      const { accessToken, trackId } = req.query;
      
      if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required.' });
      }
      if (!trackId) {
        return res.status(400).json({ error: 'Track ID is required.' });
      }
  
      // Construct Spotify track URI
      // const trackUri = `spotify:track:${trackId}`;
  
      // Make a PUT request to Spotify to start playback
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        { uris: [trackId] },  // Just pass trackId
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return res.json({ message: 'Playback started successfully!' });
    } catch (error) {
      console.error('Error playing track:', error.response?.data || error.message);
      return res.status(500).json({ error: 'Failed to play the track' });
    }
  });

router.get('/search', async (req, res) => {
  const { q, accessToken } = req.query;

  if (!q || !accessToken) {
    return res.status(400).json({ error: 'Search query and access token are required' });
  }

  try {
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const tracks = searchResponse.data?.tracks?.items || [];

    const simplified = tracks.map((track) => ({
      name: track.name,
      artist: track.artists?.[0]?.name || 'Unknown Artist',
      uri: track.uri, // This is the full Spotify URI you'll use for playback
      id: track.id,
      albumArt: track.album?.images?.[0]?.url || '',
    }));

    res.json({ tracks: simplified });
  } catch (error) {
    console.error('Error searching Spotify:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to search Spotify',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
