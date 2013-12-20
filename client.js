var Skateboard = require('./skateboard');

module.exports = function(fn) {

  // calculate the websocket addr
  var wshref = ''
  wshref = (window.location.protocol === 'https') ? 'wss' : 'ws';
  wshref += '://' + window.location.host + '/skateboard';

  var socket = new WebSocket(wshref);
  var skateboard = new Skateboard(socket, true);
  var timer;
  
  var handleReconnect = function() {
    clearTimeout(timer);
    var tmp = new WebSocket(wshref);
    tmp.onopen = function() {
      clearTimeout(timer);
      skateboard.socket = tmp;
      skateboard.socket.onclose = handleReconnect;
      skateboard.socket.onerror = handleReconnect;
      skateboard.setupBindings();
    };

    tmp.onclose = tmp.onerror = function() {
      clearTimeout(timer);
      timer = setTimeout(handleReconnect, 250);
    };
  };

  socket.onclose = handleReconnect;
  socket.onerror = handleReconnect

  skateboard.once('connection', function() {
     fn && fn(skateboard);
  });

  return skateboard;
};

if (typeof window !== 'undefined') {
  window.skateboard = module.exports;
}