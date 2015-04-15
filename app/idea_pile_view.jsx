define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var IdeaPileView = function(deps) {
    ensure(['element', 'ideas'], deps);

    var reactElement;

    var init = function() {
      var container = normalizeElement(deps.element);
      var componentProps = {
        ideas: deps.ideas,
      };

      reactElement = React.render(
        React.createElement(Component, componentProps),
        container
      );

      updateIdeas();
      deps.ideas.onIdeasChanged(updateIdeas);
      deps.ideas.onCurrentPileChanged(updateIdeas);
    };

    function updateIdeas() {
      reactElement.setState({ideas: deps.ideas.inCurrentPile()});
    }

    init();
  };

  var Component = React.createClass({
    render: function() {
      var component = this;
      var ideas = [];

      if (this.state && this.state.ideas) {
        this.state.ideas.forEach(function(idea, index) {
          ideas.push(
            <div
              key={idea + index}
              data-index={index}
              className="idea"
              draggable="true"
              onDragStart={beginReordering}
              onDragOver={previewReordering}
              onDrop={completeReordering}
              onDragEnd={clearReordering}
              >
              {idea}
            </div>
          );
        });
      }

      return (
        <div>
          {ideas}
        </div>
      );

      function beginReordering(event) {
        var subject = parseInt(event.target.attributes['data-index'].value);
        component.setState({reordering: subject});
      }

      function previewReordering(event) {
        event.preventDefault();

        var target = parseInt(event.target.attributes['data-index'].value);
        if (isCurrentlyReordering()) {
          component.setState({reorderTarget: target});
        }
      }

      function completeReordering(event) {
        event.preventDefault();

        var target = parseInt(event.target.attributes['data-index'].value);
        if (isCurrentlyReordering()) {
          var subject = component.state.reordering;
          component.props.ideas.reorderIdea(subject, target);
          clearReordering();
        }
      }

      function clearReordering(event) {
        component.setState({reordering: null});
      }

      function isCurrentlyReordering() {
        return typeof component.state.reordering === 'number';
      }
    },
  });

  return IdeaPileView;
});
