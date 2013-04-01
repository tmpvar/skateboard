var Skateboard = require('./skateboard');

module.exports = function(fn) {

  // calculate the websocket addr
  var wshref = ''
  wshref = (window.location.protocol === 'https') ? 'wss' : 'ws';
  wshref += '://' + window.location.host + '/skateboard';

  var socket = new WebSocket(wshref);
  var skateboard = new Skateboard(socket, true);

  socket.onclose = function() {
    var timer = setTimeout(function retry() {
      var tmp = new WebSocket(wshref);
      tmp.onopen = function() {
        clearTimeout(timer);
        skateboard.socket = tmp;
        skateboard.setupBindings();
      };

      tmp.onerror = function() {
        clearTimeout(timer);
        timer = setTimeout(retry, 250)
      };

      timer = setTimeout(retry, 250);
    }, 250);
  }

  skateboard.once('connection', function() {
     fn && fn(skateboard);
  });
};

if (typeof window !== 'undefined') {
  window.skateboard = module.exports;
}