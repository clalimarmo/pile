define(function(require) {
  var $ = require('jquery');
  var normalizeElement = require('normalize_element');
  var Callbacks = require('callbacks');
  var React = require('react');
  var TestUtils = React.addons.TestUtils;
  var Simulate = TestUtils.Simulate;
  var PileSelectorView = require('pile_selector_view');

  describe('PileSelectorView', function() {
    var mocks;

    beforeEach(function() {
      mocks = {};

      mocks.element = $('<div>');
      mocks.piles = ['chickens', 'lords', 'logs', 'rinkydink', 'Misc'];
      mocks.onPilesChanged = Callbacks();
      mocks.onCurrentPileChanged = Callbacks();
      mocks.ideas = {
        pileNames: function() { return mocks.piles; },
        onPilesChanged: mocks.onPilesChanged.register,
        onCurrentPileChanged: mocks.onCurrentPileChanged.register,
        currentPile: function() { return 'chickens'; },
        usePile: function(pileName) {
          mocks.chosenPile = pileName;
        },
      };
      mocks.chosenPile = 'chosen pile';
      mocks.pileCreator = {
        summon: function() { mocks.pileCreator.summoned = true; },
        summonToCreate: function(pile) { mocks.pileCreator.summonedToCreate = pile; },
      };

      PileSelectorView({
        element: mocks.element,
        ideas: mocks.ideas,
        pileCreator: mocks.pileCreator,
      });
    });

    it('lists initial piles', function() {
      expect(mocks.element.text()).to.include('chickens');
      expect(mocks.element.text()).to.include('Misc');
    });

    it('updates list of piles', function() {
      mocks.piles = ['latest thoughts', 'Misc', 'chickens'];
      mocks.onPilesChanged.execute();
      expect(mocks.element.text()).to.include('latest thoughts');
      expect(mocks.element.text()).to.include('chickens');
      expect(mocks.element.text()).to.include('Misc');
    });

    it('chooses piles', function() {
      var chickenPile = normalizeElement(mocks.element.find('li:contains(chickens)'));
      Simulate.click(chickenPile);
      expect(mocks.chosenPile).to.eq('chickens');
    });

    it('distinguishes the initial current pile', function() {
      expect(mocks.element.find('.current-pile').text()).to.eq('chickens');
    });

    it('distinguishes the current pile when it changes', function() {
      mocks.ideas.currentPile = function() { return 'lords'; };
      mocks.onCurrentPileChanged.execute();

      expect(mocks.element.find('.current-pile').length).to.be.above(0);
      expect(mocks.element.find('.current-pile').text()).to.eq('lords');
    });

    it('summons its pile creator', function() {
      mocks.pileCreator.summoned = 'summoned?';
      var summoner = normalizeElement(mocks.element.find('.add-pile'));
      Simulate.click(summoner);
      expect(mocks.pileCreator.summoned).to.be.true;
    });

    describe('pile filtering', function() {
      var filter;
      beforeEach(function() {
        filter = normalizeElement(mocks.element.find('.filter'));
        Simulate.change(filter, {target: {value: 'rink'}});
      });

      it('filters piles', function() {
        expect(mocks.element.find('.pile').length).to.eq(1);
        expect(mocks.element.find('.pile').text()).to.include('rinkydink');
      });

      it('includes a placeholder when no other piles than the current match', function() {
        Simulate.change(filter, {target: {value: 'chickens'}});
        expect(mocks.element.text()).to.include('No other');
        expect(mocks.element.find('.placeholder.pile').length).to.eq(1);
      });

      it('always shows the current pile', function() {
        Simulate.change(filter, {target: {value: 'lor'}});
        expect(mocks.element.find('.pile').length).to.eq(1);
        expect(mocks.element.find('.pile').text()).to.include('lords');
        expect(mocks.element.find('.current-pile').text()).to.include('chickens');
      });

      it('distinguishes matching substrings', function() {
        var matchingPile = $(mocks.element.find('.pile:contains(rinkydink)'));
        var filterMatches = matchingPile.find('.match');
        expect(filterMatches.length).to.eq(1);
        expect(filterMatches.text()).to.eq('rink');
      });

      describe('querying and pressing enter', function() {
        it('selects the only match', function() {
          Simulate.change(filter, {target: {value: 'lor'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(mocks.chosenPile).to.eq('lords');
        });

        it('selects the first match of several', function() {
          Simulate.change(filter, {target: {value: 'lo'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(mocks.chosenPile).to.eq('lords');
        });

        it('summons the pile creator when no matches', function() {
          mocks.pileCreator.summonedToCreate = 'pile creator was summoned to create...';
          Simulate.change(filter, {target: {value: 'zoro'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(mocks.pileCreator.summonedToCreate).to.eq('zoro');
        });

        it('clears the filter field', function() {
          Simulate.change(filter, {target: {value: 'zoro'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(filter.value).to.eq('');
        });
      });
    });
  });
});
