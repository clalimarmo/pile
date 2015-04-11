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
        createPile: deps.ideas.addPile,
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

    instance.summonToCreate = function(newPile) {
      instance.summon();
      reactElement.setState({value: newPile});
    };

    instance.dismiss = function() {
      deps.element.removeClass('summoned');
    };

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
      var component = this;

      return (
        <div className="pile-creator">
          <label>New pile</label>
          <input ref="input" type="text" value={this.state.value} onKeyDown={handleKeyDown} onChange={handleChange} />
          <button className="dismiss" onClick={this.props.dismiss}>Cancel</button>
        </div>
      );

      function handleChange(event) {
        component.setState({value: event.target.value});
      }

      function handleKeyDown(event) {
        var input = event.target;
        var pile = input.value;
        switch (event.key) {
          case 'Enter':
            component.props.createPile(pile);
            break;
          case 'Escape':
            component.props.dismiss();
            break;
        }
      }
    },
  });

  return PileCreatorView;
});
