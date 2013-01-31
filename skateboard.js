var Stream = require('stream').Stream;
    util = require('util')

function Skateboard(socket) {
  Stream.apply(this, arguments);

  this.socket = socket;
  this.readable = true;
  this.writable = true;

  var that = this;

  var on = function(name, fn) {
    if (socket.on) {
      socket.on(name, fn);
    } else {
      socket['on' + name] = fn;
    }
  };

  on('message', function(message) {
    if (message && message.srcElement && message instanceof MessageEvent) {
      message = message.data;
    }

    that.emit('data', message);
  });

  on('close', function() {
    that.emit('end');
  });

  on('error', function(err) {
    that.emit('error', err);
  });

  var handleConnection = function() {
    socket.send('hello!');
    that.emit('connection');
  };

  on('open', handleConnection);
  on('connection', handleConnection);
}

util.inherits(Skateboard, Stream);

Skateboard.prototype.write = function(d) {
  try {
    this.socket.send(d);
  } catch (e) {
    this.emit('error', e);
  }
};

module.exports = Skateboard;