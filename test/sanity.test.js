const expect = require('chai').expect;
let expected, current;

before(function(){
  expected = ['a', 'b', 'c'];
});

describe('SanityTest:String#split', function(){
  beforeEach(function(){
    current = 'a,b,c'.split(',');
  });
  it('should return an array', function(){
    expect(Array.isArray(current)).to.equal(true);
  });
  it('should return the same array', function(){
    expect(current.length).to.equal(expected.length);
    for (var i=0; i<expected.length; i++) {
      expect(expected[i]).to.equal(current[i]);
    }
  });
});
