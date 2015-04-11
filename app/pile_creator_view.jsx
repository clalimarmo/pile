define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var PileCreatorView = function(deps) {
    ensure(['element'], deps);

    var instance = {};
    var reactElement;

    function init() {
      var container = normalizeElement(deps.element);

      var componentProps = {
        onKeyDown: createPileIfEnter,
        dismiss: instance.dismiss,
      };
      reactElement = React.render(
        React.createElement(Component, componentProps),
        container
      );

      deps.ideas.onPileAdded(reset);
    }

    instance.summon = function() {
      deps.element.addClass('summoned');
      deps.element.find('input').focus();
    };

    instance.dismiss = function() {
      deps.element.removeClass('summoned');
    };

    function createPileIfEnter(event) {
      var input = event.target;
      var pile = input.value;
      if (event.key === 'Enter') {
        deps.ideas.addPile(pile);
      }
    }

    function reset() {
      reactElement.setState({value: ''});
      instance.dismiss();
    }

    init();
    return instance;
  };

  var Component = React.createClass({
    getInitialState: function() {
      return {
        value: '',
      };
    },
    render: function() {
      return (
        <div className="pile-creator">
          <label>New pile</label>
          <input ref="input" type="text" value={this.state.value} onKeyDown={this.props.onKeyDown} onChange={this.handleChange} />
          <button className="dismiss" onClick={this.props.dismiss}>Cancel</button>
        </div>
      );
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
  });

  return PileCreatorView;
});
