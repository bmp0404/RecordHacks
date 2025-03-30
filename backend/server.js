// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const bubblesRouter = require('./routes/bubbles');
const authRouter = require('./routes/auth')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Use the bubbles router
app.use('/bubbles', bubblesRouter);
app.use('/auth', authRouter);
// Connect to MongoDB and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
});


