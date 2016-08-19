console.log('Running Tests');
var testfunc = require('../server.js').testfunc;
var mulFunc = require('../server.js').mulFunc;

//import {testfunc} from '../server.js';
console.log(testfunc('zddig'));
var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('multiply function', it('should return 90', function() { assert.equal(90, mulFunc(9,10)); }));
//process.exit();
