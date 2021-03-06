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
      mocks.piles = ['Chickens', 'Lords', 'Logs', 'Rinkydink', 'Misc', 'Mississippi'];
      mocks.onPilesChanged = Callbacks();
      mocks.onCurrentPileChanged = Callbacks();
      mocks.ideas = {
        pileNames: function() { return mocks.piles; },
        onPilesChanged: mocks.onPilesChanged.register,
        onCurrentPileChanged: mocks.onCurrentPileChanged.register,
        currentPile: function() { return 'Chickens'; },
        usePile: function(pileName) {
          mocks.chosenPile = pileName;
        },
      };
      mocks.chosenPile = 'chosen pile';

      PileSelectorView({
        element: mocks.element,
        ideas: mocks.ideas,
      });
    });

    it('prompts users to search when there are no other piles than current', function() {
      mocks.piles = ['Chickens'];
      mocks.onPilesChanged.execute();
      expect(mocks.element.find('.prompt').text()).to.include('Search');
    });

    it('lists initial piles', function() {
      expect(mocks.element.text()).to.include('Chickens');
      expect(mocks.element.text()).to.include('Misc');
    });

    it('updates list of piles', function() {
      mocks.piles = ['latest thoughts', 'Misc', 'Chickens'];
      mocks.onPilesChanged.execute();
      expect(mocks.element.text()).to.include('latest thoughts');
      expect(mocks.element.text()).to.include('Chickens');
      expect(mocks.element.text()).to.include('Misc');
    });

    it('chooses piles', function() {
      var chickenPile = normalizeElement(mocks.element.find('li:contains(Lords)'));
      Simulate.click(chickenPile);
      expect(mocks.chosenPile).to.eq('Lords');
    });

    it('distinguishes the initial current pile', function() {
      expect(mocks.element.find('.current-pile').text()).to.eq('Chickens');
    });

    it('distinguishes the current pile when it changes', function() {
      mocks.ideas.currentPile = function() { return 'Lords'; };
      mocks.onCurrentPileChanged.execute();

      expect(mocks.element.find('.current-pile').length).to.be.above(0);
      expect(mocks.element.find('.current-pile').text()).to.eq('Lords');
    });

    describe('pile filtering', function() {
      var filter;
      beforeEach(function() {
        filter = normalizeElement(mocks.element.find('.filter'));
        Simulate.change(filter, {target: {value: 'rink'}});
      });

      it('filters piles', function() {
        expect(mocks.element.find('.pile').length).to.eq(1);
        expect(mocks.element.find('.pile').text()).to.include('Rinkydink');
      });

      it('includes a prompt when no other piles than the current match', function() {
        Simulate.change(filter, {target: {value: 'rumproast'}});
        expect(mocks.element.text()).to.include("Add 'rumproast'");
        expect(mocks.element.find('.prompt').length).to.eq(1);
      });

      it('does not prompt to add the pile if there are filter matches', function() {
        expect(mocks.element.find('.prompt').length).to.eq(0);
        expect(mocks.element.find('.fa').hasClass('fa-plus')).to.be.false;
      });

      it('always shows the current pile', function() {
        Simulate.change(filter, {target: {value: 'lor'}});
        expect(mocks.element.find('.pile').length).to.eq(1);
        expect(mocks.element.find('.pile').text()).to.include('Lords');
        expect(mocks.element.find('.current-pile').text()).to.include('Chickens');
      });

      it('distinguishes matching substrings', function() {
        Simulate.change(filter, {target: {value: 'ss'}});
        var matchingPile = $(mocks.element.find('.pile:contains(Mississippi)'));
        var filterMatches = matchingPile.find('.match');
        expect(filterMatches.length).to.eq(2);
        expect(filterMatches.text()).to.include('ss');
      });

      it('distinguishes matching substrings in the current pile', function() {
        Simulate.change(filter, {target: {value: 'chi'}});
        var currentPile = $(mocks.element.find('.current-pile'));
        var filterMatches = currentPile.find('.match');
        expect(filterMatches.length).to.eq(1);
        expect(filterMatches.text()).to.eq('Chi');
      });

      describe('querying and pressing enter', function() {
        it('selects the only match', function() {
          Simulate.change(filter, {target: {value: 'lor'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(mocks.chosenPile).to.eq('Lords');
        });

        it('selects the first match of several', function() {
          Simulate.change(filter, {target: {value: 'lo'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(mocks.chosenPile).to.eq('Lords');
        });

        it('selects the filter value as the current pile when no matches', function() {
          mocks.chosenPile = 'chosen pile';
          Simulate.change(filter, {target: {value: 'zoro'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(mocks.chosenPile).to.eq('zoro');
        });

        it('clears the filter field', function() {
          Simulate.change(filter, {target: {value: 'zoro'}});
          Simulate.keyDown(filter, {key: 'Enter'});
          expect(filter.value).to.eq('');
        });
      });

      describe('shift key', function() {
        describe('when held down with a matching term', function() {
          beforeEach(function() {
            Simulate.change(filter, {target: {value: 'lo'}});
            Simulate.keyDown(filter, {key: 'Shift'});
          });

          it('tells the user they will directly add the query term, ignoring matches', function() {
            expect(mocks.element.find('.prompt').text()).to.eq("Add 'lo'");
          });

          it('creates the query term when enter is pressed', function() {
            Simulate.keyDown(filter, {key: 'Enter'});
            expect(mocks.chosenPile).to.eq('lo');
          });
        });

        describe('when held down with no filter query', function() {
          beforeEach(function() {
            Simulate.change(filter, {target: {value: ''}});
            Simulate.keyDown(filter, {key: 'Shift'});
          });

          it('does not tell user they will add a pile with no name', function() {
            expect(mocks.element.find('.prompt').text()).to.not.include("Add ''");
          });

          it('does not create the query term when enter is pressed', function() {
            expect(mocks.chosenPile).to.not.eq('lo');
          });
        });

        describe('when pressed and released', function() {
          beforeEach(function() {
            Simulate.change(filter, {target: {value: 'lo'}});
            Simulate.keyDown(filter, {key: 'Shift'});
            Simulate.keyUp(filter, {key: 'Shift'});
          });

          it('filters normally', function() {
            expect(mocks.element.find('.prompt').length).to.eq(0);
          });

          it('selects the first matching pile', function() {
            Simulate.keyDown(filter, {key: 'Enter'});
            expect(mocks.chosenPile).to.eq('Lords');
          });
        });

        describe('when pressed and then the filter loses focus', function() {
          beforeEach(function() {
            Simulate.change(filter, {target: {value: 'lo'}});
            Simulate.keyDown(filter, {key: 'Shift'});
            Simulate.blur(filter);
          });

          it('filters normally', function() {
            expect(mocks.element.find('.prompt').length).to.eq(0);
          });
        });
      });
    });
  });
});
