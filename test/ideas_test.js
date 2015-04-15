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

      expect(ideas.inCurrentPile()).to.deep.eq([
        'Rice makes me full, very fast',
        'I need to eat more',
      ]);
      expect(ideas.currentPile()).to.eq('Misc');
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
      expect(ideas.currentPile()).to.eq('chicken');
    });

    describe('reordering ideas', function() {
      beforeEach(function() {
        ideas.record('third');
        ideas.record('first');
        ideas.record('second');
      });

      it('moves ideas "up"', function() {
        ideas.reorderIdea(1, 0);
        expect(ideas.inCurrentPile()).to.deep.eq([
          'first',
          'second',
          'third'
        ]);
      });

      it('moves ideas "down"', function() {
        ideas.reorderIdea(0, 1);
        expect(ideas.inCurrentPile()).to.deep.eq([
          'first',
          'second',
          'third'
        ]);
      });
    });

    it('registers callbacks for when a pile is selected', function() {
      var callbackCalled = 'callback called?';
      ideas.onCurrentPileChanged(function() {
        callbackCalled = true;
      });
      ideas.usePile('something else');
      expect(callbackCalled).to.be.true;
    });

    it('adds piles', function() {
      ideas.addPile('hot trends');
      expect(ideas.pileNames()).to.include('hot trends');
    });

    describe('onPileAdded callbacks', function() {
      var callbackCalled;

      beforeEach(function() {
        callbackCalled = 'callback called?';
        ideas.onPileAdded(function() {
          callbackCalled = true;
        });
      });

      it('execute when a new pile is used', function() {
        ideas.usePile('something new');
        expect(callbackCalled).to.be.true;
      });

      it('execute when a new pile is added', function() {
        ideas.addPile('something new');
        expect(callbackCalled).to.be.true;
      });
    });

    describe('onIdeasChanged callbacks', function() {
      var callbackCalled = 'callback called?';

      beforeEach(function() {
        ideas.record('something');
        ideas.record('something else');
        callbackCalled = 'callback called?';
        ideas.onIdeasChanged(function() {
          callbackCalled = true;
        });
      });

      it('execute when ideas are recorded', function() {
        ideas.record('something');
        expect(callbackCalled).to.be.true;
      });

      it('execute when ideas are reordered', function() {
        ideas.reorderIdea(0, 1);
        expect(callbackCalled).to.be.true;
      });
    });

    describe('onPilesChanged callbacks', function() {
      var callbackCalled;

      beforeEach(function() {
        callbackCalled = 'callback called?';
        ideas.onPilesChanged(function() {
          callbackCalled = true;
        });
      });

      it('execute when a new pile is used', function() {
        ideas.usePile('something new');
        expect(callbackCalled).to.be.true;
      });

      it('execute when a new pile is added', function() {
        ideas.addPile('something new');
        expect(callbackCalled).to.be.true;
      });
    });

    it('returns a list of piles', function() {
      ideas.addPile('x');
      ideas.addPile('y');
      ideas.addPile('z');

      var pileNames = ideas.pileNames();
      expect(pileNames).to.include('x');
      expect(pileNames).to.include('y');
      expect(pileNames).to.include('z');
      expect(pileNames).to.include('Misc');
    });
  });
});
