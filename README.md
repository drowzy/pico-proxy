# pico-proxy [![NPM version][npm-image]][npm-url]
> Tiny http proxy for interacting with cross-domain APIs without CORS


## Install

```sh
$ npm install --save pico-proxy
```


## Usage

```js
var picoProxy = require('pico-proxy');

var proxy = picoProxy({ target: 'http://api.domain.com' });
```
[npm-image]: https://badge.fury.io/js/pico-proxy.svg
[npm-url]: https://npmjs.org/package/pico-proxy
