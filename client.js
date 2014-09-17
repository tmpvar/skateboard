var Skateboard = require('./skateboard');

module.exports = function(wshref, fn) {

  if (typeof fn === 'undefined') {
    if (typeof wshref === 'function') {
      fn = wshref
      wshref = null;
    }
  }

  if (!wshref) {
    // calculate the websocket addr
    wshref = window.location.protocol;
    wshref += '://' + window.location.host + '/skateboard';
  }

  wshref = wshref.replace(/http(s?):/, 'ws$1:').replace(/:+/g, ':');

  var socket = new WebSocket(wshref);
  socket.binaryType = "arraybuffer";
  var skateboard = new Skateboard(socket, true);
  var timer;

  var handleReconnect = function() {
    clearTimeout(timer);
    var tmp = new WebSocket(wshref);
    tmp.onopen = function() {
      clearTimeout(timer);
      skateboard.socket = tmp;
      skateboard.socket.binaryType = "arraybuffer";
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
  socket.onerror = handleReconnect;

  skateboard.once('connection', function() {
     fn && fn(skateboard);
  });

  return skateboard;
};

if (typeof window !== 'undefined') {
  window.skateboard = module.exports;
}
