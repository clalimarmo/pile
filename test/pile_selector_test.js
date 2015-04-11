define(function(require) {
  var $ = require('jquery');
  var Callbacks = require('callbacks');
  var PileSelectorView = require('pile_selector_view');

  describe('PileSelectorView', function() {
    var mocks;

    beforeEach(function() {
      mocks = {};

      mocks.element = $('<div>');
      mocks.piles = ['chickens', undefined];
      mocks.onPilesChanged = Callbacks();
      mocks.ideas = {
        pileNames: function() { return mocks.piles; },
        onPilesChanged: mocks.onPilesChanged.register,
      };

      PileSelectorView({
        element: mocks.element,
        ideas: mocks.ideas,
      });
    });

    it('lists initial piles', function() {
      expect(mocks.element.text()).to.include('chickens');
      expect(mocks.element.text()).to.include('Misc');
    });

    it('updates list of piles', function() {
      mocks.piles = ['latest thoughts', undefined, 'chickens'];
      mocks.onPilesChanged.execute();
      expect(mocks.element.text()).to.include('latest thoughts');
      expect(mocks.element.text()).to.include('chickens');
      expect(mocks.element.text()).to.include('Misc');
    });
  });
});
