define(function(require) {
  var $ = require('jquery');
  var IdeaPileView = require('idea_pile_view');
  var Callbacks = require('callbacks');

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
  });
});
