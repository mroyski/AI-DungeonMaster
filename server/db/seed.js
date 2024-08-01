const { mongoose } = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Room = require('../models/room');
const Player = require('../models/player');
const User = require('../models/user');
const PlayerClass = require('../models/playerClass');

const connectInMemory = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, { dbName: 'aidm' }).then(seed());
  console.log(`MongoDB successfully connected to ${mongoUri}`);

  // stop running MongoMemoryServer on restarts with nodemon
  process.once('SIGUSR2', async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    process.kill(process.pid, 'SIGUSR2');
  });
};

const seed = async () => {
  const barbarianClass = new PlayerClass({
    name: 'Barbarian',
    description:
      'A fierce warrior of primitive background who can enter a battle rag',
    primaryAbility: 'Strength',
    symbol: 'Barbarian.jpg',
  });
  await barbarianClass.save();

  const user = new User({
    username: 'tester',
    email: 'test@test.com',
    password: 'a',
  });
  await user.save();

  const player = new Player({
    name: 'Salithe',
    user: user,
    playerClass: barbarianClass,
  });
  await player.save();

  await new Room({ name: 'Crusader Strike' }).save();
  await new Room({ name: 'Kel Thuzad' }).save();
};

module.exports = { connectInMemory };
