
require('../')({ dir: __dirname + '/public'}, function(stream, params) {

  console.log('connection', params);

  var start = Date.now();
  stream.write('ping');

  stream.on('data', function(d) {
    //console.log('latency:', (Date.now() - start) + 'ms');
    start = Date.now();
    stream.write(new Buffer([0xBE, 0xEF]));
  });
});
