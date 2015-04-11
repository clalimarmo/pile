define(function(require) {
  var Callbacks = require('callbacks');

  var Ideas = function() {
    var instance = {};
    var ideas = {};
    var currentPile;

    var onIdeasChanged = Callbacks();
    var onPilesChanged = Callbacks();
    var onCurrentPileChanged = Callbacks();

    var init = function() {
      instance.usePile(undefined);
    };

    instance.record = function(idea) {
      ideas[currentPile].unshift(idea);
      onIdeasChanged.execute();
    };

    instance.in = function(pile) {
      return ideas[pile];
    };

    instance.usePile = function(pile) {
      if (!(ideas[pile] instanceof Array)) {
        ideas[pile] = [];
        onPilesChanged.execute();
      }
      currentPile = pile;
      onCurrentPileChanged.execute();
    };

    instance.pileNames = function() {
      return [
        'chickens',
        'sassafras',
        'marmalade',
        'X gundorb',
        'speed metal',
        'gods',
        'television',
        'drama',
        'relationship advice',
        'colon',
        'cereal',
        'extremism',
        'nazis',
        'zombies',
        'guitar string',
        'metal',
        'canada',
        'norway',
        'scenesters',
        'gatorang',
        'marmalade',
        'hox',
        undefined
      ];
    };

    instance.inCurrentPile = function() {
      return ideas[currentPile];
    };

    instance.onIdeasChanged = onIdeasChanged.register;
    instance.onPilesChanged = onPilesChanged.register;
    instance.onCurrentPileChanged = onCurrentPileChanged.register;

    init();
    return instance;
  };
  return Ideas;
});
