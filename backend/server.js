const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

// WebSocket server connection handler
wss.on('connection', (ws) => {
  console.log('New client connected.');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());


    // If it's a signaling message (offer, answer, candidate), forward to all clients
    try {
      const parsedMessage = JSON.parse(message);
      console.log(parsedMessage.type)
      if (parsedMessage.type === 'offer' || parsedMessage.type === 'answer' || parsedMessage.type === 'candidate') {
        // Forward signaling messages to other clients
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedMessage)); // Forward signaling message
          }
        });
      }
    } catch (error) {
      console.log('Received non-signaling message:', error);
    }

  });

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});








