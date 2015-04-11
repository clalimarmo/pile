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

      expect(ideas.in()).to.deep.eq([
        'Rice makes me full, very fast',
        'I need to eat more',
      ]);
    });

    it('registers callbacks for when ideas are recorded', function() {
      var callbackCalled = 'callback called?';
      ideas.onIdeasChanged(function() {
        callbackCalled = true;
      });
      ideas.record('something');
      expect(callbackCalled).to.be.true;
    });

    it('selects piles for recording ideas', function() {
      ideas.usePile('chicken');
      ideas.record('bird food');
      ideas.record('poop');
      expect(ideas.in('chicken')).to.deep.eq([
        'poop',
        'bird food',
      ]);
      expect(ideas.inCurrentPile()).to.deep.eq(ideas.in('chicken'));
    });

    it('registers callbacks for when the current pile changes', function() {
      var callbackCalled = 'callback called?';
      ideas.onCurrentPileChanged(function() {
        callbackCalled = true;
      });
      ideas.usePile('something else');
      expect(callbackCalled).to.be.true;
    });

    it('registers callbacks for when the piles change', function() {
      var callbackCalled = 'callback called?';
      ideas.onPilesChanged(function() {
        callbackCalled = true;
      });
      ideas.usePile('something new');
      expect(callbackCalled).to.be.true;
    });

    it('returns a list of piles', function() {
      expect(ideas.pileNames()).to.not.be.empty;
      //todo
    });

    it('registers callbacks for when piles are changed', function() {
      ideas.onPilesChanged(function() {
      });
      //todo
    });
  });
});
