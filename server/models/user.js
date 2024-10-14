const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  { timestamps: true }
);

userSchema.methods.passwordMatch = function (inputPassword) {
  return inputPassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
