const mongoose = require('mongoose');
const { ABILITIES } = require('../config/constants');

const playerClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    primaryAbility: {
      type: String,
      required: true,
      enum: Object.values(ABILITIES),
    },
    symbol: { type: String, required: true },
  },
  { timestamps: true }
);

const PlayerClass = mongoose.model('PlayerClass', playerClassSchema);

module.exports = PlayerClass;
