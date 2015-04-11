define(function(require) {
  var $ = require('jquery');
  var IdeaPileView = require('idea_pile_view');
  var Callbacks = require('callbacks');

  describe('IdeaPileView', function() {
    var mocks;

    beforeEach(function() {
      mocks = {};
      mocks.element = $('<div>');
      mocks.onChangeCallbacks = Callbacks();
      mocks.ideas = {
        all: function() { return []; },
        onIdeasChanged: mocks.onChangeCallbacks.register,
      };

      IdeaPileView({
        element: mocks.element,
        ideas: mocks.ideas,
      });
    });

    it('shows a pile of ideas', function() {
      mocks.ideas.all = function() {
        return [
          'money is evil',
          'I need to pay the rent',
        ];
      };
      mocks.onChangeCallbacks.execute();
      expect(mocks.element.text()).to.include('money is evil');
      expect(mocks.element.text()).to.include('I need to pay the rent');
    });
  });
});
