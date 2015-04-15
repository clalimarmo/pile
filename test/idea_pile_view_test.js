define(function(require) {
  var $ = require('jquery');
  var normalizeElement = require('normalize_element');
  var IdeaPileView = require('idea_pile_view');
  var Callbacks = require('callbacks');
  var React = require('react');
  var TestUtils = React.addons.TestUtils;
  var Simulate = TestUtils.Simulate;

  describe('IdeaPileView', function() {
    var mocks;

    beforeEach(function() {
      mocks = {};
      mocks.element = $('<div>');
      mocks.onIdeasChanged = Callbacks();
      mocks.onCurrentPileChanged = Callbacks();
      mocks.ideas = {
        inCurrentPile: function() { return []; },
        onIdeasChanged: mocks.onIdeasChanged.register,
        onCurrentPileChanged: mocks.onCurrentPileChanged.register,
        reorderIdea: function(subject, target) {
          mocks.ideas.reorderIdea.calledWith = {
            subject: subject,
            target: target,
          };
        }
      };

      IdeaPileView({
        element: mocks.element,
        ideas: mocks.ideas,
      });
    });

    it('shows a pile of ideas', function() {
      mocks.ideas.inCurrentPile = function() {
        return [
          'money is evil',
          'I need to pay the rent',
        ];
      };
      mocks.onIdeasChanged.execute();
      expect(mocks.element.text()).to.include('money is evil');
      expect(mocks.element.text()).to.include('I need to pay the rent');
    });

    it('shows other piles of ideas', function() {
      mocks.ideas.inCurrentPile = function() {
        return [
          'party jams',
          'DJ crank0re',
        ];
      };
      mocks.onCurrentPileChanged.execute();
      expect(mocks.element.text()).to.include('party jams');
      expect(mocks.element.text()).to.include('DJ crank0re');
    });

    describe('clicking and dragging ideas', function() {
      beforeEach(function() {
        mocks.ideas.inCurrentPile = function() {
          return [
            'cacodemons are in season',
            'space was the final frontier',
          ];
        };
        mocks.onCurrentPileChanged.execute();
      });

      it('reorders ideas', function() {
        var cacodemonsIdea = mocks.element.find('.idea:contains(cacodemons)');
        var spaceIdea = mocks.element.find('.idea:contains(space)');

        expect(cacodemonsIdea.length).to.eq(1);
        expect(spaceIdea.length).to.eq(1);

        Simulate.dragStart(normalizeElement(cacodemonsIdea));
        Simulate.drop(normalizeElement(spaceIdea));

        expect(mocks.ideas.reorderIdea.calledWith.subject).to.eq(0);
        expect(mocks.ideas.reorderIdea.calledWith.target).to.eq(1);
      });
    });
  });
});
