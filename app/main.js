requirejs.config({
  paths: {
    'jquery': 'lib/jquery/dist/jquery',
    'react': 'lib/react/react'
  },
});

define(function(require) {
  var $ = require('jquery');
  var IdeaRecorderView = require('idea_recorder_view');
  var IdeaPileView = require('idea_pile_view');
  var Ideas = require('ideas');

  var ideas = Ideas();

  $(function() {
    IdeaRecorderView({
      element: $('#idea-recorder'),
      ideas: ideas,
    });
    IdeaPileView({
      element: $('#idea-pile'),
      ideas: ideas,
    });
  });
});
