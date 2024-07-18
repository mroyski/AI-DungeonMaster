const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
