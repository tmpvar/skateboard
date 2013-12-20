# skateboard

Quickly create a pipe from the browser to the server with websockets

## Use

`npm install skateboard`


```javascript
// server.js
var skateboard = require('skateboard');
skateboard({
  dir: __dirname + '/public',  // default (optional)
  port : 8080                  // default (optional)
  // requestHandler: function(req, res) {} -- fallback request handler
}, function(stream) {
  var start = Date.now();
  stream.write('ping');

  stream.on('data', function() {
    console.log('latency:', (Date.now() - start) + 'ms');
  });
});

```

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
  //   stream.write(d);
  // })
  // 
</script>

</body>
</html>

```

## License

MIT
