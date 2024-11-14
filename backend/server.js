const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const waitingClients = []; // Stores unmatched clients


app.use(express.static(path.join(__dirname, 'public')));

app.get('/.well-known/pki-validation/EDE245C398D75E46C508D677D80C17F7.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '.well-known', 'pki-validation', 'EDE245C398D75E46C508D677D80C17F7.txt'));
});

wss.on('connection', (ws) => {
  console.log('New client connected.');

  if (waitingClients.length > 0) {
    // If there's a waiting client, pair them
    const partner = waitingClients.pop();
    ws.partner = partner;
    partner.partner = ws;

    // Notify both clients they are matched
    ws.send(JSON.stringify({ type: 'matched' }));
    partner.send(JSON.stringify({ type: 'matched' }));
  } else {
    // If no waiting client, add this one to the queue
    waitingClients.push(ws);
  }

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const partner = ws.partner;

      if (partner && partner.readyState === WebSocket.OPEN) {
        // Forward signaling messages to the partner
        partner.send(JSON.stringify(parsedMessage));
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
    // Remove from waiting clients if in the queue
    const index = waitingClients.indexOf(ws);
    if (index !== -1) waitingClients.splice(index, 1);

    // Notify partner if matched
    if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
      ws.partner.send(JSON.stringify({ type: 'partnerDisconnected' }));
      ws.partner.partner = null;
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});









