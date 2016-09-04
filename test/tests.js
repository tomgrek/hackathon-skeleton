console.log('Running Tests');
var server = require('../server/server.js');
var chai = require('chai'), expect = chai.expect, should = chai.should();
var chaiHttp = require('chai-http');

chai.use(chaiHttp);
var Browser = require('zombie');

var DEV_SERVER = 'localhost:3000';
Browser.localhost('localhost', 3000);

// TEST SOME API CALLS
it('should successfully serve something', function(done) {
  chai.request(DEV_SERVER)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
});

it('should return "hello " + whatever is passed in, over http', function(done) {
  chai.request(DEV_SERVER)
      .get('/example_rest_endpoint/best%20developer')
      .end(function(err, res) {
        res.text.should.equal('hello best developer');
        done();
      });
});

// TEST THE FRONT END
describe('Visit home page', function() {
  var browser = new Browser();
  before(function() { return browser.visit('/'); });
  it('should serve a page', function(done) {
    browser.assert.success();
    done();
  });
  it('should load the page with the correct title', function(done) {
    browser.assert.text('title', 'Bootcamp Skeleton');
    done();
  });
});
