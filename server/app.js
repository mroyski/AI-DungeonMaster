const express = require('express');
const { createServer } = require('node:http');
require('dotenv-flow').config();
const { join } = require('node:path');
const { Server } = require('socket.io');
// require('openai');
// const { default: OpenAI } = require('openai');

const PORT = process.env.PORT || 8080;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);

// const API_KEY = process.env.OPEN_API_KEY;
// const API_ENDPOINT =
//   'https://api.openai.com/v1/engines/davinci-codex/completions';

// app.get('/', async (req, res) => {
//   const openai = new OpenAI();

//   const completion = await openai.chat.completions.create({
//     messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
//     model: 'gpt-3.5-turbo',
//   });

//   console.log(completion.choices[0]);
//   res.send(completion.choices[0]);
// });

// app.get('/dungeon', async (req, res) => {
//   const openai = new OpenAI();

//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: 'system',
//         content: '',
//       },
//     ],
//     model: 'gpt-3.5-turbo',
//   });

//   console.log(completion.choices[0]);
//   res.send(completion.choices[0]);
// });

// 'As you cautiously step into the dungeon, the air around you becomes thick and musty. The dimly lit torches barely illuminate the shadowy corners where monsters could be lurking. You hear the echoing of footsteps and the occasional growls from unseen creatures. Your heart races as you see a chest gleaming in the darkness, beckoning you closer with the promise of treasure. With your weapon drawn, you prepare to face whatever challenges and dangers lie ahead, determined to claim the loot within the chest and emerge victorious from the depths of this foreboding dungeon.'
