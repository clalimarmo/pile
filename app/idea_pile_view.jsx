define(function(require) {
  var ensure = require('ensure');
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

    var normalizeElement = function(e) {
      if (e.get instanceof Function) {
        return deps.element.get(0);
      } else if (deps.element instanceof HTMLElement) {
        return e;
      }

      throw 'element should be jquery result set or HTMLElement';
    };

    var updateIdeas = function() {
      reactElement.setState({ideas: deps.ideas.all()});
    };

    init();
  };
  return IdeaPileView;
});

