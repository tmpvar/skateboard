var st = require('st'),
    ws = require('ws'),
    http = require('http'),
    fs = require('fs'),
    Skateboard = require('./skateboard');



module.exports = function(obj, fn) {
  if (!fn && typeof obj === 'function') {
    fn = obj;
    obj = {
      dir : './public'
    };
  }

  var staticHandler = st({
    path: obj.dir,
    url: '/',
    cache: false,
    index: obj.index || 'index.html',
    passthrough: !!obj.requestHandler
  });

  obj.requestHandler = obj.requestHandler || function() {};

  var httpServer = http.createServer(function(req, res) {
    var url = req.url;
    if (url.indexOf('skateboard.min.js') > -1) {
      res.writeHead(200, {
        'Content-type' : 'text/javascript'
      });

      fs.createReadStream(__dirname + '/skateboard.min.js').pipe(res);

    } else {
      staticHandler(req, res, function() {
        req.url = url;
        obj.requestHandler(req, res);
      });
    }
  });

  var websocketServer = new ws.Server({ server: httpServer });
  websocketServer.on('connection', function(socket) {
    fn(new Skateboard(socket));
  });

  httpServer.listen(obj.port || 8080);
};
