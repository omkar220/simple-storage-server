'use strict';

// ✅ MUST be first
require('dotenv').config();  

// Load server
const server = require('./lib/server');

// Start backend
server.start();
