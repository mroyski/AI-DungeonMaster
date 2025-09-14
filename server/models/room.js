const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    inProgress: { type: Boolean, required: true, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    maxPlayers: { type: Number, required: true, default: 5 },
    players: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: [] },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
