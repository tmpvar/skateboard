var st = require('st'),
    ws = require('ws'),
    http = require('http'),
    fs = require('fs'),
    Skateboard = require('./skateboard');



module.exports = function(obj, fn) {
  if (!fn && typeof obj === 'function') {
    fn = obj;
    obj = {};
  }

  var staticHandler = st({
    path: obj.dir,
    url: '/',
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
      !staticHandler(req, res) && obj.requestHandler(req, res);
    }
  });

  var websocketServer = new ws.Server({ server: httpServer });
  websocketServer.on('connection', function(socket) {
    fn(new Skateboard(socket));
  });

  httpServer.listen(obj.port || 8080);
};
