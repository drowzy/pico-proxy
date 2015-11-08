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

  Examples
    $ pico-proxy --port 3333 --protocol http --target http://api.hostname.com --cors true
  `
);

picoProxy(cli.flags).listen(cli.flags.port);
