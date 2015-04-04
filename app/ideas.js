define(function(require) {
  var Callbacks = require('callbacks');

  var Ideas = function() {
    var instance = {};
    var ideas = [];

    var onChangeCallbacks = Callbacks();

    instance.record = function(idea) {
      ideas.push(idea);
      onChangeCallbacks.execute();
    };

    instance.all = function() {
      return ideas;
    };

    instance.onChange = onChangeCallbacks.register;

    return instance;
  };
  return Ideas;
});
