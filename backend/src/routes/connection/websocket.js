const WebSocket = require('ws');
const waitingClients = new Map(); // Using Map for O(1) lookups
let connectionCount = 0;

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  // Heartbeat to detect stale connections
  function heartbeat() {
    this.isAlive = true;
  }

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log('Terminating stale connection');
        removeFromQueue(ws);
        notifyPartnerOnDisconnect(ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  wss.on('connection', (ws) => {
    connectionCount++;
    ws.isAlive = true;
    ws.id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    console.log(`New client connected. Total connections: ${connectionCount}`);

    ws.on('pong', heartbeat);

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        
        switch(parsedMessage.type) {
          case 'auth':
            ws.user = parsedMessage.userPreferences;
            matchClient(ws);
            break;
            
          case 'next':
            handleNextRequest(ws);
            break;
            
          case 'ice-candidate':
          case 'offer':
          case 'answer':
            if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
              ws.partner.send(JSON.stringify(parsedMessage));
            }
            break;
            
          default:
            console.warn(`Unknown message type: ${parsedMessage.type}`);
        }
      } catch (error) {
        console.error('Error handling message:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Failed to process message' 
        }));
      }
    });

    ws.on('close', () => {
      connectionCount--;
      console.log(`Client disconnected. Total connections: ${connectionCount}`);
      removeFromQueue(ws);
      notifyPartnerOnDisconnect(ws);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${ws.id}:`, error);
      removeFromQueue(ws);
      notifyPartnerOnDisconnect(ws);
    });
  });

  function matchClient(ws) {
    if (!ws.user) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'User preferences not set' 
      }));
      return;
    }

    const { gender, lookingFor } = ws.user;
    console.log(`Matching client - Gender: ${gender}, Looking for: ${lookingFor}`);

    // Find a suitable partner
    for (const [id, client] of waitingClients) {
      const partnerGender = client.user.gender;
      const partnerLookingFor = client.user.lookingFor;

      if ((partnerLookingFor === gender || partnerLookingFor === 'any') &&
          (lookingFor === partnerGender || lookingFor === 'any')) {
        
        waitingClients.delete(id);
        ws.partner = client;
        client.partner = ws;

        // Notify both clients they are matched
        ws.send(JSON.stringify({ 
          type: 'matched',
          partner: { 
            name: client.user.name,
            gender: client.user.gender 
          }
        }));
        client.send(JSON.stringify({ 
          type: 'matched',
          partner: { 
            name: ws.user.name,
            gender: ws.user.gender 
          }
        }));
        return;
      }
    }

    // No match found
    waitingClients.set(ws.id, ws);
    ws.send(JSON.stringify({ 
      type: 'waiting',
      message: 'Waiting for a match' 
    }));
  }

  function handleNextRequest(ws) {
    console.log(`Client ${ws.id} requested new match`);
    
    if (ws.partner) {
      const partner = ws.partner;
      if (partner.readyState === WebSocket.OPEN) {
        partner.send(JSON.stringify({ 
          type: 'partnerDisconnected',
          message: 'Partner requested new match'
        }));
        partner.partner = null;
      }
      ws.partner = null;
    }

    removeFromQueue(ws);
    matchClient(ws);
  }

  function removeFromQueue(ws) {
    if (ws.id && waitingClients.has(ws.id)) {
      waitingClients.delete(ws.id);
      console.log(`Removed client ${ws.id} from queue`);
    }
  }

  function notifyPartnerOnDisconnect(ws) {
    if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
      ws.partner.send(JSON.stringify({ 
        type: 'partnerDisconnected',
        message: 'Partner disconnected'
      }));
      ws.partner.partner = null;
    }
  }
}

module.exports = setupWebSocket;


// // websocket.js
// const WebSocket = require('ws');
// const waitingClients = []; // Stores unmatched clients

// function setupWebSocket(server) {
//   const wss = new WebSocket.Server({ server });

//   wss.on('connection', (ws) => {
//     //console.log('New client connected.');

//     if (waitingClients.length > 0) {
//       // If there's a waiting client, pair them
//       const partner = waitingClients.pop();
//       ws.partner = partner;
//       partner.partner = ws;

//       // Notify both clients they are matched
//       ws.send(JSON.stringify({ type: 'matched' }));
//       partner.send(JSON.stringify({ type: 'matched' }));
//     } else {
//       // If no waiting client, add this one to the queue
//       waitingClients.push(ws);
//     }

//     ws.on('message', (message) => {

      
//       try {
//         const parsedMessage = JSON.parse(message);
//         //console.log("This is the message?",parsedMessage);
//         const partner = ws.partner;

//         if (parsedMessage.type === 'next') {
//           //console.log('Client requested to find a new match.');

//           // Disconnect from current partner if exists
//           if (partner && partner.readyState === WebSocket.OPEN) {
//             partner.send(JSON.stringify({ type: 'partnerDisconnected' }));
//             partner.partner = null;
//           }

//           // Remove this client from the queue if already waiting
//           const index = waitingClients.indexOf(ws);
//           if (index !== -1) waitingClients.splice(index, 1);

//           // Reset the current client and place back in queue
//           ws.partner = null;
//           if (waitingClients.length > 0) {
//             // Match with another waiting client
//             const newPartner = waitingClients.pop();
//             ws.partner = newPartner;
//             newPartner.partner = ws;

//             // Notify both clients they are matched
//             ws.send(JSON.stringify({ type: 'matched' }));
//             newPartner.send(JSON.stringify({ type: 'matched' }));
//           } else {
//             // Add to queue if no waiting clients
//             waitingClients.push(ws);
//           }
//         } else if (partner && partner.readyState === WebSocket.OPEN) {
//           // Forward other signaling messages to the partner
//           partner.send(JSON.stringify(parsedMessage));
//         }
//       } catch (error) {
//         console.error('Error handling message:', error);
//       }
//     });

//     ws.on('close', () => {
//       //console.log('Client disconnected.');
//       // Remove from waiting clients if in the queue
//       const index = waitingClients.indexOf(ws);
//       if (index !== -1) waitingClients.splice(index, 1);

//       // Notify partner if matched
//       if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
//         ws.partner.send(JSON.stringify({ type: 'partnerDisconnected' }));
//         ws.partner.partner = null;
//       }
//     });
//   });
// }

// module.exports = setupWebSocket;
