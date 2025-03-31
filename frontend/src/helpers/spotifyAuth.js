import axios from 'axios';

export const refreshSpotifyAccessToken = async () => {
  const refreshToken = localStorage.getItem('spotifyRefreshToken');
  if (!refreshToken) {
    console.error('No refresh token found.');
    return null;
  }

  try {
    const response = await axios.post('http://localhost:3001/auth/refresh', {
      refreshToken
    });

    const { accessToken, expiresAt } = response.data;

    localStorage.setItem('spotifyAccessToken', accessToken);
    localStorage.setItem('spotifyExpiresAt', expiresAt);

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    return null;
  }
};

export const getValidAccessToken = async () => {
  const expiresAt = localStorage.getItem('spotifyExpiresAt');
  const now = new Date();

  if (!expiresAt || new Date(expiresAt) <= now) {
    return await refreshSpotifyAccessToken();
  }

  return localStorage.getItem('spotifyAccessToken');
};