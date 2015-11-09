'use strict';

var expect = require('chai').expect,
    nock = require('nock'),
    http = require('http'),
    picoProxy = require('../lib');

describe('pico-proxy', function () {
  var proxy;
  before(function () {
    proxy = picoProxy({ target: 'http://api.domain.com' }).listen(3000);
  });

  after(function () {
    proxy.close();
  });

  describe('OPTION requests', function() {
    before(function () {
      this.scope = nock('http://api.domain.com')
                   .log(console.log)
                   .get('/')
                   .reply(304);
    });

    after(function () {
      nock.cleanAll();
    });

    it('should intercept OPTIONS requests per default', function (done) {
      var req = http.request({ hostname: '127.0.0.1', port: 3000, method: 'OPTIONS' }, function (res) {
        expect(res.statusCode).to.be.eq(200);
        done();
      });
      req.end();
    });

  });
});
