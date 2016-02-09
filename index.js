var st = require('st');
var createEngine = require('engine.io');
var http = require('http');
var fs = require('fs');
var Skateboard = require('./skateboard');
var qs = require('querystring');
var url = require('url');

var skateboardSrc = fs.readFileSync(__dirname + '/skateboard.min.js').toString();

module.exports = function(obj, fn) {
  if (!fn && typeof obj === 'function') {
    fn = obj;
    obj = {};
  }

  var staticHandler = obj.staticHandler || st({
    path: obj.dir || './public',
    url: obj.url || '/',
    cache: obj.cache || false,
    index: obj.index || 'index.html',
    passthrough: !!obj.requestHandler
  });

  obj.requestHandler = obj.requestHandler || function() {};

  var httpServer = http.createServer(function(req, res) {
    if (req.url.indexOf('skateboard.min.js') > -1) {
      res.writeHead(200, {
        'Content-type' : 'text/javascript'
      });

      res.end(skateboardSrc);

    } else {
      staticHandler(req, res, function() {
        obj.requestHandler(req, res);
      });
    }
  });

  if (typeof obj.listening === 'function') {
    httpServer.on('listening', obj.listening);
  }

  if (typeof obj.error === 'function') {
    httpServer.on('error', obj.error);
  }

  var engineOptions = {}

  if (obj.transports) {
    engineOptions.transports = obj.transports;
  }

  createEngine(httpServer, engineOptions).on('connection', function(socket) {
    var urlParts = {};
    try {
      urlParts = url.parse(socket.request.url, true);
    } catch(e) {}

    var params = {};

    fn(new Skateboard(socket), urlParts.query || {});
  });

  var port = 8080;
  if (typeof obj.port !== 'undefined') {
    port = obj.port;
  }

  httpServer.listen(port, obj.interface);
  return httpServer;
};
