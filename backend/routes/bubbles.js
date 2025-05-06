// routes/bubbles.js
const express = require('express');
const router = express.Router();
const Bubble = require('../models/Bubble');


// Create a bubble: POST /bubbles
router.post('/', async (req, res) => {
  try {
    const { genreName, xCoordinate, yCoordinate, color } = req.body;
    // simple validation
    if (!genreName || xCoordinate == null || yCoordinate == null || !color
    ) {
      return res
        .status(400)
        .json({ error: 'genreName, xCoordinate, yCoordinate and color are all required.' });
    }

    const newBubble = await Bubble.create({
      genreName,
      activeUsers: [],
      currentTrack: 'spotify:track:3n3Ppam7vgaVa1iaRUc9Lp',
      xCoordinate,
      yCoordinate,
      color,
    });

    return res.status(201).json(newBubble);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update a bubble: PUT /bubbles/:id
router.put('/:id', async (req, res) => {
  try {
    const { genreName, activeUsers, currentTrack, currentTrackPhoto, currentTrackName,
      currentTrackArtist, xCoordinate, yCoordinate, color, } = req.body;

    // optional: validate required fields are present
    if (
      genreName == null ||
      xCoordinate == null ||
      yCoordinate == null ||
      color == null
    ) {
      return res
        .status(400)
        .json({ error: 'genreName, xCoordinate, yCoordinate and color are all required.' });
    }

    const updatedBubble = await Bubble.findByIdAndUpdate(
      req.params.id,
      {
        genreName,
        activeUsers,
        currentTrack,
        currentTrackPhoto,
        currentTrackName,
        currentTrackArtist,
        xCoordinate,
        yCoordinate,
        color,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBubble) {
      return res.status(404).json({ error: 'Bubble not found' });
    }

    return res.json(updatedBubble);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});


// List all bubbles: GET /bubbles
router.get('/', async (req, res) => {
  try {
    const bubbles = await Bubble.find({});
    res.json(bubbles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Join a bubble: PUT /bubbles/:id/join
router.put('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const bubble = await Bubble.findById(req.params.id);
    if (!bubble) {
      return res.status(404).json({ error: 'Bubble not found' });
    }
    if (!bubble.activeUsers.includes(userId)) {
      bubble.activeUsers.push(userId);
      await bubble.save();
    }
    res.json(bubble);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /bubbles/:id - Get a bubble by ID 
router.get('/:id', async (req, res) => {
  try {
    const bubble = await Bubble.findById(req.params.id);

    if (!bubble) {
      return res.status(404).json({ error: 'Bubble not found' });
    }

    res.json(bubble);
  } catch (error) {
    console.error('Error fetching bubble:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Leave a bubble: PUT /api/bubbles/:id/leave
router.put('/:id/leave', async (req, res) => {
  try {
    const { userId } = req.body;
    const bubble = await Bubble.findById(req.params.id);
    if (!bubble) {
      return res.status(404).json({ error: 'Bubble not found' });
    }
    bubble.activeUsers = bubble.activeUsers.filter(u => u !== userId);
    await bubble.save();
    res.json(bubble);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Deleting a bubble: DELETE /api/bubbles/:id
router.delete('/:id', async (req, res) => {
  try {
    const bubble = await Bubble.findByIdAndDelete(req.params.id);
    if (!bubble) {
      return res.status(404).json({ error: 'Bubble not found' });
    }
    else {
      const bubbles = await Bubble.find({});
      res.json(bubbles); // returning remaining bubbles
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// update current track of bubble
router.put('/:id/song', async (req, res) => {
  const { trackId, name, artist, albumArt } = req.body;

  if (!trackId || !trackId.startsWith('spotify:track:')) {
    return res.status(400).json({ error: 'Invalid or missing trackId' });
  }

  const bubble = await Bubble.findById(req.params.id);
  if (!bubble) {
    return res.status(404).json({ error: 'Bubble not found' });
  }

  bubble.currentTrack = trackId;
  bubble.currentTrackName = name || '';
  bubble.currentTrackArtist = artist || '';
  bubble.currentTrackPhoto = albumArt || '';

  // reset time for new song
  bubble.startTime = new Date();

  await bubble.save();
  res.json(bubble);
});





module.exports = router;
// This code defines the routes for creating, listing, joining, and leaving bubbles.
// The routes interact with the Bubble model to perform CRUD operations.
