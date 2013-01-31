# skateboard

Quickly create a pipe from the client to the server

## Use

`npm install skateboard`


```javascript

var skateboard = require('skateboard');
skateboard({
  __dirname + '/public',  // default (optional)
  port : 8080,            // default (optional)
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
  <script type="text/javascript" src="skateboard.js"></script>
</head>
<body>

<script type="text/javascript">
  var stream = skateboard();
  stream.on('data', function(d) {
    stream.write('data', d);
  });
</script>

</body>
</html>

```

## License

MIT