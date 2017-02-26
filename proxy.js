'use strict';
const http = require('http');
const restify = require('restify');
const server = restify.createServer();

const httpProxy = require('http-proxy');
const HttpProxyRules = require('http-proxy-rules');
const proxy = httpProxy.createProxy();

// Set up proxy rules instance. The rules are expected prefixes of the request path and
// are removed before proxiyng to a different target.
let proxyRules = new HttpProxyRules({
  rules: {
    '.*/resource1/': 'http://localhost:3001', // Rule (1)
    '.*/resource2/': 'http://localhost:3002'  // Rule (2)
  }
});

// pre() runs before routing occurs; allowing us to proxy requests to different targets.
server.pre(function (req, res, next) {

  // Checks request to see if it matches one of the specified rules
  let target = proxyRules.match(req);
  if (target) {
    return proxy.web(req, res, { "target": target });
  }
  return next();
});

server.get('/message', function(req, res, next) {
  const body = '<html><body><h1>This is the Proxy server</h1></body></html>';
  
  res.set('Content-Length', Buffer.byteLength(body));
  res.set('Content-Type', 'text/html');

  res.write(body);
  res.end();
  return next();
});

server.listen(3000, function() {
  console.log('Proxy server started up on port 3000');
});
