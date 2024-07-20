const { mongoose } = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Room = require('../models/room');
const Player = require('../models/player');

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
  await new Room({ name: 'Crusader Strike' }).save();
  await new Room({ name: 'Kel Thuzad' }).save();
};

module.exports = { connectInMemory };
