var Skateboard = require('./skateboard');

module.exports = function(fn) {

  // calculate the websocket addr
  var wshref = ''
  wshref = (window.location.protocol === 'https') ? 'wss' : 'ws';
  wshref += '://' + window.location.host;

  var socket = new WebSocket(wshref);
  return new Skateboard(socket);
};

if (typeof window !== 'undefined') {
  window.skateboard = module.exports;
}