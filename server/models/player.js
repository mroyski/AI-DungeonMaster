const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    playerClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlayerClass',
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  },
  { timestamps: true }
);

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
