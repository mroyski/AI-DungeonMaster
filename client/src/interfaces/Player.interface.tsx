export interface Player {
  name: string;
  playerClass: PlayerClass;
}

export interface PlayerClass {
  name: string;
  description: string;
  primaryAbility: string;
  symbol: string;
}

const barbarian: PlayerClass = {
  name: 'Barbarian',
  description:
    'A fierce warrior of primitive background who can enter a battle rag',
  primaryAbility: 'Strength',
  symbol: 'Barbarian.jpg',
};

const bard: PlayerClass = {
  name: 'Bard',
  description: 'An inspiring magician whose power echoes the music of creation',
  primaryAbility: 'Charisma',
  symbol: 'Bard.jpg',
};

const cleric: PlayerClass = {
  name: 'Cleric',
  description:
    'A priestly champion who wields divine magic in service of a higher power',
  primaryAbility: 'Wisdom',
  symbol: 'Cleric.jpg',
};

const druid: PlayerClass = {
  name: 'Druid',
  description:
    'A priest of the Old Faith, wielding the powers of nature — moonlight and plant growth, fire and lightning — and adopting animal forms',
  primaryAbility: 'Wisdom',
  symbol: 'Druid.jpg',
};

const fighter: PlayerClass = {
  name: 'Fighter',
  description:
    'A master of martial combat, skilled with a variety of weapons and armor',
  primaryAbility: 'Stength or Dexterity',
  symbol: 'Fighter.jpg',
};

const monk: PlayerClass = {
  name: 'Monk',
  description:
    'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection',
  primaryAbility: 'Dexterity & Wisdom',
  symbol: 'Monk.jpg',
};

const paladin: PlayerClass = {
  name: 'Paladin',
  description: 'A holy warrior bound to a sacred oath',
  primaryAbility: 'Strength & Charisma',
  symbol: 'Paladin.jpg',
};

const ranger: PlayerClass = {
  name: 'Ranger',
  description:
    'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization',
  primaryAbility: 'Dexterity & Wisdom',
  symbol: 'Ranger.jpg',
};

const rogue: PlayerClass = {
  name: 'Rogue',
  description:
    'A scoundrel who uses stealth and trickery to overcome obstacles and enemies',
  primaryAbility: 'Dexterity',
  symbol: 'Rogue.jpg',
};

const sorcerer: PlayerClass = {
  name: 'Sorcerer',
  description:
    'A spellcaster who draws on inherent magic from a gift or bloodlin',
  primaryAbility: 'Charisma',
  symbol: 'Sorcerer.jpg',
};

const warlock: PlayerClass = {
  name: 'Warlock',
  description:
    'A wielder of magic that is derived from a bargain with an extraplanar entity',
  primaryAbility: 'Charisma',
  symbol: 'Warlock.jpg',
};

const wizard: PlayerClass = {
  name: 'Wizard',
  description:
    'A scholarly magic-user capable of manipulating the structures of reality',
  primaryAbility: 'Intelligence',
  symbol: 'Wizard.jpg',
};

export const playerClasses = [
  barbarian,
  bard,
  cleric,
  druid,
  fighter,
  monk,
  paladin,
  ranger,
  rogue,
  sorcerer,
  warlock,
  wizard,
];
