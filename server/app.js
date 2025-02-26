require('dotenv-flow').config();
const express = require('express');
const { randomUUID } = require('node:crypto');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { default: OpenAI } = require('openai');
const { connectInMemory } = require('./db/seed');
const Room = require('./models/room');
const Message = require('./models/message');
const Player = require('./models/player');
const User = require('./models/user');
const cors = require('cors');
const PlayerClass = require('./models/playerClass');

const PORT = process.env.PORT || 8080;
const app = express();
const server = createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const openai = new OpenAI();

const messageAgent = async (message, room) => {
  try {
    const interactionHistory = await Message.find({
      room,
      $or: [{ fromDungeonMaster: true }, { toDungeonMaster: true }],
    })
      .sort({ createdAt: 1 })
      .lean();

    const formattedHistory = interactionHistory.map((m) => ({
      role: m.fromDungeonMaster ? 'assistant' : 'system',
      content: m.text,
    }));

    const completion = await openai.chat.completions.create({
      messages: formattedHistory,
      model: 'gpt-4o-mini',
    });

    const assistantMessage = completion.choices[0].message.content;
    return assistantMessage;
  } catch (error) {
    console.log(error);
  }
};

const startGame = async (room) => {
  const initialMessage = `Act as though we are playing a Game of Dungeons and Dragons 5th edition. Act as though you are the dungeon master and I am the player. We will be creating a narrative together, where I make decisions for my character, and you make decisions for all other characters (NPCs) and creatures in the world.

Your responsibilities as dungeon master are to describe the setting, environment, Non-player characters (NPCs) and their actions, as well as explain the consequences of my actions on all of the above. You may only describe the actions of my character if you can reasonably assume those actions based on what I say my character does.

It is also your responsibility to determine whether my character’s actions succeed. Simple, easily accomplished actions may succeed automatically. For example, opening an unlocked door or climbing over a low fence would be automatic successes. Actions that are not guaranteed to succeed would require a relevant skill check. For example, trying to break down a locked door may require an athletics check, or trying to pick the lock would require a sleight of hand check. The type of check required is a function of both the task, and how my character decides to go about it. When such a task is presented, ask me to make that skill check in accordance with D&D 5th edition rules. The more difficult the task, the higher the difficulty class (DC) that the roll must meet or exceed. Actions that are impossible are just that: impossible. For example, trying to pick up a building.

Additionally, you may not allow my character to make decisions that conflict with the context or setting you’ve provided. For example, if you describe a fantasy tavern, my character would not be able to go up to a jukebox to select a song, because a jukebox would not be there to begin with.

Try to make the setting consistent with previous descriptions of it. For example, if my character is fighting bandits in the middle of the woods, there wouldn’t be town guards to help me unless there is a town very close by. Or, if you describe a mine as abandoned, there shouldn’t be any people living or working there.

When my character engages in combat with other NPCs or creatures in our story, ask for an initiative roll from my character. You can also generate a roll for the other creatures involved in combat. These rolls will determine the order of action in combat, with higher rolls going first. Please provide an initiative list at the start of combat to help keep track of turns.

For each creature in combat, keep track of their health points (HP). Damage dealt to them should reduce their HP by the amount of the damage dealt. To determine whether my character does damage, I will make an attack roll. This attack roll must meet or exceed the armor class (AC) of the creature. If it does not, then it does not hit.

On the turn of any other creature besides my character, you will decide their action. For example, you may decide that they attack my character, run away, or make some other decision, keeping in mind that a round of combat is 6 seconds.

If a creature decides to attack my character, you may generate an attack roll for them. If the roll meets or exceeds my own AC, then the attack is successful and you can now generate a damage roll. That damage roll will be subtracted from my own hp. If the hp of a creature reaches 0, that creature dies. Participants in combat are unable to take actions outside of their own turn.

Before we begin playing, I would like you to provide my three adventure options. Each should be a short description of the kind of adventure we will play, and what the tone of the adventure will be. Once I decide on the adventure, you may provide a brief setting description and begin the game. I would also like an opportunity to provide the details of my character for your reference, specifically my class, race, AC, and HP.`;

  await new Message({
    text: initialMessage,
    player: null,
    room: room,
    toDungeonMaster: true,
    startMessage: true,
    isManual: true,
  }).save();

  return await messageAgent(initialMessage, room);
};

