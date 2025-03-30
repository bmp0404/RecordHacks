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


// Play a song using Spotify API
router.get('/play', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        // Find user in the database
        let user = await User.findOne({ spotifyId: userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Refresh token if expired
        let accessToken = user.accessToken;
        if (new Date() > user.expiresAt) {
            accessToken = await refreshAccessToken(user);
        }

        // Play the hardcoded song
        await axios.put(
            'https://api.spotify.com/v1/me/player/play',
            { uris: [TRACK_URI] },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

    } catch (error) {
        console.error('Error playing song:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to play the song' });
    }
});

// Search for tracks by name and return the results
router.get('/search', async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    
    try {
        // Get access token using client credentials (no user required)
        const accessToken = await getClientCredentialsToken();
        
        // Search for tracks using Spotify API
        const searchResponse = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        
        res.json(searchResponse.data);
    } catch (error) {
        console.error('Error searching Spotify:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to search Spotify',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;
