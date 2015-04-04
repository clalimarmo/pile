define(function() {
  var Callbacks = function() {
    var instance = {};
    var callbacks = [];

    instance.register = function(callback) {
      if (callback instanceof Function) {
        callbacks.push(callback);
      }
    };

    instance.execute = function() {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i]();
      }
    };

    return instance;
  };
  return Callbacks;
});
