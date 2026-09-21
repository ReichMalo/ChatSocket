const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 3005;

app.set('view engine', 'twig');
app.set('views', path.join(__dirname));

app.get('/', (req, res) => {
    res.render('page.twig', { title: 'Hey', message: 'Hello there!' })
});

io.on('connection', socket => {
  socket.on('join chat', username => {
    const name = typeof username === 'string' ? username.trim().slice(0, 30) : '';
    if (!name) return;

    socket.data.username = name;
    io.emit('chat message', { username: name, text: `${name} a rejoint le chat.` , system: true });
  });

  socket.on('chat message', message => {
    const text = typeof message === 'string' ? message.trim().slice(0, 500) : '';
    const username = socket.data.username;
    if (!text || !username) return;
    io.emit('chat message', { username, text });
  });
});

httpServer.listen(port, () => {
  console.log(`Chat server listening on http://localhost:${port}`);
});