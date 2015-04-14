define(function(require) {
  var ensure = require('ensure');
  var React = require('react');
  var normalizeElement = require('normalize_element');

  var component = React.createClass({
    render: function() {
      return (
        <div className="idea-recorder">
          <input ref="input" type="text" onKeyDown={this.props.onKeyDown} />
        </div>
      );
    },
    focus: function() {
      React.findDOMNode(this.refs.input).focus();
    },
  });

  var IdeaRecorderView = function(deps) {
    ensure(['element', 'ideas'], deps);

    var instance = {};
    var reactElement;

    var init = function() {
      var container = normalizeElement(deps.element);
      reactElement = React.render(
        React.createElement(component, { onKeyDown: saveIfEnter }),
        container
      );
    };

    var saveIfEnter = function(event) {
      var idea = event.target.value;
      if (event.key === 'Enter') {
        deps.ideas.record(idea);
        event.target.value = '';
      }
    };

    instance.focus = function() { reactElement.focus(); };

    init();
    return instance;
  };
  return IdeaRecorderView;
});
