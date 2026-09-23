import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const prisma = new PrismaClient();
const port = Number(process.env.PORT) || 3005;

app.set('view engine', 'twig');
app.set('views', __dirname);

app.get('/', (req, res) => {
  res.render('page.twig', { title: 'Chat' });
});

app.get('/chatSocket.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatSocket.js'));
});

const cleanUsername = username => (
  typeof username === 'string' ? username.trim().slice(0, 30) : ''
);

const cleanText = text => (
  typeof text === 'string' ? text.trim().slice(0, 500) : ''
);

const toMessage = message => ({
  username: message.username,
  text: message.text,
  system: message.system,
  createdAt: message.createdAt.toISOString()
});

const saveMessage = async ({ username, text, system = false }) => {
  const message = await prisma.message.create({
    data: { username, text, system }
  });
  return toMessage(message);
};

io.on('connection', async socket => {
  try {
    const history = await prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
      take: 100
    });
    socket.emit('chat history', history.map(toMessage));
  } catch (error) {
    console.error('Unable to load chat history:', error);
    socket.emit('chat error', "L'historique est momentanement indisponible.");
  }

  socket.on('join chat', async username => {
    const name = cleanUsername(username);
    if (!name || socket.data.username) return;

    socket.data.username = name;
    try {
      const message = await saveMessage({
        username: name,
        text: `${name} a rejoint le chat.`,
        system: true
      });
      io.emit('chat message', message);
    } catch (error) {
      console.error('Unable to save join event:', error);
    }
  });

  socket.on('chat message', async text => {
    const messageText = cleanText(text);
    const username = socket.data.username;
    if (!messageText || !username) return;

    try {
      const message = await saveMessage({ username, text: messageText });
      io.emit('chat message', message);
    } catch (error) {
      console.error('Unable to save chat message:', error);
      socket.emit('chat error', "Votre message n'a pas pu etre enregistre.");
    }
  });
});

const start = async () => {
  await prisma.$connect();
  httpServer.listen(port, () => {
    console.log(`Chat server listening on http://localhost:${port}`);
  });
};

start().catch(async error => {
  console.error('Unable to start chat server:', error);
  await prisma.$disconnect();
  process.exit(1);
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);