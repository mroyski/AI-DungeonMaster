require('dotenv-flow').config();
const express = require('express');
const { createServer } = require('node:http');
const cors = require('cors');
const { connectInMemory } = require('./db/seed');
const routes = require('./routes');
const socketHandler = require('./socketHandler');

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

// Middleware
app.use(cors());
app.use(express.json());

// Make io available to controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/', routes);

// Socket handling
socketHandler(io);

// Start server
connectInMemory().then(() => {
  server.listen(PORT, () =>
    console.log(`server running at http://localhost:${PORT}`)
  );
});