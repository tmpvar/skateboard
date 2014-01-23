var Stream = require('stream').Stream;
    util = require('util')

function Skateboard(socket, reconnect) {
  Stream.apply(this, arguments);

  this.socket = socket;
  this.readable = true;
  this.writable = true;

  var that = this;

  var on = function(name, fn) {
    if (this.socket.on) {
      this.socket.on(name, fn);
    } else {
      this.socket['on' + name] = fn;
    }
  }.bind(this);

  this.setupBindings = function() {

    on('message', function(message) {
      if (message && (message.data || message.srcElement) && message instanceof MessageEvent) {
        message = message.data;
      } else if (typeof message.initMessageEvent === 'function') {
        message = message.data;
      }

      that.emit('data', message);
    });

    if (!reconnect) {
      on('close', function() {
        that.emit('end');
      });
    }

    on('error', function(err) {
      if (typeof Event !== 'undefined' && !(err instanceof Event)) {
        that.emit('error', err);
      }
    });

    var handleConnection = function() {
      that.emit('connection');
    };

    on('open', handleConnection);
    on('connection', handleConnection);
  };

  this.setupBindings();
}

util.inherits(Skateboard, Stream);

Skateboard.prototype.write = function(d) {
  try {
    if (this.socket.write) {
      this.socket.write(d);
    } else {
      this.socket.send(d);
    }
  } catch (e) {
    return false;
  }
};

Skateboard.prototype.end = function() {
  this.emit('end');
};

module.exports = Skateboard;
