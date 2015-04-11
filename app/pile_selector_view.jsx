define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var component = React.createClass({
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
                <li key={undefined}>Misc</li>
              );
            } else {
              piles.push(
                <li key={pile}>{pile}</li>
              );
            }
          });
        }
        return piles;
      }
    },
  });

  var PileSelectorView = function(deps) {
    ensure(['element', 'ideas'], deps);

    var reactElement;

    var init = function() {
      var container = normalizeElement(deps.element);

      reactElement = React.render(
        React.createElement(component, {ideas: deps.ideas}),
        container
      );

      updatePiles();
      deps.ideas.onPilesChanged(updatePiles);
    };

    var updatePiles = function() {
      reactElement.setState({piles: deps.ideas.pileNames()});
    };

    init();
  };
  return PileSelectorView;
});
