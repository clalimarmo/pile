define(function(require) {
  var Ideas = require('ideas');

  describe('Ideas', function() {
    var ideas;

    beforeEach(function() {
      ideas = Ideas();
    });

    it('records and retrieves ideas', function() {
      ideas.record('I need to eat more');
      ideas.record('Rice makes me full, very fast');

      expect(ideas.all()).to.deep.eq([
        'I need to eat more',
        'Rice makes me full, very fast',
      ]);
    });

    it('registers callbacks for when ideas are recorded', function() {
      var callbackCalled = 'callback called?';
      ideas.onChange(function() {
        callbackCalled = true;
      });
      ideas.record('something');
      expect(callbackCalled).to.be.true;
    });
  });
});
