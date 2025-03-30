const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
   spotifyId: { type: String, unique: true, required: true },
   displayName: {type: String, required: true},
   accessToken: {type: String, required: true},
   refreshToken: {type: String, required: true},
   expiresAt: {type: Date}
}, { timestamps: true });


module.exports = mongoose.models.User || mongoose.model('User', UserSchema);