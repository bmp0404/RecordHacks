// models/Bubble.js
const mongoose = require('mongoose');
const { Schema } = mongoose;


const bubbleSchema = new Schema({
  genreName: { type: String, required: true },
  activeUsers: [{ type: String }], // Array of user IDs (as strings)
  currentTrack: { type: String, required: false},
  currentTrackPhoto: { type: String, required: false },
  currentTrackName: { type: String, required: false },
  currentTrackArtist: { type: String, required: false },
  // Optionally, add more fields later (like currentTrack, queue, etc.)
}, { timestamps: true });


module.exports = mongoose.models.Bubble || mongoose.model('Bubble', bubbleSchema);


// This model defines the schema for each bubble, which currently includes
// a genre name and an array of active user IDs.
