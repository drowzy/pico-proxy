'use strict';

var protocol = {
  http: require('http'),
  https: require('https')
};

var url = require('url');

function corsHeaders() {
  return [
    'Access-Control-Allow-Origin',
    'Access-Control-Request-Method',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ].reduce(function (headers, method) {
    headers[method] = '*';

    return headers;
  }, {});
}

function PicoProxy(options) {
  options = options || {};

  if (!(this instanceof PicoProxy)) {
    return new PicoProxy(options);
  }

  this._target = url.parse(options.target || '127.0.0.1');
  this._protocol = options.protocol || 'http';
  this._targetProtocol = options.targetProtocol || 'http';
  this._hasCors = options.cors || true;

  this._proxy = this.createServer(function (req, res) {
    var request = protocol[this._protocol].request(this.createRequestOptions(req), function (serverRes) {
      res.writeHead(serverRes.statusCode, serverRes.headers);
      serverRes.pipe(res, { end: true });
    });

    req.pipe(request, { end: true });
  }.bind(this));

  return this;
}

PicoProxy.prototype.createRequestOptions = function (req) {
  var requestUrl = url.parse(req.url);
  var requestOptions = {
    method: req.method,
    hostname: this._target.hostname,
    path: this._target.path + requestUrl.path
  };

  Object.keys(req.headers)
    .forEach(function (header) {
      requestOptions[header] = header === 'host' ? requestOptions.hostname : req.headers[header];
    });

  return requestOptions;
};

PicoProxy.prototype.listen = function (port, cb) {
  port = port || 8080;
  this._proxy.listen(port, cb);

  return this;
};

PicoProxy.prototype.close = function () {
  this._proxy.close();
};


PicoProxy.prototype.createServer = function (cb) {
  return protocol[this._protocol].createServer(function (req, res) {
    if (this._hasCors && req.method.toLowerCase() === 'options') {
      res.writeHead(200, corsHeaders());
      return res.end();
    }

    cb(req, res);
  }.bind(this));
};

exports = module.exports = PicoProxy;
