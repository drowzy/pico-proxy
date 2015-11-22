# pico-proxy [![NPM version][npm-image]][npm-url]
> Tiny http proxy for interacting with cross-domain APIs without CORS


## Install

```sh
$ npm install -g pico-proxy
```


## Usage

```js
var picoProxy = require('pico-proxy');

var proxy = picoProxy({ target: 'http://api.domain.com' }).listen(3000);

/* All requests to http://127.0.0.1:3000 will be proxied to http://api.domain.com */
```

## CLI

```
$ pico-proxy --help                    

Usage
  $ pico-proxy <target>

Options
  --target hostname or ip to the target server, defaults to http://127.0.0.1
  --port port to listen to for the proxy server, defaults to 8080
  --protocol protocol used when creating the proxy server, defaults to http
  --cors if the proxy server should handle CORS requests, defaults to true

Examples
  $ pico-proxy --port 3333 --protocol http --target http://api.hostname.com --cors true
```
[npm-image]: https://badge.fury.io/js/pico-proxy.svg
[npm-url]: https://npmjs.org/package/pico-proxy
