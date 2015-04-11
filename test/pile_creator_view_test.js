define(function(require) {
  var $ = require('jquery');
  var normalizeElement = require('normalize_element');
  var React = require('react');
  var Callbacks = require('callbacks');
  var TestUtils = React.addons.TestUtils;
  var Simulate = TestUtils.Simulate;
  var PileCreatorView = require('pile_creator_view');

  describe('PileCreatorView', function() {
    var mocks;
    var pileCreatorView;
    var input;

    beforeEach(function() {
      mocks = {};
      mocks.element = $('<div>');
      mocks.onPileAdded = Callbacks();
      mocks.ideas = {
        addPile: function() {},
        onPileAdded: mocks.onPileAdded.register,
      };

      pileCreatorView = PileCreatorView({
        element: mocks.element,
        ideas: mocks.ideas
      });
      input = normalizeElement(mocks.element.find('input'));
    });

    it('appears when summoned', function() {
      pileCreatorView.summon();
      expect(mocks.element.hasClass('summoned')).to.be.true;
    });

    it('disappears when programatically dismissed', function() {
      mocks.element.addClass('summoned');
      pileCreatorView.dismiss();
      expect(mocks.element.hasClass('summoned')).to.be.false;
    });

    it('disappears when dismissed by the user', function() {
      mocks.element.addClass('summoned');
      var dismissor = normalizeElement(mocks.element.find('.dismiss'));
      Simulate.click(dismissor);
      expect(mocks.element.hasClass('summoned')).to.be.false;
    });

    it('adds piles', function() {
      var addedPile = 'added element';
      mocks.ideas.addPile = function(pile) {
        addedPile = pile;
      };

      input.value = 'liverwurst';
      Simulate.keyDown(input, {key: 'Enter'});
      expect(addedPile).to.eq('liverwurst');
    });

    it('resets when a pile is added', function() {
      input.value = 'butter';
      mocks.onPileAdded.execute();
      expect(input.value).to.be.empty;
    });

    it('disappears after the pile is added', function() {
      mocks.element.addClass('summoned');
      mocks.onPileAdded.execute();
      expect(mocks.element.hasClass('summoned')).to.be.false;
    });
  });
});
