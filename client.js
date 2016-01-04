var Skateboard = require('./skateboard');
var Socket = require('engine.io-client');

module.exports = function(url, fn) {

  if (typeof fn === 'undefined') {
    if (typeof url === 'function') {
      fn = url;
      url = null;
    }
  }

  var socket = new Socket(url);
  var skateboard = new Skateboard(socket, true);
  var timer;

  function handleReconnect() {
    skateboard.socket.removeAllListeners();

    clearTimeout(timer);

    skateboard.socket = new Socket(url);
    skateboard.socket.on('open', function() {
      skateboard.connected = true;
      clearTimeout(timer);
      skateboard.emit('reconnection');
    });

    skateboard.setupBindings();
    setupSocket();
  }

  function reconnectionTimer() {
    if (skateboard.connected) {
      skateboard.emit('disconnection');
      skateboard.connected = false;
    }

    clearTimeout(timer);
    if (skateboard.reconnect) {
      timer = setTimeout(handleReconnect, 250);
    }
  }

  function setupSocket() {
    skateboard.socket.on('close', reconnectionTimer);
    skateboard.socket.on('error', reconnectionTimer);
  }

  setupSocket();

  skateboard.once('connection', function() {
    skateboard.connected = true;
    if (typeof fn === 'function') {
      fn(skateboard);
    }
  });

  return skateboard;
};

if (typeof window !== 'undefined') {
  window.skateboard = module.exports;
}
