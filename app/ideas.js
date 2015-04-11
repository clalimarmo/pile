define(function(require) {
  var Callbacks = require('callbacks');

  var Ideas = function() {
    var instance = {};
    var ideas = {};
    var currentPile;

    var onIdeasChanged = Callbacks();
    var onPileAdded = Callbacks();
    var onPilesChanged = Callbacks();
    var onCurrentPileChanged = Callbacks();

    var init = function() {
      instance.usePile('Misc');
    };

    instance.record = function(idea) {
      ideas[currentPile].unshift(idea);
      onIdeasChanged.execute();
    };

    instance.in = function(pile) {
      return ideas[pile];
    };

    instance.usePile = function(pile) {
      ensurePileExists(pile);
      currentPile = pile;
      onCurrentPileChanged.execute();
    };

    instance.addPile = function(pile) {
      ensurePileExists(pile);
    };

    instance.pileNames = function() {
      return Object.keys(ideas);
    };

    instance.inCurrentPile = function() {
      return ideas[currentPile];
    };

    instance.currentPile = function() {
      return currentPile;
    };

    instance.onIdeasChanged = onIdeasChanged.register;
    instance.onPileAdded = onPileAdded.register;
    instance.onPilesChanged = onPilesChanged.register;
    instance.onCurrentPileChanged = onCurrentPileChanged.register;

    function ensurePileExists(pile) {
      if (typeof pile !== 'string') {
        throw new Error('pile must be string');
      }
      if (!(ideas[pile] instanceof Array)) {
        ideas[pile] = [];
        onPileAdded.execute();
        onPilesChanged.execute();
      }
    }

    init();
    return instance;
  };
  return Ideas;
});
