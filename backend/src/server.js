// server.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const setupWebSocket = require('./routes/connection/websocket');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth/index');
const cors = require('cors');
const app = express();
const server = http.createServer(app);


// Set up WebSocket route
setupWebSocket(server);

dotenv.config(); // Load environment variables
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});










