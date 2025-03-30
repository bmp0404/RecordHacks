// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const bubblesRouter = require('./routes/bubbles');
const authRouter = require('./routes/auth')
const playerRouter = require('./routes/player')
const app = express();
const PORT = process.env.PORT || 3001;

// Allow requests from your frontend's local host
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  
}));

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Use the bubbles router
app.use('/bubbles', bubblesRouter);
app.use('/auth', authRouter);
app.use('/player', playerRouter);

// Map the spotify search route to the player router
app.use('/spotify', playerRouter);

// Start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });