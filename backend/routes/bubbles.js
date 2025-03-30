// routes/bubbles.js
const express = require('express');
const router = express.Router();
const Bubble = require('../models/Bubble');


// Create a bubble: POST /api/bubbles
router.post('/', async (req, res) => {
  try {
    const { genreName } = req.body;
    const newBubble = await Bubble.create({ genreName, activeUsers: [] });
    return res.status(201).json(newBubble);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// List all bubbles: GET /api/bubbles
router.get('/', async (req, res) => {
  try {
    const bubbles = await Bubble.find({});
    res.json(bubbles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Join a bubble: PUT /api/bubbles/:id/join
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
      return res.status(404).json({error: 'Bubble not found'});
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

// 67e8e080f02e48494dea685e



module.exports = router;
// This code defines the routes for creating, listing, joining, and leaving bubbles.
// The routes interact with the Bubble model to perform CRUD operations.
