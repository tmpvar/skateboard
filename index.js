var st = require('st'),
    ws = require('ws'),
    http = require('http'),
    fs = require('fs'),
    Skateboard = require('./skateboard'),
    qs = require('querystring'),
    url = require('url');

module.exports = function(obj, fn) {
  if (!fn && typeof obj === 'function') {
    fn = obj;
    obj = {};
  }

  var staticHandler = st({
    path: obj.dir || './public',
    url: '/',
    cache: false,
    index: obj.index || 'index.html',
    passthrough: !!obj.requestHandler
  });

  obj.requestHandler = obj.requestHandler || function() {};

  var httpServer = http.createServer(function(req, res) {
    if (req.url.indexOf('skateboard.min.js') > -1) {
      res.writeHead(200, {
        'Content-type' : 'text/javascript'
      });

      fs.createReadStream(__dirname + '/skateboard.min.js').pipe(res);

    } else {
      staticHandler(req, res, function() {
        obj.requestHandler(req, res);
      });
    }
  });

  var websocketServer = new ws.Server({ server: httpServer });
  websocketServer.on('connection', function(socket) {

    var urlParts = {};
    try {
      urlParts = url.parse(socket.upgradeReq.url, true);
    } catch(e) {}

    var params = {};

    fn(new Skateboard(socket), urlParts.query || {});
  });

  httpServer.listen(obj.port || 8080);
};
