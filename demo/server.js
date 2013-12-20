
require('../')({ dir: __dirname + '/public'}, function(stream) {
  
  console.log('connection');

  var start = Date.now();
  stream.write('ping');

  stream.on('data', function(d) {
    //console.log('latency:', (Date.now() - start) + 'ms');
    start = Date.now();
    stream.write('ping');
  });
});
