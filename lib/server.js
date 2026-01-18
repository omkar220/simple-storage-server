'use strict';

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./error-handler');

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/simple-storage';

app.use(cors());
app.use(router);

require('../route/route-auth')(router);
require('../route/route-file')(router);

app.all('/{0,}', (req, res) =>
  errorHandler(new Error('Path Error, Not Found'), res)
);

const server = {};

server.start = () => {
  return new Promise((resolve, reject) => {
    if (server.isOn)
      return reject(new Error('Server already running'));

    server.http = app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
      server.isOn = true;

      mongoose.connect(MONGODB_URI)
        .then(()=> console.log("MongoDB connected"))
        .catch(err => console.log("Mongo error:", err));

      resolve(server);
    });
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if (!server.isOn)
      return reject(new Error('Server not running'));

    server.http.close(() => {
      server.isOn = false;
      mongoose.disconnect();
      resolve();
    });
  });
};

module.exports = server;
