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
  var PileCreatorView = require('pile_creator_view');
  var Ideas = require('ideas');

  var ideas = Ideas();

  $(function() {
    IdeaRecorderView({
      element: $('#idea-recorder'),
      ideas: ideas,
    });
    var pileCreatorView = PileCreatorView({
      element: $('#pile-creator'),
      ideas: ideas,
    });
    PileSelectorView({
      element: $('#pile-selector'),
      ideas: ideas,
      pileCreator: pileCreatorView,
    });
    IdeaPileView({
      element: $('#idea-pile'),
      ideas: ideas,
    });
  });
});
