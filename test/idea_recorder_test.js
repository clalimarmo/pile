define(function(require) {
  var $ = require('jquery');
  var IdeaRecorderView = require('idea_recorder_view');

  describe('IdeaRecorder', function() {
    var mocks;

    beforeEach(function() {
      mocks = {};

      mocks.element = $('<div>');
      mocks.recordedIdeas = [];
      mocks.ideas = {
        record: function(idea) {
          mocks.recordedIdeas.push(idea);
        },
      };

      mocks.pressEnterEvent = $.Event('keydown');
      mocks.pressEnterEvent.which = 13;

      IdeaRecorderView({
        element: mocks.element,
        ideas: mocks.ideas
      });
    });

    it('records ideas', function() {
      var input = $(mocks.element.find('input'));
      input.val('blue whales are the biggest');
      input.trigger(mocks.pressEnterEvent);
      expect(mocks.recordedIdeas).to.include('blue whales are the biggest');
    });

    it('resets when an idea is recorded', function() {
      var input = $(mocks.element.find('input'));
      input.val('blue whales are the biggest');
      input.trigger(mocks.pressEnterEvent);
      expect(input.val()).to.be.empty;
    });
  });
});
