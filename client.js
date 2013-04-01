var Skateboard = require('./skateboard');

module.exports = function(fn) {

  // calculate the websocket addr
  var wshref = ''
  wshref = (window.location.protocol === 'https') ? 'wss' : 'ws';
  wshref += '://' + window.location.host + '/skateboard';

  var socket = new WebSocket(wshref);
  var skateboard = new Skateboard(socket);
  skateboard.on('connection', function() {
     fn && fn(skateboard);
  });
};

if (typeof window !== 'undefined') {
  window.skateboard = module.exports;
}