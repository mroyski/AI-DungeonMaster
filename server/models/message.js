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
    startMessage: { type: Boolean, required: true, default: false },
    isManual: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.pre('save', function (next) {
  if (this.isManual) {
    return next();
  }

  if (this.text.substring(0, 3).toLowerCase() === '/dm') {
    this.toDungeonMaster = true;
  } else {
    this.toDungeonMaster = false;
  }

  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
