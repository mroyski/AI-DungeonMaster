const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    toDungeonMaster: { type: Boolean, required: true, default: false },
    fromDungeonMaster: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
