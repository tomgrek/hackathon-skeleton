console.log('Running Tests');
var chai = require('chai'), expect = chai.expect, should = chai.should();
var testfunc = require('../server.js').testfunc;
var mulFunc = require('../server.js').mulFunc;

/*var assert = require('assert');
describe('multiply function', it('should return 90', function(done) { assert.equal(90, mulFunc(9,10)); done(); }));
*/

it('should return 9x10 = 90', function() {
  mulFunc(9,10).should.equal(90);
});
it('should return what is passed in', function() {
  testfunc('hello world').should.equal('this test deliberately fails');
});
