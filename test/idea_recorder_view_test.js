define(function(require) {
  var $ = require('jquery');
  var React = require('react');
  var TestUtils = React.addons.TestUtils;
  var Simulate = TestUtils.Simulate;
  var IdeaRecorderView = require('idea_recorder_view');

  describe('IdeaRecorderView', function() {
    var mocks;
    var input;

    beforeEach(function() {
      mocks = {};

      mocks.element = $('<div>');

      mocks.recordedIdeas = [];
      mocks.ideas = {
        record: function(idea) {
          mocks.recordedIdeas.push(idea);
        },
      };

      IdeaRecorderView({
        element: mocks.element,
        ideas: mocks.ideas
      });

      input = mocks.element.find('input').get(0);
    });

    it('records ideas', function() {
      input.value = 'blue whales are the biggest';
      Simulate.keyDown(input, {key: 'Enter'});
      expect(mocks.recordedIdeas).to.include('blue whales are the biggest');
    });

    it('resets when an idea is recorded', function() {
      input.value = 'blue whales are the biggest';
      Simulate.keyDown(input, {key: 'Enter'});
      expect(input.value).to.be.empty;
    });
  });
});
