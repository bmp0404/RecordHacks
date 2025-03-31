require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');
const User = require('../models/User');

// Login route for user by directing to Spotify's auth page
router.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex'); // Protection against CSRF
  const scope = 'user-modify-playback-state streaming user-read-private'; // Scopes we require

  const authQueryParams = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.REDIRECT_URI, // This should point to your /auth/callback endpoint
    state: state,
    show_dialog: false
  });

  res.redirect(`https://accounts.spotify.com/authorize?${authQueryParams}`);
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = response.data;

    res.json({
      accessToken: access_token,
      expiresAt: new Date(Date.now() + expires_in * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to refresh access token' });
  }
});

// Callback route: handles Spotify's response after authentication
router.get('/callback', async (req, res) => {
  try {
    // 1. Extract the authorization code from query parameters
    const { code } = req.query;
    
    // 2. Exchange the authorization code for access and refresh tokens
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')
        }
      }
    );
    
    // 3. Fetch the user profile using the access token
    const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenResponse.data.access_token}`
      }
    });
    
    // 4. Create or update the user in MongoDB using the User model
    const user = await User.findOneAndUpdate(
      { spotifyId: profileResponse.data.id }, // Use Spotify ID as the unique identifier
      {
        spotifyId: profileResponse.data.id,
        displayName: profileResponse.data.display_name,
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
        expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000)
      },
      {
        upsert: true, // Create the user if they don't exist
        new: true,   // Return the updated document
        setDefaultsOnInsert: true
      }
    );

    
    // 5. Render an HTML page that sends the auth data back to the main window and then closes the popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <script>
            // Post the authentication data back to the opener window
            window.opener.postMessage({
              accessToken: "${tokenResponse.data.access_token}",
              refreshToken: "${tokenResponse.data.refresh_token}",
              expiresAt: "${new Date(Date.now() + tokenResponse.data.expires_in * 1000).toISOString()}",
              spotifyId: "${profileResponse.data.id}",
              displayName: "${profileResponse.data.display_name}"
            }, "http://localhost:3000");
            // Close the popup window
            window.close();
          </script>
          <p>Authentication successful. You can close this window.</p>
        </body>
      </html>
    `);

  
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
