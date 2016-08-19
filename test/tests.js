console.log('Running Tests');
var testfunc = require('../server.js').testfunc;
var mulFunc = require('../server.js').mulFunc;

//import {testfunc} from '../server.js';
console.log(testfunc('zddig'));
console.log(mulFunc(8,8));
var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
assert.equal(90, mulFunc(9,10));

describe('multiply function', it('should return 90', function(done) { assert.equal(90, mulFunc(9,10)); done(); }));
//var chai =require('chai');
//chai.expect(mulFunc(9,10)).to.equal(90);
