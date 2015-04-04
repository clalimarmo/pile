define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var component = React.createClass({
    render: function() {
      var ideas = [];
      if (this.state && this.state.ideas) {
        this.state.ideas.forEach(function(idea) {
          ideas.push(<div>{idea}</div>);
        });
      }

      return (
        <div>
          {ideas}
        </div>
      );
    },
  });

  var IdeaPileView = function(deps) {
    ensure(['element', 'ideas'], deps);

    var reactElement;

    var init = function() {
      var container = normalizeElement(deps.element);

      reactElement = React.render(
        React.createElement(component, { ideas: deps.ideas }),
        container
      );

      updateIdeas();
      deps.ideas.onChange(updateIdeas);
    };

    var updateIdeas = function() {
      reactElement.setState({ideas: deps.ideas.all()});
    };

    init();
  };
  return IdeaPileView;
});

