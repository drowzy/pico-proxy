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

  describe('requests', function () {
    before(function () {
      nock('http://api.domain.com')
        .get('/').reply(200, 'data')
        .post('/upload').reply(201, 'data');
    });

    after(function () {
      nock.cleanAll();
    });

    it('should intercept OPTIONS requests per default', function (done) {
      http.request({ hostname: '127.0.0.1', port: 3000, method: 'OPTIONS' }, function (res) {
        expect(res.statusCode).to.be.eq(200);
        done();
      }).end();
    });

    it('should send a get request to the target', function (done) {
      http.request({ hostname: '127.0.0.1', port: 3000, method: 'GET' }, function (res) {
        res.on('data', function (chunk) {
          expect(chunk.toString('utf8')).to.be.eq('data');
          done();
        });
      }).end();
    });

    it('should send a post request to the target', function (done) {
      var data = JSON.stringify({ msg: 'Hello World!' }),
        options = {
          hostname: '127.0.0.1',
          port: 3000,
          path: '/upload',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
          }
        },

        req = http.request(options, function (res) {
          expect(res.statusCode).to.be.eq(201);

          res.on('data', function (chunk) {
            expect(chunk.toString('utf8')).to.be.eq('data');
            done();
          });
        });

      req.write(data);
      req.end();
    });
  });
});
