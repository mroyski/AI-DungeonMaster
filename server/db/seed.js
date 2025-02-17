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

  const bardClass = new PlayerClass({
    name: 'Bard',
    description:
      'An inspiring magician whose power echoes the music of creation',
    primaryAbility: 'Charisma',
    symbol: 'Bard.jpg',
  });
  await bardClass.save();

  const clericClass = new PlayerClass({
    name: 'Cleric',
    description:
      'A priestly champion who wields divine magic in service of a higher power',
    primaryAbility: 'Wisdom',
    symbol: 'Cleric.jpg',
  });
  await clericClass.save();

  const druidClass = new PlayerClass({
    name: 'Druid',
    description:
      'A priest of the Old Faith, wielding the powers of nature and adopting animal forms',
    primaryAbility: 'Wisdom',
    symbol: 'Druid.jpg',
  });
  await druidClass.save();

  const fighterClass = new PlayerClass({
    name: 'Fighter',
    description:
      'A master of martial combat, skilled with a variety of weapons and armor',
    primaryAbility: 'Strength',
    symbol: 'Fighter.jpg',
  });
  await fighterClass.save();

  const monkClass = new PlayerClass({
    name: 'Monk',
    description:
      'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection',
    primaryAbility: 'Dexterity',
    symbol: 'Monk.jpg',
  });
  await monkClass.save();

  const paladinClass = new PlayerClass({
    name: 'Paladin',
    description:
      'A holy warrior bound to a sacred oath, fighting for justice and righteousness',
    primaryAbility: 'Strength',
    symbol: 'Paladin.jpg',
  });
  await paladinClass.save();

  const rangerClass = new PlayerClass({
    name: 'Ranger',
    description:
      'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization',
    primaryAbility: 'Dexterity',
    symbol: 'Ranger.jpg',
  });
  await rangerClass.save();

  const rogueClass = new PlayerClass({
    name: 'Rogue',
    description:
      'A scoundrel who uses stealth and trickery to overcome obstacles and enemies',
    primaryAbility: 'Dexterity',
    symbol: 'Rogue.jpg',
  });
  await rogueClass.save();

  const sorcererClass = new PlayerClass({
    name: 'Sorcerer',
    description:
      'A spellcaster who draws on inherent magic from a gift or bloodline',
    primaryAbility: 'Charisma',
    symbol: 'Sorcerer.jpg',
  });
  await sorcererClass.save();

  const warlockClass = new PlayerClass({
    name: 'Warlock',
    description:
      'A spellcaster who draws on a bargain with an extraplanar entity',
    primaryAbility: 'Charisma',
    symbol: 'Warlock.jpg',
  });
  await warlockClass.save();

  const wizardClass = new PlayerClass({
    name: 'Wizard',
    description:
      'A scholarly magic-user capable of manipulating the structures of reality',
    primaryAbility: 'Intelligence',
    symbol: 'Wizard.jpg',
  });
  await wizardClass.save();

  const user1 = new User({
    username: 't1',
    email: 'test@test.com',
    password: 'a',
  });
  await user1.save();

  const user2 = new User({
    username: 't2',
    email: 'test@test.com',
    password: 'a',
  });
  await user2.save();

  const player1 = new Player({
    name: 'Salithe',
    user: user1,
    playerClass: barbarianClass,
  });
  await player1.save();

  const player2 = new Player({
    name: 'Aragorn',
    user: user2,
    playerClass: barbarianClass,
  });
  await player2.save();

  await new Room({ name: 'Crusader Strike' }).save();
  await new Room({ name: 'Kel Thuzad' }).save();
};

module.exports = { connectInMemory };