const sessions = [];

connectInMemory().then(() => {
  io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      // find existing session
      const session = sessions.find((s) => s.sessionID === sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.name = session.name;
        return next();
      }
    }

    const name = socket.handshake.auth.name;
    if (!name) {
      return next(new Error('invalid name'));
    }

    // create new session
    socket.sessionID = randomUUID();
    socket.userID = randomUUID();
    socket.name = name;
    next();
  });

  io.on('connection', async (socket) => {
    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID,
      name: socket.name,
    });

    const players = [];
    for (let [id, socket] of io.of('/').sockets) {
      players.push({
        id: id,
        name: socket.handshake.auth.name,
      });
    }
    io.emit('players', players);

    let allRooms = await Room.find();
    allRooms = allRooms.map((room) => {
      return { id: room._id.toString(), name: room.name };
    });

    socket.emit('all rooms', allRooms);

    socket.broadcast.emit('player connected', {
      id: socket.id,
      name: socket.handshake.auth.name,
    });

    socket.on('chat message', async ({ text, player, room }) => {
      let message = await new Message({ text, player, room }).save();
      message = await Message.findById(message._id).populate('player');

      io.to(room).emit('chat message', message);

      const chatRoom = await Room.findById(room);

      if (message.toDungeonMaster) {
        let dmText;

        if (chatRoom.inProgress) {
          dmText = await messageAgent(text, room);
        } else {
          dmText = await startGame(room);
          chatRoom.inProgress = true;
          await chatRoom.save();
        }

        const dmMessage = new Message({
          text: dmText,
          player: null,
          room,
          fromDungeonMaster: true,
        });

        await dmMessage.save();

        // TODO: handle how to set player in chat as the dm using the data passed here for player
        io.to(room).emit('chat message', dmMessage);
      }
    });

    socket.on('join room', async ({ room, player }) => {
      socket.join(room);
      console.log(`${player.name} joined room: ${room}`);

      const roomToJoin = await Room.findById(room);
      const playerInRoom = await Room.findOne({
        _id: room,
        players: player,
      });

      if (!playerInRoom) {
        roomToJoin.players.push(player);
      }

      await roomToJoin.save();

      const chatHistory = await Message.find({
        room: room,
        startMessage: false,
      }).populate('player');

      socket.emit('chat history', { chatHistory }, socket.id);
    });

    socket.on('leave room', ({ room, name }) => {
      socket.leave(room);
      console.log(`${name} left room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(
        `Player ${socket.id} - ${socket.handshake.auth.name} disconnected.`
      );
      io.emit('player disconnected', socket.id);

      const players = [];
      for (let [id, socket] of io.of('/').sockets) {
        players.push({
          id: id,
          name: socket.handshake.auth.name,
        });
      }

      io.emit('players', players);
    });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  });

  app.use(cors());
  app.use(express.json());

  app.get('/users/:userId/players', async (req, res) => {
    Player.find({ user: req.params.userId })
      .populate('playerClass')
      .then((data) => {
        res.send(data);
      });
  });

  app.post('/users/:userId/players', async (req, res) => {
    const { name, playerClass } = req.body;
    const userId = req.params.userId;
    const playerClassModel = await PlayerClass.findOne({ name: playerClass });

    try {
      const player = await new Player({
        name,
        user: userId,
        playerClass: playerClassModel,
      }).save();

      res.status(201).json(player);
    } catch (error) {
      res.status(500).json({ message: 'Error creating player' });
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user || !user.passwordMatch(password))
        return res
          .status(401)
          .json({ message: 'incorrect username or password' });

      return res
        .status(200)
        .json({ message: 'login successful', username, id: user.id });
    } catch {
      return res.status(500).json({ message: 'login unsuccessful' });
    }
  });

  server.listen(PORT, () =>
    console.log(`server running at http://localhost:${PORT}`)
  );
});
