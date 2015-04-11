requirejs.config({
  paths: {
    'jquery': 'lib/jquery/dist/jquery',
    'react': 'lib/react/react-with-addons'
  },
});

define(function(require) {
  var $ = require('jquery');
  var IdeaRecorderView = require('idea_recorder_view');
  var IdeaPileView = require('idea_pile_view');
  var PileSelectorView = require('pile_selector_view');
  var Ideas = require('ideas');

  var ideas = Ideas();

  $(function() {
    IdeaRecorderView({
      element: $('#idea-recorder'),
      ideas: ideas,
    });
    PileSelectorView({
      element: $('#pile-selector'),
      ideas: ideas,
    });
    IdeaPileView({
      element: $('#idea-pile'),
      ideas: ideas,
    });
  });
});
