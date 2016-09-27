var Stream = require('stream').Stream;
var util = require('util');

function Skateboard(socket, reconnect) {
  Stream.apply(this, arguments);

  this.reconnect = reconnect;
  this.socket = socket;
  this.readable = true;
  this.writable = true;

  var that = this;

  function on(name, fn) {
    that.socket.on(name, fn);
  }

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
        setImmediate(function () {
          that.emit('end')
        })
      });
    }

    this.close = function forceClose() {
      that.reconnect = false;
      that.socket.close();
    };

    on('error', function(err) {
      if (err && err.type === 'TransportError') {
        that.emit('transport-error', err);
      } else {
        that.emit('error', err);
      }
    });

    on('open', this.emit.bind(this, 'connection'));
  };

  this.setupBindings();
}

util.inherits(Skateboard, Stream);

Skateboard.prototype.write = function(d) {
  this.socket.send(d);
};

Skateboard.prototype.end = function() {
  this.emit('end');
};

module.exports = Skateboard;
