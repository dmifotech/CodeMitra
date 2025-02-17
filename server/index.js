const express = require('express');
const server = express();
const indexRoutes = require('./routes/indexRoutes.js');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;

server.use(express.json());
server.use(cors({ origin: "http://127.0.0.1:5500" }));
server.use(express.static('public'));


server.get('/', (req, res) => {
  res.json('Hello World!');
});
server.use("/", indexRoutes);


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});