// websocket.js
const WebSocket = require('ws');
const waitingClients = []; // Stores unmatched clients

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

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

        if (parsedMessage.type === 'next') {
          console.log('Client requested to find a new match.');

          // Disconnect from current partner if exists
          if (partner && partner.readyState === WebSocket.OPEN) {
            partner.send(JSON.stringify({ type: 'partnerDisconnected' }));
            partner.partner = null;
          }

          // Remove this client from the queue if already waiting
          const index = waitingClients.indexOf(ws);
          if (index !== -1) waitingClients.splice(index, 1);

          // Reset the current client and place back in queue
          ws.partner = null;
          if (waitingClients.length > 0) {
            // Match with another waiting client
            const newPartner = waitingClients.pop();
            ws.partner = newPartner;
            newPartner.partner = ws;

            // Notify both clients they are matched
            ws.send(JSON.stringify({ type: 'matched' }));
            newPartner.send(JSON.stringify({ type: 'matched' }));
          } else {
            // Add to queue if no waiting clients
            waitingClients.push(ws);
          }
        } else if (partner && partner.readyState === WebSocket.OPEN) {
          // Forward other signaling messages to the partner
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
}

module.exports = setupWebSocket;
