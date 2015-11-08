#!/usr/bin/env node
'use strict';

var meow = require('meow'),
    picoProxy = require('../lib');

var cli = meow(`
  Usage
    $ pico-proxy

  Options
    --target hostname or ip to the target server defaults to 127.0.0.1
    --port port to listen to for the proxy server defaults to 8080
    --target-protocol protocol used for the outgoing requests to the target, defaults to http
    --protocol protocol used when creating the proxy server, defaults to http
    --cors if the proxy server should handle CORS requests, defaults to true

  Examples
    $ pico-proxy --port 3333 --protocol http --target api.hostname.com --target-protocol https --cors true
    🌈 unicorns 🌈
  `
);
console.log(cli.flags);
picoProxy(cli.flags).listen(cli.flags.port);
