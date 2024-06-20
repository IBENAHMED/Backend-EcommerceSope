// api/index.js
const serverless = require('serverless-http');
const app = require('../index'); // Adjust path if your server.js is in a different location

module.exports = app;  // For local testing
module.exports.handler = serverless(app);  //