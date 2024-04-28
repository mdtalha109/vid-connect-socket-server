const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-room', (roomId, userId) => {
    console.log(`a new user ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
  });

  socket.on('user-toggle-audio', (userId, roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-toggle-audio', userId);
  });

  socket.on('user-toggle-video', (userId, roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-toggle-video', userId);
  });

  socket.on('user-leave', (userId, roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-leave', userId);
  });
});

app.all('*', (req, res) => {
  res.json({"message": "socket server is live"})
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});

