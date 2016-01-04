# skateboard

Quickly create a stream from the browser to the server with engine.io

## Use

`npm install skateboard`


```javascript
// server.js
var skateboard = require('skateboard');
skateboard({
  dir: __dirname + '/public',          // default (optional)
  port : 8080,                         // default (optional)
  transports: ['polling', 'websocket'] // default (optional)
  // requestHandler: function(req, res) {} -- fallback request handler
}, function(stream) {
  var start = Date.now();
  stream.write('ping');

  stream.on('data', function() {
    console.log('latency:', (Date.now() - start) + 'ms');
  });
});

```

skateboard([`wshref` [, `fn`]])

* `wshref` - optional cross domain skateboard to connect to
* `fn` - optional connection handler. first argument is a duplex `stream`

```html
<!-- public/index.html -->
<html>
<head>
  <script type="text/javascript" src="skateboard.min.js"></script>
</head>
<body>

<script type="text/javascript">
  skateboard().on('data', function(d) {
    this.write(d);
  });

  // or
  // skateboard(function(stream) {
  //   stream.on('data', function(d) {
  //     stream.write(d);
  //   });
  // });
  //
</script>

</body>
</html>

```

### client events

* `connection` - emitted on the first connection
* `disconnection` - emitted whenever the connection disconnects
* `reconnection` - emitted whenever a new connection is established

## License

MIT
