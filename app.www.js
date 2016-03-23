var express    = require('express');
var app        = express();

// ENV Variables

process.title = 'WWW Capture You';
var port = process.env.PORT || 8000;
global.PORT = port;
global.app = app;
global.apiCall = 'http://localhost:8010'

require('./general/log.js');
require('./general/CallError.js');
logs.info('Establishing HTTP server on port ' + global.PORT);
var http = require('http');

function listen() {
  try {
    global.httpServer = http.Server(app);
    global.httpServer.listen(global.PORT);
  } catch (e) {
    return process.exit(1);
  }
  global.httpServer.on('listening', function () {
    logs.info('HTTP Server is running on port ' + global.PORT);
    start();
  });
  global.httpServer.on('error', function (err) {
    return process.exit(1);
  });
}
listen();

function start() {
  // set routes
  require('./general/routes.js')();
}
