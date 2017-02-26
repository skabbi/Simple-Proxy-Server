'use strict';
const restify = require('restify');
const server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));

server.get('/message', function(req, res, next) {
  const body = '<html><body><h1>Received resource 1</h1></body></html>';
  
  res.set('Content-Length', Buffer.byteLength(body));
  res.set('Content-Type', 'text/html');

  res.write(body);
  res.end();
  return next();
});

server.listen(3001, function() {
  console.log('Resource 1 started up on port 3001');
});