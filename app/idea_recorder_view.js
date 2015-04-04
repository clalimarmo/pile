define(function(require) {
  var ensure = require('ensure');

  var ENTER_KEYCODE = 13;

  var template = function() {
    return ''+
      '<input type="text">'+
    '';
  };

  var IdeaRecorderView = function(deps) {
    ensure(['element', 'ideas'], deps);

    var instance = {};

    var init = function() {
      render();

      deps.element.on('keydown', 'input', saveIfEnter);
    };

    var render = function() {
      deps.element.html(template());
    };

    var saveIfEnter = function(event) {
      var idea = event.target.value;
      if (event.which === ENTER_KEYCODE) {
        deps.ideas.record(idea);
        event.target.value = '';
      }
    };

    init();
    return instance;
  };
  return IdeaRecorderView;
});
