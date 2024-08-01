const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    players: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: [] },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
