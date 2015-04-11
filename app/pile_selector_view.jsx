define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var MISC_KEY = 'misc-undefined-3y8241903740139287491207843912078349012374';

  var PileSelectorView = function(deps) {
    ensure(['element', 'ideas'], deps);

    var reactElement;

    function init() {
      var container = normalizeElement(deps.element);
      var componentProps = {
        ideas: deps.ideas,
        choosePile: choosePileHandler,
      };
      reactElement = React.render(
        React.createElement(Component, componentProps),
        container
      );

      updatePiles();
      deps.ideas.onPilesChanged(updatePiles);
    };

    function updatePiles() {
      reactElement.setState({piles: deps.ideas.pileNames()});
    };

    function choosePileHandler(pile) {
      return function() {
        deps.ideas.usePile(pile);
      };
    };

    init();
  };

  var Component = React.createClass({
    render: function() {
      var component = this;

      return (
        <ul>
          {piles()}
        </ul>
      );

      function piles() {
        var piles = [];
        if (component.state && component.state.piles) {
          component.state.piles.forEach(function(pile) {
            if (pile === undefined) {
              piles.push(
                <li key={MISC_KEY} onClick={component.props.choosePile(undefined)}>Misc</li>
              );
            } else {
              piles.push(
                <li key={pile} onClick={component.props.choosePile(pile)}>{pile}</li>
              );
            }
          });
        }
        return piles;
      }
    },
  });

  return PileSelectorView;
});
