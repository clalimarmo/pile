define(function(require) {
  var Callbacks = require('callbacks');

  var Ideas = function() {
    var instance = {};
    var ideas = [];

    var onIdeasChanged = Callbacks();
    var onPilesChanged = Callbacks();

    instance.record = function(idea) {
      ideas.unshift(idea);
      onIdeasChanged.execute();
    };

    instance.all = function() {
      return ideas;
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

    instance.onIdeasChanged = onIdeasChanged.register;
    instance.onPilesChanged = onPilesChanged.register;

    return instance;
  };
  return Ideas;
});
