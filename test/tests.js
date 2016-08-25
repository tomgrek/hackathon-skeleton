console.log('Running Tests');
var chai = require('chai'), expect = chai.expect, should = chai.should();
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var Browser = require('zombie');

var DEV_SERVER = 'localhost:3000';

Browser.localhost('localhost', 3000);

var testFunc = require('../server.js').testFunc;
var mulFunc = require('../server.js').mulFunc;

// TEST SOME BACK-END FUNCTIONS DIRECTLY
it('should return 9x10 = 90', function() {
  mulFunc(9,10).should.equal(90);
});
it('should return what is passed in', function() {
  testFunc('hello world').should.equal('hello world');
});

// TEST SOME API CALLS
it('should successfully serve something', function(done) {
  chai.request(DEV_SERVER)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
});
it('should return what is passed in plus ZIG, over http', function(done) {
  chai.request(DEV_SERVER)
      .get('/zig2/abcdef')
      .end(function(err, res) {
        res.text.should.equal('abcdefZIG');
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
