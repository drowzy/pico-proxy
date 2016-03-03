'use strict';

var protocol = {
  http: require('http'),
  https: require('https')
};

var url = require('url');

function corsHeaders(overrides) {
  return [
    'Access-Control-Allow-Origin',
    'Access-Control-Request-Method',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ].reduce(function (headers, method) {
    headers[method] = overrides[method] || '*';

    return headers;
  }, {});
}

function PicoProxy(options) {
  options = options || {};

  if (!(this instanceof PicoProxy)) {
    return new PicoProxy(options);
  }

  this._target = url.parse(options.target || 'http://127.0.0.1');
  this._protocol = options.protocol || 'http';
  this._targetProtocol = this._target.protocol.slice(0, -1);
  this._cors = options.cors || true;
  this._corsOverrides = {
    'Access-Control-Allow-Headers': options.allowHeaders || '*',
    'Access-Control-Allow-Methods': options.allowMethods || '*',
  };

  this._proxy = this.createServer(function (req, res) {
    var request = protocol[this._protocol].request(this.createRequestOptions(req), function (serverRes) {
      if (this._cors) {
        serverRes.headers['Access-Control-Allow-Origin'] = '*'
      }

      res.writeHead(serverRes.statusCode, serverRes.headers);
      serverRes.pipe(res, { end: true });
    }.bind(this));

    req.pipe(request, { end: true });
  }.bind(this));

  return this;
}

PicoProxy.prototype.createRequestOptions = function (req) {
  var requestUrl = url.parse(req.url);

  return {
    method: req.method,
    hostname: this._target.hostname,
    port: this._target.port,
    path: requestUrl.path,
    headers: Object.keys(req.headers).reduce(function (reqHeaders, header) {
      reqHeaders[header] = header === 'host' ? this._target.hostname : req.headers[header];

      return reqHeaders;
    }.bind(this), {})
  };
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
    if (this._cors) {
      res.writeHead(200, corsHeaders(this._corsOverrides));
    }

    if (this._cors && req.method.toLowerCase() === 'options') {
      return res.end();
    }

    cb(req, res);
  }.bind(this));
};

exports = module.exports = PicoProxy;
