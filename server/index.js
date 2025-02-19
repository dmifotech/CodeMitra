const express = require('express');
const server = express();
const indexRoutes = require('./routes/indexRoutes.js');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;


server.use(express.json());
server.use(cors({ origin: "https://itservice.dmifotech.com" }));
server.use(express.static('public'));


server.get('/', (req, res) => {
  res.json('Hello World!');
});
server.use("/", indexRoutes)
server.use('/auth', authRoutes);
server.use('/client', clientRoutes);
server.use('/developer', developerRoutes);
server.use('/admin', adminRoutes);;


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});