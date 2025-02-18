const express = require('express');
const server = express();
const indexRoutes = require('./routes/indexRoutes.js');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;

server.use(express.json());
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
server.use(express.static('public'));


server.get('/', (req, res) => {
  res.json('Hello World!');
});
server.use("/", indexRoutes);


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});