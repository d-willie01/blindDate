// server.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const setupWebSocket = require('./routes/connection/websocket');
const mongoose = require('mongoose');
const { expressjwt: expressJwt } = require('express-jwt')
const authRouter = require('./routes/auth/index');
const userRouter = require('../src/routes/users/index'
)
const cors = require('cors');
const app = express();
const server = http.createServer(app);

// Middleware to parse JSON
app.use(express.json());



// Set up WebSocket route
setupWebSocket(server);

dotenv.config(); // Load environment variables
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());


//function to decide which routes do not need JWT
var jwtFilter = function (req) {
  console.log(req.path);
  if (req.path.includes("/auth")) {
    return true;
  }
  return false;
};


//filter for requiring JWT when hitting a route
app.use(expressJwt({ secret: process.env.JWT_SECRET_KEY, algorithms:["HS256"] })
  .unless(jwtFilter));

  //error message to user, no JWT
  app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      console.error(err);
      res.status(401).send({ error: "invalid_token" });
    } else {
      next(err);
    }
  });

app.use('/auth', authRouter);
app.use('/user', userRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});










