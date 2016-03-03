#!/usr/bin/env node
'use strict';

var meow = require('meow'),
    picoProxy = require('../lib');

var cli = meow(`
  Usage
    $ pico-proxy

  Options
    --target hostname or ip to the target server defaults to http://127.0.0.1
    --port port to listen to for the proxy server defaults to 8080
    --protocol protocol used when creating the proxy server, defaults to http
    --cors if the proxy server should handle CORS requests, defaults to true
    --allow-headers overrides for Access-Control-Allow-Headers, defaluts to '*'
    --allow-methods overrides for Access-Control-Allow-Methods, defaults to '*'
    --allow-origin overrides for Access-Control-Allow-Origin, defaults to '*'

  allow overrides with more than one argument is a string seperated by ',' e.g --allow-headers "Content-type,X-Session-cookie"
  Examples
    $ pico-proxy --port 3333 --protocol http --target http://api.hostname.com --cors true --allow-headers "Content-type,X-Sessioncookie"
  `
);

picoProxy(cli.flags).listen(cli.flags.port);
