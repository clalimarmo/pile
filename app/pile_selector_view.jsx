define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var MISC_KEY = 'misc-undefined-3y8241903740139287491207843912078349012374';
  var MISC_TEXT = 'Misc';

  var PileSelectorView = function(deps) {
    ensure(['element', 'ideas', 'pileCreator'], deps);

    var reactElement;

    function init() {
      var container = normalizeElement(deps.element);
      var componentProps = {
        ideas: deps.ideas,
        choosePile: choosePileHandler,
        addPile: deps.pileCreator.summon,
      };
      reactElement = React.render(
        React.createElement(Component, componentProps),
        container
      );

      updatePiles();
      deps.ideas.onPilesChanged(updatePiles);

      showCurrentPile();
      deps.ideas.onCurrentPileChanged(showCurrentPile);
    };

    function updatePiles() {
      reactElement.setState({piles: deps.ideas.pileNames()});
    };

    function showCurrentPile() {
      reactElement.setState({currentPile: deps.ideas.currentPile()});
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
          <li className="add-pile" onClick={this.props.addPile}>Add Pile</li>
          {renderPiles()}
        </ul>
      );

      function renderPiles() {
        var piles = [];
        if (component.state && component.state.piles) {
          component.state.piles.forEach(function(pile) {
            piles.push(renderPile(pile));
          });
        }
        return piles;
      }

      function renderPile(pile) {
        var classes = React.addons.classSet({
          'pile': true,
          'current-pile': component.state.currentPile === pile,
        });
        return(
          <li key={pile} onClick={component.props.choosePile(pile)} className={classes}>
            {pile}
          </li>
        );
      }
    },
  });

  return PileSelectorView;
});
